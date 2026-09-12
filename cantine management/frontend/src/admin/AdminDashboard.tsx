import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { fetchStats, fetchOrders } from '../api';

const AdminDashboard: React.FC = () => {
  const [statsData, setStatsData] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [stats, orders] = await Promise.all([fetchStats(), fetchOrders()]);
      setStatsData(stats);
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    { label: 'Total Sales', value: `₹${statsData?.totalSales.toLocaleString() || 0}`, icon: <DollarSign />, color: 'bg-green-500', trend: '+12%', up: true },
    { label: 'Total Orders', value: statsData?.totalOrders || 0, icon: <ShoppingBag />, color: 'bg-orange-500', trend: '+5%', up: true },
    { label: 'Total Users', value: statsData?.totalUsers || 0, icon: <Users />, color: 'bg-blue-500', trend: '+18%', up: true },
    { label: 'Active Items', value: statsData?.activeItems || 0, icon: <TrendingUp />, color: 'bg-purple-500', trend: '-2%', up: false },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-grow p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm font-medium">System statistics and recent activity summary.</p>
          </div>
          <button
            onClick={loadData}
            className="p-2.5 bg-white text-slate-500 rounded border border-slate-200 hover:text-orange-600 transition-colors shadow-sm flex items-center justify-center group"
            disabled={loading}
            title="Refresh Data"
          >
            <RefreshCcw size={18} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md group"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`w-10 h-10 ${stat.color} text-white rounded flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  {React.cloneElement(stat.icon as React.ReactElement, { size: 20 })}
                </div>
                <div className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold ${stat.up ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                  <span>{stat.trend}</span>
                  {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                </div>
              </div>
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">View All</button>
            </div>
            <div className="space-y-3">
              {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded hover:border-orange-200 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white border border-slate-200 rounded flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-orange-500 transition-colors">
                      #{order.id}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {order.items?.length > 0 ? `${order.items[0].name} ${order.items.length > 1 ? `+${order.items.length - 1}` : ''}` : 'No items'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {order.payment_status}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${order.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                      order.status === 'Preparing' ? 'bg-orange-100 text-orange-600' :
                        'bg-blue-100 text-blue-600'
                    }`}>
                    {order.status}
                  </span>
                </div>
              )) : (
                <div className="text-center py-10">
                   <p className="text-slate-400 font-medium italic">No recent orders found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Popular Items</h2>
              <button className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors">Manage Menu</button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Classic Burger', sales: 450, price: '₹120', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=80' },
                { name: 'Crispy Fries', sales: 380, price: '₹60', img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=100&q=80' },
                { name: 'Iced Coffee', sales: 310, price: '₹80', img: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=100&q=80' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <img src={item.img} alt="" className="w-12 h-12 rounded border border-slate-200 object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{item.sales} sales this week</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 text-sm">{item.price}</p>
                    <div className="h-1 w-12 bg-slate-100 rounded-full mt-1 overflow-hidden">
                       <div className="h-full bg-orange-500 rounded-full" style={{ width: `${100 - i * 20}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
