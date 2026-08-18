import Link from "next/link";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-6 text-center lg:px-10">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">Error 404</p>
      <h1 className="mt-4 font-serif text-5xl leading-tight tracking-tight text-ink md:text-6xl">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-muted">
        The address you tried isn&apos;t on the site — moved, renamed, or never built.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition hover:opacity-90"
        >
          Back home
        </Link>
        <Link
          href="/projects"
          className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-bone"
        >
          See projects
        </Link>
      </div>
    </section>
  );
}
