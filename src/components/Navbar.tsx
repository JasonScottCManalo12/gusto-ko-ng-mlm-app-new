import React from 'react';
import { Member, Currency } from '../types/mlm';
import { 
  Network, 
  Wallet, 
  ShoppingBag, 
  Users, 
  Calculator, 
  Trophy, 
  LayoutDashboard,
  UserPlus,
  RefreshCw
} from 'lucide-react';

interface NavbarProps {
  currentMember: Member;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenEnrollModal: () => void;
  onResetData: () => void;
  allMembers: Member[];
  onSwitchMember: (memberId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentMember,
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenEnrollModal,
  onResetData,
  allMembers,
  onSwitchMember,
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'genealogy', label: 'Genealogy Tree', icon: Network },
    { id: 'wallet', label: 'E-Wallet & Payouts', icon: Wallet },
    { id: 'products', label: 'Products & Store', icon: ShoppingBag },
    { id: 'prospects', label: 'Prospect CRM', icon: Users },
    { id: 'calculator', label: 'Earnings Simulator', icon: Calculator },
    { id: 'ranks', label: 'Ranks & Leaderboard', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      {/* Universal Top Bar Contract: 3 Zones with gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark in display face */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setActiveTab('overview')} 
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              ▲
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              Apex Network
            </span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 text-sm ${
                  isActive 
                    ? 'text-emerald-400 border-emerald-500 font-semibold' 
                    : 'text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action & utility controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setCurrency('PHP')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                currency === 'PHP' 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ₱ PHP
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                currency === 'USD' 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              $ USD
            </button>
          </div>

          {/* Member Profile Switcher (Demo View) */}
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={currentMember.id}
              onChange={(e) => onSwitchMember(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-md px-2.5 py-1.5 focus:outline-none focus:border-emerald-500 max-w-[160px] truncate"
              title="Switch demo account"
            >
              {allMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.fullName} ({m.rank})
                </option>
              ))}
            </select>
          </div>

          {/* Primary CTA: Enroll Downline */}
          <button
            onClick={onOpenEnrollModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors shadow-sm whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Enroll Downline</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={onResetData}
            title="Reset to default demo data"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-md transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
