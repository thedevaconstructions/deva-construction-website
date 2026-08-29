import Link from "next/link";

const COLS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/projects", label: "Project" },
      { href: "/services", label: "Expertise" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Clients",
    links: [
      { href: "https://app.devaconstructions.in", label: "Sign in" },
      { href: "https://app.devaconstructions.in/privacy", label: "Privacy policy" },
      { href: "https://app.devaconstructions.in/delete-account", label: "Delete account" },
      { href: "https://app.devaconstructions.in/download", label: "Android app" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl leading-none text-paper">THE DEVA</div>
          <div className="mt-2 border-t border-paper/25 pt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-paper/80">
            Building with precision. Delivering with trust.
          </div>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/70">
            A Bangalore-based construction firm building residential, commercial, and renovation
            projects with end-to-end site management. From planning and foundation to fit-out and
            handover, every trade is coordinated under one roof.
          </p>
          <div className="mt-8 space-y-2 text-sm text-paper/85">
            {/* min-h-[24px] + inline-flex items-center: WCAG 2.5.8 asks for a
                24x24 CSS px target. These were 20px tall, which on a phone is
                a fiddly tap between two adjacent links. */}
            <a
              href="mailto:hello@devaconstructions.in"
              className="inline-flex min-h-[24px] items-center hover:text-paper hover:underline"
            >
              hello@devaconstructions.in
            </a>
            <a
              href="tel:+919980144405"
              className="inline-flex min-h-[24px] items-center hover:text-paper hover:underline"
            >
              +91 99801 44405
            </a>
            <div className="text-paper/70">Vidyaranyapura, Bengaluru</div>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-deep">
              {col.title}
            </div>
            <ul className="mt-2 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-[24px] items-center py-1 text-paper/80 transition hover:text-paper"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-paper/15">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-paper/50 md:flex-row md:items-center lg:px-10">
          <div>© {year} Deva Construction · Bangalore, India</div>
          <div>Built in Bangalore.</div>
        </div>
      </div>
    </footer>
  );
}
