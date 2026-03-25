# Quality Land Static Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate qualityland.lt as a static site built from editable JSON/Markdown data files, using Node.js + Nunjucks, deployable to GitHub Pages.

**Architecture:** Single build script (`build.js`) reads JSON data files and Markdown content, renders Nunjucks templates, and outputs static HTML/CSS/images to `dist/`. No JavaScript interactivity. All images hosted locally.

**Tech Stack:** Node.js, Nunjucks, marked, fs-extra. Single CSS file with custom properties. Google Fonts (Teko).

**Spec:** `docs/superpowers/specs/2026-03-25-qualityland-static-site-design.md`

**Source site:** https://qualityland.lt/

---

## File Map

### Data Files (create)
- `data/site.json` — site config, venue, social links, nav
- `data/speakers.json` — 11 speakers with slugs, bios, talks
- `data/schedule.json` — 17 time slots with types and icons
- `data/sponsors.json` — 2 sponsor tiers
- `data/tickets.json` — 2 ticket types
- `data/sponsorship.json` — 5 sponsorship packages

### Content Files (create)
- `content/about.md` — about section prose
- `content/fail-nights.md` — fail nights section prose
- `content/privacy-policy.md` — privacy policy full text
- `content/terms-and-conditions.md` — terms full text

### Templates (create)
- `templates/base.njk` — HTML skeleton, head, wraps content
- `templates/index.njk` — main page, includes all partials
- `templates/speaker.njk` — speaker detail page
- `templates/sponsorship.njk` — sponsorship packages page
- `templates/legal.njk` — shared legal page template
- `templates/partials/nav.njk`
- `templates/partials/hero.njk`
- `templates/partials/about.njk`
- `templates/partials/speakers-grid.njk`
- `templates/partials/schedule.njk`
- `templates/partials/fail-nights.njk`
- `templates/partials/sponsors.njk`
- `templates/partials/tickets.njk`
- `templates/partials/venue.njk`
- `templates/partials/footer.njk`

### Assets (create)
- `assets/css/style.css` — single CSS file
- `assets/images/speakers/` — 11 speaker photos
- `assets/images/icons/` — 7 schedule icons
- `assets/images/logos/` — site logo + 5 partner logos + footer logo
- `assets/images/backgrounds/` — hero GIF, schedule GIF, venue photo, poster, location pin, fail nights images

### Build (create)
- `package.json`
- `build.js`
- `build.sh`

---

## Task 1: Project Scaffolding

**Files:**
- Create: `package.json`
- Create: `build.sh`
- Create: `.gitignore`
- Create: directory structure

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p data content templates/partials assets/images/{speakers,icons,logos,backgrounds} assets/css dist
```

- [ ] **Step 2: Create package.json**

```json
{
  "name": "qualityland",
  "version": "1.0.0",
  "private": true,
  "description": "Quality Land Conference static site generator",
  "scripts": {
    "build": "node build.js"
  },
  "dependencies": {
    "fs-extra": "^11.0.0",
    "marked": "^15.0.0",
    "nunjucks": "^3.2.4"
  }
}
```

Write to `package.json`.

- [ ] **Step 3: Create build.sh**

```bash
#!/bin/bash
set -e
cd "$(dirname "$0")"
npm install --silent
node build.js
echo ""
echo "Build complete. Output in dist/"
echo "Preview with: npx serve dist"
```

Write to `build.sh`, then `chmod +x build.sh`.

- [ ] **Step 4: Create .gitignore**

```
node_modules/
dist/
```

Write to `.gitignore`.

- [ ] **Step 5: Install dependencies**

Run: `npm install`

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json build.sh .gitignore
git commit -m "feat: project scaffolding with package.json and build.sh"
```

---

## Task 2: Download All Images

**Files:**
- Create: all files in `assets/images/`

Download all images from the zyrosite CDN. Use Playwright or curl to download each image. Navigate to https://qualityland.lt/ and extract all image URLs using browser evaluation.

