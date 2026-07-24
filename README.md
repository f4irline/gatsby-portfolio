# Tommi Lepola portfolio

A small Astro static site for [tommilepola.fi](https://tommilepola.fi). The
site deliberately remains a single, fast landing page while a future portfolio
redesign is planned.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm 11 or newer

## Local development

```sh
npm ci
npm run dev
```

Use `npm run build` to generate the production site in `dist/`, then
`npm run preview` to serve that exact output locally.

## Checks

```sh
npm run format:check
npm run check
npm run build
npm run test:links
npm test
```

`npm test` requires the Playwright Chromium browser. Install it once with
`npx playwright install chromium` (use `--with-deps` on Linux CI runners).

## Structure

- `src/data/site.ts` is the typed source for the page content, links, and
  metadata.
- `src/components/Hero.astro` contains the static hero markup and its scoped
  styling.
- `src/layouts/BaseLayout.astro` supplies metadata and structured data.
- `public/` contains the favicon, fonts, icons, robots file, and sitemap.

The page is fully static HTML and does not hydrate a client framework.

## Résumé URL

Set `PUBLIC_RESUME_URL` during a build to replace the default résumé URL. This
must be a public, directly reachable PDF URL. The site intentionally uses a
normal anchor rather than a browser fetch or download handler.

Before production cutover, verify this URL from an unauthenticated browser.
Do not remove the legacy `file-api` Lambda source until the public link has
been verified through the production delivery path.

## Deployment

The workflow verifies pull requests and pushes to `master`. A production deploy
requires an explicit manual dispatch from `master` with the `deploy` input
enabled, through the protected `production` GitHub environment. It expects
these repository or environment variables:

- `AWS_DEPLOY_ROLE_ARN`
- `AWS_REGION`
- `SITE_BUCKET`
- `CLOUDFRONT_DISTRIBUTION_ID` (optional)

The deployment role must use GitHub Actions OIDC and be restricted to the
required S3 upload and CloudFront invalidation operations. No long-lived AWS
access keys are used. Review the generated `dist/` output and obtain explicit
production approval before enabling or merging the deployment workflow.
