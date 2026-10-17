// @vitest-environment node
import {readFile, stat} from "node:fs/promises";
import path from "node:path";
import {expect, it} from "vitest";
import {projectSamples} from "../content/project-samples";

const root = path.resolve(import.meta.dirname, "../..");
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
