"use client";

import { useState } from "react";

/**
 * Enquiry form.
 *
 * Submits to Web3Forms FROM THE BROWSER. That is not a shortcut — Web3Forms'
 * free tier rejects server-to-server calls outright:
 *
 *   403 "This method is not allowed. Use our API in client side or contact
 *        support with server IP address (Pro plan is required)"
 *
 * An earlier version posted from a Next server action to keep the key hidden,
 * and every submission failed with the above. Client-side is the supported
 * path on this plan, which is why the access key is a NEXT_PUBLIC_* var.
 *
 * On the key being public: Web3Forms is designed this way — their own docs put
 * it in a plain hidden input. It is a routing token, not a credential; it can
 * only cause mail to be sent TO the address that owns it. The honeypot below
 * plus their spam filtering are the mitigations. If it ever gets abused,
 * regenerate it at web3forms.com and update the env var — no code change.
 *
 * Replaces a <form action="mailto:…" method="post">, which made browsers warn
 * "this form is not secure" and silently dropped submissions in several of
 * them.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

const PROJECT_TYPES: Record<string, string> = {
  residential: "Residential build",
  commercial: "Commercial / industrial",
  renovation: "Renovation / interiors",
  pm: "Project management only",
  other: "Something else",
};

type Status = "idle" | "sending" | "ok" | "error";

const fieldBase =
  "mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-ink transition " +
  "focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent";

/** Loose on purpose: the only real test of an address is sending to it. */
const looksLikeEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [topError, setTopError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return; // belt and braces against double submit

    const fd = new FormData(e.currentTarget);
    const val = (k: string) => String(fd.get(k) ?? "").trim();

    const name = val("name");
    const email = val("email");
    const phone = val("phone");
    const type = val("type");
    const message = val("message");

    // Honeypot: hidden from people, tempting to naive bots. Pretend success so
    // the bot has no signal to retry, and send nothing.
    if (val("company")) {
      setStatus("ok");
      return;
    }

    const next: Record<string, string> = {};
    if (!name) next.name = "Please tell us your name.";
    if (!email) next.email = "We need an email to reply to.";
    else if (!looksLikeEmail(email)) next.email = "That doesn't look like an email address.";
    if (!message) next.message = "Tell us a little about the project.";
    else if (message.length < 10)
      next.message = "A sentence or two would help us give a useful first read.";

    if (Object.keys(next).length) {
      setErrors(next);
      setTopError("Please check the fields below.");
      setStatus("error");
      return;
    }

    setErrors({});
    setTopError(null);
    setStatus("sending");

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      // Our misconfiguration, not the visitor's problem — give them a way out.
      console.error("[contact] NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set.");
      setTopError(
        "Something went wrong on our end. Please email hello@devaconstructions.in and we'll pick it up straight away."
      );
      setStatus("error");
      return;
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
        setTopError(
          "We couldn't send that just now. Please email hello@devaconstructions.in and we'll pick it up straight away."
        );
        setStatus("error");
        return;
      }
      setStatus("ok");
    } catch (err) {
      console.error("[contact] Web3Forms request failed", err);
      setTopError(
        "We couldn't reach our mail service. Please email hello@devaconstructions.in and we'll pick it up straight away."
      );
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div role="status" className="rounded-[28px] border border-line/70 bg-paper/70 p-8 md:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
          Enquiry sent
        </p>
        <p className="mt-4 font-serif text-2xl leading-snug text-ink">
          Thanks — that&apos;s with us. We reply to every enquiry inside 24 hours.
        </p>
        <p className="mt-4 text-sm text-ink/70">
          If it&apos;s urgent, WhatsApp is usually fastest —{" "}
          {/* TODO(real-details): placeholder number. */}
          <a href="tel:+919999999999" className="underline underline-offset-4 hover:text-accent-deep">
            +91 99999 99999
          </a>
          .
        </p>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-[28px] border border-line/70 bg-paper/70 p-8 md:p-10"
    >
      {topError && (
        <p
          role="alert"
          className="rounded-2xl border border-ink/15 bg-ink/[0.04] px-4 py-3 text-sm text-ink"
        >
          {topError}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required error={errors.name} />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          error={errors.email}
        />
      </div>

      <Field
        label="Phone (optional)"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
      />

      <label className="block text-sm">
        <Label>Project type</Label>
        <select name="type" defaultValue="residential" className={fieldBase}>
          {Object.entries(PROJECT_TYPES).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <Label>
          Tell us about the project <Req />
        </Label>
        <textarea
          name="message"
          rows={5}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          placeholder="Plot size, location, timelines, or anything you already know."
          className={fieldBase}
        />
        <FieldError id="message-error" error={errors.message} />
      </label>

      {/* Honeypot — hidden from people, not from naive bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send enquiry"}
        {!sending && <span aria-hidden>→</span>}
      </button>

      <p className="text-xs text-ink/60">
        We reply inside 24 hours. Your details are used to answer this enquiry and nothing else.
      </p>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">
      {children}
    </span>
  );
}

function Req() {
  return (
    <span className="text-accent-deep" aria-hidden>
      *
    </span>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <span id={id} className="mt-2 block text-xs text-ink/80">
      {error}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  error,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text";
}) {
  const errorId = `${name}-error`;
  return (
    <label className="block text-sm">
      <Label>
        {label} {required && <Req />}
      </Label>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldBase}
      />
      <FieldError id={errorId} error={error} />
    </label>
  );
}
