# Gatsby to Astro Migration Plan

## Status

- **Plan status:** Ready for implementation
- **Migration approach:** Preserve visual and content parity first
- **Résumé access:** Public direct link
- **Target framework:** Astro with TypeScript
- **Client framework:** None initially; do not add React unless a future feature requires it
- **Runtime:** Node.js 24 LTS
- **Package manager:** npm
- **Hosting:** Keep the existing AWS S3/CloudFront setup
- **Production changes:** Do not deploy or change AWS resources without explicit approval

## Objective

Replace the unsupported Gatsby 4 application with a small, maintainable Astro
static site while preserving the current appearance, content, URLs, and hosting.
Remove the unnecessary résumé API and browser-side React code, modernize the
build and deployment workflow, and establish a clean base for a later portfolio
redesign.

The first production release should look intentionally familiar. Design and
content expansion belong to a separate phase after the migration is stable.

## Confirmed Decisions

1. **Visual parity comes first.**
   - Preserve the current full-height hero layout, colors, typography, icon
     order, responsive behavior, and introductory fade.
   - Small changes are allowed when necessary for accessibility, browser
     compatibility, or correctness.
   - Do not add projects, work history, a blog, or new visual concepts during
     the migration.

2. **The résumé is public.**
   - Replace the Lambda/fetch/blob/download chain with a normal link to the
     existing public PDF.
   - Store the résumé URL in the site's typed data/configuration.
   - A normal navigation to the PDF does not require browser CORS access.
   - Remove the Lambda only after the new link has been verified in production.

3. **AWS hosting remains in place.**
   - Continue publishing a static build to the `tommilepola.fi` S3 bucket and
     serving it through the existing delivery layer.
   - Replace long-lived AWS keys in GitHub Actions with OIDC when the required
     AWS IAM role is ready.
   - DNS, CloudFront, S3 policies, and other AWS resources are out of scope
     until separately approved.

## Current-State Summary

The application currently consists of:

- one Gatsby page;
- one React hero component;
- static TypeScript data wrapped in React state and context;
- a `react-reveal` fade animation;
- SCSS styles and local fonts;
- five social/résumé SVG assets;
- a Lambda that returns a deterministic S3 URL for the résumé;
- a three-job GitHub Actions build and S3 deployment workflow.

Important issues to resolve:

- Gatsby 4, React 17, Node 16, and the Lambda's Node 12 runtime are obsolete;
- the client-side résumé environment variable is not exposed correctly by
  Gatsby and is inconsistently named in CI;
- the Lambda does not sign or protect the résumé and therefore adds no useful
  security;
- Sass `@import` usage is deprecated;
- the page relies on JavaScript for content that can be static HTML;
- the repository has no meaningful automated tests or project documentation;
- most bundled font files are unused.

## Target Architecture

```text
Browser
  |
  v
CloudFront / existing delivery layer
  |
  v
S3: tommilepola.fi
  |
  +-- index.html
  +-- _astro/*              hashed CSS/assets
  +-- fonts/*
  +-- img/icons/*
  +-- favicon and metadata
  |
  +---- direct link ----> public résumé PDF in existing S3 storage
```

The site will be generated at build time. The initial page should require no
hydrated React application and ideally no client-side JavaScript.

### Proposed Source Layout

```text
public/
  favicon.ico
  fonts/
  img/icons/
src/
  components/
    Hero.astro
    SocialLinks.astro
  data/
    site.ts
  layouts/
    BaseLayout.astro
  pages/
    index.astro
  styles/
    global.css
astro.config.mjs
package.json
tsconfig.json
```

Components may be consolidated if splitting this one-page site makes it harder
to understand. The structure should remain proportional to the site's size.

## Migration Phases

### Phase 0 — Baseline and Safety

- [ ] Create a dedicated migration branch, suggested name:
      `codex/migrate-gatsby-to-astro`.
- [ ] Confirm the Git working tree is clean before implementation.
- [ ] Capture desktop and mobile screenshots of the current site or local
      production build for visual comparison.
- [ ] Record the current production URL, résumé URL, S3 site bucket, AWS region,
      CloudFront distribution ID, and current deployment behavior.
- [ ] Verify whether S3 versioning or another production rollback mechanism is
      available.
- [ ] Save the last known-good Gatsby build as a CI artifact or other
      recoverable deployment package.

**Exit criteria**

