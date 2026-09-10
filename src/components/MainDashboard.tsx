import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  Bus,
  Clock,
  Car,
  Users,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  MapPin,
  ChevronRight,
  Radio,
  SlidersHorizontal,
  Route,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { AiReasoningCard } from './AiReasoningCard';
import { BusDetailModal } from './BusDetailModal';
import { BusTelemetry } from '../types';

export const MainDashboard: React.FC = () => {
  const {
    buses,
    selectedBus,
    setSelectedBusId,
    setActiveTab,
    theme,
    triggerSimulatedDelay,
    resetAllSimulations
  } = useTransit();

  const [activeModalBus, setActiveModalBus] = useState<BusTelemetry | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'delayed' | 'on_time'>('all');

  // Next Bus (primary selected bus)
  const nextBus = selectedBus || buses[0];
  // Following bus on same or nearby route
  const followingBus = buses.find((b) => b.id !== nextBus.id && b.routeId === nextBus.routeId) || buses[1];

  const filteredBuses = buses.filter((b) => {
    if (filterCategory === 'delayed') return b.status === 'delayed';
    if (filterCategory === 'on_time') return b.status === 'on_time';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Top Banner / Welcome with Quick Mode Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
              Coimbatore Metropolitan Smart Corridor
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
            Real-Time AI Transit Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Predictive machine learning arrival forecasts calibrated with live sensor streams.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulator')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700/80 transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI What-If Sandbox</span>
          </button>
          <button
            onClick={() => resetAllSimulations()}
            className="p-2 rounded-xl text-xs font-semibold bg-slate-800/60 hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-all"
            title="Reset telemetry variables"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 27 UNIQUE FEATURE: EARLY WARNING PREDICTION CARD */}
      {nextBus.earlyWarning?.active && (
        <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-orange-950/40 border border-amber-500/40 shadow-xl shadow-amber-950/20 animate-in fade-in-50">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                    ⚠ Early Warning Prediction
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 font-bold">
                    Target: Next {nextBus.earlyWarning.withinNextMins} Mins
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {nextBus.earlyWarning.title} on Bus {nextBus.busNumber}
                </h4>
                <p className="text-xs text-amber-200/90 mt-1 max-w-3xl leading-relaxed">
                  {nextBus.earlyWarning.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => setActiveTab('routes')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-md transition-all flex items-center gap-1.5"
              >
                <span>Find Alternative Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4 MANDATED 6 KEY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
        
        {/* Card 1: Next Bus */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/30'
            : 'bg-white border-cyan-200 shadow-md'
        } relative overflow-hidden group`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
              <Bus className="w-3.5 h-3.5" /> Next Bus
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold">
              Live
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-black text-white">{nextBus.busNumber}</div>
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-400">{nextBus.predictedArrivalMins}</span>
              <span className="text-xs text-slate-400 ml-1">min</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 font-medium truncate mt-1">
            → {nextBus.destination}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Confidence</span>
            <span className="font-bold text-cyan-400">{nextBus.confidencePercent}%</span>
          </div>
        </div>

        {/* Card 2: Following Bus */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800/90'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" /> Following Bus
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {followingBus.busNumber}
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-xl font-bold text-slate-200">{followingBus.busNumber}</div>
            <div className="text-right">
              <span className="text-2xl font-black text-blue-400">{followingBus.predictedArrivalMins}</span>
              <span className="text-xs text-slate-400 ml-1">min</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">
            Headway interval: +{followingBus.predictedArrivalMins - nextBus.predictedArrivalMins}m
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Status</span>
            <span className="font-semibold text-emerald-400">On Cadence</span>
          </div>
        </div>

        {/* Card 3: Current Traffic */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800/90'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-amber-400" /> Current Traffic
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
              nextBus.reasoning.trafficFactorMins > 2
                ? 'bg-rose-500/20 text-rose-300'
                : 'bg-amber-500/20 text-amber-300'
            }`}>
              {nextBus.reasoning.trafficFactorMins > 2 ? 'Heavy' : 'Moderate'}
            </span>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {nextBus.reasoning.trafficFactorMins > 2 ? 'Heavy Delay' : 'Moderate'}
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">
            Corridor avg: {nextBus.speedKmh} km/h
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Impact Factor</span>
            <span className="font-bold text-amber-400">+{nextBus.reasoning.trafficFactorMins} min</span>
          </div>
        </div>

        {/* Card 4: Passenger Density */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800/90'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" /> Passenger Crowd
            </span>
            <span className="text-[10px] font-mono text-indigo-400">
              {nextBus.occupancyPercent}%
            </span>
          </div>
          <div className="text-2xl font-black text-indigo-400 mt-1 capitalize">
            {nextBus.passengerDensity.replace('_', ' ')}
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">
            Dwell impact: +{nextBus.reasoning.passengerBoardingFactorMins}m
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Seats Status</span>
            <span className="font-semibold text-slate-300">
              {nextBus.occupancyPercent > 80 ? 'Standing Only' : 'Seats Open'}
            </span>
          </div>
        </div>

        {/* Card 5: Route Delay */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800/90'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" /> Route Delay
            </span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
              nextBus.delayMins > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
            }`}>
              {nextBus.delayMins > 0 ? `+${nextBus.delayMins}m` : '0m'}
            </span>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-1">
            +{nextBus.delayMins} <span className="text-xs text-slate-400 font-normal">min</span>
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">
            Sched: {nextBus.scheduledArrival}
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Severity</span>
            <span className="font-semibold text-amber-400">
              {nextBus.delayMins > 3 ? 'Elevated' : 'Nominal'}
            </span>
          </div>
        </div>

        {/* Card 6: AI Confidence */}
        <div className={`p-4 rounded-2xl border transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-800/90'
            : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> AI Confidence
            </span>
            <span className="text-[10px] font-bold text-cyan-400 font-mono">
              LSTM
            </span>
          </div>
          <div className="text-2xl font-black text-cyan-400 mt-1">
            {nextBus.confidencePercent}%
          </div>
          <p className="text-xs text-slate-400 truncate mt-1">
            Error bound: ±{nextBus.confidenceIntervalMin}m
          </p>
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Data Reliability</span>
            <span className="font-semibold text-emerald-400">High Precision</span>
          </div>
        </div>

      </div>

      {/* SECTION 26 UNIQUE FEATURE: AI ARRIVAL CONFIDENCE RANGE VISUALIZER */}
      <div className={`p-5 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border-slate-800 shadow-xl'
          : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Unique Feature
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                AI Arrival Confidence Range
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1">
              {nextBus.predictedArrivalMins} minutes ± {nextBus.confidenceIntervalMin} minute
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              The AI predicts Bus {nextBus.busNumber} will arrive between{' '}
              <span className="text-cyan-400 font-bold">
                {Math.max(1, Math.round((nextBus.predictedArrivalMins - nextBus.confidenceIntervalMin) * 10) / 10)} –{' '}
                {Math.round((nextBus.predictedArrivalMins + nextBus.confidenceIntervalMin) * 10) / 10} minutes
              </span>{' '}
              with <span className="text-white font-bold">{nextBus.confidencePercent}% confidence</span>.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Lower Bound</div>
              <div className="text-sm font-black text-cyan-300 font-mono">
                {Math.max(1, Math.round((nextBus.predictedArrivalMins - nextBus.confidenceIntervalMin) * 10) / 10)} min
              </div>
            </div>
            <div className="text-slate-600 font-black">↔</div>
            <div className="px-3 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Upper Bound</div>
              <div className="text-sm font-black text-cyan-300 font-mono">
                {Math.round((nextBus.predictedArrivalMins + nextBus.confidenceIntervalMin) * 10) / 10} min
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Interval Gradient Scale Bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Now (0m)</span>
            <span className="text-cyan-400 font-bold">Expected: {nextBus.predictedArrivalMins}m</span>
            <span>Horizon (+30m)</span>
          </div>

          <div className="relative w-full h-4 bg-slate-800/80 rounded-full overflow-hidden p-0.5">
            {/* Target band window */}
            <div
              className="absolute top-0.5 bottom-0.5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 shadow-lg shadow-cyan-500/50 transition-all duration-500"
              style={{
                left: `${Math.max(5, ((nextBus.predictedArrivalMins - nextBus.confidenceIntervalMin) / 30) * 100)}%`,
                width: `${Math.max(12, ((nextBus.confidenceIntervalMin * 2) / 30) * 100)}%`,
              }}
            />
            {/* Center target indicator */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-md z-10"
              style={{
                left: `${Math.max(8, (nextBus.predictedArrivalMins / 30) * 100)}%`,
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>95% Gaussian Prediction Bell</span>
            <span className="text-cyan-400 font-medium">Empirical Probability Density Validated</span>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: AI Reasoning Card & Quick Bus Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: AI Reasoning Card */}
        <div className="lg:col-span-7">
          <AiReasoningCard bus={nextBus} />
        </div>

        {/* Right 5 cols: Active Bus Selector & Journey Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-5 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>Active Bus Telemetry Stream</span>
              </h3>
              <button
                onClick={() => setActiveModalBus(nextBus)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Full Telemetry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Current Location</span>
                <span className="font-semibold text-slate-200">{nextBus.currentLocationName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Next Approaching Stop</span>
                <span className="font-semibold text-cyan-400">{nextBus.nextStopName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Telemetry Driver</span>
                <span className="font-semibold text-slate-200">{nextBus.driverName} ({nextBus.driverExpYears}y)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/40">
                <span className="text-slate-400">Fleet Energy / Fuel</span>
                <span className="font-semibold text-emerald-400">{nextBus.batteryOrFuelPercent}% ({nextBus.fuelType})</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Operational Status</span>
                <span className={`font-bold ${nextBus.status === 'delayed' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {nextBus.status === 'delayed' ? `Delayed +${nextBus.delayMins}m` : 'Punctual'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2">
              <button
                onClick={() => triggerSimulatedDelay(nextBus.id, 2)}
                className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 transition-all text-center"
              >
                +2m Spike
              </button>
              <button
                onClick={() => {
                  setSelectedBusId(nextBus.id);
                  setActiveTab('map');
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all text-center shadow-md shadow-cyan-600/30"
              >
                View on Map
              </button>
            </div>
          </div>

          {/* Quick Route Switcher */}
          <div className={`p-4 rounded-2xl border transition-all ${
            theme === 'dark' ? 'bg-slate-900/60 border-slate-800/80' : 'bg-white border-slate-200'
          }`}>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Switch Tracked Bus
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {buses.slice(0, 8).map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBusId(b.id)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                    b.id === nextBus.id
                      ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400 font-black'
                      : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300'
                  }`}
                >
                  {b.busNumber}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Live Bus Fleet Arrival Board */}
      <div className={`p-5 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Corridor Live Arrivals Board</span>
            </h3>
            <p className="text-xs text-slate-400">
              Real-time predictions calculated for {buses.length} active buses across 12 transit corridors
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 bg-slate-800/70 p-1 rounded-xl border border-slate-700/50 self-start sm:self-center">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({buses.length})
            </button>
            <button
              onClick={() => setFilterCategory('on_time')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === 'on_time'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              On-Time ({buses.filter((b) => b.status === 'on_time').length})
            </button>
            <button
              onClick={() => setFilterCategory('delayed')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterCategory === 'delayed'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Delayed ({buses.filter((b) => b.status === 'delayed').length})
            </button>
          </div>
        </div>

        {/* Fleet Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-4">
          {filteredBuses.map((bus) => {
            const isSelected = bus.id === nextBus.id;

            return (
              <div
                key={bus.id}
                onClick={() => {
                  setSelectedBusId(bus.id);
                  setActiveModalBus(bus);
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all hover:scale-[1.01] ${
                  isSelected
                    ? 'bg-cyan-950/20 border-cyan-500/50 ring-1 ring-cyan-500/30'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 font-black text-sm">
                      {bus.busNumber}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-200">{bus.routeName}</div>
                      <div className="text-[11px] text-slate-400">
                        Dest: <span className="text-slate-300 font-medium">{bus.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-cyan-400 font-mono">
                      {bus.predictedArrivalMins} <span className="text-xs font-normal text-slate-400">min</span>
                    </div>
                    <div className={`text-[10px] font-bold ${
                      bus.status === 'delayed' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {bus.status === 'delayed' ? `+${bus.delayMins}m delay` : 'On Time'}
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{bus.nextStopName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-cyan-400 font-semibold">{bus.confidencePercent}% conf</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bus Detail Modal */}
      {activeModalBus && (
        <BusDetailModal
          bus={activeModalBus}
          onClose={() => setActiveModalBus(null)}
        />
      )}

    </div>
  );
};
