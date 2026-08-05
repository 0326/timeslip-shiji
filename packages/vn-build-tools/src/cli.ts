#!/usr/bin/env node
/**
 * vn-build CLI:
 *
 *   vn-build init <dir>        # scaffold new project
 *   vn-build dev               # vite dev wrapper (requires vite installed locally)
 *   vn-build build             # vite build wrapper
 *
 * Kept tiny so we don't depend on Vite imports at CLI time.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { scaffoldProject } from "./index";
import { exec as execCb } from "node:child_process";
import { promisify } from "node:util";

const exec = promisify(execCb);

function parseArgs(argv: string[]) {
  const out: Record<string, string | boolean> = {};
  const rest: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const eq = a.indexOf("=");
      if (eq > 0) { out[a.slice(2, eq)] = a.slice(eq + 1); continue; }
      const nx = argv[i + 1];
      if (nx && !nx.startsWith("-")) { out[a.slice(2)] = nx; i++; continue; }
      out[a.slice(2)] = true;
    } else rest.push(a);
  }
  return { flags: out, positional: rest };
}

async function main(): Promise<number> {
  const { flags, positional } = parseArgs(process.argv.slice(2));
  const cmd = positional[0];
  switch (cmd) {
    case "init": case "scaffold": {
      const dir = positional[1] ?? String(flags.out ?? flags.o ?? "my-vn");
      const out = scaffoldProject({ outDir: dir, gameName: String(flags.name ?? path.basename(dir)) });
      for (const f of out.files) {
        const full = f.path;
        await fs.promises.mkdir(path.dirname(full), { recursive: true });
        await fs.promises.writeFile(full, f.content, "utf8");
      }
      console.log(`Scaffolded ${out.files.length} files into ${dir}`);
      return 0;
    }
    case "dev": {
      await runLocalBin("vite", []);
      return 0;
    }
    case "build": {
      await runLocalBin("vite", ["build"]);
      return 0;
    }
    default:
      console.log("vn-build <init|dev|build> [options]");
      return 0;
  }
}

async function runLocalBin(name: string, args: string[]) {
  const local = path.resolve(process.cwd(), "node_modules", ".bin", name);
  if (!fs.existsSync(local)) {
    throw new Error(`Could not find local bin: ${local}. Run pnpm install first.`);
  }
  const { stdout, stderr } = await exec(`${local} ${args.join(" ")}`, { stdio: "inherit" } as any);
  if (stdout) process.stdout.write(stdout);
  if (stderr) process.stderr.write(stderr);
}

if (typeof process !== "undefined" && process.argv?.[1]?.endsWith("cli.ts")) {
  main().then(c => process.exit(c)).catch(e => { console.error(e); process.exit(1); });
}
