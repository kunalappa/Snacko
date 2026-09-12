import React from 'react';
import { useAuth } from '../context/AuthContext';
import { MOCK_ORDERS } from '../data/mockData';
import { User, Mail, Shield, Package, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold border border-slate-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-slate-500 text-sm mb-6">{user.email}</p>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <Mail size={16} />
                  <span className="text-xs font-semibold truncate">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                  <Shield size={16} />
                  <span className="text-xs font-semibold capitalize">{user.role} Portal</span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full mt-8 py-2.5 flex items-center justify-center space-x-2 text-red-600 font-bold text-sm hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-all"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Order History */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Package className="text-orange-500" size={20} />
                  <span>Recent Activity</span>
                </h2>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{MOCK_ORDERS.length} Orders</span>
              </div>

              <div className="space-y-3">
                {MOCK_ORDERS.map((order) => (
                  <div key={order.id} className="p-4 bg-slate-50 rounded border border-slate-200 hover:border-orange-300 transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{order.id}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{order.date}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        order.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex -space-x-1.5">
                        {order.items.slice(0, 4).map((item, i) => (
                          <img
                            key={i}
                            src={item.image}
                            alt=""
                            className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
                            referrerPolicy="no-referrer"
                          />
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-bold text-slate-900">₹{order.total}</p>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
