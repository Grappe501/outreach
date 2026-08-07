# Arkansas Campaign Data Cooperative

Static marketing site for the Arkansas Campaign Data Cooperative.

## Local preview

Open `index.html` in a browser, or from this folder:

```bash
npx --yes serve .
```

## GitHub + Netlify

1. Create a new GitHub repository.
2. Push this folder as the repo root.
3. In Netlify: **Add new site → Import from Git** → select the repo.
4. Build settings: leave build command blank; publish directory = `/` (repo root).
5. After deploy, form submissions appear under **Forms** (Netlify Forms is enabled via `data-netlify="true"` on the join form).

## Forms

The join form posts to Netlify Forms as `cooperative-interest` with intents:

- Request Information
- Reserve Cooperative Pricing
- Schedule a Demonstration
