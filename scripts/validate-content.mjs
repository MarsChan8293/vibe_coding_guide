import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../src/content/lessons/", import.meta.url));
const requiredFields = [
  "title",
  "description",
  "section",
  "order",
  "estimatedMinutes",
  "prerequisites",
  "outcomes",
  "tags",
  "reviewedAt",
  "reviewedAgainst",
  "draft",
];
const expected = { history: 1, tools: 8, practice: 9, methods: 8 };
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : path;
  }));
  return files.flat().filter((file) => /\.mdx?$/.test(file));
}

const files = await walk(root);
const counts = { history: 0, tools: 0, practice: 0, methods: 0 };

for (const file of files) {
  const id = relative(root, file);
  const source = await readFile(file, "utf8");
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---/);

  if (!frontmatter) {
    errors.push(`${id}: 缺少 frontmatter`);
    continue;
  }
  for (const field of requiredFields) {
    if (!new RegExp(`^${field}:`, "m").test(frontmatter[1])) {
      errors.push(`${id}: 缺少 ${field}`);
    }
  }
  const section = frontmatter[1].match(/^section:\s*(\w+)/m)?.[1];
  if (section in counts) counts[section] += 1;
  else errors.push(`${id}: section 无效`);

  if (/^draft:\s*true/m.test(frontmatter[1])) {
    errors.push(`${id}: 核心内容不能是草稿`);
  }
  if (source.replace(frontmatter[0], "").trim().length < 260) {
    errors.push(`${id}: 正文过短或为空`);
  }
  if (/\bsk-[A-Za-z0-9_-]{20,}\b/.test(source)) {
    errors.push(`${id}: 疑似包含真实 API Key`);
  }
  if (/https?:\/\/(?:10\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.)/.test(source)) {
    errors.push(`${id}: 疑似包含内网地址`);
  }
}

if (files.length !== 26) {
  errors.push(`核心内容应为 26 篇，实际为 ${files.length} 篇`);
}
for (const [section, count] of Object.entries(expected)) {
  if (counts[section] !== count) {
    errors.push(`${section} 应为 ${count} 篇，实际为 ${counts[section]} 篇`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `× ${error}`).join("\n"));
  process.exit(1);
}
console.log(`✓ 26 篇核心内容完整：${JSON.stringify(counts)}`);
