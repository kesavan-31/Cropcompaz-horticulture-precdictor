import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HarvestProduce } from '../../types';
import { QrCode, ShieldCheck, CheckCircle2, MapPin, Calendar, Sprout } from 'lucide-react';

export const BuyerTraceabilityPage: React.FC = () => {
  const [produce, setProduce] = useState<HarvestProduce[]>([]);

  useEffect(() => {
    api.getBuyerPortalAvailableProduce().then(setProduce).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">Produce Traceability & Agronomy Audit</h1>
        <p className="text-xs text-stone-500 mt-1">
          Verify origin, soil inputs, pest treatment history, and grading compliance before dispatch.
        </p>
      </div>

      <div className="space-y-4">
        {produce.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#163B2F] flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm">Batch Passport #{p.id}</h3>
                  <span className="text-xs text-stone-400">Crop: {p.crop} ({p.variety})</span>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-bold text-xs">
                Verified Grade {p.grade}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-stone-400 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Origin & Cooperative
                </div>
                <div className="font-bold text-stone-900">Tamil Nadu Horticulture Cluster</div>
                <div className="text-[11px] text-stone-500">Farmer ID: {p.farmer_id}</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-stone-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Harvest & Storage
                </div>
                <div className="font-bold text-stone-900">{p.harvest_date}</div>
                <div className="text-[11px] text-stone-500">Volume: {p.quantity} {p.unit}</div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                <div className="text-stone-400 text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Agronomy Verification
                </div>
                <div className="font-bold text-emerald-800">TNAU Guidelines Followed</div>
                <div className="text-[11px] text-stone-500">Biological IPM Treatment</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
