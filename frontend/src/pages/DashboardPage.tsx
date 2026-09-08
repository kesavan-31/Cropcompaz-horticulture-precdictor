import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { DashboardMetrics, Recommendation } from '../types';
import { Badge } from '../components/common/Badge';
import { WhyPanelModal } from '../components/advisory/WhyPanelModal';
import { 
  Users, 
  Sprout, 
  Clock, 
  CheckCircle, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Sparkles,
  Play,
  FileText,
  History,
  UserPlus,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentRecs, setRecentRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWhyRec, setSelectedWhyRec] = useState<Recommendation | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [m, recs] = await Promise.all([
        api.getDashboardMetrics(),
        api.getRecommendationHistory()
      ]);
      setMetrics(m);
      setRecentRecs(recs.slice(0, 5));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const systemStatusItems = [
    { label: "Farmer Profiles & Resource Inventory", status: true },
    { label: "Agronomy Rule Engine & Versioning", status: true },
    { label: "Resource Constraint Checking", status: true },
    { label: "Transparent Feasibility Scoring", status: true },
    { label: "Explainability & Evidence Breakdown", status: true },
    { label: "5 Failure Case Handling", status: true },
    { label: "Recommendation History Persistence", status: true },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Hero Section matching AgriVista screenshot strictly */}
      <div className="bg-[#163B2F] text-white rounded-3xl p-8 shadow-lg relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="text-emerald-300 text-sm font-medium mb-2">Good morning</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
            Review today’s farm recommendations and pending actions.
          </h1>
          <p className="text-emerald-100/80 text-sm mb-6 leading-relaxed">
            Evidence-backed recommendations designed to fit the farmer, the farm and available resources.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/advisory')}
              className="px-5 py-2.5 bg-[#B4F042] text-[#0F291E] font-bold text-sm rounded-xl hover:bg-[#A1E02F] transition shadow-md flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-current" /> Generate Advisory
            </button>
            <button
              onClick={() => navigate('/advisory/history')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition"
            >
              View History
            </button>
            <button
              onClick={async () => {
                await api.runExperiment();
                navigate('/advisory');
              }}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 transition flex items-center gap-2"
            >
              <Play className="w-3.5 h-3.5 fill-current text-emerald-300" /> Run Scenario
            </button>
          </div>
        </div>

        {/* Subtle leaf watermark graphics */}
        <div className="absolute -right-10 -bottom-10 opacity-10 text-[#B4F042] pointer-events-none">
          <Sprout className="w-72 h-72" />
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200/70 shadow-xs">
        <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Quick Actions</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-semibold">
          <button
            onClick={() => navigate('/farmers/new')}
            className="p-3 rounded-xl bg-stone-50 hover:bg-[#163B2F] hover:text-white border border-stone-200 text-stone-800 transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-emerald-600" /> Add Farmer
          </button>
          <button
            onClick={() => navigate('/advisory')}
            className="p-3 rounded-xl bg-stone-50 hover:bg-[#163B2F] hover:text-white border border-stone-200 text-stone-800 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" /> Generate Advisory
          </button>
          <button
            onClick={() => navigate('/advisory')}
            className="p-3 rounded-xl bg-stone-50 hover:bg-[#163B2F] hover:text-white border border-stone-200 text-stone-800 transition flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-emerald-600" /> Run Scenario
          </button>
          <button
            onClick={() => navigate('/advisory/history')}
            className="p-3 rounded-xl bg-stone-50 hover:bg-[#163B2F] hover:text-white border border-stone-200 text-stone-800 transition flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4 text-emerald-600" /> View History
          </button>
          <button
            onClick={() => navigate('/documentation')}
            className="p-3 rounded-xl bg-stone-50 hover:bg-[#163B2F] hover:text-white border border-stone-200 text-stone-800 transition flex items-center justify-center gap-2 col-span-2 sm:col-span-1"
          >
            <FileText className="w-4 h-4 text-emerald-600" /> Documentation
          </button>
        </div>
      </div>

      {/* KPI Cards Grid matching AgriVista screenshot strictly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Active Farmers */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Active Farmers</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.active_farmers}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Active Farms */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Active Farms</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.active_farms}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        {/* Current Crops */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Current Crops</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.current_crops}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Sprout className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Pending Reviews</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.pending_approvals}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Feasibility Rate */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Feasibility Rate</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.feasibility_rate}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Total Recommendations (Replacing Phase 2 Produce Grades) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Total Recommendations</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.total_recommendations}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Evidence Coverage */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">Evidence Coverage</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.evidence_coverage}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-stone-500 mb-1">System Alerts</div>
            <div className="text-2xl font-extrabold text-stone-900">
              {loading ? "—" : metrics?.system_alerts}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <AlertTriangle className="w-5 h-5 text-emerald-700" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Recommendations & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Recommendations (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900">Recent Advisory Recommendations</h3>
            <button
              onClick={() => navigate('/advisory/history')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentRecs.length === 0 ? (
            <div className="text-center py-8 text-xs text-stone-400">
              No recommendations generated yet. Start by generating an advisory recommendation.
            </div>
          ) : (
            <div className="space-y-3">
              {recentRecs.map((rec) => (
                <div key={rec.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">Farmer: {rec.farmer_id}</span>
                      <span className="text-stone-400">·</span>
                      <span className="font-semibold text-emerald-800">Rule {rec.rule_id} v{rec.rule_version}</span>
                      <Badge 
                        type={
                          rec.feasibility_status === 'HIGHLY_FEASIBLE' ? 'feasible' :
                          rec.feasibility_status === 'PARTIALLY_FEASIBLE' ? 'partial' : 'not_feasible'
                        } 
                      />
                    </div>
                    <p className="text-stone-700 font-medium line-clamp-2">
                      {rec.recommendation_text}
                    </p>
                    <div className="text-[11px] text-stone-400 pt-1">
                      {new Date(rec.created_at).toLocaleString()} · Estimated Cost: ₹{rec.estimated_cost?.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedWhyRec(rec)}
                    className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-100 shrink-0 font-semibold"
                    title="View Decision Breakdown"
                  >
                    <HelpCircle className="w-4 h-4 text-stone-600" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Phase 1 System Status Card (1 col) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h3 className="text-base font-bold text-stone-900">Phase 1 System Status</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">ACTIVE</span>
          </div>

          <div className="space-y-2.5 text-xs">
            {systemStatusItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-stone-50 border border-stone-100">
                <span className="font-medium text-stone-800">{item.label}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            ))}
          </div>

          <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 italic">
            All Phase 1 features are connected to SQLite database queries and deterministic logic.
          </div>
        </div>
      </div>

      {/* Start with a farmer profile CTA matching AgriVista reference */}
      <div 
        onClick={() => navigate('/farmers')}
        className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-emerald-500 hover:shadow-md cursor-pointer transition flex items-center justify-between group"
      >
        <div>
          <h3 className="text-base font-bold text-stone-900 group-hover:text-[#163B2F]">Start with a farmer profile</h3>
          <p className="text-xs text-stone-500 mt-1">Register farm size, available budget, equipment, inputs and water availability to evaluate advisory recommendations.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-stone-100 group-hover:bg-[#B4F042] flex items-center justify-center text-stone-700 group-hover:text-[#0F291E] transition">
          <ArrowRight className="w-5 h-5" />
        </div>
      </div>

      {/* Why Modal */}
      <WhyPanelModal
        isOpen={Boolean(selectedWhyRec)}
        recommendation={selectedWhyRec}
        onClose={() => setSelectedWhyRec(null)}
      />
    </div>
  );
};
