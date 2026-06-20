import { useUserStore } from "../store/userStore";
import { CURRENT_POOL, FRAGMENT_COSTS } from "../data/gachaPools";
import type { GachaPoolCharacter, PullResult } from "../types/gacha";

export function useGacha() {
	const store = useUserStore;

	/** 抽卡。保底计数每抽写回 store；出新角色才清零（修复旧方案 bug） */
	function pull(count: 1 | 10): PullResult[] {
		const s = store.getState();
		if (!s.spendGachaTicket(count)) {
			throw new Error("抽卡券不足");
		}

		const owned = new Set(s.progress.gacha.ownedCharacters);
		let pity = s.progress.gacha.pityCount;
		const results: PullResult[] = [];

		for (let i = 0; i < count; i++) {
			const forceNew = pity >= CURRENT_POOL.rules.pityAt;
			const char = draw(owned, forceNew);
			const isDuplicate = owned.has(char.characterId);

			let fragmentsGained = 0;
			if (isDuplicate) {
				fragmentsGained = CURRENT_POOL.rules.fragmentsOnDuplicate;
				store.getState().addFragment(fragmentsGained);
				pity++; // 没出新，累加
			} else {
				store.getState().unlockCharacter(char.characterId);
				owned.add(char.characterId);
				pity = 0; // 出新清零
			}

			results.push({
				characterId: char.characterId,
				isDuplicate,
				fragmentsGained,
				isNew: !isDuplicate,
			});
			store.getState().pushPull({
				timestamp: Date.now(),
				characterId: char.characterId,
				isDuplicate,
				fragmentsGained,
			});
		}

		store.getState().setPity(pity); // ★ 持久化保底计数
		return results;
	}

	/** 碎片兑换指定角色 */
	function redeemCharacter(characterId: string): boolean {
		const s = store.getState();
		if (s.hasCharacter(characterId)) return false;
		if (!s.spendFragment(FRAGMENT_COSTS.character)) return false;
		s.unlockCharacter(characterId);
		return true;
	}

	function draw(owned: Set<string>, forceNew: boolean): GachaPoolCharacter {
		const pool = CURRENT_POOL.characters;
		const unowned = pool.filter((c) => !owned.has(c.characterId));
		if (forceNew && unowned.length > 0) return weighted(unowned);
		return weighted(pool);
	}

	function weighted(list: GachaPoolCharacter[]): GachaPoolCharacter {
		const total = list.reduce((sum, c) => sum + c.weight, 0);
		let r = Math.random() * total;
		for (const c of list) {
			r -= c.weight;
			if (r <= 0) return c;
		}
		return list[list.length - 1];
	}

	return { pull, redeemCharacter };
}
