import type { CollectionEntry } from "astro:content";

export const SITE_TITLE = "Vibe Coding：从感觉到工程";
export const SITE_DESCRIPTION =
  "面向企业环境零基础创作者的 Vibe Coding 中文教程：从 OpenCode 配置到可验证的软件交付。";
export const BASE = `${import.meta.env.BASE_URL.replace(/\/+$/, "")}/`;

export const sections = {
  history: { label: "历史切片", index: "01", color: "朱红" },
  tools: { label: "工具地图", index: "02", color: "墨黑" },
  practice: { label: "实践教程", index: "03", color: "橄榄" },
  methods: { label: "方法总结", index: "04", color: "靛蓝" }
} as const;

export type LessonEntry = CollectionEntry<"lessons">;

export function lessonSlug(entry: LessonEntry) {
  return entry.id.split("/").pop()!.replace(/^\d+-/, "").replace(/\.(md|mdx)$/, "");
}

export function lessonPath(entry: LessonEntry) {
  if (entry.data.section === "history") return `${BASE}history/`;
  return `${BASE}${entry.data.section}/${lessonSlug(entry)}/`;
}

export function sortedLessons(entries: LessonEntry[]) {
  return [...entries].sort((a, b) => {
    const sectionOrder = ["history", "tools", "practice", "methods"];
    const bySection =
      sectionOrder.indexOf(a.data.section) - sectionOrder.indexOf(b.data.section);
    return bySection || a.data.order - b.data.order;
  });
}
