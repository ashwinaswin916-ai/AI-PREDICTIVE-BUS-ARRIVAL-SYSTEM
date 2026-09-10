import React, { useState } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  SlidersHorizontal,
  Car,
  Users,
  CloudRain,
  Gauge,
  MapPin,
  Sparkles,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Info
} from 'lucide-react';
import { TrafficLevel, CrowdLevel, WeatherCondition } from '../types';

export const WhatIfSimulator: React.FC = () => {
  const { whatIfInput, setWhatIfInput, whatIfOutput, theme, showToast } = useTransit();

  // Baseline reference values for comparison
  const baselineEta = 7;
  const etaDelta = Math.round((whatIfOutput.predictedEtaMin - baselineEta) * 10) / 10;

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'monsoon':
        setWhatIfInput({
          traffic: 'heavy',
          passengerLoad: 'high',
          weather: 'heavy_rain',
          busSpeedKmh: 20,
          stopsRemaining: 6,
          distanceRemainingKm: 7.5,
        });
        showToast('🌧️ Applied Scenario: Monsoon Peak Hour Congestion');
        break;
      case 'clear_night':
        setWhatIfInput({
          traffic: 'low',
          passengerLoad: 'low',
          weather: 'clear',
          busSpeedKmh: 45,
          stopsRemaining: 3,
          distanceRemainingKm: 6.0,
        });
        showToast('🌙 Applied Scenario: Late Night Fast Transit');
        break;
      case 'college_rush':
        setWhatIfInput({
          traffic: 'severe',
          passengerLoad: 'very_high',
          weather: 'cloudy',
          busSpeedKmh: 24,
          stopsRemaining: 5,
          distanceRemainingKm: 6.8,
        });
        showToast('🎓 Applied Scenario: Evening College Shift Dismissal');
        break;
      case 'reset':
      default:
        setWhatIfInput({
          traffic: 'moderate',
          passengerLoad: 'medium',
          weather: 'clear',
          busSpeedKmh: 32,
          stopsRemaining: 5,
          distanceRemainingKm: 6.8,
        });
        showToast('Reset to Baseline Conditions');
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive ML Simulation Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1 flex items-center gap-2.5">
            <span>AI What-If Arrival Simulator</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
              Feature #15
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Tweak environmental variables in real time to observe how the AI prediction models adapt.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Scenarios:</span>
          <button
            onClick={() => applyPreset('college_rush')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            🎓 College Rush
          </button>
          <button
            onClick={() => applyPreset('monsoon')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            🌧️ Monsoon Storm
          </button>
          <button
            onClick={() => applyPreset('clear_night')}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-semibold border border-slate-700 transition-all"
          >
            🌙 Express Night
          </button>
          <button
            onClick={() => applyPreset('reset')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all"
            title="Reset variables"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Simulator Grid: Sliders on Left, Live Output HUD on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Interactive Variable Controls */}
        <div className={`lg:col-span-7 p-6 rounded-2xl border space-y-6 transition-all ${
          theme === 'dark' ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Simulation Input Parameters</span>
            </h3>
            <span className="text-xs text-slate-500">Live Reaction Loop Active</span>
          </div>

          {/* Variable 1: Traffic Condition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400" />
                <span>Corridor Traffic Density</span>
              </label>
              <span className="font-mono font-bold text-amber-400 uppercase">
                {whatIfInput.traffic}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'moderate', 'heavy', 'severe'] as TrafficLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setWhatIfInput((prev) => ({ ...prev, traffic: level }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    whatIfInput.traffic === level
                      ? level === 'severe'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-sm'
                        : level === 'heavy'
                        ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                        : level === 'moderate'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Variable 2: Passenger Load / Crowd */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Passenger Load & Dwell Demand</span>
              </label>
              <span className="font-mono font-bold text-indigo-400 capitalize">
                {whatIfInput.passengerLoad.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['low', 'medium', 'high', 'very_high'] as CrowdLevel[]).map((crowd) => (
                <button
                  key={crowd}
                  onClick={() => setWhatIfInput((prev) => ({ ...prev, passengerLoad: crowd }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    whatIfInput.passengerLoad === crowd
                      ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-400'
                  }`}
                >
                  {crowd.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Variable 3: Weather Condition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-2">
                <CloudRain className="w-4 h-4 text-blue-400" />
                <span>Weather Conditions</span>
              </label>
              <span className="font-mono font-bold text-blue-400 capitalize">
                {whatIfInput.weather.replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {(['clear', 'cloudy', 'rain', 'heavy_rain'] as WeatherCondition[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setWhatIfInput((prev) => ({ ...prev, weather: w }))}
                  className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                    whatIfInput.weather === w
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-sm'
                      : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/60 text-slate-400'
                  }`}
                >
                  {w.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Variable 4: Bus Speed Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Average Bus Corridor Speed</span>
              </label>
              <span className="font-mono font-bold text-cyan-400">
                {whatIfInput.busSpeedKmh} km/h
              </span>
            </div>
            <input
              type="range"
              min="15"
              max="60"
              step="1"
              value={whatIfInput.busSpeedKmh}
              onChange={(e) =>
                setWhatIfInput((prev) => ({ ...prev, busSpeedKmh: parseInt(e.target.value) }))
              }
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>15 km/h (Chokepoint)</span>
              <span>35 km/h (Nominal)</span>
              <span>60 km/h (Expressway)</span>
            </div>
          </div>

          {/* Variable 5: Number of Remaining Stops */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-300 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Number of Stops Remaining</span>
              </label>
              <span className="font-mono font-bold text-emerald-400">
                {whatIfInput.stopsRemaining} stops
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={whatIfInput.stopsRemaining}
              onChange={(e) =>
                setWhatIfInput((prev) => ({ ...prev, stopsRemaining: parseInt(e.target.value) }))
              }
              className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 stop (Immediate)</span>
              <span>6 stops (Midway)</span>
              <span>12 stops (Terminus)</span>
            </div>
          </div>

        </div>

        {/* Right 5 Columns: Dynamic Prediction Outcome */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Output KPI Card */}
          <div className={`p-6 rounded-2xl border transition-all ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-cyan-950/40 via-slate-900/95 to-slate-950 border-cyan-500/40 shadow-2xl'
              : 'bg-white border-cyan-200 shadow-md'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Predicted Outcome
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Dynamic Recalculation
              </span>
            </div>

            {/* Prediction Delta Hero */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="text-xs text-slate-400">New AI Predicted ETA</div>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono mt-0.5">
                  {whatIfOutput.predictedEtaMin}{' '}
                  <span className="text-lg font-normal text-cyan-400">min</span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">Baseline vs New Delta</div>
                <div className={`text-2xl font-black font-mono flex items-center justify-end gap-1 mt-0.5 ${
                  etaDelta > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  <TrendingUp className="w-4 h-4" />
                  {etaDelta > 0 ? `+${etaDelta}` : `${etaDelta}`} min
                </div>
              </div>
            </div>

            {/* Confidence Interval (Unique Feature #26 in Simulator) */}
            <div className="mt-5 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Confidence Range:</span>
                <span className="font-mono font-bold text-cyan-300">
                  {whatIfOutput.predictedEtaMin} ± {whatIfOutput.confidenceRangeMin} min
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Model Confidence:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {whatIfOutput.confidencePercent}%
                </span>
              </div>
            </div>

            {/* Factors Delta Breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Marginal Delay Contribution:
              </span>
              <div className="flex justify-between text-slate-300">
                <span>Traffic Congestion:</span>
                <span className="font-mono font-bold text-amber-400">
                  +{whatIfOutput.factors.trafficDelta} min
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Passenger Boarding Dwell:</span>
                <span className="font-mono font-bold text-indigo-400">
                  +{whatIfOutput.factors.passengerDelta} min
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Weather Friction Delay:</span>
                <span className="font-mono font-bold text-blue-400">
                  +{whatIfOutput.factors.weatherDelta} min
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Stops Acceleration Deceleration:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{whatIfOutput.factors.stopDelayDelta} min
                </span>
              </div>
            </div>

          </div>

          {/* Section 15 Example Callout Box */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>How the What-If Simulator Works</span>
            </div>
            <p>
              By adjusting traffic from Moderate to Heavy or modifying dwell times, the underlying ML regression weights dynamically recalibrate the expected corridor transit curve in sub-millisecond real time.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
