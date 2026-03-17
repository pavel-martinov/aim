/**
 * Mock user data and handlers for profile development.
 * Replace with real API calls / Supabase when ready.
 */

import { delay } from "./utils";
import { PRESET_AVATARS } from "./constants";
import type {
  User,
  Invoice,
  PaymentMethod,
  UpdateUserPayload,
  UpdatePasswordPayload,
  UpdateChildProfilePayload,
  SetChildPasswordPayload,
  SubscriptionTier,
  LoginActivity,
  ActiveSession,
  ParentUser,
  ChildProfile,
  ParentalControls,
  DrillProgress,
  MissionProgress,
  ChallengeProgress,
  Achievement,
  TeamRanking,
} from "@/types/user";
import type { ApiResult } from "@/types/api";

/** Re-export constants for backward compatibility */
export { PRESET_AVATARS, DIVISION_CONFIG, FOOTBALL_POSITIONS, COUNTRIES } from "./constants";

/** Mock delay constants */
const MOCK_DELAY = {
  short: 300,
  medium: 500,
  long: 800,
} as const;

/** Plan pricing information for subscription tiers */
export const PLAN_PRICING: Record<SubscriptionTier, { name: string; price: number; features: string[] }> = {
  free: {
    name: "Free",
    price: 0,
    features: ["Basic profile", "Limited challenges", "Community access"],
  },
  pro: {
    name: "Pro",
    price: 9.99,
    features: ["Unlimited challenges", "Video analysis", "Performance tracking", "Priority support"],
  },
  premium: {
    name: "Premium",
    price: 19.99,
    features: ["Everything in Pro", "1-on-1 coaching sessions", "Custom training plans", "Early access to features"],
  },
};

/** Mock user data */
const mockUser: User = {
  id: "usr_mock_123",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 555 123 4567",
  avatarUrl: undefined,
  dateOfBirth: "1998-05-15",
  country: "United States",
  gender: "male",
  preferredPosition: "Central Midfielder",
  createdAt: "2024-06-15T10:30:00Z",
  subscription: {
    id: "sub_mock_456",
    tier: "pro",
    status: "active",
    currentPeriodStart: "2026-02-10T00:00:00Z",
    currentPeriodEnd: "2026-03-10T00:00:00Z",
    cancelAtPeriodEnd: false,
    pricePerMonth: 9.99,
  },
  level: 3,
  division: "gold",
  academy: {
    id: "acad_001",
    name: "Elite Football Academy",
    logoUrl: "/academies/template-logo.svg",
  },
};

/** Billing-facing parent profile that reuses the subscription model. */
const mockParentBillingUser: User = {
  ...mockUser,
  id: "parent_billing_001",
  name: "Sarah Alegro",
  email: "parent@aim.io",
  phone: "+1 555 987 6543",
  avatarUrl: PRESET_AVATARS[5],
};

/** Mock login activity */
const mockLoginActivity: LoginActivity[] = [
  {
    id: "login_001",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    location: "New York, US",
    ipAddress: "192.168.1.xxx",
    timestamp: "2026-03-10T08:30:00Z",
    isCurrent: true,
  },
  {
    id: "login_002",
    device: "MacBook Pro",
    browser: "Chrome 122",
    location: "New York, US",
    ipAddress: "192.168.1.xxx",
    timestamp: "2026-03-09T14:22:00Z",
    isCurrent: false,
  },
  {
    id: "login_003",
    device: "Windows PC",
    browser: "Firefox 123",
    location: "Boston, US",
    ipAddress: "10.0.0.xxx",
    timestamp: "2026-03-07T09:15:00Z",
    isCurrent: false,
  },
  {
    id: "login_004",
    device: "iPad Pro",
    browser: "Safari",
    location: "New York, US",
    ipAddress: "192.168.1.xxx",
    timestamp: "2026-03-05T18:45:00Z",
    isCurrent: false,
  },
];

