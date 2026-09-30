import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Leaf, Lock, Mail, Phone, Languages, AlertCircle, ArrowRight } from 'lucide-react';

export const FarmerLoginPage: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { loginFarmer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await loginFarmer(identifier, password);
      navigate('/farmer/dashboard');
    } catch (err: any) {
      setError(typeof err === 'string' ? err : 'Unable to sign in with these credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    en: {
      title: "Sign in",
      subtitle: "Access your CropCompaz account",
      identifierLabel: "Phone / Email",
      identifierPlaceholder: "Enter your phone or email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      submitBtn: "Sign In",
      submitting: "Signing in...",
      forgotPassword: "Forgot Password?",
      brandSub: "Horticulture Intelligence"
    },
    ta: {
      title: "உள்நுழையவும்",
      subtitle: "உங்கள் CropCompaz கணக்கை அணுகவும்",
      identifierLabel: "மின்னஞ்சல் / தொலைபேசி",
      identifierPlaceholder: "தொலைபேசி எண் அல்லது மின்னஞ்சல்",
      passwordLabel: "கடவுச்சொல்",
      passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும்",
      submitBtn: "உள்நுழைக",
      submitting: "உள்நுழைகிறது...",
      forgotPassword: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
      brandSub: "தோட்டக்கலை நுண்ணறிவு"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
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
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                {t.identifierLabel}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t.identifierPlaceholder}
                  className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20 focus:border-[#163B2F]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  {t.passwordLabel}
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact cooperative staff to reset your password.')}
                  className="text-xs font-medium text-emerald-800 hover:underline"
                >
                  {t.forgotPassword}
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full px-4 py-2.5 bg-stone-50/50 border border-stone-200 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#163B2F]/20 focus:border-[#163B2F]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-[#163B2F] hover:bg-[#1B4D3E] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? t.submitting : (
                  <>
                    <span>{t.submitBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
