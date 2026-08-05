// vn-content-schemas: Zod schemas + TS types for VN content packages.
// Validate any content.json with GameContentSchema.parse() before runtime load.

export * from "./character";
export * from "./series";
export * from "./storyline";
export * from "./scene";
export * from "./classic";
export * from "./achievement";
export * from "./minigame";
export * from "./bgm";
export * from "./gacha";
export * from "./gameContent";

import { GameContentSchema } from "./gameContent";

/** Parse + validate a JSON object into GameContent. Throws ZodError on failure. */
export function parseGameContent(raw: unknown) {
  return GameContentSchema.parse(raw);
}

/** Safe parse: returns { success, data, error } without throwing. */
export function safeParseGameContent(raw: unknown) {
  return GameContentSchema.safeParse(raw);
}
