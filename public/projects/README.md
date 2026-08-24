# Project photographs

Put project photos in **this folder**, then list their file names in
`content/projects.ts` under that project's `photos:` line.

## Example

1. Copy `front-elevation.jpg` and `courtyard.jpg` into this folder.
2. In `content/projects.ts`, find the project and add:

```ts
photos: ["front-elevation.jpg", "courtyard.jpg"],
```

The **first** photo becomes the project's cover — shown on its card on the
home and projects pages, and across the top of its own page. The rest appear
lower down that page.

## Rules

- **File names only** in `content/projects.ts` — no folders, no `public/`,
  no web address. The rest of the path is added for you.
- **Lowercase, hyphens, no spaces.** `front-elevation.jpg`, not
  `Front Elevation.JPG`. Capitals and spaces work on Windows but break on the
  server the site runs on, which is a confusing failure to chase later.
- Accepted formats: `.jpg` `.jpeg` `.png` `.webp` `.avif`
- Straight-off-the-camera files are fine — they are resized automatically for
  phones and laptops. Keep them under about 5 MB each so the repository does
  not get heavy.
- A project with no `photos` line falls back to the animated sky placeholder.
  Nothing breaks; it simply looks as it does today.

Mistakes here stop the site from building rather than publishing something
broken, and the error message says what is wrong.
