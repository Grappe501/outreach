import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, '../public/og');

const pages = [
  { slug: 'home', title: 'Better Data. Better Organizing.\nBetter Campaigns.', kicker: 'Arkansas Campaign Data Cooperative' },
  { slug: 'problem', title: 'Incomplete voter data\nis an organizing tax.', kicker: 'The Problem' },
  { slug: 'data', title: 'L2 data architecture\nfor Arkansas races.', kicker: 'Enhanced Voter Intelligence' },
  { slug: 'models', title: '160+ HaystaqDNA models\nfor precision targeting.', kicker: 'Models' },
  { slug: 'platform', title: 'Electd platform\n$149 / month.', kicker: 'Political Operating System' },
  { slug: 'managed', title: 'Managed outreach\non Electd.', kicker: 'Full-Service Communications' },
  { slug: 'pricing', title: 'Quoted rates for\nemail, SMS, voice, mail.', kicker: 'Rate Card' },
  { slug: 'cooperative', title: 'Cooperative minimums\nfor statewide L2 data.', kicker: 'Data Cooperative' },
  { slug: 'join', title: 'Request a briefing\nfor your campaign.', kicker: 'Join' },
  { slug: 'how-it-works', title: 'From data to doors\nto digital.', kicker: 'How It Works' },
  { slug: 'privacy', title: 'Campaign contacts\nstay firewalled.', kicker: 'Private Contacts' },
  { slug: 'van', title: 'Strengthen VAN.\nDon’t abandon it.', kicker: 'Existing Tools' },
  { slug: 'default', title: 'Institutional campaign\ninfrastructure for Arkansas.', kicker: 'Arkansas Campaign Data Cooperative' },
];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function titleLines(title) {
  return title.split('\n').map((line, i) => {
    const y = 250 + i * 78;
    return `<text x="72" y="${y}" fill="#F7FAF8" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700">${escapeXml(line)}</text>`;
  }).join('\n');
}

function svgFor(page) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#031511"/>
      <stop offset="55%" stop-color="#062820"/>
      <stop offset="100%" stop-color="#0A3D33"/>
    </linearGradient>
    <radialGradient id="glow" cx="85%" cy="15%" r="45%">
      <stop offset="0%" stop-color="#E06A28" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#E06A28" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="0" y="0" width="12" height="630" fill="#B8480C"/>
  <text x="72" y="110" fill="#FFC89A" font-family="system-ui, sans-serif" font-size="28" font-weight="700">${escapeXml(page.kicker)}</text>
  ${titleLines(page.title)}
  <text x="72" y="560" fill="#DCE8E3" font-family="system-ui, sans-serif" font-size="26" font-weight="600">outreach-ar.netlify.app</text>
  <text x="72" y="598" fill="#A8C0B7" font-family="system-ui, sans-serif" font-size="22">Better Data · Better Organizing · Better Campaigns</text>
</svg>`;
}

await mkdir(outDir, { recursive: true });

for (const page of pages) {
  const svg = Buffer.from(svgFor(page));
  const out = path.join(outDir, `${page.slug}.png`);
  await sharp(svg).png({ quality: 90 }).toFile(out);
  console.log('wrote', out);
}

// Apple touch icon from dark logo if present
const logoPath = path.resolve(root, '../public/assets/arkansas-logo-dark.svg');
const touchPath = path.resolve(root, '../public/apple-touch-icon.png');
try {
  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: { r: 251, g: 252, b: 249, alpha: 1 } })
    .png()
    .toFile(touchPath);
  console.log('wrote', touchPath);
} catch (err) {
  console.warn('apple-touch-icon skipped', err.message);
}

// Write a tiny SVG favicon companion
await writeFile(
  path.resolve(root, '../public/favicon.svg'),
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#062820"/>
  <path d="M14 44 L32 12 L50 44 Z" fill="none" stroke="#FFC89A" stroke-width="4"/>
  <circle cx="32" cy="38" r="3" fill="#B8480C"/>
</svg>`,
  'utf8',
);

console.log('OG generation complete');