- A visual baseline and rollback artifact exist.
- Production infrastructure identifiers are documented without committing
  credentials.

### Phase 1 — Replace the Gatsby Toolchain

- [ ] Replace Gatsby dependencies and scripts with the current stable Astro
      toolchain.
- [ ] Use Astro's strict TypeScript configuration.
- [ ] Add Node 24 to `engines` and a version-manager file such as `.nvmrc`.
- [ ] Standardize on npm and generate `package-lock.json`.
- [ ] Remove the Yarn lockfiles only after the npm installation succeeds.
- [ ] Add scripts for:
  - `dev`
  - `build`
  - `preview`
  - `check`
  - `format`
  - `format:check`
- [ ] Remove Gatsby configuration and browser bootstrap files once their
      behavior has been migrated.
- [ ] Ensure Astro builds to its default `dist/` directory.

**Exit criteria**

- A minimal Astro page installs, type-checks, and builds on Node 24.
- No Gatsby package is present in the dependency graph.

### Phase 2 — Migrate the Page with Visual Parity

- [ ] Convert the Gatsby page and hero component to Astro.
- [ ] Replace React context and state with a typed `site.ts` data object.
- [ ] Preserve:
  - the “Hello” heading;
  - name and role text;
  - the horizontal divider;
  - GitHub, LinkedIn, email, and résumé links;
  - current colors, spacing, breakpoints, and icon sizing.
- [ ] Use semantic elements such as `main`, `header`, `nav`, and descriptive
      link labels where appropriate.
- [ ] Keep SVG icons, but ensure each icon-only link has an accessible name.
- [ ] Replace `react-reveal` with CSS animation.
- [ ] Ensure the content is visible by default and animation is progressive
      enhancement, avoiding a permanently transparent page if styles or
      animation fail.
- [ ] Disable non-essential motion when `prefers-reduced-motion: reduce` is
      active.
- [ ] Preserve keyboard focus indicators and provide a focus treatment at
      least as clear as the hover treatment.

**Exit criteria**

- Desktop and mobile views closely match the baseline.
- The entire initial page is rendered as static HTML.
- The page works with JavaScript disabled.
- Keyboard and reduced-motion behavior are correct.

### Phase 3 — Simplify Résumé Delivery

- [ ] Put the existing public résumé URL in the typed site data.
- [ ] Render the résumé as a normal anchor link.
- [ ] Prefer opening the PDF normally over fetching it into browser memory.
- [ ] Verify the PDF URL returns a successful response without authentication.
- [ ] Remove:
  - `src/utils/api.ts`;
  - `src/utils/file.ts`;
  - the résumé click handler;
  - the Lambda endpoint environment variables;
  - the `file-api` directory, but only after production verification.
- [ ] Remove the Lambda deployment separately from the website cutover after
      confirming it has no remaining consumers.

**Exit criteria**

- The résumé is reachable by mouse and keyboard.
- No browser fetch, blob conversion, client environment variable, or Lambda is
  required for the download.

### Phase 4 — Modernize Styling and Assets

- [ ] Move static Gatsby assets into Astro's `public/` structure or import them
      from `src/` when hashing is beneficial.
- [ ] Replace Sass globals with CSS custom properties.
- [ ] Prefer modern CSS and Astro-scoped styles; keep Sass only if it materially
      improves maintainability.
- [ ] If Sass remains, replace deprecated `@import` rules with `@use` and
      `@forward`.
- [ ] Retain only font families and weights actually used by the page.
- [ ] Convert retained fonts to WOFF2 where licensing and tooling allow.
- [ ] Add `font-display: swap`.
- [ ] Remove the unused `tryhackme.svg` unless it is intentionally restored to
      the visible link list.
- [ ] Confirm all font and icon paths work in the production build.

**Exit criteria**

- No Sass deprecation warnings are emitted.
- Unused font files and assets are not shipped.
- Visual differences caused by font conversion are acceptable.

### Phase 5 — Metadata, Accessibility, and Quality

- [ ] Add a shared HTML layout containing:
  - `lang="en"`;
  - character set and viewport metadata;
  - page title and description;
  - canonical URL;
  - favicon;
  - Open Graph metadata;
  - basic social sharing metadata.
- [ ] Add `robots.txt` and a sitemap if appropriate for the final route set.
- [ ] Add `Person` structured data with only accurate public information.
- [ ] Ensure external links, email, and résumé link purposes are unambiguous.
- [ ] Validate heading hierarchy and document landmarks.
- [ ] Check color contrast, keyboard navigation, zoom behavior, and responsive
      layout.
