import React, { useState, useEffect } from 'react';
import { Farmer, FarmerInput } from '../../types';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface FarmerFormProps {
  initialData?: Partial<Farmer>;
  onSubmit: (data: any) => Promise<void>;
  isEditing?: boolean;
  onCancel: () => void;
}

const AVAILABLE_EQUIPMENT = [
  "Sprayer", "Drip Irrigation", "Pump", "Tractor", "Power Tiller", "Manual Tools"
];

const CROPS = ["Chilli", "Tomato", "Capsicum", "Onion", "Brinjal", "Okra", "Maize", "Paddy"];
const GROWTH_STAGES = ["Nursery", "Vegetative", "Flowering", "Fruiting", "Bulbing", "Harvesting"];
const SOIL_TYPES = ["Red Loam", "Black Soil", "Clay", "Sandy", "Alluvial"];

export const FarmerForm: React.FC<FarmerFormProps> = ({
  initialData,
  onSubmit,
  isEditing = false,
  onCancel
}) => {
  const [id, setId] = useState(initialData?.id || '');
  const [name, setName] = useState(initialData?.name || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [farmSize, setFarmSize] = useState<number | ''>(initialData?.farm_size || 2.0);
  const [crop, setCrop] = useState(initialData?.crop || 'Chilli');
  const [variety, setVariety] = useState(initialData?.variety || 'Local');
  const [growthStage, setGrowthStage] = useState(initialData?.growth_stage || 'Fruiting');
  const [workers, setWorkers] = useState<number | ''>(initialData?.workers ?? 2);
  const [budget, setBudget] = useState<number | ''>(initialData?.budget ?? 3800);
  const [waterAvailability, setWaterAvailability] = useState(initialData?.water_availability || 'Limited');
  const [waterSource, setWaterSource] = useState(initialData?.water_source || 'Borewell');
  const [irrigationAvailable, setIrrigationAvailable] = useState(initialData?.irrigation_available || 'Drip Irrigation');
  const [temperature, setTemperature] = useState<number | ''>(initialData?.temperature ?? 30.0);
  const [rainfall, setRainfall] = useState<number | ''>(initialData?.rainfall ?? 10.0);
  const [humidity, setHumidity] = useState<number | ''>(initialData?.humidity ?? 65.0);
  const [soilType, setSoilType] = useState(initialData?.soil_type || 'Red Loam');

  const [selectedEquipment, setSelectedEquipment] = useState<string[]>(
    initialData?.equipment?.map(e => e.equipment_name) || ["Sprayer", "Drip Irrigation"]
  );

  const [inputItems, setInputItems] = useState<{ input_name: string; quantity: number; unit: string }[]>(
    initialData?.inputs?.map(i => ({ input_name: i.input_name, quantity: i.quantity, unit: i.unit })) || [
      { input_name: "Neem Oil", quantity: 2.0, unit: "L" },
      { input_name: "Compost", quantity: 15.0, unit: "kg" }
    ]
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleEquipment = (eq: string) => {
    if (selectedEquipment.includes(eq)) {
      setSelectedEquipment(selectedEquipment.filter(e => e !== eq));
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const addInputRow = () => {
    setInputItems([...inputItems, { input_name: '', quantity: 1.0, unit: 'kg' }]);
  };

  const removeInputRow = (index: number) => {
    setInputItems(inputItems.filter((_, i) => i !== index));
  };

  const updateInputRow = (index: number, field: string, val: any) => {
    const updated = [...inputItems];
    updated[index] = { ...updated[index], [field]: val };
    setInputItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    const payload = {
      id,
      name,
      phone,
      location,
      farm_size: farmSize === '' ? null : Number(farmSize),
      crop,
      variety,
      growth_stage: growthStage,
      workers: workers === '' ? 0 : Number(workers),
      budget: budget === '' ? 0 : Number(budget),
      water_availability: waterAvailability,
      water_source: waterSource,
      irrigation_available: irrigationAvailable,
      temperature: temperature === '' ? null : Number(temperature),
      rainfall: rainfall === '' ? null : Number(rainfall),
      humidity: humidity === '' ? null : Number(humidity),
      soil_type: soilType,
      equipment: selectedEquipment,
      inputs: inputItems.filter(i => i.input_name.trim() !== '')
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      if (err?.errors) {
        setErrors(err.errors);
      } else if (err?.message) {
        setErrors([err.message]);
      } else {
        setErrors(['An unexpected error occurred while saving.']);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-8">
      {/* Inline Validation Errors */}
      {errors.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Please correct the following errors:</h4>
            <ul className="list-disc list-inside text-xs mt-1.5 space-y-1">
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* SECTION 1: Basic Information */}
      <div>
        <h3 className="text-base font-bold text-[#163B2F] border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B4F042]"></span> Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer ID *</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={isEditing}
              placeholder="e.g. F024"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] disabled:bg-stone-100 text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Uma"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Phone Number (Indian) *</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Location *</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Dharapuram, Tamil Nadu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Farm Details */}
      <div>
        <h3 className="text-base font-bold text-[#163B2F] border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B4F042]"></span> Farm Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Farm Size (acres) *</label>
            <input
              type="number"
              step="0.1"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="2.0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Crop *</label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800 bg-white"
            >
              {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Variety *</label>
            <input
              type="text"
              value={variety}
              onChange={(e) => setVariety(e.target.value)}
              placeholder="Local / Hybrid"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Growth Stage *</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800 bg-white"
            >
              {GROWTH_STAGES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* SECTION 3: Farm Resources */}
      <div>
        <h3 className="text-base font-bold text-[#163B2F] border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B4F042]"></span> Resources & Water
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Available Workers *</label>
            <input
              type="number"
              value={workers}
              onChange={(e) => setWorkers(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="2"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Budget (₹) *</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="3800"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Water Availability *</label>
            <select
              value={waterAvailability}
              onChange={(e) => setWaterAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800 bg-white"
            >
              <option value="Adequate">Adequate</option>
              <option value="Limited">Limited</option>
              <option value="Rainfed">Rainfed</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Water Source & Irrigation *</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={waterSource}
                onChange={(e) => setWaterSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800 bg-white text-xs"
              >
                <option value="Borewell">Borewell</option>
                <option value="Canal">Canal</option>
                <option value="Well">Well</option>
                <option value="Rainfed">Rainfed</option>
              </select>
              <select
                value={irrigationAvailable}
                onChange={(e) => setIrrigationAvailable(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800 bg-white text-xs"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Selection */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-stone-700 mb-2">Equipment Available</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_EQUIPMENT.map(eq => {
              const isSelected = selectedEquipment.includes(eq);
              return (
                <button
                  type="button"
                  key={eq}
                  onClick={() => toggleEquipment(eq)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                    isSelected 
                      ? 'bg-[#163B2F] text-white border-[#163B2F]' 
                      : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}{eq}
                </button>
              );
            })}
          </div>
        </div>

        {/* Inputs with Quantities */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-stone-700">Inputs & Quantities</label>
            <button
              type="button"
              onClick={addInputRow}
              className="text-xs font-bold text-[#163B2F] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Input
            </button>
          </div>
          <div className="space-y-2">
            {inputItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Input Name (e.g. Neem Oil)"
                  value={item.input_name}
                  onChange={(e) => updateInputRow(idx, 'input_name', e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F]"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateInputRow(idx, 'quantity', Number(e.target.value))}
                  className="w-20 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F]"
                />
                <select
                  value={item.unit}
                  onChange={(e) => updateInputRow(idx, 'unit', e.target.value)}
                  className="w-20 px-2 py-2 text-xs rounded-xl border border-stone-300 bg-white"
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="bags">bags</option>
                </select>
                <button
                  type="button"
                  onClick={() => removeInputRow(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: Local Micro-Climate */}
      <div>
        <h3 className="text-base font-bold text-[#163B2F] border-b border-stone-100 pb-2 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B4F042]"></span> Local Micro-Climate & Soil
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Temperature (°C)</label>
            <input
              type="number"
              step="0.5"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="30.0"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Rainfall (mm)</label>
            <input
              type="number"
              step="1"
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="10"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Humidity (%)</label>
            <input
              type="number"
              step="1"
              value={humidity}
              onChange={(e) => setHumidity(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="65"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Soil Type</label>
            <select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-[#163B2F] text-stone-800 bg-white"
            >
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-stone-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 text-sm font-semibold text-stone-600 hover:bg-stone-100 rounded-xl transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 text-sm font-bold text-[#0F291E] bg-[#B4F042] hover:bg-[#A1E02F] rounded-xl shadow-md transition flex items-center gap-2"
        >
          {isSubmitting ? "Saving..." : isEditing ? "Update Farmer Profile" : "Save Farmer Profile"}
        </button>
      </div>
    </form>
  );
};
