import { z } from "zod";

export const MinigameParamSchema = z.object({
  key: z.string().min(1),
  type: z.enum(["number", "boolean", "string", "enum"]),
  required: z.boolean().default(false),
  default: z.union([z.number(), z.boolean(), z.string()]).optional(),
  enum_values: z.array(z.string()).optional(),
  description: z.string().default(""),
});
export type MinigameParam = z.infer<typeof MinigameParamSchema>;

export type MinigameResultType = "number" | "boolean" | "string";

export const MinigameSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  name: z.string().min(1),
  /** 组件名（UI 层通过 name 注册映射） */
  component: z.string().min(1),
  params: z.array(MinigameParamSchema).default([]),
  result_type: z.enum(["number", "boolean", "string"]).default("number"),
  /** 必须 true — 历史 VN 小游戏不能阻塞主线 */
  skippable: z.boolean().default(true),
  skip_result: z.union([z.number(), z.boolean(), z.string()]).default(0),
  skip_score: z.number().default(0),
  description: z.string().default(""),
});
export type Minigame = z.infer<typeof MinigameSchema>;
