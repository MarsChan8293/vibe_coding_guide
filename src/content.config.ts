import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const sectionSchema = z.enum(["history", "tools", "practice", "methods"]);

const lessons = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/lessons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: sectionSchema,
    order: z.number().int().positive(),
    estimatedMinutes: z.number().int().positive(),
    prerequisites: z.array(z.string()).default([]),
    outcomes: z.array(z.string()).min(1),
    tags: z.array(z.string()).min(1),
    reviewedAt: z.coerce.date(),
    reviewedAgainst: z.array(z.string()).default([]),
    draft: z.boolean().default(false)
  })
});

export const collections = { lessons };
