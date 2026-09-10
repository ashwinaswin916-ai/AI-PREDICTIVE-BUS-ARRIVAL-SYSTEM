import {
  TrafficLevel,
  CrowdLevel,
  WeatherCondition,
  PredictionReasoning,
  WhatIfSimulationInput,
  WhatIfSimulationOutput,
  JourneyBreakdown
} from '../types';

/**
 * AI Transparent Prediction Engine for Urban Transit
 * Produces explainable arrival predictions, confidence intervals, and factor decomposition.
 */
export function calculateArrivalPrediction(params: {
  distanceKm: number;
  currentSpeedKmh: number;
  trafficLevel: TrafficLevel;
  crowdLevel: CrowdLevel;
  weather: WeatherCondition;
  stopsRemaining: number;
  historicalBiasMin?: number;
  routeCongestionScore?: number;
}): {
  baseEtaMin: number;
  predictedEtaMin: number;
  delayMin: number;
  confidencePercent: number;
  confidenceRangeMin: number;
  reasoning: PredictionReasoning;
} {
  const {
    distanceKm,
    currentSpeedKmh,
    trafficLevel,
    crowdLevel,
    weather,
    stopsRemaining,
    historicalBiasMin = -0.4,
    routeCongestionScore = 1.0,
  } = params;

  // 1. Base physics ETA based on distance and standard urban transit cruise speed
  const effectiveSpeed = Math.max(12, Math.min(65, currentSpeedKmh || 30));
  const rawBaseEta = (distanceKm / effectiveSpeed) * 60;
  const baseEtaMin = Math.max(1, Math.round(rawBaseEta * 10) / 10);

  // 2. Component Delays
  // Traffic Factor
  let trafficFactorMins = 0;
  switch (trafficLevel) {
    case 'severe':
      trafficFactorMins = 4.8;
      break;
    case 'heavy':
      trafficFactorMins = 2.5;
      break;
    case 'moderate':
      trafficFactorMins = 1.2;
      break;
    case 'low':
    default:
      trafficFactorMins = 0.2;
      break;
  }

  // Passenger Boarding Factor (dwell time per stop based on crowd density)
  let passengerBoardingFactorMins = 0;
  const dwellPerStop = crowdLevel === 'very_high' ? 0.45 : crowdLevel === 'high' ? 0.3 : crowdLevel === 'medium' ? 0.15 : 0.08;
  passengerBoardingFactorMins = Math.round((stopsRemaining * dwellPerStop + (crowdLevel === 'high' ? 0.8 : crowdLevel === 'very_high' ? 1.5 : 0.2)) * 10) / 10;

  // Route Congestion bottleneck factor
  const routeCongestionFactorMins = Math.round(routeCongestionScore * 1.2 * 10) / 10;

  // Weather Factor (road friction, visibility, cautious speed)
  let weatherFactorMins = 0;
  switch (weather) {
    case 'heavy_rain':
      weatherFactorMins = 2.1;
      break;
    case 'rain':
      weatherFactorMins = 0.8;
      break;
    case 'cloudy':
      weatherFactorMins = 0.2;
      break;
    case 'clear':
    default:
      weatherFactorMins = 0.0;
      break;
  }

  // Historical Pattern Factor (e.g. signal sync optimization or recurring bottlenecks)
  const historicalPatternFactorMins = Math.round(historicalBiasMin * 10) / 10;

  // Stops remaining deceleration/acceleration cycle delay
  const stopsRemainingFactorMins = Math.round(stopsRemaining * 0.2 * 10) / 10;

  // Total delay calculation
  const rawTotalDelay =
    trafficFactorMins +
    passengerBoardingFactorMins +
    routeCongestionFactorMins +
    weatherFactorMins +
    historicalPatternFactorMins;
  
  const totalDelayMins = Math.max(0, Math.round(rawTotalDelay * 10) / 10);
  const predictedEtaMin = Math.max(1, Math.round((baseEtaMin + totalDelayMins) * 10) / 10);

  // Confidence Interval Calculation (Unique Feature: "7 minutes ± 1 minute")
  // High confidence when weather is clear, moderate traffic, and telemetry is fresh
  let varianceScore = 0.6;
  if (trafficLevel === 'severe' || trafficLevel === 'heavy') varianceScore += 0.8;
  if (weather === 'heavy_rain') varianceScore += 0.6;
  if (stopsRemaining > 6) varianceScore += 0.4;
  
  const confidenceRangeMin = Math.min(2.5, Math.max(0.8, Math.round(varianceScore * 10) / 10));
  
  // Confidence percentage: 96% down to 88%
  const confidencePercent = Math.min(97, Math.max(86, Math.round(98 - varianceScore * 7)));

  // Generate natural language explanation
  let summaryExplanation = `AI predicts an ETA of ${predictedEtaMin} mins (${baseEtaMin} min base + ${totalDelayMins} min estimated delays).`;
  if (trafficLevel === 'heavy' || trafficLevel === 'severe') {
    summaryExplanation = `Heavy traffic congestion and stop dwell times add +${totalDelayMins} min to baseline transit time.`;
  } else if (crowdLevel === 'high' || crowdLevel === 'very_high') {
    summaryExplanation = `Elevated passenger demand is increasing dwell time at upcoming junction stops (+${passengerBoardingFactorMins} min).`;
  } else if (weather === 'rain' || weather === 'heavy_rain') {
    summaryExplanation = `Wet weather reducing average corridor velocity, with minor delays (+${weatherFactorMins} min).`;
  } else {
    summaryExplanation = `Optimal transit conditions with smooth corridor flow and minimal passenger dwell delay.`;
  }

  const reasoning: PredictionReasoning = {
    trafficFactorMins,
    passengerBoardingFactorMins,
    routeCongestionFactorMins,
    weatherFactorMins,
    historicalPatternFactorMins,
    stopsRemainingFactorMins,
    totalDelayMins,
    summaryExplanation,
  };

  return {
    baseEtaMin,
    predictedEtaMin,
    delayMin: totalDelayMins,
    confidencePercent,
    confidenceRangeMin,
    reasoning,
  };
}