/** Mock active sessions */
let mockActiveSessions: ActiveSession[] = [
  {
    id: "session_001",
    device: "iPhone 15 Pro",
    browser: "Safari Mobile",
    location: "New York, US",
    lastActive: "2026-03-10T08:30:00Z",
    isCurrent: true,
  },
  {
    id: "session_002",
    device: "MacBook Pro",
    browser: "Chrome 122",
    location: "New York, US",
    lastActive: "2026-03-09T14:22:00Z",
    isCurrent: false,
  },
];

/** Mock invoices */
const mockInvoices: Invoice[] = [
  {
    id: "inv_001",
    date: "2026-02-10",
    amount: 9.99,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#",
  },
  {
    id: "inv_002",
    date: "2026-01-10",
    amount: 9.99,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#",
  },
  {
    id: "inv_003",
    date: "2025-12-10",
    amount: 9.99,
    currency: "USD",
    status: "paid",
    description: "Pro Plan - Monthly",
    downloadUrl: "#",
  },
];

/** Mock payment method */
const mockPaymentMethod: PaymentMethod = {
  id: "pm_mock_789",
  brand: "visa",
  last4: "4242",
  expiryMonth: 12,
  expiryYear: 2028,
  isDefault: true,
};

/** Helper: finds child by ID in mock parent data */
function findChildById(childId: string): ChildProfile | undefined {
  return mockParentUser.children.find((c) => c.id === childId);
}

/** Helper: finds child index by ID in mock parent data */
function findChildIndexById(childId: string): number {
  return mockParentUser.children.findIndex((c) => c.id === childId);
}

/** Clones nested child data so UI state stays isolated from mock storage. */
function cloneChildProfile(child: ChildProfile): ChildProfile {
  return {
    ...child,
    academy: child.academy ? { ...child.academy } : undefined,
    recentDrills: child.recentDrills.map((item) => ({ ...item })),
    recentMissions: child.recentMissions.map((item) => ({ ...item })),
    recentChallenges: child.recentChallenges.map((item) => ({ ...item })),
    achievements: child.achievements.map((item) => ({ ...item })),
    teamRankings: child.teamRankings.map((item) => ({ ...item })),
    controls: { ...child.controls },
    account: { ...child.account },
    reportCard: child.reportCard
      ? {
          summary: {
            ...child.reportCard.summary,
            keyStrengths: [...child.reportCard.summary.keyStrengths],
          },
          assessment: { ...child.reportCard.assessment },
        }
      : undefined,
  };
}

/** Clones parent data and linked children for safe UI updates. */
function cloneParentUser(parent: ParentUser): ParentUser {
  return {
    ...parent,
    children: parent.children.map(cloneChildProfile),
  };
}

/** Returns mock user data */
export async function getMockUser(): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.medium);
  return { success: true, data: { ...mockUser } };
}

/** Updates mock user data */
export async function updateMockUser(updates: UpdateUserPayload): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.medium);
  Object.assign(mockUser, updates);
  return { success: true, data: { ...mockUser } };
}

/** Updates user avatar URL */
export async function updateMockAvatar(avatarUrl: string): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.long);
  mockUser.avatarUrl = avatarUrl;
  return { success: true, data: { ...mockUser } };
}

/** Updates user password */
export async function updateMockPassword(payload: UpdatePasswordPayload): Promise<ApiResult<null>> {
  await delay(MOCK_DELAY.long);

  if (payload.currentPassword !== "demo123") {
    return { success: false, error: "Current password is incorrect" };
  }

  if (payload.newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  if (payload.newPassword !== payload.confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  return { success: true, data: null };
}

/** Returns mock invoices */
export async function getMockInvoices(): Promise<ApiResult<Invoice[]>> {
  await delay(MOCK_DELAY.short);
  return { success: true, data: [...mockInvoices] };
}

/** Returns mock payment method */
export async function getMockPaymentMethod(): Promise<ApiResult<PaymentMethod | null>> {
  await delay(MOCK_DELAY.short);
  return { success: true, data: { ...mockPaymentMethod } };
}

/** Helper: applies subscription update to a user object */
function applySubscriptionUpdate(user: User, tier: SubscriptionTier): void {
  user.subscription = {
    ...user.subscription,
    tier,
    pricePerMonth: PLAN_PRICING[tier].price,
    status: tier === "free" ? "cancelled" : "active",
    cancelAtPeriodEnd: tier === "free",
  };
}

/** Updates subscription tier */
export async function updateMockSubscription(tier: SubscriptionTier): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.long);
  applySubscriptionUpdate(mockUser, tier);
  return { success: true, data: { ...mockUser } };
}

