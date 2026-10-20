// @vitest-environment node
import {readFile} from "node:fs/promises";
import path from "node:path";
import {JSDOM} from "jsdom";
import sharp from "sharp";
import {expect, it} from "vitest";

it("publishes the portfolio's own full-size share image for Open Graph and Twitter", async () => {
  const root = path.resolve(import.meta.dirname, "../..");
  const html = await readFile(path.join(root, "index.html"), "utf8");
  const dom = new JSDOM(html);
  try {
    const document = dom.window.document;
    const property = name => document.querySelector(`meta[property="${name}"]`)?.content;
    const name = key => document.querySelector(`meta[name="${key}"]`)?.content;
    const image = new URL(property("og:image"));
    expect(image.origin).toBe("https://terrylxd.com");
    expect(name("twitter:image")).toBe(image.href);
    expect(property("og:image:secure_url")).toBe(image.href);
    expect(property("og:image:type")).toBe("image/png");
    expect(property("og:image:alt")).toContain("Terry Brutus");
    expect(name("twitter:image:alt")).toBe(property("og:image:alt"));
    expect(property("og:title")).toBe(document.title);
    expect(property("og:description")).toBe(name("description"));
    expect(html).not.toContain("caffeine.ai");
    const metadata = await sharp(await readFile(path.join(root, "public", image.pathname))).metadata();
    expect(metadata.width).toBe(1200);
    expect(metadata.height).toBe(630);
    expect(property("og:image:width")).toBe(String(metadata.width));
    expect(property("og:image:height")).toBe(String(metadata.height));
  } finally {
    dom.window.close();
  }
});
