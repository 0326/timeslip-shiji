import { z } from "zod";

/** A single character sprite variant (expression → file path) */
export const SpriteVariantSchema = z.object({
  expression: z.string().min(1),
  /** Path relative to content/assets/figures/<id>/portrait/ or full asset URL */
  path: z.string().min(1),
});
export type SpriteVariant = z.infer<typeof SpriteVariantSchema>;

export const CharacterAssetsSchema = z.object({
  portrait_default: z.string().optional(),
  bust_default: z.string().optional(),
  avatar_default: z.string().optional(),
  variants: z.array(SpriteVariantSchema).default([]),
});
export type CharacterAssets = z.infer<typeof CharacterAssetsSchema>;

export const CharacterRelationSchema = z.object({
  target_id: z.string().min(1),
  label: z.string().min(1),
  /** Relationship accent color override */
  color: z.string().optional(),
});
export type CharacterRelation = z.infer<typeof CharacterRelationSchema>;

export const CharacterSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  name: z.string().min(1),
  /** 字号 / 美称，如『兵仙』 */
  title: z.string().default(""),
  /** 时代 tag，和 Series.era 对齐 */
  era: z.string().min(1),
  order: z.number().int().default(0),
  /** 朝代顺序权重（用于 CharacterList 按朝代排序） */
  dynasty_order: z.number().int().default(0),
  style_name: z.string().optional(),
  accent: z.string().optional(),
  /** 单字代表符号（图鉴卡片大印） */
  glyph: z.string().length(1).optional(),
  /** 典籍原文名句 */
  classical_quote: z.string().default(""),
  /** 史料来源（史记·淮阴侯列传 etc.） */
  historical_source: z.string().default(""),
  /** 白话简介 1-2 段 */
  description: z.string().default(""),
  /** 长传记（可选，人物详情页展开） */
  bio_summary: z.string().optional(),
  assets: CharacterAssetsSchema.default(() => ({ variants: [] })),
  /** 关联故事线 id 列表 */
  related_storylines: z.array(z.string()).default([]),
  relations: z.array(CharacterRelationSchema).default([]),
});
export type Character = z.infer<typeof CharacterSchema>;
