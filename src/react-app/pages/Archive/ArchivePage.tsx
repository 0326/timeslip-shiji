import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./Archive.css";
import { CHARACTERS } from "../../data/characters";
import {
  fetchFigureList,
  type MainFigure,
} from "../../services/mainProjectApi";
import {
  getArchivePortrait,
  getArchiveMeta,
  SPRITES,
  ARCHIVE_SPRITE_IDS,
  SPRITE_DYNASTY_MAP,
  SPRITE_IDENTITY_MAP,
} from "../../data/sceneAssets";
import { ARCHIVE_BIOS } from "../../data/sceneAssets/archiveBios";

const SHIJI = "shiji";
const PAGE_SIZE = 24;
const FILTER_TOP_N = 12; // 筛选带只展示 top N 个朝代/身份

// 排除系统角色（非历史人物），不出现在图鉴中
const EXCLUDED_SPRITE_IDS = new Set(["qingyue"]);

// 《史记》涵盖范围：黄帝 — 汉武帝。朝代筛选仅保留此范围内的朝代，
// 排除三国及以后（防止筛选聚合跨书带入非史记朝代）。
const SHIJI_DYNASTY_KEYWORDS = [
  "上古",
  "远古",
  "五帝",
  "黄帝",
  "传说",
  "夏",
  "商",
  "殷",
  "周",
  "春秋",
  "战国",
  "秦",
  "楚汉",
  "汉",
  "西汉",
  "前汉",
  "汉初",
  "汉武",
  "西周",
  "诸子",
  "群像",
];
const NON_SHIJI_DYNASTY_KEYWORDS = [
  "东汉",
  "后汉",
  "三国",
  "蜀",
  "吴",
  "晋",
  "南北",
  "隋",
  "唐",
  "五代",
  "宋",
  "辽",
  "金",
  "元",
  "明",
  "清",
  "民国",
];
function isShijiDynasty(v: string): boolean {
  if (NON_SHIJI_DYNASTY_KEYWORDS.some((k) => v.includes(k))) return false;
  return SHIJI_DYNASTY_KEYWORDS.some((k) => v.includes(k));
}

/** 朝代时间线顺序（值越小越早），用于时序排序 */
const DYNASTY_ORDER: Record<string, number> = {
  五帝: 1,
  夏: 2,
  商: 3,
  西周: 4,
  春秋: 5,
  战国: 6,
  诸子: 6, // 诸子百家主要活跃于春秋战国
  秦: 7,
  楚汉: 8,
  汉初: 9,
  汉武: 10,
  群像: 11, // 跨时代，置末
};

/** 按身份自动分级（1-5 星），用于本地兜底星级 */
function getStarByIdentity(id: string, identity: string): number {
  if (id === "qingyue") return 5;
  switch (identity) {
    case "帝王":
      return 4;
    case "将相":
    case "谋士":
    case "文人":
    case "刺客":
      return 3;
    case "后妃":
    case "游侠":
    case "异族":
    case "宦官":
    case "外戚":
      return 2;
    default:
      return 2;
  }
}

/** 规范化角色名：去除空格、称号前后缀等，用于按名去重。
 *  仅剥离明确的爵位/尊称后缀（公侯伯子男帝皇妃后王），不剥离国名前缀（避免误合并如"商鞅"→"鞅"）。 */
function normalizeName(name: string): string {
  return name
    .replace(/[\s·\-_]/g, "")
    .replace(/^[王公侯伯子男帝皇妃后太子太傅丞相将军大夫]+\s*/, "")
    .replace(/[公侯伯男帝皇妃后王]$/, "")
    .trim();
}

/**
 * 远程API角色ID → 本地SPRITES ID 映射。
 * 远程API使用不同的ID命名规则（如 dayu vs yu, shangtang vs tang），
 * 通过此映射将远程角色合并到本地角色，避免图鉴中出现重复角色。
 */
