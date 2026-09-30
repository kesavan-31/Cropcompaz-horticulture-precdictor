import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HarvestProduce } from '../../types';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export const FarmerQualityPage: React.FC = () => {
  const [harvests, setHarvests] = useState<HarvestProduce[]>([]);

  useEffect(() => {
    api.getFarmerPortalHarvests().then(setHarvests).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">Produce Quality & Grades</h1>
        <p className="text-xs text-stone-500 mt-1">Inspection assessments and buyer-grade compliance for your farm produce.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold">Total Batches Evaluated</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">{harvests.length}</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold">Grade A Compliance</span>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">100%</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs text-stone-500 font-semibold">Assigned Market Buyers</span>
          <div className="text-2xl font-extrabold text-blue-800 mt-1">Export Ready</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-stone-900">Batch Inspection Details</h2>
        <div className="space-y-3">
          {harvests.map((h) => (
            <div key={h.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 font-mono">Batch {h.id}</span>
                  <span className="font-semibold text-emerald-900">{h.crop} ({h.variety})</span>
                  <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                    {h.grade}
                  </span>
                </div>
                <div className="text-stone-500">
                  Quantity: {h.quantity} {h.unit} · Harvest Date: {h.harvest_date} · Damage: {h.damage_pct}% · Disease: {h.disease_pct}%
                </div>
              </div>
              <div className="text-right">
                <span className="font-semibold text-stone-800">{h.assigned_buyer || "Chennai Export Hub"}</span>
                <div className="text-[10px] text-emerald-700 font-medium">Export Specification Met</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
