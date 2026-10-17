import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "image/avif": "avif", "image/svg+xml": "svg", "image/bmp": "bmp", "image/x-icon": "ico" };
const maximumImageSize = 256 * 1024 * 1024;

export function detectImageType(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) return "image/png";
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "image/jpeg";
  if (["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))) return "image/gif";
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") return "image/webp";
  if (bytes.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(bytes.toString("ascii", 8, 64))) return "image/avif";
  if (bytes.toString("ascii", 0, 2) === "BM") return "image/bmp";
  if (bytes.subarray(0, 4).equals(Buffer.from([0, 0, 1, 0]))) return "image/x-icon";
  if (/^\s*(?:<\?xml[\s\S]*?\?>\s*)?(?:<!--[\s\S]*?-->\s*)*<svg[\s>]/i.test(bytes.toString("utf8", 0, 4096).replace(/^\uFEFF/, ""))) return "image/svg+xml";
  throw new Error("The file contents are not a supported browser image. Use PNG, JPEG, GIF, WebP, AVIF, SVG, BMP, or ICO.");
}

const portfolioPath = (root) => path.join(root, "src/content/portfolio.json");
const projectSlug = (project) => project.slug || (project.url?.startsWith("/work/") ? project.url.slice(6) : project.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

export async function readPortfolio(root) {
  return JSON.parse(await readFile(portfolioPath(root), "utf8"));
}

export async function writeImage(root, bytes, type) {
  if (!extensions[type]) throw new Error("Unsupported image. Use PNG, JPG, GIF, WebP, AVIF, or SVG.");
  if (!bytes.length) throw new Error("The image file is empty.");
  if (bytes.length > maximumImageSize) throw new Error("The image exceeds the 256 MB limit.");
  const name = `${createHash("sha256").update(bytes).digest("hex")}.${extensions[type]}`;
  const directory = path.join(root, "public/assets/uploads");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, name), bytes);
  return `/assets/uploads/${name}`;
}

export async function attachImage(root, target, bytes, type) {
  const saved = await readPortfolio(root);
  const content = saved.content;
  let apply;
  if (target.kind === "project" && ["image", "carouselImage"].includes(target.field)) {
    const project = content.projects.find((item) => projectSlug(item) === target.project);
    if (!project) throw new Error("This project has not been saved yet. Save the project, then retry this upload.");
    apply = (value) => { project[target.field] = value; };
  } else if (target.kind === "about" && Number.isInteger(target.index) && target.index >= 0 && target.index < content.aboutImages.length) {
    apply = (value) => { content.aboutImages[target.index] = value; };
  } else if (target.kind === "profile" || target.kind === "logo") {
    apply = (value) => { content[target.kind === "profile" ? "profileImage" : "brandLogoImage"] = value; };
  } else {
    throw new Error("Unknown image destination. Nothing was changed.");
  }
  const image = await writeImage(root, bytes, type);
  apply(image);
  return { ...await writePortfolio(root, content), image };
}

export async function writePortfolio(root, input) {
  if (!input || typeof input !== "object" || !Array.isArray(input.projects) || !Array.isArray(input.aboutImages)) {
    throw new Error("The portfolio content is incomplete. Nothing was saved.");
  }
  const content = structuredClone(input);
  const storeImage = async (value) => {
    if (typeof value !== "string" || !value.startsWith("data:")) return value;
    const match = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(value);
    if (!match || !extensions[match[1]]) throw new Error("Unsupported image. Use PNG, JPG, GIF, WebP, AVIF, or SVG.");
    const bytes = Buffer.from(match[2], "base64");
    if (!bytes.length) throw new Error("An image is empty. Nothing was saved.");
    return writeImage(root, bytes, match[1]);
  };
  for (const key of ["profileImage", "brandLogoImage"]) content[key] = await storeImage(content[key]);
  content.aboutImages = await Promise.all(content.aboutImages.map(storeImage));
  for (const project of content.projects) {
    for (const key of ["image", "carouselImage"]) {
      if (project[key] !== undefined) project[key] = await storeImage(project[key]);
    }
  }
  let previousTime = 0;
  try { previousTime = Date.parse((await readPortfolio(root)).savedAt) || 0; } catch (error) { if (error.code !== "ENOENT") throw error; }
  const saved = { savedAt: new Date(Math.max(Date.now(), previousTime + 1)).toISOString(), content };
  const directory = path.join(root, "src/content");
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, "portfolio.json");
  const temporary = `${target}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`);
  await rename(temporary, target);
  return saved;
}

