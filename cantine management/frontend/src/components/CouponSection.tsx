import React, { useState } from 'react';
import { MOCK_COUPONS, Coupon } from '../data/mockData';
import { Ticket, Check, X, Copy } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';

const CouponSection: React.FC = () => {
  const { totalPrice, applyCoupon, appliedCoupon } = useCart();
  const [showAll, setShowAll] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopySuccess(code);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const handleApply = (coupon: Coupon) => {
    if (totalPrice < coupon.minOrderValue) {
      alert(`Minimum order value of ₹${coupon.minOrderValue} required for this coupon.`);
      return;
    }
    applyCoupon(coupon);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-emerald-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
            <Ticket size={16} />
            Digital Coupons
          </h2>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-all"
          >
            {showAll ? 'Less' : 'All'}
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {(showAll ? MOCK_COUPONS : MOCK_COUPONS.slice(0, 1)).map((coupon) => {
              const isApplied = appliedCoupon?.id === coupon.id;
              const isDisabled = totalPrice < coupon.minOrderValue;

              return (
                <motion.div
                  key={coupon.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`relative p-3 rounded border-2 border-dashed transition-all ${
                    isApplied 
                      ? 'border-emerald-500 bg-emerald-50' 
                      : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-slate-900">{coupon.code}</span>
                        <button 
                          onClick={() => handleCopy(coupon.code)}
                          className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                        >
                          {copySuccess === coupon.code ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500">{coupon.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-bold text-slate-400 uppercase">Min</p>
                      <p className="text-xs font-bold text-slate-900">₹{coupon.minOrderValue}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">
                      Exp: {coupon.expiryDate}
                    </p>
                    {isApplied ? (
                      <button 
                        onClick={() => applyCoupon(null)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] font-bold hover:bg-red-200 transition-all"
                      >
                        Remove
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleApply(coupon)}
                        disabled={isDisabled}
                        className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${
                          isDisabled 
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                            : 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                        }`}
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {appliedCoupon && (
          <div className="mt-4 p-3 bg-emerald-50 rounded border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center text-white">
                <Check size={16} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Applied</p>
                <p className="text-xs font-bold text-slate-900">{appliedCoupon.code}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Saved</p>
              <p className="text-xs font-bold text-emerald-600">
                {appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}%` : `₹${appliedCoupon.discountValue}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponSection;
