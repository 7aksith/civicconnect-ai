import {
  Challenge,
  AIAnalysisResult,
  DuplicateReport,
  MatchedPartner,
  Organization,
  ImpactMetrics,
  NotificationItem,
  ChallengeCategory,
  ChallengeSeverity,
} from '../types';
import {
  mockChallenges,
  mockOrganizations,
  mockImpactMetrics,
  mockNotifications,
} from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * CivicConnect AI Service Layer
 * Designed to connect seamlessly to Python FastAPI endpoints:
 * - POST /api/v1/ai/analyze
 * - POST /api/v1/ai/detect-duplicates
 * - POST /api/v1/ai/priority-score
 * - POST /api/v1/ai/match-partners
 * - GET/POST /api/v1/challenges
 * - GET /api/v1/impact/metrics
 */

export const analyzeChallenge = async (payload: {
  title: string;
  description: string;
  category: ChallengeCategory;
  hasImages: boolean;
  hasAudio: boolean;
  location?: { lat: number; lng: number; city: string };
}): Promise<AIAnalysisResult> => {
  // Try real backend if available, otherwise mock with AI reasoning
  try {
    const res = await fetch(`${API_BASE_URL}/v1/ai/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall through to mock logic
  }

  // Realistic mock AI calculation based on input characteristics
  const text = `${payload.title} ${payload.description}`.toLowerCase();
  let severity: ChallengeSeverity = 'Medium';
  let priorityScore = 65;
  let affectedPopulation = 850;
  let confidenceScore = 91;

  if (
    text.includes('flood') ||
    text.includes('landslide') ||
    text.includes('submerged') ||
    text.includes('casualt') ||
    text.includes('spark') ||
    text.includes('ruptur') ||
    payload.category === 'Disaster'
  ) {
    severity = 'Critical';
    priorityScore = Math.floor(88 + Math.random() * 9);
    affectedPopulation = Math.floor(2200 + Math.random() * 3500);
    confidenceScore = Math.floor(93 + Math.random() * 5);
  } else if (
    text.includes('contaminat') ||
    text.includes('toxic') ||
    text.includes('sewer') ||
    text.includes('fire') ||
    payload.category === 'Water' ||
    payload.category === 'Public Safety'
  ) {
    severity = 'High';
    priorityScore = Math.floor(76 + Math.random() * 11);
    affectedPopulation = Math.floor(1400 + Math.random() * 2000);
    confidenceScore = Math.floor(90 + Math.random() * 6);
  }

  // Bonus priority for multi-modal evidence
  if (payload.hasImages) priorityScore = Math.min(99, priorityScore + 4);
  if (payload.hasAudio) priorityScore = Math.min(99, priorityScore + 3);

  const duplicates: DuplicateReport[] = text.includes('water') || text.includes('flood')
    ? [
        {
          id: 'CC-SIH-DUP-1',
          title: `Reported similar inundation near ${payload.location?.city || 'Local area'}`,
          similarityScore: 0.88,
          distanceKm: 0.45,
          reportedAt: '3 hours ago',
          status: 'Under_Review',
        },
      ]
    : [];

  return {
    category: payload.category,
    severity,
    priorityScore,
    confidenceScore,
    affectedPopulationEstimate: affectedPopulation,
    duplicatesDetected: duplicates,
    analysisRationale: [
      `Semantic embeddings classified core intent as [${payload.category}] with ${confidenceScore}% model certainty.`,
      `Multi-modal verification confirmed evidence density (${payload.hasImages ? 'Photos attached, ' : ''}${payload.hasAudio ? 'Voice transcript extracted' : 'Text telemetry'}).`,
      `Geodemographic density index estimated affected perimeter population at ~${affectedPopulation.toLocaleString()} citizens.`,
      duplicates.length > 0
        ? `Found ${duplicates.length} duplicate/clustering report within 1 km radius. Clustered priority score weighted upwards.`
        : 'Zero direct spatial duplicates detected in active registry. Fresh cluster instantiated.',
    ],
    recommendedAction:
      severity === 'Critical'
        ? 'Immediate municipal rapid response unit dispatch and hazard cordoning.'
        : severity === 'High'
        ? 'Priority inspection by zonal civil engineers within 24 hours.'
        : 'Scheduled remediation task assigned to relevant civic department.',
    hazardType: `${payload.category} Event Assessment`,
    urgencyLevel: severity === 'Critical' ? 'Immediate' : severity === 'High' ? 'Within 24h' : 'Standard',
    matchedKeywords: payload.title.split(' ').filter((w) => w.length > 4).slice(0, 5),
  };
};

export const detectDuplicates = async (
  title: string,
  category: string,
  lat?: number,
  lng?: number
): Promise<DuplicateReport[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/ai/detect-duplicates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, lat, lng }),
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }

  // Simulated AI duplicate detector
  return [
    {
      id: 'CC-SIH-889',
      title: 'Drain choked with silt near Sector 14 crossing',
      similarityScore: 0.89,
      distanceKm: 0.35,
      reportedAt: '2 hours ago',
      status: 'Under_Review',
    },
  ];
};

export const matchExperts = async (
  category: ChallengeCategory,
  severity: ChallengeSeverity
): Promise<MatchedPartner[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/ai/match-partners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, severity }),
    });
    if (res.ok) return await res.json();
  } catch {
    // ignore
  }

  return [
    {
      id: 'org-1',
      name: 'SEEDS India Rapid Disaster Response',
      type: 'NGO',
      matchScore: 96,
      expertise: ['Flood Mitigation', 'Emergency Shelter', 'Community Relief'],
      location: 'National Capital Region',
      contactPerson: 'Priya Mukherjee',
    },
    {
      id: 'org-4',
      name: 'National Disaster Response Force (NDRF)',
      type: 'Authority',
      matchScore: 93,
      expertise: ['Search & Rescue', 'Evacuation', 'Heavy Equipment'],
      location: 'Regional Command Center',
      contactPerson: 'Cmdt. P. K. Singh',
    },
    {
      id: 'org-2',
      name: 'IIT Delhi Civil & Hydraulic Engineering Lab',
      type: 'University',
      matchScore: 88,
      expertise: ['Stormwater Modeling', 'Structural Health'],
      location: 'Hauz Khas, New Delhi',
      contactPerson: 'Prof. A. Bansal',
    },
    {
      id: 'org-3',
      name: 'FloodSense AI Satellite GeoSpatial',
      type: 'Startup',
      matchScore: 84,
      expertise: ['Drone Bathymetry', 'Inundation Modeling'],
      location: 'Bengaluru',
      contactPerson: 'Rohit Kulkarni',
    },
  ];
};

export const getChallenges = async (): Promise<Challenge[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/challenges`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return mockChallenges;
};

export const getOrganizations = async (): Promise<Organization[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/organizations`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return mockOrganizations;
};

export const getImpactMetrics = async (): Promise<ImpactMetrics> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/impact/metrics`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return mockImpactMetrics;
};

export const getNotifications = async (): Promise<NotificationItem[]> => {
  try {
    const res = await fetch(`${API_BASE_URL}/v1/notifications`);
    if (res.ok) return await res.json();
  } catch {
    // fallback
  }
  return mockNotifications;
};
