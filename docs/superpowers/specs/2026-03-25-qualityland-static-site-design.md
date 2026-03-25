# Quality Land Static Site Generator — Design Spec

## Goal

Recreate qualityland.lt as a static site built from editable data files (JSON/Markdown), using Node.js + Nunjucks templates and a build script that outputs deployable HTML for GitHub Pages.

## Scope

Full site recreation:
- Main single-page site (hero, about, speakers grid, schedule timeline, fail nights, sponsors, tickets, venue, footer)
- 11 individual speaker detail pages with bio, photo, LinkedIn link (speaker pages show bio only, NOT talk info — matching original site)
- Simona Laiconaitė appears in the schedule (Fail Nights host) but does NOT have a speaker detail page — handled as a schedule-only entry
- Sponsorship packages page (5 tiers: Signal Emitter, Signal Amplifier, Signal Supporter, Fail Nights Supporter, Coffee Break Sponsor)
- Privacy policy and Terms & Conditions pages
- All images downloaded locally (no external CDN dependencies)

## Project Structure

```
qualityland/
├── data/
│   ├── site.json              # Site-wide config (title, date, venue, social, organizer)
│   ├── speakers.json          # Speaker objects (slug, name, title, company, country, photo, linkedin, bio, talk)
│   ├── schedule.json          # Time slots (time, type, number, title, speakerSlug, icon)
│   ├── sponsors.json          # Grouped by tier
│   ├── tickets.json           # Ticket types with prices and features
│   └── sponsorship.json       # Sponsorship package tiers and benefits
├── content/
│   ├── about.md
│   ├── privacy-policy.md
│   ├── terms-and-conditions.md
│   └── fail-nights.md
├── templates/
│   ├── base.njk               # Base HTML layout (head, nav, footer)
│   ├── index.njk              # Main page (extends base, includes partials)
│   ├── speaker.njk            # Speaker detail page
│   ├── sponsorship.njk        # Sponsorship packages page
│   ├── legal.njk              # Shared template for privacy/terms
│   └── partials/
│       ├── nav.njk
│       ├── hero.njk
│       ├── about.njk
│       ├── speakers-grid.njk
│       ├── schedule.njk
│       ├── fail-nights.njk
│       ├── sponsors.njk
│       ├── tickets.njk
│       ├── venue.njk
│       └── footer.njk
├── assets/
│   ├── images/
│   │   ├── speakers/          # Speaker photos (slug-based naming)
│   │   ├── icons/             # Schedule icons (microphone, cup, lunch, etc.)
│   │   ├── logos/             # Partner/sponsor logos, site logo, footer logo
│   │   └── backgrounds/       # Hero and schedule background images
│   ├── css/
│   │   └── style.css          # Single CSS file
│   └── fonts/                 # Reserved (using Google Fonts CDN for Teko)
├── build.js                   # Node.js build script
├── build.sh                   # Shell script to install deps + run build
├── package.json
└── dist/                      # Generated output for deployment
```

## Data Schemas

### site.json

```json
{
  "title": "Quality Land 2026",
  "subtitle": "CONFERENCE",
  "tagline": "THIS IS THE SIGNAL",
  "description": "No interference - just clearest insights in software testing and quality engineering, from the experts shaping industry standards, tooling, and real-world practice.",
  "date": "May 6",
  "year": 2026,
  "venue": {
    "name": "AC Hotel Vilnius",
    "fullName": "AC Hotel by Marriott Vilnius",
    "address": "Vasario 16-osios g. 5, Vilnius",
    "description": "The hotel is situated in the central part of the city..."
  },
  "stats": { "days": 1, "speakers": "10+", "attendees": 300 },
  "ticketUrl": "https://tickets.paysera.com/en/event/quality-land-konferencija-apie-kokybe-ir-testavima#eventLocation",
  "social": {
    "linkedin": "https://www.linkedin.com/company/ltstqb-international-software-testing-qualifications-board/",
    "facebook": "https://www.facebook.com/profile.php?id=61584148454281"
  },
  "organizer": {
    "name": "Lithuanian Software Testing Qualifications Board",
    "url": "https://istqb.lt/",
    "email": "info@istqb.lt"
  },
  "sponsorshipEmail": "signal@qualityland.lt",
  "nav": [
    { "label": "About", "href": "/#about" },
    { "label": "Speakers", "href": "/#speakers" },
    { "label": "Schedule", "href": "/#schedule" },
    { "label": "Sponsorship", "href": "/#sponsorship" },
    { "label": "Tickets", "href": "/#tickets" },
    { "label": "Venue", "href": "/#venue" }
  ]
}
```

### speakers.json (array element)

```json
{
  "slug": "joel-oliveira",
  "name": "Joel Oliveira",
  "title": "Head of Quality Assurance",
  "company": "Celfocus",
  "country": "Portugal",
  "photo": "images/speakers/joel-oliveira.png",
  "linkedin": "https://linkedin.com/in/...",
  "bio": "Joel brings over 20 years...",
  "talk": {
    "number": 6,
    "title": "Performance Testing at Scale: When tools and scripts are no longer enough"
  }
}
```

### schedule.json (array element)

The conference is **single-track** — no parallel sessions. Each entry has a unique time.

```json
{
  "time": "9:15",
  "type": "keynote",
  "number": 1,
  "title": "Old Problems of New Agents: Oracles and Communication",
  "speakerSlug": "szilard-szell",
  "description": "",
  "icon": "microphone"
}
```

