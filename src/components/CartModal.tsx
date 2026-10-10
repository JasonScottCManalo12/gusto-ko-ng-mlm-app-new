import React, { useState } from 'react';
import { Product, Currency, Member } from '../types/mlm';
import { formatMoney } from '../utils/formatters';
import { ShoppingCart, X, Plus, Minus, Trash2, ShieldCheck, CheckCircle2 } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  currentMember: Member;
  currency: Currency;
  onCheckout: (items: CartItem[], totalAmount: number, totalPV: number, paymentMethod: 'ewallet' | 'direct') => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  currentMember,
  currency,
  onCheckout,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'ewallet' | 'direct'>('ewallet');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((acc, item) => acc + item.product.dp * item.quantity, 0);
  const totalPV = cartItems.reduce((acc, item) => acc + item.product.pv * item.quantity, 0);
  const totalSRP = cartItems.reduce((acc, item) => acc + item.product.srp * item.quantity, 0);
  const totalProfitPotential = totalSRP - totalAmount;

  const handleConfirmOrder = () => {
    onCheckout(cartItems, totalAmount, totalPV, paymentMethod);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 my-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Wholesale Reorder Cart</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">Order Confirmed & PV Credited!</h4>
            <p className="text-xs text-slate-300">
              +{totalPV} Personal PV added to your account. Your monthly active status is maintained!
            </p>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="py-12 text-center text-slate-400 space-y-3">
            <ShoppingCart className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm">Your reorder cart is empty.</p>
            <p className="text-xs text-slate-500">
              Browse the catalog to add products and build your personal volume!
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs">
            {/* Items list */}
            <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-800/60">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-white truncate text-xs">{product.name}</h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        DP: {formatMoney(product.dp, currency)} · +{product.pv} PV each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Qty controls */}
                    <div className="flex items-center border border-slate-800 rounded bg-slate-950">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono tabular-nums text-white text-xs">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Card */}
            <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Personal PV Generated:</span>
                <span className="text-emerald-400 font-bold">+{totalPV} PV</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Retail Margin Potential:</span>
                <span className="text-slate-200">+{formatMoney(totalProfitPotential, currency)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                <span className="text-white font-sans">Total Distributor Price:</span>
                <span className="text-emerald-400">{formatMoney(totalAmount, currency)}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold block">Payment Method:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ewallet')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    paymentMethod === 'ewallet'
                      ? 'border-emerald-500 bg-slate-800 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-white">E-Wallet Balance</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Avail: {formatMoney(currentMember.ewalletBalance, currency)}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('direct')}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    paymentMethod === 'direct'
                      ? 'border-emerald-500 bg-slate-800 ring-1 ring-emerald-500/30'
                      : 'border-slate-800 bg-slate-950 text-slate-400'
                  }`}
                >
                  <div className="font-semibold text-white">Direct GCash / Card</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Direct payment simulation
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <button
                type="button"
                onClick={onClearCart}
                className="text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear Cart
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  className="px-5 py-2 font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm"
                >
                  Confirm Wholesale Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
