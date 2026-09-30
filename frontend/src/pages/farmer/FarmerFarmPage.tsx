import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Farmer } from '../../types';
import { Sprout, Wrench, Package, Droplets, MapPin, DollarSign, Users, Thermometer, CloudRain } from 'lucide-react';

export const FarmerFarmPage: React.FC = () => {
  const [farm, setFarm] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFarmerPortalProfile()
      .then(setFarm)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-stone-400 text-xs">Loading farm details...</div>;
  }

  if (!farm) {
    return <div className="text-center py-12 text-stone-500 text-xs">No farm profile linked.</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">My Farm Resources</h1>
        <p className="text-xs text-stone-500 mt-1">Resource inventory and micro-climate details registered for your farm.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm & Crop Overview */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#163B2F]" />
            Farm & Crop Profile
          </h2>
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Location:</span>
              <span className="font-semibold text-stone-900">{farm.location}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Farm Size:</span>
              <span className="font-semibold text-stone-900">{farm.farm_size} Acres</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Current Crop:</span>
              <span className="font-semibold text-[#163B2F]">{farm.crop} ({farm.variety})</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Growth Stage:</span>
              <span className="font-semibold text-stone-900">{farm.growth_stage}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Available Workers:</span>
              <span className="font-semibold text-stone-900">{farm.workers} Persons</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Available Budget:</span>
              <span className="font-bold text-emerald-800">₹{farm.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Water & Climate Conditions */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            Water & Local Climate
          </h2>
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Water Availability:</span>
              <span className="font-semibold text-stone-900">{farm.water_availability}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Water Source:</span>
              <span className="font-semibold text-stone-900">{farm.water_source}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Irrigation Setup:</span>
              <span className="font-semibold text-stone-900">{farm.irrigation_available}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Temperature:</span>
              <span className="font-semibold text-stone-900">{farm.temperature ? `${farm.temperature}°C` : "—"}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Rainfall:</span>
              <span className="font-semibold text-stone-900">{farm.rainfall ? `${farm.rainfall} mm` : "—"}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">Soil Type:</span>
              <span className="font-semibold text-stone-900">{farm.soil_type || "Red Soil"}</span>
            </div>
          </div>
        </div>

        {/* Equipment Inventory */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-stone-600" />
            Equipment Inventory
          </h2>
          {farm.equipment.length === 0 ? (
            <div className="text-xs text-stone-400">No equipment recorded.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {farm.equipment.map((eq) => (
                <span key={eq.id} className="px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold">
                  {eq.equipment_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Input Inventory */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-700" />
            Input Stock Inventory
          </h2>
          {farm.inputs.length === 0 ? (
            <div className="text-xs text-stone-400">No inputs in stock.</div>
          ) : (
            <div className="space-y-1.5">
              {farm.inputs.map((inp) => (
                <div key={inp.id} className="flex justify-between p-2 bg-stone-50 border border-stone-100 rounded-lg text-xs">
                  <span className="font-medium text-stone-800">{inp.input_name}</span>
                  <span className="font-bold text-stone-900">{inp.quantity} {inp.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
