import Image from "next/image";
import { CardCloud } from "@/components/card-cloud";
import { coverPhoto, photoAlt, type Project } from "@/content/projects";

/**
 * The image that represents a project — on its card and at the top of its
 * page.
 *
 * Shows the project's first photograph if it has one, and falls back to the
 * animated sky with the project's initials if it does not. That fallback is
 * the point: photographs arrive project by project, so the site has to look
 * deliberate whether a given project has one yet or not, with no gap and no
 * broken-image icon.
 *
 * One component for card and hero alike, so a photo added to
 * content/projects.ts appears everywhere at once rather than in whichever
 * places someone remembered to wire up.
 */
export function ProjectMedia({
  project,
  index = 0,
  priority = false,
  sizes,
}: {
  project: Project;
  /** Position in a grid — varies the fallback sky so cards differ. */
  index?: number;
  /** Set on the largest above-the-fold image only (the detail page hero). */
  priority?: boolean;
  /**
   * How wide this image renders, so the browser can pick a size instead of
   * downloading a desktop-width file onto a phone.
   */
  sizes: string;
}) {
  const cover = coverPhoto(project);

  if (!cover) {
    return (
      <>
        <CardCloud index={index} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-7xl italic text-ink/25">
            {initialsOf(project.name)}
          </span>
        </div>
      </>
    );
  }

  return (
    <Image
      src={cover}
      alt={photoAlt(project)}
      fill
      sizes={sizes}
      priority={priority}
      className="object-cover"
    />
  );
}

/** First letters of the first two words, used by the no-photo fallback. */
export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2);
}
