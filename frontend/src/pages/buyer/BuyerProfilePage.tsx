import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Buyer } from '../../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Tag, 
  ShoppingBag, 
  Edit3, 
  Check, 
  CheckCircle2, 
  ShieldCheck,
  Package
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const BuyerProfilePage: React.FC = () => {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { t, lang } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    buyer_type: 'Wholesale',
    market: '',
    location: '',
    contact: '',
    required_crops: '["Tomato", "Chilli"]'
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    setLoading(true);
    api.getBuyerPortalProfile()
      .then((data) => {
        setBuyer(data);
        setFormData({
          name: data.name || '',
          buyer_type: data.buyer_type || 'Wholesale',
          market: data.market || 'Coimbatore APMC',
          location: data.location || 'Tamil Nadu',
          contact: data.contact || '',
          required_crops: data.required_crops || '["Tomato", "Chilli"]'
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.updateBuyerPortalProfile({
        name: formData.name,
        buyer_type: formData.buyer_type,
        market: formData.market,
        location: formData.location,
        contact: formData.contact,
        required_crops: formData.required_crops
      });
      setBuyer(updated);
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || 'Failed to update buyer profile');
    } finally {
      setSaving(false);
    }
  };

  const parseCrops = (raw: string): string[] => {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return raw.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  if (loading) {
    return <div className="text-center py-12 text-stone-400 text-xs">Loading buyer profile...</div>;
  }

  if (!buyer) {
    return <div className="text-center py-12 text-stone-500 text-xs">Buyer account not found.</div>;
  }

  const cropsList = parseCrops(buyer.required_crops);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">
            {lang === 'ta' ? 'வாங்குபவர் கணக்கு மற்றும் விவரங்கள்' : 'Buyer Profile & Procurement Details'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {lang === 'ta' 
              ? 'உங்கள் வணிகத் தகவல் மற்றும் கொள்முதல் தேவைகளை நிர்வகிக்கவும்.' 
              : 'Manage your company profile, mandi affiliations, and target crop sourcing preferences.'
            }
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2.5 bg-[#163B2F] hover:bg-[#1B4D3E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 self-start shadow-sm"
        >
          <Edit3 className="w-4 h-4 text-[#B4F042]" />
          {isEditing ? (lang === 'ta' ? 'ரத்துசெய்' : 'Cancel Edit') : (lang === 'ta' ? 'விவரங்களை திருத்து' : 'Edit Buyer Details')}
        </button>
      </div>

      {/* Edit Modal/Form */}
      {isEditing && (
        <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border-2 border-emerald-500/40 shadow-lg space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-emerald-700" />
              {lang === 'ta' ? 'வாங்குபவர் தகவல்களை புதுப்பிக்கவும்' : 'Update Buyer Procurement Information'}
            </h2>
            <span className="text-[11px] text-stone-400">Updates will match relevant cooperative harvest batches</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Buyer Name / Business */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {lang === 'ta' ? 'நிறுவனம் / வணிகர் பெயர்' : 'Business / Buyer Name'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Buyer Type */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {lang === 'ta' ? 'வணிக வகை' : 'Buyer Category'}
              </label>
              <select
                value={formData.buyer_type}
                onChange={(e) => setFormData({ ...formData, buyer_type: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
              >
                <option value="Wholesale">Wholesale (மொத்த விற்பனை)</option>
                <option value="Export">Export (ஏற்றுமதி)</option>
                <option value="Retail Chain">Retail Chain (சில்லறை விற்பனை சங்கிலி)</option>
                <option value="Food Processing">Food Processing (உணவு பதப்படுத்துதல்)</option>
                <option value="Local Market">Local Market (உள்ளூர் சந்தை)</option>
              </select>
            </div>

            {/* Contact */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {lang === 'ta' ? 'தொடர்பு எண் / மின்னஞ்சல்' : 'Contact Phone / Email'}
              </label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* APMC Market / Mandi */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {lang === 'ta' ? 'சந்தை / மண்டி' : 'Target Mandi / APMC Market'}
              </label>
              <input
                type="text"
                value={formData.market}
                onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Operating Location */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {lang === 'ta' ? 'செயல்பாட்டு பகுதி / நகரம்' : 'Operating Location / Region'}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                required
              />
            </div>

            {/* Target Crops */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                {lang === 'ta' ? 'தேவையான பயிர்கள் (JSON அல்லது கமா பட்டியல்)' : 'Required Crops (e.g. Tomato, Chilli, Onion)'}
              </label>
              <input
                type="text"
                value={formData.required_crops}
                onChange={(e) => setFormData({ ...formData, required_crops: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder='["Tomato", "Chilli", "Onion"]'
                required
              />
            </div>
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
              {saving ? (lang === 'ta' ? 'சேமிக்கப்படுகிறது...' : 'Saving...') : (lang === 'ta' ? 'சேமிக்கவும்' : 'Save Changes')}
            </button>
          </div>
        </form>
      )}

      {/* Buyer Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Business Profile */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#163B2F]" />
            {lang === 'ta' ? 'வணிகக் கணக்கு விவரங்கள்' : 'Procurement Entity Profile'}
          </h2>
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{lang === 'ta' ? 'வணிகர் பெயர்' : 'Entity Name'}:</span>
              <span className="font-extrabold text-stone-900">{buyer.name}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <span className="text-emerald-800 font-semibold">{lang === 'ta' ? 'வணிக வகை' : 'Category'}:</span>
              <span className="font-bold text-emerald-950">{buyer.buyer_type}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{lang === 'ta' ? 'தொடர்பு' : 'Contact'}:</span>
              <span className="font-semibold text-stone-900">{buyer.contact}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{lang === 'ta' ? 'கணக்கு நிலை' : 'Verification Status'}:</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> {buyer.status || 'ACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Market & Sourcing Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-700" />
            {lang === 'ta' ? 'சந்தை மற்றும் கொள்முதல் இலக்குகள்' : 'Market & Target Sourcing Crops'}
          </h2>
          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{lang === 'ta' ? 'சந்தை / மண்டி' : 'Target Mandi'}:</span>
              <span className="font-semibold text-stone-900">{buyer.market}</span>
            </div>
            <div className="flex justify-between p-2.5 bg-stone-50 rounded-xl">
              <span className="text-stone-500">{lang === 'ta' ? 'செயல்பாட்டு பகுதி' : 'Location'}:</span>
              <span className="font-semibold text-stone-900">{buyer.location}</span>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl space-y-1.5">
              <span className="text-[11px] font-semibold text-stone-500">
                {lang === 'ta' ? 'தேவையான முதன்மை பயிர்கள்' : 'Active Sourcing Crops'}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {cropsList.map((crop, idx) => (
                  <span key={idx} className="px-2.5 py-1 bg-emerald-100/70 border border-emerald-200 text-emerald-900 rounded-lg text-xs font-bold">
                    {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
