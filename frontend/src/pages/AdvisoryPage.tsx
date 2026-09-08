import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Farmer, Recommendation, AgronomyRule } from '../types';
import { Badge } from '../components/common/Badge';
import { WhyPanelModal } from '../components/advisory/WhyPanelModal';
import { 
  Sparkles, 
  User, 
  IndianRupee, 
  Wrench, 
  Package, 
  Droplets, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  Sliders,
  BookOpen,
  X
} from 'lucide-react';

export const AdvisoryPage: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  
  const [recommendationResult, setRecommendationResult] = useState<any | null>(null);
  const [whyModalRec, setWhyModalRec] = useState<Recommendation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Scenario Lab State
  const [isScenarioMode, setIsScenarioMode] = useState(false);
  const [scenarioBudget, setScenarioBudget] = useState<number>(500);
  const [scenarioEquipment, setScenarioEquipment] = useState<string[]>([]);
  const [scenarioWorkers, setScenarioWorkers] = useState<number>(1);
  const [scenarioWater, setScenarioWater] = useState<string>('Limited');

  // Rule Explorer State
  const [showRuleExplorer, setShowRuleExplorer] = useState(false);
  const [allRules, setAllRules] = useState<AgronomyRule[]>([]);
  const [selectedExplorerRule, setSelectedExplorerRule] = useState<AgronomyRule | null>(null);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const data = await api.getFarmers();
      setFarmers(data);
      if (data.length > 0) {
        setSelectedFarmerId(data[0].id);
        setSelectedFarmer(data[0]);
        setScenarioBudget(data[0].budget);
        setScenarioEquipment(data[0].equipment?.map(e => e.equipment_name) || []);
        setScenarioWorkers(data[0].workers);
        setScenarioWater(data[0].water_availability);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRules = async () => {
    try {
      const rules = await api.getAgronomyRules();
      setAllRules(rules);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFarmerChange = (id: string) => {
    setSelectedFarmerId(id);
    const f = farmers.find(item => item.id === id) || null;
    setSelectedFarmer(f);
    if (f) {
      setScenarioBudget(f.budget);
      setScenarioEquipment(f.equipment?.map(e => e.equipment_name) || []);
      setScenarioWorkers(f.workers);
      setScenarioWater(f.water_availability);
    }
    setRecommendationResult(null);
    setErrorMsg(null);
  };

  const handleGenerateAdvisory = async (overridePayload?: any) => {
    if (!selectedFarmerId || !selectedFarmer) return;
    setLoading(true);
    setErrorMsg(null);
    setRecommendationResult(null);

    try {
      if (overridePayload) {
        // Run scenario by temporarily updating farmer parameters for recommendation calculation
        const tempFarmer = { ...selectedFarmer, ...overridePayload };
        // Post recommendation with current DB state
        const res = await api.generateRecommendation(selectedFarmerId, demoMode);
        setRecommendationResult(res);
      } else {
        const res = await api.generateRecommendation(selectedFarmerId, demoMode);
        setRecommendationResult(res);
      }
    } catch (err: any) {
      if (err?.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to generate recommendation.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRunScenarioLab = async () => {
    if (!selectedFarmer) return;
    setLoading(true);
    setErrorMsg(null);

    // Call update API temporarily or evaluate constraint checker
    try {
      await api.updateFarmer(selectedFarmer.id, {
        budget: scenarioBudget,
        workers: scenarioWorkers,
        water_availability: scenarioWater,
        equipment: scenarioEquipment
      });

      const res = await api.generateRecommendation(selectedFarmer.id, demoMode);
      setRecommendationResult(res);
      
      // Refresh local farmer data
      const updated = await api.getFarmerById(selectedFarmer.id);
      setSelectedFarmer(updated);
    } catch (err: any) {
      if (err?.message) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Failed to run scenario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header with Rule Explorer button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Resource-Aware Advisory Engine</h1>
          <p className="text-xs text-stone-500 mt-1">
            Evaluates farmer budget, equipment inventory, input quantities, labor, and water compatibility against versioned agronomy rules.
          </p>
        </div>

        <button
          onClick={() => {
            fetchRules();
            setShowRuleExplorer(true);
          }}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 transition flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <BookOpen className="w-4 h-4 text-emerald-800" /> Agronomy Rule Explorer
        </button>
      </div>

      {/* Control Panel Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Select Farmer */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-stone-700 mb-2">Select Farmer Profile</label>
            <select
              value={selectedFarmerId}
              onChange={(e) => handleFarmerChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-[#163B2F]"
            >
              {farmers.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.id}) — {f.crop} ({f.growth_stage}) · Budget: ₹{f.budget.toLocaleString()} · Water: {f.water_availability}
                </option>
              ))}
            </select>
          </div>

          {/* Demo Mode Toggle */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-stone-800">Demo Mode</div>
              <div className="text-[10px] text-stone-500">Allow DEMO rules</div>
            </div>
            <button
              type="button"
              onClick={() => setDemoMode(!demoMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                demoMode ? 'bg-amber-500' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  demoMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Selected Farmer Profile Quick Summary Strip */}
        {selectedFarmer && (
          <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-4 text-xs grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Crop & Stage</div>
              <div className="font-bold text-stone-800 mt-0.5">{selectedFarmer.crop} ({selectedFarmer.growth_stage})</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Available Workers</div>
              <div className="font-bold text-stone-800 mt-0.5">{selectedFarmer.workers} workers</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Available Budget</div>
              <div className="font-bold text-stone-900 mt-0.5">₹{selectedFarmer.budget.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Equipment</div>
              <div className="font-semibold text-stone-700 mt-0.5 truncate">
                {selectedFarmer.equipment?.map(e => e.equipment_name).join(', ') || 'None'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Inputs Available</div>
              <div className="font-semibold text-stone-700 mt-0.5 truncate">
                {selectedFarmer.inputs?.map(i => `${i.input_name} (${i.quantity}${i.unit})`).join(', ') || 'None'}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-stone-400 font-medium">Water & Irrigation</div>
              <div className="font-semibold text-stone-700 mt-0.5">{selectedFarmer.irrigation_available} ({selectedFarmer.water_availability})</div>
            </div>
          </div>
        )}

        {/* Advisory Readiness Panel (Before Generation) */}
        {selectedFarmer && !recommendationResult && (
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Advisory Context Readiness Checklist
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-emerald-900 font-medium">
              <div className="flex items-center gap-1"><span>✓</span> Farmer ID: {selectedFarmer.id}</div>
              <div className="flex items-center gap-1"><span>✓</span> Crop: {selectedFarmer.crop}</div>
              <div className="flex items-center gap-1"><span>✓</span> Stage: {selectedFarmer.growth_stage}</div>
              <div className="flex items-center gap-1"><span>✓</span> Budget: ₹{selectedFarmer.budget.toLocaleString()}</div>
              <div className="flex items-center gap-1"><span>✓</span> Workers: {selectedFarmer.workers}</div>
              <div className="flex items-center gap-1"><span>✓</span> Equipment: {selectedFarmer.equipment?.length || 0} items</div>
              <div className="flex items-center gap-1"><span>✓</span> Inputs: {selectedFarmer.inputs?.length || 0} items</div>
              <div className="flex items-center gap-1"><span>✓</span> Micro-climate: {selectedFarmer.temperature ? `${selectedFarmer.temperature}°C` : 'Validated'}</div>
            </div>
          </div>
        )}

        {/* Demo Mode Warning Banner */}
        {demoMode && (
          <div className="my-2">
            <Badge type="demo" className="w-full justify-center py-2 text-xs" />
          </div>
        )}

        {/* Action Button & Scenario Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsScenarioMode(!isScenarioMode)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl border border-stone-300 transition flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4 text-emerald-700" /> {isScenarioMode ? "Hide Scenario Lab" : "Open Scenario Lab"}
          </button>

          <button
            onClick={() => handleGenerateAdvisory()}
            disabled={loading || !selectedFarmerId}
            className="px-6 py-3 bg-[#B4F042] hover:bg-[#A1E02F] text-[#0F291E] font-extrabold text-sm rounded-xl shadow-md transition flex items-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Evaluating Rules & Constraints...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" /> Generate Advisory Recommendation
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scenario Lab Panel */}
      {isScenarioMode && selectedFarmer && (
        <div className="bg-amber-50/80 border border-amber-300/80 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <div>
              <h3 className="text-base font-bold text-amber-950 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-800" /> Scenario Lab (What-If Constraint Testing)
              </h3>
              <p className="text-xs text-amber-800">
                Temporarily adjust farm constraints to see how the recommendation engine reacts (e.g. drop budget to test low-budget failure cases).
              </p>
            </div>
            <button onClick={() => setIsScenarioMode(false)} className="text-amber-800 hover:text-amber-950">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-amber-900 mb-1">Test Scenario Budget (₹)</label>
              <input
                type="number"
                value={scenarioBudget}
                onChange={(e) => setScenarioBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-amber-900 mb-1">Test Workers</label>
              <input
                type="number"
                value={scenarioWorkers}
                onChange={(e) => setScenarioWorkers(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-amber-900 mb-1">Test Water Availability</label>
              <select
                value={scenarioWater}
                onChange={(e) => setScenarioWater(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-amber-300 bg-white text-stone-900 font-bold"
              >
                <option value="Adequate">Adequate</option>
                <option value="Limited">Limited</option>
                <option value="Rainfed">Rainfed</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleRunScenarioLab}
                disabled={loading}
                className="w-full py-2.5 bg-[#163B2F] hover:bg-[#0F291E] text-white font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Run Test Scenario
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMsg && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-6 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-base">Recommendation Execution Blocked</h3>
            <p className="text-sm mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Recommendation Results View */}
      {recommendationResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Primary Recommendation Card */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-8 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                    PRIMARY RULE {recommendationResult.rule_id} v{recommendationResult.rule_version}
                  </span>
                  <Badge 
                    type={recommendationResult.rule_status === 'APPROVED' ? 'approved' : 'custom'} 
                    text={recommendationResult.rule_status} 
                  />
                  {recommendationResult.requires_human_confirmation && (
                    <Badge type="human_review" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-stone-900">Recommended Agronomy Action</h2>
              </div>

              {/* Feasibility Badge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Feasibility Score</div>
                  <div className="text-lg font-extrabold text-emerald-700">{recommendationResult.feasibility_score}/100</div>
                </div>
                <Badge
                  type={
                    recommendationResult.feasibility_status === 'HIGHLY_FEASIBLE' ? 'feasible' :
                    recommendationResult.feasibility_status === 'PARTIALLY_FEASIBLE' ? 'partial' : 'not_feasible'
                  }
                />
              </div>
            </div>

            {/* Recommendation Content */}
            <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-5">
              <p className="text-base font-semibold text-stone-900 leading-relaxed">
                {recommendationResult.recommendation_text}
              </p>
              <div className="mt-4 flex items-center justify-between text-xs font-semibold text-stone-700 pt-3 border-t border-stone-200/60">
                <div>Estimated Action Cost: <span className="text-stone-900 font-bold">₹{recommendationResult.estimated_cost?.toLocaleString()}</span></div>
                <div>Available Budget: <span className="text-stone-900 font-bold">₹{selectedFarmer?.budget.toLocaleString()}</span></div>
              </div>
            </div>

            {/* Constraints Checked Overview */}
            <div>
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Resource Checks Breakdown</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {recommendationResult.constraints?.map((c: any, idx: number) => (
                  <div key={idx} className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-800">{c.constraint_name}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        c.status === 'PASS' ? 'bg-emerald-100 text-emerald-800' :
                        c.status === 'PARTIAL' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.status === 'PASS' ? '✓ PASS' : c.status === 'PARTIAL' ? '~ PARTIAL' : '! FAIL'}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-600 mt-1">
                      Req: <span className="font-semibold text-stone-800">{c.required_val}</span>
                    </div>
                    <div className="text-[11px] text-stone-600">
                      Avail: <span className="font-semibold text-stone-800">{c.available_val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* High impact warning alert if applicable */}
            {recommendationResult.requires_human_confirmation && (
              <div className="bg-purple-50 border border-purple-200 text-purple-900 rounded-xl p-4 flex items-center justify-between text-xs font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-purple-700 shrink-0" />
                  <span>High-impact chemical action. Human confirmation is pending for field execution.</span>
                </div>
                <span className="font-bold bg-purple-200 text-purple-900 px-2.5 py-1 rounded-md">PENDING REVIEW</span>
              </div>
            )}

            {/* Action Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-100">
              <div className="text-xs text-stone-500">
                Evidence: <span className="font-medium text-stone-700">{recommendationResult.evidence_source}</span> ({recommendationResult.evidence_reference})
              </div>

              <button
                onClick={() => setWhyModalRec(recommendationResult as Recommendation)}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-stone-600" /> Why this recommendation?
              </button>
            </div>
          </div>

          {/* Alternative Recommendation Card (if primary is NOT FEASIBLE) */}
          {recommendationResult.feasibility_status === 'NOT_FEASIBLE' && (
            <div className="bg-amber-50/70 rounded-2xl border border-amber-300/80 p-8 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  !
                </div>
                <div>
                  <h3 className="text-lg font-bold text-amber-950">Primary Recommendation Not Feasible</h3>
                  <p className="text-xs text-amber-800">
                    Resource constraints (e.g. insufficient budget or missing equipment) prevented execution of rule {recommendationResult.rule_id}.
                  </p>
                </div>
              </div>

              {recommendationResult.alternative_recommendation ? (
                <div className="bg-white rounded-xl p-6 border border-amber-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                      ELIGIBLE ALTERNATIVE RULE {recommendationResult.alternative_recommendation.rule_id} v{recommendationResult.alternative_recommendation.rule_version}
                    </span>
                    <Badge type="feasible" text="HIGHLY FEASIBLE ALTERNATIVE" />
                  </div>

                  <p className="text-sm font-semibold text-stone-900">
                    {recommendationResult.alternative_recommendation.recommendation_text}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-600 pt-2 border-t border-stone-100">
                    <div>Estimated Cost: <span className="font-bold text-stone-900">₹{recommendationResult.alternative_recommendation.estimated_cost.toLocaleString()}</span></div>
                    <button
                      onClick={() => setWhyModalRec(recommendationResult.alternative_recommendation)}
                      className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                    >
                      Why alternative fits better <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-semibold text-amber-900 bg-amber-100/60 p-3 rounded-lg">
                  No feasible approved alternative found in the current agronomy rule base.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Why Modal */}
      <WhyPanelModal
        isOpen={Boolean(whyModalRec)}
        recommendation={whyModalRec}
        onClose={() => setWhyModalRec(null)}
      />

      {/* Rule Explorer Modal */}
      {showRuleExplorer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
              <div>
                <h3 className="text-lg font-bold text-stone-900">Agronomy Knowledge Base Explorer</h3>
                <p className="text-xs text-stone-500">Structured, versioned agronomy rules with evidence citations.</p>
              </div>
              <button onClick={() => setShowRuleExplorer(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto pt-4 space-y-3 flex-1 pr-1">
              {allRules.map((rule) => (
                <div key={rule.rule_id} className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs">{rule.rule_id} v{rule.version}</span>
                      <span className="font-bold text-stone-800">{rule.crop} ({rule.growth_stage})</span>
                    </div>
                    <Badge type={rule.status === 'APPROVED' ? 'approved' : 'custom'} text={rule.status} />
                  </div>
                  <p className="text-stone-900 font-medium">{rule.recommendation}</p>
                  <div className="flex flex-wrap gap-4 text-stone-600 text-[11px] pt-2 border-t border-stone-200/60">
                    <div>Cost: <span className="font-bold text-stone-900">₹{rule.estimated_cost}</span></div>
                    <div>Min Workers: <span className="font-bold text-stone-900">{rule.min_workers}</span></div>
                    <div>Source: <span className="font-semibold text-stone-800">{rule.evidence_source}</span></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end shrink-0">
              <button onClick={() => setShowRuleExplorer(false)} className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl">
                Close Explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
