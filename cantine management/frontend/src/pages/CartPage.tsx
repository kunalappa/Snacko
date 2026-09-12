import React from 'react';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Ticket } from 'lucide-react';

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useModal } from '../context/ModalContext';


const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, appliedCoupon, discountAmount, finalPrice, bookedOrders } = useCart();
  const { openTokenModal } = useModal();

  const navigate = useNavigate();

  const taxAmount = totalPrice * 0.05;
  const grandTotal = finalPrice + taxAmount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-orange-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-xs">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link
          to="/home"
          className="px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Shopping Cart ({totalItems} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-4"
              >
                <div className="w-20 h-20 rounded border border-slate-100 overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{item.name}</h3>
                      <p className="text-slate-500 text-xs uppercase font-semibold">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-slate-200 rounded">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1.5 hover:bg-slate-50 text-slate-600"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-3 text-sm font-bold text-slate-900 border-x border-slate-200">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1.5 hover:bg-slate-50 text-slate-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="text-base font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{totalPrice}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Taxes (5%)</span>
                  <span className="font-semibold text-slate-900">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-100 pt-4 flex justify-between text-lg font-bold text-slate-900">
                  <span>Total</span>
                  <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition-colors shadow-sm flex items-center justify-center text-sm"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2" size={16} />
              </button>

              {bookedOrders.length > 0 && (
                <div className="mt-6 p-4 bg-slate-50 rounded border border-slate-200 border-dashed">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
                      <Ticket size={16} />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase">Active Tokens</h3>
                      <p className="text-[10px] font-semibold text-slate-500">
                        {bookedOrders.length} Order(s) ready
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openTokenModal()}
                    className="w-full py-2 bg-white text-slate-900 text-xs font-bold rounded border border-slate-200 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Show Order Tokens
                  </button>
                </div>
              )}

              <p className="text-center text-slate-400 text-[10px] font-medium uppercase tracking-tighter mt-4">
                Academic Campus Dining System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CartPage;
