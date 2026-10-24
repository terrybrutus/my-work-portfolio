// @vitest-environment node
import {readFile} from "node:fs/promises";
import {JSDOM} from "jsdom";
import {afterEach, expect, it, vi} from "vitest";

let dom;
afterEach(() => { dom?.window.close(); vi.useRealTimers(); });

it("paints immediately, offers stalled-load recovery, and clears when visible course content arrives", async () => {
  const source = await readFile(new URL("../../public/assets/project-opening.js", import.meta.url), "utf8");
  vi.useFakeTimers();
  dom = new JSDOM(`<html><head><script data-title="Test course" data-ready="#app h1, #app a[href]">${source}</script></head><body><div id="app"></div></body></html>`, {runScripts: "dangerously", url: "https://terrylxd.com/test/"});
  const document = dom.window.document;
  expect(document.querySelector('[role="status"]').textContent).toContain("Opening Test course");
  expect(document.querySelector("#project-opening div").hidden).toBe(true);
  vi.advanceTimersByTime(15000);
  expect(document.querySelector("#project-opening div").hidden).toBe(false);
  expect(document.querySelector("#project-opening a").getAttribute("href")).toBe("/#work");
  const start = document.createElement("a");
  start.href = "#/lesson";
  start.textContent = "Start";
  start.getBoundingClientRect = () => ({width: 200, height: 40});
  document.querySelector("#app").append(start);
  vi.advanceTimersByTime(200);
  expect(document.querySelector("#project-opening")).toBeNull();
  expect(vi.getTimerCount()).toBe(0);
});
