import { z } from "zod";
import { CharacterSchema } from "./character";
import { SeriesSchema } from "./series";
import { StorylineSchema } from "./storyline";
import { SceneBackgroundSchema } from "./scene";
import { ClassicCatalogSchema } from "./classic";
import { AchievementSchema } from "./achievement";
import { MinigameSchema } from "./minigame";
import { BgmCatalogSchema } from "./bgm";
import { GachaBannerSchema } from "./gacha";

/** Root schema for a content package. Validate via contentValidator before loading into runtime. */
export const GameContentSchema = z.object({
  schema_version: z.literal("1.0.0").default("1.0.0"),
  game_name: z.string().default("Historical VN"),
  default_theme: z.string().default("inkWash"),
  default_language: z.string().default("zh-CN"),
  series: z.array(SeriesSchema).default([]),
  characters: z.array(CharacterSchema).default([]),
  storylines: z.array(StorylineSchema).default([]),
  backgrounds: z.array(SceneBackgroundSchema).default([]),
  // 注意：ClassicCatalogSchema 现在是 Classic[] (数组)，与 ClassicsPage.classics: Classic[] 对应
  classics: ClassicCatalogSchema,
  achievements: z.array(AchievementSchema).default([]),
  minigames: z.array(MinigameSchema).default([]),
  bgm: BgmCatalogSchema.default(() => ({ tracks: [] })),
  gacha_banners: z.array(GachaBannerSchema).default([]),
});
export type GameContent = z.infer<typeof GameContentSchema>;
