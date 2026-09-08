from sqlalchemy.orm import Session
from typing import Dict, Any, List, Optional
from app.models.models import Farmer, AgronomyRule, Recommendation, ConstraintCheck
from app.engine.constraint_checker import check_all_constraints
from app.engine.feasibility_scorer import compute_feasibility_score

def is_crop_match(rule_crop: str, farmer_crop: str) -> bool:
    r_crop = rule_crop.strip().lower()
    f_crop = farmer_crop.strip().lower()
    if r_crop in ("any", "all", "all crops", "*"):
        return True
    if r_crop == f_crop:
        return True
    solanaceous = {"chilli", "chili", "tomato", "brinjal", "eggplant", "capsicum", "pepper"}
    if r_crop in ("solanaceous", "solanaceous vegetables", "vegetables") and f_crop in solanaceous:
        return True
    return False

def is_variety_match(rule_variety: str, farmer_variety: str) -> bool:
    r_var = rule_variety.strip().lower()
    f_var = farmer_variety.strip().lower()
    if r_var in ("any", "all", "all varieties", "*"):
        return True
    if r_var == f_var:
        return True
    return False

def is_growth_stage_match(rule_stage: str, farmer_stage: str) -> bool:
    r_stage = rule_stage.strip().lower()
    f_stage = farmer_stage.strip().lower()

    if r_stage in ("any", "all", "all stages", "*"):
        return True
    if r_stage == f_stage:
        return True

    if "/" in r_stage:
        parts = [p.strip() for p in r_stage.split("/")]
        if f_stage in parts:
            return True

    # Growth stage specific groupings
    stage_groups = {
        "nursery": {"nursery", "sowing", "seedling", "seed treatment"},
        "pre-planting": {"pre-planting", "field preparation", "soil preparation"},
        "transplanting": {"transplanting", "gap filling"},
        "vegetative": {"vegetative", "field establishment", "early vegetative", "vegetative/flowering"},
        "flowering": {"flowering", "budding", "blooming", "vegetative/flowering"},
        "fruiting": {"fruiting", "fruit development", "bulbing"},
        "harvest": {"harvest", "post-harvest"}
    }

    f_group = None
    for g, members in stage_groups.items():
        if f_stage == g or f_stage in members:
            f_group = g
            break

    r_group = None
    for g, members in stage_groups.items():
        if r_stage == g or r_stage in members:
            r_group = g
            break

    if f_group and r_group and f_group == r_group:
        return True

    return False


