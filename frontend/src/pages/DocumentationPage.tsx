import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Users, 
  BarChart3, 
  CheckSquare, 
  Milestone 
} from 'lucide-react';

const DOC_TABS = [
  { id: 'problem', name: 'Problem Statement', icon: AlertTriangle },
  { id: 'objectives', name: 'Objectives', icon: CheckCircle2 },
  { id: 'architecture', name: 'Architecture', icon: Layers },
  { id: 'field_workflow', name: 'Field Workflow', icon: Cpu },
  { id: 'user_roles', name: 'User Roles & Matrix', icon: Users },
  { id: 'agronomy_evidence', name: 'Agronomy Evidence', icon: BookOpen },
  { id: 'failure_analysis', name: 'Failure Analysis', icon: ShieldCheck },
  { id: 'baseline_experiment', name: 'Baseline & Experiment', icon: BarChart3 },
  { id: 'testing_strategy', name: 'Testing Strategy', icon: CheckSquare },
  { id: 'phase_roadmap', name: 'System Roadmap', icon: Milestone }
];

export const DocumentationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('problem');

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F291E]">System Documentation</h1>
        <p className="text-xs text-stone-500 mt-1">
          Technical specifications, architecture details, agronomy evidence guidelines, failure cases, and platform roadmap.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0 bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs space-y-1">
          {DOC_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition ${
                activeTab === tab.id
                  ? 'bg-[#163B2F] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#B4F042]' : 'text-stone-400'}`} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content Viewer */}
        <div className="flex-1 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs space-y-4 leading-relaxed text-sm">
          {activeTab === 'problem' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Problem Statement</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Farmers often receive generic agricultural recommendations that do not account for their actual farm constraints, available budget, equipment inventory, input quantities, labor availability, water sources, or micro-climate conditions.
              </p>
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-medium">
                <strong>Key Challenge:</strong> A standard recommendation suggesting drip fertigation with expensive soluble NPK fertilizer is practically unfeasible if the farmer has a budget of only ₹500, no drip system, or limited water availability. CropCompass solves this by enforcing resource-aware constraint checking.
              </div>
            </div>
          )}

          {activeTab === 'objectives' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Phase 1 Objectives</h2>
              <ul className="list-disc list-inside space-y-2 text-stone-700">
                <li>Capture farmer-specific profiles, farm size, labor, budget, equipment, and input quantities.</li>
                <li>Match structured agronomy rules with strict versioning and evidence sources.</li>
                <li>Evaluate resource feasibility using transparent decision-support scoring.</li>
                <li>Provide explainable "Why this recommendation?" breakdowns detailing constraint pass/fail lists.</li>
                <li>Provide eligible alternative recommendations when primary rules are unfeasible.</li>
                <li>Compare resource-aware advisory against generic baseline matching in empirical experiments.</li>
                <li>Test 5 explicit failure cases with clear user feedback.</li>
              </ul>
            </div>
          )}

          {activeTab === 'architecture' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">System Architecture</h2>
              <div className="bg-[#FAF8F5] border border-stone-200 p-4 rounded-xl font-mono text-xs text-stone-800 space-y-2">
                <div>React (TypeScript + Vite)</div>
                <div className="pl-4">↓ REST API (JSON)</div>
                <div>FastAPI Backend Service Layer</div>
                <div className="pl-4">↓ Recommendation Engine & Constraint Checker</div>
                <div>SQLite Database (SQLAlchemy ORM)</div>
              </div>
            </div>
          )}

          {activeTab === 'field_workflow' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Field Workflow</h2>
              <ol className="list-decimal list-inside space-y-2 text-stone-700">
                <li><strong>Registration:</strong> Cooperative staff registers farmer details and resource availability.</li>
                <li><strong>Advisory Request:</strong> Advisory engine queries matched agronomy rules for current crop stage.</li>
                <li><strong>Constraint Checking:</strong> Engine verifies budget, equipment, inputs with quantities, labor, and water compatibility.</li>
                <li><strong>Decision & Alternatives:</strong> Primary recommendation outputted with feasibility score; eligible alternative provided if primary is unfeasible.</li>
              </ol>
            </div>
          )}

          {activeTab === 'user_roles' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">User Roles & Access Matrix</h2>
              <div className="space-y-3">
                <div className="p-3 border border-stone-200 rounded-xl">
                  <div className="font-bold text-stone-900">Farmer</div>
                  <div className="text-xs text-stone-600">Provides farm constraints and receives resource-aware recommendations.</div>
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <div className="font-bold text-stone-900">Cooperative Staff / Extension Worker</div>
                  <div className="text-xs text-stone-600">Manages farmer profiles, runs scenario evaluations, and monitors advisory records.</div>
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <div className="font-bold text-stone-900">Agronomy Reviewer</div>
                  <div className="text-xs text-stone-600">Verifies evidence sources and approves structured agronomy rules.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agronomy_evidence' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Agronomy Evidence Guidelines</h2>
              <p className="text-stone-700 leading-relaxed mb-3">
                Every agronomy rule in CropCompass must maintain a clear evidence trail. Demonstration rules are explicitly badged <span className="font-bold text-amber-700">DEMO</span> or <span className="font-bold text-amber-700">NEEDS_APPROVAL</span>.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-900">
                Verified sources include institutional advisory publications (e.g., TNAU Agronomy Guides, ICAR Crop Health Bulletins, IIHR Guidelines).
              </div>
            </div>
          )}

          {activeTab === 'failure_analysis' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Failure Case Analysis</h2>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 border border-stone-200 rounded-xl">
                  <span className="font-bold text-rose-700">Failure 1: Low Budget</span> — Required ₹1,200, Available ₹100 → Output: NOT FEASIBLE.
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <span className="font-bold text-rose-700">Failure 2: Missing Equipment</span> — Required Sprayer unavailable → Output: NOT FEASIBLE.
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <span className="font-bold text-amber-700">Failure 3: Missing Required Data</span> — Soil type required but missing → Output: INSUFFICIENT INFORMATION.
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <span className="font-bold text-rose-700">Failure 4: Invalid Local Data</span> — Temp = 200°C → Output: VALIDATION ERROR.
                </div>
                <div className="p-3 border border-stone-200 rounded-xl">
                  <span className="font-bold text-purple-700">Failure 5: High-Impact Action</span> — Chemical pesticide matched → Output: HUMAN CONFIRMATION REQUIRED.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'baseline_experiment' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Baseline & Empirical Experiment</h2>
              <p className="text-stone-700 leading-relaxed mb-3">
                CropCompaz compares its resource-aware engine against a generic baseline that matches recommendations solely on Crop + Growth Stage while ignoring resource constraints.
              </p>
              <div className="bg-[#FAF8F5] border border-stone-200 p-4 rounded-xl text-xs space-y-2 font-mono">
                <div>Experiment Script: <code>py -3.11 scripts/run_experiment.py</code></div>
                <div>Notebook: <code>notebooks/phase1_experiment.ipynb</code></div>
                <div>Dataset: 60 synthetic farm scenarios (<code>data/farm_scenarios.csv</code>)</div>
              </div>
            </div>
          )}

          {activeTab === 'testing_strategy' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">Testing Strategy & Execution</h2>
              <p className="text-stone-700 leading-relaxed mb-3">
                The backend suite uses Pytest to verify form validations, resource constraint logic, feasibility scoring, failure cases, and REST API endpoints.
              </p>
              <div className="bg-[#FAF8F5] border border-stone-200 p-4 rounded-xl text-xs font-mono text-stone-800">
                $env:PYTHONPATH="backend"<br />
                py -3.11 -m pytest backend/tests
              </div>
            </div>
          )}

          {activeTab === 'phase_roadmap' && (
            <div>
              <h2 className="text-xl font-bold text-[#163B2F] mb-3">CropCompaz System Architecture Roadmap</h2>
              <div className="space-y-3 text-xs">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="font-bold text-emerald-900">CORE ADVISORY ENGINE:</span>
                  <div className="text-stone-700 mt-1">Farmer CRUD, resource constraints, input quantities, water sources, versioned agronomy rules, feasibility scoring, explainability, alternatives, baseline experiment, failure handling.</div>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-900">COOPERATIVE & QUALITY WORKFLOW:</span>
                  <div className="text-stone-700 mt-1">Produce grading, buyer requirements, human approval audit workflow, Tamil translation support, user field validation.</div>
                </div>
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <span className="font-bold text-purple-900">INTELLIGENCE & INTEGRATIONS:</span>
                  <div className="text-stone-700 mt-1">Role-based access control, market price analytics, weather API & GIS location intelligence.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
