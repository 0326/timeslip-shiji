#!/usr/bin/env node
/**
 * vn-pipeline CLI.
 *
 *   vn-pipeline build <src.txt|src.json> [-o <out>] [--generate-ink]
 *   vn-pipeline validate <content.json>
 *   vn-pipeline scaffold <storyline-id> --content <content.json>
 *
 * NOTE: Called from shell via node in a real install.  This file is kept
 * dependency-light so it still compiles with TSC.
 */
import { validateContentPackage, buildContentPackage, generateInkScaffold } from "./index";

// Tiny argv parser (no minimist dep — keep the CLI pure).
function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {};
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) {
        out[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const nx = argv[i + 1];
        if (nx && !nx.startsWith("-")) { out[a.slice(2)] = nx; i++; }
        else out[a.slice(2)] = true;
      }
    } else if (a.startsWith("-") && a.length === 2) {
      const nx = argv[i + 1];
      if (nx && !nx.startsWith("-")) { out[a.slice(1)] = nx; i++; }
      else out[a.slice(1)] = true;
    } else rest.push(a);
  }
  return { flags: out, positional: rest };
}

async function main(): Promise<number> {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const cmd = positional[0];
  if (!cmd) {
    printHelp();
    return 0;
  }
  switch (cmd) {
    case "validate": {
      const path = positional[1] ?? String(flags.content ?? flags.c);
      if (!path) { console.error("validate needs <content.json>"); return 2; }
      const raw = JSON.parse(await readFileNode(path));
      const r = validateContentPackage(raw);
      for (const i of r.issues) {
        console.log(`[${i.severity.toUpperCase()}] ${i.code} ${i.path ?? ""}: ${i.message}`);
      }
      console.log(r.ok ? "OK" : `FAILED with ${r.issues.filter(i=>i.severity==='error').length} errors`);
      return r.ok ? 0 : 1;
    }
    case "build": {
      const src = positional[1];
      if (!src) { console.error("build needs source"); return 2; }
      const out = String(flags.o ?? flags.out ?? "dist/content");
      const raw = JSON.parse(await readFileNode(src));
      const writer = fileWriterNode();
      const reader = fileReaderNode();
      const res = await buildContentPackage(reader, writer, {
        outDir: out,
        sourceContent: raw,
        generateInkScaffolds: Boolean(flags["generate-ink"]),
      });
      console.log(`Wrote ${res.contentPath}`);
      console.log(`Generated ${res.generatedInkFiles.length} ink scaffolds`);
      return 0;
    }
    case "scaffold": {
      const id = positional[1];
      const contentPath = String(flags.content ?? flags.c);
      if (!id || !contentPath) { console.error("usage: scaffold <id> --content <file>"); return 2; }
      const content = JSON.parse(await readFileNode(contentPath));
      const sl = content.storylines?.find((s: { id: string }) => s.id === id);
      if (!sl) { console.error(`storyline ${id} not found`); return 1; }
      const series = content.series?.find((s: { id: string }) => s.id === sl.series) ?? { id: sl.series, name: sl.series, era: "", order: 0 };
      const source = generateInkScaffold({
        storyline: sl, series, characters: content.characters ?? [],
      });
      process.stdout.write(source);
      return 0;
    }
    default:
      printHelp();
      return 0;
  }
}

function printHelp() {
  console.log(`vn-pipeline <command> [options]

Commands:
  validate <content.json>
  build <source.json> -o dist/content [--generate-ink]
  scaffold <storyline-id> --content <content.json>
`);
}

// --- tiny Node IO wrappers; in SSR/test env these would be injected ---
import * as fs from "node:fs";
import * as path from "node:path";

function readFileNode(p: string): Promise<string> {
  return fs.promises.readFile(p, "utf8");
}
function fileReaderNode() {
  return {
    readText: readFileNode,
    readBinary: (p: string) => fs.promises.readFile(p).then((b) => new Uint8Array(b)),
    listDir: (p: string) => fs.promises.readdir(p),
    exists: async (p: string) => fs.promises.access(p).then(() => true, () => false),
  };
}
function fileWriterNode() {
  return {
    writeText: (p: string, t: string) => fs.promises.mkdir(path.dirname(p), { recursive: true }).then(() => fs.promises.writeFile(p, t, "utf8")),
    writeBinary: (p: string, d: Uint8Array) => fs.promises.mkdir(path.dirname(p), { recursive: true }).then(() => fs.promises.writeFile(p, Buffer.from(d))),
    ensureDir: (p: string) => fs.promises.mkdir(p, { recursive: true }).then(() => {}),
  };
}

// Only run when invoked directly via node:
if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("cli.ts")) {
  main().then((c) => process.exit(c)).catch((e) => { console.error(e); process.exit(1); });
}
