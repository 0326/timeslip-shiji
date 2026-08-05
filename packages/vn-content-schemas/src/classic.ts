import { z } from "zod";

export const ClassicChapterSchema = z.object({
  /** chapter unique id, e.g. "shun_01" */
  id: z.string().regex(/^[a-z0-9_]+$/),
  /** 典籍卷/章编号名，如 "卷一" "五帝本纪第一" */
  chapter: z.string().min(1),
  /** 典籍 section / 篇名 等次级分类 */
  section: z.string().default(""),
  /** 章节短标题 */
  title: z.string().min(1),
  /** 典籍原文（繁体/原文） */
  classical_text: z.string().default(""),
  /** 白话翻译（可选） */
  vernacular_text: z.string().optional(),
  /** 史料来源标注：史记·五帝本纪 等 */
  source: z.string().default(""),
  /** 章节排序 */
  order: z.number().int().default(0),
});
export type ClassicChapter = z.infer<typeof ClassicChapterSchema>;

/** Single classic book — 典籍页面以 series 分组，每组含多本典籍。 */
export const ClassicSchema = z.object({
  id: z.string().regex(/^[a-z0-9_]+$/),
  /** 归属 series id */
  series_id: z.string().default(""),
  /** 典籍名：尚书 / 史记 / 山海经 ... */
  name: z.string().min(1),
  description: z.string().default(""),
  author: z.string().optional(),
  dynasty: z.string().optional(),
  /** 章节列表 */
  chapters: z.array(ClassicChapterSchema).default([]),
  order: z.number().int().default(0),
});
export type Classic = z.infer<typeof ClassicSchema>;

/** Back-compat: classic catalog container — GameContent.classics uses Classic[]. */
export const ClassicCatalogSchema = z.array(ClassicSchema).default([]);
export type ClassicCatalog = z.infer<typeof ClassicCatalogSchema>;
