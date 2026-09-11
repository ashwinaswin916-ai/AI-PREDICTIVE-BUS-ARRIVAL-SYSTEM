import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  BusTelemetry,
  TransitRoute,
  BusStop,
  SystemAlert,
  FavoriteItem,
  WhatIfSimulationInput,
  WhatIfSimulationOutput,
  TrafficLevel,
  CrowdLevel,
  WeatherCondition
} from '../types';
import {
  INITIAL_BUSES,
  TRANSIT_ROUTES,
  BUS_STOPS,
  INITIAL_ALERTS,
  INITIAL_FAVORITES,
  SAMPLE_ROUTE_COMPARISONS
} from '../data/transitData';
import { runWhatIfSimulation, calculateArrivalPrediction } from '../lib/aiPredictionEngine';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'search'
  | 'map'
  | 'predictions'
  | 'routes'
  | 'analytics'
  | 'history'
  | 'simulator'
  | 'alerts'
  | 'favorites'
  | 'admin'
  | 'validation'
  | 'audit'
  | 'pipeline'
  | 'pathway';

interface TransitContextType {
  buses: BusTelemetry[];
  routes: TransitRoute[];
  stops: BusStop[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedBusId: string;
  setSelectedBusId: (id: string) => void;
  selectedBus: BusTelemetry | undefined;
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  toggleDemoMode: () => void;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  setPresentationMode: (val: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  alerts: SystemAlert[];
  dismissAlert: (id: string) => void;
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id'>) => void;
  removeFavorite: (id: string) => void;
  whatIfInput: WhatIfSimulationInput;
  setWhatIfInput: React.Dispatch<React.SetStateAction<WhatIfSimulationInput>>;
  whatIfOutput: WhatIfSimulationOutput;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  searchFrom: string;
  setSearchFrom: (val: string) => void;
  searchTo: string;
  setSearchTo: (val: string) => void;
  searchBusQuery: string;
  setSearchBusQuery: (val: string) => void;
  triggerSimulatedDelay: (busId: string, addedMinutes: number) => void;
  resetAllSimulations: () => void;
}

const TransitContext = createContext<TransitContextType | undefined>(undefined);

export const TransitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [buses, setBuses] = useState<BusTelemetry[]>(INITIAL_BUSES);
  const [routes] = useState<TransitRoute[]>(TRANSIT_ROUTES);
  const [stops] = useState<BusStop[]>(BUS_STOPS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedBusId, setSelectedBusId] = useState<string>('bus-21a-1');
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-21a');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [alerts, setAlerts] = useState<SystemAlert[]>(INITIAL_ALERTS);
  const [favorites, setFavorites] = useState<FavoriteItem[]>(INITIAL_FAVORITES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search States
  const [searchFrom, setSearchFrom] = useState<string>('Rathinam Tech Campus');
  const [searchTo, setSearchTo] = useState<string>('Gandhipuram Central Stand');
  const [searchBusQuery, setSearchBusQuery] = useState<string>('');

  // What-If Simulation State
  const [whatIfInput, setWhatIfInput] = useState<WhatIfSimulationInput>({
    traffic: 'moderate',
    passengerLoad: 'medium',
    weather: 'clear',
    busSpeedKmh: 32,
    stopsRemaining: 5,
    distanceRemainingKm: 6.8,
  });

  const [whatIfOutput, setWhatIfOutput] = useState<WhatIfSimulationOutput>(() =>
    runWhatIfSimulation({
      traffic: 'moderate',
      passengerLoad: 'medium',
      weather: 'clear',
      busSpeedKmh: 32,
      stopsRemaining: 5,
      distanceRemainingKm: 6.8,
    })
  );

  // Re-run what-if on input change
  useEffect(() => {
    setWhatIfOutput(runWhatIfSimulation(whatIfInput));
  }, [whatIfInput]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => {
      const next = !prev;
      showToast(next ? '⚡ Live Demo Simulation Activated' : '⏸ Simulation Paused');
      return next;
    });
  }, [showToast]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id'>) => {
    const newItem: FavoriteItem = {
      ...item,
      id: `fav-${Date.now()}`,
    };
    setFavorites((prev) => [newItem, ...prev]);
    showToast(`⭐ Saved "${item.title}" to Favorites`);
  }, [showToast]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    showToast('Removed from Favorites');
  }, [showToast]);

  const triggerSimulatedDelay = useCallback((busId: string, addedMinutes: number) => {
    setBuses((prev) =>
      prev.map((b) => {
        if (b.id === busId) {
          const newDelay = Math.max(0, b.delayMins + addedMinutes);
          const newPredicted = Math.max(1, b.scheduledArrivalMins + newDelay);
          return {
            ...b,
            delayMins: newDelay,
            predictedArrivalMins: newPredicted,
            status: newDelay > 2 ? 'delayed' : 'on_time',
            earlyWarning:
              newDelay >= 4
                ? {
                    active: true,
                    title: 'Traffic Chokepoint Spike',
                    description: `Impending slowdown: AI models detected +${newDelay} min surge on current link.`,
                    predictedDelayMins: newDelay,
                    withinNextMins: 12,
                  }
                : b.earlyWarning,
            reasoning: {
              ...b.reasoning,
              trafficFactorMins: Math.round((b.reasoning.trafficFactorMins + addedMinutes * 0.6) * 10) / 10,
              totalDelayMins: newDelay,
              summaryExplanation: `Simulated congestion event added +${addedMinutes} min to arrival timeline.`,
            },
          };
        }
        return b;
      })
    );
    showToast(`⚡ Simulation Event: Bus delay updated by +${addedMinutes} min`);
  }, [showToast]);

  const resetAllSimulations = useCallback(() => {
    setBuses(INITIAL_BUSES);
    showToast('System Telemetry Reset to Default Schedule');
  }, [showToast]);

  // LIVE DEMO SIMULATION TICK ENGINE:
  // Updates bus positions, speeds, occupancy, and arrival counters subtly every 3.5s
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          // Micro fluctuations in speed (±2 km/h)
          const speedDelta = (Math.random() - 0.48) * 3;
          const newSpeed = Math.max(16, Math.min(54, Math.round(bus.speedKmh + speedDelta)));

          // Coordinate movement: tiny step along bearing
          const latStep = (Math.random() - 0.48) * 0.0004;
          const lngStep = (Math.random() - 0.48) * 0.0004;

          // Battery/Fuel consumption (very slow decrease)
          const fuelDelta = Math.random() < 0.2 ? -0.1 : 0;
          const newFuel = Math.max(15, Math.round((bus.batteryOrFuelPercent + fuelDelta) * 10) / 10);

          // Random slight ETA decay/adjustment
          let newPredictedArrival = bus.predictedArrivalMins;
          if (Math.random() < 0.25) {
            // Once in a while, minute ticks down or updates based on speed
            if (newSpeed < 20 && bus.predictedArrivalMins < 45) {
              newPredictedArrival = Math.min(45, bus.predictedArrivalMins + 1);
            } else if (newSpeed > 35 && bus.predictedArrivalMins > 2) {
              newPredictedArrival = Math.max(1, bus.predictedArrivalMins - 1);
            }
          }

          return {
            ...bus,
            speedKmh: newSpeed,
            lat: bus.lat + latStep,
            lng: bus.lng + lngStep,
            batteryOrFuelPercent: newFuel,
            predictedArrivalMins: newPredictedArrival,
          };
        })
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  const selectedBus = buses.find((b) => b.id === selectedBusId) || buses[0];

  return (
    <TransitContext.Provider
      value={{
        buses,
        routes,
        stops,
        activeTab,
        setActiveTab,
        selectedBusId,
        setSelectedBusId,
        selectedBus,
        selectedRouteId,
        setSelectedRouteId,
        isDemoMode,
        setIsDemoMode,
        toggleDemoMode,
        isPresentationMode,
        setIsPresentationMode,
        setPresentationMode: setIsPresentationMode,
        theme,
        toggleTheme,
        alerts,
        dismissAlert,
        favorites,
        addFavorite,
        removeFavorite,
        whatIfInput,
        setWhatIfInput,
        whatIfOutput,
        toastMessage,
        showToast,
        searchFrom,
        setSearchFrom,
        searchTo,
        setSearchTo,
        searchBusQuery,
        setSearchBusQuery,
        triggerSimulatedDelay,
        resetAllSimulations,
      }}
    >
      {children}
    </TransitContext.Provider>
  );
};

export const useTransit = () => {
  const context = useContext(TransitContext);
  if (!context) {
    throw new Error('useTransit must be used within a TransitProvider');
  }
  return context;
};
