import React, { useState } from 'react';
import { Languages, Moon } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = "CropCompaz – Resource-Aware Horticulture Intelligence" }) => {
  const [lang, setLang] = useState<'en' | 'ta'>('en');

  return (
    <header className="h-16 border-b border-stone-200/80 bg-[#FAF8F5]/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-stone-600 tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Language Selector UI */}
        <div className="flex items-center bg-white border border-stone-200 rounded-lg p-1 text-xs shadow-xs">
          <Languages className="w-4 h-4 text-stone-400 ml-1.5 mr-1" />
          <button
            onClick={() => setLang('en')}
            className={`px-2 py-1 rounded-md transition-all font-medium ${
              lang === 'en' ? 'bg-[#163B2F] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('ta')}
            className={`px-2 py-1 rounded-md transition-all font-medium ${
              lang === 'ta' ? 'bg-[#163B2F] text-white' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            தமிழ்
          </button>
        </div>

        {/* Theme Toggle placeholder icon matching screenshot */}
        <button 
          title="Theme Toggle (System Light Default)" 
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
        >
          <Moon className="w-4 h-4 text-stone-500" />
        </button>
      </div>
    </header>
  );
};