/** Cancels subscription (sets to cancel at period end) */
export async function cancelMockSubscription(): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.long);
  mockUser.subscription.cancelAtPeriodEnd = true;
  return { success: true, data: { ...mockUser } };
}

/** Reactivates a cancelled subscription */
export async function reactivateMockSubscription(): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.medium);
  mockUser.subscription.cancelAtPeriodEnd = false;
  return { success: true, data: { ...mockUser } };
}

/** Updates the parent's subscription tier. */
export async function updateMockParentSubscription(tier: SubscriptionTier): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.long);
  applySubscriptionUpdate(mockParentBillingUser, tier);
  return {
    success: true,
    data: { ...mockParentBillingUser, subscription: { ...mockParentBillingUser.subscription } },
  };
}

/** Cancels the parent's subscription at period end. */
export async function cancelMockParentSubscription(): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.long);
  mockParentBillingUser.subscription.cancelAtPeriodEnd = true;
  return {
    success: true,
    data: { ...mockParentBillingUser, subscription: { ...mockParentBillingUser.subscription } },
  };
}

/** Reactivates the parent's cancelled subscription. */
export async function reactivateMockParentSubscription(): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.medium);
  mockParentBillingUser.subscription.cancelAtPeriodEnd = false;
  return {
    success: true,
    data: { ...mockParentBillingUser, subscription: { ...mockParentBillingUser.subscription } },
  };
}

/** Returns mock login activity */
export async function getMockLoginActivity(): Promise<ApiResult<LoginActivity[]>> {
  await delay(MOCK_DELAY.short);
  return { success: true, data: [...mockLoginActivity] };
}

/** Returns mock active sessions */
export async function getMockActiveSessions(): Promise<ApiResult<ActiveSession[]>> {
  await delay(MOCK_DELAY.short);
  return { success: true, data: [...mockActiveSessions] };
}

/** Ends a specific session */
export async function endMockSession(sessionId: string): Promise<ApiResult<ActiveSession[]>> {
  await delay(MOCK_DELAY.medium);
  mockActiveSessions = mockActiveSessions.filter((s) => s.id !== sessionId);
  return { success: true, data: [...mockActiveSessions] };
}

/** Ends all sessions except current */
export async function endAllMockSessions(): Promise<ApiResult<ActiveSession[]>> {
  await delay(MOCK_DELAY.long);
  mockActiveSessions = mockActiveSessions.filter((s) => s.isCurrent);
  return { success: true, data: [...mockActiveSessions] };
}

/** Mock drill thumbnails */
const DRILL_THUMBNAILS = [
  "/drills/triple-cone.jpg",
  "/drills/cone-weave.jpg",
  "/drills/zigzag.jpg",
  "/drills/passing.jpg",
  "/drills/keepy-uppies.jpg",
];

/** Mock mission backgrounds */
const MISSION_BACKGROUNDS = [
  "/missions/weekly-mission.jpg",
  "/missions/coach-mission.jpg",
];

/** Mock achievement icons */
const ACHIEVEMENT_ICONS = [
  "/achievements/climbing-ladder.svg",
  "/achievements/personal-record.svg",
  "/achievements/coach-approved.svg",
  "/achievements/team-player.svg",
  "/achievements/consistency.svg",
];

/** Creates mock drill progress data. */
function createMockDrills(): DrillProgress[] {
  return [
    { id: "drill_1", name: "Triple Cone Turn Drill", progress: 19, status: "in_progress" },
    { id: "drill_2", name: "7 Cone Weave", progress: 7, status: "in_progress" },
    { id: "drill_3", name: "Zigzag Drill", progress: 13, status: "in_progress" },
    { id: "drill_4", name: "Passing, Turning Receiving", progress: 22, status: "in_progress" },
    { id: "drill_5", name: "Keepy Uppies", progress: 20, status: "in_progress" },
  ];
}

