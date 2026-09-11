import React from 'react';
import { useTransit, ActiveTab } from '../context/TransitContext';
import { LayoutDashboard, Map, SlidersHorizontal, Award, UserCheck, Cpu } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, theme } = useTransit();

  const items: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pathway', label: 'Review Hub', icon: Award },
    { id: 'validation', label: 'Studies', icon: UserCheck },
    { id: 'pipeline', label: 'GTFS-RT', icon: Cpu },
    { id: 'simulator', label: 'What-If', icon: SlidersHorizontal },
    { id: 'map', label: 'Live Map', icon: Map },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg px-2 py-1.5 transition-colors ${
      theme === 'dark'
        ? 'bg-slate-950/95 border-slate-800/80 text-slate-400'
        : 'bg-white/95 border-slate-200 text-slate-600 shadow-lg'
    }`}>
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-all ${
                isActive
                  ? 'text-cyan-400 font-bold scale-105'
                  : 'hover:text-slate-200 text-slate-400'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
