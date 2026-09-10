import React, { useState } from 'react';
import { useTransit, ActiveTab } from '../context/TransitContext';
import {
  Bus,
  Search,
  MapPin,
  Sparkles,
  Route,
  BarChart3,
  History,
  SlidersHorizontal,
  Bell,
  Star,
  ShieldCheck,
  Play,
  Pause,
  Sun,
  Moon,
  Tv,
  Radio,
  Menu,
  X,
  Layers,
  ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isDemoMode,
    toggleDemoMode,
    isPresentationMode,
    setIsPresentationMode,
    theme,
    toggleTheme,
    alerts,
    buses,
    setSelectedBusId
  } = useTransit();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const unreadAlertsCount = alerts.length;

  const navItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'search', label: 'Find Bus', icon: Search },
    { id: 'map', label: 'Live Map', icon: MapPin },
    { id: 'predictions', label: 'AI Engine', icon: Sparkles },
    { id: 'simulator', label: 'What-If AI', icon: SlidersHorizontal },
    { id: 'routes', label: 'Smart Routes', icon: Route },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors ${
      theme === 'dark'
        ? 'bg-slate-950/90 border-slate-800/80 text-slate-100'
        : 'bg-white/95 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                <Bus className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 ring-2 ring-slate-950"></span>
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                    AuraTransit
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                    AI 4.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block font-medium truncate max-w-[200px] md:max-w-xs">
                  AI Predictive Bus Arrival System
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                        : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'opacity-70'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* More dropdown for Alerts, Favorites, Admin */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  ['alerts', 'favorites', 'admin', 'landing'].includes(activeTab)
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl border py-1 z-50 animate-in fade-in-50 zoom-in-95 ${
                  theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  <button
                    onClick={() => handleNavClick('landing')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-cyan-500/10 hover:text-cyan-400 text-left font-medium"
                  >
                    <Radio className="w-4 h-4 text-cyan-400" />
                    <span>Project Landing Page</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('favorites')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-cyan-500/10 hover:text-cyan-400 text-left font-medium"
                  >
                    <Star className="w-4 h-4 text-amber-400" />
                    <span>Favorite Commutes</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('alerts')}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-xs hover:bg-cyan-500/10 hover:text-cyan-400 text-left font-medium"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-rose-400" />
                      <span>Delay Alerts</span>
                    </div>
                    {unreadAlertsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-rose-500/20 text-rose-400 font-bold">
                        {unreadAlertsCount}
                      </span>
                    )}
                  </button>
                  <div className="border-t border-slate-800/60 my-1" />
                  <button
                    onClick={() => handleNavClick('admin')}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs hover:bg-indigo-500/10 hover:text-indigo-400 text-left font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>Admin Fleet Portal</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Action Tools: Demo Mode, Presentation Mode, Alerts Bell, Dark/Light */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* Live Demo Simulation Toggle */}
            <button
              onClick={toggleDemoMode}
              title="Toggle Live Simulation Ticks (Bus moving & updating)"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isDemoMode
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/20'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isDemoMode ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden sm:inline">Simulation Live</span>
                  <span className="sm:hidden text-[10px]">Live</span>
                </>
              ) : (
                <>
                  <Pause className="w-3 h-3" />
                  <span className="hidden sm:inline">Sim Paused</span>
                  <span className="sm:hidden text-[10px]">Pause</span>
                </>
              )}
            </button>

            {/* College Project Presentation Mode Button */}
            <button
              onClick={() => setIsPresentationMode(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-600/30 transition-all active:scale-95"
              title="Open Project Presentation Deck for College / Demo Showcase"
            >
              <Tv className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Presentation Mode</span>
              <span className="md:hidden text-[10px]">Demo</span>
            </button>

            {/* Quick Alerts Bell */}
            <button
              onClick={() => handleNavClick('alerts')}
              className={`relative p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors ${
                activeTab === 'alerts' ? 'text-cyan-400 bg-cyan-500/15' : ''
              }`}
              title="System Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
              )}
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-2 pb-4 space-y-1.5 transition-all ${
          theme === 'dark' ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800/60 grid grid-cols-3 gap-1.5 text-center">
            <button
              onClick={() => handleNavClick('landing')}
              className="px-2 py-1.5 text-xs rounded-lg bg-slate-900/60 text-slate-300 hover:text-cyan-400"
            >
              Landing
            </button>
            <button
              onClick={() => handleNavClick('favorites')}
              className="px-2 py-1.5 text-xs rounded-lg bg-slate-900/60 text-slate-300 hover:text-amber-400"
            >
              Favorites
            </button>
            <button
              onClick={() => handleNavClick('admin')}
              className="px-2 py-1.5 text-xs rounded-lg bg-slate-900/60 text-slate-300 hover:text-indigo-400"
            >
              Admin Fleet
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
