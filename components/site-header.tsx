import Link from "next/link";
import Image from "next/image";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link
          href="/"
          aria-label="Deva Construction — home"
          className="flex items-center gap-3"
        >
          <Image
            src="/logo-mark.svg"
            alt=""
            width={32}
            height={32}
            className="h-8 w-auto"
            priority
          />
          <div className="leading-tight">
            <div className="font-serif text-lg tracking-tight text-ink">The Deva</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Construction
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-ink/75 transition hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://app.devaconstruction.in"
            className="hidden text-sm text-ink/75 transition hover:text-ink md:inline"
          >
            Sign in
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition hover:opacity-90"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
