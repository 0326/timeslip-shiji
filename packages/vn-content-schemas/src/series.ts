import { z } from "zod";

export const SeriesSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  name: z.string().min(1),
  /** 短名称（用于筛选标签等紧凑位置） */
  name_short: z.string().optional(),
  /** 时代标签，如 五帝、夏商、周武 */
  era_tag: z.string().default(""),
  /** 副标题，如『涿鹿风云 · 禅让开国』 */
  tagline: z.string().default(""),
  era: z.string().min(1),
  /** 系列排序，1=五帝 2=殷商 ... */
  order: z.number().int(),
  glyph: z.string().length(1).optional(),
  accent: z.string().default("#c9a84c"),
  accent2: z.string().default("#3a8c6e"),
  /** 卡片背景渐变 from → to */
  bg_from: z.string().default("#1a1510"),
  bg_to: z.string().default("#0f1a15"),
  /** true → 选择页显示『敬请期待』占位 */
  coming_soon: z.boolean().default(false),
  /** 该系列包含的 storyline id 列表（交叉引用校验） */
  storylines: z.array(z.string()).default([]),
});
export type Series = z.infer<typeof SeriesSchema>;
