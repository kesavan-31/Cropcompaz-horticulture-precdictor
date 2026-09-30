import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Farmer } from '../../types';
import { 
  Sprout, 
  Wrench, 
  Package, 
  Droplets, 
  MapPin, 
  DollarSign, 
  Users, 
  Thermometer, 
  CloudRain,
  Edit3,
  Check,
  X,
  Coins
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerFarmPage: React.FC = () => {
  const [farm, setFarm] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t, lang } = useLanguage();

  // Edit form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    budget: 0,
    workers: 1,
    irrigation_available: '',
    water_source: '',
    water_availability: '',
    soil_type: '',
    crop: '',
    variety: '',
    growth_stage: '',
    farm_size: 1.0,
    equipmentString: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    api.getFarmerPortalProfile()
      .then((data) => {
        setFarm(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          location: data.location || '',
          budget: data.budget || 0,
          workers: data.workers || 1,
          irrigation_available: data.irrigation_available || 'Drip Irrigation',
          water_source: data.water_source || 'Borewell',
          water_availability: data.water_availability || 'Limited',
          soil_type: data.soil_type || 'Red Loam',
          crop: data.crop || 'Tomato',
          variety: data.variety || 'Local',
          growth_stage: data.growth_stage || 'Flowering',
          farm_size: data.farm_size || 1.0,
          equipmentString: data.equipment?.map(e => e.equipment_name).join(', ') || ''
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const equipmentArray = formData.equipmentString
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const updated = await api.updateFarmerPortalProfile({
        name: formData.name,
        phone: formData.phone,
        location: formData.location,
        budget: Number(formData.budget),
        workers: Number(formData.workers),
        irrigation_available: formData.irrigation_available,
        water_source: formData.water_source,
        water_availability: formData.water_availability,
        soil_type: formData.soil_type,
        crop: formData.crop,
        variety: formData.variety,
        growth_stage: formData.growth_stage,
        farm_size: Number(formData.farm_size),
        equipment: equipmentArray
      });

      setFarm(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update farm resources');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-stone-400 text-xs">Loading farm details...</div>;
  }

  if (!farm) {
    return <div className="text-center py-12 text-stone-500 text-xs">No farm profile linked.</div>;
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Header with Edit Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">{t('navMyFarm')}</h1>
          <p className="text-xs text-stone-500 mt-1">{t('resourceAwareAdvisory')}</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2.5 bg-[#163B2F] hover:bg-[#1B4D3E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start shadow-sm"
        >
          <Edit3 className="w-4 h-4 text-[#B4F042]" />
          {isEditing ? (lang === 'ta' ? 'ரத்துசெய்' : 'Cancel Edit') : t('updateResources')}
        </button>
      </div>

      {/* Edit Form Modal/Card */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-lg space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-700" />
              {t('updateResources')}
            </h2>
            <span className="text-[11px] text-stone-400">Updates will tune your AI advisory recommendations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Farmer Name */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{lang === 'ta' ? 'விவசாயி பெயர்' : 'Farmer Name'}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{lang === 'ta' ? 'அலைபேசி எண்' : 'Phone Number'}</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('location')}</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('availableBudget')} (₹)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Labour / Workers */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('laboursWorkers')} ({t('persons')})</label>
              <input
                type="number"
                min="0"
                max="50"
                value={formData.workers}
                onChange={(e) => setFormData({ ...formData, workers: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Irrigation Methods */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('irrigationMethods')}</label>
              <select
                value={formData.irrigation_available}
                onChange={(e) => setFormData({ ...formData, irrigation_available: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Sprinkler Irrigation">Sprinkler Irrigation</option>
                <option value="Canal / Flood Irrigation">Canal / Flood Irrigation</option>
                <option value="Manual Basin">Manual Basin</option>
                <option value="Rainfed (None)">Rainfed (None)</option>
              </select>
            </div>

            {/* Water Source */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('waterSource')}</label>
              <select
                value={formData.water_source}
                onChange={(e) => setFormData({ ...formData, water_source: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Borewell">Borewell</option>
                <option value="Open Well">Open Well</option>
                <option value="Canal">Canal</option>
                <option value="Farm Pond">Farm Pond</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>

            {/* Water Availability */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('waterAvailability')}</label>
              <select
                value={formData.water_availability}
                onChange={(e) => setFormData({ ...formData, water_availability: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Adequate">Adequate (முழுமையானது)</option>
                <option value="Limited">Limited (குறைவானது)</option>
                <option value="Rainfed">Rainfed (மழை சார்ந்த)</option>
                <option value="Unavailable">Unavailable (பற்றாக்குறை)</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('soilType')}</label>
              <input
                type="text"
                value={formData.soil_type}
                onChange={(e) => setFormData({ ...formData, soil_type: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder="Red Loam, Clay, Sandy..."
              />
            </div>

            {/* Crop */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('currentCrop')}</label>
              <input
                type="text"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Growth Stage */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('growthStage')}</label>
              <select
                value={formData.growth_stage}
                onChange={(e) => setFormData({ ...formData, growth_stage: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Sowing">Sowing</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Fruiting">Fruiting</option>
                <option value="Harvesting">Harvesting</option>
              </select>
            </div>

            {/* Farm Size */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t('farmSize')} ({t('acres')})</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={formData.farm_size}
                onChange={(e) => setFormData({ ...formData, farm_size: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>
          </div>

          {/* Equipments Comma List */}
          <div className="text-xs">
            <label className="block font-semibold text-stone-700 mb-1">
              {t('availableEquipments')} (Comma separated, e.g. Power Tiller, Drip Kit, Knapsack Sprayer, Tractor)
            </label>
            <input
              type="text"
              value={formData.equipmentString}
              onChange={(e) => setFormData({ ...formData, equipmentString: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
              placeholder="Power Tiller, Sprayer, Drip Kit, Tractor"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-xs transition"
            >
              {lang === 'ta' ? 'ரத்துசெய்' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#163B2F] hover:bg-[#1B4D3E] text-white font-bold rounded-xl text-xs transition shadow-md disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-[#B4F042]" />
              {saving ? t('saving') : t('saveChanges')}
            </button>
          </div>
        </form>
      )}

      {/* Resource Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm & Crop Overview */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-[#163B2F]" />
            {t('farmDashboard')} & {t('cropTarget')}
          </h2>
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('location')}:</span>
              <span className="font-semibold text-stone-900">{farm.location}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('farmSize')}:</span>
              <span className="font-semibold text-stone-900">{farm.farm_size} {t('acres')}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('currentCrop')}:</span>
              <span className="font-semibold text-[#163B2F]">{farm.crop} ({farm.variety})</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('growthStage')}:</span>
              <span className="font-semibold text-stone-900">{farm.growth_stage}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl">
              <span className="text-amber-800 font-semibold">{t('laboursWorkers')}:</span>
              <span className="font-bold text-amber-950">{farm.workers} {t('persons')}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <span className="text-emerald-800 font-semibold">{t('availableBudget')}:</span>
              <span className="font-extrabold text-emerald-950">₹{farm.budget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Water & Climate Conditions */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue-600" />
            {t('irrigationMethods')} & {t('waterAvailability')}
          </h2>
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('waterAvailability')}:</span>
              <span className="font-semibold text-stone-900">{farm.water_availability}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('waterSource')}:</span>
              <span className="font-semibold text-stone-900">{farm.water_source}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl">
              <span className="text-blue-800 font-semibold">{t('irrigationSetup')}:</span>
              <span className="font-bold text-blue-950">{farm.irrigation_available}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('temperature')}:</span>
              <span className="font-semibold text-stone-900">{farm.temperature ? `${farm.temperature}°C` : "—"}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('rainfall')}:</span>
              <span className="font-semibold text-stone-900">{farm.rainfall ? `${farm.rainfall} mm` : "—"}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{t('soilType')}:</span>
              <span className="font-semibold text-stone-900">{farm.soil_type || "Red Loam"}</span>
            </div>
          </div>
        </div>

        {/* Equipment Inventory */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-stone-600" />
            {t('availableEquipments')}
          </h2>
          {(!farm.equipment || farm.equipment.length === 0) ? (
            <div className="text-xs text-stone-400">{t('noEquipment')}</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {farm.equipment.map((eq) => (
                <span key={eq.id} className="px-3 py-1.5 bg-stone-100 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold">
                  {eq.equipment_name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Input Inventory */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-700" />
            {lang === 'ta' ? 'இருப்பு உள்ள உரங்கள் / இடுபொருட்கள்' : 'Input Stock Inventory'}
          </h2>
          {(!farm.inputs || farm.inputs.length === 0) ? (
            <div className="text-xs text-stone-400">{lang === 'ta' ? 'இடுபொருட்கள் எதுவும் இருப்பு இல்லை.' : 'No inputs in stock.'}</div>
          ) : (
            <div className="space-y-1.5">
              {farm.inputs.map((inp) => (
                <div key={inp.id} className="flex justify-between p-2 bg-stone-50 border border-stone-100 rounded-lg text-xs">
                  <span className="font-medium text-stone-800">{inp.input_name}</span>
                  <span className="font-bold text-stone-900">{inp.quantity} {inp.unit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
