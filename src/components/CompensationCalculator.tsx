import React, { useState } from 'react';
import { Currency, PackagePlan } from '../types/mlm';
import { INITIAL_PACKAGES } from '../data/initialData';
import { formatMoney, formatNumber } from '../utils/formatters';
import { 
  Calculator, 
  TrendingUp, 
  Zap, 
  Layers, 
  ShoppingBag, 
  ShieldCheck, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface CompensationCalculatorProps {
  currency: Currency;
  onSimulateBatchJoin?: (count: number) => void;
}

export const CompensationCalculator: React.FC<CompensationCalculatorProps> = ({
  currency,
  onSimulateBatchJoin,
}) => {
  const [directRecruits, setDirectRecruits] = useState<number>(4);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('pkg_builder');
  const [duplicationFactor, setDuplicationFactor] = useState<number>(2); // Each member recruits X
  const [depthLevels, setDepthLevels] = useState<number>(3);
  const [monthlyReorderPV, setMonthlyReorderPV] = useState<number>(100);

  const selectedPackage = INITIAL_PACKAGES.find(p => p.id === selectedPackageId) || INITIAL_PACKAGES[0];

  // Calculations
  // 1. Direct referral bonus
  const directReferralTotal = directRecruits * selectedPackage.directBonus;

  // 2. Binary Network Growth Simulation
  // Calculate total members across levels
  // Level 1 = directRecruits
  // Level 2 = directRecruits * duplicationFactor
  // Level 3 = directRecruits * duplicationFactor^2
  let totalSimulatedTeam = 0;
  const levelCounts: number[] = [];
  for (let l = 1; l <= depthLevels; l++) {
    const count = directRecruits * Math.pow(duplicationFactor, l - 1);
    levelCounts.push(count);
    totalSimulatedTeam += count;
  }

  // Balanced Binary assumption: half on left, half on right
  const teamPerLeg = Math.floor(totalSimulatedTeam / 2);
  const legPV = teamPerLeg * selectedPackage.pv;
  const potentialPairs = Math.floor(legPV / 100);

  // Pairing bonus safety net cap
  // Daily cap * 30 days
  const monthlyMaxPairsCap = selectedPackage.dailyMaxPairs * 30;
  const actualPairsPaid = Math.min(potentialPairs, monthlyMaxPairsCap);
  const binaryPairingBonusMonthly = actualPairsPaid * selectedPackage.pairingBonus;

  // 3. Unilevel Product Reorder Rebates
  // 1 PV = ~₱40-50 retail volume, with override rates 5%, 4%, 3%, 2%, 1%
  const unilevelRates = [0.05, 0.04, 0.03, 0.02, 0.01];
  let unilevelMonthlyTotal = 0;
  levelCounts.forEach((count, idx) => {
    const rate = unilevelRates[idx] || 0.01;
    // Each 100 PV product corresponds to ~₱3,000 product retail order
    const productVolumePesos = count * (monthlyReorderPV * 30);
    unilevelMonthlyTotal += productVolumePesos * rate;
  });

  // Total Estimated Monthly Income
  const totalProjectedMonthly = directReferralTotal + binaryPairingBonusMonthly + unilevelMonthlyTotal;
  const annualizedProjected = totalProjectedMonthly * 12;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                MLM Compensation Plan & Earnings Simulator
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate duplication mathematics, binary pairing safety nets, and recurring unilevel overrides
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded-md font-mono">
              Hybrid Binary-Unilevel Matrix
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Sliders (7 cols) */}
        <div className="lg:col-span-7 space-y-5 bg-slate-900/60 border border-slate-800/80 rounded-xl p-5">
          <h2 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
            Network Duplication Variables
          </h2>

          {/* Variable 1: Starter Package Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Package Type Enrolled by Recruits
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {INITIAL_PACKAGES.map((pkg) => (
                <button
                  key={pkg.id}
                  onClick={() => setSelectedPackageId(pkg.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedPackageId === pkg.id
                      ? 'border-emerald-500 bg-slate-850 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">{pkg.name}</div>
                  <div className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                    {formatMoney(pkg.price, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    {pkg.pv} PV · Max {pkg.dailyMaxPairs} pairs/day
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Variable 2: Personal Directs Sponsored */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">
                Direct Members You Sponsor Personally
              </span>
              <span className="font-mono font-bold text-emerald-400 text-sm">
                {directRecruits} Directs
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={directRecruits}
              onChange={(e) => setDirectRecruits(parseInt(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1 member</span>
              <span>10 members</span>
              <span>20 members</span>
            </div>
          </div>

          {/* Variable 3: Downline Duplication Factor */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">
                Duplication Factor (How many each recruit sponsors)
              </span>
              <span className="font-mono font-bold text-blue-400 text-sm">
                {duplicationFactor}x Duplication
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={duplicationFactor}
              onChange={(e) => setDuplicationFactor(parseInt(e.target.value))}
              className="w-full accent-blue-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1x (Slow)</span>
              <span>2x (Power of 2)</span>
              <span>3x</span>
              <span>4x</span>
              <span>5x (Exponential)</span>
            </div>
          </div>

          {/* Variable 4: Duplication Depth Levels */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">
                Downline Matrix Depth
              </span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                Level {depthLevels}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={depthLevels}
              onChange={(e) => setDepthLevels(parseInt(e.target.value))}
              className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>1 Gen</span>
              <span>2 Gens</span>
              <span>3 Gens</span>
              <span>4 Gens</span>
              <span>5 Gens</span>
            </div>
          </div>

          {/* Variable 5: Monthly Product Maintenance Reorder */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-slate-300">
                Monthly Consumable Reorder per Member
              </span>
              <span className="font-mono font-bold text-purple-400 text-sm">
                {monthlyReorderPV} PV / month
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="250"
              step="25"
              value={monthlyReorderPV}
              onChange={(e) => setMonthlyReorderPV(parseInt(e.target.value))}
              className="w-full accent-purple-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 PV (No repeat)</span>
              <span>100 PV (~2-3 products)</span>
              <span>250 PV (Heavy consumer)</span>
            </div>
          </div>

          {/* Duplication Breakdown Table */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 block mb-2">
              Downline Duplication Multiplier Table:
            </span>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {levelCounts.map((cnt, i) => (
                <div key={i} className="p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 font-mono">Gen {i + 1}</div>
                  <div className="font-mono font-bold text-white text-xs mt-0.5">
                    {formatNumber(cnt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Projected Real-Time Earnings Card (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-semibold text-slate-400">Total Projected Earnings</span>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Mathematical Duplication
                </span>
              </div>

              {/* Huge Highlight Number */}
              <div className="my-5 p-4 bg-slate-950/90 border border-emerald-500/30 rounded-xl">
                <span className="text-xs text-slate-400 block mb-1">Estimated Monthly Income:</span>
                <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
                  {formatMoney(totalProjectedMonthly, currency)}
                </div>
                <div className="text-xs text-slate-400 mt-2 font-mono flex items-center justify-between border-t border-slate-800/60 pt-2">
                  <span>Annualized Potential:</span>
                  <span className="text-white font-bold">{formatMoney(annualizedProjected, currency)}</span>
                </div>
              </div>

              {/* Breakdown by Stream */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="text-slate-200 font-medium">Binary Pairing Matches</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {formatNumber(actualPairsPaid)} pairs × ₱1,500
                        {potentialPairs > monthlyMaxPairsCap && ' (Safety Net Capped)'}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatMoney(binaryPairingBonusMonthly, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="text-slate-200 font-medium">Direct Referral Bonuses</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {directRecruits} Directs × {formatMoney(selectedPackage.directBonus, currency)}
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatMoney(directReferralTotal, currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-slate-200 font-medium">Unilevel Product Rebates</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Recurring repeat orders across {depthLevels} gens
                      </div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatMoney(unilevelMonthlyTotal, currency)}
                  </span>
                </div>
              </div>

              {/* Safety Net Guarantee Note */}
              <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300 font-semibold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Legitimate Company Safety Net</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Daily flash-out caps ({selectedPackage.dailyMaxPairs} pairs/day) protect company stability and ensure 100% guaranteed commission encashment payouts for all legitimate distributors.
                </p>
              </div>
            </div>

            {/* Test Duplication Button */}
            {onSimulateBatchJoin && (
              <div className="pt-4 border-t border-slate-800 mt-4">
                <button
                  onClick={() => onSimulateBatchJoin(2)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Simulate Duplication (Add 2 Recruits to Live Tree)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
