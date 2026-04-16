import type { ReactNode } from "react";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-page section-padding">
      <div className="max-w-prose mx-auto prose-warm">{children}</div>
    </div>
  );
}
