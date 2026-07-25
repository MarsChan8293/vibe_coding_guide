# Vibe Coding：从感觉到工程

面向企业零基础学习者的中文 Vibe Coding 教程。课程以 Linux 命令行和
[OpenCode](https://github.com/anomalyco/opencode) 为实践主线，重点不是“让 AI
一次写对”，而是建立可拆解、可验证、可复盘的协作闭环。

## 本地开发

需要 Node.js 22：

```bash
npm install
npm run dev
```

完整验收：

```bash
npm test
npm run test:e2e
```

网站由 Astro、MDX、TypeScript 和 Pagefind 构建为纯静态文件。`main` 分支更新后，
GitHub Actions 会自动发布到
[marschan8293.github.io/vibe_coding_guide](https://marschan8293.github.io/vibe_coding_guide/)。

## 内容结构

- 历史：1 篇短时间轴，从 2025 年讲到 Agentic Engineering
- 工具：7 篇，理解终端、编辑器、Agent Skills 与企业选型
- 实践：10 篇，从 Linux 环境、Skill 安装走到作品审查
- 方法：8 篇，从 Prompt Engineering 到 Skills Engineering，建立可验证的 Agent 协作方法

所有 API 示例只使用环境变量和占位符。请勿把真实密钥、内网地址或客户信息提交到仓库。
