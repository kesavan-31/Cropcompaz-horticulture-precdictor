import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Farmer, Recommendation } from '../../types';
import { Sparkles, CheckCircle, AlertTriangle, ShieldCheck, HelpCircle, ArrowRight, Coins, Users, Droplets, Wrench } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { WhyPanelModal } from '../../components/advisory/WhyPanelModal';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerAdvisoryPage: React.FC = () => {
  const [farm, setFarm] = useState<Farmer | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedWhyRec, setSelectedWhyRec] = useState<Recommendation | null>(null);
  const { t, lang } = useLanguage();

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
        <h1 className="text-2xl font-extrabold text-[#0F291E]">{t('generateAdvisory')}</h1>
        <p className="text-xs text-stone-500 mt-1">
          {t('resourceAwareAdvisory')}
        </p>
      </div>

      {farm && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">{t('cropTarget')}</span>
              <div className="text-lg font-extrabold text-stone-900">
                {farm.crop} ({farm.variety}) · {farm.growth_stage}
              </div>
              <div className="text-xs text-stone-500">
                {farm.farm_size} {t('acres')} · {farm.location}
              </div>
            </div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-3 bg-[#163B2F] hover:bg-[#1B4D3E] text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2 disabled:opacity-50 self-start sm:self-auto"
            >
              <Sparkles className="w-4 h-4 text-[#B4F042]" />
              {loading ? t('evaluatingConstraints') : t('evaluateAndAdvise')}
            </button>
          </div>

          {/* Explicit Resource Constraints Context for Advisory Engine */}
          <div className="pt-2 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl flex items-center gap-2.5">
              <Coins className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-emerald-800">{t('availableBudget')}</div>
                <div className="text-xs font-bold text-emerald-950">₹{farm.budget.toLocaleString()}</div>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl flex items-center gap-2.5">
              <Users className="w-4 h-4 text-amber-700 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-amber-800">{t('laboursWorkers')}</div>
                <div className="text-xs font-bold text-amber-950">{farm.workers} {t('persons')}</div>
              </div>
            </div>

            <div className="p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-700 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold text-blue-800">{t('irrigationMethods')}</div>
                <div className="text-xs font-bold text-blue-950 truncate">{farm.irrigation_available}</div>
              </div>
            </div>

            <div className="p-2.5 bg-stone-50 border border-stone-200/80 rounded-xl flex items-center gap-2.5">
              <Wrench className="w-4 h-4 text-stone-600 shrink-0" />
              <div className="overflow-hidden">
                <div className="text-[10px] font-semibold text-stone-600">{t('availableEquipments')}</div>
                <div className="text-xs font-bold text-stone-800 truncate">
                  {farm.equipment && farm.equipment.length > 0
                    ? farm.equipment.map(e => e.equipment_name).join(', ')
                    : t('noEquipment')
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Advisory Result Cards */}
      {result && result.primary_recommendation && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-emerald-300 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-full text-xs font-bold">
                {t('primaryRec')}
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
                <span className="text-[11px] text-stone-400">{t('ruleId')}</span>
                <div className="text-xs font-bold text-stone-800 font-mono">{result.primary_recommendation.rule_id} v{result.primary_recommendation.rule_version}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">{t('estimatedCost')}</span>
                <div className="text-xs font-bold text-stone-800">₹{result.primary_recommendation.estimated_cost?.toLocaleString()}</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">{t('feasibilityScore')}</span>
                <div className="text-xs font-bold text-emerald-700">{result.primary_recommendation.feasibility_score}%</div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[11px] text-stone-400">{t('evidenceSource')}</span>
                <div className="text-xs font-bold text-stone-800 truncate">{result.primary_recommendation.evidence_source || "TNAU"}</div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWhyRec(result.primary_recommendation)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <HelpCircle className="w-4 h-4 text-stone-600" />
                {t('whyRecommendation')}
              </button>
            </div>
          </div>

          {/* Alternative recommendation if available */}
          {result.alternative_recommendation && (
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full text-xs font-bold">
                  {t('alternativeRec')}
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
                  <span className="text-[11px] text-stone-400">{t('ruleId')}</span>
                  <div className="text-xs font-bold text-stone-800 font-mono">{result.alternative_recommendation.rule_id}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">{t('estimatedCost')}</span>
                  <div className="text-xs font-bold text-stone-800">₹{result.alternative_recommendation.estimated_cost?.toLocaleString()}</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">{t('feasibilityScore')}</span>
                  <div className="text-xs font-bold text-emerald-700">{result.alternative_recommendation.feasibility_score}%</div>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl">
                  <span className="text-[11px] text-stone-400">{t('evidenceSource')}</span>
                  <div className="text-xs font-bold text-stone-800 truncate">{result.alternative_recommendation.evidence_source || "TNAU"}</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedWhyRec(result.alternative_recommendation)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <HelpCircle className="w-4 h-4 text-stone-600" />
                  {t('whyRecommendation')}
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
