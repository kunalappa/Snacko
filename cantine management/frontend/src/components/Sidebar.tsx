import React from 'react';
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, LogOut, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    Swal.fire({
      icon: 'success',
      title: 'Logged Out',
      text: 'You have been successfully logged out.',
      timer: 1500,
      showConfirmButton: false,
    });
    navigate('/');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <UtensilsCrossed size={20} />, label: 'Manage Menu', path: '/admin/menu' },
    { icon: <ClipboardList size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Users', path: '/admin/users' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="w-72 h-screen bg-slate-900 flex flex-col sticky top-0 shadow-2xl">
      <div className="p-8 border-b border-slate-800/50">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-white font-extrabold text-xl tracking-tighter">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-white tracking-tight leading-tight">Admin Portal</span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Management</span>
          </div>
        </Link>
      </div>

      <nav className="flex-grow px-4 space-y-2 mt-8">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/dashboard');
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${isActive
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
            >
              <span className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl text-sm font-extrabold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 group"
        >
          <div className="p-2 bg-slate-800 rounded-xl group-hover:bg-red-500/20 transition-colors duration-300 text-slate-500 group-hover:text-red-400">
            <LogOut size={18} />
          </div>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
