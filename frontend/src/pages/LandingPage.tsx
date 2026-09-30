import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Sprout, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { user, portalType } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && portalType === 'farmer') {
      navigate('/farmer/dashboard');
    } else if (user && portalType === 'buyer') {
      navigate('/buyer/dashboard');
    }
  }, [user, portalType, navigate]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans">
      {/* Header */}
      <header className="h-20 border-b border-stone-200/80 bg-white/70 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#163B2F] flex items-center justify-center text-[#B4F042] shadow-sm">
            <Leaf className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0F291E] tracking-tight">CropCompaz</h1>
            <p className="text-[10px] font-bold text-emerald-800 tracking-wide uppercase">Horticulture Intelligence</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="text-center space-y-4 mb-12">
          <span className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-bold uppercase tracking-wider">
            Decision-Support Platform
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F291E] tracking-tight leading-tight">
            Guiding Every Crop Decision<br />with the Resources You Have.
          </h1>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
            Deterministic agronomy advice evaluated against farm budgets, equipment, labor, water, and buyer quality standards.
          </p>
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto w-full">
          {/* Farmer Portal Card */}
          <div 
            onClick={() => navigate('/farmer/login')}
            className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#163B2F] flex items-center justify-center group-hover:bg-[#163B2F] group-hover:text-[#B4F042] transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 group-hover:text-[#163B2F]">
                  Farmer Portal
                </h2>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Sign in to access personalized crop advisories, evaluate resource constraints, and track harvest lots.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#163B2F]">Enter Portal</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#B4F042] flex items-center justify-center text-stone-700 group-hover:text-[#0F291E] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Buyer Portal Card */}
          <div 
            onClick={() => navigate('/buyer/login')}
            className="bg-white rounded-3xl p-8 border border-stone-200/80 shadow-sm hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#163B2F] flex items-center justify-center group-hover:bg-[#163B2F] group-hover:text-[#B4F042] transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-stone-900 group-hover:text-[#163B2F]">
                  Buyer Portal
                </h2>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Sign in to define grade requirements, view verified harvest batches, and inspect quality compliance.
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
              <span className="text-xs font-bold text-[#163B2F]">Enter Portal</span>
              <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-[#B4F042] flex items-center justify-center text-stone-700 group-hover:text-[#0F291E] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Features bar */}
        <div className="mt-16 pt-8 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>50+ TNAU & ICAR verified agronomy rules</span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Deterministic 6-tier resource constraint checking</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Grade A produce quality & buyer compliance</span>
          </div>
        </div>
      </main>
    </div>
  );
};
