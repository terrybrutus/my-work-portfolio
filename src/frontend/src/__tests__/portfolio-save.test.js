// @vitest-environment node
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createServer } from "vite";
import { portfolioSavePlugin, writePortfolio, readPortfolio, detectImageType } from "../../scripts/portfolio-save.mjs";

let root;
afterEach(async () => {
  if (root && path.dirname(root) === tmpdir()) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("writing portfolio files", () => {
  it("identifies image contents without relying on file extensions or OS MIME labels", () => {
    expect(detectImageType(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))).toBe("image/png");
    expect(detectImageType(Buffer.from([255, 216, 255, 224]))).toBe("image/jpeg");
    expect(detectImageType(Buffer.from("GIF89a"))).toBe("image/gif");
    expect(detectImageType(Buffer.from("BM-bitmap"))).toBe("image/bmp");
    expect(() => detectImageType(Buffer.from("not an image"))).toThrow("file contents");
  });

  it("accepts a binary GIF larger than 40 MB and retains its exact bytes", async () => {
    root = await mkdtemp(path.join(tmpdir(), "portfolio-save-"));
    await writePortfolio(root, {aboutImages: [], projects: [{slug: "large", title: "Large", image: "/keep.png"}]});
    const server = await createServer({configFile: false, root, plugins: [portfolioSavePlugin()], server: {host: "127.0.0.1", port: 0, watch: null}, logLevel: "silent"});
    try {
      await server.listen();
      const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
      const image = Buffer.concat([Buffer.from("GIF89a"), Buffer.alloc(41 * 1024 * 1024)]);
      const target = encodeURIComponent(JSON.stringify({kind: "project", project: "large", field: "carouselImage"}));
      const response = await fetch(`${origin}/__portfolio/image?target=${target}`, {method: "POST", headers: {"Content-Type": "application/octet-stream", Origin: origin}, body: image});
      expect(response.status).toBe(200);
      const saved = await response.json();
      expect((await readFile(path.join(root, "public", saved.image))).equals(image)).toBe(true);
      expect((await readPortfolio(root)).content.projects[0].carouselImage).toBe(saved.image);
      expect(saved.content.projects[0].image).toBe("/keep.png");
    } finally { await server.close(); }
  }, 20000);

  it("persists every project graphic and every other image destination, rejecting stale full saves", async () => {
    root = await mkdtemp(path.join(tmpdir(), "portfolio-save-"));
    const original = await writePortfolio(root, {brandLogoText: "", selectedTemplate: "signal-room", aboutImages: ["/a.png", "/b.png", "/c.png"], projects: Array.from({length: 8}, (_, index) => ({title: `Project ${index}`, slug: `project-${index}`, image: `/page-${index}.png`, summary: "Keep my text"}))});
    const server = await createServer({configFile: false, root, plugins: [portfolioSavePlugin()], server: {host: "127.0.0.1", port: 0, watch: null}, logLevel: "silent"});
    try {
      await server.listen();
      const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
      const targets = original.content.projects.flatMap(project => [
        {kind: "project", project: project.slug, field: "image"},
        {kind: "project", project: project.slug, field: "carouselImage"},
      ]).concat([{kind: "profile"}, {kind: "logo"}, ...[0, 1, 2].map(index => ({kind: "about", index}))]);
      const expected = new Map();
      await Promise.all(targets.map(async (target, index) => {
        const bytes = Buffer.from(`GIF89a-sample-${index}`);
        const response = await fetch(`${origin}/__portfolio/image?target=${encodeURIComponent(JSON.stringify(target))}`, {method: "POST", headers: {"Content-Type": "image/gif", Origin: origin}, body: bytes});
        expect(response.status).toBe(200);
        const saved = await response.json();
        expected.set(JSON.stringify(target), saved.image);
        expect((await readFile(path.join(root, "public", saved.image))).equals(bytes)).toBe(true);
      }));
      const disk = await readPortfolio(root);
      for (const target of targets) {
        const actual = target.kind === "project" ? disk.content.projects.find(project => project.slug === target.project)[target.field] : target.kind === "about" ? disk.content.aboutImages[target.index] : disk.content[target.kind === "profile" ? "profileImage" : "brandLogoImage"];
        expect(actual).toBe(expected.get(JSON.stringify(target)));
      }
      expect(disk.content.projects.map(project => project.summary)).toEqual(Array(8).fill("Keep my text"));
      expect(disk.content.brandLogoText).toBe("");
      expect(disk.content.selectedTemplate).toBe("signal-room");
      const reopened = await fetch(`${origin}/__portfolio/content`);
      expect(await reopened.json()).toEqual(disk);
      const stale = await fetch(`${origin}/__portfolio/save`, {method: "POST", headers: {"Content-Type": "application/json", "X-Portfolio-Revision": original.savedAt, Origin: origin}, body: JSON.stringify(original.content)});
      expect(stale.status).toBe(409);
      expect(await readPortfolio(root)).toEqual(disk);
      const invalid = await fetch(`${origin}/__portfolio/image?target=${encodeURIComponent(JSON.stringify({kind: "project", project: "missing", field: "carouselImage"}))}`, {method: "POST", headers: {"Content-Type": "image/gif", Origin: origin}, body: "GIF89a"});
      expect(invalid.status).toBe(400);
      expect(await readPortfolio(root)).toEqual(disk);
    } finally { await server.close(); }
  });

  it("saves through the real HTTP endpoint and serves the resulting image file", async () => {
    root = await mkdtemp(path.join(tmpdir(), "portfolio-save-"));
    const server = await createServer({
      configFile: false, root, plugins: [portfolioSavePlugin()],
      server: {host: "127.0.0.1", port: 0, watch: null}, logLevel: "silent",
    });
    try {
      await server.listen();
      const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
      // Larger than a typical browser localStorage quota; the server stores the file directly.
      const image = Buffer.concat([Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64"), Buffer.alloc(6 * 1024 * 1024)]);
      const response = await fetch(`${origin}/__portfolio/save`, {
        method: "POST", headers: {"Content-Type": "application/json", Origin: origin},
        body: JSON.stringify({ aboutImages: [], projects: [{image: "/page.png", carouselImage: `data:image/gif;base64,${image.toString("base64")}`}] }),
      });
      expect(response.status).toBe(200);
      const saved = await response.json();
      const actualImage = await fetch(`${origin}${saved.content.projects[0].carouselImage}`);
      expect(actualImage.status).toBe(200);
      expect(Buffer.from(await actualImage.arrayBuffer()).equals(image)).toBe(true);
      expect(JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"))).toEqual(saved);
    } finally {
      await server.close();
    }
  });

  it("writes uploaded bytes and reloadable content with separate modal and page images", async () => {
    root = await mkdtemp(path.join(tmpdir(), "portfolio-save-"));
    const gif = `data:image/gif;base64,${Buffer.from("GIF89a").toString("base64")}`;
    const saved = await writePortfolio(root, {
      brandLogoText: "", aboutImages: [gif],
      projects: [{ title: "Sample", image: "/page.png", carouselImage: gif }],
    });
    expect(saved.content.projects[0].image).toBe("/page.png");
    const asset = saved.content.projects[0].carouselImage;
    expect(asset).toMatch(/^\/assets\/uploads\/[a-f0-9]+\.gif$/);
    expect(await readFile(path.join(root, "public", asset))).toEqual(Buffer.from("GIF89a"));
    const onDisk = JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"));
    expect(onDisk).toEqual(saved);
    expect(onDisk.content.aboutImages[0]).toBe(asset);
    expect(onDisk.content.brandLogoText).toBe("");
    await expect(writePortfolio(root, { aboutImages: ["data:image/png;base64,"], projects: [] })).rejects.toThrow();
    expect(JSON.parse(await readFile(path.join(root, "src/content/portfolio.json"), "utf8"))).toEqual(saved);
  });

  it("rejects save requests from other origins", async () => {
    let handler;
    portfolioSavePlugin().configureServer({
      middlewares: { use: (_path, callback) => { handler = callback; } },
    });
    const response = { setHeader() {}, end(value) { this.body = JSON.parse(value); } };
    await handler({ method: "POST", headers: { host: "127.0.0.1:44120", origin: "https://example.com", "content-type": "application/json" } }, response);
    expect(response.statusCode).toBe(403);
  });
});
