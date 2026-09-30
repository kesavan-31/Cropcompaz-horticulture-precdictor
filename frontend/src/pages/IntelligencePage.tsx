import React from 'react';
import { BarChart3, TrendingUp, DollarSign, PieChart, ShieldCheck, Activity, Target } from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">Market & Crop Intelligence</h1>
        <p className="text-xs text-stone-500 mt-1">Analytics on recommendation volume, resource bottlenecks, feasibility distributions, and buyer grade matches.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <Activity className="w-4 h-4 text-[#163B2F]" />
            Feasibility Rate
          </div>
          <div className="text-2xl font-extrabold text-[#163B2F]">83.3%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">+31.7% vs baseline engine</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Agronomic Evidence Coverage
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">100.0%</div>
          <div className="text-[11px] text-stone-400 mt-1">TNAU, ICAR, NCONF verified</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <Target className="w-4 h-4 text-blue-600" />
            Grade-A Buyer Compatibility
          </div>
          <div className="text-2xl font-extrabold text-blue-800">78.2%</div>
          <div className="text-[11px] text-stone-400 mt-1">Export & Retail market fit</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <PieChart className="w-4 h-4 text-purple-600" />
            Primary Bottleneck
          </div>
          <div className="text-2xl font-extrabold text-purple-900">Budget (42%)</div>
          <div className="text-[11px] text-stone-400 mt-1">Equipment missing: 35%</div>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Constraint Failure Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#163B2F]" />
            Resource Constraint Failure Breakdown
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Budget Limitations', percent: 42, count: '25 scenarios', color: 'bg-rose-500' },
              { label: 'Equipment Missing (e.g. Drip/Sprayer)', percent: 35, count: '21 scenarios', color: 'bg-amber-500' },
              { label: 'Input Quantity Insufficient', percent: 15, count: '9 scenarios', color: 'bg-blue-500' },
              { label: 'Labor Availability Shortage', percent: 8, count: '5 scenarios', color: 'bg-purple-500' },
            ].map(item => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-stone-700">{item.label}</span>
                  <span className="text-stone-500">{item.percent}% ({item.count})</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Adoption & Review Rates */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Advisor Approval & Review Metrics
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-stone-50 rounded-xl">
              <span className="font-semibold text-stone-700">Auto-Approved Recommendations</span>
              <span className="font-bold text-emerald-700">82.4%</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-50 rounded-xl">
              <span className="font-semibold text-stone-700">Human Confirmation Required (High Risk)</span>
              <span className="font-bold text-amber-700">17.6%</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-50 rounded-xl">
              <span className="font-semibold text-stone-700">Advisor Override & Modifications</span>
              <span className="font-bold text-blue-700">4.8%</span>
            </div>
            <div className="flex justify-between p-3 bg-stone-50 rounded-xl">
              <span className="font-semibold text-stone-700">Farmer Adoption Feedback Score</span>
              <span className="font-bold text-purple-700">4.7 / 5.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
