/**
 * User-related types for the B2C profile system.
 * Designed to be Stripe-ready for future billing integration.
 */

export type SubscriptionTier = "free" | "pro" | "premium";
export type SubscriptionStatus = "active" | "cancelled" | "past_due" | "trialing";
export type Gender = "male" | "female" | "other";
export type InvoiceStatus = "paid" | "pending" | "failed";
export type PlayerLevel = 1 | 2 | 3 | 4 | 5;
export type Division = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Academy {
  id: string;
  name: string;
  logoUrl: string;
}

export interface LoginActivity {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  timestamp: string;
  isCurrent: boolean;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  pricePerMonth: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  country?: string;
  gender?: Gender;
  preferredPosition?: string;
  createdAt: string;
  subscription: Subscription;
  level: PlayerLevel;
  division: Division;
  academy?: Academy;
  totalScore?: number;
  stats?: PlayerStats;
  teamName?: string;
  recentDrills?: DrillProgress[];
  recentMissions?: MissionProgress[];
  recentChallenges?: ChallengeProgress[];
  achievements?: Achievement[];
  teamRankings?: TeamRanking[];
  reportCard?: {
    summary: ReportSummary;
    assessment: CoachAssessment;
  };
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  downloadUrl: string;
}

export interface PaymentMethod {
  id: string;
  brand: "visa" | "mastercard" | "amex" | "discover" | "unknown";
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  country?: string;
  gender?: Gender;
  preferredPosition?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateChildProfilePayload {
  name?: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  teamName?: string;
  academyName?: string;
  email?: string;
  username?: string;
  canLogin?: boolean;
}

export interface SetChildPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export type ProfileSection = "overview" | "account" | "security" | "billing";
export type ParentProfileSection = "kids" | "controls" | "account" | "security";

/** Player performance stats displayed on player card. */
export interface PlayerStats {
  pace: number;
  passing: number;
  dribbling: number;
  control: number;
}

/** Individual drill progress. */
export interface DrillProgress {
  id: string;
  name: string;
  progress: number;
  thumbnailUrl?: string;
  completedAt?: string;
  status: "completed" | "in_progress" | "failed";
}

/** Mission progress tracking. */
export interface MissionProgress {
  id: string;
  title: string;
  coachName: string;
  progress: number;
  drillsCompleted: number;
  drillsTotal: number;
  exercisesCompleted: number;
  exercisesTotal: number;
  backgroundUrl?: string;
}

/** Challenge progress tracking. */
export interface ChallengeProgress {
  id: string;
  name: string;
  opponentName: string;
  progress: number;
  rank?: number;
  status: "active" | "completed" | "expired";
}

/** Achievement badge. */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

/** Team ranking entry. */
export interface TeamRanking {
  rank: number;
  playerId: string;
  playerName: string;
  avatarUrl?: string;
  level: PlayerLevel;
  division: Division;
  score: number;
  isCurrentChild?: boolean;
}

/** Parental control settings. */
export interface ParentalControls {
  chatEnabled: boolean;
  notificationsEnabled: boolean;
  challengesEnabled: boolean;
  leaderboardVisible: boolean;
}

/** Child account information managed by a parent. */
export interface ChildAccount {
  email: string;
  username: string;
  canLogin: boolean;
  passwordLastUpdatedAt?: string;
}

export interface CoachAssessment {
  attitude: number | null;
  respect: number | null;
  effort: number | null;
  teamPlay: number | null;
  ambition: number | null;
  humility: number | null;
  comments?: string;
}

export interface ReportSummary {
  summaryText: string;
  overallRating: number;
  overallScore: number;
  totalDrills: number;
  averageScore: number;
  bestScore: number;
  keyStrengths: string[];
}

/** Child profile data for parent dashboard. */
export interface ChildProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  level: PlayerLevel;
  division: Division;
  totalScore: number;
  stats: PlayerStats;
  academy?: Academy;
  teamName?: string;
  recentDrills: DrillProgress[];
  recentMissions: MissionProgress[];
  recentChallenges: ChallengeProgress[];
  achievements: Achievement[];
  teamRankings: TeamRanking[];
  controls: ParentalControls;
  account: ChildAccount;
  reportCard?: {
    summary: ReportSummary;
    assessment: CoachAssessment;
  };
}

/** Parent user with linked children. */
export interface ParentUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  children: ChildProfile[];
}
