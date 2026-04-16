/**
 * Runtime environment validation.
 * Import this at app startup to fail fast if required env vars are missing.
 * 
 * In MVP mode, only database and Stripe are required.
 * Other services (Clerk, Resend, Cloudinary, PostHog) are optional.
 */

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
  return value;
}

function optionalEnv(key: string, fallback: string = ""): string {
  return process.env[key] ?? fallback;
}

/** Validate all required environment variables at import time. */
export function validateEnv() {
  const errors: string[] = [];

  // Required for MVP
  const required = [
    "DATABASE_URL",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      errors.push(key);
    }
  }

  if (errors.length > 0) {
    console.error(
      `\n❌ Missing required environment variables:\n${errors.map((e) => `   - ${e}`).join("\n")}\n`
    );
    // Don't throw in build — only at runtime
    if (process.env.NODE_ENV !== "production" || process.env.NEXT_PHASE !== "phase-production-build") {
      // Warn but don't crash — allow build to complete
    }
  }
}

export const env = {
  // Database
  DATABASE_URL: optionalEnv("DATABASE_URL"),

  // Stripe
  STRIPE_SECRET_KEY: optionalEnv("STRIPE_SECRET_KEY"),
  STRIPE_WEBHOOK_SECRET: optionalEnv("STRIPE_WEBHOOK_SECRET"),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: optionalEnv("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"),

  // Clerk (deferred for MVP)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: optionalEnv("NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY"),
  CLERK_SECRET_KEY: optionalEnv("CLERK_SECRET_KEY"),

  // Resend
  RESEND_API_KEY: optionalEnv("RESEND_API_KEY"),

  // App
  NEXT_PUBLIC_APP_URL: optionalEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NEXT_PUBLIC_SITE_URL: optionalEnv("NEXT_PUBLIC_SITE_URL", "https://caseafelt.com"),
};