**IMPORTANT:** The original site uses Zyro website builder. Images are served via `assets.zyrosite.com/cdn-cgi/image/...` CDN URLs. To get full-resolution originals, strip the CDN resize parameters from URLs.

- [ ] **Step 1: Download speaker photos**

Navigate to https://qualityland.lt/ and extract speaker card image srcset URLs from the speaker grid. Each speaker card link (`a[href^="/joel-oliveira"]` etc.) contains an `<img>` with a `srcset` attribute. Use the largest size variant (1920w) for each.

Speaker slug to image ID mapping (from the srcset URLs found during design phase):
- `joel-oliveira` → `1-LBo126dFZgWJAryE.png`
- `olivier-denoo` → `6-gS7xHc3GF3A5aIxH.png`
- `dr-lovelesh-beeharry` → `3-JZcrOzW8gA7r3uUo.png`
- `klaudia-dussa-zieger` → `4-LYZVduF1Msqd0UAO.png`
- `nishan-portoyan` → `9-VAWshpVTxTIQatwL.png`
- `nikolaj-tolkaciov` → `11-JsWPid4frNwji68Y.png`
- `michael-pilaeten` → `template-for-quality-land-speakers-PZE6jXxYHeA1jbwM.png`
- `richard-seidl` → `7-Ubot8dvpb9y0zVGz.png`
- `kari-kakkonen` → `10-eUPlICGiWzSlLWLI.png`
- `sebastian-malyska` → `8-Arjs0Y92qKzOELNH.png`
- `szilard-szell` → `5-3ghK9p8uMbW08HKL.png`

Base URL pattern: `https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,h=1152,fit=crop/olUKlkf0e3iKMf9J/{filename}`

Download each to `assets/images/speakers/{slug}.png`.

- [ ] **Step 2: Download schedule icons**

Icon images found on the page (from the schedule section):
- `start_qlc-eAoQxzIAMeI24GOQ.png` → `assets/images/icons/start.png`
- `info_qlc-T3uUsgPGEvRbpykg.png` → `assets/images/icons/info.png`
- `microphone_qlc-dtAjyGxVmJT1DLNR.png` → `assets/images/icons/microphone.png`
- `cup_qlc-SeCjoteJmgfmC0Al.png` → `assets/images/icons/cup.png`
- `lunch_qlc-vZDSM3YZ5lzBWOLM.png` → `assets/images/icons/lunch.png`
- `clock_qlc-GToum9AdtDnNeNmG.png` → `assets/images/icons/clock.png`
- `cocktail_qlc-XlLaQNimyhJpmxK2.png` → `assets/images/icons/cocktail.png`

Base URL pattern: `https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=375,h=375,fit=crop/olUKlkf0e3iKMf9J/{filename}`

- [ ] **Step 3: Download logos**

- Site logo: `ql_logo_black-4cnFBCydnengnwHN.png` → `assets/images/logos/ql-logo.png`
- LTSTQB/ISTQB: `asset-1-O0I8VPSC583gVNad.png` → `assets/images/logos/ltstqb.png`
- ISQI: `isqi_newclaim_en-1-m6pzYnSgfhAOvpMJ.png` → `assets/images/logos/isqi.png`
- Zenitech: `fulllogo-NwahCjijflv14eZX.png` → `assets/images/logos/zenitech.png`
- TestDevLab: `testdevlab---red-bg-gndQFK95Pz1EnlxF.png` → `assets/images/logos/testdevlab.png`
- INSOFT: `insoft_logo_grey-FNDuBsECWAne3Py4.png` → `assets/images/logos/insoft.png`
- Footer social icons: `img_3573-180x180-h3Ksyq7xe4wrOLiW.webp` → `assets/images/logos/footer-avatar.webp`

Base URL pattern: `https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop/olUKlkf0e3iKMf9J/{filename}`

- [ ] **Step 4: Download background images**