When `speakerSlug` is null (breaks, registration, Fail Nights by Simona Laiconaitė), the template renders without a speaker link. The Fail Nights entry uses `"speakerName": "Simona Laiconaitė"` as a plain text field instead of a slug reference.

Types: `registration`, `intro`, `keynote`, `talk`, `game`, `break`, `lunch`, `evening`, `fail-nights`.
Icons: `start`, `info`, `microphone`, `cup`, `lunch`, `clock`, `cocktail`.

### sponsors.json

```json
{
  "tiers": [
    {
      "key": "signalSource",
      "displayName": "Signal Source",
      "sponsors": [
        { "name": "Lithuanian Software Testing Qualifications Board", "logo": "images/logos/ltstqb.png", "url": "https://istqb.lt/" }
      ]
    },
    {
      "key": "associationPartners",
      "displayName": "Association Partners",
      "sponsors": [
        { "name": "ISQI", "logo": "images/logos/isqi.png", "url": "https://isqi.org/" },
        { "name": "Zenitech", "logo": "images/logos/zenitech.png", "url": "https://zenitech.co.uk/" },
        { "name": "TestDevLab", "logo": "images/logos/testdevlab.png", "url": "https://www.testdevlab.com/" },
        { "name": "INSOFT", "logo": "images/logos/insoft.png", "url": "https://insoft.lt/" }
      ]
    }
  ]
}
```

### tickets.json (array — two ticket types)

```json
[
  {
    "name": "Early Bird Pass",
    "subtitle": "1-Day Onsite Conference",
    "price": "149.00",
    "currency": "EUR",
    "note": "Limited availability",
    "features": [
      { "label": "All-Access Pass", "description": "Full entry to every session..." },
      { "label": "The \"Fail Night\" Experience", "description": "Raw, unfiltered stories..." },
      { "label": "Full-Day Catering", "description": "Stay fueled with a complimentary..." },
      { "label": "Strategic Networking", "description": "Dedicated time for community building..." }
    ]
  },
  {
    "name": "Full Coverage Pass",
    "subtitle": "1-Day Onsite Conference",
    "price": "249.00",
    "currency": "EUR",
    "note": "From March 9",
    "features": ["...same as above..."]
  }
]
```

### sponsorship.json (array element)

```json
{
  "name": "Signal Emitter",
  "price": 3000,
  "currency": "EUR",
  "benefits": ["Speaker slot (if available)", "Dedicated social media post", "..."]
}
```

## Build Process

`build.js` executes these steps:

1. **Clean** — Delete `dist/` and recreate
2. **Copy assets** — Recursively copy entire `assets/` directory (images, css, fonts) into `dist/`
3. **Load data** — Read all `data/*.json` into a context object
4. **Parse markdown** — Read `content/*.md`, convert to HTML with `marked`. Mapping:
   - `about.md` → injected into `partials/about.njk` on the index page
   - `fail-nights.md` → injected into `partials/fail-nights.njk` on the index page
   - `privacy-policy.md` → rendered as standalone page via `legal.njk`
   - `terms-and-conditions.md` → rendered as standalone page via `legal.njk`
5. **Render index** — Render `templates/index.njk` with all data, write `dist/index.html`
6. **Render speaker pages** — For each speaker, render `templates/speaker.njk`, write `dist/{slug}/index.html`
7. **Render sponsorship** — Render `templates/sponsorship.njk`, write `dist/sponsorship-packages/index.html`
8. **Render legal pages** — Render `templates/legal.njk` for each, write `dist/privacy-policy/index.html` and `dist/terms-and-conditions/index.html`

### build.sh

```bash
#!/bin/bash
npm install
node build.js
echo "Build complete. Output in dist/"
echo "Preview: npx serve dist"
```

## Dependencies

- `nunjucks` — template rendering
- `marked` — Markdown to HTML
- `fs-extra` — recursive copy/clean helpers

## CSS Approach

- Single `style.css` file, no preprocessor
- CSS custom properties for color palette:
  - `--color-dark: #2f1c6a` (meteorite)
  - `--color-primary: #673de6` (purple)
  - `--color-light: #ebe4ff`
  - `--color-accent: #fc5185`
  - `--color-text: #1d1e20`
  - `--color-white: #fff`
- Google Fonts CDN for Teko (Bold, SemiBold, Medium, Regular)
- Responsive: mobile-first with breakpoints matching original
- CSS Grid for speakers grid, Flexbox for nav/schedule/tickets
- Visually faithful reproduction — same feel and layout, clean maintainable code

## Output URLs

- `/` — Main page (all sections)
- `/{speaker-slug}/` — Speaker detail pages (11 total)
- `/sponsorship-packages/` — Sponsorship tiers
- `/privacy-policy/` — Privacy policy
- `/terms-and-conditions/` — Terms & conditions

All use `index.html` inside directories for clean URLs on GitHub Pages.

## Image Assets

All images downloaded from zyrosite CDN into local `assets/images/` subdirectories:
- `speakers/` — 11 speaker card photos (PNG, ~1024px wide)
- `icons/` — 7 schedule icons (start, info, microphone, cup, lunch, clock, cocktail)
- `logos/` — Site logo (black), footer logo, LTSTQB, ISQI, Zenitech, TestDevLab, INSOFT
- `backgrounds/` — Hero GIF, schedule GIF, venue photo, fail nights images, conference poster, location pin image

## What This Does NOT Include

- No dev server or hot-reload (use `npx serve dist`)
- No CSS preprocessor
- No JavaScript interactivity (static HTML only — cookie banner, smooth scroll, WhatsApp widget are excluded)
- No GitHub Actions workflow (can be added later)
- No Google Analytics or tracking scripts
