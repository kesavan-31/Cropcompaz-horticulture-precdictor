import React, { useState } from 'react';
import { Package, Filter, Search, TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

const DEMO_PRODUCE = [
  { id: 'H001', farmer: 'Uma (F024)', crop: 'Chilli', variety: 'Local', date: '2026-09-25', qty: 250, unit: 'kg', grade: 'A', status: 'Inspected', buyer: 'Chennai Export Hub', damage: 1.2, disease: 0.5 },
  { id: 'H002', farmer: 'Saravanan (F027)', crop: 'Capsicum', variety: 'Hybrid', date: '2026-09-26', qty: 380, unit: 'kg', grade: 'A', status: 'Inspected', buyer: 'FreshMart Retail Chain', damage: 0.8, disease: 0.3 },
  { id: 'H003', farmer: 'Ramesh Kumar (F001)', crop: 'Tomato', variety: 'Hybrid', date: '2026-09-27', qty: 520, unit: 'kg', grade: 'B', status: 'Inspected', buyer: 'Coimbatore Wholesale Market', damage: 3.5, disease: 1.2 },
  { id: 'H004', farmer: 'Geetha (F028)', crop: 'Tomato', variety: 'Hybrid', date: '2026-09-28', qty: 190, unit: 'kg', grade: 'B', status: 'Pending', buyer: '—', damage: null, disease: null },
  { id: 'H005', farmer: 'Selvi (F002)', crop: 'Chilli', variety: 'Local', date: '2026-09-29', qty: 140, unit: 'kg', grade: '—', status: 'Pending', buyer: '—', damage: null, disease: null },
];

const GRADE_COLORS: Record<string, string> = {
  A: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  B: 'bg-blue-50 text-blue-700 border border-blue-200',
  C: 'bg-amber-50 text-amber-700 border border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border border-red-200',
  '—': 'bg-stone-100 text-stone-500',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Inspected: <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />,
  Pending: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  Rejected: <XCircle className="w-3.5 h-3.5 text-red-500" />,
};

export const ProducePage: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = DEMO_PRODUCE.filter(p =>
    p.farmer.toLowerCase().includes(search.toLowerCase()) ||
    p.crop.toLowerCase().includes(search.toLowerCase())
  );

  const gradeA = DEMO_PRODUCE.filter(p => p.grade === 'A').length;
  const gradeB = DEMO_PRODUCE.filter(p => p.grade === 'B').length;
  const pending = DEMO_PRODUCE.filter(p => p.status === 'Pending').length;

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Produce</h1>
          <p className="text-xs text-stone-500 mt-1">Harvest batches, quality grades, and buyer compatibility.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Batches', value: DEMO_PRODUCE.length, icon: Package, color: 'text-stone-700' },
          { label: 'Grade A', value: gradeA, icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Grade B', value: gradeB, icon: TrendingUp, color: 'text-blue-600' },
          { label: 'Pending Inspection', value: pending, icon: Clock, color: 'text-amber-600' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-stone-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs text-stone-500 font-medium">{card.label}</span>
            </div>
            <div className={`text-2xl font-extrabold ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search by farmer or crop..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-600 border border-stone-200 bg-white rounded-xl hover:bg-stone-50">
          <Filter className="w-4 h-4" />
          Filter
        </button>
      </div>

      {/* Produce Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/50">
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Batch</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Farmer</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Crop</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Qty</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Date</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Grade</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Buyer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-bold text-stone-500">{p.id}</td>
                  <td className="px-5 py-3.5 text-stone-700 font-medium">{p.farmer}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-stone-800">{p.crop}</div>
                    <div className="text-xs text-stone-400">{p.variety}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-stone-700">{p.qty} {p.unit}</td>
                  <td className="px-5 py-3.5 text-stone-500 text-xs">{p.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${GRADE_COLORS[p.grade]}`}>
                      {p.grade !== '—' ? `Grade ${p.grade}` : '—'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {STATUS_ICONS[p.status]}
                      <span className="text-xs font-medium text-stone-600">{p.status}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-stone-500">{p.buyer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        <strong>Note:</strong> Produce data shown is demo/synthetic. Connect to the harvest API to manage real produce batches and quality records.
      </div>
    </div>
  );
};
