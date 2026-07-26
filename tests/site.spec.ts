import { expect, test } from "@playwright/test";

test("首页、课程导航和仓库子路径可用", async ({ page }) => {
  await page.goto("./");
  await expect(page).toHaveTitle(/Vibe Coding/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("从感觉");
  await page.getByRole("link", { name: /开始阅读/ }).click();
  await expect(page).toHaveURL(/\/start\/?$/);
});

test("案例入口和实践页可访问", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator('.desktop-nav a[href$="/cases/"]')).toHaveAttribute("href", /\/cases\/$/);
  await page.goto("./cases/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("真实案例");
  await expect(page.getByRole("link", { name: /阅读完整案例/ })).toHaveAttribute(
    "href",
    /\/cases\/ascend-operator-challenge\/$/
  );
  await page.goto("./cases/ascend-operator-challenge/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("先证明正确");
  await expect(page.getByText("赛后教学复盘")).toBeVisible();
  await expect(page.getByRole("link", { name: "Model Agent v1.0.0rc1" })).toHaveAttribute(
    "href",
    "https://gitcode.com/Ascend/model-agent/tree/v1.0.0rc1"
  );
});

test("历史回顾包含可展开的时间轴与 AI Coding 使用数据", async ({ page }) => {
  await page.goto("./history/");
  const nodes = page.locator(".timeline details");
  await expect(nodes).toHaveCount(19);
  await nodes.nth(0).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(nodes.nth(0)).toHaveAttribute("open", "");
  await expect(nodes.nth(1)).toContainText("Vibe Coding");
  const lesson = page.locator(".prose");
  await expect(lesson).toContainText("100 万亿 token");
  await expect(lesson).toContainText("Claude Code 在 Anthropic 内部");
  await expect(lesson).toContainText("飞轮已经转起来了");
});

test("模型地图覆盖约定的六个模型家族", async ({ page }) => {
  await page.goto("./tools/map/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("模型地图");
  const lesson = page.locator(".prose");
  for (const model of ["Claude", "OpenAI", "Gemini", "DeepSeek", "GLM", "Kimi"]) {
    await expect(lesson).toContainText(model);
  }
});

test("工具介绍覆盖约定的编辑器与终端 Agent", async ({ page }) => {
  await page.goto("./tools/editor-agents/");
  const editorLesson = page.locator(".prose");
  for (const tool of ["Visual Studio Code", "GitHub Copilot", "Cursor", "TRAE"]) {
    await expect(editorLesson).toContainText(tool);
  }
  await expect(editorLesson).not.toContainText("CodeBuddy");

  await page.goto("./tools/terminal-agents/");
  const terminalLesson = page.locator(".prose");
  for (const tool of ["OpenCode", "Claude Code", "Codex CLI", "Kimi Code CLI"]) {
    await expect(terminalLesson).toContainText(tool);
  }
  for (const excluded of ["Gemini CLI", "CodeBuddy", "Qwen Code"]) {
    await expect(terminalLesson).not.toContainText(excluded);
  }
});

test("入门课程覆盖 OpenCode 高频命令", async ({ page }) => {
  await page.goto("./practice/first-session/");
  const practiceLesson = page.locator(".prose");
  for (const concept of ["Plan", "/init", "/compact", "/new", "@README.md"]) {
    await expect(practiceLesson).toContainText(concept);
  }
});

test("Agent、Subagent 与 MCP 拥有独立课程", async ({ page }) => {
  await page.goto("./tools/agent-subagents/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Agent 与 Subagent");
  await expect(page.locator(".prose")).toContainText("上下文隔离");
  await page.getByRole("link", { name: /下一篇/ }).click();
  await expect(page).toHaveURL(/\/tools\/mcp\/?$/);

  await expect(page.getByRole("heading", { level: 1 })).toContainText("MCP");
  const mcpLesson = page.locator(".prose");
  for (const concept of ["Tools", "Resources", "本地 MCP", "远程 MCP"]) {
    await expect(mcpLesson).toContainText(concept);
  }
  await page.getByRole("link", { name: /下一篇/ }).click();
  await expect(page).toHaveURL(/\/tools\/agent-skills\/?$/);
});

test("方法课程覆盖八个工程概念", async ({ page }) => {
  const lessons = [
    ["prompt-engineering", "Prompt Engineering"],
    ["context-engineering", "Context Engineering"],
    ["spec-driven-development", "Spec-Driven Development"],
    ["harness-engineering", "Harness Engineering"],
    ["loop-engineering", "Loop Engineering"],
    ["test-driven-development", "Test-Driven Development"],
    ["human-in-the-loop", "Human-in-the-Loop"],
    ["skills-engineering", "Skills Engineering"]
  ];
  for (const [slug, title] of lessons) {
    await page.goto(`./methods/${slug}/`);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(title);
  }
});

test("Skill 课程覆盖概念、图谱与编写实践", async ({ page }) => {
  await page.goto("./tools/agent-skills/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Skill");
  await expect(page.getByRole("heading", { name: "什么内容值得做成 Skill" })).toBeVisible();
  await page.getByRole("link", { name: /下一篇/ }).click();
  await expect(page).toHaveURL(/\/tools\/skill-map\/?$/);
  await page.goto("./methods/skills-engineering/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Skills Engineering");
});

test("实践课程包含 Skill 安装与边界验证", async ({ page }) => {
  await page.goto("./practice/install-skill/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("grill-me");
  await expect(page.getByRole("heading", { name: "第三步：在 skills.sh 搜索并安装" })).toBeVisible();
  await expect(page.locator(".prose")).toContainText("npx skills add https://github.com/mattpocock/skills --skill grill-me");
  await page.getByRole("link", { name: /下一篇/ }).click();
  await expect(page).toHaveURL(/\/practice\/portfolio-brief\/?$/);
});

test("入门实践以当前项目为例", async ({ page }) => {
  await page.goto("./practice/agent-rules/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("项目规则");
  await expect(page.locator(".prose")).toContainText("npm test");
  await page.getByRole("link", { name: /下一篇/ }).click();
  await expect(page).toHaveURL(/\/practice\/install-skill\/?$/);
  await page.goto("./practice/task-breakdown/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("当前项目");
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
