import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  FileCheck, 
  Package, 
  CheckCircle2, 
  ShoppingBag, 
  QrCode, 
  MessageSquare, 
  Leaf, 
  LogOut,
  Building2 
} from 'lucide-react';

interface BuyerLayoutProps {
  children: React.ReactNode;
}

export const BuyerLayout: React.FC<BuyerLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/buyer/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/buyer/dashboard', icon: LayoutDashboard },
    { name: 'Requirements', path: '/buyer/requirements', icon: FileCheck },
    { name: 'Available Produce', path: '/buyer/produce', icon: Package },
    { name: 'Quality Inspections', path: '/buyer/quality', icon: CheckCircle2 },
    { name: 'Orders / Requests', path: '/buyer/orders', icon: ShoppingBag },
    { name: 'Traceability', path: '/buyer/traceability', icon: QrCode },
    { name: 'Quality Feedback', path: '/buyer/feedback', icon: MessageSquare },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] font-sans">
      {/* Buyer Portal Sidebar */}
      <aside className="w-64 bg-[#163B2F] text-white flex flex-col min-h-screen shrink-0 shadow-xl">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 rounded-full bg-[#B4F042] flex items-center justify-center text-[#163B2F] shadow-sm">
            <Leaf className="w-5 h-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-white leading-none">CropCompaz</span>
            <span className="text-[10px] text-[#A1E02F] tracking-wide uppercase font-semibold mt-1">Buyer Procurement</span>
          </div>
        </div>

        {/* User Card */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-800 flex items-center justify-center text-emerald-200">
            <Building2 className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="text-xs font-bold text-white truncate">{user?.name || 'Buyer Account'}</div>
            <div className="text-[10px] text-emerald-300 font-mono truncate">{user?.email || user?.phone}</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/buyer/dashboard'}
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
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-200 hover:bg-rose-900/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-stone-200/80 bg-[#FAF8F5]/80 backdrop-blur px-8 flex items-center justify-between sticky top-0 z-20">
          <h1 className="text-sm font-semibold text-stone-600 tracking-wide">
            CropCompaz · Produce Sourcing & Quality Verification
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-stone-700">{user?.name}</span>
          </div>
        </header>

        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
