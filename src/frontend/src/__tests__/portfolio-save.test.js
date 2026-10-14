// @vitest-environment node
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createServer } from "vite";
import { portfolioSavePlugin, writePortfolio } from "../../scripts/portfolio-save.mjs";

let root;
afterEach(async () => {
  if (root && path.dirname(root) === tmpdir()) await rm(root, { recursive: true, force: true });
  root = undefined;
});

describe("writing portfolio files", () => {
  it("saves through the real HTTP endpoint and serves the resulting image file", async () => {
    root = await mkdtemp(path.join(tmpdir(), "portfolio-save-"));
    const server = await createServer({
      configFile: false, root, plugins: [portfolioSavePlugin()],
      server: {host: "127.0.0.1", port: 0, watch: null}, logLevel: "silent",
    });
    try {
      await server.listen();
      const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
      const image = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
      const response = await fetch(`${origin}/__portfolio/save`, {
        method: "POST", headers: {"Content-Type": "application/json", Origin: origin},
        body: JSON.stringify({ aboutImages: [], projects: [{image: "/page.png", carouselImage: `data:image/gif;base64,${image.toString("base64")}`}] }),
      });
      expect(response.status).toBe(200);
      const saved = await response.json();
      const actualImage = await fetch(`${origin}${saved.content.projects[0].carouselImage}`);
      expect(actualImage.status).toBe(200);
      expect(Buffer.from(await actualImage.arrayBuffer())).toEqual(image);
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
