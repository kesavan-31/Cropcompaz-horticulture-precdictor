from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String, primary_key=True, index=True)  # e.g., F024
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    location = Column(String, nullable=False)
    farm_size = Column(Float, nullable=False)  # in acres
    crop = Column(String, nullable=False)
    variety = Column(String, nullable=False, default="Local")
    growth_stage = Column(String, nullable=False)
    workers = Column(Integer, nullable=False, default=1)
    budget = Column(Float, nullable=False, default=0.0)
    water_availability = Column(String, nullable=False, default="Limited")  # Adequate, Limited, Rainfed, Unavailable
    water_source = Column(String, nullable=False, default="Borewell")  # Borewell, Canal, Rainfed, Well
    irrigation_available = Column(String, nullable=False, default="Drip Irrigation")  # Drip Irrigation, Sprinkler, Manual
    temperature = Column(Float, nullable=True)  # °C
    rainfall = Column(Float, nullable=True)  # mm
    humidity = Column(Float, nullable=True)  # %
    soil_type = Column(String, nullable=True)
    is_synthetic = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    equipment = relationship("FarmerEquipment", back_populates="farmer", cascade="all, delete-orphan")
    inputs = relationship("FarmerInput", back_populates="farmer", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="farmer", cascade="all, delete-orphan")


