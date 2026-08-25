"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { sendEnquiry, type EnquiryState } from "@/app/contact/actions";

/**
 * Enquiry form.
 *
 * Submits through a SERVER ACTION to Formcarry, so the form id never reaches
 * the browser. That was the reason for leaving Web3Forms: its free tier
 * rejects server-to-server calls (403 "Use our API in client side … Pro plan
 * is required"), which forced the key into the client bundle. Formcarry
 * permits backend submission on its free tier.
 *
 * Replaces the original <form action="mailto:…" method="post">, which made
 * browsers warn "this form is not secure" and silently dropped submissions in
 * several of them.
 *
 * Notes on choices here:
 *  - submit disables while pending, so a double-click cannot send twice
 *  - validation runs on the server; errors come back per-field and are wired
 *    to aria-invalid / aria-describedby so screen readers announce them
 *  - visible focus ring: the original fields used outline-none with only a
 *    border-colour change, a weak keyboard indicator
 */

const initialState: EnquiryState = { status: "idle" };

const fieldBase =
  "mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-ink transition " +
  "focus:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent";

const PROJECT_TYPES: Record<string, string> = {
  residential: "Residential build",
  commercial: "Commercial / industrial",
  renovation: "Renovation / interiors",
  pm: "Project management only",
  other: "Something else",
};

export function ContactForm() {
  const [state, formAction] = useActionState(sendEnquiry, initialState);
  const resultRef = useRef<HTMLElement | null>(null);
  // Callback ref so the same handle can point at either the success <div> or
  // the error <p> without casting between element types.
  const setResultRef = (el: HTMLElement | null) => {
    resultRef.current = el;
  };

  /**
   * Move focus and scroll to the result once the action settles.
   *
   * This is a general robustness measure, NOT a confirmed fix for the
   * "thank you is not shown" report — I could not reproduce that. Measured on
   * the live page at both 586px and 375px viewports, the success panel lands
   * fully inside the viewport at the scroll position someone reaches the
   * button from, so it should already be visible. Whatever that report was, it
   * was something else.
   *
   * What this does address is real but narrower: the result is ~600px up the
   * page from the top of the document, so anything that resets scroll on
   * submit (a non-JS form POST, which useActionState still supports) leaves
   * the visitor at the hero with the panel out of sight. Focus moves as well
   * as scroll so keyboard users land on the result instead of the top of the
   * document, and screen reader users get a landing point beyond the
   * role=status / role=alert announcement.
   *
   * Note the effect cannot help in the no-JS case it partly targets — no JS
   * means no effect. It covers slow hydration, not its absence.
   */
  useEffect(() => {
    if (state.status === "idle") return;
    const el = resultRef.current;
    if (!el) return;
    // preventScroll so focus() does not fight the smooth scroll below.
    el.focus({ preventScroll: true });
    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "center",
    });
  }, [state.status, state.message]);

  if (state.status === "ok") {
    return (
      <div
        ref={setResultRef}
        tabIndex={-1}
        role="status"
        className="rounded-[28px] border border-line/70 bg-paper/70 p-8 md:p-10 focus:outline-none"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
          Enquiry sent
        </p>
        <p className="mt-4 font-serif text-2xl leading-snug text-ink">
          {state.message ??
            "Thanks — we have your enquiry. We'll contact you as soon as possible."}
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

  return (
    <form
      action={formAction}
      noValidate
      className="space-y-6 rounded-[28px] border border-line/70 bg-paper/70 p-8 md:p-10"
    >
      {state.status === "error" && state.message && (
        <p
          ref={setResultRef}
          tabIndex={-1}
          role="alert"
          className="rounded-2xl border border-ink/15 bg-ink/[0.04] px-4 py-3 text-sm text-ink focus:outline-none"
        >
          {state.message}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Your name" name="name" autoComplete="name" required error={state.fieldErrors?.name} />
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          required
          error={state.fieldErrors?.email}
        />
      </div>

      <Field label="Phone (optional)" name="phone" type="tel" autoComplete="tel" inputMode="tel" />

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
          aria-invalid={state.fieldErrors?.message ? true : undefined}
          aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
          placeholder="Plot size, location, timelines, or anything you already know."
          className={fieldBase}
        />
        <FieldError id="message-error" error={state.fieldErrors?.message} />
      </label>

      {/* Honeypot — hidden from people, not from naive bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label>
          Company
          <input name="company" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <SubmitButton />

      <p className="text-xs text-ink/75">
        We reply inside 24 hours. Your details are used to answer this enquiry and nothing else.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-ink-2 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Sending…" : "Send enquiry"}
      {!pending && <span aria-hidden>→</span>}
    </button>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/75">
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
