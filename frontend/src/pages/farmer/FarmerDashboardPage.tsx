import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Farmer, Recommendation } from '../../types';
import { 
  Sprout, 
  Sparkles, 
  Package, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  Coins,
  Users,
  Droplets,
  Wrench,
  MapPin
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { WhyPanelModal } from '../../components/advisory/WhyPanelModal';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerDashboardPage: React.FC = () => {
  const [farm, setFarm] = useState<Farmer | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWhyRec, setSelectedWhyRec] = useState<Recommendation | null>(null);
  const { t, lang } = useLanguage();
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
          <div className="text-emerald-300 text-sm font-medium mb-1">{t('welcomeBack')}</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            {farm ? `${farm.name} · ${t('farmDashboard')}` : t('farmDashboard')}
          </h1>
          <p className="text-emerald-100/80 text-xs mb-6 leading-relaxed">
            {farm 
              ? `${farm.crop} (${farm.growth_stage}) · ${farm.farm_size} ${t('acres')} · ${farm.location}` 
              : t('resourceAwareAdvisory')
            }
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/farmer/advisory')}
              className="px-5 py-2.5 bg-[#B4F042] text-[#0F291E] font-bold text-xs rounded-xl hover:bg-[#A1E02F] transition shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              {t('generateAdvisory')}
            </button>
            <button
              onClick={() => navigate('/farmer/farm')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition"
            >
              {t('viewResources')}
            </button>
          </div>
        </div>

        <div className="absolute -right-8 -bottom-8 opacity-10 text-[#B4F042] pointer-events-none">
          <Sprout className="w-64 h-64" />
        </div>
      </div>

      {/* KPI Stats — Highlighting Budget, Labours, Irrigation & Equipments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Crop */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-500 mb-1">{t('currentCrop')}</div>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-[#163B2F] truncate">{farm?.crop || "—"}</div>
          <div className="text-[11px] text-stone-400 mt-1 truncate">
            {farm?.variety || "Local"} · {farm?.growth_stage || ""}
          </div>
        </div>

        {/* Card 2: Labours & Farm Size */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-500 mb-1">{t('farmSizeLabours')}</div>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-stone-900">
            {farm?.workers || 1} <span className="text-xs font-normal text-stone-500">{t('persons')}</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {farm?.farm_size ? `${farm.farm_size} ${t('acres')}` : "—"} · {t('workersAvailable')}
          </div>
        </div>

        {/* Card 3: Available Budget */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-500 mb-1">{t('availableBudget')}</div>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-800">
            ₹{farm?.budget?.toLocaleString() || "0"}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {t('waterAvailability')}: {farm?.water_availability || "Limited"}
          </div>
        </div>

        {/* Card 4: Irrigation & Equipment */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold text-stone-500 mb-1">{t('irrigationEquip')}</div>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-stone-900 truncate">
            {farm?.irrigation_available || "Drip / Canal"}
          </div>
          <div className="text-[11px] text-stone-400 mt-1">
            {farm?.equipment ? `${farm.equipment.length} ${t('availableEquipments')}` : "0 Equipments"}
          </div>
        </div>
      </div>

      {/* Farm Resource & Field Constraints Snapshot */}
      {farm && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              {t('farmResourcesConstraints')}
            </h2>
            <button
              onClick={() => navigate('/farmer/farm')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              {t('viewResources')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Budget */}
            <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
              <span className="text-[11px] font-semibold text-emerald-800">{t('availableBudget')}</span>
              <div className="text-sm font-extrabold text-emerald-950 mt-0.5">₹{farm.budget.toLocaleString()}</div>
            </div>

            {/* Labours / Workers */}
            <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl">
              <span className="text-[11px] font-semibold text-amber-800">{t('laboursWorkers')}</span>
              <div className="text-sm font-extrabold text-amber-950 mt-0.5">{farm.workers} {t('persons')}</div>
            </div>

            {/* Irrigation Methods */}
            <div className="p-3 bg-blue-50/60 border border-blue-200/60 rounded-xl">
              <span className="text-[11px] font-semibold text-blue-800">{t('irrigationMethods')}</span>
              <div className="text-sm font-extrabold text-blue-950 mt-0.5">{farm.irrigation_available} ({farm.water_source})</div>
            </div>

            {/* Equipment Inventory */}
            <div className="p-3 bg-stone-50 border border-stone-200/80 rounded-xl">
              <span className="text-[11px] font-semibold text-stone-600">{t('availableEquipments')}</span>
              <div className="text-xs font-bold text-stone-800 mt-0.5 truncate">
                {farm.equipment && farm.equipment.length > 0 
                  ? farm.equipment.map(e => e.equipment_name).join(', ') 
                  : t('noEquipment')
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Recommendations */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">{t('myCropRecs')}</h2>
          <button
            onClick={() => navigate('/farmer/recommendations')}
            className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
          >
            {t('viewAllHistory')} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-xs text-stone-400 border border-dashed border-stone-200 rounded-xl">
            {t('noRecsYet')}
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.slice(0, 3).map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-emerald-900">{t('ruleId')} {rec.rule_id} v{rec.rule_version}</span>
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
                    {t('estimatedCost')}: ₹{rec.estimated_cost?.toLocaleString()} · {t('feasibilityScore')}: {rec.feasibility_score}%
                  </div>
                </div>

                <button
                  onClick={() => setSelectedWhyRec(rec)}
                  className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 shrink-0 font-semibold"
                  title={t('whyRecommendation')}
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
