import React, { useState } from 'react';
import { Member, Transaction, Currency } from '../types/mlm';
import { formatMoney, formatNumber } from '../utils/formatters';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Copy, 
  Check, 
  Award, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  GitFork, 
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface OverviewDashboardProps {
  currentMember: Member;
  transactions: Transaction[];
  currency: Currency;
  onOpenEnrollModal: () => void;
  onOpenWithdrawModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  currentMember,
  transactions,
  currency,
  onOpenEnrollModal,
  onOpenWithdrawModal,
  onNavigateTab,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const referralUrl = `https://apexnetwork.vip/join?ref=${currentMember.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Binary calculations
  const totalLegPV = currentMember.leftLegPV + currentMember.rightLegPV;
  const leftPercent = totalLegPV > 0 ? Math.round((currentMember.leftLegPV / totalLegPV) * 100) : 50;
  const rightPercent = 100 - leftPercent;
  const weakerLeg = currentMember.leftLegPV <= currentMember.rightLegPV ? 'Left' : 'Right';
  const carryOverPV = Math.abs(currentMember.leftLegPV - currentMember.rightLegPV);

  // Income stream aggregation from transactions
  const directIncome = transactions
    .filter(t => t.type === 'direct_referral' && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pairingIncome = transactions
    .filter(t => t.type === 'pairing_bonus' && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const unilevelIncome = transactions
    .filter(t => t.type === 'unilevel_rebate' && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const retailIncome = transactions
    .filter(t => t.type === 'retail_profit' && t.status === 'completed')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner / Distributor Profile Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentMember.avatar}
                alt={currentMember.fullName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-emerald-500/40 shadow-inner"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow">
                {currentMember.rank}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {currentMember.fullName}
                </h1>
                <span className="text-xs text-slate-400 font-mono">
                  ID: {currentMember.distributorCode}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Monthly Active ({currentMember.personalPV} PV)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Joined {currentMember.joinDate} · Direct Sponsor: {currentMember.sponsorId ? 'Active Senior Leader' : 'Company Direct'}
              </p>
            </div>
          </div>

          {/* Quick Actions & Referral Link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <span className="text-slate-500 mr-2 shrink-0">Replication Link:</span>
              <span className="text-slate-300 font-mono truncate max-w-[190px]">{referralUrl}</span>
              <button
                onClick={handleCopyLink}
                className="ml-2 text-slate-400 hover:text-emerald-400 transition-colors p-1"
                title="Copy personal link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenWithdrawModal}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 whitespace-nowrap"
              >
                Encash Payout
              </button>
              <button
                onClick={onOpenEnrollModal}
                className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
              >
                + Place Downline
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available E-Wallet */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Available E-Wallet</span>
            <button 
              onClick={() => onNavigateTab('wallet')}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 text-[11px]"
            >
              Ledger <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              {formatMoney(currentMember.ewalletBalance, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Ready for GCash, Maya, or Bank transfer
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Total Withdrawn:</span>
            <span className="font-mono tabular-nums text-slate-300">{formatMoney(currentMember.totalWithdrawn, currency)}</span>
          </div>
        </div>

        {/* Lifetime Commission Earnings */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Lifetime Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums tracking-tight">
              {formatMoney(currentMember.totalLifetimeEarnings, currency)}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Cumulative commissions & retail profits
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Current Rank:</span>
            <span className="font-semibold text-emerald-400">{currentMember.rank} Director</span>
          </div>
        </div>

        {/* Binary Matched Pairs */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Binary Pairing Matches</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              {formatNumber(currentMember.matchedPairsCount)} <span className="text-sm font-normal text-slate-400">Pairs</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              @ ₱1,500 per 100 PV Left : 100 PV Right
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Daily Pairing Cap:</span>
            <span className="font-mono tabular-nums text-slate-300">16 pairs/day (Pro)</span>
          </div>
        </div>

        {/* Team Downline Network Size */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Downline Network</span>
            <GitFork className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-2">
            <div className="text-2xl font-bold text-white font-mono tabular-nums tracking-tight">
              {formatNumber(currentMember.totalTeamCount)} <span className="text-sm font-normal text-slate-400">Members</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {currentMember.totalDirects} Direct Personally Sponsored
            </p>
          </div>
          <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
            <span>Personal PV:</span>
            <span className="font-mono tabular-nums text-emerald-400 font-semibold">{currentMember.personalPV} PV</span>
          </div>
        </div>
      </div>

      {/* Binary Volume Balance & Weaker Leg Strategy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">
                Binary Points Balance (Left vs Right Leg)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Every 100 PV on Left + 100 PV on Right automatically creates 1 Sales Match Pair = ₱1,500.00
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('genealogy')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
            >
              View Genealogy <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Leg Comparison Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500"></span>
                <span className="text-slate-300 font-semibold">Left Leg Volume:</span>
                <span className="text-white font-bold tabular-nums">{formatNumber(currentMember.leftLegPV)} PV</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold tabular-nums">{formatNumber(currentMember.rightLegPV)} PV</span>
                <span className="text-slate-300 font-semibold">:Right Leg Volume</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              </div>
            </div>

            <div className="h-4 bg-slate-950 rounded-full overflow-hidden flex p-0.5 border border-slate-800">
              <div 
                className="bg-blue-500 rounded-l-full transition-all duration-500" 
                style={{ width: `${leftPercent}%` }}
              ></div>
              <div 
                className="bg-emerald-500 rounded-r-full transition-all duration-500" 
                style={{ width: `${rightPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{leftPercent}% Distribution</span>
              <span>{rightPercent}% Distribution</span>
            </div>
          </div>

          {/* Strategic Placement Intelligence */}
          <div className="mt-5 p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Next Recommended Placement: <strong className="text-emerald-400">{weakerLeg} Leg</strong></span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                You have <span className="font-mono tabular-nums text-white font-semibold">{formatNumber(carryOverPV)} PV</span> carryover points waiting on your strong leg. Placing your next recruit on the <span className="font-semibold text-emerald-400">{weakerLeg} leg</span> triggers immediate pairing payouts without points waste!
              </p>
            </div>
            <button
              onClick={onOpenEnrollModal}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-800 rounded-md transition-colors shrink-0"
            >
              Place on {weakerLeg} Leg
            </button>
          </div>
        </div>

        {/* Income Breakdown by Compensation Stream */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">
              Compensation Streams
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              4 Ways to Earn breakdown
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <span className="text-slate-300">Binary Pairing Matches</span>
                </div>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {formatMoney(pairingIncome, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span className="text-slate-300">Direct Referral Bonuses</span>
                </div>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {formatMoney(directIncome, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <span className="text-slate-300">Unilevel Repeat Overrides</span>
                </div>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {formatMoney(unilevelIncome, currency)}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-slate-300">Direct Retail Sales Margin</span>
                </div>
                <span className="text-xs font-mono font-bold text-white tabular-nums">
                  {formatMoney(retailIncome, currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Projected Monthly Rate</span>
            <button
              onClick={() => onNavigateTab('calculator')}
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              Simulate Growth <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Ledger Transactions */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Ledger Transactions</h2>
            <p className="text-xs text-slate-400">Live payouts, bonus distributions, and retailing</p>
          </div>
          <button
            onClick={() => onNavigateTab('wallet')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            View Full Ledger →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3 font-medium">Timestamp</th>
                <th className="py-2.5 px-3 font-medium">Type</th>
                <th className="py-2.5 px-3 font-medium">Description</th>
                <th className="py-2.5 px-3 font-medium text-right">Points (PV)</th>
                <th className="py-2.5 px-3 font-medium text-right">Amount</th>
                <th className="py-2.5 px-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {transactions.slice(0, 5).map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-slate-400 tabular-nums">{t.date}</td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-200 capitalize">
                      {t.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 max-w-[280px] truncate text-slate-300">{t.description}</td>
                  <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-400">
                    {t.pvGenerated ? `+${t.pvGenerated} PV` : '—'}
                  </td>
                  <td className={`py-2.5 px-3 text-right font-mono font-semibold tabular-nums ${
                    t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {t.amount >= 0 ? `+${formatMoney(t.amount, currency)}` : formatMoney(t.amount, currency)}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[11px] text-slate-400">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
