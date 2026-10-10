import React from 'react';
import { Member, Currency } from '../types/mlm';
import { formatMoney, formatNumber } from '../utils/formatters';
import { 
  Trophy, 
  Award, 
  Star, 
  CheckCircle, 
  ShieldCheck, 
  Crown, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface RankLeaderboardProps {
  currentMember: Member;
  allMembers: Member[];
  currency: Currency;
}

export const RankLeaderboard: React.FC<RankLeaderboardProps> = ({
  currentMember,
  allMembers,
  currency,
}) => {
  // Ranks ladder definitions
  const rankLadder = [
    {
      name: 'Starter Associate',
      badge: 'Starter',
      color: 'border-emerald-500 text-emerald-400',
      minPPV: 100,
      minGPV: 100,
      minDirects: 0,
      perks: 'Basic wholesale discount (35%) & Direct referral bonus eligible.',
    },
    {
      name: 'Bronze Leader',
      badge: 'Bronze',
      color: 'border-orange-500 text-orange-400',
      minPPV: 120,
      minGPV: 1500,
      minDirects: 2,
      perks: 'Unilevel Generation 1 & 2 overrides unlocked.',
    },
    {
      name: 'Silver Executive',
      badge: 'Silver',
      color: 'border-slate-300 text-slate-200',
      minPPV: 200,
      minGPV: 4000,
      minDirects: 4,
      perks: '₱15,000 one-time milestone gadget incentive & Unilevel Gen 3 unlocked.',
    },
    {
      name: 'Gold Director',
      badge: 'Gold',
      color: 'border-amber-400 text-amber-300',
      minPPV: 300,
      minGPV: 8000,
      minDirects: 6,
      perks: 'Car incentive subsidy (₱25,000/mo) & VIP leadership retreats.',
    },
    {
      name: 'Diamond Director',
      badge: 'Diamond',
      color: 'border-cyan-400 text-cyan-300',
      minPPV: 450,
      minGPV: 15000,
      minDirects: 8,
      perks: '2% Global Company Profit Pool sharing & Luxury Rolex watch reward.',
    },
    {
      name: 'Crown Ambassador',
      badge: 'Crown Ambassador',
      color: 'border-yellow-400 text-yellow-300',
      minPPV: 600,
      minGPV: 40000,
      minDirects: 12,
      perks: 'Top tier 3% profit distribution, Dream House housing fund, international business class travel.',
    },
  ];

  // Leaderboard sorted by totalLifetimeEarnings
  const leaderboard = [...allMembers].sort((a, b) => b.totalLifetimeEarnings - a.totalLifetimeEarnings);

  // Group PV of current member
  const currentGPV = currentMember.leftLegPV + currentMember.rightLegPV;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                Rank Advancement & Hall of Fame Leaderboard
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Leadership career path qualifications, global profit pool milestones, and top earners
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Your Current Rank:</span>
            <span className="font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2.5 py-1 rounded-md">
              {currentMember.rank} Director
            </span>
          </div>
        </div>
      </div>

      {/* Current Rank Qualification Tracker */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Next Milestone Target: Crown Ambassador</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Track your required personal volume, group volume, and direct leadership legs
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-400">
            Progress: ~82%
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* PPV Requirement */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Personal Maintenance (PPV):</span>
              <span className="font-mono text-emerald-400 font-bold">{currentMember.personalPV} / 600 PV</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full" 
                style={{ width: `${Math.min(100, (currentMember.personalPV / 600) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400">Need {Math.max(0, 600 - currentMember.personalPV)} more PPV to achieve tier</p>
          </div>

          {/* Group PV Requirement */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Group Volume (GPV):</span>
              <span className="font-mono text-blue-400 font-bold">{formatNumber(currentGPV)} / 40,000 PV</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${Math.min(100, (currentGPV / 40000) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-400">{formatNumber(Math.max(0, 40000 - currentGPV))} GPV remaining from team sales</p>
          </div>

          {/* Directs Requirement */}
          <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Active Direct Leaders:</span>
              <span className="font-mono text-amber-400 font-bold">{currentMember.totalDirects} / 12 Directs</span>
            </div>
            <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: `${Math.min(100, (currentMember.totalDirects / 12) * 100)}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">✓ Qualified! (14 active directs)</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Rank Career Path Hierarchy (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-2">
            Apex Leadership Career Ladder
          </h2>

          <div className="space-y-3">
            {rankLadder.map((r, idx) => {
              const isCurrent = currentMember.rank === r.badge;
              return (
                <div
                  key={r.name}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500/40'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">0{idx + 1}.</span>
                      <h4 className="text-xs font-bold text-white">{r.name}</h4>
                      {isCurrent && (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-900/60 px-1.5 py-0.5 rounded">
                          YOU ARE HERE
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-semibold ${r.color}`}>
                      {r.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400 py-1.5 border-y border-slate-800/60 my-1.5">
                    <div>PPV: <span className="text-slate-200 font-bold">{r.minPPV}</span></div>
                    <div>GPV: <span className="text-slate-200 font-bold">{formatNumber(r.minGPV)}</span></div>
                    <div>Directs: <span className="text-slate-200 font-bold">{r.minDirects}</span></div>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1">
                    {r.perks}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hall of Fame Leaderboard (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400" />
              <span>Hall of Fame - Top Earners</span>
            </h2>
            <span className="text-[11px] font-mono text-slate-400">All-Time</span>
          </div>

          <div className="space-y-3">
            {leaderboard.map((m, index) => {
              const medalColors = [
                'text-amber-300 bg-amber-950/80 border-amber-600',
                'text-slate-200 bg-slate-800 border-slate-600',
                'text-amber-600 bg-amber-950/40 border-amber-800',
              ];
              const isTop3 = index < 3;

              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                    m.id === currentMember.id
                      ? 'border-emerald-500/80 bg-slate-900'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-xs border ${
                      isTop3 ? medalColors[index] : 'border-slate-800 text-slate-500 bg-slate-950'
                    }`}>
                      {index + 1}
                    </div>

                    <img
                      src={m.avatar}
                      alt={m.fullName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />

                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{m.fullName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {m.rank} · {m.totalTeamCount} downlines
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                      {formatMoney(m.totalLifetimeEarnings, currency)}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {m.matchedPairsCount} pairs matched
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
