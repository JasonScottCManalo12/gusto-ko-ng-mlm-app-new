import React, { useState } from 'react';
import { Member, Transaction, Currency } from '../types/mlm';
import { formatMoney } from '../utils/formatters';
import { 
  Wallet, 
  ArrowDownToLine, 
  Search, 
  Download, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  CreditCard,
  Building2,
  Smartphone
} from 'lucide-react';

interface WalletViewProps {
  currentMember: Member;
  transactions: Transaction[];
  currency: Currency;
  onOpenWithdrawModal: () => void;
}

export const WalletView: React.FC<WalletViewProps> = ({
  currentMember,
  transactions,
  currency,
  onOpenWithdrawModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filtered transactions
  const filtered = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = 
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Date', 'Reference', 'Type', 'Description', 'Amount (PHP)', 'Status'];
    const rows = filtered.map(t => [
      t.date,
      t.referenceCode,
      t.type,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      t.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_ledger_${currentMember.distributorCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                Distributor E-Wallet & Encashment Payouts
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure ledger balances, commission disbursements, GCash/Maya and bank withdrawals
            </p>
          </div>
          <button
            onClick={onOpenWithdrawModal}
            className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm whitespace-nowrap"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Encash / Withdraw Funds</span>
          </button>
        </div>
      </div>

      {/* Wallet Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Available Balance for Encashment</span>
            <span className="text-emerald-400 font-mono text-[11px] font-semibold">Ready to Cash Out</span>
          </div>
          <div className="my-3">
            <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums tracking-tight">
              {formatMoney(currentMember.ewalletBalance, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Minimum encashment: ₱500.00 · Processing fee: ₱50.00
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Pauyot schedule:</span>
            <span className="text-slate-300 font-medium">Daily Cut-off 11:59 PM</span>
          </div>
        </div>

        {/* Total Lifetime Earnings */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Lifetime Commission Earnings</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
              {formatMoney(currentMember.totalLifetimeEarnings, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              All binary pairs, sponsor bonuses & unilevel overrides
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Tax Status:</span>
            <span className="text-emerald-400 font-medium">BIR Form 2307 Withholding Compliant</span>
          </div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Encashments Completed</span>
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-white font-mono tabular-nums tracking-tight">
              {formatMoney(currentMember.totalWithdrawn, currency)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Successfully remitted to GCash, Maya, and BDO accounts
            </p>
          </div>
          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Disbursement Success:</span>
            <span className="text-slate-300 font-medium font-mono">100% Guaranteed</span>
          </div>
        </div>
      </div>

      {/* Payout Channels Banner */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="text-slate-400">Supported Philippine & Global Encashment Channels:</span>
        <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" /> GCash
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> Maya (PayMaya)
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <Building2 className="w-3.5 h-3.5 text-amber-400" /> BDO / BPI / UnionBank
          </span>
          <span className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> USDT TRC-20 Crypto
          </span>
        </div>
      </div>

      {/* Full Transaction Ledger */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Full Transaction Audit Ledger</h2>
            <p className="text-xs text-slate-400">Detailed financial trail of all bonus credits and debits</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ref or memo..."
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 w-44 sm:w-52"
              />
            </div>

            {/* Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="pairing_bonus">Binary Pairing</option>
              <option value="direct_referral">Direct Referral</option>
              <option value="unilevel_rebate">Unilevel Rebate</option>
              <option value="retail_profit">Retail Profit</option>
              <option value="withdrawal">Withdrawals</option>
            </select>

            {/* Export CSV */}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              title="Download ledger spreadsheet"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 font-medium">Date & Time</th>
                <th className="py-3 px-3 font-medium">Reference Code</th>
                <th className="py-3 px-3 font-medium">Type</th>
                <th className="py-3 px-3 font-medium">Description</th>
                <th className="py-3 px-3 font-medium text-right">PV Volume</th>
                <th className="py-3 px-3 font-medium text-right">Amount</th>
                <th className="py-3 px-3 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No transactions match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-400 tabular-nums whitespace-nowrap">
                      {t.date}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 font-semibold whitespace-nowrap">
                      {t.referenceCode}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="capitalize text-slate-200">
                        {t.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 min-w-[260px]">
                      {t.description}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400 whitespace-nowrap">
                      {t.pvGenerated ? `+${t.pvGenerated} PV` : '—'}
                    </td>
                    <td className={`py-3 px-3 text-right font-mono font-bold tabular-nums whitespace-nowrap ${
                      t.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {t.amount >= 0 ? `+${formatMoney(t.amount, currency)}` : formatMoney(t.amount, currency)}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className={`text-[11px] font-mono capitalize ${
                        t.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
