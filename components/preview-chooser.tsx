import Link from "next/link";

const OPTIONS = [
  { href: "/", label: "Current (3D city)" },
  { href: "/preview/boxes", label: "Background Boxes" },
  { href: "/preview/aurora", label: "Aurora" },
];

export function PreviewChooser({ active }: { active: "current" | "boxes" | "aurora" }) {
  const map = { current: "/", boxes: "/preview/boxes", aurora: "/preview/aurora" } as const;
  return (
    <div className="pointer-events-auto sticky top-24 z-30 mx-auto mt-6 flex w-fit max-w-full items-center gap-2 rounded-full border border-line/70 bg-paper/85 px-3 py-2 shadow-[0_10px_30px_-12px_rgba(28,25,23,0.15)] backdrop-blur-md lg:top-28">
      <span className="pl-2 pr-1 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ink/60">
        Preview
      </span>
      {OPTIONS.map((opt) => {
        const isActive = opt.href === map[active];
        return (
          <Link
            key={opt.href}
            href={opt.href}
            className={`rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition ${
              isActive
                ? "bg-ink text-paper"
                : "text-ink/70 hover:bg-bone hover:text-ink"
            }`}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}
