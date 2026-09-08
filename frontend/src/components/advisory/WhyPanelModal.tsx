import React from 'react';
import { Recommendation } from '../../types';
import { Badge } from '../common/Badge';
import { X, CheckCircle2, XCircle, AlertCircle, BookOpen, Calculator } from 'lucide-react';

interface WhyPanelModalProps {
  isOpen: boolean;
  recommendation: Recommendation | null;
  onClose: () => void;
}

export const WhyPanelModal: React.FC<WhyPanelModalProps> = ({ isOpen, recommendation, onClose }) => {
  if (!isOpen || !recommendation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl border border-stone-200 my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                RULE {recommendation.rule_id} v{recommendation.rule_version}
              </span>
              <Badge type={recommendation.rule_status === 'APPROVED' ? 'approved' : 'custom'} text={recommendation.rule_status} />
            </div>
            <h3 className="text-xl font-bold text-stone-900 mt-1">Why this recommendation?</h3>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto space-y-6 pt-4 pr-1">
          {/* Recommendation Text */}
          <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-4">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">Recommended Action</div>
            <p className="text-sm font-medium text-stone-900 leading-relaxed">
              {recommendation.recommendation_text}
            </p>
            <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-stone-600">
              <div>Estimated Cost: <span className="text-stone-900">₹{recommendation.estimated_cost.toLocaleString()}</span></div>
              <div>Feasibility Score: <span className="text-emerald-700 font-bold">{recommendation.feasibility_score}/100</span></div>
            </div>
          </div>

          {/* Resources Checked Breakdown */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Resource & Condition Constraints Checked
            </h4>

            <div className="space-y-2.5">
              {recommendation.constraints.map((c, idx) => (
                <div key={idx} className="border border-stone-200 rounded-xl p-3.5 bg-white text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-stone-800">{c.constraint_name}</span>
                    {c.status === 'PASS' && (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                      </span>
                    )}
                    {c.status === 'PARTIAL' && (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        <AlertCircle className="w-3.5 h-3.5" /> PARTIAL
                      </span>
                    )}
                    {c.status === 'FAIL' && (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        <XCircle className="w-3.5 h-3.5" /> FAIL
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-stone-600 my-1 font-medium bg-stone-50 p-2 rounded-lg">
                    <div>Required: <span className="text-stone-900 font-semibold">{c.required_val}</span></div>
                    <div>Available: <span className="text-stone-900 font-semibold">{c.available_val}</span></div>
                  </div>

                  {c.details && (
                    <div className="text-stone-500 text-[11px] mt-1">{c.details}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feasibility Scoring Formula */}
          <div className="bg-emerald-950 text-white rounded-xl p-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-300 mb-2">
              <Calculator className="w-4 h-4" /> Feasibility Score Formula
            </div>
            <p className="text-emerald-100/90 leading-relaxed font-mono text-[11px]">
              Score = 30%(Agronomic Match) + 20%(Budget) + 15%(Equipment) + 15%(Inputs) + 10%(Labor) + 10%(Local Conditions)
            </p>
            <p className="text-emerald-300/60 text-[10px] mt-2 italic border-t border-emerald-800/50 pt-2">
              Note: These weights are project-defined decision-support weights and are not claimed to be scientifically validated.
            </p>
          </div>

          {/* Agronomy Evidence & Citation */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-stone-800">
              <BookOpen className="w-4 h-4 text-stone-600" /> Agronomy Evidence & Source
            </div>
            <div><span className="text-stone-500">Source:</span> <span className="font-semibold text-stone-800">{recommendation.evidence_source || 'Verified Agronomy Advisory Database'}</span></div>
            <div><span className="text-stone-500">Citation Ref:</span> <span className="font-semibold text-stone-800">{recommendation.evidence_reference || recommendation.rule_id}</span></div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-stone-100 flex justify-end shrink-0 mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-[#0F291E] bg-[#B4F042] hover:bg-[#A1E02F] rounded-xl transition"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
