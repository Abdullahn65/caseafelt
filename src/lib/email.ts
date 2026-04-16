import { Resend } from "resend";

let _resend: Resend | undefined;

export function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set");
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

/** Lazy proxy so existing `resend.emails.send(...)` calls keep working. */
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "CaseaFelt <hello@caseafelt.com>";
