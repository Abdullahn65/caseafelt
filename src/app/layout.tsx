import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "CaseaFelt — Phone Cases Designed to Be Felt",
    template: "%s — CaseaFelt",
  },
  description:
    "Premium phone cases crafted from real felt materials. Tactile, minimal, honest design. Phone cases designed to be felt, not just seen.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://caseafelt.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CaseaFelt",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {/* Skip to main content — WCAG 2.1 AA */}
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
