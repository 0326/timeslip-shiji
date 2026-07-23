import { useEffect, useState } from "react";
import { CHARACTERS, getAllCharactersMerged } from "../data/characters";
import type { Character } from "../types/character";

/**
 * 批量加载合并后的角色（游戏化字段 + 主项目 bio/avatar）。
 * 初始返回同步 CHARACTERS（本地兜底），合并完成后更新。
 * 用于图鉴、抽卡池等需要全量角色 + 真实头像的场景。
 */
export function useMergedCharacters(mergeRelations = false) {
	const [characters, setCharacters] = useState<Character[]>(CHARACTERS);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		let cancelled = false;
		getAllCharactersMerged(mergeRelations).then((merged) => {
			if (cancelled) return;
			setCharacters(merged);
			setLoaded(true);
		});
		return () => {
			cancelled = true;
		};
	}, [mergeRelations]);

	const characterMap = new Map(characters.map((c) => [c.id, c]));
	return { characters, characterMap, loaded };
}

/**
 * 单人合并 hook：用于角色详情、关系图等只需一个角色的场景。
 */
export function useMergedCharacter(id: string | undefined, mergeRelations = true) {
	const local = id ? CHARACTERS.find((c) => c.id === id) : undefined;
	const [character, setCharacter] = useState<Character | undefined>(local);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		if (!id) {
			setCharacter(undefined);
			setLoaded(false);
			return;
		}
		let cancelled = false;
		// 立即重置为本地兜底（切换 id 时先显示占位）
		setCharacter(CHARACTERS.find((c) => c.id === id));
		setLoaded(false);
		import("../data/characters").then(async ({ getCharacterMerged }) => {
			const merged = await getCharacterMerged(id, mergeRelations);
			if (cancelled) return;
			setCharacter(merged);
			setLoaded(true);
		});
		return () => {
			cancelled = true;
		};
	}, [id, mergeRelations]);

	return { character, loaded };
}
