import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, RotateCcw, Calendar, CreditCard, Sparkles, Flame, Loader2, ShoppingCart } from 'lucide-react';

import FoodCard from '../../components/FoodCard';
import DailyThaliMenu from '../../components/DailyThaliMenu';
import CouponSection from '../../components/CouponSection';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchMenu, fetchOrders } from '../../api';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [cats, menu, ords] = await Promise.all([fetchCategories(), fetchMenu(), fetchOrders()]);
      setCategories(cats);
      setItems(menu);
      setOrders(ords);
    } catch (e) {
      console.error('Failed to load student dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = window.setInterval(load, 15000);
    return () => window.clearInterval(t);
  }, []);

  const filteredItems = items
    .filter((item) => (activeCategory === 'All' ? true : item.category === activeCategory))
    .filter((item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const userName = user?.name || '';
  const recentOrders = orders
    .filter((o) => (userName ? String(o.userName || '').toLowerCase() === userName.toLowerCase() : false))
    .slice(0, 1);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-orange-100 text-orange-700 rounded text-[10px] font-bold uppercase tracking-wider mb-3">
                <Flame size={12} />
                <span>Student Portal</span>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Welcome back, {user?.name.split(' ')[0]}
              </h1>
              <p className="text-slate-500 text-sm max-w-md">
                Quickly browse the menu and place your order for a seamless dining experience.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/cart"
                className="flex items-center space-x-2 px-5 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
              >
                <ShoppingCart size={18} />
                <span>My Cart</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Search & Categories */}
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search for food items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
                <button
                  onClick={() => setActiveCategory('All')}
                  className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all border ${activeCategory === 'All'
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                    }`}
                >
                  All Items
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.name)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all border ${activeCategory === cat.name
                      ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300'
                      }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {activeCategory === 'All' ? 'Menu' : activeCategory}
                  <span className="ml-2 text-slate-400 text-sm font-medium uppercase">({filteredItems.length} items)</span>
                </h2>
                <button className="flex items-center space-x-2 text-slate-500 text-xs font-bold uppercase tracking-wider hover:text-orange-600 transition-colors">
                  <Filter size={14} />
                  <span>Sort & Filter</span>
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-48 bg-white rounded-lg border border-slate-200 animate-pulse" />
                  ))}
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
                <div className="py-16 text-center bg-white rounded-lg border border-slate-200">
                  <Search className="mx-auto text-slate-300 mb-4" size={40} />
                  <h3 className="text-lg font-bold text-slate-900">No items found</h3>
                  <p className="text-slate-500 text-sm">Try searching for something else.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              <DailyThaliMenu />
              <CouponSection />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
