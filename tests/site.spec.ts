import { expect, test } from "@playwright/test";

test("首页、课程导航和仓库子路径可用", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle(/Vibe Coding/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("从感觉");
  await page.getByRole("link", { name: /开始阅读/ }).click();
  await expect(page).toHaveURL(/\/start\/?$/);
});

test("历史时间轴可展开且包含八个节点", async ({ page }) => {
  await page.goto("./history/");
  const nodes = page.locator(".timeline details");
  await expect(nodes).toHaveCount(8);
  await nodes.nth(0).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(nodes.nth(0)).toHaveAttribute("open", "");
  await expect(nodes.nth(1)).toContainText("Vibe Coding");
});

test("模型地图覆盖约定的六个模型家族", async ({ page }) => {
  await page.goto("./tools/map/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("模型地图");
  const lesson = page.locator(".prose");
  for (const model of ["Claude", "OpenAI", "Gemini", "DeepSeek", "GLM", "Kimi"]) {
    await expect(lesson).toContainText(model);
  }
});

test("Skill 课程覆盖概念、图谱与编写实践", async ({ page }) => {
  await page.goto("./tools/agent-skills/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Skill");
  await expect(page.getByRole("heading", { name: "它和 MCP、AGENTS.md、脚本有什么不同？" })).toBeVisible();
  await page.getByRole("link", { name: /下一篇/ }).click();
  await expect(page).toHaveURL(/\/tools\/skill-map\/?$/);
  await page.goto("./methods/write-skill/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("第一个可验证的 Skill");
});

test("中文搜索可以找到课程", async ({ page }) => {
  await page.goto("./search/");
  await page.getByRole("searchbox").fill("OpenCode");
  await expect(page.locator("#search-results li").first()).toBeVisible();
});

test("学习进度会持久化并可重置", async ({ page }) => {
  await page.goto("./practice/linux-baseline/");
  const toggle = page.getByRole("button", { name: /标记本课/ });
  await toggle.click();
  await page.reload();
  await expect(page.getByRole("button", { name: /本课已完成/ })).toHaveAttribute("aria-pressed", "true");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: /重置本地进度/ }).click();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
});

test("代码可复制，404 页面可访问", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./practice/connect-api/");
  const copy = page.getByRole("button", { name: /复制代码/ }).first();
  await copy.click();
  await expect(copy).toContainText("已复制");
  await page.goto("./404.html");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("找不到这个页面");
});
