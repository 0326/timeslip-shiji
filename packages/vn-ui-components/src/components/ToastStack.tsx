import React, { useCallback, useEffect, useState } from "react";
import type { GameSystems } from "vn-game-systems";
import { Toast } from "./Primitives";

export interface ToastItem { id: number; title: string; body?: string; icon?: string; }

/**
 * Hook version: independent local toast list with manual push().
 * Works without game systems (for VNScreen which wants direct push calls).
 */
export function useToastStack(): {
  items: ToastItem[];
  pushToast: (t: Omit<ToastItem, "id">) => void;
} {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = React.useRef(0);
  const pushToast = useCallback((t: Omit<ToastItem, "id">) => {
    const id = ++counter.current;
    setItems((prev) => [...prev, { ...t, id }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }, 3200);
  }, []);
  return { items, pushToast };
}

/**
 * ToastStack: renders transient toasts from items array.
 * Use with either:
 *   - useToastStack() hook (local push API)
 *   - GameSystems bus subscription (via <ToastStack systems={...} />)
 */
export function ToastStack({
  items, systems,
}: { items?: ToastItem[]; systems?: GameSystems }): React.ReactElement {
  // When items prop is provided, use it directly.
  // Otherwise subscribe to systems.bus events and drive internally.
  const hookItems = useToastStackInternal(systems);
  const list = items ?? hookItems;
  return (
    <div className="vn-toast-stack">
      {list.map((t) => <Toast key={t.id} {...t} />)}
    </div>
  );
}

function useToastStackInternal(systems?: GameSystems): ToastItem[] {
  const [items, setItems] = useState<ToastItem[]>([]);
  const counter = React.useRef(0);
  useEffect(() => {
    if (!systems) return;
    const push = (t: Omit<ToastItem, "id">) => {
      const id = ++counter.current;
      setItems((prev) => [...prev, { ...t, id }]);
      window.setTimeout(() => {
        setItems((prev) => prev.filter((x) => x.id !== id));
      }, 3200);
    };
    const unsubs = [
      systems.bus.on("achievement.unlocked", (p) =>
        push({ icon: "🏆", title: `成就解锁：${p.name}`, body: `${"★".repeat(p.rarity ?? 1)} · id:${p.id}` })
      ),
      systems.bus.on("save.saved", () => push({ icon: "💾", title: "已保存" })),
      systems.bus.on("character.unlocked", (p) =>
        push({ icon: "📖", title: `人物解锁：${p.name}`, body: p.id })
      ),
      systems.bus.on("death.recorded", (p) =>
        push({ icon: "薨", title: "死亡图鉴新增", body: p.title })
      ),
      systems.bus.on("classic.unlocked", (p) =>
        push({ icon: "📜", title: "典籍新增章篇", body: p.chapter_id })
      ),
    ];
    return () => { unsubs.forEach((u) => u()); };
  }, [systems]);
  return items;
}
