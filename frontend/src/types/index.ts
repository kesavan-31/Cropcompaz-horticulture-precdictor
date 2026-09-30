export interface FarmerEquipment {
  id: number;
  farmer_id: string;
  equipment_name: string;
}

export interface FarmerInput {
  id: number;
  farmer_id: string;
  input_name: string;
  quantity: number;
  unit: string;
}

export interface Farmer {
  id: string;
  name: string;
  phone: string;
  location: string;
  farm_size: number;
  crop: string;
  variety: string;
  growth_stage: string;
  workers: number;
  budget: number;
  water_availability: string;
  water_source: string;
  irrigation_available: string;
  temperature?: number | null;
  rainfall?: number | null;
  humidity?: number | null;
  soil_type?: string | null;
  is_synthetic: boolean;
  created_at: string;
  updated_at: string;
  equipment: FarmerEquipment[];
  inputs: FarmerInput[];
}

export interface RequiredInput {
  input_name: string;
  quantity: number;
  unit: string;
}

export interface AgronomyRule {
  rule_id: string;
  crop: string;
  variety: string;
  growth_stage: string;
  condition: string;
  recommendation: string;
  required_inputs: RequiredInput[];
  required_equipment: string[];
  min_workers: number;
  max_farm_size?: number | null;
  min_water: string;
  estimated_cost: number;
  risk_level: string;
  evidence_source: string;
  evidence_reference: string;
  version: string;
  status: 'APPROVED' | 'DEMO' | 'NEEDS_APPROVAL' | 'INACTIVE';
  is_high_impact: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConstraintCheck {
  id?: number;
  constraint_name: string;
  required_val: string;
  available_val: string;
  status: 'PASS' | 'FAIL' | 'PARTIAL';
  details: string;
}

export interface Recommendation {
  id: number;
  farmer_id: string;
  rule_id: string;
  rule_version: string;
  rule_status: string;
  recommendation_text: string;
  estimated_cost: number;
  feasibility_status: 'HIGHLY_FEASIBLE' | 'PARTIALLY_FEASIBLE' | 'NOT_FEASIBLE' | 'INSUFFICIENT_INFO' | 'VALIDATION_ERROR';
  feasibility_score: number;
  is_alternative: boolean;
  primary_rule_id?: string | null;
  requires_human_confirmation: boolean;
  human_confirmation_status: 'PENDING' | 'APPROVED' | 'MODIFIED' | 'REJECTED' | 'NOT_REQUIRED';
  created_at: string;
  constraints: ConstraintCheck[];
  evidence_source?: string;
  evidence_reference?: string;
  alternative_recommendation?: Recommendation | null;
}

export interface DashboardMetrics {
  active_farmers: number;
  active_farms: number;
  current_crops: number;
  pending_approvals: number;
  feasibility_rate: string;
  total_recommendations: number;
  evidence_coverage: string;
  system_alerts: number;
}

export interface ExperimentResult {
  total_scenarios: number;
  baseline_feasibility_rate: number;
  baseline_constraint_violations: number;
  cropcompass_feasibility_rate: number;
  cropcompass_constraint_violations: number;
  relevance_rate: number;
  improvement_percentage: number;
  status: string;
}

export interface UserSession {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  farmer_id?: string | null;
  buyer_id?: string | null;
  token: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  farmer_id?: string | null;
  buyer_id?: string | null;
  status: string;
}

export interface BuyerRequirement {
  id: number;
  buyer_id: string;
  crop: string;
  variety: string;
  required_grade: string;
  min_size_mm?: number | null;
  max_size_mm?: number | null;
  max_damage_pct?: number | null;
  max_disease_pct?: number | null;
  pest_tolerance?: string | null;
  quantity_required_kg?: number | null;
  packaging_requirement?: string | null;
  status: string;
}

export interface HarvestProduce {
  id: string;
  farmer_id: string;
  crop: string;
  variety: string;
  harvest_date: string;
  quantity: number;
  unit: string;
  grade: string;
  damage_pct?: number | null;
  disease_pct?: number | null;
  inspection_status: string;
  assigned_buyer?: string | null;
  created_at: string;
}

export interface FeedbackItem {
  id: number;
  farmer_id?: string | null;
  rating: number;
  category: string;
  comment: string;
  created_at: string;
}
