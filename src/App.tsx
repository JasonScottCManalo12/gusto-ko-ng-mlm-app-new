/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Member, Product, Transaction, Prospect, Currency } from './types/mlm';
import { 
  INITIAL_MEMBERS, 
  INITIAL_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_PROSPECTS,
  INITIAL_PACKAGES 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { GenealogyTree } from './components/GenealogyTree';
import { WalletView } from './components/WalletView';
import { ProductStore } from './components/ProductStore';
import { ProspectFunnel } from './components/ProspectFunnel';
import { CompensationCalculator } from './components/CompensationCalculator';
import { RankLeaderboard } from './components/RankLeaderboard';
import { NewMemberModal } from './components/NewMemberModal';
import { WithdrawalModal } from './components/WithdrawalModal';
import { CartModal, CartItem } from './components/CartModal';

export default function App() {
  // LocalStorage-backed state
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('apex_mlm_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [currentMemberId, setCurrentMemberId] = useState<string>(() => {
    return localStorage.getItem('apex_mlm_current_id') || 'mem_root';
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('apex_mlm_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  const [prospects, setProspects] = useState<Prospect[]>(() => {
    const saved = localStorage.getItem('apex_mlm_prospects');
    return saved ? JSON.parse(saved) : INITIAL_PROSPECTS;
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    return (localStorage.getItem('apex_mlm_currency') as Currency) || 'PHP';
  });

  const [activeTab, setActiveTab] = useState<string>('overview');

  // Modal States
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollPlacementParentId, setEnrollPlacementParentId] = useState<string | undefined>(undefined);
  const [enrollLeg, setEnrollLeg] = useState<'left' | 'right' | undefined>(undefined);
  const [enrollInitialName, setEnrollInitialName] = useState<string | undefined>(undefined);
  const [enrollInitialPhone, setEnrollInitialPhone] = useState<string | undefined>(undefined);

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('apex_mlm_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('apex_mlm_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('apex_mlm_prospects', JSON.stringify(prospects));
  }, [prospects]);

  useEffect(() => {
    localStorage.setItem('apex_mlm_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('apex_mlm_current_id', currentMemberId);
  }, [currentMemberId]);

  // Current active member
  const currentMember = members.find(m => m.id === currentMemberId) || members[0];

  // Reset to default demo data
  const handleResetData = () => {
    if (window.confirm('Reset all demo network data to initial factory state?')) {
      localStorage.clear();
      setMembers(INITIAL_MEMBERS);
      setTransactions(INITIAL_TRANSACTIONS);
      setProspects(INITIAL_PROSPECTS);
      setCurrentMemberId('mem_root');
      setCartItems([]);
      showToast('Demo network restored to pristine state.');
    }
  };

  // Enroll New Downline Member & Compute Binary Volume + Pairing Matches
  const handleEnrollMember = (data: {
    fullName: string;
    username: string;
    email: string;
    packageId: string;
    sponsorId: string;
    placementParentId: string;
    position: 'left' | 'right';
  }) => {
    const pkg = INITIAL_PACKAGES.find(p => p.id === data.packageId) || INITIAL_PACKAGES[0];
    const newId = `mem_${Date.now()}`;
    const codeNum = 88000 + members.length + 1;
    const distributorCode = `APX-${codeNum}`;

    const newMember: Member = {
      id: newId,
      distributorCode,
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      rank: 'Starter',
      joinDate: new Date().toISOString().split('T')[0],
      sponsorId: data.sponsorId,
      placementParentId: data.placementParentId,
      position: data.position,
      personalPV: pkg.pv,
      leftLegPV: 0,
      rightLegPV: 0,
      matchedPairsCount: 0,
      totalDirects: 0,
      totalTeamCount: 1,
      ewalletBalance: 0,
      totalLifetimeEarnings: 0,
      totalWithdrawn: 0,
      isMonthlyActive: true,
    };

    // Update ancestor trees and sponsors
    let updatedMembers = [...members, newMember];
    const newTransactions: Transaction[] = [];

    // 1. Direct Sponsor Bonus
    const sponsor = updatedMembers.find(m => m.id === data.sponsorId);
    if (sponsor) {
      sponsor.ewalletBalance += pkg.directBonus;
      sponsor.totalLifetimeEarnings += pkg.directBonus;
      sponsor.totalDirects += 1;

      newTransactions.push({
        id: `tx_${Date.now()}_dir`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'direct_referral',
        amount: pkg.directBonus,
        description: `Direct Referral Bonus: New ${pkg.name} (${newMember.fullName})`,
        status: 'completed',
        referenceCode: `DIR-${Math.floor(10000 + Math.random() * 89999)}`,
        pvGenerated: pkg.pv,
      });
    }

    // 2. Propagate Binary Leg Volume up the lineage & test for Pairing Matches
    let currentChildId = newId;
    let currentParentId = data.placementParentId;
    let currentChildPosition = data.position;

    while (currentParentId) {
      const parentIndex = updatedMembers.findIndex(m => m.id === currentParentId);
      if (parentIndex === -1) break;

      const parent = { ...updatedMembers[parentIndex] };
      parent.totalTeamCount += 1;

      if (currentChildPosition === 'left') {
        parent.leftLegPV += pkg.pv;
      } else if (currentChildPosition === 'right') {
        parent.rightLegPV += pkg.pv;
      }

      // Check if pairing match triggered!
      // In binary, each 100 PV pair triggers ₱1,500
      const maxPossiblePairs = Math.min(
        Math.floor(parent.leftLegPV / 100),
        Math.floor(parent.rightLegPV / 100)
      );

      const pairsToPayout = maxPossiblePairs - parent.matchedPairsCount;

      if (pairsToPayout > 0) {
        const pairingBonusAmount = pairsToPayout * pkg.pairingBonus;
        parent.matchedPairsCount += pairsToPayout;
        parent.ewalletBalance += pairingBonusAmount;
        parent.totalLifetimeEarnings += pairingBonusAmount;

        newTransactions.push({
          id: `tx_${Date.now()}_pair_${parent.id}`,
          date: new Date().toISOString().replace('T', ' ').slice(0, 16),
          type: 'pairing_bonus',
          amount: pairingBonusAmount,
          description: `Binary Pairing Match: ${pairsToPayout} Pair(s) on ${parent.fullName}'s Legs (${pairsToPayout * 100} PV Match)`,
          status: 'completed',
          referenceCode: `PAIR-${Math.floor(10000 + Math.random() * 89999)}`,
          pvGenerated: pairsToPayout * 100,
        });
      }

      updatedMembers[parentIndex] = parent;

      // Move up one level
      currentChildId = parent.id;
      currentChildPosition = parent.position as 'left' | 'right';
      currentParentId = parent.placementParentId || '';
    }

    setMembers(updatedMembers);
    setTransactions(prev => [...newTransactions, ...prev]);

    // Check if this member was a prospect in CRM and mark enrolled
    setProspects(prev => prev.map(p => {
      if (p.fullName.toLowerCase() === data.fullName.toLowerCase()) {
        return { ...p, status: 'enrolled' };
      }
      return p;
    }));

    showToast(`Successfully enrolled ${data.fullName}! Direct Referral and Pairing Bonuses credited.`);
  };

  // Encashment Request Handler
  const handleRequestWithdrawal = (withdrawalData: {
    amount: number;
    channel: string;
    accountName: string;
    accountNumber: string;
  }) => {
    const refCode = `WTH-${Math.floor(10000 + Math.random() * 89999)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Deduct from current member
    setMembers(prev => prev.map(m => {
      if (m.id === currentMember.id) {
        return {
          ...m,
          ewalletBalance: m.ewalletBalance - withdrawalData.amount,
          totalWithdrawn: m.totalWithdrawn + (withdrawalData.amount - 50),
        };
      }
      return m;
    }));

    // Add to transaction ledger
    setTransactions(prev => [
      {
        id: `tx_${Date.now()}_wth`,
        date: now,
        type: 'withdrawal',
        amount: -withdrawalData.amount,
        description: `${withdrawalData.channel} Encashment to ${withdrawalData.accountNumber} (${withdrawalData.accountName})`,
        status: 'completed',
        referenceCode: refCode,
      },
      ...prev,
    ]);

    showToast(`Encashment payout of ₱${withdrawalData.amount.toLocaleString()} submitted via ${withdrawalData.channel}!`);
    return { referenceCode: refCode, date: now };
  };

  // Add to Wholesale Cart
  const handleAddToCart = (product: Product, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity}x ${product.name} to wholesale cart.`);
  };

  // Wholesale Checkout
  const handleCheckoutCart = (
    items: CartItem[],
    totalAmount: number,
    totalPV: number,
    paymentMethod: 'ewallet' | 'direct'
  ) => {
    const refCode = `ORD-${Math.floor(10000 + Math.random() * 89999)}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Update current member personal PV and optionally deduct ewallet
    setMembers(prev => prev.map(m => {
      if (m.id === currentMember.id) {
        return {
          ...m,
          personalPV: m.personalPV + totalPV,
          isMonthlyActive: true,
          ewalletBalance: paymentMethod === 'ewallet' ? Math.max(0, m.ewalletBalance - totalAmount) : m.ewalletBalance,
        };
      }
      return m;
    }));

    // Record order transaction
    setTransactions(prev => [
      {
        id: `tx_${Date.now()}_ord`,
        date: now,
        type: 'package_purchase',
        amount: paymentMethod === 'ewallet' ? -totalAmount : 0,
        description: `Wholesale Reorder: ${items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}`,
        status: 'completed',
        referenceCode: refCode,
        pvGenerated: totalPV,
      },
      ...prev,
    ]);

    setCartItems([]);
    showToast(`Order processed! +${totalPV} Personal PV added. Account monthly active!`);
  };

  // CRM Prospect Actions
  const handleAddProspect = (prospectData: Omit<Prospect, 'id' | 'dateAdded'>) => {
    const newProspect: Prospect = {
      ...prospectData,
      id: `pr_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setProspects(prev => [newProspect, ...prev]);
    showToast(`Prospect ${prospectData.fullName} saved to pipeline.`);
  };

  const handleUpdateProspectStatus = (id: string, status: any) => {
    setProspects(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const handleDeleteProspect = (id: string) => {
    setProspects(prev => prev.filter(p => p.id !== id));
  };

  const handleConvertProspectToDownline = (prospect: Prospect) => {
    setEnrollInitialName(prospect.fullName);
    setEnrollInitialPhone(prospect.phone);
    setEnrollPlacementParentId(currentMember.id);
    setEnrollLeg('left');
    setIsEnrollModalOpen(true);
  };

  // Open enroll modal with placement from Genealogy Tree
  const handleOpenEnrollWithPlacement = (parentId: string, leg: 'left' | 'right') => {
    setEnrollPlacementParentId(parentId);
    setEnrollLeg(leg);
    setEnrollInitialName('');
    setEnrollInitialPhone('');
    setIsEnrollModalOpen(true);
  };

  // Simulation batch join for compensation simulator
  const handleSimulateBatchJoin = (count: number) => {
    for (let i = 0; i < count; i++) {
      const names = ['Liza Soberano', 'Enrique Gil', 'Daniel Padilla', 'Kathryn Bernardo'];
      const pickName = names[Math.floor(Math.random() * names.length)] + ` (${Math.floor(Math.random() * 900)})`;
      const weakerLeg = currentMember.leftLegPV <= currentMember.rightLegPV ? 'left' : 'right';

      handleEnrollMember({
        fullName: pickName,
        username: pickName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        email: `${pickName.toLowerCase().replace(/[^a-z0-9]/g, '')}@test.com`,
        packageId: 'pkg_builder',
        sponsorId: currentMember.id,
        placementParentId: currentMember.id,
        position: weakerLeg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Navbar */}
      <Navbar
        currentMember={currentMember}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenEnrollModal={() => {
          setEnrollPlacementParentId(currentMember.id);
          setEnrollLeg('left');
          setEnrollInitialName('');
          setEnrollInitialPhone('');
          setIsEnrollModalOpen(true);
        }}
        onResetData={handleResetData}
        allMembers={members}
        onSwitchMember={setCurrentMemberId}
      />

      {/* Main Viewport Container (1440px baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <OverviewDashboard
            currentMember={currentMember}
            transactions={transactions}
            currency={currency}
            onOpenEnrollModal={() => {
              setEnrollPlacementParentId(currentMember.id);
              setEnrollLeg('left');
              setIsEnrollModalOpen(true);
            }}
            onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'genealogy' && (
          <GenealogyTree
            currentMember={currentMember}
            allMembers={members}
            currency={currency}
            onOpenEnrollModalWithPlacement={handleOpenEnrollWithPlacement}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletView
            currentMember={currentMember}
            transactions={transactions}
            currency={currency}
            onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
          />
        )}

        {activeTab === 'products' && (
          <ProductStore
            products={products}
            currentMember={currentMember}
            currency={currency}
            onAddToCart={handleAddToCart}
            cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            onOpenCart={() => setIsCartModalOpen(true)}
          />
        )}

        {activeTab === 'prospects' && (
          <ProspectFunnel
            currentMember={currentMember}
            prospects={prospects}
            onAddProspect={handleAddProspect}
            onUpdateProspectStatus={handleUpdateProspectStatus}
            onDeleteProspect={handleDeleteProspect}
            onConvertProspectToDownline={handleConvertProspectToDownline}
          />
        )}

        {activeTab === 'calculator' && (
          <CompensationCalculator
            currency={currency}
            onSimulateBatchJoin={handleSimulateBatchJoin}
          />
        )}

        {activeTab === 'ranks' && (
          <RankLeaderboard
            currentMember={currentMember}
            allMembers={members}
            currency={currency}
          />
        )}
      </main>

      {/* Quiet, authentic footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Apex Network</span>
            <span>·</span>
            <span>Direct Selling & Multi-Level Marketing Operating System</span>
          </div>
          <div className="text-slate-500 text-[11px] font-mono">
            SEC & DTI Regulatory Architecture · Real-time Binary Pairing Engine
          </div>
        </div>
      </footer>

      {/* Modals */}
      <NewMemberModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        currentMember={currentMember}
        allMembers={members}
        currency={currency}
        initialParentId={enrollPlacementParentId}
        initialLeg={enrollLeg}
        initialName={enrollInitialName}
        initialPhone={enrollInitialPhone}
        onEnroll={handleEnrollMember}
      />

      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        currentMember={currentMember}
        currency={currency}
        onRequestWithdrawal={handleRequestWithdrawal}
      />

      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, q) => {
          setCartItems(prev => prev.map(item => item.product.id === id ? { ...item, quantity: Math.max(1, q) } : item));
        }}
        onRemoveItem={(id) => setCartItems(prev => prev.filter(item => item.product.id !== id))}
        onClearCart={() => setCartItems([])}
        currentMember={currentMember}
        currency={currency}
        onCheckout={handleCheckoutCart}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 shadow-2xl rounded-xl px-4 py-3 text-xs text-white flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
