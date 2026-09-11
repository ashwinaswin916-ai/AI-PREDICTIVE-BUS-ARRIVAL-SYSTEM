export type TrafficLevel = 'low' | 'moderate' | 'heavy' | 'severe';
export type CrowdLevel = 'low' | 'medium' | 'high' | 'very_high';
export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'heavy_rain';
export type BusStatus = 'on_time' | 'delayed' | 'early' | 'holding';

export interface BusStop {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  zone: string;
  hasShelter: boolean;
  averageBoardingDelayMin: number;
}

export interface RouteStop {
  stopId: string;
  stopName: string;
  scheduledTime: string; // e.g. "10:30 AM"
  distanceFromStartKm: number;
  order: number;
}

export interface TransitRoute {
  id: string;
  routeNumber: string;
  name: string;
  from: string;
  to: string;
  color: string;
  totalDistanceKm: number;
  averageDurationMin: number;
  stops: RouteStop[];
  currentCongestion: TrafficLevel;
}

export interface BusTelemetry {
  id: string;
  busNumber: string;
  routeId: string;
  routeName: string;
  destination: string;
  currentLocationName: string;
  nextStopId: string;
  nextStopName: string;
  lat: number;
  lng: number;
  speedKmh: number;
  status: BusStatus;
  passengerDensity: CrowdLevel;
  occupancyPercent: number;
  scheduledArrival: string;
  scheduledArrivalMins: number; // e.g., 7 mins
  predictedArrivalMins: number; // AI predicted mins from now
  confidenceIntervalMin: number; // e.g. 1 min (meaning 7 ± 1 min)
  confidencePercent: number; // e.g. 94%
  delayMins: number; // e.g. +4 mins
  driverName: string;
  driverExpYears: number;
  driverStatus: string;
  batteryOrFuelPercent: number;
  fuelType: 'Electric' | 'Clean Diesel' | 'CNG Hybrid';
  earlyWarning?: {
    active: boolean;
    title: string;
    description: string;
    predictedDelayMins: number;
    withinNextMins: number;
  };
  reasoning: PredictionReasoning;
}

export interface PredictionReasoning {
  trafficFactorMins: number;
  passengerBoardingFactorMins: number;
  routeCongestionFactorMins: number;
  weatherFactorMins: number;
  historicalPatternFactorMins: number;
  stopsRemainingFactorMins: number;
  totalDelayMins: number;
  summaryExplanation: string;
}

export interface JourneyBreakdown {
  origin: string;
  destination: string;
  walkToStopMin: number;
  waitAtStopMin: number;
  busRideMin: number;
  walkToDestMin: number;
  totalJourneyMin: number;
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
}

export interface RouteOptionComparison {
  id: string;
  routeName: string;
  busNumber: string;
  etaMin: number;
  traffic: TrafficLevel;
  crowd: CrowdLevel;
  fare: number;
  distanceKm: number;
  isAiRecommended: boolean;
  aiRecommendationReason?: string;
  co2SavedKg: number;
}

export interface PredictionHistoryRecord {
  id: string;
  date: string;
  busNumber: string;
  route: string;
  stopName: string;
  scheduledEta: string;
  aiEta: string;
  actualEta: string;
  errorMinutes: number;
  accuracyPercent: number;
  trafficCondition: TrafficLevel;
  confidence: number;
}

export interface MlModelBenchmark {
  modelName: string;
  type: string;
  maeMinutes: number;
  rmseMinutes: number;
  accuracyPercent: number;
  latencyMs: number;
  trainingSamples: string;
  status: 'Production Best' | 'Candidate' | 'Baseline';
}

export interface TrafficZoneAnalytics {
  id: string;
  zoneName: string;
  currentLevel: TrafficLevel;
  averageSpeedKmh: number;
  estimatedDelayMin: number;
  affectedBuses: string[];
  congestionIndex: number; // 0 - 100
  trend: 'rising' | 'stable' | 'easing';
}

export interface SystemAlert {
  id: string;
  type: 'delay' | 'traffic' | 'arrival' | 'crowd' | 'early_warning';
  title: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'urgent';
  busNumber?: string;
  route?: string;
  read?: boolean;
}

export interface WhatIfSimulationInput {
  traffic: TrafficLevel;
  passengerLoad: CrowdLevel;
  weather: WeatherCondition;
  busSpeedKmh: number;
  stopsRemaining: number;
  distanceRemainingKm: number;
}

export interface WhatIfSimulationOutput {
  baseEtaMin: number;
  predictedEtaMin: number;
  delayMin: number;
  confidencePercent: number;
  confidenceRangeMin: number;
  factors: {
    trafficDelta: number;
    passengerDelta: number;
    weatherDelta: number;
    speedDelta: number;
    stopDelayDelta: number;
  };
}

export interface FavoriteItem {
  id: string;
  type: 'route' | 'bus' | 'commute';
  title: string;
  subtitle: string;
  busNumber?: string;
  routeId?: string;
  origin?: string;
  destination?: string;
  nextArrivalMin?: number;
}

export interface UserValidationFeedback {
  id: string;
  userName: string;
  role: 'Student Commuter' | 'Corporate Office Commuter' | 'Transit Fleet Dispatcher' | 'Academic Reviewer';
  affiliation: string;
  experienceLevel: string;
  susScore: number; // 0 - 100 System Usability Scale
  taskSuccessRate: number; // %
  avgTaskTimeSec: number;
  testedFeature: string;
  keyFeedback: string;
  criticalPainPoint: string;
  implementedImprovement: string;
  date: string;
  rating: number; // 1 - 5
}

export interface EmpathyQuadrant {
  says: string[];
  thinks: string[];
  does: string[];
  feels: string[];
}

export interface EmpathyMapProfile {
  persona: string;
  tagline: string;
  archetype: 'Daily Commuter' | 'Fleet Controller';
  demographics: string;
  goals: string[];
  frustrations: string[];
  quadrant: EmpathyQuadrant;
}

export interface DiscardedDesignIdea {
  id: string;
  title: string;
  originalHypothesis: string;
  whyDiscarded: string;
  testFindingOrMetric: string;
  superiorAlternativeAdopted: string;
  impactScore: string;
}

export interface AiPromptAudit {
  id: string;
  module: string;
  purpose: string;
  systemPrompt: string;
  guardrails: string[];
  outputFormat: string;
  hallucinationMitigation: string;
  latencyBudgetMs: number;
}

export interface GtfsRtEntityRecord {
  id: string;
  entityType: 'TripUpdate' | 'VehiclePosition' | 'Alert';
  tripId: string;
  routeId: string;
  vehicleId: string;
  lat: number;
  lng: number;
  bearing: number;
  speedMps: number;
  delaySec: number;
  occupancyStatus: string;
  timestamp: number;
  protobufSize: number;
}

