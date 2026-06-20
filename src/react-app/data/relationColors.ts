import type { RelationType } from "../types/character";

export const RELATION_COLORS: Record<RelationType, string> = {
	ally: "#b8973a",
	enemy: "#c0392b",
	neutral: "#7a6e5c",
	grace: "#5a8f6b",
	lord: "#1a6b8a",
};

export const RELATION_LABELS: Record<RelationType, string> = {
	ally: "盟友",
	enemy: "对手",
	neutral: "中立",
	grace: "恩义",
	lord: "君臣",
};
