import React from 'react';
import { ShoppingBag, Plus, Building2, MapPin, Phone, Wheat } from 'lucide-react';

const DEMO_BUYERS = [
  { id: 'B001', name: 'Chennai Export Hub', type: 'Export', market: 'Chennai APMC', location: 'Chennai, Tamil Nadu', contact: '+91 98765 00001', crops: ['Tomato', 'Chilli', 'Capsicum'], active: true },
  { id: 'B002', name: 'Coimbatore Wholesale Market', type: 'Wholesale', market: 'Coimbatore APMC', location: 'Coimbatore, Tamil Nadu', contact: '+91 98765 00002', crops: ['Onion', 'Tomato', 'Brinjal'], active: true },
  { id: 'B003', name: 'FreshMart Retail Chain', type: 'Retail', market: 'Pan Tamil Nadu', location: 'Erode, Tamil Nadu', contact: '+91 98765 00003', crops: ['Capsicum', 'Okra', 'Cucumber'], active: true },
  { id: 'B004', name: 'TN Processing Unit', type: 'Processing', market: 'Industrial', location: 'Dindigul, Tamil Nadu', contact: '+91 98765 00004', crops: ['Chilli', 'Onion'], active: false },
];

const TYPE_COLORS: Record<string, string> = {
  Export: 'bg-blue-50 text-blue-700 border border-blue-200',
  Wholesale: 'bg-amber-50 text-amber-700 border border-amber-200',
  Retail: 'bg-purple-50 text-purple-700 border border-purple-200',
  Processing: 'bg-rose-50 text-rose-700 border border-rose-200',
  'Local market': 'bg-green-50 text-green-700 border border-green-200',
};

export const BuyersPage: React.FC = () => {
  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F291E]">Buyers</h1>
          <p className="text-xs text-stone-500 mt-1">Manage buyer profiles and their crop grade requirements.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#163B2F] text-white text-sm font-semibold rounded-xl hover:bg-[#1B4D3E] transition-colors">
          <Plus className="w-4 h-4" />
          Add Buyer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {DEMO_BUYERS.map((buyer) => (
          <div key={buyer.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#163B2F]" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{buyer.name}</h3>
                  <span className="text-[11px] text-stone-400 font-medium">{buyer.id}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${TYPE_COLORS[buyer.type] || 'bg-stone-100 text-stone-600'}`}>
                  {buyer.type}
                </span>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${buyer.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-500'}`}>
                  {buyer.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>{buyer.location} · {buyer.market}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>{buyer.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wheat className="w-3.5 h-3.5 text-stone-400" />
                <div className="flex flex-wrap gap-1">
                  {buyer.crops.map(c => (
                    <span key={c} className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full text-[11px] font-medium">{c}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
              <button className="flex-1 py-2 text-xs font-semibold text-[#163B2F] border border-[#163B2F]/20 rounded-lg hover:bg-[#163B2F]/5 transition-colors">
                View Requirements
              </button>
              <button className="flex-1 py-2 text-xs font-semibold text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
        <strong>Note:</strong> Buyer data shown is demo/synthetic. Connect to the backend buyer API to manage real buyer profiles and grade requirements.
      </div>
    </div>
  );
};
