"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Project" },
  { href: "/services", label: "Expertise" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isHome = pathname === "/";

  // On the homepage the header starts fully transparent so the opening
  // terrace frame of the walkthrough is uninterrupted, then fades in once
  // the visitor has scrolled ~8% of a viewport.
  const [scrolled, setScrolled] = useState(!isHome);
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.08);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Close menu when route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent scroll while mobile menu is open.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Shared pill chrome — dissolves at the very top of the homepage.
  const pill = scrolled
    ? "bg-paper/85 shadow-[0_1px_2px_rgba(14,59,57,0.05),0_10px_30px_-12px_rgba(14,59,57,0.15)] backdrop-blur-md"
    : "bg-transparent shadow-none";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6 sm:pt-5 lg:px-10 lg:pt-6">
        <div className="pointer-events-auto mx-auto flex max-w-7xl items-center gap-3">
          {/* Logo pill */}
          <Link
            href="/"
            aria-label="Deva Construction — home"
            className={`flex items-center gap-3 rounded-full px-5 py-2.5 transition-all duration-500 ${pill}`}
          >
            <Image
              src="/logo-mark.svg"
              alt=""
              width={40}
              height={40}
              className="h-9 w-auto"
              priority
            />
            <div className="hidden leading-none sm:block">
              <div className="font-serif text-[19px] tracking-tight text-ink">
                THE DEVA
              </div>
              <div className="mt-1 border-t border-ink/25 pt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-ink/80">
                Construction
              </div>
            </div>
          </Link>

          {/* Center nav pill — desktop only */}
          <nav
            aria-label="Primary"
            className={`hidden flex-1 items-center justify-center rounded-full px-8 py-4 transition-all duration-500 md:flex ${pill}`}
          >
            <ul className="flex items-center gap-10">
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    {/* inline-flex + min-h-[24px]: the label alone was 16px
                        tall, under the 24x24 CSS px WCAG 2.5.8 asks for. The
                        underline is positioned from the link box, so it moves
                        with the taller box rather than needing its own offset. */}
                    <Link
                      href={item.href}
                      className={`relative inline-flex min-h-[24px] items-center text-[13px] font-semibold uppercase tracking-[0.18em] transition ${
                        active ? "text-ink" : "text-ink/75 hover:text-ink"
                      }`}
                    >
                      {item.label}
                      {active && (
                        <span
                          aria-hidden
                          className="absolute inset-x-0 -bottom-2 mx-auto block h-[2px] w-6 rounded-full bg-accent"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* CTA — desktop */}
          <Link
            href="/contact"
            className="group hidden items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:bg-ink-2 md:inline-flex"
          >
            Start a project
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-[0_10px_30px_-12px_rgba(14,59,57,0.35)] transition hover:bg-ink-2 md:hidden"
          >
            {open ? <IconClose /> : <IconBurger />}
          </button>
        </div>
      </header>

      {/* Mobile overlay menu */}
      {open && (
        <div className="fixed inset-0 z-30 flex flex-col bg-ink px-6 pb-10 pt-28 text-paper md:hidden">
          <nav aria-label="Mobile primary">
            <ul className="space-y-2">
              {NAV.map((item, i) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-baseline justify-between border-b border-paper/15 py-4"
                    >
                      <span
                        className={`font-serif text-4xl ${
                          active ? "text-accent-deep italic" : "text-paper"
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="text-xs uppercase tracking-[0.2em] text-paper/50">
                        0{i + 1}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto pt-10">
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-full bg-accent-deep px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-paper transition hover:opacity-90"
            >
              Start a project →
            </Link>
            <div className="mt-6 space-y-1 text-sm text-paper/70">
              <a href="mailto:hello@devaconstructions.in" className="block hover:text-paper">
                hello@devaconstructions.in
              </a>
              <a href="tel:+919999999999" className="block hover:text-paper">
                +91 99999 99999
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function IconBurger() {
  return (
    <svg width="22" height="14" viewBox="0 0 22 14" fill="none" aria-hidden>
      <path d="M0 1H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 7H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M0 13H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M2 2L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 2L2 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