def generate_recommendation_for_farmer(farmer: Farmer, db: Session, demo_mode: bool = False) -> Dict[str, Any]:
    """
    Core resource-aware recommendation engine flow:
    1. Filter eligible rules (APPROVED, or DEMO if demo_mode=True).
    2. Match crop, variety, growth stage.
    3. Perform constraint checks (Budget, Equipment, Inputs with quantities, Labor, Water, Local conditions).
    4. Compute feasibility score & status.
    5. Primary vs Alternative selection.
    6. High impact / Human confirmation detection.
    """
    # Query eligible rules
    query = db.query(AgronomyRule)
    if not demo_mode:
        query = query.filter(AgronomyRule.status == "APPROVED")
    else:
        query = query.filter(AgronomyRule.status.in_(["APPROVED", "DEMO"]))

    rules = query.all()

    # Match crop, variety, and growth stage
    matched_rules = []
    for r in rules:
        if is_crop_match(r.crop, farmer.crop) and is_growth_stage_match(r.growth_stage, farmer.growth_stage):
            if is_variety_match(r.variety, farmer.variety):
                matched_rules.append(r)

    if not matched_rules:
        return {
            "error": "NO_MATCHING_RULE",
            "message": f"No agronomy rules matched crop '{farmer.crop}' at '{farmer.growth_stage}' stage."
        }

    # Evaluate each matched rule
    evaluated_rules = []
    for rule in matched_rules:
        # Soil requirement check (Failure Case 3: Missing Required Info)
        if "black soil" in rule.condition.lower() and (not farmer.soil_type or farmer.soil_type.strip() == ""):
            evaluated_rules.append({
                "rule": rule,
                "constraints": [],
                "score": 0.0,
                "feasibility_status": "INSUFFICIENT_INFO",
                "is_valid": True,
                "error_msg": "Missing required soil type information."
            })
            continue

        constraints, is_valid, err_msg = check_all_constraints(farmer, rule)
        
        if not is_valid:
            # Failure Case 4: Invalid Local Condition (e.g. Temp = 200°C)
            return {
                "error": "VALIDATION_ERROR",
                "message": err_msg
            }

        score, feasibility_status = compute_feasibility_score(constraints)

        evaluated_rules.append({
            "rule": rule,
            "constraints": constraints,
            "score": score,
            "feasibility_status": feasibility_status,
            "is_valid": True,
            "error_msg": ""
        })

    # Sort evaluated rules by feasibility score descending
    evaluated_rules.sort(key=lambda x: x["score"], reverse=True)

    primary_eval = evaluated_rules[0]
    primary_rule: AgronomyRule = primary_eval["rule"]
    primary_status = primary_eval["feasibility_status"]
    primary_score = primary_eval["score"]

    alternative_eval = None

    # Check if primary is NOT_FEASIBLE -> search for feasible alternative
    if primary_status == "NOT_FEASIBLE" and len(evaluated_rules) > 1:
        for candidate in evaluated_rules[1:]:
            if candidate["feasibility_status"] in ["HIGHLY_FEASIBLE", "PARTIALLY_FEASIBLE"]:
                alternative_eval = candidate
                break

    # Persist Primary Recommendation to DB
    requires_human = primary_rule.is_high_impact
    rec_obj = Recommendation(
        farmer_id=farmer.id,
        rule_id=primary_rule.rule_id,
        rule_version=primary_rule.version,
        rule_status=primary_rule.status,
        recommendation_text=primary_rule.recommendation,
        estimated_cost=primary_rule.estimated_cost,
        feasibility_status=primary_status,
        feasibility_score=primary_score,
        is_alternative=False,
        primary_rule_id=None,
        requires_human_confirmation=requires_human,
        human_confirmation_status="PENDING" if requires_human else "NOT_REQUIRED"
    )
    db.add(rec_obj)
    db.commit()
    db.refresh(rec_obj)

    # Persist Constraints for Primary
    for cres in primary_eval["constraints"]:
        c_obj = ConstraintCheck(
            recommendation_id=rec_obj.id,
            constraint_name=cres.constraint_name,
            required_val=cres.required_val,
            available_val=cres.available_val,
            status=cres.status,
            details=cres.details
        )
        db.add(c_obj)
    db.commit()

    alt_data = None
    if alternative_eval:
        alt_rule: AgronomyRule = alternative_eval["rule"]
        alt_rec_obj = Recommendation(
            farmer_id=farmer.id,
            rule_id=alt_rule.rule_id,
            rule_version=alt_rule.version,
            rule_status=alt_rule.status,
            recommendation_text=alt_rule.recommendation,
            estimated_cost=alt_rule.estimated_cost,
            feasibility_status=alternative_eval["feasibility_status"],
            feasibility_score=alternative_eval["score"],
            is_alternative=True,
            primary_rule_id=primary_rule.rule_id,
            requires_human_confirmation=alt_rule.is_high_impact,
            human_confirmation_status="PENDING" if alt_rule.is_high_impact else "NOT_REQUIRED"
        )
        db.add(alt_rec_obj)
        db.commit()
        db.refresh(alt_rec_obj)

        for cres in alternative_eval["constraints"]:
            db.add(ConstraintCheck(
                recommendation_id=alt_rec_obj.id,
                constraint_name=cres.constraint_name,
                required_val=cres.required_val,
                available_val=cres.available_val,
                status=cres.status,
                details=cres.details
            ))
        db.commit()

        alt_data = {
            "id": alt_rec_obj.id,
            "rule_id": alt_rule.rule_id,
            "rule_version": alt_rule.version,
            "rule_status": alt_rule.status,
            "recommendation_text": alt_rule.recommendation,
            "estimated_cost": alt_rule.estimated_cost,
            "feasibility_status": alternative_eval["feasibility_status"],
            "feasibility_score": alternative_eval["score"],
            "evidence_source": alt_rule.evidence_source,
            "evidence_reference": alt_rule.evidence_reference,
            "constraints": [c.to_dict() for c in alternative_eval["constraints"]]
        }

    return {
        "id": rec_obj.id,
        "farmer_id": farmer.id,
        "rule_id": primary_rule.rule_id,
        "rule_version": primary_rule.version,
        "rule_status": primary_rule.status,
        "recommendation_text": primary_rule.recommendation,
        "estimated_cost": primary_rule.estimated_cost,
        "feasibility_status": primary_status,
        "feasibility_score": primary_score,
        "requires_human_confirmation": requires_human,
        "human_confirmation_status": rec_obj.human_confirmation_status,
        "evidence_source": primary_rule.evidence_source,
        "evidence_reference": primary_rule.evidence_reference,
        "constraints": [c.to_dict() for c in primary_eval["constraints"]],
        "alternative_recommendation": alt_data,
        "demo_mode": demo_mode
    }
