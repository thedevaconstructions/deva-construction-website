import Link from "next/link";

const COLS = [
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/projects", label: "Projects" },
      { href: "/services", label: "Services" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Clients",
    links: [
      { href: "https://app.devaconstruction.in", label: "Sign in" },
      { href: "https://app.devaconstruction.in/privacy", label: "Privacy policy" },
      { href: "https://app.devaconstruction.in/delete-account", label: "Delete account" },
      { href: "https://app.devaconstruction.in/download", label: "Android app" },
    ],
  },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-line/70 bg-bone/60">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl leading-none text-ink">The Deva</div>
          <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
            Design and built to elegance
          </div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
            A Bangalore-based construction firm working across residential, commercial, and
            renovation projects. Every build managed end-to-end, from the first drawing to the
            final walk-through.
          </p>
          <div className="mt-6 space-y-2 text-sm text-ink/80">
            <a href="mailto:hello@devaconstruction.in" className="block hover:underline">
              hello@devaconstruction.in
            </a>
            <a href="tel:+919999999999" className="block hover:underline">
              +91 99999 99999
            </a>
            <div className="text-muted">Bangalore, Karnataka</div>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted">
              {col.title}
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-ink/80 transition hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-line/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted md:flex-row md:items-center lg:px-10">
          <div>© {year} Deva Construction. All rights reserved.</div>
          <div>Built in Bangalore.</div>
        </div>
      </div>
    </footer>
  );
}
