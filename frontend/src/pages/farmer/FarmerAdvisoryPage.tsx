import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Farmer, Recommendation } from '../../types';
import { Sparkles, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { WhyPanelModal } from '../../components/advisory/WhyPanelModal';

export const FarmerAdvisoryPage: React.FC = () => {
  const [farm, setFarm] = useState<Farmer | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWhyRec, setSelectedWhyRec] = useState<Recommendation | null>(null);

  useEffect(() => {
    api.getFarmerPortalProfile().then(setFarm).catch(console.error);
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateFarmerPortalAdvisory();
      setResult(res);
    } catch (err: any) {
      alert(err.detail?.message || err.message || 'Error generating advisory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">Generate Farm Advisory</h1>
        <p className="text-xs text-stone-500 mt-1">
          Deterministic constraint evaluation against verified agronomy rules from TNAU & ICAR.
        </p>
      </div>

      {farm && (
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Active Crop Target</span>
            <div className="text-base font-extrabold text-stone-900">{farm.crop} ({farm.variety}) · {farm.growth_stage}</div>
            <div className="text-xs text-stone-500">Farm: {farm.farm_size} Acres · Budget: ₹{farm.budget.toLocaleString()} · Water: {farm.water_availability}</div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-5 py-2.5 bg-[#163B2F] hover:bg-[#1B4D3E] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-[#B4F042]" />
            {loading ? 'Evaluating Constraints...' : 'Evaluate & Advise'}
          </button>
        </div>
      )}

      {/* Advisory Result Cards */}
      {result && result.primary_recommendation && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
                Primary Recommendation
              </span>
              <Badge 
                type={
                  result.primary_recommendation.feasibility_status === 'HIGHLY_FEASIBLE' ? 'feasible' :
                  result.primary_recommendation.feasibility_status === 'PARTIALLY_FEASIBLE' ? 'partial' : 'not_feasible'
                } 
              />
            </div>

            <div className="text-sm font-semibold text-stone-900 leading-relaxed">
              {result.primary_recommendation.recommendation_text}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">Rule ID</span>
                <div className="text-xs font-bold text-stone-800 font-mono">{result.primary_recommendation.rule_id} v{result.primary_recommendation.rule_version}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">Estimated Cost</span>
                <div className="text-xs font-bold text-stone-800">₹{result.primary_recommendation.estimated_cost?.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">Feasibility Score</span>
                <div className="text-xs font-bold text-emerald-700">{result.primary_recommendation.feasibility_score}%</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">Evidence Source</span>
                <div className="text-xs font-bold text-stone-800 truncate">{result.primary_recommendation.evidence_source || "TNAU"}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWhyRec(result.primary_recommendation)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4 text-stone-600" />
                Why This Recommendation?
              </button>
            </div>
          </div>

          {/* Alternative recommendation if available */}
          {result.alternative_recommendation && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-bold">
                  Alternative Low-Resource Option
                </span>
                <Badge 
                  type={
                    result.alternative_recommendation.feasibility_status === 'HIGHLY_FEASIBLE' ? 'feasible' :
                    result.alternative_recommendation.feasibility_status === 'PARTIALLY_FEASIBLE' ? 'partial' : 'not_feasible'
                  } 
                />
              </div>

              <div className="text-sm font-semibold text-stone-900 leading-relaxed">
                {result.alternative_recommendation.recommendation_text}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">Rule ID</span>
                  <div className="text-xs font-bold text-stone-800 font-mono">{result.alternative_recommendation.rule_id}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">Estimated Cost</span>
                  <div className="text-xs font-bold text-stone-800">₹{result.alternative_recommendation.estimated_cost?.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">Feasibility Score</span>
                  <div className="text-xs font-bold text-emerald-700">{result.alternative_recommendation.feasibility_score}%</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">Evidence Source</span>
                  <div className="text-xs font-bold text-stone-800 truncate">{result.alternative_recommendation.evidence_source || "TNAU"}</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedWhyRec(result.alternative_recommendation)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <HelpCircle className="w-4 h-4 text-stone-600" />
                  Why This Alternative?
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <WhyPanelModal
        isOpen={Boolean(selectedWhyRec)}
        recommendation={selectedWhyRec}
        onClose={() => setSelectedWhyRec(null)}
      />
    </div>
  );
};
