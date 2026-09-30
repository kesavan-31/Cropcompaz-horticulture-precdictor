import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Languages, AlertCircle, ArrowRight } from 'lucide-react';

export const FarmerRegisterPage: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('Coimbatore, Tamil Nadu');
  const [farmSize, setFarmSize] = useState(2.0);
  const [crop, setCrop] = useState('Chilli');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerFarmer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await registerFarmer({
        name,
        phone,
        location,
        farm_size: Number(farmSize),
        crop,
        variety: 'Local',
        growth_stage: growthStage,
        workers: 2,
        budget: 5000,
        water_availability: 'Limited',
        password
      });
      navigate('/farmer/dashboard');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Unable to register account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    en: {
      title: "Register Your Farm",
      subtitle: "Create a new CropCompaz farmer profile",
      nameLabel: "Full Name",
      phoneLabel: "Phone Number",
      locationLabel: "Location / District",
      farmSizeLabel: "Farm Size (Acres)",
      cropLabel: "Primary Crop",
      stageLabel: "Current Growth Stage",
      passwordLabel: "Create Password",
      submitBtn: "Complete Registration",
      submitting: "Registering Farm...",
      haveAccount: "Already have an account? Sign in",
      brandSub: "Horticulture Intelligence"
    },
    ta: {
      title: "விவசாய கணக்கு பதிவு",
      subtitle: "புதிய CropCompaz கணக்கை உருவாக்கவும்",
      nameLabel: "முழு பெயர்",
      phoneLabel: "தொலைபேசி எண்",
      locationLabel: "இடம் / மாவட்டம்",
      farmSizeLabel: "பண்ணை அளவு (ஏக்கர்)",
      cropLabel: "முதன்மை பயிர்",
      stageLabel: "பயிர் வளர்ச்சி நிலை",
      passwordLabel: "கடவுச்சொல்லை உருவாக்கவும்",
      submitBtn: "பதிவை முடிக்கவும்",
      submitting: "பதிவாகிறது...",
      haveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
      brandSub: "தோட்டக்கலை நுண்ணறிவு"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-10 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-[#163B2F] flex items-center justify-center text-[#B4F042] shadow-sm">
            <Leaf className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F291E] tracking-tight">CropCompaz</h1>
            <p className="text-[11px] font-semibold text-emerald-800 tracking-wide uppercase">{t.brandSub}</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-white border border-stone-200 rounded-xl p-1 text-xs shadow-xs">
            <Languages className="w-3.5 h-3.5 text-stone-400 ml-1.5 mr-1" />
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                lang === 'en' ? 'bg-[#163B2F] text-white shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('ta')}
              className={`px-3 py-1 rounded-lg font-medium transition ${
                lang === 'ta' ? 'bg-[#163B2F] text-white shadow-xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              தமிழ்
            </button>
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-6 shadow-sm border border-stone-200/80 rounded-3xl sm:px-10">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-stone-900">{t.title}</h2>
            <p className="text-xs text-stone-500 mt-1">{t.subtitle}</p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.nameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.locationLabel}
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  className="w-full px-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.farmSizeLabel}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={farmSize}
                  onChange={(e) => setFarmSize(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.cropLabel}
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
                >
                  <option value="Chilli">Chilli</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Capsicum">Capsicum</option>
                  <option value="Brinjal">Brinjal</option>
                  <option value="Onion">Onion</option>
                  <option value="Okra">Okra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.stageLabel}
                </label>
                <select
                  value={growthStage}
                  onChange={(e) => setGrowthStage(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
                >
                  <option value="Vegetative">Vegetative</option>
                  <option value="Flowering">Flowering</option>
                  <option value="Fruiting">Fruiting</option>
                  <option value="Harvest">Harvest</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t.passwordLabel}
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-4 py-2 bg-stone-50/50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#163B2F] hover:bg-[#1B4D3E] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? t.submitting : (
                  <>
                    <span>{t.submitBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 text-center">
              <Link to="/farmer/login" className="text-xs font-semibold text-emerald-800 hover:underline">
                {t.haveAccount}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