- Hero GIF: `https://assets.zyrosite.com/olUKlkf0e3iKMf9J/background_ql-tzD0QlMNCzGjGAxR.gif` → `assets/images/backgrounds/hero.gif`
- Schedule GIF: `https://assets.zyrosite.com/olUKlkf0e3iKMf9J/background_ql-Z7VkfY72e6HMp8le.gif` → `assets/images/backgrounds/schedule.gif`
- Conference poster: `qualityland_spring_transmission_march-ouDzwshSPlTHI1B3.png` → `assets/images/backgrounds/poster.png`
- Location pin: `location-png3-tjQoNs8MOobjOxtZ.png` → `assets/images/backgrounds/location-pin.png`
- Venue photo: `ac-vnoac-exterior-01-2048x1366-2-mUHFpvR2h0qPuP6M.jpg` → `assets/images/backgrounds/venue.jpg`
- Fail nights photo: `476949992_1066018088663281_9093737261607912351_n-hnjGw5TN4qqYdEkX.jpg` → `assets/images/backgrounds/fail-nights.jpg`
- Fail nights logo: `failnights-rl3DYMY75wxBpSwM.png` → `assets/images/backgrounds/fail-nights-logo.png`
- Circle decoration: `circle-GvVWLasVYQ6Vb87W.png` → `assets/images/backgrounds/circle.png`

Base URL for backgrounds: `https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/olUKlkf0e3iKMf9J/{filename}`
(GIFs use direct URL without cdn-cgi resize)

- [ ] **Step 5: Verify all images downloaded**

Check that all expected files exist in `assets/images/` subdirectories.

- [ ] **Step 6: Commit**

```bash
git add assets/images/
git commit -m "feat: download all images from source site"
```

---

## Task 3: Create Data Files

**Files:**
- Create: `data/site.json`
- Create: `data/speakers.json`
- Create: `data/schedule.json`
- Create: `data/sponsors.json`
- Create: `data/tickets.json`
- Create: `data/sponsorship.json`

- [ ] **Step 1: Create site.json**

Use the schema from the spec exactly. Fill in all real values from the source site.

- [ ] **Step 2: Create speakers.json**

Scrape ALL 11 speaker detail pages to get full bios and LinkedIn URLs:
- https://qualityland.lt/joel-oliveira
- https://qualityland.lt/olivier-denoo
- https://qualityland.lt/dr-lovelesh-beeharry
- https://qualityland.lt/klaudia-dussa-zieger
- https://qualityland.lt/nishan-portoyan
- https://qualityland.lt/nikolaj-tolkaciov
- https://qualityland.lt/michael-pilaeten
- https://qualityland.lt/richard-seidl
- https://qualityland.lt/kari-kakkonen
- https://qualityland.lt/sebastian-malyska
- https://qualityland.lt/szilard-szell

For each speaker, extract: full bio text, LinkedIn URL, talk title (from the main page schedule).

Speaker data from the main page (name, title, company, country):
1. Joel Oliveira — Head of Quality Assurance at Celfocus, Portugal
2. Olivier Denoo — Vice President of PS Testware SAS, France
3. Dr. Lovelesh Beeharry — CEO of GESL and Certilog, Mauritius
4. Klaudia Dussa-Zieger — Expert Consultant at imbus AG, Germany
5. Nishan Portoyan — Quality Ambassador at Infometis, Switzerland
6. Nikolaj Tolkačiov — Engineering Manager at Nord Security, Lithuania
7. Michaël Pilaeten — Head of Quality Engineering at Sofico, Belgium
8. Richard Seidl — Software Quality Expert, Austria
9. Kari Kakkonen — Service Owner, Customer Expertise Development at Gofore, Finland
10. Sebastian Małyska — QA Engineer at Smart Coders, Poland
11. Szilárd Széll — Eficode, Finland

- [ ] **Step 3: Create schedule.json**

Full schedule from the source site (single-track, all entries in time order):

