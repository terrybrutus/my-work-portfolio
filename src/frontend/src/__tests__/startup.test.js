// @vitest-environment node
import {readFile} from "node:fs/promises";
import {JSDOM} from "jsdom";
import {expect, it} from "vitest";

it("offers recovery if startup stalls and loads fonts without blocking the page", async () => {
  let recover;
  const html = await readFile(new URL("../../index.html", import.meta.url), "utf8");
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    beforeParse(window) {
      window.setTimeout = (callback, delay) => {
        expect(delay).toBe(10000);
        recover = callback;
        return 0;
      };
    },
  });
  try {
    const document = dom.window.document;
    expect(document.querySelector("#portfolio-startup-recovery").hidden).toBe(true);
    expect(document.querySelector("#portfolio-startup-message").textContent).toBe("Loading portfolio");
    const fonts = document.querySelector("#portfolio-fonts");
    expect(fonts.media).toBe("print");
    fonts.dispatchEvent(new dom.window.Event("load"));
    expect(fonts.media).toBe("all");
    recover();
    expect(document.querySelector("#portfolio-startup-recovery").hidden).toBe(false);
    expect(document.querySelector("#portfolio-startup-message").textContent).toContain("Taking longer");
    document.querySelector("#portfolio-startup").remove();
    expect(() => recover()).not.toThrow();
  } finally {
    dom.window.close();
  }
});
