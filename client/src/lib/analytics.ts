/**
 * Analytics Events Layer for StressGuru
 * Tracks key user interactions for conversion optimization.
 * Events are dispatched to the window for any analytics provider to consume.
 */

type AnalyticsEvent = {
  event: string;
  params: Record<string, string | number | boolean | undefined>;
};

function track(event: string, params: Record<string, string | number | boolean | undefined> = {}) {
  const payload: AnalyticsEvent = {
    event,
    params: {
      ...params,
      page_path: window.location.pathname,
      timestamp: Date.now(),
    },
  };

  // Dispatch custom event for any analytics listener
  window.dispatchEvent(new CustomEvent("sg_analytics", { detail: payload }));

  // Also push to dataLayer if available (GTM compatibility)
  if (typeof window !== "undefined" && (window as any).dataLayer) {
    (window as any).dataLayer.push({ event, ...params });
  }

  // Console in development
  if (import.meta.env.DEV) {
    console.log("[Analytics]", event, params);
  }
}

// App download clicks
export function trackAppDownload(placement: string, buttonText: string = "Download Free on iOS") {
  track("app_download_click", {
    placement,
    button_text: buttonText,
    destination_store: "apple_app_store",
    page_type: getPageType(),
  });
}

// Book purchase clicks
export function trackBookBuy(bookSlug: string, placement: string, destination: string = "amazon.com") {
  track("book_buy_click", {
    book_slug: bookSlug,
    placement,
    destination_domain: destination,
  });
}

// Pricing interactions
export function trackPricingView() {
  track("pricing_view", { page_type: "pricing" });
}

export function trackBillingToggle(period: "monthly" | "yearly") {
  track("billing_toggle", { billing_period: period });
}

export function trackPlanSelect(planName: string, billingPeriod: string, displayedPrice: number) {
  track("plan_select", {
    plan_name: planName,
    billing_period: billingPeriod,
    displayed_price: displayedPrice,
    currency: "USD",
  });
}

// Guru interactions
export function trackGuruPageView(guruName: string) {
  track("guru_page_view", { guru_name: guruName });
}

export function trackGuruDownloadClick(guruName: string, placement: string) {
  track("guru_download_click", { guru_name: guruName, source_page: window.location.pathname, placement });
}

// Stress assessment
export function trackAssessmentStart() {
  track("stress_assessment_start", {});
}

export function trackAssessmentStep(step: number) {
  track("stress_assessment_step", { step });
}

export function trackAssessmentComplete(profileType: string) {
  track("stress_assessment_complete", { profile_type: profileType });
}

// Email signup
export function trackEmailSignupView(formId: string, placement: string) {
  track("email_signup_view", { form_id: formId, placement });
}

export function trackEmailSignupSuccess(formId: string, leadMagnet: string) {
  track("email_signup_success", { form_id: formId, lead_magnet: leadMagnet });
}

// Outbound citation clicks
export function trackOutboundSourceClick(url: string) {
  track("outbound_source_click", { destination_url: url });
}

// AI referral detection
export function detectAIReferral(): string | null {
  const referrer = document.referrer.toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source")?.toLowerCase();

  if (utmSource === "chatgpt.com" || referrer.includes("chatgpt.com")) return "chatgpt";
  if (utmSource === "perplexity" || referrer.includes("perplexity.ai")) return "perplexity";
  if (referrer.includes("claude.ai")) return "claude";
  if (referrer.includes("copilot.microsoft.com")) return "copilot";
  if (referrer.includes("gemini.google.com")) return "gemini";
  return null;
}

// Helper
function getPageType(): string {
  const path = window.location.pathname;
  if (path === "/") return "home";
  if (path.startsWith("/gurus/")) return "guru";
  if (path.startsWith("/blogs/")) return "article";
  if (path === "/plans") return "pricing";
  if (path === "/app") return "product";
  if (path.startsWith("/books")) return "book";
  if (path.startsWith("/stress-")) return "assessment";
  return "page";
}

export default track;