export function portfolioSavePlugin() {
  return {
    name: "portfolio-save",
    apply: "serve",
    // Saved data is read through the API. Reloading on these writes interrupts uploads.
    config() {
      return { server: { watch: { ignored: ["**/src/content/portfolio.json", "**/public/assets/uploads", "**/public/assets/uploads/**"] } } };
    },
    configureServer(server) {
      let pendingWrite = Promise.resolve();
      const serializeWrite = (operation) => {
        const result = pendingWrite.then(operation);
        pendingWrite = result.catch(() => {});
        return result;
      };
      server.middlewares.use("/__portfolio/content", async (request, response) => {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Cache-Control", "no-store");
        try {
          if (request.method !== "GET") throw new Error("Use GET to read portfolio content.");
          await pendingWrite;
          response.end(JSON.stringify(await readPortfolio(server.config.root)));
        } catch (error) {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: error.message }));
        }
      });
      server.middlewares.use("/__portfolio/image", async (request, response) => {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Cache-Control", "no-store");
        try {
          const origin = request.headers.origin;
          if (request.method !== "POST" || (origin && origin !== `http://${request.headers.host}`)) {
            response.statusCode = 403;
            throw new Error("Uploads must come from this local admin page.");
          }
          const url = new URL(request.url, "http://localhost");
          const target = JSON.parse(url.searchParams.get("target") || "null");
          if (!target) throw new Error("Choose an image destination.");
          let size = 0;
          const chunks = [];
          for await (const chunk of request) {
            size += chunk.length;
            if (size > maximumImageSize) throw new Error("The image exceeds the 256 MB limit.");
            chunks.push(chunk);
          }
          const bytes = Buffer.concat(chunks);
          const type = detectImageType(bytes);
          const saved = await serializeWrite(() => attachImage(server.config.root, target, bytes, type));
          response.end(JSON.stringify(saved));
        } catch (error) {
          if (response.statusCode !== 403) response.statusCode = 400;
          response.end(JSON.stringify({ error: error.message ?? "Could not save the image." }));
        }
      });
      // Serve newly written assets immediately, before Vite's file watcher catches up.
      server.middlewares.use("/assets/uploads", async (request, response, next) => {
        const filename = new URL(request.url, "http://localhost").pathname.slice(1);
        if (!["GET", "HEAD"].includes(request.method) || !/^[a-f0-9]{64}\.(png|jpg|gif|webp|avif|svg|bmp|ico)$/.test(filename)) return next();
        try {
          const bytes = await readFile(path.join(server.config.root, "public/assets/uploads", filename));
          const extension = filename.split(".").pop();
          response.setHeader("Content-Type", Object.entries(extensions).find(([, value]) => value === extension)[0]);
          response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          response.end(request.method === "HEAD" ? undefined : bytes);
        } catch {
          next();
        }
      });
      server.middlewares.use("/__portfolio/save", async (request, response) => {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Cache-Control", "no-store");
        try {
          const origin = request.headers.origin;
          const host = request.headers.host;
          if (request.method !== "POST" || !request.headers["content-type"]?.startsWith("application/json") || (origin && origin !== `http://${host}`)) {
            response.statusCode = 403;
            response.end(JSON.stringify({ error: "Save requests must come from this local admin page." }));
            return;
          }
          let size = 0;
          const chunks = [];
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 40 * 1024 * 1024) throw new Error("Upload is too large. Save fewer images at a time (40 MB maximum).");
            chunks.push(chunk);
          }
          const content = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          const saved = await serializeWrite(async () => {
            const revision = request.headers["x-portfolio-revision"];
            let current;
            try { current = await readPortfolio(server.config.root); } catch (error) { if (error.code !== "ENOENT") throw error; }
            if (current && revision !== current.savedAt) {
              response.statusCode = 409;
              throw new Error("The portfolio changed in another tab. Reload the editor before saving. Your current edits are still in this browser draft.");
            }
            return writePortfolio(server.config.root, content);
          });
          response.end(JSON.stringify(saved));
        } catch (error) {
          if (response.statusCode !== 409) response.statusCode = 400;
          response.end(JSON.stringify({ error: error.message ?? "Could not write the portfolio files." }));
        }
      });
    },
  };
}
