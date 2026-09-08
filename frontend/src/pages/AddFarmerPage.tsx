import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { FarmerForm } from '../components/farmers/FarmerForm';
import { ArrowLeft } from 'lucide-react';

export const AddFarmerPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCreate = async (payload: any) => {
    await api.createFarmer(payload);
    navigate('/farmers');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/farmers')}
          className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Add New Farmer Profile</h1>
          <p className="text-xs text-stone-500">
            Enter farmer identity, farm acreage, labor, budget, equipment, inputs, water and micro-climate details.
          </p>
        </div>
      </div>

      <FarmerForm
        onSubmit={handleCreate}
        onCancel={() => navigate('/farmers')}
      />
    </div>
  );
};
