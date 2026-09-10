import React, { useState, useRef, useMemo } from 'react';
import { useTransit } from '../context/TransitContext';
import {
  Bus,
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Navigation,
  Car,
  AlertCircle,
  Radio,
  Sparkles,
  Compass,
  Info,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { BusTelemetry, BusStop, TransitRoute } from '../types';
import { BusDetailModal } from './BusDetailModal';

export const LiveTransitMap: React.FC = () => {
  const {
    buses,
    stops,
    routes,
    selectedBus,
    setSelectedBusId,
    selectedRouteId,
    setSelectedRouteId,
    theme
  } = useTransit();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTrafficLayer, setShowTrafficLayer] = useState<boolean>(true);
  const [showStopsLayer, setShowStopsLayer] = useState<boolean>(true);
  const [showRoutesLayer, setShowRoutesLayer] = useState<boolean>(true);
  const [hoveredBus, setHoveredBus] = useState<BusTelemetry | null>(null);
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);
  const [modalBus, setModalBus] = useState<BusTelemetry | null>(null);

  // Map geographic bounding box for Coimbatore Smart Corridor
  // Min Lat: 10.92, Max Lat: 11.10
  // Min Lng: 76.85, Max Lng: 77.06
  const bounds = {
    minLat: 10.92,
    maxLat: 11.10,
    minLng: 76.85,
    maxLng: 77.06,
  };

  // Convert GPS (lat, lng) to SVG Canvas percentage (x, y)
  const projectCoordinates = (lat: number, lng: number) => {
    // Normalizing between bounds
    const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 880 + 60;
    // Invert lat because SVG Y grows downwards
    const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 580 + 50;
    return { x, y };
  };

  // Filtered routes if a specific route is selected
  const displayRoutes = useMemo(() => {
    if (!selectedRouteId || selectedRouteId === 'all') return routes;
    return routes.filter((r) => r.id === selectedRouteId);
  }, [routes, selectedRouteId]);

  // Filtered buses based on route
  const displayBuses = useMemo(() => {
    if (!selectedRouteId || selectedRouteId === 'all') return buses;
    return buses.filter((b) => b.routeId === selectedRouteId);
  }, [buses, selectedRouteId]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
      
      {/* Map Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Interactive GPS Telemetry Radar
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-0.5 flex items-center gap-2">
            <span>Live Transit & Congestion Map</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              {displayBuses.length} Active Vehicles
            </span>
          </h1>
        </div>

        {/* Route Selector & Layer Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedRouteId || 'all'}
            onChange={(e) => setSelectedRouteId(e.target.value === 'all' ? null : e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Transit Corridors ({routes.length})</option>
            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                Route {r.routeNumber} ({r.from.split(' ')[0]} → {r.to.split(' ')[0]})
              </option>
            ))}
          </select>

          {/* Traffic Toggle */}
          <button
            onClick={() => setShowTrafficLayer(!showTrafficLayer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all font-semibold ${
              showTrafficLayer
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Traffic</span>
          </button>

          {/* Bus Stops Toggle */}
          <button
            onClick={() => setShowStopsLayer(!showStopsLayer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all font-semibold ${
              showStopsLayer
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Stops</span>
          </button>

          {/* Routes Toggle */}
          <button
            onClick={() => setShowRoutesLayer(!showRoutesLayer)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all font-semibold ${
              showRoutesLayer
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Corridors</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800 rounded-xl border border-slate-700 p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.15))}
              className="p-1 text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="px-1 font-mono text-[10px] text-slate-400 font-bold">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.15))}
              className="p-1 text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className={`relative w-full rounded-2xl border overflow-hidden transition-all select-none shadow-2xl ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-200'
      }`}>
        
        {/* Floating Active Bus HUD Card */}
        {selectedBus && (
          <div className="absolute top-4 left-4 z-20 max-w-xs sm:max-w-sm p-3.5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs animate-in fade-in-50">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 text-white font-black text-sm flex items-center justify-center">
                  {selectedBus.busNumber}
                </div>
                <div>
                  <div className="font-bold text-slate-100">{selectedBus.routeName}</div>
                  <div className="text-[11px] text-cyan-400 font-semibold">→ {selectedBus.destination}</div>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-base font-black text-cyan-400">{selectedBus.predictedArrivalMins}m</div>
                <div className="text-[10px] text-slate-400">±{selectedBus.confidenceIntervalMin}m ({selectedBus.confidencePercent}%)</div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-800 text-[11px] grid grid-cols-2 gap-1.5 text-slate-300">
              <div>Next: <span className="font-semibold text-cyan-300">{selectedBus.nextStopName}</span></div>
              <div>Velocity: <span className="font-semibold text-white">{selectedBus.speedKmh} km/h</span></div>
            </div>

            <div className="mt-2.5 flex items-center justify-between pt-1">
              <button
                onClick={() => setModalBus(selectedBus)}
                className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Complete Route & Telemetry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute bottom-4 right-4 z-20 p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg text-[11px] text-slate-300 space-y-1.5 hidden md:block">
          <div className="font-bold text-slate-200 text-xs mb-1">Transit Overlay Legend</div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
            <span>Active Bus (Live GPS)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Heavy Congestion Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Moderate Traffic Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full border border-slate-400 bg-slate-700" />
            <span>Bus Stop Node</span>
          </div>
        </div>

        {/* SVG Interactive Map Area */}
        <div className="w-full overflow-auto max-h-[640px] flex items-center justify-center p-2 bg-radial from-slate-900 to-slate-950">
          <svg
            viewBox="0 0 1000 680"
            className="w-full h-auto min-w-[750px] transition-transform duration-300 ease-out"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
              </pattern>
              
              {/* Radial glow for selected bus */}
              <radialGradient id="busGlow">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>

              {/* Congestion Hotspot Gradients */}
              <radialGradient id="heavyTrafficGlow">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#f43f5e" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="moderateTrafficGlow">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="80%" stopColor="#f59e0b" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid Canvas */}
            <rect width="1000" height="680" fill="url(#grid)" />

            {/* Water Bodies & Natural Landmarks (Kurichi Lake & Noyyal River Channel) */}
            <path
              d="M 50 480 Q 200 460, 420 440 T 750 430 T 950 410"
              fill="none"
              stroke="#0f3460"
              strokeWidth="12"
              opacity="0.3"
              strokeLinecap="round"
            />
            {/* Kurichi Lake */}
            <ellipse cx="440" cy="460" rx="42" ry="24" fill="#0d2b45" opacity="0.4" />
            <text x="440" y="465" fill="#38bdf8" opacity="0.4" fontSize="10" textAnchor="middle" fontWeight="bold">
              Kurichi Lake
            </text>

            {/* Western Ghats Foothills Accent on West Edge */}
            <path
              d="M 20 60 Q 60 180, 40 320 T 70 560"
              fill="none"
              stroke="#1e293b"
              strokeWidth="24"
              opacity="0.25"
            />
            <text x="50" y="120" fill="#64748b" opacity="0.4" fontSize="11" fontWeight="bold">
              Western Ghats Corridor
            </text>

            {/* TRAFFIC CONGESTION HEATMAP ZONES (Section 8 & 12 requirement) */}
            {showTrafficLayer && (
              <g className="traffic-zones animate-pulse duration-1000">
                {/* Ukkadam Chokepoint (Heavy Traffic) */}
                <circle cx="410" cy="380" r="65" fill="url(#heavyTrafficGlow)" />
                <text x="410" y="375" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">
                  ⚠ Ukkadam Heavy Congestion (+4.8m)
                </text>

                {/* Town Hall Bazaar (Severe) */}
                <circle cx="430" cy="330" r="50" fill="url(#heavyTrafficGlow)" />

                {/* Gandhipuram Crosscut (Moderate) */}
                <circle cx="450" cy="220" r="55" fill="url(#moderateTrafficGlow)" />
                <text x="450" y="215" fill="#f59e0b" fontSize="9" fontWeight="bold" textAnchor="middle">
                  Gandhipuram Moderate (+2.2m)
                </text>

                {/* Sundarapuram Industrial Belt */}
                <circle cx="460" cy="510" r="45" fill="url(#heavyTrafficGlow)" />
              </g>
            )}

            {/* TRANSIT CORRIDOR ROUTES (Polylines) */}
            {showRoutesLayer &&
              displayRoutes.map((route) => {
                const points = route.stops
                  .map((s) => {
                    const stopObj = stops.find((st) => st.id === s.stopId);
                    if (!stopObj) return null;
                    const coords = projectCoordinates(stopObj.lat, stopObj.lng);
                    return `${coords.x},${coords.y}`;
                  })
                  .filter(Boolean)
                  .join(' ');

                const isSelected = selectedRouteId === route.id;

                return (
                  <g key={route.id} className="route-path">
                    {/* Shadow halo */}
                    <polyline
                      points={points}
                      fill="none"
                      stroke={route.color}
                      strokeWidth={isSelected ? 6 : 3}
                      strokeOpacity={isSelected ? 0.8 : 0.35}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Inner dash flow */}
                    <polyline
                      points={points}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth={isSelected ? 2 : 1}
                      strokeOpacity={isSelected ? 0.8 : 0.4}
                      strokeDasharray="4,8"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

            {/* BUS STOPS NODES */}
            {showStopsLayer &&
              stops.map((stop) => {
                const { x, y } = projectCoordinates(stop.lat, stop.lng);
                const isHovered = hoveredStop?.id === stop.id;

                return (
                  <g
                    key={stop.id}
                    className="cursor-pointer group"
                    onMouseEnter={() => setHoveredStop(stop)}
                    onMouseLeave={() => setHoveredStop(null)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? 6 : 3.5}
                      fill="#0f172a"
                      stroke="#38bdf8"
                      strokeWidth={isHovered ? 2.5 : 1.5}
                      className="transition-all"
                    />
                    {/* Stop Label on hover or major hubs */}
                    {(isHovered || ['stop-1', 'stop-7', 'stop-9', 'stop-12', 'stop-21'].includes(stop.id)) && (
                      <text
                        x={x + 8}
                        y={y + 3}
                        fill="#cbd5e1"
                        fontSize={isHovered ? 11 : 9}
                        fontWeight={isHovered ? 'bold' : 'normal'}
                        className="pointer-events-none drop-shadow-md"
                      >
                        {stop.name}
                      </text>
                    )}
                  </g>
                );
              })}

            {/* LIVE MOVING BUSES (Section 8: Marker with Bus Number, Speed, Destination, ETA) */}
            {displayBuses.map((bus) => {
              const { x, y } = projectCoordinates(bus.lat, bus.lng);
              const isSelected = selectedBus?.id === bus.id;
              const isHovered = hoveredBus?.id === bus.id;

              return (
                <g
                  key={bus.id}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedBusId(bus.id);
                    setModalBus(bus);
                  }}
                  onMouseEnter={() => setHoveredBus(bus)}
                  onMouseLeave={() => setHoveredBus(null)}
                >
                  {/* Pulsing beacon glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 26 : 18}
                    fill="url(#busGlow)"
                    className={isSelected ? 'animate-ping duration-1000 opacity-60' : 'opacity-40'}
                  />

                  {/* Outer ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 14 : 10}
                    fill={isSelected ? '#06b6d4' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="shadow-lg"
                  />

                  {/* Bus Icon */}
                  <circle cx={x} cy={y} r={isSelected ? 6 : 4} fill="#ffffff" />

                  {/* SECTION 8 MANDATED BUS MARKER CALLOUT HUD */}
                  {/* Show marker callout: "21A → Gandhipuram | ETA: 6 min | Speed: 32 km/h" */}
                  <g transform={`translate(${x + 14}, ${y - 20})`} className="pointer-events-none">
                    {/* Background bubble */}
                    <rect
                      x="0"
                      y="0"
                      width={isSelected ? 150 : 130}
                      height={isSelected ? 42 : 36}
                      rx="8"
                      fill="#090d16"
                      stroke={isSelected ? '#06b6d4' : '#334155'}
                      strokeWidth={isSelected ? 1.5 : 1}
                      fillOpacity="0.94"
                      className="drop-shadow-xl"
                    />

                    {/* Bus Number & Destination */}
                    <text x="8" y={isSelected ? 16 : 14} fill="#ffffff" fontSize={isSelected ? 11 : 10} fontWeight="bold">
                      {bus.busNumber} → {bus.destination}
                    </text>

                    {/* Speed & ETA */}
                    <text x="8" y={isSelected ? 32 : 28} fill="#22d3ee" fontSize={isSelected ? 10 : 9} fontWeight="bold">
                      ETA: {bus.predictedArrivalMins}m • {bus.speedKmh} km/h
                    </text>
                  </g>
                </g>
              );
            })}

            {/* User Location Radar Marker (e.g. Near Rathinam Tech Campus) */}
            <g transform="translate(420, 560)">
              <circle cx="0" cy="0" r="14" fill="#10b981" fillOpacity="0.2" className="animate-ping" />
              <circle cx="0" cy="0" r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
              <text x="10" y="4" fill="#34d399" fontSize="10" fontWeight="bold">
                User Location (Rathinam Campus)
              </text>
            </g>
          </svg>
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