| Time | Type | # | Title | Speaker |
|------|------|---|-------|---------|
| 8:00 | registration | - | Registration & Welcome Coffee | - |
| 9:00 | intro | 0 | Introduction | - |
| 9:15 | keynote | 1 | Old Problems of New Agents: Oracles and Communication | szilard-szell |
| 10:00 | talk | 2 | From Boring Vulnerability Analysis to Security Testing Beyond Checklists | sebastian-malyska |
| 10:30 | break | - | Morning Break (30 min.) | - |
| 11:00 | talk | 3 | Interview with an AI | olivier-denoo |
| 11:30 | talk | 4 | Mythbusters: Test Automation | michael-pilaeten |
| 12:00 | game | 5 | Interactive QA Trivia | nikolaj-tolkaciov |
| 12:30 | lunch | - | Lunch Break (1 hour) | - |
| 13:30 | talk | 6 | Performance Testing at Scale: When tools and scripts are no longer enough | joel-oliveira |
| 14:00 | talk | 7 | Quality with AI and AI with Quality | klaudia-dussa-zieger |
| 14:30 | talk | 8 | Testing Is a People Business - Why Quality Fails Without Human Connection | richard-seidl |
| 15:00 | break | - | Afternoon Break (30 min.) | - |
| 15:30 | talk | 9 | Ctrl + Alt + Test: Stories from my QA Frontline | dr-lovelesh-beeharry |
| 16:00 | talk | 10 | Test Leadership at the Organizational Level | kari-kakkonen |
| 16:30 | keynote | 11 | When AI Enters the Test Team: The Conflict That Changes Everything | nishan-portoyan |
| 17:15 | evening | - | Long Evening Break (1 hour 45 minutes) | - |
| 19:00 | fail-nights | - | Fail Nights by Simona Laiconaitė | (speakerName, not slug) |

Icon mapping by type:
- registration → start
- intro → info
- keynote → microphone
- talk → microphone
- game → microphone
- break → cup
- lunch → lunch
- evening → clock
- fail-nights → cocktail

- [ ] **Step 4: Create sponsors.json**

Use the tier structure from the spec with all real data.

- [ ] **Step 5: Create tickets.json**

Scrape ticket info from the main page. The site currently shows:
- "Full Coverage Pass | Quality Land 2026" / "1-Day Onsite Conference" / €249.00 EUR
- Features: All-Access Pass, Fail Night Experience, Full-Day Catering, Strategic Networking

Note: Early Bird may have been visible earlier. Include it if found, otherwise include only what's on the live site.

- [ ] **Step 6: Create sponsorship.json**

Scrape https://qualityland.lt/sponsorship-packages for all 5 tiers with names, prices, and benefit lists.

- [ ] **Step 7: Commit**

```bash
git add data/
git commit -m "feat: add all data files (speakers, schedule, sponsors, tickets)"
```

---

## Task 4: Create Content Files

**Files:**
- Create: `content/about.md`
- Create: `content/fail-nights.md`
- Create: `content/privacy-policy.md`
- Create: `content/terms-and-conditions.md`

- [ ] **Step 1: Create about.md**

Extract the about section text from the main page. This is the text under the stats section:
- "Quality Land is a community-driven software testing conference..."
- "Quality doesn't come from certainty..."
- "That's why Quality Land exists..."
- "Built for those who dare to ask uncomfortable questions..."

- [ ] **Step 2: Create fail-nights.md**

Extract the Fail Nights section text from the main page:
- "Every failure has its own story..."
- "FAIL NIGHTS are the only events of this format in Lithuania..."
- "From 19:00, all conference guests are invited..."

- [ ] **Step 3: Create privacy-policy.md**

Scrape full text from https://qualityland.lt/privacy-policy

- [ ] **Step 4: Create terms-and-conditions.md**

Scrape full text from https://qualityland.lt/terms-and-conditions

- [ ] **Step 5: Commit**

```bash
git add content/
git commit -m "feat: add content markdown files (about, fail-nights, legal)"
```

---

## Task 5: Build Script

**Files:**
- Create: `build.js`

- [ ] **Step 1: Write build.js**

The complete build pipeline:

