import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { HarvestProduce } from '../../types';
import { Package, Search, Filter, ShoppingBag, CheckCircle } from 'lucide-react';

export const BuyerProducePage: React.FC = () => {
  const [produce, setProduce] = useState<HarvestProduce[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBuyerPortalAvailableProduce()
      .then(setProduce)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = produce.filter(p => 
    p.crop.toLowerCase().includes(search.toLowerCase()) || 
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Available Verified Produce</h1>
          <p className="text-xs text-stone-500 mt-1">
            Produce lots inspected and classified for Grade A procurement.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search produce lots by crop or batch ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-xs">Loading produce lots...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#163B2F] flex items-center justify-center font-mono font-bold text-xs">
                    {p.id}
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900">{p.crop} ({p.variety})</h3>
                    <span className="text-xs text-stone-400">Harvest Date: {p.harvest_date}</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
                  {p.grade}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 text-[11px]">Available Volume</span>
                  <div className="font-extrabold text-stone-900 text-sm">{p.quantity} {p.unit}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-stone-400 text-[11px]">Inspection Status</span>
                  <div className="font-bold text-emerald-800 text-xs flex items-center gap-1 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    {p.inspection_status}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-600 space-y-1">
                <div>Damage Rate: <strong className="text-stone-800">{p.damage_pct}%</strong> (Max allowable: 1.5%)</div>
                <div>Disease Symptoms: <strong className="text-stone-800">{p.disease_pct}%</strong> (Max allowable: 0.5%)</div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => alert(`Purchase request submitted for Batch ${p.id} (${p.quantity} ${p.unit} ${p.crop}). Cooperative staff will confirm logistics.`)}
                  className="w-full py-2.5 bg-[#163B2F] hover:bg-[#1B4D3E] text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Request Procurement Lot
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
