import type { MinigameEntry } from "./types";

const registry: Record<string, MinigameEntry> = {};

export function registerMinigame(entry: MinigameEntry) {
	if (registry[entry.id]) {
		console.warn(`[minigame] duplicate id "${entry.id}", skipped`);
		return;
	}
	registry[entry.id] = entry;
}

export function getMinigame(id: string): MinigameEntry | undefined {
	return registry[id];
}

export function listMinigames(): MinigameEntry[] {
	return Object.values(registry);
}

export function hasMinigame(id: string): boolean {
	return Object.prototype.hasOwnProperty.call(registry, id);
}
