import { wudiButterflyEffects, type ButterflyEffect } from "./wudi-butterfly";

export type { ButterflyEffect };

const BUTTERFLY_MAP: Record<string, ButterflyEffect[]> = {
	wudi: wudiButterflyEffects,
};

export function getButterflyEffects(storyId: string): ButterflyEffect[] | undefined {
	return BUTTERFLY_MAP[storyId];
}