import React, { useState, useEffect } from 'react';
import { Member, PackagePlan, Currency } from '../types/mlm';
import { INITIAL_PACKAGES } from '../data/initialData';
import { formatMoney } from '../utils/formatters';
import { UserPlus, X, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMember: Member;
  allMembers: Member[];
  currency: Currency;
  initialParentId?: string;
  initialLeg?: 'left' | 'right';
  initialName?: string;
  initialPhone?: string;
  onEnroll: (newMemberData: {
    fullName: string;
    username: string;
    email: string;
    packageId: string;
    sponsorId: string;
    placementParentId: string;
    position: 'left' | 'right';
  }) => void;
}

export const NewMemberModal: React.FC<NewMemberModalProps> = ({
  isOpen,
  onClose,
  currentMember,
  allMembers,
  currency,
  initialParentId,
  initialLeg,
  initialName,
  initialPhone,
  onEnroll,
}) => {
  const [fullName, setFullName] = useState(initialName || '');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [packageId, setPackageId] = useState('pkg_builder');
  const [sponsorId, setSponsorId] = useState(currentMember.id);
  const [placementParentId, setPlacementParentId] = useState(initialParentId || currentMember.id);
  const [position, setPosition] = useState<'left' | 'right'>(initialLeg || 'left');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialName) {
      setFullName(initialName);
      setUsername(initialName.toLowerCase().replace(/\s+/g, '') + Math.floor(10 + Math.random() * 89));
      setEmail(`${initialName.toLowerCase().replace(/\s+/g, '')}@gmail.com`);
    } else {
      setFullName('');
      setUsername('');
      setEmail('');
    }
    if (initialParentId) setPlacementParentId(initialParentId);
    if (initialLeg) setPosition(initialLeg);
  }, [initialName, initialParentId, initialLeg, isOpen]);

  if (!isOpen) return null;

  const selectedPkg = INITIAL_PACKAGES.find(p => p.id === packageId) || INITIAL_PACKAGES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !username.trim()) {
      setErrorMsg('Please enter the full name and username.');
      return;
    }

    // Check if position under placement parent is already occupied
    const existingOccupant = allMembers.find(
      m => m.placementParentId === placementParentId && m.position === position
    );

    if (existingOccupant) {
      setErrorMsg(`The ${position.toUpperCase()} leg under ${existingOccupant.fullName} is already occupied. Please select an unoccupied placement position.`);
      return;
    }

    onEnroll({
      fullName: fullName.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim() || `${username.trim().toLowerCase()}@example.com`,
      packageId,
      sponsorId,
      placementParentId,
      position,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Enroll New Downline Member</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Member Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (!username) {
                    setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                  }
                }}
                placeholder="e.g. Rowena Bautista"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Distributor Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. rowena_b"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rowena@example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Starter Package Plan</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {INITIAL_PACKAGES.map((pkg) => (
                <button
                  type="button"
                  key={pkg.id}
                  onClick={() => setPackageId(pkg.id)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    packageId === pkg.id
                      ? 'border-emerald-500 bg-slate-800 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white text-xs truncate">{pkg.name}</div>
                  <div className="text-emerald-400 font-mono font-bold text-xs mt-0.5">
                    {formatMoney(pkg.price, currency)}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    +{pkg.pv} PV · Direct Bonus: {formatMoney(pkg.directBonus, currency)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Placement & Binary Hierarchy Settings */}
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-200 block">
              Binary Tree Placement Coordinates
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Placement Parent (Sits under):</label>
                <select
                  value={placementParentId}
                  onChange={(e) => setPlacementParentId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
                >
                  {allMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.fullName} ({m.distributorCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Placement Leg Position:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPosition('left')}
                    className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-all ${
                      position === 'left'
                        ? 'border-blue-500 bg-blue-950/50 text-blue-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Left Leg
                  </button>
                  <button
                    type="button"
                    onClick={() => setPosition('right')}
                    className={`py-1.5 px-2 rounded-lg border text-center font-semibold transition-all ${
                      position === 'right'
                        ? 'border-emerald-500 bg-emerald-950/50 text-emerald-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    Right Leg
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Direct Sponsor Credit:</label>
              <select
                value={sponsorId}
                onChange={(e) => setSponsorId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
              >
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} (Receives {formatMoney(selectedPkg.directBonus, currency)} Referral Bonus)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reward Summary Pill */}
          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300">Instant Sponsor Payout:</span>
            </div>
            <span className="font-mono font-bold text-emerald-400 text-sm">
              +{formatMoney(selectedPkg.directBonus, currency)} Direct Bonus
            </span>
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
              Confirm Enrollment & Generate ID
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
