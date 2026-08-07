export type NavLink = {
  href: string;
  label: string;
  cta?: boolean;
  keys?: string[];
};

export const primaryNav: NavLink[] = [
  { href: '/', label: 'Home', keys: [''] },
  { href: '/problem/', label: 'Problem', keys: ['problem'] },
  { href: '/data/', label: 'L2 Data', keys: ['data', 'models'] },
  { href: '/platform/', label: 'Electd', keys: ['platform'] },
  { href: '/managed/', label: 'Managed', keys: ['managed'] },
  { href: '/pricing/', label: 'Rates', keys: ['pricing'] },
  { href: '/cooperative/', label: 'Cooperative', keys: ['cooperative'] },
  { href: '/join/', label: 'Join', keys: ['join'], cta: true },
];

export const moreLinks: NavLink[] = [
  { href: '/models/', label: 'Haystaq models' },
  { href: '/van/', label: 'VAN & existing tools' },
  { href: '/privacy/', label: 'Private contacts' },
  { href: '/how-it-works/', label: 'How it works' },
];

export const exploreGroups = [
  {
    label: 'Data',
    links: [
      { href: '/data/', label: 'L2 Data Architecture' },
      { href: '/models/', label: 'HaystaqDNA Models' },
      { href: '/data/#dictionary', label: 'Field dictionary' },
    ],
  },
  {
    label: 'Platform',
    links: [
      { href: '/platform/', label: 'Electd Platform' },
      { href: '/managed/', label: 'Managed Outreach' },
      { href: '/how-it-works/', label: 'How it works' },
    ],
  },
  {
    label: 'Economics',
    links: [
      { href: '/pricing/', label: 'Rate card' },
      { href: '/cooperative/', label: 'Cooperative terms' },
      { href: '/cooperative/#minimums', label: 'Contribution minimums' },
    ],
  },
  {
    label: 'Trust',
    links: [
      { href: '/problem/', label: 'The problem' },
      { href: '/van/', label: 'VAN & existing tools' },
      { href: '/privacy/', label: 'Private contacts' },
    ],
  },
] as const;

export function pathKey(pathname: string): string {
  const cleaned = pathname.replace(/\/+$/, '').replace(/^\//, '');
  return cleaned || '';
}

export function isActive(pathname: string, item: NavLink): boolean {
  const key = pathKey(pathname);
  if (item.keys) return item.keys.includes(key);
  return pathKey(item.href) === key;
}
