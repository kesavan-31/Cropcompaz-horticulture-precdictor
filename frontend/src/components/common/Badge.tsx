import React from 'react';

interface BadgeProps {
  type: 'synthetic' | 'feasible' | 'partial' | 'not_feasible' | 'demo' | 'approved' | 'human_review' | 'custom';
  text?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, text, className = '' }) => {
  switch (type) {
    case 'synthetic':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EBFBEE] text-[#15803D] border border-emerald-200/60 uppercase tracking-wider ${className}`}>
          SYNTHETIC
        </span>
      );
    case 'feasible':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 ${className}`}>
          HIGHLY FEASIBLE
        </span>
      );
    case 'partial':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200 ${className}`}>
          PARTIALLY FEASIBLE
        </span>
      );
    case 'not_feasible':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200 ${className}`}>
          NOT FEASIBLE
        </span>
      );
    case 'demo':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold bg-amber-500 text-white shadow-sm ${className}`}>
          <span>⚠️</span> DEMO RULE — NOT VERIFIED AGRONOMY GUIDANCE
        </span>
      );
    case 'approved':
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-700 text-white ${className}`}>
          APPROVED
        </span>
      );
    case 'human_review':
      return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-900 border border-purple-300 ${className}`}>
          HUMAN CONFIRMATION REQUIRED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 ${className}`}>
          {text}
        </span>
      );
  }
};
