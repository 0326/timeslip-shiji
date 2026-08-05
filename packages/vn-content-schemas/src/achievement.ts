import { z } from "zod";

export const AchievementTriggerSchema = z.union([
  z.object({ kind: z.literal("storyline_clear"), storyline_id: z.string() }),
  z.object({ kind: z.literal("death"), death_id: z.string(), times: z.number().int().positive().default(1) }),
  z.object({ kind: z.literal("choice_tag"), tag: z.string(), count: z.number().int().positive().default(1) }),
  z.object({ kind: z.literal("variable_gte"), name: z.string(), value: z.number() }),
  z.object({ kind: z.literal("manual"), id: z.string() }),
]);
export type AchievementTrigger = z.infer<typeof AchievementTriggerSchema>;

export const AchievementSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  name: z.string().min(1),
  description: z.string().default(""),
  rarity: z.number().int().min(1).max(5).default(1),
  group: z.string().default("general"),
  icon: z.string().optional(),
  hint: z.string().optional(),
  trigger: AchievementTriggerSchema.default(() => ({ kind: "manual", id: "" })),
});
export type Achievement = z.infer<typeof AchievementSchema>;

/** Runtime progress (not persisted schema — computed from AchievementSystem state). */
export interface AchievementProgress {
  unlocked_ids: string[];
  unlocked_at: Record<string, number>;
}