/** Creates mock mission progress data. */
function createMockMissions(): MissionProgress[] {
  return [
    {
      id: "mission_1",
      title: "Weekly Mission",
      coachName: "Thomas Reed",
      progress: 50,
      drillsCompleted: 1,
      drillsTotal: 2,
      exercisesCompleted: 6,
      exercisesTotal: 8,
    },
    {
      id: "mission_2",
      title: "Speed Training",
      coachName: "Leroy West",
      progress: 32,
      drillsCompleted: 1,
      drillsTotal: 3,
      exercisesCompleted: 2,
      exercisesTotal: 6,
    },
  ];
}

/** Creates mock challenge progress data. */
function createMockChallenges(): ChallengeProgress[] {
  return [
    { id: "challenge_1", name: "Speed Drill Challenge", opponentName: "Ella McCarthy", progress: 75, rank: 3, status: "active" },
    { id: "challenge_2", name: "Dribbling Showdown", opponentName: "Marcus Lee", progress: 100, rank: 1, status: "completed" },
  ];
}

/** Creates mock achievements data. */
function createMockAchievements(): Achievement[] {
  return [
    { id: "ach_1", name: "Climbing the Ladder", description: "Reach Level 2", iconUrl: ACHIEVEMENT_ICONS[0], isUnlocked: true, unlockedAt: "2026-02-15" },
    { id: "ach_2", name: "New Personal Record", description: "Beat your best score", iconUrl: ACHIEVEMENT_ICONS[1], isUnlocked: true, unlockedAt: "2026-03-01" },
    { id: "ach_3", name: "Coach Approved", description: "Complete a coach mission", iconUrl: ACHIEVEMENT_ICONS[2], isUnlocked: true, unlockedAt: "2026-03-10" },
    { id: "ach_4", name: "Team Player", description: "Join a team challenge", iconUrl: ACHIEVEMENT_ICONS[3], isUnlocked: false },
    { id: "ach_5", name: "Consistency King", description: "Train 7 days in a row", iconUrl: ACHIEVEMENT_ICONS[4], isUnlocked: false },
  ];
}

/** Creates mock team rankings data. */
function createMockTeamRankings(childId: string): TeamRanking[] {
  return [
    { rank: 1, playerId: "player_1", playerName: "Jaxon Rivers", level: 4, division: "gold", score: 80.7, avatarUrl: PRESET_AVATARS[0] },
    { rank: 2, playerId: "player_2", playerName: "Maya Thompson", level: 3, division: "diamond", score: 92.2, avatarUrl: PRESET_AVATARS[1] },
    { rank: 3, playerId: childId, playerName: "Muhammad Alegro", level: 1, division: "bronze", score: 90.3, isCurrentChild: true, avatarUrl: PRESET_AVATARS[2] },
    { rank: 4, playerId: "player_4", playerName: "Sofia Bennett", level: 2, division: "gold", score: 95.5, avatarUrl: PRESET_AVATARS[3] },
    { rank: 5, playerId: "player_5", playerName: "Ethan Hayes", level: 1, division: "platinum", score: 98, avatarUrl: PRESET_AVATARS[4] },
  ];
}

