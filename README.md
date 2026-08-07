# Arkansas Campaign Data Cooperative

Static marketing site for the Arkansas Campaign Data Cooperative.

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Main pitch, cooperative data model, join form |
| `platform.html` | Sell Raw/Platform — **$125/month**, no contract |
| `managed.html` | Sell Managed communications (floor sample rates) |
| `pricing.html` | Sample rate card: Raw vs Managed |

## Sample pricing (provisional)

**Platform:** $125/month · no contract · SOS data + campaign-provided contacts · usage billed separately

**Data Cooperative:** separate one-time contributions (see homepage); optional enhanced statewide file

| Channel | Raw / platform | Managed (low end) |
|---------|----------------|-------------------|
| Email | $0.00125/email | $0.015/contact |
| SMS | $0.018/segment | $0.028/text |
| MMS | $0.04/message | $0.05/message |
| Direct mail 6×9 | — | $0.35/piece delivered |
| Larger mail | — | $0.55/piece delivered |

These are sample market-aligned starting points. Final rates will be set before launch.

## Local preview

```bash
npx --yes serve .
```

## GitHub + Netlify

Repo: [Grappe501/outreach](https://github.com/Grappe501/outreach)

1. Push this folder as the repo root.
2. Netlify: import the repo; leave build command blank; publish directory = `/`.
3. Form submissions appear under **Forms** (`cooperative-interest`).

## Forms

Intents on the join form:

- Request Information
- Platform ($125/mo)
- Managed Services
- Reserve Cooperative Pricing
- Schedule a Demonstration

Deep links: `index.html?intent=platform#join` or `?intent=managed#join`
