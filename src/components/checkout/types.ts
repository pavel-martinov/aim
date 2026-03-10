/** Shared form data types for the Academy checkout flow */

export interface ContactDetails {
  fullName: string;
  email: string;
  organizationName: string;
  mobileNumber: string;
  hearAboutUs: string;
  hearAboutUsOther: string;
  comment: string;
  agreedToTerms: boolean;
}

export interface CheckoutFormData {
  contact: ContactDetails;
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
