/** Store URLs for app downloads. */
export const APP_STORE_URL =
  "https://apps.apple.com/in/app/aim-football/id6757197350";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.aimreltechnology.aim&pcampaignid=web_share";

export type DownloadPlatform = "ios" | "android" | "mac" | "windows" | "other";

/** Detects the user's platform for V1 player redirection. */
export function getDownloadPlatform(
  userAgent: string = typeof navigator === "undefined" ? "" : navigator.userAgent
): DownloadPlatform {
  const normalizedUserAgent = userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(normalizedUserAgent)) return "ios";
  if (/android/.test(normalizedUserAgent)) return "android";
  if (/mac/.test(normalizedUserAgent)) return "mac";
  if (/windows/.test(normalizedUserAgent)) return "windows";

  return "other";
}

/** Resolves the correct store URL for the current device. */
export function getDownloadStoreUrl(
  userAgent: string = typeof navigator === "undefined" ? "" : navigator.userAgent
) {
  const platform = getDownloadPlatform(userAgent);
  return platform === "ios" || platform === "mac" ? APP_STORE_URL : PLAY_STORE_URL;
}

/** Redirects the current tab to the correct store. */
export function redirectToDownloadStore() {
  window.location.assign(getDownloadStoreUrl());
}

/** Opens the correct store in a new tab for marketing CTAs. */
export function openDownloadStore() {
  window.open(getDownloadStoreUrl(), "_blank", "noopener,noreferrer");
}
