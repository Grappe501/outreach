export const SITE = {
  name: 'Arkansas Campaign Data Cooperative',
  url: 'https://outreach-ar.netlify.app',
  tagline: 'Better Data. Better Organizing. Better Campaigns.',
  description:
    'Executive-grade Arkansas campaign infrastructure: Electd operating system, L2 enhanced voter intelligence, cooperative data acquisition, and managed outreach.',
} as const;

export type PageSchemaInput = {
  title: string;
  description: string;
  path: string;
  schemaExtra?: Record<string, unknown>[];
};

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    sameAs: ['https://www.electd.io/', 'https://l2-data.com/'],
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    publisher: { '@id': `${SITE.url}/#organization` },
  };
}

export function webpageSchema(input: PageSchemaInput) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE.url}${input.path}#webpage`,
    url: `${SITE.url}${input.path}`,
    name: input.title,
    description: input.description,
    isPartOf: { '@id': `${SITE.url}/#website` },
    about: { '@id': `${SITE.url}/#organization` },
  };
}

export function buildJsonLd(input: PageSchemaInput) {
  const graph: Record<string, unknown>[] = [
    organizationSchema(),
    websiteSchema(),
    webpageSchema(input),
    ...(input.schemaExtra ?? []),
  ];
  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export const electdOfferSchema = {
  '@type': 'Product',
  '@id': `${SITE.url}/platform/#product`,
  name: 'Electd Platform Subscription',
  description:
    'Political operating system for Arkansas campaigns: lists, CRM, canvassing, phones, email, SMS, voice, and mail.',
  brand: { '@type': 'Brand', name: 'Electd' },
  offers: {
    '@type': 'Offer',
    price: '149.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: `${SITE.url}/platform/`,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: '149.00',
      priceCurrency: 'USD',
      billingDuration: 'P1M',
      unitText: 'month',
    },
  },
};

export const pricingOfferCatalog = {
  '@type': 'OfferCatalog',
  '@id': `${SITE.url}/pricing/#offers`,
  name: 'Electd and managed outreach rates',
  itemListElement: [
    {
      '@type': 'Offer',
      name: 'Electd platform',
      price: '149.00',
      priceCurrency: 'USD',
      description: 'Monthly subscription, no contract',
    },
    {
      '@type': 'Offer',
      name: 'Email (platform usage)',
      price: '0.0144',
      priceCurrency: 'USD',
      description: 'Per email contact',
    },
    {
      '@type': 'Offer',
      name: 'SMS (platform usage)',
      price: '0.025',
      priceCurrency: 'USD',
      description: 'Per SMS',
    },
    {
      '@type': 'Offer',
      name: 'Voice (platform usage)',
      price: '0.04',
      priceCurrency: 'USD',
      description: 'Per minute',
    },
    {
      '@type': 'Offer',
      name: 'Mail (print & postage)',
      price: '0.70',
      priceCurrency: 'USD',
      description: 'Per piece',
    },
    {
      '@type': 'Offer',
      name: 'Managed email',
      price: '0.015',
      priceCurrency: 'USD',
      description: 'Full-service per contact',
    },
    {
      '@type': 'Offer',
      name: 'Managed SMS',
      price: '0.028',
      priceCurrency: 'USD',
      description: 'Full-service per text',
    },
  ],
};

export const cooperativeFaqSchema = {
  '@type': 'FAQPage',
  '@id': `${SITE.url}/cooperative/#faq`,
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the cooperative contribution minimums?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Published figures are one-time minimums: Local $200, County $300, Legislative $500, Statewide $700. Participants are encouraged to donate more if able.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the metro 50,000 rule work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Local races in metro areas of 50,000 or more must pay the county minimum ($300) rather than the local minimum ($200).',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the founding L2 purchase guaranteed?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Acquisition is conditional on funding approximately $24,000 toward the statewide enhanced file. Without cooperative funding, campaigns can still use SOS plus campaign-provided data on Electd.',
      },
    },
  ],
};
