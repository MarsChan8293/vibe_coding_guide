import { access, readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const base = "/vibe_coding_guide";
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat();
}

function targetFor(url) {
  const pathname = decodeURIComponent(url.split(/[?#]/)[0]);
  if (pathname !== base && !pathname.startsWith(`${base}/`)) return null;
  let local = pathname.slice(base.length).replace(/^\/+/, "");
  if (!local || local.endsWith("/")) local += "index.html";
  return join(dist, local);
}

for (const file of await walk(dist)) {
  if (extname(file) !== ".html") continue;
  const html = await readFile(file, "utf8");
  for (const [, url] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|mailto:|tel:|data:|#)/.test(url) || url.includes("${")) continue;
    const target = targetFor(url);
    if (!target) {
      errors.push(`${relative(dist, file)}: 资源未使用 ${base} 基路径：${url}`);
      continue;
    }
    try {
      await access(target);
    } catch {
      errors.push(`${relative(dist, file)}: 找不到 ${url}`);
    }
  }
}

if (errors.length) {
  console.error(errors.map((error) => `× ${error}`).join("\n"));
  process.exit(1);
}
console.log("✓ 生产产物中的站内链接与静态资源均可解析");
