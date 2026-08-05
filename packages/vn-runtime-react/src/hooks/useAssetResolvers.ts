import { useMemo } from "react";
import { useGame } from "../context/GameContext";
import type { Character } from "vn-content-schemas";
import type { SpriteAsset } from "vn-ui-components";

/**
 * Build SpriteAsset map (id -> asset) from the content character list
 * using assetBase + character asset fields.
 *
 * Asset URL rules (mirrors existing project conventions):
 *  - variants: `{assetBase}characters/{id}/full-{expr}.png` if variants not provided inline
 *  - fallback gradient is derived from character.accent color (or --vn-accent)
 */
export function useSpriteAssetMap(): Record<string, SpriteAsset> {
  const { content, assetBase } = useGame();
  return useMemo(() => {
    const out: Record<string, SpriteAsset> = {};
    for (const c of content.characters) {
      out[c.id] = characterToSpriteAsset(c, assetBase);
    }
    return out;
  }, [content.characters, assetBase]);
}

export function characterToSpriteAsset(c: Character, assetBase: string): SpriteAsset {
  const base = assetBase.endsWith("/") ? assetBase : assetBase + "/";
  const dir = `${base}characters/${c.id}/`;

  // Inline variants map (expression -> URL): prefer CharacterAssets.variants when provided
  const variants: Record<string, string> = {};
  const list = c.assets?.variants ?? [];
  for (const v of list) {
    if (v.url) variants[v.expression] = toAbsolute(v.url, base);
  }
  // Default expression
  const defaultFull = c.assets?.full_default
    ? toAbsolute(c.assets.full_default, base)
    : `${dir}full-default.png`;

  const accent = c.accent ?? undefined;
  const from = accent ?? "#2a2018";
  const to = "#0c0a08";
  return {
    id: c.id,
    name: c.name,
    full: defaultFull,
    variants: Object.keys(variants).length ? variants : undefined,
    fallback: { from, to },
    accent,
  };
}

function toAbsolute(url: string, base: string): string {
  if (/^(https?:)?\/\//i.test(url)) return url;
  if (url.startsWith("/")) return url;
  return base + url;
}

/** Resolve a scene background to a full URL using assetBase. */
export function useBackgroundUrl(sceneId?: string | null): string | undefined {
  const { content, assetBase } = useGame();
  if (!sceneId) return undefined;
  const scene = content.scenes.find((s) => s.id === sceneId);
  if (!scene) return undefined;
  const base = assetBase.endsWith("/") ? assetBase : assetBase + "/";
  if (scene.background_image) return toAbsolute(scene.background_image, `${base}scenes/`);
  return undefined;
}

/** Fallback gradient derived from series accent or default ink wash. */
export function useFallbackBg(seriesId?: string): { from: string; to: string } {
  const { content } = useGame();
  const series = seriesId ? content.series.find((s) => s.id === seriesId) : undefined;
  const from = series?.accent_color ?? "#2a2018";
  return { from, to: "#0c0a08" };
}
