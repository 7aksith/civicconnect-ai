export type UserRole = 'citizen' | 'expert' | 'organization' | 'authority';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar: string;
  city: string;
  state: string;
  organizationName?: string;
  reputationScore: number;
  badges: string[];
  reportsSubmitted: number;
  challengesSupported: number;
}

export type ChallengeCategory =
  | 'Disaster'
  | 'Water'
  | 'Roads'
  | 'Electricity'
  | 'Waste Management'
  | 'Public Safety'
  | 'Healthcare'
  | 'Environment'
  | 'Education'
  | 'Other';

export type ChallengeSeverity = 'Critical' | 'High' | 'Medium' | 'Low';

export type ChallengeStatus =
  | 'Reported'
  | 'AI_Verified'
  | 'Under_Review'
  | 'Organization_Assigned'
  | 'Solution_Development'
  | 'Implementation'
  | 'Resolved';

export interface ChallengeLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pincode?: string;
}

export interface DuplicateReport {
  id: string;
  title: string;
  similarityScore: number; // e.g. 0.92
  distanceKm: number; // e.g. 0.4 km
  reportedAt: string;
  status: ChallengeStatus;
}

export interface AIAnalysisResult {
  category: ChallengeCategory;
  severity: ChallengeSeverity;
  priorityScore: number; // 0-100
  confidenceScore: number; // 0-100 (%)
  affectedPopulationEstimate: number;
  duplicatesDetected: DuplicateReport[];
  analysisRationale: string[];
  recommendedAction: string;
  hazardType?: string;
  urgencyLevel: 'Immediate' | 'Within 24h' | 'Standard' | 'Scheduled';
  matchedKeywords: string[];
}

export interface ChallengeEvidence {
  images: string[];
  voiceAudio?: {
    durationSeconds: number;
    url?: string;
    transcript?: string;
  };
  additionalNotes?: string;
}

export interface MatchedPartner {
  id: string;
  name: string;
  type: 'NGO' | 'University' | 'Startup' | 'Authority' | 'Research';
  matchScore: number; // 0-100
  expertise: string[];
  location: string;
  contactPerson: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userAvatar: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: ChallengeCategory;
  severity: ChallengeSeverity;
  priorityScore: number;
  status: ChallengeStatus;
  progressPercent: number;
  location: ChallengeLocation;
  evidence: ChallengeEvidence;
  aiAnalysis: AIAnalysisResult;
  reporterId: string;
  reporterName: string;
  reporterRole: UserRole;
  createdAt: string;
  updatedAt: string;
  supportersCount: number;
  isSupportedByMe?: boolean;
  assignedOrganization?: {
    id: string;
    name: string;
    type: string;
    assignedAt: string;
  };
  matchedPartners: MatchedPartner[];
  comments: Comment[];
  timelineEvents: {
    status: ChallengeStatus;
    title: string;
    description: string;
    timestamp: string;
    actor: string;
  }[];
}

export interface Organization {
  id: string;
  name: string;
  type: 'NGO' | 'University' | 'Startup' | 'Government' | 'Research';
  description: string;
  expertise: string[];
  location: string;
  verified: boolean;
  activeProjects: number;
  solvedChallenges: number;
  membersCount: number;
  website: string;
  logo: string;
  contactEmail: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'CHALLENGE_UPDATE' | 'AI_ANALYSIS' | 'ORG_MATCHED' | 'COMMENT' | 'RESOLVED' | 'PRIORITY_CHANGED';
  createdAt: string;
  isRead: boolean;
  challengeId?: string;
}

export interface ImpactMetrics {
  challengesReported: number;
  challengesResolved: number;
  averageResolutionDays: number;
  activeContributors: number;
  partnerOrganizations: number;
  estimatedPopulationImpacted: number;
  categoryBreakdown: { name: string; count: number; percentage: number }[];
  statusBreakdown: { status: string; count: number; color: string }[];
  monthlyTrends: { month: string; reported: number; resolved: number }[];
}
