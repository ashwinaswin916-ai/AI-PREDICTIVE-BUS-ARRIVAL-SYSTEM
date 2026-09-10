import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  ShieldAlert,
  Bus,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  RefreshCw,
  Bell,
  CheckCircle2,
  TrendingUp,
  Activity,
  Trash2,
  Zap,
  Sliders,
  Settings
} from 'lucide-react';

export const AdminTransitPanel: React.FC = () => {
  const {
    buses,
    routes,
    alerts,
    favorites,
    removeFavorite,
    triggerSimulatedDelay,
    resetAllSimulations,
    theme,
    showToast
  } = useTransit();

  const [simulatedBusNumber, setSimulatedBusNumber] = useState('');
  const [activeAlerts, setActiveAlerts] = useState(alerts);

  // Metrics
  const totalActiveBuses = buses.length;
  const delayedBuses = buses.filter((b) => b.status === 'delayed').length;
  const avgDelay = Math.round((buses.reduce((acc, b) => acc + b.delayMins, 0) / (totalActiveBuses || 1)) * 10) / 10;
  const mostCongestedRoute = 'Route 21A (Rathinam – Gandhipuram)';

  const handleExportTelemetry = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(buses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `transit_telemetry_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('📥 Telemetry dataset exported successfully');
  };

  const handleTriggerFleetSpike = (mins: number) => {
    buses.forEach((b) => triggerSimulatedDelay(b.id, mins));
    showToast(`⚠ Fleet-wide delay of +${mins}m triggered across all active routes`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Transit Operator Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Fleet Operations & Dispatch Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Supervisory monitoring, fleet delay injection, saved commutes, and CSV/JSON reporting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTelemetry}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Fleet Telemetry (JSON)</span>
          </button>
          <button
            onClick={() => resetAllSimulations()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Fleet</span>
          </button>
        </div>
      </div>

      {/* Section 16 Mandated Operator KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Active Fleet</span>
            <Bus className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white mt-1">{totalActiveBuses} Buses</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% GPS Transponders Active</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Delayed Buses</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-rose-400 mt-1">{delayedBuses} Delayed</div>
          <div className="text-[11px] text-slate-400 mt-1">
            {Math.round((delayedBuses / totalActiveBuses) * 100)}% of active fleet impacted
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Corridor Delay</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 mt-1">+{avgDelay} min</div>
          <div className="text-[11px] text-slate-400 mt-1">Acceptable SLA limit: 5.0m</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Chokepoint</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-sm font-black text-white truncate mt-2">Route 21A Corridor</div>
          <div className="text-[11px] text-rose-400 mt-1">Ukkadam Flyover Junction (+4.8m)</div>
        </div>

      </div>

      {/* Operator Controls: Delay Injection & Simulation Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 cols: Fleet Dispatcher Controls */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Simulated Fleet Dispatcher Injections</span>
          </h3>

          <div className="space-y-3 text-xs">
            <p className="text-slate-400">
              Inject simulated real-world disruptions to demonstrate the AI engine's automatic ETA updates and passenger recalculations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                onClick={() => handleTriggerFleetSpike(2)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
              >
                <div className="font-bold text-amber-400">+2 Min Signal Delay</div>
                <p className="text-[11px] text-slate-400 mt-1">Minor arterial junction pause</p>
              </button>

              <button
                onClick={() => handleTriggerFleetSpike(5)}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
              >
                <div className="font-bold text-rose-400">+5 Min Chokepoint</div>
                <p className="text-[11px] text-slate-400 mt-1">Ukkadam peak congestion spike</p>
              </button>

              <button
                onClick={() => resetAllSimulations()}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-left transition-all"
              >
                <div className="font-bold text-emerald-400">Restore Baseline</div>
                <p className="text-[11px] text-slate-400 mt-1">Clear simulated delay parameters</p>
              </button>
            </div>
          </div>

          {/* Section 17 User Features: Saved Favorites & Commutes */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-xs flex items-center gap-2">
                <Bell className="w-3.5 h-3.5 text-cyan-400" />
                <span>Saved Commutes & Passenger Alarms ({favorites.length})</span>
              </h4>
            </div>

            <div className="space-y-2">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{fav.title}</div>
                    <div className="text-[11px] text-slate-400">{fav.subtitle}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                      Next: {fav.nextArrivalMin}m
                    </span>
                    <button
                      onClick={() => removeFavorite(fav.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Live Incident Dispatch Stream */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Corridor Transit Alerts & Advisory Stream</span>
          </h3>

          <div className="space-y-3 text-xs">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3.5 rounded-xl border ${
                  alert.severity === 'critical'
                    ? 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                    : 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-wider text-[10px]">
                    {alert.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    +{alert.estimatedDelayImpactMin}m impact
                  </span>
                </div>
                <div className="font-bold text-white mt-1">{alert.title}</div>
                <p className="text-slate-400 mt-1 leading-relaxed">{alert.description}</p>
                <div className="mt-2 text-[10px] text-slate-500">
                  Location: {alert.location}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
