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
    <footer className="mt-24 bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-4 lg:px-10">
        <div className="md:col-span-2">
          <div className="font-serif text-3xl leading-none text-paper">THE DEVA</div>
          <div className="mt-2 border-t border-paper/25 pt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-paper/80">
            Design and built to elegance
          </div>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-paper/70">
            A Bangalore-based construction firm working across residential, commercial, and
            renovation. Every build managed end-to-end, from the first drawing to the final
            walk-through.
          </p>
          <div className="mt-8 space-y-2 text-sm text-paper/85">
            <a href="mailto:hello@devaconstruction.in" className="block hover:text-paper hover:underline">
              hello@devaconstruction.in
            </a>
            <a href="tel:+919999999999" className="block hover:text-paper hover:underline">
              +91 99999 99999
            </a>
            <div className="text-paper/60">Bangalore, Karnataka</div>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-accent">
              {col.title}
            </div>
            <ul className="mt-4 space-y-3 text-sm">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-paper/80 transition hover:text-paper"
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
          <div>© {year} Deva Construction. All rights reserved.</div>
          <div>Built in Bangalore.</div>
        </div>
      </div>
    </footer>
  );
}
