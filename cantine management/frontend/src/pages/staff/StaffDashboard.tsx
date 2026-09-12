import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, Filter, Loader2, Sparkles, Timer, CreditCard, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchOrders, updateOrderStatus, updateOrderPaymentStatus } from '../../api';
import Swal from 'sweetalert2';

const StaffDashboard: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [lastOrderCount, setLastOrderCount] = useState(0);

  const loadOrders = async (isFirst = false) => {
    try {
      const data = await fetchOrders();
      setOrders(data);

      const pendingCount = data.filter((o: any) => o.status === 'Pending').length;
      if (!isFirst && pendingCount > lastOrderCount) {
        // Sound notification for new orders
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log('Audio play blocked'));
      }
      setLastOrderCount(pendingCount);
    } catch (e) {
      console.error('Failed to fetch orders:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(true);
    const t = window.setInterval(() => loadOrders(false), 5000);
    return () => window.clearInterval(t);
  }, [lastOrderCount]);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      await loadOrders();
      Swal.fire({
        icon: 'success',
        title: 'Status Updated',
        text: `Order marked as ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#1a1a1a',
        iconColor: '#10b981',
      });
    } catch (e) {
      console.error('Failed to update status:', e);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not update order status.',
        confirmButtonColor: '#f97316',
      });
    }
  };

  const handlePaymentUpdate = async (orderId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';

    if (newStatus === 'Paid') {
      const result = await Swal.fire({
        title: 'Collect Payment?',
        text: "Confirm that you have received the payment for this order.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, Payment Received!',
        background: '#ffffff',
        color: '#1a1a1a',
      });

      if (!result.isConfirmed) return;
    }

    try {
      await updateOrderPaymentStatus(orderId, newStatus);
      await loadOrders();
      Swal.fire({
        icon: 'success',
        title: 'Payment Updated',
        text: `Order marked as ${newStatus}`,
        timer: 1500,
        showConfirmButton: false,
        background: '#ffffff',
        color: '#1a1a1a',
        iconColor: '#10b981',
      });
    } catch (err) {
      console.error('Error updating payment:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Could not update payment status.',
      });
    }
  };

  const filteredOrders = orders.filter(o =>
    activeFilter === 'All' ? o.status !== 'Completed' : o.status === activeFilter
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-emerald-600 text-white pt-12 pb-16 border-b border-emerald-700">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded flex items-center justify-center border border-white/20">
              <ChefHat size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1">Kitchen Control</h1>
              <p className="text-emerald-50 text-sm font-medium opacity-90">Manage orders and preparation status.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Preparing').length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 mt-1">Preparing</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 text-center min-w-[100px]">
              <p className="text-2xl font-bold">{orders.filter(o => o.status === 'Pending').length}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-100 mt-1">Pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        {/* Filter Bar */}
        <div className="bg-white p-3 rounded-lg shadow-sm mb-8 flex items-center space-x-2 overflow-x-auto no-scrollbar border border-slate-200">
          {['All', 'Pending', 'Preparing', 'Ready', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setActiveFilter(status)}
              className={`px-5 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all border ${activeFilter === status
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
                }`}
            >
              <span>{status} {status === 'All' ? 'Active' : ''}</span>
              <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] ${activeFilter === status ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {status === 'All' ? orders.filter(o => o.status !== 'Completed').length : orders.filter(o => o.status === status).length}
              </span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-slate-200">
            <Loader2 className="animate-spin text-emerald-600 mb-3" size={32} />
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Updating Orders...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <motion.div
                    layout
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className={`bg-white rounded-lg shadow-sm border ${order.isPriority ? 'border-orange-300' : 'border-slate-200'
                      } flex flex-col overflow-hidden`}
                  >
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xl font-bold text-slate-900">Order</span>
                            {order.isPriority === 1 && (
                              <span className="px-2 py-0.5 bg-orange-500 text-white rounded text-[9px] font-bold uppercase tracking-widest">
                                Priority
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[10px] uppercase">
                            <Clock size={12} />
                            <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${order.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                            order.status === 'Preparing' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                              order.status === 'Ready' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                            {order.status}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border flex items-center gap-1 ${order.payment_status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-red-50 text-red-700 border-red-100'
                            }`}>
                            {order.payment_status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 flex-grow">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                            <div className="flex items-center space-x-3">
                              <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center font-bold text-xs text-slate-600">
                                {item.quantity}
                              </span>
                              <span className="text-slate-800 font-semibold">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-[10px]">
                            {order.userRole?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block leading-none">{order.userName}</span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{order.userRole}</span>
                          </div>
                        </div>
                        <span className="text-emerald-700 font-bold">₹{order.total}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col gap-2">
                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'Preparing')}
                            className="flex-1 py-2.5 bg-orange-500 text-white text-xs font-bold rounded hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                          >
                            <Timer size={14} />
                            <span>Prepare</span>
                          </button>
                        )}
                        {order.status === 'Preparing' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'Ready')}
                            className="flex-1 py-2.5 bg-blue-500 text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark Ready</span>
                          </button>
                        )}
                        {order.status === 'Ready' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'Completed')}
                            className="flex-1 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                          >
                            <ShoppingBag size={14} />
                            <span>Deliver</span>
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handlePaymentUpdate(order.id, order.payment_status)}
                        className={`w-full py-2 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors ${order.payment_status === 'Paid'
                          ? 'border-emerald-500 text-emerald-600 bg-emerald-50'
                          : 'border-orange-500 text-orange-600 hover:bg-orange-50'
                          }`}
                      >
                        {order.payment_status === 'Paid' ? 'Payment Verified' : `Collect ₹${order.total}`}
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 text-center">
                  <ShoppingBag className="text-slate-200 mb-4" size={48} />
                  <h3 className="text-lg font-bold text-slate-800">No Orders Found</h3>
                  <p className="text-slate-500 text-sm">All orders in this category have been processed.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
