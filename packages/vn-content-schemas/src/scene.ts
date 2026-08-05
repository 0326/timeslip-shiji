import { z } from "zod";

export const SceneBackgroundSchema = z.object({
  /** bg id，和 ink 中 #bg:ID 对齐 */
  id: z.string().regex(/^[a-z0-9_]+$/),
  series: z.string().min(1),
  name: z.string().default(""),
  /** 图片路径，相对 content/assets/backgrounds/ 或完整 URL */
  path: z.string().min(1),
  /** day / night / dawn / dusk / indoor / outdoor 等氛围标签 */
  tags: z.array(z.string()).default([]),
});
export type SceneBackground = z.infer<typeof SceneBackgroundSchema>;

export const SceneCatalogSchema = z.object({
  backgrounds: z.array(SceneBackgroundSchema).default([]),
});
export type SceneCatalog = z.infer<typeof SceneCatalogSchema>;
