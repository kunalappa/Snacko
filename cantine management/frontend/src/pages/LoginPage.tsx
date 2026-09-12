import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use the actual login from useAuth
      await login({ email, password });
      
      // Get user from localStorage as context update might be async
      const storedUser = localStorage.getItem('auth_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (user.role === 'staff') {
          navigate('/staff/dashboard');
        } else {
          navigate('/home');
        }
      } else {
        navigate('/home');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      alert(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">Snacko</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
          <p className="text-slate-500 text-sm mt-1">Access your account to manage orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2 ml-1">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs font-semibold text-orange-600 hover:underline">Forgot Password?</a>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all flex items-center justify-center text-sm shadow-sm"
          >
            Sign In
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-slate-400">System Access</span>
          </div>
        </div>

        <p className="text-center mt-6 text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-orange-600 font-bold hover:underline">Register Now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
