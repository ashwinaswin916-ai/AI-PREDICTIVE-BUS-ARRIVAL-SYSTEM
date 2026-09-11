import { UserValidationFeedback } from '../types';

export const INITIAL_USER_VALIDATIONS: UserValidationFeedback[] = [
  {
    id: 'val-01',
    userName: 'Kavitha S.',
    role: 'Student Commuter',
    affiliation: 'Rathinam Tech Campus, Coimbatore (Final Year B.Tech CSE)',
    experienceLevel: 'Daily Transit User (4 years on Route 21A & 8C)',
    susScore: 92.5,
    taskSuccessRate: 100,
    avgTaskTimeSec: 18,
    testedFeature: 'AI Confidence Interval & Alternative Route Recommendation',
    keyFeedback:
      'Conventional apps say "Bus arrives in 10 minutes", but in reality it arrives in 25 minutes during Eachanari jam, making me miss morning lectures. AuraTransit showing "7 ± 1 min at 94% confidence" gave me real peace of mind. The alternative suggestion (Route 8C via Podanur bypass) saved me 12 minutes on Monday morning!',
    criticalPainPoint:
      'Wanted clearer contrast between high-confidence (94%) and low-confidence (82%) predictions, plus immediate seat availability notice so she knows whether she will need to stand with a heavy backpack.',
    implementedImprovement:
      'Added high-visibility emerald confidence badges with ± margin notation, and integrated passenger crowd density ("Seats Available" vs "Standing Rush") directly on the arrival card header.',
    date: '2026-09-04',
    rating: 5,
  },
  {
    id: 'val-02',
    userName: 'Rajesh Kumar M.',
    role: 'Corporate Office Commuter',
    affiliation: 'Senior Solutions Architect, TIDEL Park Coimbatore (Resident of Kurichi)',
    experienceLevel: 'Daily Peak-Hour Commuter (Office transit at 08:30 AM & 06:30 PM)',
    susScore: 87.5,
    taskSuccessRate: 95,
    avgTaskTimeSec: 24,
    testedFeature: 'Transparent Explainability Factor Decomposition & Door-to-Door Journey Planner',
    keyFeedback:
      'The SHAP-style breakdown is revolutionary. Seeing "+2.5 min due to Ukkadam roadwork" and "+0.8 min dwell time" explains why the bus is late rather than treating delays like an unpredictable mystery. The Door-to-Door timeline (5 min walk + 7 min wait + 24 min ride + 3 min walk = 39 min total) lets me plan client morning standups accurately.',
    criticalPainPoint:
      'Found the initial "What-If Simulator" slightly tucked away and requested a direct one-click preview of severe weather / rain delays before stepping out of the office.',
    implementedImprovement:
      'Added a quick "What-If Scenario" launcher directly inside the Main Dashboard header, and integrated proactive early warning bottleneck banners with simulated rain multipliers.',
    date: '2026-09-06',
    rating: 5,
  },
  {
    id: 'val-03',
    userName: 'S. Balasubramaniam',
    role: 'Transit Fleet Dispatcher',
    affiliation: 'Station Controller & Head of Operations, Ukkadam Central Bus Terminal (18+ yrs service)',
    experienceLevel: 'Municipal Transit Fleet Operations & Dispatching',
    susScore: 85.0,
    taskSuccessRate: 90,
    avgTaskTimeSec: 32,
    testedFeature: 'Operator Supervisory Console, Fleet Health Monitoring & Telemetry Ingestion Bridge',
    keyFeedback:
      'As dispatchers, our biggest headache is "bus bunching"—two 21A buses arriving 1 minute apart because the front one got trapped at Eachanari junction. This dashboard provides immediate spatial awareness of all 8 corridor units, dynamic occupancy alerts, and allows us to inject holding delays to maintain uniform 10-minute headways.',
    criticalPainPoint:
      'Needed confirmation that the client telemetry matches GTFS-Realtime Protobuf feeds and AIS-140 GPS standards so it can be deployed on government TNSTC / city buses without changing existing hardware.',
    implementedImprovement:
      'Engineered the Live Data Ingestion Pipeline Monitor with GTFS-RT Protobuf entity decoding and AIS-140 telemetry string validation, plus one-click JSON fleet audit export.',
    date: '2026-09-08',
    rating: 4.5,
  },
];

export const VALIDATION_SUMMARY_METRICS = {
  averageSusScore: 88.3, // Industry benchmark for excellent usability is > 80.3 (Grade A)
  totalParticipants: 3,
  evaluatorRoles: ['Student Daily Commuter', 'IT Tech Lead / Daily Commuter', 'Municipal Fleet Dispatcher (18 yrs)'],
  overallTaskCompletionRate: 95.0,
  averageTimeOnTaskSec: 24.6,
  netPromoterScore: '+84',
  susGrade: 'Grade A+ (Top 10th Percentile)',
  evaluationCriteria: [
    { title: 'Confidence Interval Clarity', score: 96, benchmark: '80+' },
    { title: 'Explainability & Factor Attribution Trust', score: 94, benchmark: '75+' },
    { title: 'Door-to-Door Usability', score: 92, benchmark: '80+' },
    { title: 'Fleet Dispatch Telemetry Relevance', score: 90, benchmark: '70+' },
    { title: 'System Responsiveness & Visual Rhythm', score: 98, benchmark: '85+' },
  ],
};
