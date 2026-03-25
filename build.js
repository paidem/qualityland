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

  // Custom filters
  env.addFilter('nl2br', function(str) {
    if (!str) return '';
    return str.replace(/\n/g, '<br>\n');
  });

  env.addFilter('formatPrice', function(num) {
    if (!num && num !== 0) return '';
    return num.toLocaleString('en-US');
  });

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
  // Strip first <h1> from markdown content since the template adds its own
  function stripFirstH1(html) {
    return html.replace(/<h1[^>]*>.*?<\/h1>\s*/, '');
  }
  const legalPages = [
    { slug: 'privacy-policy', title: 'Privacy Policy', content: stripFirstH1(privacyHtml) },
    { slug: 'terms-and-conditions', title: 'Terms & Conditions', content: stripFirstH1(termsHtml) }
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
