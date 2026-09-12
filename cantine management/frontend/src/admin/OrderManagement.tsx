import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Search, Eye, CheckCircle, Loader2, RefreshCcw, X, Clock, User, CreditCard, ShoppingBag } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../api';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(orders.map(order => order.id === id ? { ...order, status } : order));
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All Orders' || order.status === filterStatus;
    const matchesSearch = order.id.toString().includes(searchTerm) || order.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
            <p className="text-slate-500 text-sm">Track and update status of all canteen orders.</p>
          </div>
          <button
            onClick={loadOrders}
            className="p-2.5 bg-white text-slate-500 rounded border border-slate-200 hover:text-orange-600 transition-colors shadow-sm flex items-center justify-center group"
            disabled={loading}
          >
            <RefreshCcw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
          </button>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
              {['All Orders', 'Pending', 'Preparing', 'Ready', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded text-sm font-bold whitespace-nowrap transition-all ${filterStatus === status 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded focus:border-orange-500 focus:bg-white outline-none transition-all text-slate-900 text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-orange-500" size={32} />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">#{order.id}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(order.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{order.userName}</p>
                        <p className="text-xs text-slate-400 font-medium">{order.userRole}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            {order.items?.slice(0, 3).map((item: any, i: number) => (
                              <img key={i} src={item.image_url} alt="" className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm" referrerPolicy="no-referrer" />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            {order.items?.length > 3 ? `+${order.items.length - 3}` : `${order.items?.length || 0} items`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">₹{order.total}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 bg-slate-100 rounded border border-slate-200 text-[10px] font-bold uppercase w-fit ${order.payment_status === 'Paid' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {order.payment_status}
                          </span>
                          <span className={`flex items-center space-x-1.5 font-bold text-[10px] uppercase ${order.status === 'Completed' ? 'text-emerald-600' :
                            order.status === 'Preparing' ? 'text-orange-600' :
                              order.status === 'Pending' ? 'text-slate-400' :
                                'text-blue-600'
                            }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-500' :
                              order.status === 'Preparing' ? 'bg-orange-500' :
                                order.status === 'Pending' ? 'bg-slate-400' :
                                  'bg-blue-500'
                              }`} />
                            <span>{order.status}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                          >
                            <Eye size={20} />
                          </button>
                          {order.status !== 'Completed' && (
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'Completed')}
                              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                            >
                              <CheckCircle size={20} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Order Details</h2>
                <p className="text-slate-500 text-sm font-medium mt-1">Order #{selectedOrder.id} • {new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-slate-50 rounded transition-colors text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[70vh] no-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Customer</h3>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center text-orange-500">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{selectedOrder.userName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{selectedOrder.userRole}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Status Info</h3>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                    <div className="w-10 h-10 bg-white rounded border border-slate-200 flex items-center justify-center text-blue-500">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{selectedOrder.status}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Payment: {selectedOrder.payment_status}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Items Summary</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white rounded border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <img src={item.image_url} alt="" className="w-10 h-10 rounded object-cover border border-slate-200" referrerPolicy="no-referrer" />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-400 font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-900 text-sm">₹{item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-orange-500 text-white rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded flex items-center justify-center">
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Total Amount</p>
                    <p className="text-xl font-bold">₹{selectedOrder.total}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">Payment</p>
                  <p className="text-sm font-bold">{selectedOrder.payment_status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
