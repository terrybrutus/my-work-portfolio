// @vitest-environment node
import {readFile, stat} from "node:fs/promises";
import path from "node:path";
import {expect, it} from "vitest";
import {projectSamples} from "../content/project-samples";

const root = path.resolve(import.meta.dirname, "../..");
it("keeps every saved Open Project link on the portfolio domain and routes courses before the SPA fallback", async () => {
  const {content} = JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"));
  for (const project of content.projects) {
    expect(project.url).toMatch(/^\/(?!\/)/);
  }
  const redirects = await readFile(path.join(root, "public/_redirects"), "utf8");
  for (const prefix of ["ai-future-of-work", "blockchain", "phishing"]) {
    const rule = `/${prefix}/* https://`;
    expect(redirects.indexOf(rule)).toBeGreaterThan(-1);
    expect(redirects.indexOf(rule)).toBeLessThan(redirects.indexOf("/* /index.html 200"));
    const entry = await readFile(path.join(root, "public", prefix, "index.html"), "utf8");
    expect(entry).toContain(prefix === "phishing" ? "story_content/" : "__fetchCourse");
  }
  const uploads = new Set();
  const collectUploads = value => {
    if (typeof value === "string" && value.startsWith("/assets/uploads/")) uploads.add(value);
    else if (value && typeof value === "object") Object.values(value).forEach(collectUploads);
  };
  collectUploads(content);
  for (const upload of uploads) expect(upload).toMatch(/^\/assets\/uploads\/[a-f0-9]{64}\.[a-z0-9]+$/);
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
