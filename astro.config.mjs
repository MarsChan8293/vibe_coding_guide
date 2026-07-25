import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

export default defineConfig({
  site: "https://marschan8293.github.io",
  base: "/vibe_coding_guide",
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
      wrap: true
    }
  }
});