/** Mock parent user data with children. */
let mockParentUser: ParentUser = {
  id: "parent_001",
  name: "Sarah Alegro",
  email: "parent@aim.io",
  phone: "+1 555 987 6543",
  avatarUrl: PRESET_AVATARS[5],
  createdAt: "2025-09-01T10:00:00Z",
  children: [
    {
      id: "child_001",
      name: "Muhammad Alegro",
      avatarUrl: PRESET_AVATARS[2],
      dateOfBirth: "2002-03-15",
      level: 1,
      division: "bronze",
      totalScore: 22,
      stats: { pace: 24, passing: 43, dribbling: 31, control: 15 },
      academy: { id: "acad_001", name: "Ermageddon FC", logoUrl: "/academies/template-logo.svg" },
      teamName: "Ermageddon",
      recentDrills: createMockDrills(),
      recentMissions: createMockMissions(),
      recentChallenges: createMockChallenges(),
      achievements: createMockAchievements(),
      teamRankings: createMockTeamRankings("child_001"),
      controls: { chatEnabled: true, notificationsEnabled: true, challengesEnabled: true, leaderboardVisible: true },
      account: {
        email: "muhammad.alegro@aim-player.io",
        username: "muhammadalegro",
        canLogin: true,
        passwordLastUpdatedAt: "2026-03-01T12:00:00Z",
      },
      reportCard: {
        summary: {
          summaryText: "Muhammad Alegro has completed 4 drills with an overall developing performance (50.1% average). Their performance trend is declining, with a consistency score of 69.8%. Focus areas have been identified across technical skills, with particular attention needed in weaker categories.",
          overallRating: 5,
          overallScore: 50.1,
          totalDrills: 4,
          averageScore: 50.1,
          bestScore: 60,
          keyStrengths: ["Agility", "Basic Dribbling"],
        },
        assessment: {
          attitude: 5,
          respect: 5,
          effort: 5,
          teamPlay: null,
          ambition: null,
          humility: null,
          comments: "Muhammad shows good effort but needs to focus on consistency.",
        },
      },
    },
    {
      id: "child_002",
      name: "Aisha Alegro",
      avatarUrl: PRESET_AVATARS[6],
      dateOfBirth: "2008-07-22",
      level: 2,
      division: "silver",
      totalScore: 45,
      stats: { pace: 38, passing: 52, dribbling: 44, control: 28 },
      academy: { id: "acad_002", name: "City Stars Academy", logoUrl: "/academies/template-logo.svg" },
      teamName: "City Stars U14",
      recentDrills: createMockDrills().map(d => ({ ...d, progress: d.progress + 15 })),
      recentMissions: createMockMissions().map(m => ({ ...m, progress: m.progress + 20 })),
      recentChallenges: createMockChallenges(),
      achievements: createMockAchievements().map((a, i) => ({ ...a, isUnlocked: i < 4 })),
      teamRankings: createMockTeamRankings("child_002"),
      controls: { chatEnabled: false, notificationsEnabled: true, challengesEnabled: true, leaderboardVisible: true },
      account: {
        email: "aisha.alegro@aim-player.io",
        username: "aishaalegro",
        canLogin: true,
        passwordLastUpdatedAt: "2026-02-18T09:30:00Z",
      },
      reportCard: {
        summary: {
          summaryText: "Aisha Alegro has completed 12 drills with an overall strong performance (75.4% average). Their performance trend is improving, with a consistency score of 82.1%.",
          overallRating: 85,
          overallScore: 75.4,
          totalDrills: 12,
          averageScore: 75.4,
          bestScore: 92.5,
          keyStrengths: ["Passing Accuracy", "Vision", "Pace"],
        },
        assessment: {
          attitude: 8,
          respect: 9,
          effort: 8,
          teamPlay: 7,
          ambition: 9,
          humility: 8,
          comments: "Aisha is a great team player and always eager to learn. Keep up the good work!",
        },
      },
    },
  ],
};

/** Returns mock parent user with children. */
export async function getMockParentUser(): Promise<ApiResult<ParentUser>> {
  await delay(MOCK_DELAY.medium);
  return { success: true, data: cloneParentUser(mockParentUser) };
}

/** Returns parent billing data using the shared billing model. */
export async function getMockParentBillingUser(): Promise<ApiResult<User>> {
  await delay(MOCK_DELAY.short);
  return { success: true, data: { ...mockParentBillingUser, subscription: { ...mockParentBillingUser.subscription } } };
}

/** Returns a specific child's profile. */
export async function getMockChildProfile(childId: string): Promise<ApiResult<ChildProfile | null>> {
  await delay(MOCK_DELAY.short);
  const child = findChildById(childId);
  if (!child) {
    return { success: false, error: "Child not found" };
  }
  return { success: true, data: cloneChildProfile(child) };
}

