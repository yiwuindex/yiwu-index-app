// Consent-gated event tracking. Fires to GA4 / Meta / TikTok only after cookie consent.
type Ev = "signup" | "checkout_started" | "payment_success" | "premium_unlocked";
export function track(event: Ev, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (localStorage.getItem("cookie_consent") !== "granted") return;
  const w = window as any;
  if (w.gtag) w.gtag("event", event, params);
  if (w.fbq) w.fbq("trackCustom", event, params);
  if (w.ttq) w.ttq.track(event, params);
}
