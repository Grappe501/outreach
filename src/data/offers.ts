export const platformMonthly = 149;

export const usageRates = {
  email: 0.0144,
  sms: 0.025,
  voice: 0.04,
  mail: 0.7,
} as const;

export const managedRates = {
  email: 0.015,
  sms: 0.028,
} as const;

/** Manual update — commitments toward founding L2 purchase */
export const funding = {
  goal: 24_000,
  committed: 8_400,
  updatedLabel: 'Updated manually · Aug 2026',
  note: 'Founding acquisition needs about $24,000. After that threshold, the same contribution rates continue—surplus funds reinvest in additional and newer data for the cooperative.',
} as const;

export const outcomeMetrics = [
  { value: '1.6M+', label: 'Arkansas voter records in play' },
  { value: '160+', label: 'HaystaqDNA models' },
  { value: '$149', label: 'Electd / month, no contract' },
  { value: '4', label: 'Cooperative contribution tiers' },
] as const;

export const comparisonRows = [
  {
    feature: 'Enhanced phones, emails, addresses',
    van: 'Limited / append later',
    electd: 'SOS + campaign contacts',
    managed: 'Same data layer',
    coop: 'L2-enhanced statewide file',
  },
  {
    feature: 'Multi-channel outreach OS',
    van: 'Partial / external tools',
    electd: 'Email, SMS, voice, mail, canvass',
    managed: 'Executed for you on Electd',
    coop: 'Uses Electd when subscribed',
  },
  {
    feature: 'Predictive issue & turnout models',
    van: 'Varies by committee',
    electd: 'Optional with coop file',
    managed: 'Optional with coop file',
    coop: '160+ HaystaqDNA scores',
  },
  {
    feature: 'Campaign contacts firewalled',
    van: 'Committee rules',
    electd: 'Yes — campaign-owned',
    managed: 'Yes — campaign-owned',
    coop: 'Yes — shared file ≠ shared CRM',
  },
  {
    feature: 'Typical cost posture',
    van: 'Seat + data fees elsewhere',
    electd: '$149/mo + usage',
    managed: 'Usage at managed rates',
    coop: 'One-time minimum contribution',
  },
] as const;
