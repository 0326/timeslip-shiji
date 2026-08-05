import { BGM_TRACKS, type Mood, type BgmTrack } from "../src/react-app/data/bgm";
import { KEYWORD_RULES, SPEAKER_MOOD_HINT, STRONG_EMOTION_TRIGGERS, WEAK_EMOTION_TRIGGERS } from "../src/react-app/data/bgm-keywords";
import { SCENE_BGM, getSceneBgmHint, getDefaultMoodForScene, getAltMoodForScene } from "../src/react-app/data/scenes-bgm";
import { BgmMatcher } from "../src/react-app/lib/bgmMatcher";

type Command = {
	action: string;
	subaction?: string;
	params: Record<string, string>;
};

function parseCommand(input: string): Command {
	const parts = input.split(/\s+/);
	const action = parts[0].replace(/#/, '');
	const subaction = parts[1];
	const params: Record<string, string> = {};
	
	for (let i = subaction ? 2 : 1; i < parts.length; i++) {
		const [key, value] = parts[i].split('=');
		if (key && value !== undefined) {
			params[key] = value;
		}
	}
	
	return { action, subaction, params };
}

function listTracks(): string {
	let result = "=== BGM Tracks ===\n";
	for (const [id, track] of Object.entries(BGM_TRACKS)) {
		result += `  ${id}: ${track.label} (${track.mood})\n`;
	}
	return result;
}

function listScenes(): string {
	let result = "=== Scene BGM Configurations ===\n";
	for (const scene of SCENE_BGM) {
		result += `\n  ${scene.sceneId}\n`;
		result += `    Default: ${scene.defaultMood}\n`;
		if (scene.keywords) {
			result += `    Keywords: ${scene.keywords.join(', ')}\n`;
		}
		if (scene.altMoods) {
			result += `    Alternates: ${scene.altMoods.map(a => `${a.trigger}->${a.mood}`).join(', ')}\n`;
		}
	}
	return result;
}

function listKeywords(): string {
	let result = "=== Keyword Rules ===\n";
	for (const rule of KEYWORD_RULES) {
		result += `\n  ${rule.mood} (weight: ${rule.weight})\n`;
		result += `    Words: ${rule.words.join(', ')}\n`;
	}
	return result;
}

function previewMatch(scene: string, text: string, speaker?: string): string {
	const matcher = new BgmMatcher();
	matcher.setScene(scene);
	
	const match = matcher.match(text, speaker);
	const trackId = matcher.switchTo(match?.mood ?? 'solemn');
	const track = BGM_TRACKS[trackId ?? matcher.getCurrentTrackId()];
	
	let result = `=== BGM Matching Preview ===\n`;
	result += `  Scene: ${scene}\n`;
	result += `  Text: ${text}\n`;
	result += `  Speaker: ${speaker || 'none'}\n`;
	result += `\n  Match Result:\n`;
	result += `    Mood: ${match?.mood ?? 'none'}\n`;
	result += `    Score: ${match?.score ?? 0}\n`;
	result += `    Source: ${match?.source ?? 'none'}\n`;
	result += `\n  Selected Track:\n`;
	result += `    ID: ${trackId ?? matcher.getCurrentTrackId()}\n`;
	result += `    Label: ${track.label}\n`;
	result += `    URL: ${track.url}\n`;
	
	return result;
}

function main() {
	const input = process.argv[2] || '';
	if (!input) {
		console.log("Usage: node bgm-cli.js <command>");
		console.log("Commands:");
		console.log("  #bgm:track:list");
		console.log("  #bgm:scene:list");
		console.log("  #bgm:keyword:list");
		console.log("  #bgm:preview scene=<scene> text=<text> [speaker=<speaker>]");
		return;
	}
	
	const cmd = parseCommand(input);
	
	switch (cmd.action) {
		case "bgm:track:list":
			console.log(listTracks());
			break;
		case "bgm:scene:list":
			console.log(listScenes());
			break;
		case "bgm:keyword:list":
			console.log(listKeywords());
			break;
		case "bgm:preview":
			console.log(previewMatch(cmd.params.scene, cmd.params.text, cmd.params.speaker));
			break;
		default:
			console.log(`Unknown command: ${input}`);
	}
}

main();
