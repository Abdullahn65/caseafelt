"use client";

import posthog from "posthog-js";

/**
 * Initialize PostHog client-side. Called once in the root layout provider.
 */
export function initAnalytics() {
  if (
    typeof window !== "undefined" &&
    process.env.NEXT_PUBLIC_POSTHOG_KEY
  ) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: true,
      capture_pageleave: true,
    });
  }
}

/**
 * Track a custom event. Used across the storefront for:
 * - product_viewed
 * - add_to_cart
 * - checkout_started
 * - purchase_completed
 * - newsletter_signup
 * - contact_form_submitted
 */
export function trackEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (typeof window !== "undefined") {
    posthog.capture(event, properties);
  }
}

/**
 * Identify a user after login. Connects anonymous events to user profile.
 */
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== "undefined") {
    posthog.identify(userId, traits);
  }
}
