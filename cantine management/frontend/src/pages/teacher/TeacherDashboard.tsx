import React, { useMemo, useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, CreditCard, Loader2, Sparkles, Zap, ShieldCheck, Clock, ShoppingCart } from 'lucide-react';

import FoodCard from '../../components/FoodCard';
import DailyThaliMenu from '../../components/DailyThaliMenu';
import CouponSection from '../../components/CouponSection';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchMenu, fetchUserOrders } from '../../api';

import { motion } from 'motion/react';

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      // Use the numeric ID derived from user.id
      const numericId = parseInt(user.id);
      const [cats, menu, userOrds] = await Promise.all([
        fetchCategories(),
        fetchMenu(),
        fetchUserOrders(numericId)
      ]);
      setCategories(cats);
      setItems(menu);
      setOrders(userOrds);
    } catch (e) {
      console.error('Failed to load teacher dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) load();
    const t = window.setInterval(() => {
      if (user?.id) load();
    }, 15000);
    return () => window.clearInterval(t);
  }, [user?.id]);

  const upcomingPickups = useMemo(() => {
    return orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled' && o.scheduled_time);
  }, [orders]);

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu-section');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };


  const filteredItems = useMemo(() => {
    return items
      .filter((item) => (activeCategory === 'All' ? true : item.category === activeCategory))
      .filter((item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [items, activeCategory, searchQuery]);

  const userName = user?.name || '';
  const myOrdersCount = useMemo(() => {
    if (!userName) return 0;
    return orders.filter((o) => String(o.userName || '').toLowerCase() === userName.toLowerCase()).length;
  }, [orders, userName]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-slate-900 text-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-[10px] font-bold uppercase tracking-wider mb-4 text-blue-300">
                <ShieldCheck size={12} />
                <span>Faculty Priority Access</span>
              </div>
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                Welcome, {user?.name}
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed opacity-90 max-w-lg">
                Your professional portal for priority ordering and scheduled pickups.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded hover:bg-orange-600 transition-colors shadow-sm"
              >
                <ShoppingCart size={18} />
                <span>My Cart</span>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Orders</p>
                <Clock size={14} className="text-slate-500" />
              </div>
              <p className="text-2xl font-bold">{myOrdersCount}</p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Service Status</p>
                <Zap size={14} className="text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-blue-400">Active</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-400">Benefit</p>
                <Sparkles size={14} className="text-orange-400" />
              </div>
              <p className="text-xl font-bold text-white">Priority Prep</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-3 space-y-6">
            {upcomingPickups.length > 0 && (
              <div className="bg-blue-600 p-5 rounded-lg shadow-sm text-white">
                <h2 className="text-sm font-bold mb-4 flex items-center space-x-2 uppercase tracking-wider">
                  <Clock size={16} />
                  <span>Upcoming Pickups</span>
                </h2>
                <div className="space-y-3">
                  {upcomingPickups.slice(0, 2).map((order) => (
                    <div key={order.id} className="bg-white/10 p-3 rounded border border-white/10">
                      <p className="text-[10px] font-bold uppercase text-blue-200 mb-1">Order</p>
                      <p className="text-xs font-semibold truncate mb-2">
                        {order.items.map((i: any) => i.name).join(', ')}
                      </p>
                      <div className="inline-block bg-orange-500 text-[9px] font-bold px-2 py-0.5 rounded">
                        {order.scheduled_time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900">Categories</h2>
              </div>
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-sm font-semibold transition-colors ${activeCategory === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  <span>All Items</span>
                  <ChevronRight size={14} />
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-sm font-semibold transition-colors ${activeCategory === cat.name
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <span>{cat.name}</span>
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
            </div>
            
            <DailyThaliMenu />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-8">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {activeCategory === 'All' ? 'Full Menu' : activeCategory}
                  </h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Academic Selection</p>
                </div>
                <div className="relative md:max-w-xs w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search favorites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded focus:bg-white focus:border-blue-500 outline-none transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded border border-dashed border-slate-200">
                  <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
                  <p className="text-slate-500 text-xs font-bold uppercase">Loading Menu...</p>
                </div>
              ) : filteredItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((item) => (
                    <FoodCard
                      key={item.id}
                      item={{
                        id: String(item.id),
                        name: item.name,
                        description: item.description || '',
                        price: Number(item.price),
                        category: item.category,
                        image: item.image_url,
                        rating: Number(item.rating || 4.5),
                        prepTime: item.prep_time || '10 min',
                        isAvailable: !!item.is_available,
                      } as any}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded border border-dashed border-slate-200">
                  <Search className="mx-auto text-slate-300 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-slate-900">No items found</h3>
                  <p className="text-slate-500 text-sm">Try adjusting your filters.</p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 flex flex-col md:flex-row items-center gap-6">
              <div className="w-12 h-12 bg-blue-600 text-white rounded flex items-center justify-center shadow-sm shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-blue-900">Faculty Support</h3>
                <p className="text-blue-700/70 text-sm font-medium">For special dietary requirements or department events, please contact the canteen supervisor.</p>
              </div>
              <button className="whitespace-nowrap px-6 py-2 bg-white text-blue-600 text-sm font-bold rounded border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors ml-auto">
                Contact Supervisor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