- [ ] Replace the starter README with project-specific setup, architecture,
      deployment, and troubleshooting instructions.

**Exit criteria**

- The built page has complete baseline metadata.
- Automated accessibility checks report no serious violations.
- The README is sufficient for a clean-machine setup.

### Phase 6 — Testing and Build Verification

- [ ] Make `npm run check`, `npm run format:check`, and `npm run build`
      mandatory CI checks.
- [ ] Add a small browser smoke test covering:
  - the hero content;
  - all four primary links;
  - keyboard focus;
  - mobile and desktop viewport overflow;
  - reduced-motion behavior.
- [ ] Add a broken-link check for internal assets and the résumé URL.
- [ ] Inspect the generated `dist/index.html` to confirm meaningful static
      content is present.
- [ ] Confirm there is no unexpected hydrated JavaScript bundle.
- [ ] Run a production preview and visually compare it with the baseline.
- [ ] Establish lightweight performance expectations:
  - no unexpected layout shift;
  - no blocking third-party scripts;
  - compressed assets;
  - reasonable font payload;
  - successful Lighthouse checks for performance, accessibility, best
    practices, and SEO.

**Exit criteria**

- All local and CI checks pass.
- The production build is visually and functionally approved.

### Phase 7 — Modernize CI/CD

- [ ] Replace the three-job workflow with a straightforward build-and-deploy
      workflow.
- [ ] Use Node 24 and `npm ci`.
- [ ] Cache npm's package cache rather than transferring `node_modules` between
      jobs.
- [ ] Run checks and builds for pull requests without deploying them.
- [ ] Deploy only approved pushes to the production branch.
- [ ] Pin third-party GitHub Actions to reviewed commit SHAs and annotate their
      release versions.
- [ ] Configure minimal GitHub token permissions.
- [ ] Configure GitHub Actions OIDC for AWS using a least-privilege deployment
      role.
- [ ] Store non-secret deployment identifiers as repository or environment
      variables:
  - AWS region;
  - deploy role ARN;
  - site bucket name;
  - CloudFront distribution ID.
- [ ] Limit the AWS role to the required S3 object operations and CloudFront
      invalidation.
- [ ] Deploy `dist/`, not Gatsby's `public/` or `.cache/`.
- [ ] Set short/no-cache behavior for HTML and long immutable caching for
      hashed `_astro/` assets.
- [ ] Invalidate CloudFront only when necessary after a successful upload.
- [ ] Protect the production GitHub environment if available.

**Exit criteria**

- Pull requests build without AWS credentials.
- Production deploys use temporary OIDC credentials.
- No long-lived AWS access key is required by the workflow.

### Phase 8 — Staging, Cutover, and Cleanup

- [ ] Deploy the Astro output to a staging location or isolated prefix.
- [ ] Verify the final page, assets, metadata, and résumé link through the
      actual AWS delivery path.
- [ ] Confirm caching headers and HTTPS behavior.
- [ ] Obtain explicit approval before the production upload.
- [ ] Deploy to the production site bucket without changing DNS.
- [ ] Run post-deployment smoke tests from the public URL.
- [ ] Monitor for failed asset requests and unexpected 4xx/5xx responses.
- [ ] Keep the last Gatsby artifact available through the rollback window.
- [ ] After production approval:
  - remove obsolete Gatsby files;
  - remove the `file-api` source;
  - retire the Lambda/API Gateway stack separately;
  - remove unused GitHub secrets;
  - update repository description and documentation.

**Exit criteria**

- Astro serves the production domain correctly.
- The public résumé link works.
- Rollback remains possible until the migration is accepted.
- Obsolete runtime and credential exposure have been removed.

## Validation Matrix

| Area | Required validation |
| --- | --- |
| Build | Clean install, type check, format check, production build |
| Rendering | Static HTML contains all visible content |
| Responsive layout | Small phone, tablet, laptop, and wide desktop |
| Browsers | Current Chrome, Firefox, and Safari |
| Input | Mouse, keyboard-only navigation, visible focus |
| Motion | Normal animation and reduced-motion mode |
| Links | GitHub, LinkedIn, email, and résumé |
| Accessibility | Landmarks, headings, names, contrast, zoom, automated scan |
| Metadata | Title, description, canonical, social preview, structured data |
| Performance | Fonts, asset sizes, layout shift, unexpected JavaScript |
| Deployment | S3 contents, cache headers, CloudFront delivery, public smoke test |

