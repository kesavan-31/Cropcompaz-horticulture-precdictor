import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, AlertCircle, Filter, Search, Award, FileText } from 'lucide-react';

const DEMO_INSPECTIONS = [
  { id: 'INS-101', farmer: 'Uma (F024)', crop: 'Chilli', batch: 'H001', inspector: 'S. Raman (Agronomist)', date: '2026-09-28', grade: 'Grade A', score: 94, status: 'Passed', buyer: 'Chennai Export Hub', notes: 'Optimal size (8-10 cm), vibrant color, <1% pest damage.' },
  { id: 'INS-102', farmer: 'Saravanan (F027)', crop: 'Capsicum', batch: 'H002', inspector: 'M. Kavitha (Coop Staff)', date: '2026-09-28', grade: 'Grade A', score: 91, status: 'Passed', buyer: 'FreshMart Retail Chain', notes: 'Firm texture, zero disease symptoms, uniform sizing.' },
  { id: 'INS-103', farmer: 'Ramesh Kumar (F001)', crop: 'Tomato', batch: 'H003', inspector: 'S. Raman (Agronomist)', date: '2026-09-29', grade: 'Grade B', score: 82, status: 'Passed', buyer: 'Coimbatore Wholesale Market', notes: 'Minor surface blemishes (3.5% damage), within wholesale tolerance.' },
  { id: 'INS-104', farmer: 'Geetha (F028)', crop: 'Tomato', batch: 'H004', inspector: 'M. Kavitha (Coop Staff)', date: '2026-09-29', grade: 'Grade C', score: 68, status: 'Review Required', buyer: 'Local Market', notes: 'Irregular fruit sizing and moderate blossom rot.' },
];

export const QualityPage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = DEMO_INSPECTIONS.filter(i => 
    i.farmer.toLowerCase().includes(search.toLowerCase()) || 
    i.crop.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Quality Intelligence</h1>
          <p className="text-xs text-stone-500 mt-1">Quality inspection workflows, grade evaluations, and buyer compliance verification.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Inspections Completed', value: '48', icon: CheckCircle2, color: 'text-emerald-700' },
          { label: 'Grade A Compliance', value: '76.5%', icon: Award, color: 'text-blue-700' },
          { label: 'Avg Quality Score', value: '88.4 / 100', icon: ShieldCheck, color: 'text-[#163B2F]' },
          { label: 'Reviews Needed', value: '3', icon: AlertCircle, color: 'text-amber-600' },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-stone-500 font-medium">{card.label}</span>
            </div>
            <div className={`text-2xl font-extrabold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Search and Table */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search inspections by farmer or crop..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 border border-stone-200 bg-white rounded-xl hover:bg-stone-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Inspection ID</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Farmer</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Crop / Batch</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Inspector</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Grade Score</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Assigned Buyer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-stone-600">{item.id}</td>
                  <td className="px-5 py-3.5 font-medium text-stone-800">{item.farmer}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-stone-800">{item.crop}</div>
                    <div className="text-xs text-stone-400 font-mono">Batch {item.batch}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-stone-600">{item.inspector}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {item.grade} ({item.score}/100)
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-stone-700">{item.status}</td>
                  <td className="px-5 py-3.5 text-xs text-stone-500">{item.buyer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
