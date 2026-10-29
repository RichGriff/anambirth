# Sitemap update plan

## Goal

Provide an accurate, production-only sitemap that:

- Contains only published content.
- Uses the correct public URLs.
- Updates when content is published, unpublished, or deleted.
- Is advertised through `robots.txt`.
- Does not expose sitemap content on staging deployments.

## Current problems

- `src/app/sitemap.ts` duplicates the existing page and post sitemap routes.
- Posts in the root sitemap use `/{slug}` instead of `/posts/{slug}`.
- The home page uses `/home` instead of `/`.
- The root sitemap bypasses Payload access control and does not explicitly filter for published content.
- The root sitemap is statically generated and does not respond to the existing sitemap cache tags.
- The correct `/pages-sitemap.xml` and `/posts-sitemap.xml` routes are not advertised by `robots.txt`.
- The child sitemaps can produce invalid URLs if `NEXT_PUBLIC_SERVER_URL` is absent.
- There are no automated sitemap tests.

## Implementation plan

- [x] Replace the duplicate root sitemap with a sitemap index at `/sitemap.xml`.
- [x] Make the sitemap index reference:
  - `/pages-sitemap.xml`
  - `/posts-sitemap.xml`
- [x] Use `getServerSideURL()` for every sitemap URL so all entries use the configured production origin and protocol.
- [x] Remove the old `src/app/sitemap.ts` implementation.
- [x] Keep the existing published-only Payload queries in the page and post sitemap routes.
- [x] Confirm page URLs map `home` to `/` and other pages to `/{slug}`.
- [x] Confirm post URLs map to `/posts/{slug}`.
- [x] Preserve the existing `pages-sitemap` and `posts-sitemap` cache tags.
- [x] Confirm the existing collection hooks invalidate the relevant sitemap when content is published, unpublished, updated, or deleted.
- [x] Prevent the sitemap index and child sitemaps from returning site URLs when indexing is disabled.
- [x] Keep `robots.txt` advertising only the root `/sitemap.xml` index in production.
- [x] Add focused tests for production gating, sitemap index entries, published-content filtering, and URL formatting.
- [x] Run lint, sitemap tests, and a production build.
- [ ] Verify the deployed endpoints and response headers.

## Expected files

- Delete `src/app/sitemap.ts`.
- Add `src/app/(frontend)/(sitemaps)/sitemap.xml/route.ts`.
- Update `src/app/(frontend)/(sitemaps)/pages-sitemap.xml/route.ts`.
- Update `src/app/(frontend)/(sitemaps)/posts-sitemap.xml/route.ts`.
- Update `src/app/robots.ts` only if required for the shared production check.
- Add sitemap tests under `tests/int/`.

## Acceptance criteria

### Production

With:

```env
APP_ENV=production
ALLOW_INDEXING=true
NEXT_PUBLIC_SERVER_URL=https://production-domain.com
```

The deployment must satisfy:

- `/robots.txt` advertises `https://production-domain.com/sitemap.xml`.
- `/sitemap.xml` is a valid sitemap index.
- The sitemap index references the page and post sitemaps.
- The page sitemap contains only published pages.
- The home page URL is `https://production-domain.com/`.
- Post URLs use `https://production-domain.com/posts/{slug}`.
- No URL contains `localhost`, `example.com`, or a hostname without `https://`.
- Publishing, unpublishing, or deleting content updates the relevant child sitemap without requiring a rebuild.
- Site responses do not contain `X-Robots-Tag: noindex`.

### Staging

With:

```env
APP_ENV=staging
ALLOW_INDEXING=false
NEXT_PUBLIC_SERVER_URL=https://staging-domain.com
```

The deployment must satisfy:

- `/robots.txt` disallows crawling.
- `/robots.txt` does not advertise a sitemap.
- Sitemap endpoints do not return indexable site URLs.
- Site responses contain `X-Robots-Tag: noindex, nofollow, noarchive`.

## Deployment verification

Run after a clean production rebuild:

```bash
curl -I https://production-domain.com/
curl https://production-domain.com/robots.txt
curl https://production-domain.com/sitemap.xml
curl https://production-domain.com/pages-sitemap.xml
curl https://production-domain.com/posts-sitemap.xml
```

Submit the root sitemap index to Google Search Console after verifying its contents.

## Out of scope

The following SEO issues should be handled separately:

- Canonical URLs.
- Incorrect Open Graph page URLs.
- Template Open Graph descriptions and Twitter metadata.
- The current rule that blocks Bingbot.

## Review

Implemented the sitemap index and retained the existing page and post sitemaps as its children. All sitemap routes now use the configured server URL, return `404` when indexing is disabled, and share the same indexing decision as `robots.txt` and the site-wide `X-Robots-Tag` header.

Verification results:

- Five focused sitemap tests pass.
- TypeScript validation passes with `pnpm exec tsc --noEmit`.
- The production build compiles and passes its TypeScript phase, then stops because the local `DATABASE_URL` credentials cannot authenticate to Postgres.
- The project-wide lint command is blocked by an existing circular ESLint configuration error.
- The full integration suite runs the sitemap tests successfully, but the existing API test is blocked by an ESM directory import in `@veiag/payload-cmdk`.
- Deployment endpoint verification remains pending until the hosting platform rebuilds the app with valid production credentials.
