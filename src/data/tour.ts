export type MockStep = {
  id: string;
  label: string;
  rail: string;
  ask: string;
  count: string;
  voters: { name: string; channels: string }[];
  feed: { time: string; text: string }[];
  note: string;
};

/** Arkansas workflow storyboard — illustrative only */
export const mockSteps: MockStep[] = [
  {
    id: 'ask',
    label: 'Ask',
    rail: 'Lists',
    ask: 'Show persuadable Democrats in Pulaski with mobile numbers…',
    count: '12,480',
    voters: [
      { name: 'Jordan M. · HD-32', channels: 'Mobile · Email' },
      { name: 'Alex R. · Pulaski', channels: 'Mobile' },
      { name: 'Casey T. · LR', channels: 'Email · Mail' },
      { name: 'Morgan L. · NLR', channels: 'Mobile · Voice' },
    ],
    feed: [
      { time: 'now', text: 'Ask Electd returned · Pulaski' },
      { time: '1m', text: 'Filters: mobile + persuadable' },
      { time: '3m', text: 'Universe saved · HQ list' },
      { time: '8m', text: 'Shared with field lead' },
    ],
    note: 'Natural-language list building for Arkansas geographies.',
  },
  {
    id: 'list',
    label: 'List',
    rail: 'CRM',
    ask: 'Rank this universe by Haystaq turnout score and last contact…',
    count: '8,920',
    voters: [
      { name: 'Priority A · 2,140', channels: 'Ready to dial' },
      { name: 'Priority B · 3,605', channels: 'SMS first' },
      { name: 'Priority C · 2,175', channels: 'Mail + follow-up' },
      { name: 'Hold · 1,000', channels: 'Needs append' },
    ],
    feed: [
      { time: 'now', text: 'CRM tags applied · priority bands' },
      { time: '2m', text: 'Duplicates merged · 48' },
      { time: '5m', text: 'VAN match queued' },
      { time: '9m', text: 'Export suppressed — stay in Electd' },
    ],
    note: 'Target universe ranked for outreach—not a spreadsheet export.',
  },
  {
    id: 'sms',
    label: 'SMS',
    rail: 'Outreach',
    ask: 'Queue a weekend SMS wave to Priority B with mobile numbers…',
    count: '3,605',
    voters: [
      { name: 'Wave draft · ready', channels: 'SMS · 3,605' },
      { name: 'Quiet hours · set', channels: 'Fri 5–8pm' },
      { name: 'Opt-outs · tracked', channels: 'CRM synced' },
      { name: 'Cost estimate', channels: '× $0.025 usage' },
    ],
    feed: [
      { time: 'now', text: 'SMS wave queued · 3,605' },
      { time: '4m', text: 'Compliance checks passed' },
      { time: '7m', text: 'Reply keywords mapped' },
      { time: '12m', text: 'Dashboard live · sends' },
    ],
    note: 'Execute SMS on Electd usage rates—or hand off to managed.',
  },
  {
    id: 'canvass',
    label: 'Canvass',
    rail: 'Canvass',
    ask: 'Cut weekend turf in Ward 2 for high-turnout Priority A doors…',
    count: '420',
    voters: [
      { name: 'Turf A · Ward 2', channels: '84 doors' },
      { name: 'Turf B · Ward 2', channels: '91 doors' },
      { name: 'Turf C · NLR', channels: '76 doors' },
      { name: 'Float · backup', channels: '169 doors' },
    ],
    feed: [
      { time: 'now', text: 'Canvass turf synced · Ward 2' },
      { time: '3m', text: 'Volunteer shift · 8 confirmed' },
      { time: '6m', text: 'Walk lists on phones' },
      { time: '15m', text: 'Results flowing to CRM' },
    ],
    note: 'From Ask → list → SMS → doors without leaving the workspace.',
  },
];

export const platformTour = [
  {
    id: 'ask',
    title: 'Ask Electd',
    body: 'Build Arkansas lists with natural language or advanced targeting—Pulaski mobiles, HD turf, persuadable bands—without exporting spreadsheets first.',
  },
  {
    id: 'strategy',
    title: 'Strategy to next action',
    body: 'Surface high-impact moves from goals, budget, and voter data so teams know who to contact and what to do next.',
  },
  {
    id: 'outreach',
    title: 'Execute in one place',
    body: 'Email, SMS, voice, mail, canvassing, and phone banking from the same OS—usage billed on published Electd rates.',
  },
  {
    id: 'arkansas',
    title: 'Arkansas data layers',
    body: 'Start with SOS registration plus campaign contacts. Optional L2-enhanced statewide data is funded separately through the cooperative.',
  },
] as const;
