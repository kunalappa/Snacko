import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Clock, Shield, GraduationCap, Briefcase, ChefHat, Lock } from 'lucide-react';
import { useModal } from '../context/ModalContext';

const LandingPage: React.FC = () => {
  const { openAuthModal } = useModal();
  const roles = [
    { id: 'student', title: 'Student', icon: <GraduationCap size={24} />, color: 'bg-orange-500' },
    { id: 'teacher', title: 'Teacher', icon: <Briefcase size={24} />, color: 'bg-blue-500' },
    { id: 'staff', title: 'Staff', icon: <ChefHat size={24} />, color: 'bg-green-500' },
    { id: 'admin', title: 'Admin', icon: <Lock size={24} />, color: 'bg-gray-800' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="home" className="pt-20 pb-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <span className="text-orange-600 font-semibold tracking-wide uppercase text-sm mb-4 block">
              Canteen Management System
            </span>
            <h1 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
              Efficient Campus Dining <br />
              <span className="text-orange-500">Simplified for Everyone.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
              Skip the queues and manage your meals with ease. A professional solution for students, faculty, and staff.
            </p>

            <div id="roles" className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => openAuthModal('login', role.id as any)}
                  className="flex flex-col items-center p-6 bg-white border border-slate-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all group"
                >
                  <div className={`w-12 h-12 ${role.color} text-white rounded-lg flex items-center justify-center mb-3 shadow-sm`}>
                    {role.icon}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">{role.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6 underline decoration-orange-500 decoration-4 underline-offset-8">About the System</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our Canteen Management System is a streamlined platform designed to enhance the dining experience within educational institutions. We focus on efficiency and ease of use for both consumers and providers.
              </p>
              <div className="space-y-3">
                {[
                  "Quick and easy meal pre-ordering",
                  "Secure digital payment integration",
                  "Real-time order status tracking",
                  "Comprehensive administrative tools"
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 text-slate-700">
                    <div className="w-5 h-5 bg-orange-100 text-orange-600 rounded flex items-center justify-center flex-shrink-0">
                      <Zap size={12} />
                    </div>
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                alt="Campus Environment"
                className="w-full h-auto grayscale-[20%] hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">System Features</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Core functionalities designed for a professional campus environment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Clock size={24} />, title: "Time Efficient", desc: "Reduce wait times during peak hours.", color: "text-blue-600" },
              { icon: <Shield size={24} />, title: "Secure Access", desc: "Role-based authentication for all users.", color: "text-orange-600" },
              { icon: <Zap size={24} />, title: "Fast Updates", desc: "Instant notifications on order readiness.", color: "text-green-600" },
              { icon: <ChefHat size={24} />, title: "Easy Mgmt", desc: "Simple interface for canteen staff.", color: "text-purple-600" }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className={`${feature.color} mb-4`}>{feature.icon}</div>
                <h4 className="font-bold text-lg text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
