export type RankLevel = 'Starter' | 'Bronze' | 'Silver' | 'Gold' | 'Diamond' | 'Crown Ambassador';

export type Currency = 'PHP' | 'USD';

export interface Member {
  id: string;
  distributorCode: string;
  fullName: string;
  username: string;
  email: string;
  avatar: string;
  rank: RankLevel;
  joinDate: string;
  sponsorId: string | null;
  placementParentId: string | null;
  position: 'left' | 'right' | 'root';
  personalPV: number;
  leftLegPV: number;
  rightLegPV: number;
  matchedPairsCount: number;
  totalDirects: number;
  totalTeamCount: number;
  ewalletBalance: number;
  totalLifetimeEarnings: number;
  totalWithdrawn: number;
  isMonthlyActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  srp: number; // Suggested Retail Price
  dp: number;  // Distributor Price
  pv: number;  // Point Value
  image: string;
  description: string;
  benefits: string[];
  inStock: boolean;
  featured?: boolean;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'direct_referral' | 'pairing_bonus' | 'unilevel_rebate' | 'retail_profit' | 'withdrawal' | 'package_purchase';
  amount: number;
  description: string;
  status: 'completed' | 'pending' | 'processing';
  referenceCode: string;
  pvGenerated?: number;
}

export type ProspectStatus = 'cold' | 'invited' | 'attended_bom' | 'follow_up' | 'enrolled';

export interface Prospect {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  socialLink?: string;
  status: ProspectStatus;
  notes: string;
  dateAdded: string;
  potentialPackage: string;
}

export interface PackagePlan {
  id: string;
  name: string;
  price: number;
  pv: number;
  directBonus: number;
  pairingBonus: number;
  dailyMaxPairs: number;
  includedProducts: string[];
  badgeColor: string;
  recommended?: boolean;
}
