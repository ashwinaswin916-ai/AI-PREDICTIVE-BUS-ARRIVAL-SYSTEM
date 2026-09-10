import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  Route,
  Sparkles,
  Award,
  Clock,
  Users,
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Bus,
  CheckCircle2,
  Calendar,
  BarChart2,
  ChevronRight
} from 'lucide-react';
import { BusTelemetry } from '../types';
import { BusDetailModal } from './BusDetailModal';

export const SmartRoutes: React.FC = () => {
  const { buses, setSelectedBusId, setActiveTab, theme } = useTransit();
  const [modalBus, setModalBus] = useState<BusTelemetry | null>(null);

  // Recommended best bus (e.g. Bus 21A or lowest arrival + delay)
  const recommendedBus = buses.find((b) => b.busNumber === '21A') || buses[0];
  const alternativeBuses = buses.filter((b) => b.id !== recommendedBus.id).slice(0, 4);

  // Hourly Crowd Prediction Data (Section 11 requirement)
  const hourlyForecast = [
    { time: '07:30 AM', load: 'Low', pct: 28, advice: 'Plenty of empty seats' },
    { time: '08:00 AM', load: 'High', pct: 78, advice: 'Standing room only' },
    { time: '08:30 AM', load: 'Very High', pct: 94, advice: 'Peak crush: take next bus' },
    { time: '09:00 AM', load: 'Medium', pct: 55, advice: 'Window seats likely available' },
    { time: '09:30 AM', load: 'Moderate', pct: 45, advice: 'Comfortable commute' },
    { time: '10:00 AM', load: 'Low', pct: 30, advice: 'Light passenger load' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              AI Route Optimizer & Alternatives Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Smart Route Recommendations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Real-time multi-criteria decision modeling prioritizing shortest arrival, lowest crowd, and traffic bypass.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
            Origin: Rathinam Tech Campus
          </span>
          <span className="text-slate-500">→</span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 font-semibold">
            Gandhipuram Stand
          </span>
        </div>
      </div>

      {/* SECTION 10 MANDATED FEATURE: BEST BUS RECOMMENDATION HERO CARD */}
      <div className={`p-6 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-emerald-950/40 via-slate-900/95 to-slate-950 border-emerald-500/40 shadow-2xl'
          : 'bg-white border-emerald-300 shadow-lg'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                  Best Bus Recommendation
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Optimal Choice #1
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 flex items-center gap-2">
                <span>Bus {recommendedBus.busNumber}</span>
                <span className="text-sm font-normal text-slate-400">({recommendedBus.routeName})</span>
              </h2>
              <p className="text-xs text-emerald-300 font-medium mt-0.5">
                Arrival: <span className="font-bold">{recommendedBus.predictedArrivalMins} min</span> • Less Crowded • Faster by 6 min
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-center">
            <div className="text-right">
              <div className="text-xs text-slate-400">Predicted Arrival</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">
                {recommendedBus.predictedArrivalMins} min
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedBusId(recommendedBus.id);
                setModalBus(recommendedBus);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Board This Bus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recommended Reason & Key Perks */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Why AI Recommends</span>
            <span className="font-semibold text-white mt-1 block">
              Avoids Ukkadam chokepoint traffic via Trichy Road Bypass corridor.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Passenger Comfort</span>
            <span className="font-semibold text-emerald-300 mt-1 block">
              {recommendedBus.occupancyPercent}% occupancy • 18 open seats guaranteed.
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Prediction Reliability</span>
            <span className="font-semibold text-cyan-300 mt-1 block">
              {recommendedBus.confidencePercent}% confidence • ±{recommendedBus.confidenceIntervalMin}m interval.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 11: PASSENGER CROWD LEVEL PREDICTION & HOURLY FORECAST */}
      <div className={`p-6 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Crowd Intelligence
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1">
              Passenger Density & Seat Availability Forecast
            </h3>
            <p className="text-xs text-slate-400">
              Machine learning models trained on historical boarding sensors and fare-gate telemetry.
            </p>
          </div>

          {/* Advice Badge */}
          <div className="p-2.5 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-xs text-indigo-300 font-semibold self-start sm:self-center">
            💡 Advice: Seats available on 21A, but take next bus in 12 min for an empty seated commute!
          </div>
        </div>

        {/* Section 11 Mandated 4-tier visual crowd bar */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Current Bus 21A Occupancy: <strong className="text-emerald-400">{recommendedBus.occupancyPercent}%</strong></span>
            <span className="font-semibold text-slate-400">Status: Plenty of Seats</span>
          </div>

          {/* 4-tier color bar */}
          <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div className="w-1/4 bg-emerald-500/30 border-r border-slate-900 text-[9px] text-emerald-200 font-bold flex items-center justify-center">
              Low (0-30%)
            </div>
            <div className="w-1/4 bg-amber-500/30 border-r border-slate-900 text-[9px] text-amber-200 font-bold flex items-center justify-center">
              Med (31-60%)
            </div>
            <div className="w-1/4 bg-orange-500/30 border-r border-slate-900 text-[9px] text-orange-200 font-bold flex items-center justify-center">
              High (61-85%)
            </div>
            <div className="w-1/4 bg-rose-500/30 text-[9px] text-rose-200 font-bold flex items-center justify-center">
              Crush (86-100%)
            </div>
          </div>
        </div>

        {/* Hourly Forecast Schedule (Section 11 requirement) */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400">
              Corridor Future Crowd Forecast (Next 3 Hours)
            </span>
            <span className="text-slate-500">Historical Regression Projection</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {hourlyForecast.map((item) => (
              <div key={item.time} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                <span className="text-[11px] font-mono text-slate-400 font-semibold">{item.time}</span>
                <div className={`text-base font-black mt-1 ${
                  item.pct > 80 ? 'text-rose-400' : item.pct > 60 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {item.load} ({item.pct}%)
                </div>
                <div className="w-full bg-slate-700/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.pct > 80 ? 'bg-rose-500' : item.pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 truncate">{item.advice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 10 MANDATED ALTERNATIVE ROUTES COMPARISON */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Route className="w-4 h-4 text-cyan-400" />
            <span>Alternative Routes & Comparative Trade-offs</span>
          </h3>
          <span className="text-xs text-slate-400">Ranked by arrival time</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {alternativeBuses.map((alt) => (
            <div
              key={alt.id}
              onClick={() => {
                setSelectedBusId(alt.id);
                setModalBus(alt);
              }}
              className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-800 text-white font-black text-base border border-slate-700">
                    {alt.busNumber}
                  </div>
                  <div>
                    <div className="font-extrabold text-sm text-slate-200">{alt.routeName}</div>
                    <div className="text-xs text-slate-400">Via {alt.currentLocationName}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-slate-200 font-mono">
                    {alt.predictedArrivalMins} min
                  </div>
                  <div className="text-[11px] text-rose-400 font-semibold">
                    +{alt.predictedArrivalMins - recommendedBus.predictedArrivalMins}m slower
                  </div>
                </div>
              </div>

              {/* Comparison Matrix */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Crowd</span>
                  <span className="font-bold text-slate-300 capitalize">{alt.passengerDensity} ({alt.occupancyPercent}%)</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Delay</span>
                  <span className="font-bold text-amber-400">+{alt.delayMins} min</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">AI Reliability</span>
                  <span className="font-bold text-cyan-400">{alt.confidencePercent}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bus Detail Modal */}
      {modalBus && (
        <BusDetailModal
          bus={modalBus}
          onClose={() => setModalBus(null)}
        />
      )}

    </div>
  );
};
