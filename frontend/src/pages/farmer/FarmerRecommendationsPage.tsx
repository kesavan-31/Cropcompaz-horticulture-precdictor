import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Recommendation } from '../../types';
import { History, HelpCircle, Sparkles } from 'lucide-react';
import { Badge } from '../../components/common/Badge';
import { WhyPanelModal } from '../../components/advisory/WhyPanelModal';

export const FarmerRecommendationsPage: React.FC = () => {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWhyRec, setSelectedWhyRec] = useState<Recommendation | null>(null);

  useEffect(() => {
    api.getFarmerPortalRecommendations()
      .then(setRecs)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">Recommendation History</h1>
        <p className="text-xs text-stone-500 mt-1">Audit log of all past resource-evaluated recommendations for your farm.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-xs">Loading history...</div>
      ) : recs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8">
          <History className="w-8 h-8 text-stone-300 mx-auto mb-2" />
          <p className="text-xs text-stone-500">No recommendation history recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recs.map((rec) => (
            <div key={rec.id} className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-sm flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-emerald-900 font-mono">Rule {rec.rule_id} v{rec.rule_version}</span>
                  <Badge 
                    type={
                      rec.feasibility_status === 'HIGHLY_FEASIBLE' ? 'feasible' :
                      rec.feasibility_status === 'PARTIALLY_FEASIBLE' ? 'partial' : 'not_feasible'
                    } 
                  />
                  <span className="text-[11px] text-stone-400">{new Date(rec.created_at).toLocaleString()}</span>
                </div>
                <p className="text-stone-800 font-medium leading-relaxed">
                  {rec.recommendation_text}
                </p>
                <div className="text-[11px] text-stone-500 pt-1">
                  Estimated Cost: ₹{rec.estimated_cost?.toLocaleString()} · Feasibility Score: {rec.feasibility_score}%
                </div>
              </div>

              <button
                onClick={() => setSelectedWhyRec(rec)}
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 hover:bg-stone-100 shrink-0"
                title="View Explanation"
              >
                <HelpCircle className="w-4 h-4 text-stone-600" />
              </button>
            </div>
          ))}
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
