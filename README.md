# Deva Construction — Website

The public marketing/showcase site for [Deva Construction](https://devaconstruction.in).
Sits at the **root domain**; the client dashboard and admin app live at
`app.devaconstruction.in` (separate repo).

## Stack

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- Deployed to **Vercel**

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy

Auto-deploys on push to `main` via Vercel. Preview builds fire on every branch.

## Routes

| Route | What |
|---|---|
| `/` | Home — hero, featured projects, services, CTA |
| `/projects` | Project index (with placeholder tiles) |
| `/services` | Four services broken out |
| `/about` | Firm intro, principles, stats |
| `/contact` | Contact form (opens email app — swap for Resend/Formspree at launch) |
| `*` | Custom `/not-found` |

## Placeholders to replace before launch

- Project photography — every `bg-bone` tile in `/projects` needs a real image
- Real phone number (currently `+91 99999 99999`)
- Real email (`hello@devaconstruction.in` — needs the inbox set up)
- Contact form — swap `mailto:` for a backed endpoint
- Testimonial on home page
- Real project data (address / area / photos / plans)

## Related repos

- App: [deva-construction](https://github.com/thedevaconstructions/deva-construction) — the management dashboard at `app.devaconstruction.in`
