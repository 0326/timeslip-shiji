/**
 * Asset optimizer stubs.
 *
 * We intentionally keep this framework-agnostic — real compression is delegated
 * to sharp, pngquant, ffmpeg etc. via environment CLI when available; the code
 * here is only the manifest/plumbing layer that:
 *   1. Lists figures/bgs/bgm in a content package
 *   2. Emits a content_assets.json manifest listing expected paths + sizes
 *   3. Flags missing files so CI fails early
 */

import type { GameContent } from "vn-content-schemas";

export interface AssetManifestEntry {
  kind: "bg" | "figure_portrait" | "figure_bust" | "figure_avatar" | "figure_variant" | "bgm" | "memory_art";
  id: string;
  path: string;
  expected_bytes?: number;
}

export interface AssetManifest {
  entries: AssetManifestEntry[];
  missing: AssetManifestEntry[];
}

export function buildAssetManifest(content: GameContent): AssetManifest {
  const entries: AssetManifestEntry[] = [];
  for (const bg of content.backgrounds) {
    entries.push({ kind: "bg", id: bg.id, path: bg.path });
  }
  for (const ch of content.characters) {
    if (ch.assets.portrait_default) {
      entries.push({ kind: "figure_portrait", id: ch.id, path: ch.assets.portrait_default });
    }
    if (ch.assets.bust_default) {
      entries.push({ kind: "figure_bust", id: ch.id, path: ch.assets.bust_default });
    }
    if (ch.assets.avatar_default) {
      entries.push({ kind: "figure_avatar", id: ch.id, path: ch.assets.avatar_default });
    }
    for (const v of ch.assets.variants) {
      entries.push({ kind: "figure_variant", id: `${ch.id}:${v.expression}`, path: v.path });
    }
  }
  for (const track of content.bgm.tracks) {
    entries.push({ kind: "bgm", id: track.id, path: track.path });
  }
  return { entries, missing: [] };
}

/**
 * Check file existence against a reader; return missing entries.
 * Pure function contract: caller provides a batch-checker.
 */
export function findMissingAssets(
  manifest: AssetManifest,
  exists: (path: string) => boolean
): AssetManifestEntry[] {
  return manifest.entries.filter((e) => !exists(e.path));
}
