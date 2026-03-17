/**
 * Shared constants used across the application.
 * Extracted from mockUser.ts to separate config from mock data.
 */

export * from "./plans";

/** Division display configuration */
export const DIVISION_CONFIG = {
  bronze: { label: "Bronze", color: "#CD7F32" },
  silver: { label: "Silver", color: "#C0C0C0" },
  gold: { label: "Gold", color: "#FFD700" },
  platinum: { label: "Platinum", color: "#E5E4E2" },
  diamond: { label: "Diamond", color: "#B9F2FF" },
} as const;

export type Division = keyof typeof DIVISION_CONFIG;

/** Football positions for profile dropdowns */
export const FOOTBALL_POSITIONS = [
  "Goalkeeper",
  "Right Back",
  "Left Back",
  "Center Back",
  "Defensive Midfielder",
  "Central Midfielder",
  "Attacking Midfielder",
  "Right Midfielder/Winger",
  "Left Midfielder/Winger",
  "Second Striker/Attacking Midfielder",
  "Striker",
] as const;

/** Countries list for profile dropdowns */
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Brazil",
  "Argentina",
  "Mexico",
  "Japan",
  "South Korea",
  "Other",
] as const;

/** Pre-made avatar options for Netflix-style picker */
export const PRESET_AVATARS = [
  "https://api.dicebear.com/9.x/personas/png?seed=Alex&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Jordan&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Taylor&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Riley&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Sam&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Cameron&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Casey&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Hayden&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Morgan&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Quinn&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Blake&size=256",
  "https://api.dicebear.com/9.x/personas/png?seed=Parker&size=256",
] as const;
