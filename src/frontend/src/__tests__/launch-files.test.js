// @vitest-environment node
import {readFile, readdir, stat} from "node:fs/promises";
import path from "node:path";
import {expect, it} from "vitest";
import {projectSamples} from "../content/project-samples";

const root = path.resolve(import.meta.dirname, "../..");
it("requires a startup state for every standalone public project entry", async () => {
  for (const entry of await readdir(path.join(root, "public"), {withFileTypes: true})) {
    if (!entry.isDirectory() || entry.name.startsWith(".") || ["assets", "worduel-notify"].includes(entry.name)) continue;
    let html;
    try { html = await readFile(path.join(root, "public", entry.name, "index.html"), "utf8"); }
    catch (error) { if (error.code === "ENOENT") continue; throw error; }
    expect(html, `${entry.name} must include opening feedback`).toMatch(/project-opening\.js|id="game-opening"|id="enablement-opening"/);
  }
});
it("preserves Enablement Quest's opening state when repackaging the game", async () => {
  const repositoryRoot = path.resolve(root, "../..");
  const startup = await readFile(path.join(repositoryRoot, "scripts/enablement-startup.html"), "utf8");
  const html = await readFile(path.join(root, "public/enablement/index.html"), "utf8");
  const packager = await readFile(path.join(repositoryRoot, "scripts/package-enablement.mjs"), "utf8");
  expect(html.replaceAll("\r\n", "\n")).toContain(startup.replaceAll("\r\n", "\n").trimEnd());
  expect(startup).toContain("Opening Enablement Quest");
  expect(startup).toContain("Reload game");
  expect(packager).toContain("enablement-startup.html");
});
it("checks tests, types, and unchanged GIFs before automatic publication", async () => {
  const repositoryRoot = path.resolve(root, "../..");
  const config = await readFile(path.join(repositoryRoot, "netlify.toml"), "utf8");
  expect(config).toContain("corepack pnpm --dir src/frontend test &&");
  expect(config).toContain("corepack pnpm --dir src/frontend typecheck &&");
  expect(config).toContain("corepack pnpm --dir src/frontend build && node scripts/verify-gif-assets.mjs");
  const packageJson = JSON.parse(await readFile(path.join(repositoryRoot, "package.json"), "utf8"));
  expect(packageJson.packageManager).toBe("pnpm@10.12.1");
});

it("keeps every saved Open Project link on the portfolio domain and routes courses before the SPA fallback", async () => {
  const {content} = JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"));
  for (const project of content.projects) {
    if (project.status === "coming-soon") expect(project.url).toBeUndefined();
    else expect(project.url).toMatch(/^\/(?!\/)/);
  }
  const redirects = await readFile(path.join(root, "public/_redirects"), "utf8");
  for (const prefix of ["ai-future-of-work", "blockchain", "phishing"]) {
    const rule = `/${prefix}/* https://`;
    expect(redirects.indexOf(rule)).toBeGreaterThan(-1);
    expect(redirects.indexOf(rule)).toBeLessThan(redirects.indexOf("/* /index.html 200"));
    const entry = await readFile(path.join(root, "public", prefix, "index.html"), "utf8");
    expect(entry).toContain(prefix === "phishing" ? "story_content/" : "__fetchCourse");
    expect(entry).toContain('src="/assets/project-opening.js"');
  }
  const uploads = new Set();
  const collectUploads = value => {
    if (typeof value === "string" && value.startsWith("/assets/uploads/")) uploads.add(value);
    else if (value && typeof value === "object") Object.values(value).forEach(collectUploads);
  };
  collectUploads(content);
  for (const upload of uploads) expect(upload).toMatch(/^\/assets\/uploads\/[a-f0-9]{64}\.[a-z0-9]+$/);
});