const REMOTE_ID_MAP: Record<string, string> = {
  // 夏
  dayu: "yu",
  // 商
  shangtang: "tang",
  fuyue: "fushuo",
  "daji-shang": "daji",
  "wuding-shang": "wuding",
  // 西周
  zhaogongshi: "shaogong",
  zhouyouwang: "youwang",
  zhouwuwang: "wuwang",
  jiangziya: "jiangshang",
  // 春秋
  jiezitui: "jietui",
  baixixi: "baili",
  "liji-jinxian": "lij",
  baoshuya: "baoshu",
  qihuangong: "qihuan",
  qinmugong: "qinmu",
  jinwengong: "chonger",
  // 战国
  "weiwuji-xinling": "xinlingjun",
  "tianwen-mengchang": "mengchangjun",
  "zhaosheng-pingyuan": "pingyuanjun",
  "huangxie-chunshen": "chunshenjun",
  fanwuji: "fanwuqi",
  fansui: "fanju",
  caoze: "caize",
  yantaizidan: "taizidan",
  // 诸子
  mozi: "mozhai",
};

/**
 * 图鉴页：展示全量史记人物，激活的高亮、未激活置灰。
 * 设计系统 v2：顶部筛选带（pill 组 + 搜索 + 排序 + 统计胶囊）+ game-card 网格 + 分页加载。
 *
 * 数据策略（本地优先）：
 * 1. 以本地 SPRITES 注册表为主（ID 唯一，无重复）
 * 2. 拉取远程 API 数据进行补充（bio、star、identity、gender 等）
 * 3. 远程有但本地无的史记人物也加入列表
 * 4. 按规范化名称去重（同一人物不同 ID 只保留一条）
 * 5. 朝代标签：优先远程 → 回退本地 SPRITE_DYNASTY_MAP
 * 这样确保：1) 无重复角色  2) 标签数量与实际展示数量一致
 */
