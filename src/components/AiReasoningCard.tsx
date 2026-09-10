import React from 'react';
import { PredictionReasoning, BusTelemetry } from '../types';
import { Brain, TrendingUp, TrendingDown, Users, Car, CloudRain, Clock, AlertTriangle, Sparkles } from 'lucide-react';
import { useTransit } from '../context/TransitContext';

interface AiReasoningCardProps {
  bus?: BusTelemetry;
  reasoning?: PredictionReasoning;
}

export const AiReasoningCard: React.FC<AiReasoningCardProps> = ({ bus, reasoning: customReasoning }) => {
  const { theme, selectedBus } = useTransit();
  const currentBus = bus || selectedBus;
  const reasoning = customReasoning || currentBus?.reasoning;

  if (!reasoning) return null;

  const factors = [
    {
      label: 'Corridor Traffic',
      value: reasoning.trafficFactorMins,
      icon: Car,
      description: 'Current vehicle flow & bottleneck speeds along arterial segments',
      color: reasoning.trafficFactorMins > 1.5 ? 'text-rose-400' : 'text-amber-400',
      barColor: reasoning.trafficFactorMins > 1.5 ? 'bg-rose-500' : 'bg-amber-500',
    },
    {
      label: 'Passenger Boarding',
      value: reasoning.passengerBoardingFactorMins,
      icon: Users,
      description: 'Dwell time delay from passenger boarding at upcoming campus/terminal stops',
      color: 'text-indigo-400',
      barColor: 'bg-indigo-500',
    },
    {
      label: 'Route Congestion',
      value: reasoning.routeCongestionFactorMins,
      icon: AlertTriangle,
      description: 'Chokepoints near intersections, flyover works & junction signals',
      color: 'text-orange-400',
      barColor: 'bg-orange-500',
    },
    {
      label: 'Weather Impact',
      value: reasoning.weatherFactorMins,
      icon: CloudRain,
      description: 'Precipitation, road surface friction, and rain-induced transit caution',
      color: 'text-blue-400',
      barColor: 'bg-blue-500',
    },
    {
      label: 'Historical Pattern',
      value: reasoning.historicalPatternFactorMins,
      icon: Clock,
      description: 'Recurring time-of-day offset learned from 420,000 historical trips',
      color: reasoning.historicalPatternFactorMins < 0 ? 'text-emerald-400' : 'text-slate-400',
      barColor: reasoning.historicalPatternFactorMins < 0 ? 'bg-emerald-500' : 'bg-slate-500',
    },
  ];

  const maxAbsValue = Math.max(...factors.map((f) => Math.abs(f.value)), 3.0);

  return (
    <div className={`p-5 rounded-2xl border transition-all ${
      theme === 'dark'
        ? 'bg-slate-900/80 border-slate-800/90 text-slate-100 shadow-xl'
        : 'bg-white border-slate-200 text-slate-900 shadow-md'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold tracking-tight">AI Explainability & Reasoning Engine</h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                SHAP Weights
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Why the AI predicted {currentBus ? `Bus ${currentBus.busNumber}` : 'Arrival'} at +{reasoning.totalDelayMins} min delay
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Net Predicted Delay</div>
          <div className="text-lg font-black text-rose-400 flex items-center justify-end gap-1">
            <TrendingUp className="w-4 h-4 text-rose-400" />
            +{reasoning.totalDelayMins} min
          </div>
        </div>
      </div>

      {/* Factor Breakdown List */}
      <div className="space-y-3">
        {factors.map((factor) => {
          const Icon = factor.icon;
          const isNegative = factor.value < 0;
          const percentage = Math.min(100, (Math.abs(factor.value) / maxAbsValue) * 100);

          return (
            <div key={factor.label} className="group">
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${factor.color}`} />
                  <span className="font-semibold text-slate-300">{factor.label}</span>
                  <span className="hidden sm:inline text-[11px] text-slate-500 truncate max-w-xs">
                    — {factor.description}
                  </span>
                </div>
                <div className={`font-mono font-bold ${factor.color}`}>
                  {factor.value >= 0 ? `+${factor.value.toFixed(1)}` : `${factor.value.toFixed(1)}`} min
                </div>
              </div>

              {/* Progress bar visualizer */}
              <div className="w-full bg-slate-800/80 h-2 rounded-full overflow-hidden flex">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${factor.barColor}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Natural Language Synthesis Footer */}
      <div className="mt-5 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200/90 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300">Model Synthesis: </span>
          <span>{reasoning.summaryExplanation}</span>
        </div>
      </div>
    </div>
  );
};
