import React, { useState } from 'react';
import { Product, Currency, Member } from '../types/mlm';
import { formatMoney } from '../utils/formatters';
import { 
  ShoppingBag, 
  Sparkles, 
  Check, 
  Tag, 
  Plus, 
  Minus, 
  ShoppingCart,
  TrendingUp,
  Share2
} from 'lucide-react';

interface ProductStoreProps {
  products: Product[];
  currentMember: Member;
  currency: Currency;
  onAddToCart: (product: Product, quantity: number) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const ProductStore: React.FC<ProductStoreProps> = ({
  products,
  currentMember,
  currency,
  onAddToCart,
  cartCount,
  onOpenCart,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const categories = ['all', 'Starter Packages', 'Beauty & Skincare', 'Nutrition & Wellness'];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const getQty = (id: string) => quantities[id] || 1;

  const updateQty = (id: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleShareProduct = (product: Product) => {
    const url = `https://apexnetwork.vip/shop/${product.id}?distributor=${currentMember.username}`;
    navigator.clipboard.writeText(url);
    setCopiedShareId(product.id);
    setTimeout(() => setCopiedShareId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg font-bold text-white tracking-tight">
                Distributor Wholesale Store & Retail Catalog
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Wholesale distributor prices (DP) with up to 45% retail markup profit & monthly maintenance PV
            </p>
          </div>

          {/* Cart Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Wholesale Cart ({cartCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/60 border border-slate-800 rounded-lg overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Products' : cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const retailProfit = product.srp - product.dp;
          const profitPercent = Math.round((retailProfit / product.dp) * 100);
          const qty = getQty(product.id);

          return (
            <div
              key={product.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Image Slot with Fallback Container & High Fidelity Photo */}
                <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback container
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Category tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded">
                    {product.category}
                  </div>
                  {/* PV Badge */}
                  <div className="absolute top-3 right-3 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/60 text-emerald-400 text-xs font-mono font-bold px-2 py-0.5 rounded">
                    +{product.pv} PV
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing Comparison */}
                  <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Distributor Price (DP):</span>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums text-sm">
                        {formatMoney(product.dp, currency)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Suggested Retail (SRP):</span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {formatMoney(product.srp, currency)}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-emerald-400" /> Direct Retail Profit:
                      </span>
                      <span className="font-mono font-bold text-emerald-400 tabular-nums">
                        +{formatMoney(retailProfit, currency)} ({profitPercent}%)
                      </span>
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-1">
                    {product.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-4 pt-0 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-slate-800 rounded-lg bg-slate-950">
                    <button
                      onClick={() => updateQty(product.id, -1)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 text-xs font-mono tabular-nums text-white">{qty}</span>
                    <button
                      onClick={() => updateQty(product.id, 1)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Wholesale Cart */}
                  <button
                    onClick={() => onAddToCart(product, qty)}
                    className="flex-1 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Reorder ({product.pv * qty} PV)</span>
                  </button>

                  {/* Share retail link */}
                  <button
                    onClick={() => handleShareProduct(product)}
                    className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    title="Copy customer retail link"
                  >
                    {copiedShareId === product.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
