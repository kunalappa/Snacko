import React from 'react';
import { Star, Clock, Plus } from 'lucide-react';
import { FoodItem } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface FoodCardProps {
  item: FoodItem;
}

const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all border border-slate-200 group flex flex-col h-full">
      <Link to={`/food/${item.id}`} className="block relative aspect-video overflow-hidden border-b border-slate-100">
        <img
          src={item.image || (item as any).image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
          }}
        />

        <div className="absolute top-2 right-2 bg-white/95 px-1.5 py-0.5 rounded border border-slate-200 flex items-center space-x-1 shadow-sm">
          <Star size={12} className="text-yellow-500 fill-yellow-500" />
          <span className="text-[10px] font-bold text-slate-700">{item.rating}</span>
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/food/${item.id}`} className="text-base font-bold text-slate-900 hover:text-orange-600 transition-colors truncate pr-2">
            {item.name}
          </Link>
          <span className="text-base font-bold text-slate-900">₹{item.price}</span>
        </div>

        <p className="text-slate-500 text-xs line-clamp-2 mb-4 flex-grow leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Clock size={12} className="mr-1" />
            {item.prepTime}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(item);
            }}
            className="bg-orange-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-orange-600 transition-colors shadow-sm flex items-center space-x-1"
          >
            <Plus size={14} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
