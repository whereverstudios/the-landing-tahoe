# The Landing Resort & Spa — site rebuild

A rebuild of [thelandingtahoe.com](https://www.thelandingtahoe.com) by Wherever Studios.

Astro 5 + Tailwind 4, built on the Cosmic Themes Galaxy v7 template. Static output, deployed to GitHub Pages.

**Live:** https://whereverstudios.github.io/the-landing-tahoe/

## Run locally

```bash
npm install
npm run dev          # http://localhost:4321/the-landing-tahoe/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages.

To move to a custom domain: set `site` in `astro.config.mjs` to the domain, remove `base`, update `defaultImage.src` in `src/config/en/siteData.json.ts` and the sitemap line in `public/robots.txt`, then add the domain under the repo's Pages settings.

## Where things live

| What | Where |
| --- | --- |
| Pages | `src/pages/` (`index`, `stay`, `dine`, `spa`, `activities`, `gather`, `offers`) |
| Section components | `src/components/Landing/` |
| Copy and data (rooms, offers, activities, venues, FAQs) | `src/config/en/landingData.ts` |
| Nav links | `src/config/en/navData.json.ts` |
| Design tokens (colors, fonts) | `src/styles/tailwind-theme.css`, `src/styles/global.css` |
| Section styles | `src/styles/landing.css` |
| Client behaviour (season toggle, booking dates, contour map) | `src/js/landing.ts` |
| Photography | `src/assets/images/landing/` (the resort's own photos) |

The Summer / Winter toggle in the nav swaps the hero and the activities grid; it defaults from the current month and remembers the visitor's choice.

Booking hands off to the resort's existing engine at `thelandingtahoe.com/book/` with the chosen dates and guests.
