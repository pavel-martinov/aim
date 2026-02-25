/** Store URLs for app downloads */
export const APP_STORE_URL =
  "https://apps.apple.com/in/app/aim-football/id6757197350";
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.aimreltechnology.aim&pcampaignid=web_share";

/** Detects OS and opens appropriate store in new tab */
export function openDownloadStore() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isApple = /mac|iphone|ipad|ipod/.test(userAgent);
  window.open(isApple ? APP_STORE_URL : PLAY_STORE_URL, "_blank");
}
