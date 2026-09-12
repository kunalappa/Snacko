import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Ticket } from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';
import { motion, AnimatePresence } from 'motion/react';

const Navbar: React.FC = () => {
  const cart = useCart();
  const totalItems = cart ? cart.totalItems : 0;
  const { user, logout, isAuthenticated } = useAuth();
  const { openAuthModal, openTokenModal } = useModal();

  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Snacko</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-semibold uppercase tracking-wider">
            <a href="/#home" className="text-slate-600 hover:text-orange-600 transition-colors">Home</a>
            <a href="/#about" className="text-slate-600 hover:text-orange-600 transition-colors">About</a>
            <a href="/#features" className="text-slate-600 hover:text-orange-600 transition-colors">Features</a>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-slate-600 text-sm font-bold uppercase tracking-wider hover:text-orange-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-2 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest rounded hover:bg-orange-600 transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-slate-600 text-xs font-bold uppercase tracking-wider hover:text-orange-600">Admin</Link>
                )}
                {user?.role === 'staff' && (
                  <Link to="/staff" className="text-slate-600 text-xs font-bold uppercase tracking-wider hover:text-orange-600">Dashboard</Link>
                )}
                {user?.role === 'teacher' && (
                  <Link to="/teacher" className="text-slate-600 text-xs font-bold uppercase tracking-wider hover:text-orange-600">Dashboard</Link>
                )}
                {user?.role === 'student' && (
                  <Link to="/home" className="text-slate-600 text-xs font-bold uppercase tracking-wider hover:text-orange-600">Dashboard</Link>
                )}
                {user?.role !== 'staff' && (
                  <Link to="/cart" className="relative p-2 text-slate-600 hover:text-orange-600 transition-colors">
                    <ShoppingCart size={20} />
                    {totalItems > 0 && (
                      <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full ring-2 ring-white">
                        {totalItems}
                      </span>
                    )}
                  </Link>
                )}
                {user?.role !== 'staff' && (
                  <button
                    onClick={() => openTokenModal()}
                    className="flex items-center space-x-1.5 text-slate-600 hover:text-orange-600 transition-colors bg-slate-50 px-3 py-1.5 rounded border border-slate-200"
                  >
                    <Ticket size={16} className="text-orange-500" />
                    <span className="font-bold text-[10px] uppercase tracking-wider">Tokens</span>
                  </button>
                )}
                <Link to="/profile" className="text-slate-600 hover:text-orange-600 transition-colors" title="Profile">
                  <User size={20} />
                </Link>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart" className="relative p-2 text-slate-600">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-full ring-2 ring-white">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link to="/#home" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded">Home</Link>
              <Link to="/#about" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded">About</Link>
              {isAuthenticated && user?.role !== 'staff' && (
                <button
                  onClick={() => { openTokenModal(); setIsOpen(false); }}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded w-full text-left"
                >
                  <Ticket size={18} className="text-orange-500" />
                  <span>My Tokens</span>
                </button>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded">Admin Panel</Link>
              )}
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded">Profile</Link>
              
              {!isAuthenticated ? (
                <div className="pt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { openAuthModal('login'); setIsOpen(false); }}
                    className="px-4 py-2 text-sm font-bold text-slate-600 border border-slate-200 rounded"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { openAuthModal('signup'); setIsOpen(false); }}
                    className="px-4 py-2 text-sm font-bold bg-orange-500 text-white rounded"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded"
                >
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
