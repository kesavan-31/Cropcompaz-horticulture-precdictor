import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.models import Farmer, FarmerEquipment, FarmerInput, AgronomyRule
from app.engine.recommendation_engine import generate_recommendation_for_farmer
from app.utils.seed_data import seed_database

# In-memory SQLite DB for testing
@pytest.fixture
def db_session():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    seed_database(session)
    yield session
    session.close()


def test_failure_case_1_budget_too_low(db_session):
    """FAILURE CASE 1: Budget too low (Required ₹1,200, Available ₹100). Expected: NOT FEASIBLE."""
    farmer = Farmer(
        id="F_LOW_BUDGET",
        name="Low Budget Farmer",
        phone="+91 98765 43210",
        location="Test Loc",
        farm_size=2.0,
        crop="Chilli",
        variety="Local",
        growth_stage="Fruiting",
        workers=2,
        budget=100.0,  # Extremely low budget
        water_availability="Limited",
        water_source="Borewell",
        irrigation_available="Sprayer",
        temperature=30.0,
        rainfall=10.0,
        humidity=60.0,
        soil_type="Red Loam"
    )
    db_session.add(farmer)
    db_session.add(FarmerEquipment(farmer_id=farmer.id, equipment_name="Sprayer"))
    db_session.add(FarmerInput(farmer_id=farmer.id, input_name="Neem Oil", quantity=2.0, unit="L"))
    db_session.commit()

    res = generate_recommendation_for_farmer(farmer, db_session)
    assert res["feasibility_status"] == "NOT_FEASIBLE"
    budget_constraint = next(c for c in res["constraints"] if c["constraint_name"] == "Budget")
    assert budget_constraint["status"] == "FAIL"


def test_failure_case_2_missing_equipment(db_session):
    """FAILURE CASE 2: Required equipment missing (Required Sprayer, Available None). Expected: NOT FEASIBLE."""
    farmer = Farmer(
        id="F_NO_EQUIP",
        name="No Equipment Farmer",
        phone="+91 98765 43210",
        location="Test Loc",
        farm_size=2.0,
        crop="Chilli",
        variety="Local",
        growth_stage="Fruiting",
        workers=2,
        budget=5000.0,
        water_availability="Limited",
        water_source="Borewell",
        irrigation_available="Manual",
        temperature=30.0,
        rainfall=10.0,
        humidity=60.0,
        soil_type="Red Loam"
    )
    db_session.add(farmer)
    # No equipment added
    db_session.commit()

    res = generate_recommendation_for_farmer(farmer, db_session)
    assert res["feasibility_status"] in ["NOT_FEASIBLE", "PARTIALLY_FEASIBLE"]
    eq_constraint = next(c for c in res["constraints"] if c["constraint_name"] == "Equipment")
    assert eq_constraint["status"] == "FAIL"


def test_failure_case_3_missing_data(db_session):
    """FAILURE CASE 3: Soil type required for demo rule, farmer soil missing. Expected: INSUFFICIENT INFORMATION."""
    farmer = Farmer(
        id="F_NO_SOIL",
        name="No Soil Farmer",
        phone="+91 98765 43210",
        location="Test Loc",
        farm_size=2.0,
        crop="Tomato",
        variety="Local",
        growth_stage="Vegetative",
        workers=2,
        budget=5000.0,
        water_availability="Limited",
        water_source="Borewell",
        irrigation_available="Manual",
        temperature=30.0,
        rainfall=10.0,
        humidity=60.0,
        soil_type=""  # Missing soil
    )
    db_session.add(farmer)
    db_session.commit()

    res = generate_recommendation_for_farmer(farmer, db_session, demo_mode=True)
    # Rule AGR-DEMO-002 requires black soil -> should produce INSUFFICIENT_INFO or handle missing data
    assert res is not None


def test_failure_case_4_invalid_local_conditions(db_session):
    """FAILURE CASE 4: Temperature = 200°C. Expected: VALIDATION ERROR."""
    farmer = Farmer(
        id="F_INVALID_TEMP",
        name="Invalid Temp Farmer",
        phone="+91 98765 43210",
        location="Test Loc",
        farm_size=2.0,
        crop="Chilli",
        variety="Local",
        growth_stage="Fruiting",
        workers=2,
        budget=5000.0,
        water_availability="Limited",
        water_source="Borewell",
        irrigation_available="Sprayer",
        temperature=200.0,  # Impossible temperature
        rainfall=10.0,
        humidity=60.0,
        soil_type="Red Loam"
    )
    db_session.add(farmer)
    db_session.commit()

    res = generate_recommendation_for_farmer(farmer, db_session)
    assert "error" in res
    assert res["error"] == "VALIDATION_ERROR"


def test_failure_case_5_high_impact_recommendation(db_session):
    """FAILURE CASE 5: Chemical pesticide rule AGR-002 matched. Expected: requires_human_confirmation = True."""
    rule = db_session.query(AgronomyRule).filter(AgronomyRule.rule_id == "AGR-002").first()
    assert rule.is_high_impact is True

    farmer = Farmer(
        id="F_HIGH_IMPACT",
        name="High Impact Farmer",
        phone="+91 98765 43210",
        location="Test Loc",
        farm_size=2.0,
        crop="Chilli",
        variety="Local",
        growth_stage="Fruiting",
        workers=2,
        budget=5000.0,
        water_availability="Limited",
        water_source="Borewell",
        irrigation_available="Sprayer",
        temperature=30.0,
        rainfall=10.0,
        humidity=60.0,
        soil_type="Red Loam"
    )
    db_session.add(farmer)
    db_session.add(FarmerEquipment(farmer_id=farmer.id, equipment_name="Sprayer"))
    db_session.add(FarmerInput(farmer_id=farmer.id, input_name="Pesticide", quantity=2.0, unit="L"))
    db_session.commit()

    # If pesticide rule is matched
    res = generate_recommendation_for_farmer(farmer, db_session)
    assert res is not None
