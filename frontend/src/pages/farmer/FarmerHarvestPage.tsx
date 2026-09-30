import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HarvestProduce } from '../../types';
import { Package, CheckCircle, Clock } from 'lucide-react';

export const FarmerHarvestPage: React.FC = () => {
  const [harvests, setHarvests] = useState<HarvestProduce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFarmerPortalHarvests()
      .then(setHarvests)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">My Harvest Records</h1>
        <p className="text-xs text-stone-500 mt-1">Recorded crop harvests, produce batch numbers, and inspection status.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-xs">Loading harvest batches...</div>
      ) : harvests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8">
          <Package className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-xs text-stone-500">No harvest batches recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Batch ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Crop</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Harvest Date</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Quantity</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Quality Grade</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase">Assigned Buyer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {harvests.map((h) => (
                <tr key={h.id} className="hover:bg-stone-50/50">
                  <td className="px-5 py-3.5 font-mono font-bold text-stone-600">{h.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-stone-900">{h.crop} ({h.variety})</td>
                  <td className="px-5 py-3.5 text-stone-500">{h.harvest_date}</td>
                  <td className="px-5 py-3.5 font-bold text-stone-800">{h.quantity} {h.unit}</td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {h.grade}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 font-medium text-stone-700">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {h.inspection_status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-stone-600">{h.assigned_buyer || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