/** Updates child profile information managed by the parent. */
export async function updateMockChildProfile(
  childId: string,
  updates: UpdateChildProfilePayload
): Promise<ApiResult<ChildProfile>> {
  await delay(MOCK_DELAY.medium);

  const childIndex = findChildIndexById(childId);
  if (childIndex === -1) {
    return { success: false, error: "Child not found" };
  }

  const child = mockParentUser.children[childIndex];

  mockParentUser.children[childIndex] = {
    ...child,
    name: updates.name ?? child.name,
    avatarUrl: updates.avatarUrl !== undefined ? updates.avatarUrl : child.avatarUrl,
    dateOfBirth: updates.dateOfBirth ?? child.dateOfBirth,
    teamName: updates.teamName ?? child.teamName,
    academy: updates.academyName
      ? { ...(child.academy ?? { id: `acad_${child.id}`, logoUrl: "/academies/template-logo.svg" }), name: updates.academyName }
      : child.academy,
    account: {
      ...child.account,
      email: updates.email ?? child.account.email,
      username: updates.username ?? child.account.username,
      canLogin: updates.canLogin ?? child.account.canLogin,
    },
  };

  return { success: true, data: cloneChildProfile(mockParentUser.children[childIndex]) };
}

/** Sets or resets the child's password on behalf of the parent. */
export async function updateMockChildPassword(
  childId: string,
  payload: SetChildPasswordPayload
): Promise<ApiResult<ChildProfile>> {
  await delay(MOCK_DELAY.medium);

  if (!payload.newPassword || !payload.confirmPassword) {
    return { success: false, error: "All fields are required" };
  }

  if (payload.newPassword.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  if (payload.newPassword !== payload.confirmPassword) {
    return { success: false, error: "Passwords do not match" };
  }

  const childIndex = findChildIndexById(childId);
  if (childIndex === -1) {
    return { success: false, error: "Child not found" };
  }

  mockParentUser.children[childIndex] = {
    ...mockParentUser.children[childIndex],
    account: {
      ...mockParentUser.children[childIndex].account,
      passwordLastUpdatedAt: new Date().toISOString(),
    },
  };

  return { success: true, data: cloneChildProfile(mockParentUser.children[childIndex]) };
}

/** Updates parental controls for a child. */
export async function updateParentalControls(
  childId: string,
  controls: Partial<ParentalControls>
): Promise<ApiResult<ChildProfile>> {
  await delay(MOCK_DELAY.short);
  const childIndex = findChildIndexById(childId);
  if (childIndex === -1) {
    return { success: false, error: "Child not found" };
  }
  mockParentUser.children[childIndex].controls = {
    ...mockParentUser.children[childIndex].controls,
    ...controls,
  };
  return { success: true, data: cloneChildProfile(mockParentUser.children[childIndex]) };
}

/** Returns drill progress for a child. */
export async function getMockChildDrills(childId: string): Promise<ApiResult<DrillProgress[]>> {
  await delay(MOCK_DELAY.short);
  const child = findChildById(childId);
  if (!child) {
    return { success: false, error: "Child not found" };
  }
  return { success: true, data: child.recentDrills.map((item) => ({ ...item })) };
}

/** Returns mission progress for a child. */
export async function getMockChildMissions(childId: string): Promise<ApiResult<MissionProgress[]>> {
  await delay(MOCK_DELAY.short);
  const child = findChildById(childId);
  if (!child) {
    return { success: false, error: "Child not found" };
  }
  return { success: true, data: child.recentMissions.map((item) => ({ ...item })) };
}

/** Returns achievements for a child. */
export async function getMockChildAchievements(childId: string): Promise<ApiResult<Achievement[]>> {
  await delay(MOCK_DELAY.short);
  const child = findChildById(childId);
  if (!child) {
    return { success: false, error: "Child not found" };
  }
  return { success: true, data: child.achievements.map((item) => ({ ...item })) };
}

/** Returns team rankings for a child. */
export async function getMockChildTeamRankings(childId: string): Promise<ApiResult<TeamRanking[]>> {
  await delay(MOCK_DELAY.short);
  const child = findChildById(childId);
  if (!child) {
    return { success: false, error: "Child not found" };
  }
  return { success: true, data: child.teamRankings.map((item) => ({ ...item })) };
}
