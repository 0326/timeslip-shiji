import { z } from "zod";

export const GachaBannerSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  name: z.string().min(1),
  description: z.string().default(""),
  /** Character IDs with increased drop rate */
  up_characters: z.array(z.string()).default([]),
  /** Pity counter threshold (default 90) */
  pity_threshold: z.number().int().positive().default(90),
  /** Current pity counter (runtime state) */
  pity_counter: z.number().int().nonnegative().default(0),
  /** Historical total pulls on this banner (runtime state) */
  total_pulls: z.number().int().nonnegative().default(0),
  /** Default banner order */
  order: z.number().int().default(0),
  /** Optional accent color */
  accent_color: z.string().optional(),
});
export type GachaBanner = z.infer<typeof GachaBannerSchema>;

/** Pulled item shape as returned by GachaSystem.pull() */
export interface GachaPulledItem {
  kind: "figure" | "memory";
  character_id: string;
  memory_id?: string;
  rarity: 1 | 2 | 3 | 4 | 5;
}

/** Aggregated pull result for UI consumption */
export interface GachaPullResult {
  banner_id: string;
  items: GachaPulledItem[];
  /** Character IDs that were newly obtained (not in collection before this pull) */
  new_characters: string[];
  free_pulls_remaining: number;
}