export function ArchivePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromHere = location.pathname + location.search + location.hash;

  // 全量去重后的数据
  const [allItems, setAllItems] = useState<MainFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 筛选 / 搜索 / 排序
  const [dynasty, setDynasty] = useState<string>("");
  const [identity, setIdentity] = useState<string>("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"era" | "star">("era");

  // 客户端分页
  const [page, setPage] = useState(1);

  // 一次性拉取并合并数据
  useEffect(() => {
    setLoading(true);
    setError(null);
    setPage(1);

    // Step 1: 从本地 SPRITES 构建基础列表（ID 唯一，排除系统角色）
    const localItems: MainFigure[] = ARCHIVE_SPRITE_IDS
      .filter((id) => !EXCLUDED_SPRITE_IDS.has(id))
      .map((id) => {
      const sp = SPRITES[id];
      const localDynasty = SPRITE_DYNASTY_MAP[id] || "";
      const localIdentity = SPRITE_IDENTITY_MAP[id] || "";
      return {
        id,
        name: sp.name,
        aliases: [],
        birth_year: null,
        death_year: null,
        dynasty: localDynasty,
        identity: localIdentity,
        bio_summary: ARCHIVE_BIOS[id] || "",
        keyword_tags: [],
        avatar_icon: "",
        avatar_url: null,
        avatar: null,
        gender: "unknown" as const,
        star: getStarByIdentity(id, localIdentity),
        src_book: SHIJI,
        src_juan: null,
        src_chapter: null,
      };
    });

    // Step 2: 拉取远程 API 数据进行合并
    fetchFigureList({
      book: SHIJI,
      page: 1,
      limit: 500,
    })
      .then((res) => {
        if (!res || !res.items || res.items.length === 0) {
          // 远程不可用，仅用本地数据
          // 按名称去重（本地 ID 已唯一，但仍可能有同名不同 ID）
          setAllItems(dedupByName(localItems));
          return;
        }

        // 远程数据按 ID 去重
        const remoteById = new Map<string, MainFigure>();
        for (const it of res.items) {
          if (!remoteById.has(it.id)) {
            remoteById.set(it.id, it);
          }
        }

        // 构建反向映射：本地ID → 远程ID（用于查找远程ID不同但同一人物的记录）
        const localToRemoteId = new Map<string, string>();
        for (const [rId, lId] of Object.entries(REMOTE_ID_MAP)) {
          localToRemoteId.set(lId, rId);
        }

        // Step 3: 合并——本地为基础，远程补充
        const merged: MainFigure[] = [];
        const usedRemoteIds = new Set<string>();

        for (const local of localItems) {
          // 直接ID匹配 或 通过REMOTE_ID_MAP匹配
          let remote = remoteById.get(local.id);
          let matchedRemoteId = local.id;
          if (!remote) {
            const mappedRid = localToRemoteId.get(local.id);
            if (mappedRid) {
              remote = remoteById.get(mappedRid);
              matchedRemoteId = mappedRid;
            }
          }
          if (remote) {
            usedRemoteIds.add(matchedRemoteId);
            // 合并：保留本地ID（确保CG立绘能匹配），远程数据补充bio/star/identity等
            const dynasty =
              remote.dynasty && isShijiDynasty(remote.dynasty)
                ? remote.dynasty
                : local.dynasty || remote.dynasty || "";
            // 身份标签：远程优先，本地兜底
            const identity = remote.identity || local.identity || "";
            merged.push({
              ...local,
              ...remote,
              id: local.id, // 强制使用本地ID（CG立绘注册表匹配）
              dynasty,
              identity,
              name: local.name, // 本地名称优先
              bio_summary: remote.bio_summary || local.bio_summary,
              // 星级：远程有效(>0)时用远程，否则保留本地按身份分级
              star: remote.star > 0 ? remote.star : local.star,
              // 不使用远程avatar（远程图为透明PNG线稿）
              avatar: null,
              avatar_url: null,
            });
          } else {
            // 本地有、远程无：用本地数据
            merged.push(local);
          }
        }

        // Step 4: 添加远程有、本地无的史记人物
        for (const [id, remote] of remoteById) {
          if (usedRemoteIds.has(id)) continue;
          if (REMOTE_ID_MAP[id]) continue; // 跳过已通过映射合并的远程ID
          // 只添加有有效史记朝代的
          if (remote.dynasty && isShijiDynasty(remote.dynasty)) {
            // 清除远程avatar（不使用远程透明立绘，由glyph兜底）
            merged.push({
              ...remote,
              // 星级兜底：远程无有效星级时按身份分级
              star: remote.star > 0 ? remote.star : getStarByIdentity(id, remote.identity || ""),
              avatar: null,
              avatar_url: null,
            });
          }
        }

        // Step 5: 按规范化名称去重
        const deduped = dedupByName(merged);
        setAllItems(deduped);
      })
      .catch(() => {
        // 远程失败，仅用本地数据
        setAllItems(dedupByName(localItems));
      })
      .finally(() => setLoading(false));
  }, []);


  // 本地 sprite ID 集合（用于判断角色是否有本地立绘）
  const localSpriteIdSet = useMemo(
    () =>
      new Set(
        ARCHIVE_SPRITE_IDS.filter((id) => !EXCLUDED_SPRITE_IDS.has(id)),
      ),
    [],
  );

  /** 按规范化名称去重：同一人物不同 ID 只保留一条，优先保留有本地立绘的 */
  function dedupByName(items: MainFigure[]): MainFigure[] {
    const nameToItem = new Map<string, MainFigure>();
    const result: MainFigure[] = [];

    for (const it of items) {
      const normalized = normalizeName(it.name);
      const allNames = [
        normalized,
        ...(it.aliases || []).map((a) => normalizeName(a)),
      ].filter((n) => n.length > 0);

      // 检查是否已存在同名项
      let existingEntry: { idx: number; item: MainFigure } | null = null;
      for (const name of allNames) {
        const existing = nameToItem.get(name);
        if (existing) {
          const idx = result.indexOf(existing);
          if (idx >= 0) {
            existingEntry = { idx, item: existing };
            break;
          }
        }
      }

      if (existingEntry) {
        const old = existingEntry.item;
        // 评分：有本地立绘的角色加 100 分（确保不被远程角色替换）
        const oldScore =
          (old.bio_summary ? 2 : 0) +
          (old.identity ? 1 : 0) +
          old.star * 0.1 +
          (localSpriteIdSet.has(old.id) ? 100 : 0);
        const newScore =
          (it.bio_summary ? 2 : 0) +
          (it.identity ? 1 : 0) +
          it.star * 0.1 +
          (localSpriteIdSet.has(it.id) ? 100 : 0);

        if (newScore > oldScore) {
          // 新项更优：保留新项 ID（可能有立绘），合并旧项的补充数据
          const merged: MainFigure = {
            ...it,
            bio_summary: it.bio_summary || old.bio_summary,
            identity: it.identity || old.identity,
            star: it.star || old.star,
            dynasty: it.dynasty || old.dynasty,
            aliases: [
              ...new Set([
                ...(it.aliases || []),
                ...(old.aliases || []),
              ]),
            ],
            gender: it.gender !== "unknown" ? it.gender : old.gender,
            birth_year: it.birth_year ?? old.birth_year,
            death_year: it.death_year ?? old.death_year,
          };
          result[existingEntry.idx] = merged;
          for (const name of allNames) {
            nameToItem.set(name, merged);
          }
          // 删除旧项的名称映射
          const oldNames = [
            normalizeName(old.name),
            ...(old.aliases || []).map((a) => normalizeName(a)),
          ];
          for (const oldName of oldNames) {
            if (nameToItem.get(oldName) === old) {
              nameToItem.delete(oldName);
            }
          }
          // 重新添加合并项的映射
          for (const name of allNames) {
            nameToItem.set(name, merged);
          }
        } else {
          // 旧项更优：保留旧项，合并新项的补充数据
          const merged: MainFigure = {
            ...old,
            bio_summary: old.bio_summary || it.bio_summary,
            identity: old.identity || it.identity,
            star: old.star || it.star,
            dynasty: old.dynasty || it.dynasty,
            aliases: [
              ...new Set([
                ...(old.aliases || []),
                ...(it.aliases || []),
              ]),
            ],
            gender: old.gender !== "unknown" ? old.gender : it.gender,
            birth_year: old.birth_year ?? it.birth_year,
            death_year: old.death_year ?? it.death_year,
          };
          result[existingEntry.idx] = merged;
          for (const name of allNames) {
            nameToItem.set(name, merged);
          }
        }
      } else {
        // 新项，添加
        result.push(it);
        for (const name of allNames) {
          nameToItem.set(name, it);
        }
      }
    }

    return result;
  }

  // 搜索 debounce
  const [qInput, setQInput] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setQ(qInput.trim()), 350);
    return () => clearTimeout(t);
  }, [qInput]);

  // 朝代筛选选项（从最终数据计算，确保数量准确）
  const dynastyOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of allItems) {
      if (it.dynasty) {
        counts.set(it.dynasty, (counts.get(it.dynasty) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, FILTER_TOP_N);
  }, [allItems]);

  // 身份筛选选项（从最终数据计算）
  const identityOptions = useMemo(() => {
    const counts = new Map<string, number>();
    for (const it of allItems) {
      if (it.identity) {
        counts.set(it.identity, (counts.get(it.identity) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, FILTER_TOP_N);
  }, [allItems]);

  // 客户端筛选 + 排序
  const processedItems = useMemo(() => {
    let items = allItems;

    // 朝代筛选
    if (dynasty) {
      items = items.filter((it) => it.dynasty === dynasty);
    }
    // 身份筛选
    if (identity) {
      items = items.filter((it) => it.identity === identity);
    }
    // 搜索
    if (q) {
      const ql = q.toLowerCase();
      items = items.filter(
        (it) =>
          it.name?.toLowerCase().includes(ql) ||
          it.aliases?.some((a) => a.toLowerCase().includes(ql)) ||
          it.bio_summary?.toLowerCase().includes(ql),
      );
    }

    // 排序
    items = [...items];
    if (sort === "star") {
      // 星级降序，同级按名称排序
      items.sort(
        (a, b) => b.star - a.star || (a.name || "").localeCompare(b.name || ""),
      );
    } else {
      // 时序：按朝代时间线顺序，同朝代内按出生年份（如有）
      const dynastyOrder = (d: string) => DYNASTY_ORDER[d] ?? 99;
      items.sort((a, b) => {
        const da = dynastyOrder(a.dynasty || "");
        const db = dynastyOrder(b.dynasty || "");
        if (da !== db) return da - db;
        return (a.birth_year ?? 9999) - (b.birth_year ?? 9999);
      });
    }

    return items;
  }, [allItems, dynasty, identity, q, sort]);

  // 筛选条件变化时重置页码
  useEffect(() => {
    setPage(1);
  }, [dynasty, identity, q, sort]);

  // 客户端分页：累加展示（无限滚动），而非替换当前页
  const visibleItems = useMemo(() => {
    return processedItems.slice(0, page * PAGE_SIZE);
  }, [processedItems, page]);

  const totalShiji = allItems.length;
  const hasMore = page * PAGE_SIZE < processedItems.length;

  // 加载更多（客户端分页）
  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  // 哨兵元素的 IntersectionObserver：用 callback ref 管理生命周期，
  // 避免每次 render 都新建 observer 导致疯狂级联触发。
  const ioRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (el: HTMLDivElement | null) => {
      // 卸载或重用前先断开旧 observer，防止泄漏与重复触发
      if (ioRef.current) {
        ioRef.current.disconnect();
        ioRef.current = null;
      }
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) handleLoadMore();
        },
        { rootMargin: "200px" },
      );
      io.observe(el);
      ioRef.current = io;
    },
    [handleLoadMore],
  );

  return (
    <div className="archive-page">
      {/* 顶部筛选带：朝代 / 身份 pill 组 + 搜索 + 排序 + 统计 */}
      <div className="archive-toolbar">
        <div className="archive-filter-row">
          <span className="archive-filter-label">朝代</span>
          <button
            className={`pill ${dynasty === "" ? "active" : ""}`}
            onClick={() => setDynasty("")}
          >
            全部
          </button>
          {dynastyOptions.map((d) => (
            <button
              key={d.value}
              className={`pill ${dynasty === d.value ? "active" : ""}`}
              onClick={() => setDynasty(d.value)}
              title={d.value}
            >
              <span>{d.value}</span>
              <span className="cnt">{d.count}</span>
            </button>
          ))}
        </div>

        <div className="archive-filter-row">
          <span className="archive-filter-label">身份</span>
          <button
            className={`pill ${identity === "" ? "active" : ""}`}
            onClick={() => setIdentity("")}
          >
            全部
          </button>
          {identityOptions.map((it) => (
            <button
              key={it.value}
              className={`pill ${identity === it.value ? "active" : ""}`}
              onClick={() => setIdentity(it.value)}
            >
              <span>{it.value}</span>
              <span className="cnt">{it.count}</span>
            </button>
          ))}
        </div>

        <div className="archive-filter-row archive-toolbar-tail">
          <div className="archive-search">
            <Search className="archive-search-icon" size={15} />
            <input
              type="text"
              placeholder="搜索姓名 / 字号 / 简介"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
            />
          </div>
          <div className="archive-sort-group">
            <button
              className={`pill ${sort === "era" ? "active" : ""}`}
              onClick={() => setSort("era")}
            >
              时序
            </button>
            <button
              className={`pill ${sort === "star" ? "active" : ""}`}
              onClick={() => setSort("star")}
            >
              星级
            </button>
          </div>
          <span className="panel-stat archive-stat">
            <b>{totalShiji || CHARACTERS.length}</b>
            <span>史记人物</span>
          </span>
        </div>
      </div>

      {loading ? (
        <div className="archive-loading">正在翻阅史册…</div>
      ) : error ? (
        <div className="archive-empty">
          {error}
          <div className="archive-empty-sub">
            主项目暂不可用，仅展示本地角色
          </div>
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="archive-empty">
          无符合条件的人物
          <div className="archive-empty-sub">尝试更换筛选或搜索词</div>
        </div>
      ) : (
        <div className="archive-grid">
          {visibleItems.map((fig) => (
            <ArchiveCard
              key={fig.id}
              figure={fig}
              onClick={() =>
                navigate(`/archive/${fig.id}`, {
                  state: {
                    ids: processedItems.map((i) => i.id),
                    from: fromHere,
                  },
                })
              }
            />
          ))}
        </div>
      )}

      {/* 加载更多（客户端分页） */}
      {!loading && !error && hasMore && (
        <div
          className="archive-load-sentinel"
          ref={sentinelRef}
        >
          <span style={{ fontSize: 12, color: "var(--color-muted)" }}>
            下拉加载更多
          </span>
        </div>
      )}
    </div>
  );
}

