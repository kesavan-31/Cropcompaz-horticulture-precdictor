import React, { useState } from 'react';
import { MessageSquare, History, Shield, Star, UserCheck, Clock, CheckCircle } from 'lucide-react';

const DEMO_FEEDBACK = [
  { id: 'FB-001', farmer: 'Uma (F024)', crop: 'Chilli', rating: 5, category: 'Very Useful', comment: 'Neem Oil recommendation was affordable (₹1,100) and saved my fruit development phase.', date: '2026-09-27' },
  { id: 'FB-002', farmer: 'Saravanan (F027)', crop: 'Capsicum', rating: 4, category: 'Useful', comment: 'Fertigation timing matched drip schedule well.', date: '2026-09-28' },
  { id: 'FB-003', farmer: 'Prakash (F021)', crop: 'Capsicum', rating: 5, category: 'Very Useful', comment: 'Manual weeding alternative worked within my ₹1,500 labor budget.', date: '2026-09-29' },
];

const DEMO_AUDIT_LOGS = [
  { id: 'LOG-301', user: 'admin@cropcompaz.local', role: 'Administrator', action: 'CREATE_RULE', entity: 'AgronomyRule (CC-TNAU-CH-001)', time: '2026-09-29 10:15:00', details: 'Added official TNAU Chilli pre-planting FYM rule.' },
  { id: 'LOG-302', user: 'advisor@cropcompaz.local', role: 'Agronomy Advisor', action: 'APPROVE_REC', entity: 'Recommendation #14', time: '2026-09-29 11:30:22', details: 'Approved high-impact pesticide spray for thrips outbreak.' },
  { id: 'LOG-303', user: 'staff@cropcompaz.local', role: 'Cooperative Staff', action: 'UPDATE_FARMER', entity: 'Farmer (F024 - Uma)', time: '2026-09-29 14:05:10', details: 'Updated water availability to Limited.' },
];

export const AuditPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'feedback' | 'audit'>('feedback');

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Feedback & Audit Trail</h1>
          <p className="text-xs text-stone-500 mt-1">Farmer recommendation feedback, advisor decisions, and system audit logs.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-200/60 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'feedback' ? 'bg-white text-[#0F291E] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'}`}
          >
            Farmer Feedback
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2 rounded-lg transition-all ${activeTab === 'audit' ? 'bg-white text-[#0F291E] shadow-sm font-bold' : 'text-stone-600 hover:text-stone-900'}`}
          >
            Audit Log
          </button>
        </div>
      </div>

      {activeTab === 'feedback' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DEMO_FEEDBACK.map((fb) => (
              <div key={fb.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{fb.farmer}</span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{fb.rating}.0</span>
                  </div>
                </div>
                <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-800 text-[11px] font-semibold rounded-full border border-emerald-200">
                  {fb.category}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed italic">"{fb.comment}"</p>
                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-2 border-t border-stone-100">
                  <Clock className="w-3 h-3" />
                  <span>{fb.date} · Crop: {fb.crop}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Log ID</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Action</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Entity</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-stone-500 text-xs uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {DEMO_AUDIT_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-stone-600">{log.id}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-stone-800 text-xs">{log.user}</div>
                      <div className="text-[10px] text-stone-400">{log.role}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-md font-mono text-xs font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-700">
                      <div>{log.entity}</div>
                      <div className="text-[11px] text-stone-400">{log.details}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-stone-500 font-mono">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