```javascript
const fs = require('fs-extra');
const path = require('path');
const nunjucks = require('nunjucks');
const { marked } = require('marked');

const DIST = path.join(__dirname, 'dist');
const DATA = path.join(__dirname, 'data');
const CONTENT = path.join(__dirname, 'content');
const ASSETS = path.join(__dirname, 'assets');
const TEMPLATES = path.join(__dirname, 'templates');

async function build() {
  // 1. Clean dist
  await fs.remove(DIST);
  await fs.ensureDir(DIST);

  // 2. Copy assets
  await fs.copy(ASSETS, DIST);

  // 3. Load data
  const site = await fs.readJson(path.join(DATA, 'site.json'));
  const speakers = await fs.readJson(path.join(DATA, 'speakers.json'));
  const schedule = await fs.readJson(path.join(DATA, 'schedule.json'));
  const sponsors = await fs.readJson(path.join(DATA, 'sponsors.json'));
  const tickets = await fs.readJson(path.join(DATA, 'tickets.json'));
  const sponsorship = await fs.readJson(path.join(DATA, 'sponsorship.json'));

  // 4. Parse markdown
  const aboutHtml = marked(await fs.readFile(path.join(CONTENT, 'about.md'), 'utf8'));
  const failNightsHtml = marked(await fs.readFile(path.join(CONTENT, 'fail-nights.md'), 'utf8'));
  const privacyHtml = marked(await fs.readFile(path.join(CONTENT, 'privacy-policy.md'), 'utf8'));
  const termsHtml = marked(await fs.readFile(path.join(CONTENT, 'terms-and-conditions.md'), 'utf8'));

  // Configure Nunjucks
  const env = nunjucks.configure(TEMPLATES, { autoescape: true });

  // Build context
  const ctx = {
    site, speakers, schedule, sponsors, tickets, sponsorship,
    aboutHtml, failNightsHtml
  };

  // 5. Render index
  const indexHtml = env.render('index.njk', ctx);
  await fs.writeFile(path.join(DIST, 'index.html'), indexHtml);

  // 6. Render speaker pages
  for (const speaker of speakers) {
    const speakerDir = path.join(DIST, speaker.slug);
    await fs.ensureDir(speakerDir);
    const html = env.render('speaker.njk', { site, speaker });
    await fs.writeFile(path.join(speakerDir, 'index.html'), html);
  }

  // 7. Render sponsorship page
  const sponsorshipDir = path.join(DIST, 'sponsorship-packages');
  await fs.ensureDir(sponsorshipDir);
  const sponsorshipHtml = env.render('sponsorship.njk', { site, sponsorship });
  await fs.writeFile(path.join(sponsorshipDir, 'index.html'), sponsorshipHtml);

  // 8. Render legal pages
  const legalPages = [
    { slug: 'privacy-policy', title: 'Privacy Policy', content: privacyHtml },
    { slug: 'terms-and-conditions', title: 'Terms & Conditions', content: termsHtml }
  ];
  for (const page of legalPages) {
    const pageDir = path.join(DIST, page.slug);
    await fs.ensureDir(pageDir);
    const html = env.render('legal.njk', { site, page });
    await fs.writeFile(path.join(pageDir, 'index.html'), html);
  }

  console.log('Build complete!');
  console.log(`  - index.html`);
  console.log(`  - ${speakers.length} speaker pages`);
  console.log(`  - sponsorship-packages/`);
  console.log(`  - privacy-policy/`);
  console.log(`  - terms-and-conditions/`);
}

build().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Run build to verify pipeline works**

Run: `node build.js`

This will fail because templates don't exist yet. That's expected — just verify the data loading and asset copying works up to the template rendering step.

- [ ] **Step 3: Commit**

```bash
git add build.js
git commit -m "feat: add build script with full rendering pipeline"
```

---

## Task 6: Base Template, Nav, and Footer

**Files:**
- Create: `templates/base.njk`
- Create: `templates/partials/nav.njk`
- Create: `templates/partials/footer.njk`

- [ ] **Step 1: Create base.njk**

The HTML skeleton that all pages extend:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% block title %}{{ site.title }}{% endblock %} | Quality Land Conference</title>
  <meta name="description" content="{{ site.description }}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Teko:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  {% include "partials/nav.njk" %}
  {% block content %}{% endblock %}
  {% include "partials/footer.njk" %}
</body>
</html>
```

