import { Reveal } from "@/components/reveal";

export const metadata = {
  title: "Contact",
  description:
    "Start a project with Deva Construction. Email, phone, or send us your plot and brief — we reply inside 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <section>
        <div className="mx-auto max-w-5xl px-6 pb-16 pt-8 lg:px-10">
          <Reveal duration={500} y={12}>
            <p className="eyebrow-dot text-[11px] font-semibold uppercase tracking-[0.24em] text-accent">
              Say hello
            </p>
          </Reveal>
          <Reveal delay={120} duration={900}>
            <h1 className="mt-6 font-serif text-5xl leading-[1.02] tracking-tight text-ink md:text-7xl">
              Tell us about the <span className="italic">build.</span>
            </h1>
          </Reveal>
          <Reveal delay={280} duration={800}>
            <p className="mt-8 max-w-xl text-lg text-ink/75">
              A plot, a sketch, a wishlist, or nothing more than an idea — send it and we reply
              inside 24 hours with a first-read from the team.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 lg:px-10">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8 text-sm">
            <Detail
              label="Email"
              href="mailto:hello@devaconstruction.in"
              value="hello@devaconstruction.in"
            />
            <Detail
              label="Phone / WhatsApp"
              href="tel:+919999999999"
              value="+91 99999 99999"
            />
            <div>
              <Label>Studio</Label>
              <address className="mt-2 not-italic text-ink/80">
                Deva Construction
                <br />
                Bangalore, Karnataka 560000
                <br />
                India
              </address>
            </div>
            <div>
              <Label>Hours</Label>
              <p className="mt-2 text-ink/80">
                Mon – Sat · 9:30 to 6:30 IST
                <br />
                Sunday closed
              </p>
            </div>
          </div>

          <form
            action="mailto:hello@devaconstruction.in"
            method="post"
            encType="text/plain"
            className="space-y-6 rounded-[28px] border border-line/70 bg-paper/70 p-8 md:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Your name" name="name" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="Phone (optional)" name="phone" />
            <label className="block text-sm">
              <Label>Project type</Label>
              <select
                name="type"
                className="mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-ink outline-none transition focus:border-ink"
                defaultValue="residential"
              >
                <option value="residential">Residential build</option>
                <option value="commercial">Commercial / industrial</option>
                <option value="renovation">Renovation / interiors</option>
                <option value="pm">Project management only</option>
                <option value="other">Something else</option>
              </select>
            </label>
            <label className="block text-sm">
              <Label>Tell us about the project</Label>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Plot size, location, timelines, or anything you already know."
                className="mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-ink outline-none transition focus:border-ink"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-ink-2"
            >
              Send enquiry <span aria-hidden>→</span>
            </button>
            <p className="text-xs text-ink/60">
              Placeholder form — it opens your email app. We&apos;ll swap it for a real server-backed
              form (Resend / Formspree) before launch.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-ink/60">
      {children}
    </span>
  );
}

function Detail({ label, href, value }: { label: string; href: string; value: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <a href={href} className="mt-2 block font-serif text-2xl text-ink hover:text-accent">
        {value}
      </a>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <Label>{label}</Label>
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 w-full border-b border-ink/25 bg-transparent py-2 text-ink outline-none transition focus:border-ink"
      />
    </label>
  );
}
