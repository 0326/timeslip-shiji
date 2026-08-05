import type { Character, Series, Storyline } from "vn-content-schemas";

/**
 * Ink generator: take a storyline definition + optional scene list and output
 * skeleton Ink source (knot/stitch placeholders, character declarations via
 * tags, bg show/hide).  User fills in dialogue later.
 *
 * The generated Ink file uses vn-core's extended tag convention:
 *   #bg:id, #show, #se, #minigame, #shake, etc.
 */

export interface InkScaffoldOptions {
  storyline: Pick<Storyline, "id" | "title" | "protagonist" | "cast">;
  series: Pick<Series, "id" | "name">;
  characters: Array<Pick<Character, "id" | "name" | "title">>;
  /** Knot/stitch names to scaffold. */
  scenes?: string[];
  /** Add #minigame:water_control example scene. */
  includeMinigameExample?: boolean;
  /** Add death branch → checkpoint stitch (see deathCodexSystem checkpoint_path). */
  includeDeathExample?: boolean;
}

const DEFAULT_SCENES = ["start", "conflict", "climax", "end"];

export function generateInkScaffold(opts: InkScaffoldOptions): string {
  const { storyline, series, characters } = opts;
  const scenes = opts.scenes?.length ? opts.scenes : DEFAULT_SCENES;
  const protag = characters.find((c) => c.id === storyline.protagonist);
  const castChars = storyline.cast
    .map((id) => characters.find((c) => c.id === id))
    .filter((c): c is Pick<Character, "id" | "name" | "title"> => Boolean(c));

  const lines: string[] = [];
  lines.push(`// ============================================================`);
  lines.push(`// Auto-generated Ink scaffold for storyline: ${storyline.id}`);
  lines.push(`// Series: ${series.name} (${series.id})`);
  lines.push(`// Title: ${storyline.title}`);
  lines.push(`// Protagonist: ${protag?.name ?? storyline.protagonist}`);
  lines.push(`// ============================================================`);
  lines.push("");
  lines.push(`VAR __storyline_id = "${storyline.id}"`);
  lines.push(`VAR mg_result = 0`);
  lines.push(`VAR mg_score = 0`);
  lines.push("");
  lines.push(`=== ${storyline.id} ===`);
  lines.push("");
  lines.push(`#series:${series.id} #kind:storyline_start`);
  lines.push(`青月: 进入《${storyline.title}》。本章节主角是${protag?.name ?? storyline.protagonist}。`);
  lines.push("");

  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    lines.push(`= ${scene} =`);
    if (i === 0) {
      lines.push(`#bg:${series.id}_palace #show:${storyline.protagonist}:neutral:left`);
    }
    for (const ch of castChars) {
      lines.push(`${ch.name}: （对白示例，编辑为你的剧情内容）`);
    }
    if (i === 0 && castChars.length >= 1) {
      lines.push("");
      lines.push(`* [选择示例 A（推荐）] #tag:branch_a`);
      lines.push(`  青月: 你选择了 A。`);
      lines.push("  -> gather");
      lines.push(`* [选择示例 B（风险更高）] #tag:branch_b`);
      lines.push(`  青月: 你选择了 B。`);
      lines.push("  -> gather");
      lines.push("");
      lines.push(`= gather =`);
    }
    if (i === 1 && opts.includeMinigameExample) {
      lines.push("");
      lines.push(`#minigame:water_control difficulty=hard`);
      lines.push(`青月: 小游戏结果为 {mg_result}，得分 {mg_score}。`);
    }
    if (i === scenes.length - 2 && opts.includeDeathExample) {
      lines.push("");
      lines.push(`#death:jing_xing_burned checkpoint=shun_fanlin.after_fire`);
      lines.push(`青月: 你在焚廪事件中牺牲……`);
    }
    lines.push("");
  }

  lines.push(`= end =`);
  lines.push(`#kind:storyline_end #tag:true_end`);
  lines.push(`青月: 《${storyline.title}》完。`);
  lines.push("-> DONE");
  lines.push("");
  return lines.join("\n");
}
