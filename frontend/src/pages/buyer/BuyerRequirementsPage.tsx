import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { BuyerRequirement } from '../../types';
import { FileCheck, Plus, CheckCircle2 } from 'lucide-react';

export const BuyerRequirementsPage: React.FC = () => {
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBuyerPortalRequirements()
      .then(setRequirements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Quality Requirements & Sourcing Specs</h1>
          <p className="text-xs text-stone-500 mt-1">
            Parameters and grade thresholds required for your procurement orders.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-xs">Loading specifications...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {requirements.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-stone-900">{req.crop}</h3>
                  <span className="text-xs text-stone-400">Variety: {req.variety}</span>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
                  {req.required_grade}
                </span>
              </div>

              <div className="space-y-2 text-xs text-stone-700">
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="text-stone-500">Size Requirement:</span>
                  <span className="font-semibold text-stone-900">{req.min_size_mm} – {req.max_size_mm} mm</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="text-stone-500">Max Damage Allowed:</span>
                  <span className="font-semibold text-stone-900">≤ {req.max_damage_pct}%</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="text-stone-500">Max Disease Allowed:</span>
                  <span className="font-semibold text-stone-900">≤ {req.max_disease_pct}%</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="text-stone-500">Pest Tolerance:</span>
                  <span className="font-semibold text-emerald-800">{req.pest_tolerance}</span>
                </div>
                <div className="flex justify-between p-2 bg-stone-50 rounded-lg">
                  <span className="text-stone-500">Packaging Spec:</span>
                  <span className="font-semibold text-stone-900">{req.packaging_requirement}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
