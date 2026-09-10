import React, { useState, useMemo } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  Search,
  MapPin,
  Bus,
  ArrowRight,
  Clock,
  Gauge,
  Users,
  Car,
  TrendingUp,
  Sparkles,
  Footprints,
  Navigation,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  Star
} from 'lucide-react';
import { BusTelemetry } from '../types';
import { calculateJourneyBreakdown } from '../lib/aiPredictionEngine';
import { BusDetailModal } from './BusDetailModal';

export const BusSearch: React.FC = () => {
  const {
    buses,
    stops,
    routes,
    searchFrom,
    setSearchFrom,
    searchTo,
    setSearchTo,
    searchBusQuery,
    setSearchBusQuery,
    setSelectedBusId,
    setActiveTab,
    theme,
    addFavorite
  } = useTransit();

  const [selectedResultBus, setSelectedResultBus] = useState<BusTelemetry | null>(null);
  const [modalBus, setModalBus] = useState<BusTelemetry | null>(null);
  const [activeSuggestionFilter, setActiveSuggestionFilter] = useState<'all' | '21' | '12' | '8' | '70'>('all');

  // Smart suggestions when typing
  const matchingSuggestions = useMemo(() => {
    if (!searchBusQuery.trim()) return [];
    const q = searchBusQuery.toLowerCase();
    return buses.filter(
      (b) =>
        b.busNumber.toLowerCase().includes(q) ||
        b.destination.toLowerCase().includes(q) ||
        b.routeName.toLowerCase().includes(q) ||
        b.currentLocationName.toLowerCase().includes(q)
    );
  }, [buses, searchBusQuery]);

  // Results matching query or from/to
  const searchResults = useMemo(() => {
    return buses.filter((b) => {
      // If user typed a bus number query
      if (searchBusQuery.trim()) {
        const q = searchBusQuery.toLowerCase();
        return (
          b.busNumber.toLowerCase().includes(q) ||
          b.destination.toLowerCase().includes(q) ||
          b.routeName.toLowerCase().includes(q) ||
          b.currentLocationName.toLowerCase().includes(q)
        );
      }

      // If filtering by from/to
      if (searchFrom && searchTo) {
        const route = routes.find((r) => r.id === b.routeId);
        if (route) {
          const hasFrom = route.stops.some((s) => s.stopName.toLowerCase().includes(searchFrom.toLowerCase()));
          const hasTo = route.stops.some((s) => s.stopName.toLowerCase().includes(searchTo.toLowerCase()));
          if (hasFrom && hasTo) return true;
        }
      }

      return true;
    });
  }, [buses, routes, searchBusQuery, searchFrom, searchTo]);

  // Selected bus for deep journey calculation (defaults to first result or 21A)
  const activeBus = selectedResultBus || searchResults[0] || buses[0];

  // SECTION 28 UNIQUE FEATURE: COMPLETE PASSENGER JOURNEY PREDICTION
  const journeyBreakdown = useMemo(() => {
    return calculateJourneyBreakdown(
      searchFrom || 'Rathinam Tech Campus',
      searchTo || 'Gandhipuram Central Stand',
      activeBus.busNumber,
      activeBus.predictedArrivalMins,
      24
    );
  }, [searchFrom, searchTo, activeBus]);

  const handleSwapStops = () => {
    const temp = searchFrom;
    setSearchFrom(searchTo);
    setSearchTo(temp);
  };

  const handleSelectPreFill = (from: string, to: string, busNo: string) => {
    setSearchFrom(from);
    setSearchTo(to);
    setSearchBusQuery(busNo);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Intelligent Transit Navigation
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
          Predictive Bus & Journey Search
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
          Find any bus, corridor stop, or door-to-door itinerary with instant AI arrival estimates.
        </p>
      </div>

      {/* Main Search Box */}
      <div className={`p-5 sm:p-6 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-slate-900/90 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          
          {/* Origin Stop */}
          <div className="md:col-span-4 relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>Starting Location / Stop</span>
            </label>
            <input
              type="text"
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              placeholder="e.g. Rathinam Tech Campus"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
            />
          </div>

          {/* Swap Button (desktop) */}
          <div className="hidden md:flex md:col-span-1 items-end justify-center pb-1">
            <button
              onClick={handleSwapStops}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 transition-all"
              title="Swap Origin and Destination"
            >
              ⇄
            </button>
          </div>

          {/* Destination Stop */}
          <div className="md:col-span-4 relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-blue-400" />
              <span>Destination</span>
            </label>
            <input
              type="text"
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              placeholder="e.g. Gandhipuram Central Stand"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Bus Number Quick Query */}
          <div className="md:col-span-3 relative">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 flex items-center gap-1.5">
              <Bus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bus Number (Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchBusQuery}
                onChange={(e) => setSearchBusQuery(e.target.value)}
                placeholder="e.g. 21A, 12B, 8C"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Section 22 Typeahead suggestions list when typing bus number */}
        {matchingSuggestions.length > 0 && searchBusQuery.trim().length > 0 && (
          <div className="mt-3 p-3 rounded-xl bg-slate-800/90 border border-slate-700/80 animate-in fade-in-50">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Instant Predictive Suggestions:
            </div>
            <div className="flex flex-wrap gap-2">
              {matchingSuggestions.slice(0, 5).map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSearchBusQuery(s.busNumber);
                    setSelectedResultBus(s);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Bus className="w-3.5 h-3.5" />
                  <span>{s.busNumber}</span>
                  <span className="text-slate-400 font-normal">→ {s.destination}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular Route Pre-fills for Demo Presentation */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Try Popular Demo Searches:</span>
          <button
            onClick={() => handleSelectPreFill('Rathinam Tech Campus', 'Gandhipuram Central Stand', '21A')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Rathinam → Gandhipuram (21A)
          </button>
          <button
            onClick={() => handleSelectPreFill('Gandhipuram Central Stand', 'Coimbatore Airport Terminal', '12B')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Gandhipuram → Airport (12B)
          </button>
          <button
            onClick={() => handleSelectPreFill('Rathinam Tech Campus', 'Coimbatore Railway Station', '8C')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Rathinam → Railway Station (8C)
          </button>
        </div>
      </div>

      {/* SECTION 28 UNIQUE FEATURE: PASSENGER JOURNEY PREDICTION CARD */}
      <div className={`p-5 rounded-2xl border transition-all ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-cyan-950/30 via-slate-900/90 to-blue-950/30 border-cyan-500/40 shadow-xl'
          : 'bg-white border-cyan-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Unique Feature
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30">
                End-to-End Passenger Journey Prediction
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-white mt-1">
              Your estimated complete journey time is {journeyBreakdown.totalJourneyMin} minutes.
            </h3>
            <p className="text-xs text-slate-400">
              Complete multi-modal door-to-door itinerary including walk, wait, and bus dwell times.
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Predicted Arrival</div>
            <div className="text-2xl font-black text-cyan-400 font-mono">
              {journeyBreakdown.arrivalTime}
            </div>
          </div>
        </div>

        {/* 4-Step Journey Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4">
          
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Footprints className="w-4 h-4 text-emerald-400" />
              <span>1. Walk to Stop</span>
            </div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {journeyBreakdown.walkToStopMin} min
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              350m to {journeyBreakdown.origin}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>2. Waiting at Stop</span>
            </div>
            <div className="text-xl font-black text-amber-400 mt-1">
              {journeyBreakdown.waitAtStopMin} min
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Bus {journeyBreakdown.busNumber} ETA
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bus className="w-4 h-4 text-cyan-400" />
              <span>3. Bus Journey</span>
            </div>
            <div className="text-xl font-black text-cyan-400 mt-1">
              {journeyBreakdown.busRideMin} min
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Transit corridor ride
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>4. Destination Walk</span>
            </div>
            <div className="text-xl font-black text-blue-400 mt-1">
              {journeyBreakdown.walkToDestMin} min
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              To {journeyBreakdown.destination}
            </p>
          </div>

        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <span>Door-to-door calculation incorporates real-time congestion and historical dwell statistics.</span>
          <button
            onClick={() => addFavorite({
              type: 'commute',
              title: `${journeyBreakdown.origin} → ${journeyBreakdown.destination}`,
              subtitle: `Via Bus ${activeBus.busNumber} (~${journeyBreakdown.totalJourneyMin}m)`,
              busNumber: activeBus.busNumber,
              origin: journeyBreakdown.origin,
              destination: journeyBreakdown.destination,
              nextArrivalMin: activeBus.predictedArrivalMins,
            })}
            className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
          >
            <Star className="w-3.5 h-3.5 text-amber-400" />
            <span>Save to Favorites</span>
          </button>
        </div>
      </div>

      {/* SECTION 5 MANDATED SEARCH RESULT DISPLAY */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Bus className="w-4 h-4 text-cyan-400" />
            <span>Matching Buses & Predictive Telemetry ({searchResults.length})</span>
          </h3>
          <span className="text-xs text-slate-400">Click any card to inspect complete telemetry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map((bus) => {
            const isSelected = bus.id === activeBus.id;

            return (
              <div
                key={bus.id}
                onClick={() => {
                  setSelectedResultBus(bus);
                  setSelectedBusId(bus.id);
                }}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/30 shadow-xl'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-slate-800'
                }`}
              >
                {/* Header: Bus Number & Estimated Arrival */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white font-black text-lg shadow-md shadow-cyan-600/20">
                      {bus.busNumber}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-100">{bus.routeName}</div>
                      <div className="text-xs text-cyan-400 font-semibold">
                        → {bus.destination}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-black text-cyan-400 font-mono">
                      {bus.predictedArrivalMins} <span className="text-xs text-slate-400 font-normal">min</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ±{bus.confidenceIntervalMin}m ({bus.confidencePercent}%)
                    </div>
                  </div>
                </div>

                {/* Section 5 Mandated Fields Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Current Location</span>
                    <span className="font-semibold text-slate-200 truncate block mt-0.5">
                      {bus.currentLocationName}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Next Stop</span>
                    <span className="font-semibold text-cyan-400 truncate block mt-0.5">
                      {bus.nextStopName}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Speed & Distance</span>
                    <span className="font-semibold text-slate-200 block mt-0.5">
                      {bus.speedKmh} km/h • 4.2 km rem.
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                    <span className="text-[10px] text-slate-400 block">Traffic & Crowd</span>
                    <span className="font-semibold text-amber-300 capitalize block mt-0.5">
                      {bus.reasoning.trafficFactorMins > 2 ? 'Heavy' : 'Moderate'} • {bus.passengerDensity}
                    </span>
                  </div>
                </div>

                {/* Delay & Prediction Confidence */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Delay:</span>
                    <span className={`font-bold ${bus.delayMins > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {bus.delayMins > 0 ? `+${bus.delayMins} min` : '0 min'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalBus(bus);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Inspect Timeline</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
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