- [ ] **Step 2: Create nav.njk**

Sticky navigation with logo and menu links. Reference the source site's nav structure: logo on left, nav links on right. Links come from `site.nav`.

- [ ] **Step 3: Create footer.njk**

Footer with: organizer info (logo + "Event by" text), contact email, social links (LinkedIn, Facebook), privacy/terms links. Reference the source site's footer structure.

- [ ] **Step 4: Commit**

```bash
git add templates/base.njk templates/partials/nav.njk templates/partials/footer.njk
git commit -m "feat: add base template with nav and footer"
```

---

## Task 7: CSS Foundation

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: Create style.css with reset and variables**

Start with:
- CSS reset/normalize
- Custom properties (colors from spec)
- Base typography (Teko for headings, system sans-serif for body)
- Layout utilities (container, section padding)
- Nav styles (sticky, transparent/solid on scroll — but since no JS, make it solid)
- Footer styles

Reference the source site visually for spacing, colors, and typography sizes. The original uses:
- Dark purple (#2f1c6a) for backgrounds
- Teko font for all headings (uppercase, large)
- Light/white text on dark backgrounds
- ~1200px max content width

- [ ] **Step 2: Run build and verify in browser**

Run: `bash build.sh`
Then: `npx serve dist`

Open http://localhost:3000 and verify: nav renders, footer renders, basic styling works.

- [ ] **Step 3: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: add CSS foundation with variables, reset, nav and footer styles"
```

---

## Task 8: Hero Section

**Files:**
- Create: `templates/partials/hero.njk`
- Create: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create index.njk**

Extends `base.njk`, includes all section partials (start with hero only, add others as stubs):

```html
{% extends "base.njk" %}
{% block content %}
  {% include "partials/hero.njk" %}
{% endblock %}
```

- [ ] **Step 2: Create hero.njk**

The hero section contains:
- Background GIF image
- "QUALITY LAND 2026" heading
- "CONFERENCE" subtitle
- Tagline: "THIS IS THE SIGNAL"
- Description text
- "MAY 6" date
- Venue name and address
- "Reserve a Spot" CTA button
- Stats bar below: "1 DAY" / "10+ SPEAKERS" / "300 ATTENDEES"
- Large floating poster image on the right side
- Location pin image on the left

Reference the original site layout: full-width hero with overlapping decorative images.

- [ ] **Step 3: Add hero CSS**

Add to `style.css`:
- Full-viewport hero with background GIF
- Overlay gradient for text readability
- Large uppercase Teko headings
- Stats bar with dark background
- Responsive layout (poster image hidden on mobile)

- [ ] **Step 4: Build and verify**

Run: `bash build.sh && npx serve dist`
Compare hero section visually with https://qualityland.lt/

- [ ] **Step 5: Commit**

```bash
git add templates/index.njk templates/partials/hero.njk assets/css/style.css
git commit -m "feat: add hero section with stats bar"
```

---

## Task 9: About Section

**Files:**
- Create: `templates/partials/about.njk`
- Modify: `templates/index.njk` (add include)
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create about.njk**

The about section contains:
- Large quote heading: "QUALITY LAND IS WHERE QUALITY BECOMES A CULTURE..."
- About text paragraphs (from `aboutHtml`)
- "Learn more" link to https://istqb.lt/
- Floating island/castle image on the right

Add `{% include "partials/about.njk" %}` to `index.njk`.

- [ ] **Step 2: Add about CSS**

Two-column layout: text left, image right. Light background. Match the original spacing and typography.

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/about.njk templates/index.njk assets/css/style.css
git commit -m "feat: add about section"
```

---

## Task 10: Speakers Grid

**Files:**
- Create: `templates/partials/speakers-grid.njk`
- Modify: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create speakers-grid.njk**

Section with:
- "Speakers" heading
- Subtitle: "Learn from the experts who shape standards..."
- Grid of speaker cards, each linking to `/{speaker.slug}/`
- Each card: photo image, speaker name (h3), title + company + country

Loop over `speakers` array.

- [ ] **Step 2: Add speakers grid CSS**

- CSS Grid: 3 columns on desktop, 2 on tablet, 1 on mobile
- Card styling: image fills card top, text below
- Hover effect on cards (subtle scale or shadow)
- Match the original's card proportions

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/speakers-grid.njk templates/index.njk assets/css/style.css
git commit -m "feat: add speakers grid section"
```

---

## Task 11: Schedule Timeline

**Files:**
- Create: `templates/partials/schedule.njk`
- Modify: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create schedule.njk**

The most complex section. Contains:
- "Schedule" heading
- Background GIF image
- Vertical timeline with entries
- Each entry has: icon image, time, title/description
- Talk entries include speaker name (linked if they have a slug)
- Break/lunch entries have different styling
- The "Your day at Quality Land starts here" text at bottom

Loop over `schedule` array. For each entry, look up speaker from `speakers` array by `speakerSlug` to get the display name.

To pass the speakers lookup into the template, the build context already includes both `schedule` and `speakers`. In the template, use a Nunjucks macro or inline loop to find the matching speaker.

- [ ] **Step 2: Add schedule CSS**

- Vertical timeline with line down the center (desktop) or left side (mobile)
- Alternating left/right layout for entries (desktop)
- Time stamps as prominent headings
- Icon images at each node point
- Different background colors for breaks vs talks
- Dark-themed section (matching original)

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/schedule.njk templates/index.njk assets/css/style.css
git commit -m "feat: add schedule timeline section"
```

---

## Task 12: Fail Nights Section

**Files:**
- Create: `templates/partials/fail-nights.njk`
- Modify: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create fail-nights.njk**

Section with:
- Background image (fail nights photo)
- Fail nights logo
- Content from `failNightsHtml`
- "Learn more" link to https://www.failnights.lt/

- [ ] **Step 2: Add fail-nights CSS**

Dark-themed section with image background, text overlay. Match original layout.

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/fail-nights.njk templates/index.njk assets/css/style.css
git commit -m "feat: add fail nights section"
```

---

## Task 13: Sponsors Section

**Files:**
- Create: `templates/partials/sponsors.njk`
- Modify: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create sponsors.njk**

Section with:
- Sponsor tiers, each with heading and logo grid
- Loop over `sponsors.tiers`, each tier shows `displayName` heading and sponsor logos as links
- "Sponsors make the event possible..." text
- "Sponsorship Packages" link button

- [ ] **Step 2: Add sponsors CSS**

Logo grid layout, centered logos with consistent sizing. Match original.

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/sponsors.njk templates/index.njk assets/css/style.css
git commit -m "feat: add sponsors section"
```

---

## Task 14: Tickets Section

**Files:**
- Create: `templates/partials/tickets.njk`
- Modify: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create tickets.njk**

Section with:
- "Secure Your Spot" heading
- Ticket card(s) with: name, subtitle, price, feature list
- "Reserve a Spot" button linking to `site.ticketUrl`
- Decorative circle images

Loop over `tickets` array.

- [ ] **Step 2: Add tickets CSS**

Card layout with pricing prominent. Purple/dark theme. CTA button styling. Match original.

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/tickets.njk templates/index.njk assets/css/style.css
git commit -m "feat: add tickets section"
```

---

## Task 15: Venue Section

**Files:**
- Create: `templates/partials/venue.njk`
- Modify: `templates/index.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create venue.njk**

Section with:
- Venue photo background
- "Conference Venue" heading
- Venue name and description from `site.venue`
- Embedded Google Maps iframe (extract the map embed URL from the original site's iframe)

- [ ] **Step 2: Add venue CSS**

Split layout: photo on one side, map + text on the other. Match original.

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/partials/venue.njk templates/index.njk assets/css/style.css
git commit -m "feat: add venue section"
```

---

## Task 16: Speaker Detail Pages

**Files:**
- Create: `templates/speaker.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create speaker.njk**

Extends `base.njk`. Layout:
- Speaker photo (large)
- Speaker name heading
- Title, company, country
- Bio text
- LinkedIn link/button
- "Back to speakers" link

Reference the original speaker detail pages (e.g. https://qualityland.lt/joel-oliveira) for layout.

- [ ] **Step 2: Add speaker page CSS**

Centered layout, large photo, readable bio text. Match original design.

- [ ] **Step 3: Build and verify**

Run build, click on a speaker card from the main page, verify the detail page renders correctly.

- [ ] **Step 4: Commit**

```bash
git add templates/speaker.njk assets/css/style.css
git commit -m "feat: add speaker detail page template"
```

---

## Task 17: Sponsorship Packages Page

**Files:**
- Create: `templates/sponsorship.njk`
- Modify: `assets/css/style.css`

- [ ] **Step 1: Create sponsorship.njk**

Extends `base.njk`. Layout:
- Page heading
- Grid/list of sponsorship tiers
- Each tier: name, price, benefits list
- Contact info with `site.sponsorshipEmail`

Reference https://qualityland.lt/sponsorship-packages for layout.

- [ ] **Step 2: Add sponsorship page CSS**

Tier cards in a grid. Match original design.

- [ ] **Step 3: Build, verify, commit**

```bash
git add templates/sponsorship.njk assets/css/style.css
git commit -m "feat: add sponsorship packages page"
```

---

## Task 18: Legal Pages

**Files:**
- Create: `templates/legal.njk`

- [ ] **Step 1: Create legal.njk**

Extends `base.njk`. Simple content page:
- Page title heading
- Rendered markdown content
- Standard content width, readable typography

```html
{% extends "base.njk" %}
{% block title %}{{ page.title }}{% endblock %}
{% block content %}
<section class="legal">
  <div class="container">
    <h1>{{ page.title }}</h1>
    {{ page.content | safe }}
  </div>
</section>
{% endblock %}
```

- [ ] **Step 2: Build, verify, commit**

```bash
git add templates/legal.njk
git commit -m "feat: add legal page template"
```

---

## Task 19: Final Integration and Visual QA

**Files:**
- Modify: `templates/index.njk` (ensure all partials included)
- Modify: `assets/css/style.css` (final tweaks)

- [ ] **Step 1: Verify index.njk includes all partials**

The final `index.njk` should include all partials in order:
```
hero → about → speakers-grid → schedule → fail-nights → sponsors → tickets → venue
```

- [ ] **Step 2: Full build and side-by-side comparison**

Run: `bash build.sh && npx serve dist`

Open both http://localhost:3000 and https://qualityland.lt/ side by side. Check:
- [ ] Nav: logo, links, sticky behavior
- [ ] Hero: background, text, stats bar, poster image
- [ ] About: text content, layout, image
- [ ] Speakers: grid layout, photos, names, hover effects
- [ ] Schedule: timeline, icons, times, speaker names
- [ ] Fail Nights: background, text, link
- [ ] Sponsors: logos, tier headings
- [ ] Tickets: pricing card, features, CTA button
- [ ] Venue: photo, map, text
- [ ] Footer: organizer info, social links, legal links
- [ ] Speaker detail pages: photo, bio, LinkedIn
- [ ] Sponsorship page: tiers, prices, benefits
- [ ] Legal pages: content renders correctly
- [ ] Responsive: check at mobile (375px), tablet (768px), desktop (1200px+)

- [ ] **Step 3: Fix any visual discrepancies**

Adjust CSS as needed for spacing, colors, typography, responsive breakpoints.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Quality Land static site with all sections and pages"
```
