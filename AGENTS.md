# Project Guidance

## User Preferences

- All project-card thumbnails fill their frames using centered object-fit: cover, regardless of the project's full-image fitting preference. Preserve contain behavior for full-image modal views where configured; do not alter or recompress source GIFs to fill a thumbnail.
- Expanded carousel and project-page images must show the complete source without cropping text or controls. Their visible borders follow the image's own proportions, not a padded fixed-aspect box. Do not restore height:100% or forced 16:9 on expanded image elements, including in mobile overrides.

- Stylebook's portfolio sample is an isolated copy in src/frontend/stylebook-demo. Never connect it to the active Stylebook2 app, import production records/backups/environment files, seed a Caffeine backend, or deploy changes to that app from portfolio work. Keep the fictional fixtures, namespaced browser-only storage, connect-src 'none' policy, and isolation tests. The frontend build rebuilds the sample into public/stylebook/demo. LinkedIn decks are research context only, not portfolio graphics or independent verification of numerical results.

- Loading feedback is the default for all current and future portfolio work. Internal projects and document links open in the same tab. HTML entries must paint an opening message before heavy scripts, offer reload/return controls if loading stalls, and clear the message when content is available without artificial waits. Reuse public/assets/project-opening.js with an appropriate visible-content selector for new standalone players. Use LoadingImage/DeferredImage for project media and document pages so downloads and failures have visible feedback and retries. Preserve native vertical scrolling, keyboard access, reduced-motion preferences, and existing project routes; loading messages cannot prevent browser-controlled delays before HTML arrives or guarantee third-party uptime.

- Mobile projects must stay horizontally fixed in portrait and landscape, with no document-level sideways overflow. Preserve normal vertical scrolling and pinch zoom. Isolate intentional game gestures from browser scrolling only on the actual control surface; never disable touch across a whole page. Test narrow phones, landscape, tablets, long text, dialogs, keyboard-sized heights, browser chrome changes, and safe-area insets. Emulated layout checks are not proof of physical iPhone gesture behavior; report that limit honestly. Apply this requirement to future portfolio and game work.
- On single-column mobile project cards, show the full summary and outcome with natural height. Do not use line clamps that leave a clipped last line or text outside the outcome box. Keep the multi-column desktop alignment behavior.

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
- Featured order is Enablement Quest, Common Thread, Why Blockchain Actually Matters, then AI & The Future of Work and the remaining existing projects. Worduel is last, coming soon, with no playable link. Only Worduel offers the one-time launch signup; submissions are stored in the Netlify `worduel-launch` form. Sending the eventual launch email is a separate action, not automatic on a Git push.
- Common Thread's `/common-thread/` page embeds its existing Caffeine game; it is not an independent copy of the backend. Preserve its Google/account boundaries. Custom AI puzzles are beta; do not claim universal transcript support or that unverified local changes have been imported to Caffeine.
- New Common Thread and Worduel GIFs use real browser screenshots at their captured resolution. Rebuild with `scripts/build-game-gifs.py` only from reviewed captures. The new graphics use `imageFit: "contain"` to avoid cropping game content; existing project GIFs remain untouched.
