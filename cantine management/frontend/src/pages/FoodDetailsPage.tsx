import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Minus, Plus, ShoppingCart, Shield } from 'lucide-react';
import { FOOD_ITEMS } from '../data/mockData';
import { useCart } from '../context/CartContext';

const FoodDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const item = FOOD_ITEMS.find(f => f.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Item not found</h2>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2 bg-orange-500 text-white font-bold rounded hover:bg-orange-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(item);
    }
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors text-sm font-semibold uppercase tracking-wider"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Menu
        </button>

        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Image Section */}
            <div className="relative aspect-square md:aspect-auto">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/95 px-2 py-1 rounded border border-slate-200 flex items-center space-x-1 shadow-sm">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-xs font-bold text-slate-700">{item.rating || 4.5}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8 md:p-12 flex flex-col">
              <div className="mb-6">
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                  {item.category}
                </span>
                <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">{item.name}</h1>
                <p className="text-2xl font-bold text-orange-600">₹{item.price}</p>
              </div>

              <div className="prose prose-slate prose-sm max-w-none mb-8">
                <p className="text-slate-600 leading-relaxed">
                  {item.description || "Enjoy our delicious " + item.name + ", prepared fresh with high-quality ingredients. A campus favorite that's perfect for a quick break or a full meal."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                    <Clock size={12} className="mr-1" />
                    Prep Time
                  </p>
                  <p className="text-sm font-bold text-slate-700">{item.prepTime || '10-15 min'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center">
                    <Shield size={12} className="mr-1" />
                    Quality
                  </p>
                  <p className="text-sm font-bold text-slate-700">Campus Fresh</p>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border border-slate-200 rounded overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-slate-50 text-slate-600 border-r border-slate-200 transition-colors"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="px-6 py-2 text-lg font-bold text-slate-900 bg-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-slate-50 text-slate-600 border-l border-slate-200 transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="text-right flex-grow">
                    <p className="text-xs font-bold text-slate-400 uppercase">Subtotal</p>
                    <p className="text-xl font-bold text-slate-900">₹{item.price * quantity}</p>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 bg-orange-500 text-white text-lg font-bold rounded hover:bg-orange-600 transition-all shadow-sm flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Order</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsPage;
