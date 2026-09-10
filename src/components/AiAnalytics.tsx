import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  Brain,
  Activity,
  CheckCircle2,
  TrendingUp,
  Car,
  AlertTriangle,
  Zap,
  BarChart2,
  Cpu,
  Layers,
  Sparkles,
  Database,
  History,
  Clock,
  Radio
} from 'lucide-react';
import { sampleHistoryLogs } from '../data/transitData';

export const AiAnalytics: React.FC = () => {
  const { buses, triggerSimulatedDelay, theme, showToast } = useTransit();
  const [activeTabSection, setActiveTabSection] = useState<'accuracy' | 'models' | 'traffic'>('accuracy');

  // Interactive Traffic Simulation Trigger
  const handleSimulateSevereTraffic = () => {
    buses.slice(0, 3).forEach((b) => triggerSimulatedDelay(b.id, 4));
    showToast('🚨 Simulated Major Corridor Gridlock (+4 min delay across fleet)');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              AI System Telemetry & Model Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Model Analytics & Prediction Accuracy
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Empirical validation metrics, ensemble architectures, and corridor traffic intelligence.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
          <button
            onClick={() => setActiveTabSection('accuracy')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTabSection === 'accuracy'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Prediction Accuracy
          </button>
          <button
            onClick={() => setActiveTabSection('models')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTabSection === 'models'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ML Architecture
          </button>
          <button
            onClick={() => setActiveTabSection('traffic')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTabSection === 'traffic'
                ? 'bg-cyan-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Traffic Intelligence
          </button>
        </div>
      </div>

      {/* SECTION 13: OVERALL SYSTEM PERFORMANCE KPIS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Overall Accuracy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 mt-1">94.8%</div>
          <div className="text-[11px] text-slate-400 mt-1">±1.1% historical variance</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Mean Absolute Error</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 mt-1">1.2 min</div>
          <div className="text-[11px] text-slate-400 mt-1">Average temporal drift</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Inference Latency</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400 mt-1">42 ms</div>
          <div className="text-[11px] text-slate-400 mt-1">Sub-second streaming loop</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Trained Dataset</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-indigo-400 mt-1">420,000+</div>
          <div className="text-[11px] text-slate-400 mt-1">Historical transit trips</div>
        </div>

      </div>

      {/* TAB 1: PREDICTION HISTORY & VERIFICATION TABLE */}
      {activeTabSection === 'accuracy' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-cyan-400" />
                  <span>Verified Arrival Prediction Logs</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous comparison between initial AI estimated arrivals vs actual sensor arrivals.
                </p>
              </div>
              <div className="text-xs font-mono text-cyan-400 font-semibold bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-800/40">
                Current Batch Precision: 96.8%
              </div>
            </div>

            {/* Verification Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3">Bus</th>
                    <th className="py-2.5 px-3">Stop / Corridor</th>
                    <th className="py-2.5 px-3">Predicted ETA</th>
                    <th className="py-2.5 px-3">Actual Arrival</th>
                    <th className="py-2.5 px-3">Absolute Error</th>
                    <th className="py-2.5 px-3">Model Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {sampleHistoryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>{log.busNumber}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{log.stopName}</td>
                      <td className="py-3 px-3 text-cyan-400 font-bold">{log.predictedEtaMin} min</td>
                      <td className="py-3 px-3 text-slate-200">{log.actualArrivalMin} min</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                          {log.errorMin} min
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full rounded-full"
                              style={{ width: `${log.accuracyPercent}%` }}
                            />
                          </div>
                          <span className="text-emerald-400 font-bold">{log.accuracyPercent}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SECTION 14 AI MODEL ARCHITECTURE & FEATURE WEIGHTS */}
      {activeTabSection === 'models' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Ensemble Models Breakdown */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>Multi-Model Ensemble Stack</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Brain className="w-4 h-4" /> 1. Long Short-Term Memory (LSTM)
                  </span>
                  <span className="text-emerald-400 font-mono">Weight: 45%</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Processes sequential GPS breadcrumb time-series to model temporal velocity dynamics and shockwave congestion buildup.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-2 text-indigo-400">
                    <Layers className="w-4 h-4" /> 2. Gradient Boosting (XGBoost / LightGBM)
                  </span>
                  <span className="text-emerald-400 font-mono">Weight: 35%</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Evaluates tabular non-linear interactions: weather friction, day-of-week school holidays, and junction signal cycle offsets.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span className="flex items-center gap-2 text-emerald-400">
                    <BarChart2 className="w-4 h-4" /> 3. Random Forest Regressor
                  </span>
                  <span className="text-emerald-400 font-mono">Weight: 20%</span>
                </div>
                <p className="text-slate-400 mt-1">
                  Provides robust baseline boundary protection against outliers and sensor telemetry dropouts.
                </p>
              </div>
            </div>
          </div>

          {/* Section 14 Features Used & SHAP Weights */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 pb-3 border-b border-slate-800">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>Input Features & Global Importance</span>
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Current Traffic Corridor Speed', pct: 32, desc: 'Real-time road velocity' },
                { name: 'Distance to Target Stop', pct: 24, desc: 'Topological route distance' },
                { name: 'Historical Day/Time Pattern', pct: 18, desc: '420k historical trips' },
                { name: 'Passenger Boarding Density', pct: 12, desc: 'Dwell time delay' },
                { name: 'Weather & Precipitation', pct: 8, desc: 'Rain road friction' },
                { name: 'Signal Intersections Count', pct: 6, desc: 'Traffic light wait cycles' },
              ].map((f) => (
                <div key={f.name}>
                  <div className="flex justify-between font-semibold text-slate-300 mb-1">
                    <span>{f.name}</span>
                    <span className="font-mono text-cyan-400">{f.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-500 h-full rounded-full transition-all duration-700"
                      style={{ width: `${f.pct * 3}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: SECTION 12 TRAFFIC INTELLIGENCE */}
      {activeTabSection === 'traffic' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Car className="w-5 h-5 text-amber-400" />
                  <span>Coimbatore Smart Corridor Traffic Radar</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Live traffic speed monitoring and AI impact multipliers across arterial corridors.
                </p>
              </div>

              <button
                onClick={handleSimulateSevereTraffic}
                className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Simulate Jam Spike (+4m)</span>
              </button>
            </div>

            {/* Congestion Hotspots Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              
              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-white text-sm">Ukkadam Flyover Junction</div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                    Severe
                  </span>
                </div>
                <div className="text-2xl font-black text-rose-400 font-mono mt-2">16 km/h</div>
                <p className="text-xs text-slate-400 mt-1">Impact: Adds +4.8 min to bus arrivals</p>
                <div className="mt-3 text-[11px] text-amber-300 bg-amber-950/30 p-2 rounded-lg border border-amber-800/40">
                  ⚠ Flyover pillar construction slowdown
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-white text-sm">Gandhipuram Crosscut</div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                    Moderate
                  </span>
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-2">28 km/h</div>
                <p className="text-xs text-slate-400 mt-1">Impact: Adds +2.2 min to bus arrivals</p>
                <div className="mt-3 text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded-lg">
                  Bazaar shopping pedestrian crossing dwell
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60">
                <div className="flex justify-between items-start">
                  <div className="font-bold text-white text-sm">Avinashi Road Expressway</div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    Fluid
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-2">48 km/h</div>
                <p className="text-xs text-slate-400 mt-1">Impact: -0.8 min faster than schedule</p>
                <div className="mt-3 text-[11px] text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
                  Clear transit lane open
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
