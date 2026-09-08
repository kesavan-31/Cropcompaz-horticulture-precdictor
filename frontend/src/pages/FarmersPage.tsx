import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Farmer } from '../types';
import { FarmerCard } from '../components/farmers/FarmerCard';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Plus, Search, Filter, UserX } from 'lucide-react';

export const FarmersPage: React.FC = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('');
  
  // Deletion modal state
  const [deletingFarmer, setDeletingFarmer] = useState<Farmer | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchFarmers();
  }, [search, selectedCrop]);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const data = await api.getFarmers({
        search: search || undefined,
        crop: selectedCrop || undefined
      });
      setFarmers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (farmer: Farmer) => {
    navigate(`/farmers/edit/${farmer.id}`);
  };

  const handleDeleteClick = (farmer: Farmer) => {
    setDeletingFarmer(farmer);
  };

  const handleConfirmDelete = async () => {
    if (!deletingFarmer) return;
    try {
      setIsDeleting(true);
      await api.deleteFarmer(deletingFarmer.id);
      setDeletingFarmer(null);
      fetchFarmers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Add Farmer Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Farmer Management</h1>
          <p className="text-xs text-stone-500 mt-1">
            Resource-aware profiles detailing farm acreage, budget, equipment, inputs, water and micro-climate.
          </p>
        </div>

        <button
          onClick={() => navigate('/farmers/new')}
          className="px-5 py-2.5 bg-[#163B2F] hover:bg-[#0F291E] text-white font-bold text-sm rounded-xl shadow-sm transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#B4F042]" /> Add Farmer
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by name, ID, location, or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white text-stone-700 font-medium"
          >
            <option value="">All Crops</option>
            <option value="Chilli">Chilli</option>
            <option value="Tomato">Tomato</option>
            <option value="Capsicum">Capsicum</option>
            <option value="Onion">Onion</option>
            <option value="Brinjal">Brinjal</option>
          </select>
        </div>
      </div>

      {/* Grid of Farmer Cards matching AgriWise reference */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 text-sm">Loading farmer profiles...</div>
      ) : farmers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8">
          <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto mb-3">
            <UserX className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">No farmers found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Start by creating a new farmer profile to evaluate resource-aware agronomy recommendations.
          </p>
          <button
            onClick={() => navigate('/farmers/new')}
            className="mt-4 px-4 py-2 bg-[#B4F042] text-[#0F291E] font-bold text-xs rounded-xl shadow-xs hover:bg-[#A1E02F] transition"
          >
            + Add Farmer Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farmers.map((farmer) => (
            <FarmerCard
              key={farmer.id}
              farmer={farmer}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingFarmer)}
        title={`Delete ${deletingFarmer?.name}?`}
        message={`This will permanently remove farmer profile '${deletingFarmer?.id}' and associated recommendation records.`}
        confirmText="Delete Farmer"
        onConfirm={handleConfirmDelete}
        onClose={() => setDeletingFarmer(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
