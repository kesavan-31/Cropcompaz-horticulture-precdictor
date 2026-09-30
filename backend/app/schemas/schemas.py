from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
from datetime import datetime

class EquipmentBase(BaseModel):
    equipment_name: str

class EquipmentCreate(EquipmentBase):
    pass

class EquipmentOut(EquipmentBase):
    id: int
    farmer_id: str

    class Config:
        from_attributes = True


class InputBase(BaseModel):
    input_name: str
    quantity: float = Field(default=0.0, ge=0.0)
    unit: str = Field(default="kg")

class InputCreate(InputBase):
    pass

class InputOut(InputBase):
    id: int
    farmer_id: str

    class Config:
        from_attributes = True


class FarmerBase(BaseModel):
    id: str = Field(..., description="Unique Farmer ID e.g. F024")
    name: str = Field(..., min_length=2)
    phone: str = Field(..., description="Indian phone number")
    location: str
    farm_size: float = Field(..., gt=0.0, le=1000.0, description="Farm size in acres")
    crop: str
    variety: str = Field(default="Local")
    growth_stage: str
    workers: int = Field(default=1, ge=0)
    budget: float = Field(default=0.0, ge=0.0)
    water_availability: str = Field(default="Limited")
    water_source: str = Field(default="Borewell")
    irrigation_available: str = Field(default="Drip Irrigation")
    temperature: Optional[float] = Field(default=None)
    rainfall: Optional[float] = Field(default=None)
    humidity: Optional[float] = Field(default=None)
    soil_type: Optional[str] = Field(default=None)
    is_synthetic: bool = Field(default=True)

class FarmerCreate(FarmerBase):
    equipment: List[str] = Field(default_factory=list)
    inputs: List[InputCreate] = Field(default_factory=list)

class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[float] = None
    crop: Optional[str] = None
    variety: Optional[str] = None
    growth_stage: Optional[str] = None
    workers: Optional[int] = None
    budget: Optional[float] = None
    water_availability: Optional[str] = None
    water_source: Optional[str] = None
    irrigation_available: Optional[str] = None
    temperature: Optional[float] = None
    rainfall: Optional[float] = None
    humidity: Optional[float] = None
    soil_type: Optional[str] = None
    equipment: Optional[List[str]] = None
    inputs: Optional[List[InputCreate]] = None

class FarmerOut(FarmerBase):
    created_at: datetime
    updated_at: datetime
    equipment: List[EquipmentOut] = []
    inputs: List[InputOut] = []

    class Config:
        from_attributes = True


class RequiredInputSchema(BaseModel):
    input_name: str
    quantity: float
    unit: str

class AgronomyRuleBase(BaseModel):
    rule_id: str
    crop: str
    variety: str = "All"
    growth_stage: str
    condition: str
    recommendation: str
    required_inputs: List[RequiredInputSchema] = []
    required_equipment: List[str] = []
    min_workers: int = 1
    max_farm_size: Optional[float] = None
    min_water: str = "Limited"
    estimated_cost: float = 0.0
    risk_level: str = "Low"
    evidence_source: str
    evidence_reference: str
    version: str = "1.0"
    status: str = "DEMO"
    is_high_impact: bool = False

class AgronomyRuleCreate(AgronomyRuleBase):
    pass

class AgronomyRuleOut(AgronomyRuleBase):
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConstraintCheckOut(BaseModel):
    id: int
    constraint_name: str
    required_val: str
    available_val: str
    status: str
    details: Optional[str] = None

    class Config:
        from_attributes = True


class RecommendationOut(BaseModel):
    id: int
    farmer_id: str
    rule_id: str
    rule_version: str
    rule_status: str
    recommendation_text: str
    estimated_cost: float
    feasibility_status: str
    feasibility_score: float
    is_alternative: bool
    primary_rule_id: Optional[str] = None
    requires_human_confirmation: bool
    human_confirmation_status: str
    created_at: datetime
    constraints: List[ConstraintCheckOut] = []
    evidence_source: Optional[str] = None
    evidence_reference: Optional[str] = None

    class Config:
        from_attributes = True


class RecommendationCreateRequest(BaseModel):
    farmer_id: str
    demo_mode: bool = False


class DashboardMetrics(BaseModel):
    active_farmers: int
    active_farms: int
    current_crops: int
    pending_approvals: int
    feasibility_rate: str
    total_recommendations: int
    evidence_coverage: str
    system_alerts: int


class ExperimentResult(BaseModel):
    total_scenarios: int
    baseline_feasibility_rate: float
    baseline_constraint_violations: int
    cropcompass_feasibility_rate: float
    cropcompass_constraint_violations: int
    relevance_rate: float
    improvement_percentage: float
    status: str


# Authentication Schemas
class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Email or Phone Number")
    password: str = Field(..., min_length=1)

class FarmerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., description="Indian phone number")
    email: Optional[str] = None
    location: str = Field(default="Coimbatore, Tamil Nadu")
    farm_size: float = Field(default=2.0, gt=0.0, le=1000.0)
    crop: str = Field(default="Chilli")
    variety: str = Field(default="Local")
    growth_stage: str = Field(default="Vegetative")
    workers: int = Field(default=1, ge=0)
    budget: float = Field(default=5000.0, ge=0.0)
    water_availability: str = Field(default="Limited")
    password: str = Field(..., min_length=6)

class BuyerRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    phone: str = Field(..., description="Contact phone")
    email: Optional[str] = None
    buyer_type: str = Field(default="Wholesale")  # Export, Wholesale, Retail, Processing, Local market
    market: str = Field(default="APMC Market")
    location: str = Field(default="Tamil Nadu")
    required_crops: List[str] = Field(default_factory=lambda: ["Tomato", "Chilli"])
    password: str = Field(..., min_length=6)

class UserSessionOut(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    farmer_id: Optional[str] = None
    buyer_id: Optional[str] = None
    token: str

class UserProfileOut(BaseModel):
    id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    farmer_id: Optional[str] = None
    buyer_id: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


# Buyer & Produce Schemas
class BuyerRequirementOut(BaseModel):
    id: int
    buyer_id: str
    crop: str
    variety: str
    required_grade: str
    min_size_mm: Optional[float] = None
    max_size_mm: Optional[float] = None
    max_damage_pct: Optional[float] = 2.0
    max_disease_pct: Optional[float] = 1.0
    pest_tolerance: Optional[str] = "Zero Tolerance"
    quantity_required_kg: Optional[float] = None
    packaging_requirement: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

class BuyerOut(BaseModel):
    id: str
    name: str
    buyer_type: str
    market: str
    location: str
    contact: str
    required_crops: str
    status: str

    class Config:
        from_attributes = True

class HarvestProduceOut(BaseModel):
    id: str
    farmer_id: str
    crop: str
    variety: str
    harvest_date: str
    quantity: float
    unit: str
    grade: str
    damage_pct: Optional[float] = 0.0
    disease_pct: Optional[float] = 0.0
    inspection_status: str
    assigned_buyer: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class FeedbackCreateRequest(BaseModel):
    farmer_id: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)
    category: str = Field(default="General")
    comment: str = Field(..., min_length=2)

class FeedbackOut(BaseModel):
    id: int
    farmer_id: Optional[str] = None
    rating: int
    category: str
    comment: str
    created_at: datetime

    class Config:
        from_attributes = True
