import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Sparkles, 
  Package, 
  CheckCircle2, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Leaf 
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Farmers', path: '/farmers', icon: Users },
    { name: 'Advisory', path: '/advisory', icon: Sparkles },
    { name: 'Produce', path: '/produce', icon: Package, planned: 'Phase 2' },
    { name: 'Quality', path: '/quality', icon: CheckCircle2, planned: 'Phase 2' },
    { name: 'Intelligence', path: '/intelligence', icon: BarChart3, planned: 'Phase 3' },
    { name: 'Feedback & Audit', path: '/audit', icon: MessageSquare, planned: 'Phase 2' },
    { name: 'Documentation', path: '/documentation', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-[#163B2F] text-white flex flex-col min-h-screen shrink-0 font-sans shadow-xl">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 rounded-full bg-[#B4F042] flex items-center justify-center text-[#163B2F] shadow-sm">
          <Leaf className="w-5 h-5 fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg tracking-tight text-white leading-none">CropCompass</span>
          <span className="text-[10px] text-[#A1E02F] tracking-wide uppercase font-semibold mt-1">Horticulture Intelligence</span>
        </div>
      </div>

      {/* Section Label */}
      <div className="px-6 pt-6 pb-2 text-[11px] font-bold text-emerald-200/60 uppercase tracking-wider">
        Operations & Intelligence
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 pb-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#B4F042] text-[#0F291E] shadow-md shadow-[#B4F042]/20 font-bold translate-x-1'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-[#0F291E]' : 'text-emerald-300'}`} />
                <span className="flex-1">{item.name}</span>
                {item.planned && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-[#0F291E]/10 text-[#0F291E]' : 'bg-emerald-950/60 text-emerald-300/80'
                  }`}>
                    {item.planned}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer info */}
      <div className="p-4 mx-4 mb-4 rounded-xl bg-emerald-950/50 border border-emerald-800/40 text-xs text-emerald-200/70">
        <div className="font-semibold text-emerald-100 mb-0.5">CropCompass v1.0</div>
        <div className="text-[11px]">Phase 1 Active Prototype</div>
      </div>
    </aside>
  );
};
