# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from `src/backend/`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Head Metadata (SEO and Link Previews)

`src/frontend/index.html` ships with social-sharing meta tags (`description`, `og:title`, `og:description`, `og:type`, `og:image`, `og:image:alt`, `twitter:card`, `twitter:image`). Links shared to this app only render a preview card if these tags are present in the deployed `index.html`.

When editing `index.html` (e.g. changing the title or favicon):

- **Never remove these meta tags.** Update them instead.
- Keep `og:title` identical to `<title>`, and `og:description` identical to the `description` meta tag.
- `og:image` and `twitter:image` must always point to an absolute `https://` URL. Keep the pre-configured default image unless the user explicitly provides or requests a custom share image; a custom image should be 1200×630 pixels.

## Learnings

- Production publishing is connected to `terrybrutus/my-work-portfolio` on `main` through a repository-scoped read-only Netlify deploy key and push webhook. A push triggers Netlify tests, typecheck, build, and exact GIF-copy verification before publishing to terrylxd.com. Local saves alone do not commit or push. Use Git pushes for routine publication; verify the resulting remote build succeeds rather than uploading a separate manual deploy.
- The public game location is `https://terrylxd.com/enablement/`. The separate `play.terrylxd.com` Netlify project redirects that hostname to the portfolio game; its redirect is tracked in the `enablement-quest` repository's `netlify.toml`. Do not create a second games hub or advertise duplicate game addresses.
- The user requested a portfolio-branded social preview. Preserve the custom `https://terrylxd.com/assets/social/portfolio-share-v1.png` metadata instead of restoring the old Caffeine logo. Its editable vector source is `public/assets/social/portfolio-share.svg`; regenerate the 1200x630 PNG with `node scripts/generate-share-image.mjs` from the repository root. Version the PNG URL when changing it so social crawlers can fetch a fresh asset.
- The portfolio's established local origin is `http://127.0.0.1:44120`. Keep this port stable because existing browser drafts are tied to it.
- Local admin's **Save to project** uses the development-only `/__portfolio/save` endpoint in `src/frontend/scripts/portfolio-save.mjs`. It writes content to `src/frontend/src/content/portfolio.json` and uploaded images to `src/frontend/public/assets/uploads/`. These files are build inputs and must be included when committing/publishing user edits. Do not reset them to defaults.
- Browser draft saving is a temporary fallback. It is not equivalent to a confirmed project-file save or public deployment. Existing portfolio tabs synchronize browser draft changes through storage events.
- All image inputs use `ImageUpload.tsx` and the binary `/__portfolio/image` endpoint. This endpoint patches only the requested image in the latest on-disk content; never reintroduce base64 image drafts or whole-portfolio saves to attach an upload. `/__portfolio/content` supplies fresh saved content to local previews. Full saves require the last read `X-Portfolio-Revision` and reject stale editors with HTTP 409.
