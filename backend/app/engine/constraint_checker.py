import json
from typing import Dict, Any, List, Tuple
from app.models.models import Farmer, AgronomyRule

class ConstraintResult:
    def __init__(self, constraint_name: str, required_val: str, available_val: str, status: str, details: str = ""):
        self.constraint_name = constraint_name
        self.required_val = required_val
        self.available_val = available_val
        self.status = status  # PASS, FAIL, PARTIAL
        self.details = details

    def to_dict(self):
        return {
            "constraint_name": self.constraint_name,
            "required_val": self.required_val,
            "available_val": self.available_val,
            "status": self.status,
            "details": self.details
        }


def check_all_constraints(farmer: Farmer, rule: AgronomyRule) -> Tuple[List[ConstraintResult], bool, str]:
    """
    Evaluates farmer's resources and conditions against an agronomy rule.
    Returns: (list of ConstraintResults, is_valid_local_data, local_error_msg)
    """
    results: List[ConstraintResult] = []

    # 1. Local Data Validation & Condition Compatibility
    # Data Validation Step:
    if farmer.temperature is not None and (farmer.temperature < -10.0 or farmer.temperature > 60.0):
        return [], False, f"Temperature {farmer.temperature}°C is out of valid range (-10°C to 60°C)."
    if farmer.rainfall is not None and farmer.rainfall < 0:
        return [], False, f"Rainfall {farmer.rainfall}mm cannot be negative."
    if farmer.humidity is not None and (farmer.humidity < 0.0 or farmer.humidity > 100.0):
        return [], False, f"Humidity {farmer.humidity}% must be between 0 and 100%."

    # Compatibility Step:
    local_status = "PASS"
    local_details = "Local climate conditions are suitable."
    if rule.min_water == "Adequate" and farmer.water_availability == "Limited":
        local_status = "PARTIAL"
        local_details = "Rule recommends adequate water, but farmer has limited water."
    elif rule.min_water == "Adequate" and farmer.water_availability in ["Rainfed", "Unavailable"]:
        local_status = "FAIL"
        local_details = f"Rule requires adequate water, but farmer has {farmer.water_availability} water."

    results.append(ConstraintResult(
        constraint_name="Local Conditions & Water Compatibility",
        required_val=f"Water: {rule.min_water}",
        available_val=f"Water: {farmer.water_availability} ({farmer.water_source})",
        status=local_status,
        details=local_details
    ))

    # 2. Budget Check
    budget_req = f"₹{rule.estimated_cost:,.0f}"
    budget_avail = f"₹{farmer.budget:,.0f}"
    if farmer.budget >= rule.estimated_cost:
        b_status = "PASS"
        b_details = "Available budget covers estimated action cost."
    elif farmer.budget >= (rule.estimated_cost * 0.5):
        b_status = "PARTIAL"
        b_details = f"Available budget ₹{farmer.budget:,.0f} is lower than estimated cost ₹{rule.estimated_cost:,.0f}."
    else:
        b_status = "FAIL"
        b_details = f"Insufficient budget! Required: ₹{rule.estimated_cost:,.0f}, Available: ₹{farmer.budget:,.0f}."

    results.append(ConstraintResult(
        constraint_name="Budget",
        required_val=budget_req,
        available_val=budget_avail,
        status=b_status,
        details=b_details
    ))

    # 3. Equipment Check
    try:
        required_equip: List[str] = json.loads(rule.required_equipment)
    except Exception:
        required_equip = []

    farmer_equip = [eq.equipment_name for eq in farmer.equipment]
    missing_equip = [eq for eq in required_equip if eq not in farmer_equip]

    if not required_equip:
        eq_status = "PASS"
        eq_details = "No specific equipment required."
    elif not missing_equip:
        eq_status = "PASS"
        eq_details = "All required equipment available."
    elif len(missing_equip) < len(required_equip):
        eq_status = "PARTIAL"
        eq_details = f"Missing some equipment: {', '.join(missing_equip)}"
    else:
        eq_status = "FAIL"
        eq_details = f"Required equipment missing: {', '.join(missing_equip)}"

    results.append(ConstraintResult(
        constraint_name="Equipment",
        required_val=", ".join(required_equip) if required_equip else "None",
        available_val=", ".join(farmer_equip) if farmer_equip else "None",
        status=eq_status,
        details=eq_details
    ))

    # 4. Inputs & Quantities Check
    try:
        required_inputs: List[Dict[str, Any]] = json.loads(rule.required_inputs)
    except Exception:
        required_inputs = []

    farmer_inputs_dict = {inp.input_name.lower(): (inp.quantity, inp.unit) for inp in farmer.inputs}
    
    missing_inputs = []
    insufficient_inputs = []
    satisfied_inputs = []

    for req_inp in required_inputs:
        iname = req_inp.get("input_name", "").lower()
        r_qty = float(req_inp.get("quantity", 0.0))
        r_unit = req_inp.get("unit", "kg")

        if iname in farmer_inputs_dict:
            avail_qty, avail_unit = farmer_inputs_dict[iname]
            if avail_qty >= r_qty:
                satisfied_inputs.append(f"{req_inp['input_name']} ({avail_qty} {avail_unit})")
            else:
                insufficient_inputs.append(f"{req_inp['input_name']} (Available: {avail_qty} {avail_unit}, Need: {r_qty} {r_unit})")
        else:
            missing_inputs.append(f"{req_inp['input_name']} ({r_qty} {r_unit})")

    if not required_inputs:
        inp_status = "PASS"
        inp_details = "No specific inputs required."
    elif not missing_inputs and not insufficient_inputs:
        inp_status = "PASS"
        inp_details = "All required inputs and quantities available."
    elif missing_inputs or insufficient_inputs:
        failed_items = missing_inputs + insufficient_inputs
        if satisfied_inputs:
            inp_status = "PARTIAL"
            inp_details = f"Partial input availability. Issues: {'; '.join(failed_items)}"
        else:
            inp_status = "FAIL"
            inp_details = f"Required inputs unavailable or insufficient: {'; '.join(failed_items)}"

    req_inp_str = ", ".join([f"{i.get('input_name')} ({i.get('quantity')} {i.get('unit')})" for i in required_inputs]) if required_inputs else "None"
    avail_inp_str = ", ".join([f"{i.input_name} ({i.quantity} {i.unit})" for i in farmer.inputs]) if farmer.inputs else "None"

    results.append(ConstraintResult(
        constraint_name="Inputs & Quantities",
        required_val=req_inp_str,
        available_val=avail_inp_str,
        status=inp_status,
        details=inp_details
    ))

    # 5. Labor Check
    labor_req = f"{rule.min_workers} workers"
    labor_avail = f"{farmer.workers} workers"
    if farmer.workers >= rule.min_workers:
        l_status = "PASS"
        l_details = "Available farm workers meet minimum requirement."
    elif farmer.workers > 0:
        l_status = "PARTIAL"
        l_details = f"Labor shortage. Required: {rule.min_workers}, Available: {farmer.workers}."
    else:
        l_status = "FAIL"
        l_details = f"No workers available! Required: {rule.min_workers}."

    results.append(ConstraintResult(
        constraint_name="Labor",
        required_val=labor_req,
        available_val=labor_avail,
        status=l_status,
        details=l_details
    ))

    # 6. Farm Size Check
    if rule.max_farm_size:
        size_req = f"Up to {rule.max_farm_size} acres"
        size_avail = f"{farmer.farm_size} acres"
        if farmer.farm_size <= rule.max_farm_size:
            s_status = "PASS"
            s_details = "Farm size is within rule boundary."
        else:
            s_status = "PARTIAL"
            s_details = f"Farm size {farmer.farm_size} acres exceeds recommended max of {rule.max_farm_size} acres."
        
        results.append(ConstraintResult(
            constraint_name="Farm Size",
            required_val=size_req,
            available_val=size_avail,
            status=s_status,
            details=s_details
        ))

    return results, True, ""