class FarmerEquipment(Base):
    __tablename__ = "farmer_equipment"

    id = Column(Integer, primary_key=True, autoincrement=True)
    farmer_id = Column(String, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    equipment_name = Column(String, nullable=False)

    farmer = relationship("Farmer", back_populates="equipment")


class FarmerInput(Base):
    __tablename__ = "farmer_inputs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    farmer_id = Column(String, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    input_name = Column(String, nullable=False)
    quantity = Column(Float, nullable=False, default=0.0)
    unit = Column(String, nullable=False, default="kg")

    farmer = relationship("Farmer", back_populates="inputs")


class AgronomyRule(Base):
    __tablename__ = "agronomy_rules"

    rule_id = Column(String, primary_key=True, index=True)  # e.g., AGR-001
    crop = Column(String, nullable=False)
    variety = Column(String, nullable=False, default="All")
    growth_stage = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    recommendation = Column(Text, nullable=False)
    required_inputs = Column(Text, nullable=False, default="[]")  # JSON string
    required_equipment = Column(Text, nullable=False, default="[]")  # JSON string
    min_workers = Column(Integer, nullable=False, default=1)
    max_farm_size = Column(Float, nullable=True)
    min_water = Column(String, nullable=False, default="Limited")
    estimated_cost = Column(Float, nullable=False, default=0.0)
    risk_level = Column(String, nullable=False, default="Low")  # Low, Medium, High
    evidence_source = Column(String, nullable=False)
    evidence_reference = Column(String, nullable=False)
    version = Column(String, nullable=False, default="1.0")
    status = Column(String, nullable=False, default="DEMO")  # APPROVED, DEMO, NEEDS_APPROVAL, INACTIVE
    is_high_impact = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    farmer_id = Column(String, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    rule_id = Column(String, ForeignKey("agronomy_rules.rule_id"), nullable=False)
    rule_version = Column(String, nullable=False, default="1.0")
    rule_status = Column(String, nullable=False, default="APPROVED")
    recommendation_text = Column(Text, nullable=False)
    estimated_cost = Column(Float, nullable=False, default=0.0)
    feasibility_status = Column(String, nullable=False)  # HIGHLY_FEASIBLE, PARTIALLY_FEASIBLE, NOT_FEASIBLE, INSUFFICIENT_INFO, VALIDATION_ERROR
    feasibility_score = Column(Float, nullable=False, default=0.0)
    is_alternative = Column(Boolean, default=False)
    primary_rule_id = Column(String, nullable=True)
    requires_human_confirmation = Column(Boolean, default=False)
    human_confirmation_status = Column(String, nullable=False, default="PENDING")  # PENDING, APPROVED, MODIFIED, REJECTED
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer", back_populates="recommendations")
    constraints = relationship("ConstraintCheck", back_populates="recommendation", cascade="all, delete-orphan")


class ConstraintCheck(Base):
    __tablename__ = "recommendation_constraints"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recommendation_id = Column(Integer, ForeignKey("recommendations.id", ondelete="CASCADE"), nullable=False)
    constraint_name = Column(String, nullable=False)
    required_val = Column(String, nullable=False)
    available_val = Column(String, nullable=False)
    status = Column(String, nullable=False)  # PASS, FAIL, PARTIAL
    details = Column(Text, nullable=True)

    recommendation = relationship("Recommendation", back_populates="constraints")


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)  # e.g., USR-001
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    password_hash = Column(String, nullable=False)
    account_type = Column(String, nullable=False)  # FARMER, BUYER, COOPERATIVE_STAFF, ADMIN
    farmer_id = Column(String, ForeignKey("farmers.id", ondelete="SET NULL"), nullable=True)
    buyer_id = Column(String, nullable=True)
    status = Column(String, nullable=False, default="ACTIVE")  # ACTIVE, INACTIVE
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farmer = relationship("Farmer", foreign_keys=[farmer_id])


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    token = Column(String, unique=True, index=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    user = relationship("User")


class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(String, primary_key=True, index=True)  # e.g., B001
    name = Column(String, nullable=False)
    buyer_type = Column(String, nullable=False)  # Export, Wholesale, Retail, Processing, Local market
    market = Column(String, nullable=False)
    location = Column(String, nullable=False)
    contact = Column(String, nullable=False)
    required_crops = Column(Text, nullable=False, default="[]")  # JSON array
    status = Column(String, nullable=False, default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class BuyerRequirement(Base):
    __tablename__ = "buyer_requirements"

    id = Column(Integer, primary_key=True, autoincrement=True)
    buyer_id = Column(String, ForeignKey("buyers.id", ondelete="CASCADE"), nullable=False)
    crop = Column(String, nullable=False)
    variety = Column(String, nullable=False, default="Any")
    required_grade = Column(String, nullable=False, default="Grade A")  # Grade A, Grade B, Grade C
    min_size_mm = Column(Float, nullable=True)
    max_size_mm = Column(Float, nullable=True)
    max_damage_pct = Column(Float, nullable=True, default=2.0)
    max_disease_pct = Column(Float, nullable=True, default=1.0)
    pest_tolerance = Column(String, nullable=True, default="Zero Tolerance")
    quantity_required_kg = Column(Float, nullable=True)
    packaging_requirement = Column(String, nullable=True)
    effective_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False, default="ACTIVE")

    buyer = relationship("Buyer")


class HarvestProduce(Base):
    __tablename__ = "harvest_produce"

    id = Column(String, primary_key=True, index=True)  # e.g., H001
    farmer_id = Column(String, ForeignKey("farmers.id", ondelete="CASCADE"), nullable=False)
    crop = Column(String, nullable=False)
    variety = Column(String, nullable=False, default="Local")
    harvest_date = Column(String, nullable=False)
    quantity = Column(Float, nullable=False, default=0.0)
    unit = Column(String, nullable=False, default="kg")
    grade = Column(String, nullable=False, default="Grade A")  # Grade A, Grade B, Grade C, Rejected
    damage_pct = Column(Float, nullable=True, default=0.0)
    disease_pct = Column(Float, nullable=True, default=0.0)
    inspection_status = Column(String, nullable=False, default="Inspected")  # Inspected, Pending, Rejected
    assigned_buyer = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("Farmer")


class FeedbackRecord(Base):
    __tablename__ = "feedback_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    farmer_id = Column(String, ForeignKey("farmers.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False, default=5)
    category = Column(String, nullable=False, default="General")
    comment = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
