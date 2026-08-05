/**
 * Vite plugin for VN projects.
 *
 * Features:
 *  1. Dev-time virtual module `virtual:vn-content` — serves the content package as JSON.
 *     Import via:     import content from "virtual:vn-content";
 *  2. Dev-time virtual module `virtual:vn-ink-source` per storyline id:
 *     import ink from "virtual:vn-ink-source/shun-fanlin";
 *     Returns raw .ink file text, plus HMR invalidation on edit.
 *  3. Sets sensible defaults for React + history router + static assets.
 *
 * Usage in vite.config.ts:
 *   import { defineConfig } from "vite";
 *   import { vnPlugin } from "vn-build-tools";
 *   export default defineConfig({
 *     plugins: [vnPlugin({ contentDir: "content" })],
 *   });
 */

import type { Plugin } from "vite";
import * as fs from "node:fs";
import * as path from "node:path";
import { validateContentPackageStrict, validateContentPackage } from "vn-asset-pipeline";

export interface VnPluginOptions {
  /** Content package directory. Must contain content.json (and optional ink/ subfolder). */
  contentDir: string;
  /** Virtual module prefix — don't change unless you know what you're doing. */
  prefix?: string;
}

const VIRTUAL_PREFIX = "virtual:vn-";
const RESOLVED_PREFIX = "\0" + VIRTUAL_PREFIX;

export function vnPlugin(opts: VnPluginOptions): Plugin {
  const contentDir = path.resolve(opts.contentDir);
  const prefix = opts.prefix ?? VIRTUAL_PREFIX;
  const resolvedPrefix = "\0" + prefix;
  const contentPath = path.join(contentDir, "content.json");
  const inkDir = path.join(contentDir, "ink");
  let contentJson: Record<string, unknown> | null = null;

  function readContentJson() {
    try {
      const raw = fs.readFileSync(contentPath, "utf8");
      contentJson = JSON.parse(raw);
      const r = validateContentPackage(contentJson);
      if (!r.ok) {
        const errors = r.issues.filter(i => i.severity === "error");
        if (errors.length) {
          // eslint-disable-next-line no-console
          console.warn("[vn-plugin] content.json has issues:", errors.map(e => e.message).join("; "));
        }
      }
      return contentJson;
    } catch (e) {
      contentJson = null;
      return null;
    }
  }

  return {
    name: "vn-build-tools:vn-plugin",
    config: () => ({
      server: {
        fs: { allow: [contentDir] },
      },
    }),
    configureServer(server) {
      // Watch content folder for edits → reload virtual modules
      const tryWatch = (dir: string) => {
        if (!fs.existsSync(dir)) return;
        server.watcher.add(dir);
      };
      tryWatch(contentDir);
      tryWatch(inkDir);
      server.watcher.on("change", (file) => {
        if (file === contentPath) {
          readContentJson();
          server.moduleGraph.getModulesByFile(RESOLVED_PREFIX + "content")?.forEach(m => server.moduleGraph.invalidateModule(m));
          server.ws.send({ type: "full-reload" });
        } else if (file.startsWith(inkDir) && file.endsWith(".ink")) {
          const id = path.basename(file, ".ink");
          server.moduleGraph.getModulesByFile(RESOLVED_PREFIX + "ink-source/" + id)?.forEach(m => server.moduleGraph.invalidateModule(m));
          server.ws.send({ type: "full-reload" });
        }
      });
    },
    resolveId(id) {
      if (id.startsWith(prefix)) return "\0" + id;
      return null;
    },
    load(id) {
      if (!id.startsWith(resolvedPrefix)) return null;
      const sub = id.slice(resolvedPrefix.length);
      if (sub === "content") {
        readContentJson();
        if (!contentJson) {
          throw new Error(`[vn-plugin] content.json not found at ${contentPath}. Run 'vn-build init' or vn-pipeline build first.`);
        }
        return `export default ${JSON.stringify(contentJson, null, 2)};`;
      }
      if (sub.startsWith("ink-source/")) {
        const storylineId = sub.slice("ink-source/".length);
        const p = path.join(inkDir, `${storylineId}.ink`);
        if (!fs.existsSync(p)) {
          throw new Error(`[vn-plugin] ink source not found: ${storylineId} (looked at ${p})`);
        }
        const text = fs.readFileSync(p, "utf8");
        return `export default ${JSON.stringify(text)};`;
      }
      if (sub === "config") {
        return `export default ${JSON.stringify({ contentDir, inkDir }, null, 2)};`;
      }
      return null;
    },
  };
}
