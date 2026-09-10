import React, { useState, useEffect } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  X,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Bus,
  Car,
  Clock,
  Brain,
  Users,
  Route,
  Navigation,
  CheckCircle2,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PresentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DemoStep {
  step: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  highlightData: { label: string; value: string; color?: string }[];
  narration: string;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ isOpen, onClose }) => {
  const { theme, setActiveTab, setSelectedBusId, buses } = useTransit();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps: DemoStep[] = [
    {
      step: 1,
      title: 'Real-Time User Entry & Corridor Detection',
      subtitle: 'Commuter requests bus arrival at Rathinam Tech Campus',
      icon: Navigation,
      description: 'The commuter opens the AI Predictive Bus Arrival application. The platform immediately links to local transit coordinate streams.',
      highlightData: [
        { label: 'Origin Stop', value: 'Rathinam Tech Campus', color: 'text-cyan-400' },
        { label: 'Target Line', value: 'Route 21A Express', color: 'text-white' },
        { label: 'Device Status', value: 'GPS Sync Active', color: 'text-emerald-400' }
      ],
      narration: 'The system instantly establishes real-time corridor monitoring for the commuter.',
    },
    {
      step: 2,
      title: 'Real-Time Telemetry & Breadcrumb Triangulation',
      subtitle: 'Bus 21A transponder located at Eachanari Junction',
      icon: Bus,
      description: 'Instead of relying on rigid static schedules, high-frequency simulated breadcrumbs stream velocity (32 km/h) and heading.',
      highlightData: [
        { label: 'Bus ID', value: 'TN-38-N-2101 (21A)', color: 'text-cyan-400' },
        { label: 'Current Velocity', value: '32 km/h', color: 'text-blue-400' },
        { label: 'Distance Remaining', value: '4.2 km', color: 'text-white' }
      ],
      narration: 'Live velocity and GPS positions replace outdated printed timetables.',
    },
    {
      step: 3,
      title: 'Multi-Modal Traffic & Corridor Congestion Analysis',
      subtitle: 'AI evaluates downstream choke-points along Pollachi Main Road',
      icon: Car,
      description: 'Computer vision feeds and arterial velocity sensors register moderate traffic at Kurichi with an emerging slow-down near Ukkadam.',
      highlightData: [
        { label: 'Segment Velocity', value: '26 km/h', color: 'text-amber-400' },
        { label: 'Congestion Penalty', value: '+2.5 minutes', color: 'text-rose-400' },
        { label: 'Corridor Flow', value: 'Moderate Friction', color: 'text-amber-300' }
      ],
      narration: 'Traffic delays are calculated dynamically ahead of time.',
    },
    {
      step: 4,
      title: 'Ensemble Machine Learning Prediction',
      subtitle: 'LSTM + Gradient Boosted Regressor computes arrival: 7 min',
      icon: Sparkles,
      description: 'The neural regression ensemble fuses historical temporal curves, current velocity, and day-of-week multipliers to forecast arrival.',
      highlightData: [
        { label: 'AI Predicted ETA', value: '7 minutes', color: 'text-cyan-400' },
        { label: 'Confidence Interval', value: '7 ± 1 min (94%)', color: 'text-emerald-400' },
        { label: 'Target Window', value: '6 to 8 minutes', color: 'text-white' }
      ],
      narration: 'The commuter sees exact arrival minutes with an empirical 94% confidence window.',
    },
    {
      step: 5,
      title: 'Transparent AI Explainability & Factor Attribution',
      subtitle: 'SHAP decomposition explains why the bus is delayed by 4.4 minutes',
      icon: Brain,
      description: 'No black-box mystery. The system outputs an explainable breakdown: Traffic +2.5m, Passenger Boarding +0.8m, Junction Congestion +1.2m, Offset -0.4m.',
      highlightData: [
        { label: 'Traffic Impact', value: '+2.5 min', color: 'text-rose-400' },
        { label: 'Dwell Time', value: '+0.8 min', color: 'text-indigo-400' },
        { label: 'Historical Pattern', value: '-0.4 min', color: 'text-emerald-400' }
      ],
      narration: 'Commuters trust the system because it explains exactly why delays occur.',
    },
    {
      step: 6,
      title: 'Passenger Crowd & Seat Availability Prediction',
      subtitle: 'Estimates 52% occupancy: Seats available in middle rows',
      icon: Users,
      description: 'Historical boarding count telemetry predicts whether passengers will find a comfortable seat or face a standing-only rush.',
      highlightData: [
        { label: 'Crowd Level', value: 'Medium (52%)', color: 'text-indigo-300' },
        { label: 'Seat Status', value: 'Window Seats Open', color: 'text-emerald-400' },
        { label: 'Advice', value: 'Board without rush', color: 'text-cyan-400' }
      ],
      narration: 'Commuters know crowd density before stepping onto the platform.',
    },
    {
      step: 7,
      title: 'Smart Alternative Route Recommendation',
      subtitle: 'Recommends Bus 21A as optimal; highlights 12B as backup',
      icon: Route,
      description: 'The multi-criteria recommendation engine compares all transit alternatives in real-time, pointing out trade-offs in crowd and arrival.',
      highlightData: [
        { label: 'Recommended', value: 'Bus 21A (Fastest)', color: 'text-emerald-400' },
        { label: 'Backup Alternative', value: 'Bus 12B in 14m', color: 'text-slate-300' },
        { label: 'Time Saved', value: '6 min faster', color: 'text-cyan-400' }
      ],
      narration: 'Saves valuable minutes by proactively suggesting faster routes.',
    },
    {
      step: 8,
      title: 'End-to-End Multi-Modal Journey Estimate',
      subtitle: 'Total door-to-door journey: 39 minutes to Gandhipuram Stand',
      icon: Award,
      description: 'Calculates the entire journey pipeline: 5m walk to stop + 7m wait + 24m bus ride + 3m destination walk = 39 minutes total.',
      highlightData: [
        { label: 'Total Journey', value: '39 minutes', color: 'text-cyan-400' },
        { label: 'Estimated Arrival', value: '08:44 AM', color: 'text-white' },
        { label: 'System Validation', value: '94.8% Accuracy', color: 'text-emerald-400' }
      ],
      narration: 'Complete door-to-door arrival predictability solved end-to-end!',
    }
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          // Trigger confetti on finish
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
          setIsPlaying(false);
          return prev;
        }
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, steps.length]);

  if (!isOpen) return null;

  const currentStep = steps[currentStepIndex];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in-50">
      <div className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden transition-all ${
        theme === 'dark'
          ? 'bg-slate-900 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                  Interactive Demo Mode
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  Step {currentStep.step} of {steps.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                AI Prediction Pipeline Walkthrough
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title={isPlaying ? 'Pause Auto-Walkthrough' : 'Play Auto-Walkthrough'}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stepper Progress Bar */}
        <div className="w-full bg-slate-800/80 h-1.5 flex">
          {steps.map((s, idx) => (
            <div
              key={s.step}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex-1 h-full cursor-pointer transition-all duration-300 ${
                idx <= currentStepIndex ? 'bg-cyan-500' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Step Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 shrink-0">
              <StepIcon className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {currentStep.title}
              </h3>
              <p className="text-sm font-semibold text-cyan-400 mt-1">
                {currentStep.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Highlights KPI Matrix for This Step */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {currentStep.highlightData.map((h) => (
              <div key={h.label} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">{h.label}</span>
                <span className={`text-base sm:text-lg font-black mt-0.5 block ${h.color || 'text-white'}`}>
                  {h.value}
                </span>
              </div>
            ))}
          </div>

          {/* Presentation Narration Box */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">Presenter Commentary: </span>
              <span>"{currentStep.narration}"</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-t border-slate-800 bg-slate-950/80">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          {/* Step circles */}
          <div className="hidden sm:flex items-center gap-1.5">
            {steps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setCurrentStepIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-cyan-400 w-6'
                    : idx < currentStepIndex
                    ? 'bg-cyan-600'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <span>{currentStepIndex === steps.length - 1 ? 'Finish & Celebrate' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
