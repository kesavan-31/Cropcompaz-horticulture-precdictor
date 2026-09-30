import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { BuyerRequirement, HarvestProduce } from '../../types';
import { Building2, Package, FileCheck, CheckCircle2, Award, ArrowRight, ShoppingBag } from 'lucide-react';

export const BuyerDashboardPage: React.FC = () => {
  const [requirements, setRequirements] = useState<BuyerRequirement[]>([]);
  const [produce, setProduce] = useState<HarvestProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.getBuyerPortalRequirements().catch(() => []),
      api.getBuyerPortalAvailableProduce().catch(() => [])
    ]).then(([reqs, prods]) => {
      setRequirements(reqs);
      setProduce(prods);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Banner */}
      <div className="bg-[#163B2F] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="text-emerald-300 text-sm font-medium mb-1">Procurement Portal</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Produce Sourcing & Quality Matching
          </h1>
          <p className="text-emerald-100/80 text-xs mb-6 leading-relaxed">
            Directly connect with cooperative farmer batches verified against your Grade A export and wholesale specifications.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/buyer/produce')}
              className="px-5 py-2.5 bg-[#B4F042] text-[#0F291E] font-bold text-xs rounded-xl hover:bg-[#A1E02F] transition shadow-md flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#0F291E]" />
              View Available Produce
            </button>
            <button
              onClick={() => navigate('/buyer/requirements')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
            >
              Manage Quality Requirements
            </button>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-10 text-[#B4F042] pointer-events-none">
          <Building2 className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Active Crop Specs</div>
          <div className="text-2xl font-extrabold text-[#163B2F]">{requirements.length}</div>
          <div className="text-[11px] text-stone-400 mt-1">Grade A Quality Specs</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Matching Verified Batches</div>
          <div className="text-2xl font-extrabold text-emerald-700">{produce.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">100% Inspected & Passed</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Available Quantity</div>
          <div className="text-2xl font-extrabold text-blue-800">
            {produce.reduce((sum, p) => sum + p.quantity, 0)} kg
          </div>
          <div className="text-[11px] text-stone-400 mt-1">Direct from farmers</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Traceability Verification</div>
          <div className="text-2xl font-extrabold text-purple-900">Verified</div>
          <div className="text-[11px] text-purple-700 font-medium mt-1">Farm & Agronomy History</div>
        </div>
      </div>

      {/* Available Produce Overview */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">Verified Harvest Batches Available for Sourcing</h2>
          <button
            onClick={() => navigate('/buyer/produce')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            View All Batches <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {produce.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 font-mono">Batch {p.id}</span>
                  <span className="font-semibold text-emerald-900">{p.crop} ({p.variety})</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                    {p.grade}
                  </span>
                </div>
                <div className="text-stone-500">
                  Harvested: {p.harvest_date} · Damage: {p.damage_pct}% · Disease: {p.disease_pct}% · Zero Residue
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-extrabold text-stone-900">{p.quantity} {p.unit}</div>
                <div className="text-[11px] text-emerald-700 font-semibold">{p.inspection_status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
