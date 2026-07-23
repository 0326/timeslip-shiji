import type { RelationType } from "../types/character";

// 与主项目 timslip-work 对齐的 6 种关系类型配色与标签
export const RELATION_COLORS: Record<RelationType, string> = {
  family: "#b8557a", // 亲缘（粉）
  sovereign: "#1a6b8a", // 君臣（蓝）
  teacher: "#5a8f6b", // 师承（绿）
  friend: "#b8973a", // 挚友（金）
  enemy: "#c0392b", // 敌对（红）
  peer: "#7a6e5c", // 同侪（灰）
};

export const RELATION_LABELS: Record<RelationType, string> = {
  family: "亲缘",
  sovereign: "君臣",
  teacher: "师承",
  friend: "挚友",
  enemy: "对手",
  peer: "同侪",
};
