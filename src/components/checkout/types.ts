/** Shared form data types for the Academy checkout flow */

export interface PayerDetails {
  fullName: string;
  email: string;
}

export interface OrganizationDetails {
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface TeamDetails {
  teamName: string;
  accountEmail: string;
}

export interface AdditionalInfo {
  hearAboutUs: string;
  hearAboutUsOther: string;
  anythingElse: string;
  agreedToTerms: boolean;
}

export interface CheckoutFormData {
  payer: PayerDetails;
  organization: OrganizationDetails;
  team: TeamDetails;
  additional: AdditionalInfo;
}

export const HEAR_ABOUT_US_OPTIONS = [
  { value: "social_media", label: "Social Media" },
  { value: "search_engine", label: "Search Engine" },
  { value: "friend_referral", label: "Friend or Colleague" },
  { value: "coach_referral", label: "Coach or Academy" },
  { value: "event", label: "Event or Tournament" },
  { value: "advertisement", label: "Advertisement" },
  { value: "others", label: "Others" },
];
