import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(root, '../public/og');

const pages = [
  { slug: 'home', title: ['Better Data.', 'Better Organizing.', 'Better Campaigns.'], kicker: 'Arkansas Campaign Data Cooperative' },
  { slug: 'problem', title: ['Incomplete voter data', 'is an organizing tax.'], kicker: 'The Problem' },
  { slug: 'data', title: ['L2 data architecture', 'for Arkansas races.'], kicker: 'Enhanced Voter Intelligence' },
  { slug: 'models', title: ['160+ HaystaqDNA models', 'for precision targeting.'], kicker: 'Models' },
  { slug: 'platform', title: ['Electd platform', '$149 / month.'], kicker: 'Political Operating System' },
  { slug: 'managed', title: ['Managed outreach', 'on Electd.'], kicker: 'Full-Service Communications' },
  { slug: 'pricing', title: ['Quoted rates for', 'email, SMS, voice, mail.'], kicker: 'Rate Card' },
  { slug: 'cooperative', title: ['Cooperative minimums', 'for statewide L2 data.'], kicker: 'Data Cooperative' },
  { slug: 'join', title: ['Request a briefing', 'for your campaign.'], kicker: 'Join' },
  { slug: 'how-it-works', title: ['From data to doors', 'to digital.'], kicker: 'How It Works' },
  { slug: 'privacy', title: ['Campaign contacts', 'stay firewalled.'], kicker: 'Private Contacts' },
  { slug: 'van', title: ['Strengthen VAN.', "Don't abandon it."], kicker: 'Existing Tools' },
  { slug: 'default', title: ['Institutional campaign', 'infrastructure for Arkansas.'], kicker: 'Arkansas Campaign Data Cooperative' },
];

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function titleLines(lines) {
  return lines
    .map((line, i) => {
      const y = 235 + i * 72;
      return `<text x="72" y="${y}" fill="#F7FAF8" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="58" font-weight="800" letter-spacing="-1.5">${escapeXml(line)}</text>`;
    })
    .join('\n');
}

function svgFor(page) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#031511"/>
      <stop offset="48%" stop-color="#062820"/>
      <stop offset="100%" stop-color="#0A3D33"/>
    </linearGradient>
    <radialGradient id="glow" cx="88%" cy="12%" r="48%">
      <stop offset="0%" stop-color="#E06A28" stop-opacity="0.38"/>
      <stop offset="100%" stop-color="#E06A28" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="tealGlow" cx="18%" cy="78%" r="40%">
      <stop offset="0%" stop-color="#146355" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#146355" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect width="1200" height="630" fill="url(#tealGlow)"/>
  <rect x="0" y="0" width="14" height="630" fill="#B8480C"/>
  <rect x="72" y="78" width="56" height="4" fill="#FFC89A"/>
  <text x="72" y="130" fill="#FFC89A" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="0.5">${escapeXml(page.kicker)}</text>
  ${titleLines(page.title)}
  <text x="72" y="545" fill="#DCE8E3" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="24" font-weight="600">outreach-ar.netlify.app</text>
  <text x="72" y="585" fill="#A8C0B7" font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" font-size="20">Better Data · Better Organizing · Better Campaigns</text>
</svg>`;
}

await mkdir(outDir, { recursive: true });

for (const page of pages) {
  const svg = Buffer.from(svgFor(page));
  const out = path.join(outDir, `${page.slug}.png`);
  await sharp(svg).png({ quality: 92 }).toFile(out);
  console.log('wrote', out);
}

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
