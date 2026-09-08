import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Farmer } from '../types';
import { FarmerForm } from '../components/farmers/FarmerForm';
import { ArrowLeft } from 'lucide-react';

export const EditFarmerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api.getFarmerById(id)
        .then(setFarmer)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdate = async (payload: any) => {
    if (id) {
      await api.updateFarmer(id, payload);
      navigate('/farmers');
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-stone-500 text-sm">Loading profile data...</div>;
  }

  if (!farmer) {
    return <div className="text-center py-12 text-rose-500 text-sm">Farmer profile not found.</div>;
  }

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
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Edit Farmer Profile ({farmer.id})</h1>
          <p className="text-xs text-stone-500">
            Update farm constraints, worker availability, budget, inputs or local micro-climate data.
          </p>
        </div>
      </div>

      <FarmerForm
        initialData={farmer}
        isEditing={true}
        onSubmit={handleUpdate}
        onCancel={() => navigate('/farmers')}
      />
    </div>
  );
};
