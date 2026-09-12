import React, { useEffect, useMemo } from 'react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

import { useCart } from '../context/CartContext';
import OrderTicket from '../components/OrderTicket';

const OrderStatusPage: React.FC = () => {
  const { lastOrderToken, bookedOrders } = useCart();
  const navigate = useNavigate();

  // Find the current order details
  const currentOrder = useMemo(() => {
    if (!lastOrderToken) return null;
    return bookedOrders.find(o => o.id === lastOrderToken) || bookedOrders[0];
  }, [lastOrderToken, bookedOrders]);

  useEffect(() => {
    if (!lastOrderToken && bookedOrders.length === 0) {
      navigate('/home');
      return;
    }

    // Trigger celebration
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, [lastOrderToken, bookedOrders, navigate]);

  if (!currentOrder) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 flex flex-col items-center">
      <div className="max-w-md w-full px-4 text-center">
        <div className="mb-10">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Confirmed</h1>
          <p className="text-slate-500 text-sm font-medium">Your digital order token has been generated.</p>
        </div>

        {/* Digital Token */}
        <div className="mb-8">
          <OrderTicket order={currentOrder} />
        </div>

        {/* Action Buttons */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-3">
          <Link
            to="/my-tokens"
            className="w-full py-3 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition-colors flex items-center justify-center text-sm shadow-sm"
          >
            <ShoppingBag className="mr-2" size={18} />
            View My Orders
          </Link>
          <Link
            to="/home"
            className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors flex items-center justify-center text-sm"
          >
            Return to Menu
            <ArrowRight className="ml-2" size={18} />
          </Link>
        </div>

        <div className="mt-8 bg-blue-50 p-5 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-blue-800 leading-relaxed">
            Please present this token at the <b>Canteen Counter</b> to verify your order and complete payment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;

