import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { CATEGORIES, FOOD_ITEMS } from '../data/mockData';
import FoodCard from '../components/FoodCard';
import { motion } from 'motion/react';

const HomePage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = FOOD_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header / Search */}
      <div className="bg-white pt-8 pb-12 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">What's on your mind?</h1>
              <p className="text-gray-500">Discover delicious food from our canteen</p>
            </div>
            
            <div className="relative max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for snacks, meals, drinks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-100 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Categories */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-4 no-scrollbar">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              activeCategory === 'All'
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.name)}
              className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap flex items-center space-x-2 transition-all ${
                activeCategory === cat.name
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Food Table */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeCategory} {activeCategory === 'All' ? 'Menu' : ''}
              <span className="ml-2 text-gray-400 text-lg font-medium">({filteredItems.length})</span>
            </h2>
            <button className="flex items-center space-x-2 text-gray-600 font-medium hover:text-orange-500 transition-colors">
              <Filter size={20} />
              <span>Sort & Filter</span>
            </button>
          </div>

          {filteredItems.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Prep Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">₹{item.price}</td>
                      <td className="px-6 py-4 text-gray-500">{item.prep_time}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-500">★</span>
                          <span className="text-gray-900 font-medium">{item.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="px-3 py-1.5 bg-orange-500 text-white text-sm font-medium rounded hover:bg-orange-600 transition-colors">
                          Add to Cart
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-500">Try searching for something else or change category</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
