import { z } from "zod";

export const BgmTrackSchema = z.object({
  /** 和 ink 中 #bgm:ID 对齐 */
  id: z.string().regex(/^[a-z0-9_]+$/),
  name: z.string().default(""),
  /** 音频路径（相对 content/assets/bgm/ 或 URL） */
  path: z.string().min(1),
  loop_start: z.number().nonnegative().optional(),
  loop_end: z.number().nonnegative().optional(),
  /** 所属 series.id 或 'global' */
  series: z.string().default("global"),
  mood: z.enum(["epic", "calm", "tense", "sad", "happy", "mystic"]).optional(),
});
export type BgmTrack = z.infer<typeof BgmTrackSchema>;

export const BgmCatalogSchema = z.object({
  tracks: z.array(BgmTrackSchema).default([]),
});
export type BgmCatalog = z.infer<typeof BgmCatalogSchema>;
