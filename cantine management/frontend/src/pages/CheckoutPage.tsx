import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';


import { CreditCard, Wallet, Banknote, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

const CheckoutPage: React.FC = () => {
  const { cart, totalPrice, bookOrder, appliedCoupon, discountAmount, finalPrice } = useCart();
  const { user } = useAuth();
  const [isPlacing, setIsPlacing] = useState(false);
  const navigate = useNavigate();


  const taxAmount = totalPrice * 0.05;
  const grandTotal = finalPrice + taxAmount;

  const { openTokenModal } = useModal();
  const [scheduledTime, setScheduledTime] = useState<string>('');

  const pickupTimes = [
    '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM', '11:30 AM', '11:45 AM',
    '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM', '01:00 PM', '01:15 PM', '01:30 PM', '01:45 PM', '02:00 PM'
  ];

  const handlePlaceOrder = async () => {
    if (!user) {
      alert('Please login to place an order');
      return;
    }
    setIsPlacing(true);
    const token = await bookOrder(user.id, scheduledTime);
    setIsPlacing(false);

    if (token) {
      openTokenModal(token);
      navigate('/home');
    }
  };



  React.useEffect(() => {
    if (cart.length === 0) {
      navigate('/home');
    }
  }, [cart, navigate]);

  if (cart.length === 0) {
    return null;
  }


  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>

        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-3">Order Summary</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs font-bold text-slate-600">
                      {item.quantity}
                    </span>
                    <span className="text-slate-700 font-medium">{item.name}</span>
                  </div>
                  <span className="text-slate-900 font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-emerald-600 font-bold">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-slate-600">
                <span>Taxes & Charges (5%)</span>
                <span className="font-semibold text-slate-900">₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between text-lg font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="text-orange-600">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Booking Confirmation */}
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Booking Confirmation</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Your order will be booked instantly. Please pay at the counter when you pick up your food by presenting your digital order token.
            </p>
            <div className="p-4 bg-blue-50 rounded border border-blue-100 flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white flex-shrink-0">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-900 uppercase">Pay at Counter</p>
                <p className="text-[11px] text-blue-700 font-medium">Show your digital token to the canteen staff to collect your order.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isPlacing}
            className={`w-full py-4 bg-orange-500 text-white text-lg font-bold rounded hover:bg-orange-600 transition-all shadow-sm flex items-center justify-center ${isPlacing ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {isPlacing ? (
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Booking...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <span>Confirm Order</span>
                <ArrowRight className="ml-2" size={20} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