it("features the requested projects and keeps Worduel last with no public play link", async () => {
  const {content} = JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"));
  expect(content.projects.slice(0, 4).map(project => project.title)).toEqual([
    "Enablement Quest: The Learning Systems Lab", "Common Thread", "Why Blockchain Actually Matters", "AI & The Future of Work",
  ]);
  const worduel = content.projects.at(-1);
  expect(worduel).toMatchObject({title: "Worduel", status: "coming-soon", launchSignup: true});
  expect(worduel.url).toBeUndefined();
  expect(content.projects.filter(project => project.launchSignup).map(project => project.title)).toEqual(["Worduel"]);
  const commonThread = await readFile(path.join(root, "public/common-thread/index.html"), "utf8");
  expect(commonThread).toContain('title="Play Common Thread"');
  expect(commonThread).toContain('/?work=common-thread#work');
  expect(commonThread).toContain('src="https://common-thread-8hq.caffeine.xyz/"');
  expect(commonThread).not.toContain("-draft.caffeine.xyz");
  expect(commonThread).toContain('id="game-opening" role="status"');
  expect(commonThread).toContain("Opening Common Thread");
  expect(commonThread).toContain("Reload game");
  const html = await readFile(path.join(root, "index.html"), "utf8");
  expect(html).toContain('name="worduel-launch"');
  expect(html).toContain('netlify-honeypot="bot-field"');
});

it("shows complete single-column mobile card text and bounds the embedded game viewport", async () => {
  const css = await readFile(path.join(root, "src/index.css"), "utf8");
  const mobileRules = css.slice(css.indexOf("@media (max-width: 767px)"), css.indexOf("@media (max-width: 899px)"));
  expect(mobileRules).toContain(".project-card-summary,");
  expect(mobileRules).toContain(".project-card-result");
  expect(mobileRules).toContain("-webkit-line-clamp: unset");
  expect(mobileRules).toContain("overflow: visible");
  const commonThread = await readFile(path.join(root, "public/common-thread/index.html"), "utf8");
  expect(commonThread).toContain("height:100dvh");
  expect(commonThread).toContain("overscroll-behavior-x:none");
  expect(commonThread).toContain("touch-action:pan-y pinch-zoom");
  expect(commonThread).toContain("safe-area-inset-bottom");
});

it("ships self-hosted fonts with content-fingerprinted filenames", async () => {
  const html = await readFile(path.join(root, "index.html"), "utf8");
  const stylesheet = html.match(/id="portfolio-fonts"[^>]+href="([^"]+)"/)[1];
  const css = await readFile(path.join(root, "public", stylesheet), "utf8");
  expect(css).not.toContain("https://");
  const files = [...css.matchAll(/url\(([^)]+)\)/g)].map(match => match[1]);
  expect(files.length).toBeGreaterThan(1);
  for (const file of files) {
    expect(file).toMatch(/^\/assets\/fonts\/[a-z-]+[a-f0-9]{16}\.woff2$/);
    expect((await stat(path.join(root, "public", file))).size).toBeGreaterThan(0);
  }
});

it("ships the complete project documents and every rendered document page", async () => {
  for (const sample of Object.values(projectSamples)) {
    const files = [sample.file, ...sample.pages.map(page => page.image), ...(sample.resources ?? []).map(resource => resource.href)];
    for (const file of files) expect((await stat(path.join(root, "public", file))).size).toBeGreaterThan(0);
  }
  expect(projectSamples["addie-model-from-start-to-finish"].pages).toHaveLength(31);
});
it("includes every saved portfolio image and a playable game in the static deployment", async () => {
  const {content} = JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"));
  const images = new Set();
  const collect = (value) => {
    if (typeof value === "string" && value.startsWith("/assets/")) images.add(value);
    else if (value && typeof value === "object") Object.values(value).forEach(collect);
  };
  collect(content);
  for (const image of images) expect((await stat(path.join(root, "public", image))).size).toBeGreaterThan(0);
  expect(content.projects.find(project => project.title.startsWith("Enablement Quest")).url).toBe("/enablement/");
  const game = await readFile(path.join(root, "public/enablement/index.html"), "utf8");
  expect(game).toContain("Enablement Quest");
  const scripts = [...game.matchAll(/(?:src|href)="(\/assets\/enablement-game\/[^\"]+)"/g)].map(match => match[1]);
  expect(scripts.length).toBeGreaterThan(0);
  for (const asset of scripts) expect((await stat(path.join(root, "public", asset))).size).toBeGreaterThan(0);
});
