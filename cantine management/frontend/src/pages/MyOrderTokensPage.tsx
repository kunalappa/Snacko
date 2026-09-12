import React from 'react';
import { useCart } from '../context/CartContext';
import OrderTicket from '../components/OrderTicket';
import { Ticket, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const MyOrderTokensPage: React.FC = () => {
  const { bookedOrders } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link 
              to="/home" 
              className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Tokens</h1>
              <p className="text-slate-500 text-sm font-medium">Present these digital tokens at the counter</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
            <Ticket size={16} />
            <span>{bookedOrders.length} Active Tokens</span>
          </div>
        </div>

        {bookedOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-lg border border-slate-200 shadow-sm">
            <ShoppingBag className="text-slate-200 mb-4" size={48} />
            <h2 className="text-lg font-bold text-slate-900 mb-2">No active tokens</h2>
            <p className="text-slate-500 max-w-xs text-sm mb-8">
              Generate digital tokens by placing an order from our menu.
            </p>
            <Link
              to="/home"
              className="px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded hover:bg-orange-600 transition-colors shadow-sm"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookedOrders.map((order) => (
              <OrderTicket key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrderTokensPage;
