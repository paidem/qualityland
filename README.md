# Quality Land Conference - Static Site

Static site generator for the [Quality Land](https://qualityland.lt/) software testing conference. Built with Node.js, Nunjucks templates, and editable JSON/Markdown data files. Deploys to GitHub Pages automatically.

## Quick Start

```bash
./build.sh
```

This installs dependencies and builds the site into `dist/`.

To preview locally:

```bash
npx serve dist
```

Then open http://localhost:3000.

## How It Works

The build script (`build.js`) does the following:

1. Cleans the `dist/` directory
2. Copies all static assets (images, CSS) into `dist/`
3. Reads JSON data files from `data/`
4. Converts Markdown content files from `content/` to HTML
5. Renders Nunjucks templates from `templates/` with the data
6. Outputs static HTML pages to `dist/`

The output in `dist/` is a fully self-contained static site ready for any web server or GitHub Pages.

## Project Structure

```
qualityland/
├── data/                    # Editable JSON data
│   ├── site.json            # Site config (title, venue, social links, nav)
│   ├── speakers.json        # Speaker profiles, bios, talks
│   ├── schedule.json        # Conference schedule
│   ├── sponsors.json        # Sponsor tiers and logos
│   ├── tickets.json         # Ticket types and pricing
│   └── sponsorship.json     # Sponsorship packages
├── content/                 # Editable Markdown content
│   ├── about.md             # About section text
│   ├── fail-nights.md       # Fail Nights section text
│   ├── privacy-policy.md    # Privacy policy (full page)
│   └── terms-and-conditions.md
├── templates/               # Nunjucks templates
│   ├── base.njk             # HTML skeleton (head, nav, footer)
│   ├── index.njk            # Main page (includes all partials)
│   ├── speaker.njk          # Speaker detail page
│   ├── sponsorship.njk      # Sponsorship packages page
│   ├── legal.njk            # Privacy/terms page
│   └── partials/            # Section partials for the main page
├── assets/
│   ├── css/style.css        # All styles
│   └── images/              # Speaker photos, icons, logos, backgrounds
├── build.js                 # Build script
├── build.sh                 # Build + install helper
└── dist/                    # Generated output (gitignored)
```

## Making Changes

### Edit conference data

All data lives in `data/*.json`. After editing, run `./build.sh` to regenerate.

**Add a speaker:** Add an entry to `data/speakers.json`:

```json
{
  "slug": "jane-doe",
  "name": "Jane Doe",
  "title": "Senior QA Engineer",
  "company": "Acme Corp",
  "country": "Germany",
  "photo": "images/speakers/jane-doe.png",
  "linkedin": "https://linkedin.com/in/janedoe",
  "bio": "Jane has 10 years of experience...",
  "talk": {
    "number": 12,
    "title": "The Future of Testing"
  }
}
```

Then add their photo to `assets/images/speakers/jane-doe.png` and add a schedule entry in `data/schedule.json`.

**Change ticket pricing:** Edit `data/tickets.json` — update the `price` field.

**Update sponsors:** Edit `data/sponsors.json` — add/remove sponsors within tiers, add logo images to `assets/images/logos/`.

**Change schedule:** Edit `data/schedule.json`. Each entry has a `type` (talk, break, lunch, etc.), `time`, `title`, and optionally a `speakerSlug` linking to a speaker.

### Edit page content

Long-form text lives in `content/*.md` as Markdown:

- `about.md` — the about section on the main page
- `fail-nights.md` — the Fail Nights section
- `privacy-policy.md` — full privacy policy page
- `terms-and-conditions.md` — full terms page

### Edit design/layout

- **CSS:** `assets/css/style.css` — single file with CSS custom properties for colors at the top
- **Templates:** `templates/` — Nunjucks templates. Each section of the main page is a separate partial in `templates/partials/`
- **Images:** `assets/images/` — organized into `speakers/`, `icons/`, `logos/`, `backgrounds/`

### Site configuration

Global settings are in `data/site.json`: title, venue info, ticket URL, social links, organizer details, and navigation items.

## Deployment

The site auto-deploys to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

To set up for the first time:

1. Push the repo to GitHub
2. Go to **Settings > Pages**
3. Set **Source** to **GitHub Actions**
4. Push to `main` — the workflow builds and deploys automatically

The site uses relative paths, so it works correctly when hosted at a subdirectory (e.g. `https://username.github.io/qualityland/`).

## Dependencies

- [nunjucks](https://mozilla.github.io/nunjucks/) — template engine
- [marked](https://marked.js.org/) — Markdown to HTML
- [fs-extra](https://github.com/jprichardson/node-fs-extra) — file system utilities
