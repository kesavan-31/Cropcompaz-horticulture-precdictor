import { 
  Farmer, 
  AgronomyRule, 
  Recommendation, 
  DashboardMetrics, 
  ExperimentResult, 
  UserSession, 
  UserProfile, 
  Buyer,
  BuyerRequirement, 
  HarvestProduce, 
  FeedbackItem 
} from '../types';

const API_BASE = '/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('cropcompaz_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  registerFarmer: async (data: any): Promise<UserSession> => {
    const res = await fetch(`${API_BASE}/auth/farmer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || 'Unable to register farmer account.';
    }
    return res.json();
  },

  registerBuyer: async (data: any): Promise<UserSession> => {
    const res = await fetch(`${API_BASE}/auth/buyer/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || 'Unable to register buyer account.';
    }
    return res.json();
  },

  loginFarmer: async (identifier: string, password: string): Promise<UserSession> => {
    const res = await fetch(`${API_BASE}/auth/farmer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || 'Unable to sign in with these credentials.';
    }
    return res.json();
  },

  loginBuyer: async (identifier: string, password: string): Promise<UserSession> => {
    const res = await fetch(`${API_BASE}/auth/buyer/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || 'Unable to sign in with these credentials.';
    }
    return res.json();
  },

  getMe: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Session invalid or expired');
    return res.json();
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    }).catch(() => {});
  },

  // Farmer Portal Specific APIs (Data Isolation)
  getFarmerPortalProfile: async (): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmer-portal/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch farm profile');
    return res.json();
  },

  updateFarmerPortalProfile: async (data: Omit<Partial<Farmer>, 'equipment' | 'inputs'> & { equipment?: string[]; inputs?: any[] }): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmer-portal/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update farm resources');
    return res.json();
  },

  getFarmerPortalRecommendations: async (): Promise<Recommendation[]> => {
    const res = await fetch(`${API_BASE}/farmer-portal/recommendations`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  generateFarmerPortalAdvisory: async (demo_mode: boolean = false): Promise<any> => {
    const res = await fetch(`${API_BASE}/farmer-portal/recommendations/generate?demo_mode=${demo_mode}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || { message: 'Failed to generate advisory' };
    }
    return res.json();
  },

  getFarmerPortalHarvests: async (): Promise<HarvestProduce[]> => {
    const res = await fetch(`${API_BASE}/farmer-portal/harvests`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch harvest records');
    return res.json();
  },

  submitFarmerFeedback: async (rating: number, comment: string, category: string = "Advisory"): Promise<FeedbackItem> => {
    const res = await fetch(`${API_BASE}/farmer-portal/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, comment, category }),
    });
    if (!res.ok) throw new Error('Failed to submit feedback');
    return res.json();
  },

  // Buyer Portal Specific APIs (Data Isolation)
  getBuyerPortalProfile: async (): Promise<Buyer> => {
    const res = await fetch(`${API_BASE}/buyer-portal/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch buyer profile');
    return res.json();
  },

  updateBuyerPortalProfile: async (data: Partial<Buyer>): Promise<Buyer> => {
    const res = await fetch(`${API_BASE}/buyer-portal/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update buyer profile');
    return res.json();
  },

  getBuyerPortalRequirements: async (): Promise<BuyerRequirement[]> => {
    const res = await fetch(`${API_BASE}/buyer-portal/requirements`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch buyer requirements');
    return res.json();
  },

  getBuyerPortalAvailableProduce: async (): Promise<HarvestProduce[]> => {
    const res = await fetch(`${API_BASE}/buyer-portal/available-produce`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch available produce');
    return res.json();
  },

  submitBuyerFeedback: async (farmer_id: string, rating: number, comment: string): Promise<FeedbackItem> => {
    const res = await fetch(`${API_BASE}/buyer-portal/feedback`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ farmer_id, rating, comment }),
    });
    if (!res.ok) throw new Error('Failed to submit quality review');
    return res.json();
  },

  // Dashboard & Common
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  // Farmers
  getFarmers: async (params?: { search?: string; crop?: string; growth_stage?: string }): Promise<Farmer[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.crop) query.append('crop', params.crop);
    if (params?.growth_stage) query.append('growth_stage', params.growth_stage);
    
    const res = await fetch(`${API_BASE}/farmers?${query.toString()}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch farmers');
    return res.json();
  },

  getFarmerById: async (id: string): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmers/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Farmer '${id}' not found`);
    return res.json();
  },

  createFarmer: async (data: any): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmers`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || { errors: ['Failed to create farmer'] };
    }
    return res.json();
  },

  updateFarmer: async (id: string, data: any): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmers/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || { errors: ['Failed to update farmer'] };
    }
    return res.json();
  },

  deleteFarmer: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/farmers/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete farmer');
    return res.json();
  },

  // Advisory / Recommendations
  generateRecommendation: async (farmer_id: string, demo_mode: boolean = false): Promise<any> => {
    const res = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ farmer_id, demo_mode }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw err.detail || { message: 'Failed to generate recommendation' };
    }
    return res.json();
  },

  getRecommendationHistory: async (farmer_id?: string): Promise<Recommendation[]> => {
    const url = farmer_id ? `${API_BASE}/recommendations?farmer_id=${farmer_id}` : `${API_BASE}/recommendations`;
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch recommendation history');
    return res.json();
  },

  // Agronomy Rules
  getAgronomyRules: async (): Promise<AgronomyRule[]> => {
    const res = await fetch(`${API_BASE}/agronomy-rules`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch agronomy rules');
    return res.json();
  },

  // Experiments
  runExperiment: async (): Promise<ExperimentResult> => {
    const res = await fetch(`${API_BASE}/experiments`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to run experiment');
    return res.json();
  }
};