/**
 * Interactive What-If Simulation Engine
 */
export function runWhatIfSimulation(input: WhatIfSimulationInput): WhatIfSimulationOutput {
  const effectiveSpeed = Math.max(15, input.busSpeedKmh);
  const baseEtaMin = Math.round((input.distanceRemainingKm / effectiveSpeed) * 60 * 10) / 10;

  // Traffic delta
  let trafficDelta = 0.5;
  if (input.traffic === 'moderate') trafficDelta = 1.8;
  if (input.traffic === 'heavy') trafficDelta = 3.6;
  if (input.traffic === 'severe') trafficDelta = 6.2;

  // Passenger delta
  let passengerDelta = 0.3;
  if (input.passengerLoad === 'medium') passengerDelta = 0.9;
  if (input.passengerLoad === 'high') passengerDelta = 2.1;
  if (input.passengerLoad === 'very_high') passengerDelta = 3.5;

  // Weather delta
  let weatherDelta = 0.0;
  if (input.weather === 'cloudy') weatherDelta = 0.3;
  if (input.weather === 'rain') weatherDelta = 1.2;
  if (input.weather === 'heavy_rain') weatherDelta = 2.9;

  // Speed delta compared to baseline 35 km/h
  const speedDiff = 35 - input.busSpeedKmh;
  const speedDelta = Math.round((speedDiff * 0.08) * 10) / 10;

  // Stop dwell delta
  const stopDelayDelta = Math.round((input.stopsRemaining * 0.4) * 10) / 10;

  const totalAddedDelay = Math.max(0, Math.round((trafficDelta + passengerDelta + weatherDelta + speedDelta + stopDelayDelta) * 10) / 10);
  const predictedEtaMin = Math.round((baseEtaMin + totalAddedDelay) * 10) / 10;

  // Confidence
  let confPenalty = 0;
  if (input.traffic === 'severe') confPenalty += 6;
  if (input.weather === 'heavy_rain') confPenalty += 5;
  if (input.passengerLoad === 'very_high') confPenalty += 4;
  const confidencePercent = Math.max(84, 98 - confPenalty);
  const confidenceRangeMin = Math.round((0.8 + confPenalty * 0.15) * 10) / 10;

  return {
    baseEtaMin,
    predictedEtaMin,
    delayMin: totalAddedDelay,
    confidencePercent,
    confidenceRangeMin,
    factors: {
      trafficDelta: Math.round(trafficDelta * 10) / 10,
      passengerDelta: Math.round(passengerDelta * 10) / 10,
      weatherDelta: Math.round(weatherDelta * 10) / 10,
      speedDelta,
      stopDelayDelta,
    },
  };
}

/**
 * Passenger Complete Door-to-Door Journey Calculator
 */
export function calculateJourneyBreakdown(
  origin: string,
  destination: string,
  busNumber: string,
  busEtaMin: number,
  busRideMinutes: number
): JourneyBreakdown {
  const walkToStopMin = 5;
  const waitAtStopMin = Math.max(1, busEtaMin);
  const busRideMin = busRideMinutes || 24;
  const walkToDestMin = 3;
  const totalJourneyMin = walkToStopMin + waitAtStopMin + busRideMin + walkToDestMin;

  const now = new Date();
  const departureDate = new Date(now.getTime() + (walkToStopMin + waitAtStopMin) * 60000);
  const arrivalDate = new Date(departureDate.getTime() + busRideMin * 60000);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    origin,
    destination,
    walkToStopMin,
    waitAtStopMin,
    busRideMin,
    walkToDestMin,
    totalJourneyMin,
    busNumber,
    departureTime: formatTime(departureDate),
    arrivalTime: formatTime(arrivalDate),
  };
}
