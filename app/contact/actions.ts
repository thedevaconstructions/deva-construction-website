"use server";

/**
 * Enquiry submission.
 *
 * Replaces a `<form action="mailto:… " method="post">`, which browsers warn
 * about ("this form is not secure") because a mailto POST leaves over an
 * unencrypted channel — and which several browsers simply drop, so enquiries
 * were being lost silently.
 *
 * Posts to Web3Forms from the server, so the access key never reaches the
 * browser and the submission is a normal HTTPS request.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

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

  // Honeypot: a field hidden from people but not from naive bots. Anything
  // filling it gets a success response without a send, so the bot does not
  // learn to retry.
  if (value("company")) return { status: "ok", message: "Thanks — we'll be in touch." };

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

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // Misconfiguration, not the visitor's fault — never blame them, and give
    // them a route that works right now.
    console.error(
      "[contact] WEB3FORMS_ACCESS_KEY is not set — enquiry was not sent. " +
        "Add it in Vercel project settings and in .env.local for local dev."
    );
    return {
      status: "error",
      message:
        "Something went wrong on our end. Please email hello@devaconstructions.in and we'll pick it up straight away.",
    };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New enquiry from ${name} — ${PROJECT_TYPES[type] ?? "Enquiry"}`,
        from_name: "Deva Construction website",
        name,
        email,
        phone: phone || "Not given",
        project_type: PROJECT_TYPES[type] ?? type,
        message,
      }),
    });

    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;

    if (!res.ok || !data?.success) {
      console.error("[contact] Web3Forms rejected the submission", res.status, data);
      return {
        status: "error",
        message:
          "We couldn't send that just now. Please email hello@devaconstructions.in and we'll pick it up straight away.",
      };
    }

    return {
      status: "ok",
      message: "Thanks — that's with us. We reply to every enquiry inside 24 hours.",
    };
  } catch (err) {
    console.error("[contact] Web3Forms request failed", err);
    return {
      status: "error",
      message:
        "We couldn't reach our mail service. Please email hello@devaconstructions.in and we'll pick it up straight away.",
    };
  }
}
