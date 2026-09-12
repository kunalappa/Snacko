import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User as UserIcon, ArrowRight, GraduationCap, Briefcase, ChefHat, ShieldAlert, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../data/mockData';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../api';
import Swal from 'sweetalert2';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'signup';
    initialRole?: UserRole;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', initialRole = 'student' }) => {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [role, setRole] = useState<UserRole>(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [studentId, setStudentId] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login, user } = useAuth();
    const navigate = useNavigate();

    // Redirect user based on role after successful login
    React.useEffect(() => {
        if (user && isOpen) {
            const role = user.role;
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'staff') {
                navigate('/staff');
            } else if (role === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/home');
            }
            onClose();
        }
    }, [user, isOpen, navigate, onClose]);

    useEffect(() => {
        setIsLogin(initialMode === 'login');
        setRole(initialRole);
        setError(null);
        setStudentId(''); // Clear student ID when modal opens
    }, [initialMode, initialRole, isOpen]);

    // Clear student ID when role changes
    useEffect(() => {
        if (role !== 'student') {
            setStudentId('');
        }
    }, [role]);


    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (isLogin) {
                await login({ email, password, role });
                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: 'Redirecting to your dashboard...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#ffffff',
                    color: '#1a1a1a',
                    iconColor: '#f97316',
                });
                onClose();
            } else {
                // SignUp logic
                const userData: any = {
                    name,
                    email,
                    password,
                    role
                };
                
                // Add studentId if role is student
                if (role === 'student') {
                    userData.studentId = studentId;
                }
                
                await createUser(userData);

                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: 'Signing you in...',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#ffffff',
                    color: '#1a1a1a',
                    iconColor: '#f97316',
                });

                // After successful sign up, automatically log them in
                await login({ email, password, role });
                onClose();
            }
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Failed',
                text: err.message || 'Please check your details and try again.',
                background: '#ffffff',
                color: '#1a1a1a',
                confirmButtonColor: '#f97316',
            });
            setError(err.message || 'Authentication failed. Please check your details.');
        } finally {
            setIsSubmitting(false);
        }
    };


    const roles: { id: UserRole; title: string; icon: React.ReactNode; color: string }[] = [
        { id: 'student', title: 'Student', icon: <GraduationCap size={18} />, color: 'text-orange-500' },
        { id: 'teacher', title: 'Teacher', icon: <Briefcase size={18} />, color: 'text-blue-500' },
        { id: 'staff', title: 'Staff', icon: <ChefHat size={18} />, color: 'text-green-500' },
        { id: 'admin', title: 'Admin', icon: <ShieldAlert size={18} />, color: 'text-gray-800' },
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors z-20"
                    >
                        <X size={18} />
                    </button>

                    <div className="p-8 overflow-y-auto no-scrollbar">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                                {isLogin ? 'Sign In' : 'Create Account'}
                            </h2>
                            {error && (
                                <p className="text-red-600 mt-2 text-xs font-semibold bg-red-50 p-2 rounded border border-red-100">
                                    {error}
                                </p>
                            )}
                            <p className="text-slate-500 mt-1 text-sm">
                                {isLogin ? 'Access your campus account' : 'Register for the canteen system'}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-slate-200 mb-6">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${isLogin ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 text-sm font-semibold transition-all ${!isLogin ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            {!isLogin && role === 'student' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Student ID</label>
                                    <div className="relative">
                                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={studentId}
                                            onChange={(e) => setStudentId(e.target.value)}
                                            placeholder="e.g. 2024CS001"
                                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Campus Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="id@campus.edu"
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Role</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                                        {roles.find(r => r.id === role)?.icon}
                                    </div>
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value as UserRole)}
                                        className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none appearance-none cursor-pointer font-medium text-sm"
                                    >
                                        {roles.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.title}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2.5 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 transition-all shadow-sm flex items-center justify-center group mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                ) : (
                                    <>
                                        {isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                                    </>
                                )}
                            </button>

                        </form>

                        <p className="text-center mt-6 text-slate-600 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-orange-600 font-bold hover:underline transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AuthModal;
