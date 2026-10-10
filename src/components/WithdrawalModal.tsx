import React, { useState } from 'react';
import { Member, Currency } from '../types/mlm';
import { formatMoney } from '../utils/formatters';
import { 
  ArrowDownToLine, 
  X, 
  CheckCircle2, 
  Smartphone, 
  Building2, 
  CreditCard,
  Printer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Member;
  currency: Currency;
  onRequestWithdrawal: (withdrawalData: {
    amount: number;
    channel: string;
    accountName: string;
    accountNumber: string;
  }) => { referenceCode: string; date: string } | null;
}

export const WithdrawalModal: React.FC<WithdrawalModalProps> = ({
  isOpen,
  onClose,
  currentMember,
  currency,
  onRequestWithdrawal,
}) => {
  const [channel, setChannel] = useState<'GCash' | 'Maya' | 'BDO' | 'BPI' | 'USDT'>('GCash');
  const [accountName, setAccountName] = useState(currentMember.fullName);
  const [accountNumber, setAccountNumber] = useState('0917-889-4412');
  const [amount, setAmount] = useState<number>(10000);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedVoucher, setCompletedVoucher] = useState<{
    referenceCode: string;
    date: string;
    amount: number;
    netAmount: number;
    channel: string;
    accountName: string;
    accountNumber: string;
  } | null>(null);

  if (!isOpen) return null;

  const fee = 50; // ₱50 processing fee
  const netAmount = Math.max(0, amount - fee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (amount < 500) {
      setErrorMsg('Minimum encashment amount is ₱500.00.');
      return;
    }

    if (amount > currentMember.ewalletBalance) {
      setErrorMsg(`Insufficient funds. Your available balance is ${formatMoney(currentMember.ewalletBalance, currency)}.`);
      return;
    }

    if (!accountNumber.trim()) {
      setErrorMsg('Please enter your account / phone number.');
      return;
    }

    const res = onRequestWithdrawal({
      amount,
      channel,
      accountName,
      accountNumber,
    });

    if (res) {
      setCompletedVoucher({
        referenceCode: res.referenceCode,
        date: res.date,
        amount,
        netAmount,
        channel,
        accountName,
        accountNumber,
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Encash Commission Earnings</h3>
          </div>
          <button 
            onClick={() => {
              setCompletedVoucher(null);
              onClose();
            }} 
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {completedVoucher ? (
          /* Official Payout Receipt Slip */
          <div className="space-y-4">
            <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-white">Encashment Submitted Successfully!</h4>
              <p className="text-xs text-slate-300">
                Your payout has been authorized and queued for disbursement to your destination account.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Reference:</span>
                <span className="text-emerald-400 font-bold">{completedVoucher.referenceCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-200">{completedVoucher.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Channel:</span>
                <span className="text-white font-bold">{completedVoucher.channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient Name:</span>
                <span className="text-slate-200">{completedVoucher.accountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Account / Mobile:</span>
                <span className="text-slate-200">{completedVoucher.accountNumber}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-400">Requested Amount:</span>
                <span className="text-slate-200">{formatMoney(completedVoucher.amount, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Processing Fee:</span>
                <span>-{formatMoney(50, currency)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span className="text-white">Net Payout Transferred:</span>
                <span className="text-emerald-400">{formatMoney(completedVoucher.netAmount, currency)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                onClick={() => {
                  setCompletedVoucher(null);
                  onClose();
                }}
                className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Encashment Form */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Current Balance Bar */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[11px]">Available Withdrawable Balance:</span>
                <span className="text-emerald-400 font-mono font-bold text-base">
                  {formatMoney(currentMember.ewalletBalance, currency)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-1 rounded">
                Min: ₱500.00
              </span>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Destination Payout Channel</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'GCash', label: 'GCash', icon: Smartphone },
                  { id: 'Maya', label: 'Maya', icon: Smartphone },
                  { id: 'BDO', label: 'BDO Unibank', icon: Building2 },
                  { id: 'BPI', label: 'BPI Bank', icon: Building2 },
                  { id: 'USDT', label: 'USDT (TRC20)', icon: CreditCard },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = channel === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setChannel(item.id as any)}
                      className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'border-emerald-500 bg-slate-800 text-white font-semibold ring-1 ring-emerald-500/30'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[11px] truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Registered Account Holder Name</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {channel === 'GCash' || channel === 'Maya' ? 'Mobile Number' : 'Account Number / Wallet Address'}
                </label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={channel === 'GCash' ? '0917-xxx-xxxx' : 'Account number'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">Encashment Amount (PHP)</label>
                  <button
                    type="button"
                    onClick={() => setAmount(currentMember.ewalletBalance)}
                    className="text-emerald-400 hover:text-emerald-300 text-[10px] font-semibold"
                  >
                    Encash All
                  </button>
                </div>
                <input
                  type="number"
                  min="500"
                  max={currentMember.ewalletBalance}
                  step="100"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono text-sm font-bold"
                />
              </div>
            </div>

            {/* Computation preview */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Requested Amount:</span>
                <span className="text-white">{formatMoney(amount, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fixed Processing Fee:</span>
                <span className="text-rose-400">-{formatMoney(fee, currency)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 font-bold text-xs">
                <span className="text-white">Net Payout to Receive:</span>
                <span className="text-emerald-400">{formatMoney(netAmount, currency)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
              >
                Confirm & Cash Out
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
