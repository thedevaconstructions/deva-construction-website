"use server";

/**
 * Enquiry submission, via Formcarry.
 *
 * Runs on the SERVER, which is the reason we moved here from Web3Forms.
 * Web3Forms' free tier rejects server-to-server calls outright —
 *   403 "This method is not allowed. Use our API in client side or contact
 *        support with server IP address (Pro plan is required)"
 * — which forced the access key into the browser bundle. Formcarry allows
 * backend submission on its free tier, so FORMCARRY_FORM_ID stays server-side
 * and never reaches the client.
 *
 * Free tier is 50 submissions/month, which is comfortably above this site's
 * expected enquiry volume. Submissions are also retained in the Formcarry
 * dashboard, so an enquiry is recoverable even if the notification email is
 * lost — the previous relay-only setup had no such record.
 *
 * Endpoint contract (formcarry.com/docs/code-examples/fetch):
 *   POST https://formcarry.com/s/{formId}
 *   Content-Type: application/json, Accept: application/json
 */

export type EnquiryState = {
  status: "idle" | "ok" | "error";
  /** Message shown to the visitor. */
  message?: string;
  /** Per-field problems, keyed by input name. */
  fieldErrors?: Record<string, string>;
};

const PROJECT_TYPES: Record<string, string> = {
  residential: "Residential build",
  commercial: "Commercial / industrial",
  renovation: "Renovation / interiors",
  pm: "Project management only",
  other: "Something else",
};

const FALLBACK_EMAIL = "hello@devaconstructions.in";

/**
 * Shown to the visitor once the enquiry is away.
 *
 * The honeypot branch returns this exact string too. If a trapped bot got a
 * different message it would learn it had been caught and could retry with
 * the hidden field left blank, so the two paths must stay identical — hence
 * one constant rather than two literals that drift apart.
 */
const SUCCESS_MESSAGE =
  "Thanks — we have your enquiry. We'll contact you as soon as possible.";

export async function sendEnquiry(
  _prev: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  const value = (k: string) => String(formData.get(k) ?? "").trim();

  const name = value("name");
  const email = value("email");
  const phone = value("phone");
  const type = value("type");
  const message = value("message");

  // Honeypot: hidden from people, tempting to naive bots. Report success
  // without sending, so the bot gets no signal to retry.
  if (value("company")) {
    return { status: "ok", message: SUCCESS_MESSAGE };
  }

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "Please tell us your name.";
  if (!email) fieldErrors.email = "We need an email to reply to.";
  // Deliberately loose: the only reliable test of an address is sending to it,
  // and over-strict patterns reject valid addresses.
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fieldErrors.email = "That doesn't look like an email address.";
  if (!message) fieldErrors.message = "Tell us a little about the project.";
  else if (message.length < 10)
    fieldErrors.message = "A sentence or two would help us give a useful first read.";

  if (Object.keys(fieldErrors).length) {
    return { status: "error", message: "Please check the fields below.", fieldErrors };
  }

  const formId = process.env.FORMCARRY_FORM_ID;
  if (!formId) {
    // Our misconfiguration, not the visitor's fault. Never blame them, and
    // always hand them a route that works right now.
    console.error(
      "[contact] FORMCARRY_FORM_ID is not set — enquiry was NOT sent. " +
        "Add it in Vercel project settings and .env.local for local dev."
    );
    return {
      status: "error",
      message: `Something went wrong on our end. Please email ${FALLBACK_EMAIL} and we'll pick it up straight away.`,
    };
  }

  try {
    const res = await fetch(`https://formcarry.com/s/${formId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        name,
        email,
        phone: phone || "Not given",
        project_type: PROJECT_TYPES[type] ?? type,
        message,
        _subject: `New enquiry from ${name} — ${PROJECT_TYPES[type] ?? "Enquiry"}`,
      }),
    });

    // Formcarry's documented example only inspects the HTTP response, and the
    // JSON body shape is not pinned down in their docs. So: trust the status
    // code, but if a body does come back and explicitly says error, believe it.
    const data = (await res.json().catch(() => null)) as
      | { status?: string; code?: number; message?: string; title?: string }
      | null;

    const explicitFailure =
      data?.status === "error" || (typeof data?.code === "number" && data.code >= 400);

    if (!res.ok || explicitFailure) {
      console.error("[contact] Formcarry rejected the submission", res.status, data);
      return {
        status: "error",
        message: `We couldn't send that just now. Please email ${FALLBACK_EMAIL} and we'll pick it up straight away.`,
      };
    }

    return { status: "ok", message: SUCCESS_MESSAGE };
  } catch (err) {
    console.error("[contact] Formcarry request failed", err);
    return {
      status: "error",
      message: `We couldn't reach our mail service. Please email ${FALLBACK_EMAIL} and we'll pick it up straight away.`,
    };
  }
}
