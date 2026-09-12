import React from 'react';
import { DAILY_THALI_MENU } from '../data/mockData';
import { Calendar, ChevronRight } from 'lucide-react';

const DailyThaliMenu: React.FC = () => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  const [selectedDay, setSelectedDay] = React.useState(today);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="bg-slate-900 p-4 text-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider">
            <Calendar size={16} />
            Daily Thali Menu
          </h2>
        </div>
      </div>

      <div className="p-4">
        {/* Day Selector */}
        <div className="flex space-x-1 overflow-x-auto pb-3 no-scrollbar border-b border-slate-100 mb-4">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                selectedDay === day
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {day === today ? 'Today' : day.substring(0, 3)}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            {selectedDay}'s Items
          </h3>
          {DAILY_THALI_MENU[selectedDay].map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200 group transition-all"
            >
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-xs font-semibold text-slate-700">{item}</span>
              </div>
              <ChevronRight size={14} className="text-slate-300 group-hover:text-orange-500 transition-all" />
            </div>
          ))}
        </div>

        <div className="mt-6 p-3 bg-orange-50 rounded border border-orange-100">
          <p className="text-[10px] text-orange-700 font-medium leading-relaxed">
            * Thali menu is subject to change. Unlimited rice and dal for mess subscribers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DailyThaliMenu;
