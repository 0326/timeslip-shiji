import { z } from "zod";

export type StoryPerspective = "protagonist" | "bystander" | "antagonist" | "omniscient";
export type StoryMode = "official" | "free";

export const StorylineUnlockSchema = z.object({
  after_storyline: z.string().optional(),
  require_character: z.string().optional(),
  require_death_count: z.object({
    death_id: z.string(),
    count: z.number().int().positive(),
  }).optional(),
});
export type StorylineUnlock = z.infer<typeof StorylineUnlockSchema>;

export const StorylineSchema = z.object({
  id: z.string().regex(/^[a-z0-9_-]+$/),
  series: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().default(""),
  protagonist: z.string().min(1),
  cast: z.array(z.string()).default([]),
  perspective: z.enum(["protagonist", "bystander", "antagonist", "omniscient"]).default("protagonist"),
  mode: z.enum(["official", "free"]).default("official"),
  /** ink 文件路径，相对 content/ink/<path>.ink（dev）或预编译 JSON（prod） */
  ink_path: z.string().min(1),
  estimated_minutes: z.number().int().positive().optional(),
  difficulty: z.number().int().min(1).max(5).default(3),
  unlock: StorylineUnlockSchema.default(() => ({})),
  synopsis: z.string().default(""),
});
export type Storyline = z.infer<typeof StorylineSchema>;
