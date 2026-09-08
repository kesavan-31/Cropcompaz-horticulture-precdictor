import React from 'react';
import { Clock, Layers } from 'lucide-react';

interface GenericPlannedPageProps {
  title: string;
  phase: 'Phase 2' | 'Phase 3';
  description: string;
}

export const GenericPlannedPage: React.FC<GenericPlannedPageProps> = ({ title, phase, description }) => {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">{title}</h1>
        <p className="text-xs text-stone-500 mt-1">{description}</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center my-8 shadow-xs max-w-xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#163B2F] flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <Clock className="w-6 h-6" />
        </div>

        <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-extrabold rounded-full uppercase tracking-wider mb-3">
          Planned for {phase}
        </span>

        <h3 className="text-lg font-bold text-stone-900 mb-2">{title} Module</h3>
        <p className="text-xs text-stone-600 leading-relaxed max-w-md mx-auto">
          This feature is scheduled for expansion in {phase}. Phase 1 currently implements core Farmer Profiles, Resource Constraints, Agronomy Rule Versioning, Recommendation Engine, Feasibility Scoring, Alternatives, and Baseline Experiments.
        </p>

        <div className="mt-6 text-[11px] text-stone-400 font-medium">
          CropCompass Roadmap · Phase 1 Active Prototype
        </div>
      </div>
    </div>
  );
};
