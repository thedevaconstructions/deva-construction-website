export const metadata = {
  title: "Contact",
  description:
    "Start a project with Deva Construction. Email, phone, or send us your plot and brief — we reply inside 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-line/60">
        <div className="mx-auto max-w-4xl px-6 py-24 lg:px-10">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
            Say hello
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.04] tracking-tight text-ink md:text-6xl">
            Tell us about the build.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">
            A plot, a sketch, a wishlist, or nothing more than an idea — send it and we reply
            inside 24 hours with a first-read from the team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
        <div className="grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <div className="space-y-8 text-sm">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Email
              </div>
              <a
                href="mailto:hello@devaconstruction.in"
                className="mt-2 block font-serif text-2xl text-ink hover:underline"
              >
                hello@devaconstruction.in
              </a>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Phone / WhatsApp
              </div>
              <a
                href="tel:+919999999999"
                className="mt-2 block font-serif text-2xl text-ink hover:underline"
              >
                +91 99999 99999
              </a>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Studio
              </div>
              <address className="mt-2 not-italic text-ink/80">
                Deva Construction
                <br />
                Bangalore, Karnataka 560000
                <br />
                India
              </address>
            </div>
            <div>
              <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Hours
              </div>
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
            className="space-y-6 rounded-2xl border border-line/70 bg-paper p-8 md:p-10"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                  Your name
                </span>
                <input
                  name="name"
                  required
                  className="w-full border-b border-line bg-transparent py-2 text-ink outline-none transition focus:border-ink"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full border-b border-line bg-transparent py-2 text-ink outline-none transition focus:border-ink"
                />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Phone (optional)
              </span>
              <input
                name="phone"
                className="w-full border-b border-line bg-transparent py-2 text-ink outline-none transition focus:border-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Project type
              </span>
              <select
                name="type"
                className="w-full border-b border-line bg-transparent py-2 text-ink outline-none transition focus:border-ink"
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
              <span className="mb-2 block text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
                Tell us about the project
              </span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="Plot size, location, timelines, or anything you already know."
                className="w-full border-b border-line bg-transparent py-2 text-ink outline-none transition focus:border-ink"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:opacity-90"
            >
              Send enquiry
              <span aria-hidden>→</span>
            </button>
            <p className="text-xs text-muted">
              This is a placeholder form — it opens your email app. We&apos;ll swap it for a real
              server-backed form (Resend / Formspree / etc.) before launch.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
