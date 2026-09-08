import { Farmer, AgronomyRule, Recommendation, DashboardMetrics, ExperimentResult } from '../types';

const API_BASE = '/api';

export const api = {
  // Dashboard
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await fetch(`${API_BASE}/dashboard/metrics`);
    if (!res.ok) throw new Error('Failed to fetch dashboard metrics');
    return res.json();
  },

  // Farmers
  getFarmers: async (params?: { search?: string; crop?: string; growth_stage?: string }): Promise<Farmer[]> => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.crop) query.append('crop', params.crop);
    if (params?.growth_stage) query.append('growth_stage', params.growth_stage);
    
    const res = await fetch(`${API_BASE}/farmers?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch farmers');
    return res.json();
  },

  getFarmerById: async (id: string): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmers/${id}`);
    if (!res.ok) throw new Error(`Farmer '${id}' not found`);
    return res.json();
  },

  createFarmer: async (data: any): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err.detail || { errors: ['Failed to create farmer'] };
    }
    return res.json();
  },

  updateFarmer: async (id: string, data: any): Promise<Farmer> => {
    const res = await fetch(`${API_BASE}/farmers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err.detail || { errors: ['Failed to update farmer'] };
    }
    return res.json();
  },

  deleteFarmer: async (id: string): Promise<{ message: string }> => {
    const res = await fetch(`${API_BASE}/farmers/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete farmer');
    return res.json();
  },

  // Advisory / Recommendations
  generateRecommendation: async (farmer_id: string, demo_mode: boolean = false): Promise<any> => {
    const res = await fetch(`${API_BASE}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ farmer_id, demo_mode }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw err.detail || { message: 'Failed to generate recommendation' };
    }
    return res.json();
  },

  getRecommendationHistory: async (farmer_id?: string): Promise<Recommendation[]> => {
    const url = farmer_id ? `${API_BASE}/recommendations?farmer_id=${farmer_id}` : `${API_BASE}/recommendations`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch recommendation history');
    return res.json();
  },

  // Agronomy Rules
  getAgronomyRules: async (): Promise<AgronomyRule[]> => {
    const res = await fetch(`${API_BASE}/agronomy-rules`);
    if (!res.ok) throw new Error('Failed to fetch agronomy rules');
    return res.json();
  },

  // Experiments
  runExperiment: async (): Promise<ExperimentResult> => {
    const res = await fetch(`${API_BASE}/experiments`);
    if (!res.ok) throw new Error('Failed to run experiment');
    return res.json();
  }
};
