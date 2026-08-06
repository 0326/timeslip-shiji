import { listMinigames, getMinigame } from "../../minigames/registry";
import { useState, useMemo } from "react";
import type { MinigameEntry } from "../../minigames/types";
import { Info, Grid3X3, Maximize2 } from "lucide-react";
import "./MinigamePreview.css";

export default function MinigamePreviewPage() {
  const games = useMemo(() => listMinigames(), []);
  const [viewMode, setViewMode] = useState<"grid" | "single">("grid");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const uniqueGames = useMemo(() => {
    const seen = new Set<string>();
    return games.filter(g => {
      if (seen.has(g.id)) return false;
      seen.add(g.id);
      return true;
    });
  }, [games]);

  const mainGames = useMemo(() => {
    const mainIds = [
      "klotski_hongmen", "bamboo", "match3", "unify", "quyuan",
      "channel", "astro", "formation", "linxiangru", "logistics",
      "ding", "point", "arrow", "card", "forge",
      "beacon", "zongheng", "zhuhou"
    ];
    const map = new Map(uniqueGames.map(g => [g.id, g]));
    return mainIds.map(id => map.get(id)).filter(Boolean) as MinigameEntry[];
  }, [uniqueGames]);

  if (viewMode === "single" && selectedId) {
    const game = getMinigame(selectedId);
    if (!game) return null;
    const GameComp = game.Component;

    return (
      <div className="mg-preview-root">
        <div className="mg-preview-header">
          <button className="mg-preview-back" onClick={() => { setViewMode("grid"); setSelectedId(null); }}>
            <Grid3X3 size={18} /> 网格视图
          </button>
          <h1 className="mg-preview-title serif">{game.meta.title}</h1>
          <span className="mg-preview-difficulty">{"★".repeat(game.meta.difficulty)}</span>
        </div>
        <div className="mg-preview-info">
          <Info size={16} />
          <span>{game.meta.historyNote}</span>
        </div>
        <div className="mg-preview-stage">
          <GameComp
            storyKey={`preview:${selectedId}`}
            onComplete={() => {}}
            onSkip={() => {}}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mg-preview-root">
      <div className="mg-preview-header">
        <h1 className="mg-preview-main-title serif">小游戏设计预览</h1>
        <div className="mg-preview-controls">
          <span className="mg-preview-count">共 18 种游戏类型</span>
        </div>
      </div>

      <div className="mg-preview-grid-catalog">
        {mainGames.map((game, index) => {
          const GameComp = game.Component;
          return (
            <div key={game.id} className="mg-catalog-item">
              <div className="mg-catalog-header">
                <span className="mg-catalog-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="mg-catalog-title serif">{game.meta.title}</span>
                <span className="mg-catalog-difficulty">{"★".repeat(game.meta.difficulty)}</span>
              </div>
              <div 
                className="mg-catalog-preview"
                onClick={() => { setSelectedId(game.id); setViewMode("single"); }}
              >
                <div className="mg-catalog-stage">
                  <GameComp
                    storyKey={`catalog:${game.id}`}
                    onComplete={() => {}}
                    onSkip={() => {}}
                  />
                </div>
              </div>
              <div className="mg-catalog-info">
                <p>{game.meta.historyNote}</p>
              </div>
              <button 
                className="mg-catalog-expand"
                onClick={() => { setSelectedId(game.id); setViewMode("single"); }}
              >
                <Maximize2 size={14} /> 展开预览
              </button>
            </div>
          );
        })}
      </div>

      <div className="mg-preview-legend">
        <h3 className="serif">游戏类型说明</h3>
        <ul>
          <li><strong>滑块脱困</strong> — 华容道类滑块益智，将主公块滑出出口</li>
          <li><strong>竹简缀合</strong> — 拖拽排序，依《史记》原文顺序拼合竹简</li>
          <li><strong>涿鹿珠阵</strong> — 三消消除，连缀同色玉珠破蚩尤大雾</li>
          <li><strong>统一文字</strong> — 汉字匹配，将六国异体字归于小篆</li>
          <li><strong>屈原问天</strong> — 选词填空，补全《天问》千古之问</li>
          <li><strong>治水疏渠</strong> — 管道拼接，旋转渠管引洪归流</li>
          <li><strong>星象授时</strong> — 记忆匹配，观星宿配节气</li>
          <li><strong>排兵布阵</strong> — 指令序列，排布军令成阵</li>
          <li><strong>完璧归赵</strong> — 潜行躲避，避开秦兵视线间行归赵</li>
          <li><strong>粮草调度</strong> — 资源策略，分配粮械兵于三军</li>
          <li><strong>铸鼎定鼎</strong> — 拼图组装，拼合鼎片重铸镇国之宝</li>
          <li><strong>点兵升将</strong> — 2048合成，同阶兵卒合为更高级将</li>
          <li><strong>箭雨齐射</strong> — 祖玛消除，同色敌兵相撞自溃</li>
          <li><strong>竹简牌局</strong> — 牌九博弈，竹简为牌论道博弈</li>
          <li><strong>铁匠锻兵</strong> — 合成时间，铜锡合炼为青铜精钢</li>
          <li><strong>烽火传信</strong> — 节奏连击，精准击键点燃烽火台</li>
          <li><strong>连横破纵</strong> — 卡牌策略，以牌会纵横之局</li>
          <li><strong>诸侯争霸</strong> — 棋盘策略，落子夹击翻城邑</li>
        </ul>
      </div>
    </div>
  );
}
