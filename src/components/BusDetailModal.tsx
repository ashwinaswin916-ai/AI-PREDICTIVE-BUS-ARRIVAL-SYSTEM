import React from 'react';
import { BusTelemetry } from '../types';
import { useTransit } from '../context/TransitContext';
import {
  X,
  Bus,
  Clock,
  MapPin,
  Gauge,
  Users,
  ShieldCheck,
  BatteryCharging,
  Sparkles,
  AlertTriangle,
  Radio,
  Zap,
  CheckCircle2,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { AiReasoningCard } from './AiReasoningCard';

interface BusDetailModalProps {
  bus: BusTelemetry | null;
  onClose: () => void;
}

export const BusDetailModal: React.FC<BusDetailModalProps> = ({ bus, onClose }) => {
  const { routes, stops, theme, triggerSimulatedDelay, setActiveTab, setSelectedBusId } = useTransit();

  if (!bus) return null;

  const currentRoute = routes.find((r) => r.id === bus.routeId);

  const getOccupancyBadge = (density: string, percent: number) => {
    switch (density) {
      case 'very_high':
        return { label: `Overcrowded (${percent}%)`, bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' };
      case 'high':
        return { label: `High Demand (${percent}%)`, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'medium':
        return { label: `Moderate Seats (${percent}%)`, bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' };
      default:
        return { label: `Plenty of Seats (${percent}%)`, bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
    }
  };

  const occupancy = getOccupancyBadge(bus.passengerDensity, bus.occupancyPercent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in-50">
      <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-all ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header Bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 sm:p-5 border-b border-slate-800/80 backdrop-blur-md bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-xl shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
              {bus.busNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold tracking-tight">{bus.routeName}</h2>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                  bus.status === 'delayed'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {bus.status === 'delayed' ? `Delayed +${bus.delayMins}m` : 'On Schedule'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span>Destination:</span>
                <span className="font-semibold text-cyan-400">{bus.destination}</span>
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">

          {/* Early Warning Banner if active */}
          {bus.earlyWarning?.active && (
            <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-3 text-amber-200 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>⚠ Early Warning Prediction</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200">
                    Next {bus.earlyWarning.withinNextMins} mins
                  </span>
                </div>
                <p className="text-amber-200/90 mt-0.5">{bus.earlyWarning.description}</p>
              </div>
            </div>
          )}

          {/* Quick Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>AI Predicted ETA</span>
              </div>
              <div className="text-xl font-black text-cyan-400 mt-1">
                {bus.predictedArrivalMins} min
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {bus.predictedArrivalMins} ± {bus.confidenceIntervalMin} min ({bus.confidencePercent}% conf)
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Gauge className="w-3.5 h-3.5 text-blue-400" />
                <span>Current Velocity</span>
              </div>
              <div className="text-xl font-black text-slate-200 mt-1">
                {bus.speedKmh} <span className="text-xs text-slate-400 font-normal">km/h</span>
              </div>
              <div className="text-[10px] text-emerald-400 mt-0.5 font-medium flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Live Telemetry
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>Crowd Density</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">
                {bus.passengerDensity.toUpperCase()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {bus.occupancyPercent}% seats occupied
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span>Energy / Power</span>
              </div>
              <div className="text-xl font-black text-emerald-400 mt-1">
                {bus.batteryOrFuelPercent}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                {bus.fuelType} (DEMO)
              </div>
            </div>
          </div>

          {/* Current & Next Stop Banner */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400">Current Position: </span>
                <span className="font-semibold text-slate-200">{bus.currentLocationName}</span>
                <div className="text-slate-400 mt-0.5">
                  Next Stop: <span className="font-bold text-cyan-400">{bus.nextStopName}</span>
                </div>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-400">Scheduled: </span>
              <span className="font-mono text-slate-300 font-semibold">{bus.scheduledArrival}</span>
              <div className="text-[11px] text-rose-400 font-semibold">
                Estimated Delay: +{bus.delayMins} min
              </div>
            </div>
          </div>

          {/* Complete Route Timeline (Section 9 Requirement: Current Stop -> Next Stop -> Destination) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-cyan-400" />
              Complete Route Timeline & Transit Sequence
            </h3>
            
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 divide-y divide-slate-800">
              {currentRoute?.stops.map((stop, idx) => {
                const isNextStop = stop.stopId === bus.nextStopId;
                const isFirst = idx === 0;
                const isLast = idx === (currentRoute.stops.length - 1);

                return (
                  <div key={stop.stopId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isNextStop
                          ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                          : isFirst
                          ? 'bg-slate-700 text-slate-200'
                          : isLast
                          ? 'bg-emerald-500 text-slate-950 font-black'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${isNextStop ? 'text-cyan-400 font-bold' : 'text-slate-200'}`}>
                            {stop.stopName}
                          </span>
                          {isNextStop && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              Next Stop
                            </span>
                          )}
                          {isLast && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Final Destination
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {stop.distanceFromStartKm} km from origin
                        </span>
                      </div>
                    </div>
                    <div className="text-right font-mono text-slate-400 font-medium">
                      {stop.scheduledTime}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Explainable AI Reasoning Card */}
          <AiReasoningCard bus={bus} />

          {/* Driver Telemetry (DEMO data) */}
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold">
                {bus.driverName.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-slate-200">{bus.driverName}</div>
                <div className="text-slate-400 text-[11px]">
                  Driver Exp: {bus.driverExpYears} yrs • {bus.driverStatus}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Shift</span>
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Simulate Delay Event:</span>
              <button
                onClick={() => triggerSimulatedDelay(bus.id, 2)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all"
              >
                +2m Traffic
              </button>
              <button
                onClick={() => triggerSimulatedDelay(bus.id, 5)}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 transition-all"
              >
                +5m Chokepoint
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedBusId(bus.id);
                  setActiveTab('map');
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30 transition-all flex items-center gap-1.5"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Track on Map</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
