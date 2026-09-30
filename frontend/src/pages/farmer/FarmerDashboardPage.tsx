import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Farmer, Recommendation } from '../../types';
import { Sprout, Sparkles, Package, ShieldCheck, ArrowRight, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { WhyPanelModal } from '../../components/advisory/WhyPanelModal';

export const FarmerDashboardPage: React.FC = () => {
  const [farm, setFarm] = useState<Farmer | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWhyRec, setSelectedWhyRec] = useState<Recommendation | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFarmerData();
  }, []);

  const loadFarmerData = async () => {
    try {
      setLoading(true);
      const [farmData, recData] = await Promise.all([
        api.getFarmerPortalProfile().catch(() => null),
        api.getFarmerPortalRecommendations().catch(() => [])
      ]);
      setFarm(farmData);
      setRecommendations(recData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Banner */}
      <div className="bg-[#163B2F] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="text-emerald-300 text-sm font-medium mb-1">Welcome back</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {farm ? `${farm.name}'s Farm Dashboard` : "My Farm Dashboard"}
          </h1>
          <p className="text-emerald-100/80 text-xs mb-6 leading-relaxed">
            {farm ? `Managing ${farm.farm_size} acres of ${farm.crop} (${farm.growth_stage} stage) in ${farm.location}.` : "Resource-aware advisory for your horticulture crops."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/farmer/advisory')}
              className="px-5 py-2.5 bg-[#B4F042] text-[#0F291E] font-bold text-xs rounded-xl hover:bg-[#A1E02F] transition shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              Generate Farm Advisory
            </button>
            <button
              onClick={() => navigate('/farmer/farm')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
            >
              View My Farm Resources
            </button>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-10 text-[#B4F042] pointer-events-none">
          <Sprout className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Current Crop</div>
          <div className="text-2xl font-extrabold text-[#163B2F]">{farm?.crop || "—"}</div>
          <div className="text-[11px] text-stone-400 mt-1">{farm?.variety || "Local"} · {farm?.growth_stage || ""}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Farm Size</div>
          <div className="text-2xl font-extrabold text-stone-900">{farm?.farm_size ? `${farm.farm_size} Acres` : "—"}</div>
          <div className="text-[11px] text-stone-400 mt-1">{farm?.workers || 1} Workers Available</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Available Budget</div>
          <div className="text-2xl font-extrabold text-stone-900">₹{farm?.budget?.toLocaleString() || "0"}</div>
          <div className="text-[11px] text-stone-400 mt-1">Water: {farm?.water_availability || "Limited"}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 mb-1">Active Advisory Recs</div>
          <div className="text-2xl font-extrabold text-emerald-700">{recommendations.length}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Evidence-backed guidance</div>
        </div>
      </div>

      {/* Recent Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">My Crop Recommendations</h2>
          <button
            onClick={() => navigate('/farmer/recommendations')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            View All History <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
            No advisory generated yet for this crop cycle. Click "Generate Farm Advisory" above.
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-900">Rule {rec.rule_id} v{rec.rule_version}</span>
                    <Badge 
                      type={
                        rec.feasibility_status === 'HIGHLY_FEASIBLE' ? 'feasible' :
                        rec.feasibility_status === 'PARTIALLY_FEASIBLE' ? 'partial' : 'not_feasible'
                      } 
                    />
                  </div>
                  <p className="text-stone-800 font-medium leading-relaxed">
                    {rec.recommendation_text}
                  </p>
                  <div className="text-[11px] text-stone-500 pt-1">
                    Estimated Cost: ₹{rec.estimated_cost?.toLocaleString()} · Score: {rec.feasibility_score}%
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWhyRec(rec)}
                  className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 shrink-0 font-semibold"
                  title="View Reason & Constraints"
                >
                  <HelpCircle className="w-4 h-4 text-stone-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <WhyPanelModal
        isOpen={Boolean(selectedWhyRec)}
        recommendation={selectedWhyRec}
        onClose={() => setSelectedWhyRec(null)}
      />
    </div>
  );
};