## Expected File Mapping

| Gatsby source | Astro destination |
| --- | --- |
| `src/pages/index.tsx` | `src/pages/index.astro` |
| `src/pages/hero/hero.tsx` | `src/components/Hero.astro` |
| `src/data/hero.ts` | `src/data/site.ts` |
| `src/context/context.ts` | Removed |
| `src/models/*` | Consolidated into typed site data where useful |
| `src/styles/*` | `src/styles/global.css` and component-scoped styles |
| `static/*` | `public/*` or imported source assets |
| `gatsby-browser.js` | Behavior moved into the base layout/styles |
| `gatsby-config.js` | `astro.config.mjs`; S3 deployment moves to CI |
| `src/utils/api.ts` | Removed |
| `src/utils/file.ts` | Removed |
| `file-api/*` | Removed after production verification |
| Gatsby `public/` | Replaced by Astro `dist/` build output |

## Risks and Mitigations

### Résumé object is not publicly reachable

- Verify the current object URL before deleting any code.
- If it is not public, either publish it intentionally or implement a properly
  signed URL flow as a separately approved change.
- Keep the existing Lambda until the direct link is proven in production.

### Visual differences after removing React Reveal

- Compare screenshots at representative viewports.
- Match duration and easing where useful, but prioritize content visibility and
  reduced-motion accessibility.

### Font rendering changes

- Preserve the existing font files for the first parity comparison.
- Optimize and convert fonts only after confirming fallback and metric
  differences are acceptable.

### Cached Gatsby assets survive the cutover

- Use hashed Astro assets and correct cache headers.
- Invalidate the delivery cache after the successful production upload.
- Confirm the HTML references only current asset hashes.

### Deployment workflow loses access

- Introduce and test OIDC in a non-production environment first.
- Keep the old deployment path available until the new workflow completes a
  verified deployment.
- Remove long-lived credentials only after OIDC succeeds.

### Cleanup occurs too early

- Separate website cutover from Lambda/API Gateway deletion.
- Keep the previous build and infrastructure intact through the agreed rollback
  window.

## Rollback Strategy

1. Preserve the last known-good Gatsby production artifact before cutover.
2. Avoid DNS changes; deploy only site bucket contents.
3. If production validation fails, restore the previous artifact to the site
   bucket.
4. Invalidate CloudFront so restored HTML and assets are served.
5. Leave the existing résumé API deployed until the Astro release is accepted.
6. Do not remove AWS credentials, Lambda resources, or old source files until
   rollback has been tested or the rollback window has closed.

## Definition of Done

The migration is complete when:

- Astro replaces Gatsby and builds reproducibly on Node 24;
- the production page matches the approved visual baseline;
- all content is useful static HTML without React hydration;
- the four primary links work, including the public résumé;
- the page meets baseline keyboard, reduced-motion, metadata, and accessibility
  requirements;
- CI verifies formatting, types, the production build, and essential browser
  behavior;
- production deployment uses temporary AWS credentials through OIDC;
- the public domain serves the Astro build successfully;
- a tested rollback path exists through the acceptance window;
- obsolete Gatsby, React, Yarn, Lambda, Serverless, and long-lived credential
  configuration is removed after approval;
- repository documentation reflects the new architecture and workflow.

## Deferred Follow-up: Portfolio Redesign

The following work is intentionally excluded from the parity migration:

- project and case-study pages;
- experience or résumé timeline;
- personal biography and profile photography;
- contact form;
- blog or CMS;
- analytics;
- dark/light theme switching;
- internationalization;
- new branding, typography, or motion language.

After the Astro migration is stable, these can be designed against a simpler
and better-supported foundation without mixing infrastructure risk with product
and visual decisions.

## Reference Documentation

- [Astro: Migrating from Gatsby](https://docs.astro.build/en/guides/migrate-to-astro/from-gatsby/)
- [Astro: Deploy to AWS](https://docs.astro.build/en/guides/deploy/aws/)
- [GitHub Actions: Configuring OIDC in AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
- [Sass: `@import` deprecation](https://sass-lang.com/documentation/breaking-changes/import/)
- [Node.js release schedule](https://nodejs.org/en/about/previous-releases)
