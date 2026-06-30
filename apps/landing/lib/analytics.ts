"use client";

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

type PostHogLike = {
  capture: (event: string, properties?: AnalyticsProperties) => void;
};

type AnalyticsWindow = Window & {
  posthog?: PostHogLike;
};

export function trackEvent(event: string, properties?: AnalyticsProperties) {
  if (typeof window === "undefined") {
    return;
  }

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.posthog?.capture(event, properties);
}