/** 图鉴卡片：.game-card 基座 + 身份色 --accent（hover 抬升/灯带由基座提供） */
function ArchiveCard({
  figure,
  onClick,
}: {
  figure: MainFigure;
  onClick: () => void;
}) {
  // 仅使用本地图鉴CG立绘；无CG时用glyph兜底（不使用远程API avatar，避免透明线稿立绘）
  const localPortrait = getArchivePortrait(figure.id);
  const avatarSrc = localPortrait ?? null;
  const localMeta = getArchiveMeta(figure.id);
  const glyph = localMeta?.glyph ?? figure.name?.charAt(0) ?? figure.id.charAt(0).toUpperCase();
  const displayName = localMeta?.name ?? figure.name;

  return (
    <article
      className="game-card archive-card is-owned"
      data-identity={figure.identity || undefined}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      <div className="archive-card-art">
        {!avatarSrc && <span className="archive-card-glyph">{glyph}</span>}
        {avatarSrc && (
          <img
            src={avatarSrc}
            alt={displayName}
            loading="lazy"
            onError={(e) => {
              // 头像加载失败，露出 glyph
              (e.currentTarget as HTMLImageElement).style.display = "none";
              const sib = (e.currentTarget as HTMLImageElement)
                .previousElementSibling;
              if (sib) (sib as HTMLElement).style.display = "flex";
            }}
          />
        )}
        {figure.star >= 1 && (
          <span
            className="archive-card-star"
            data-star={figure.star}
            title={`${figure.star} 星`}
          >
            {"★".repeat(figure.star)}
          </span>
        )}
        {figure.dynasty && (
          <span className="archive-card-badge">{figure.dynasty}</span>
        )}
        {figure.gender === "female" && (
          <span className="archive-card-gender" title="女">
            ♀
          </span>
        )}
        {figure.gender === "male" && (
          <span className="archive-card-gender male" title="男">
            ♂
          </span>
        )}
      </div>
      <div className="archive-card-body">
        <div className="archive-card-name-row">
          <span className="archive-card-name">{displayName}</span>
          {figure.identity && (
            <span className="archive-card-ident">{figure.identity}</span>
          )}
        </div>
        {figure.bio_summary && (
          <p className="archive-card-bio">{figure.bio_summary}</p>
        )}
      </div>
    </article>
  );
}
