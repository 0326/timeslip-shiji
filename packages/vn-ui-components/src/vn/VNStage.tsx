import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Position, StageEffectPayload, CharacterSpriteState } from "ink-vn-core";

export interface SpriteAsset {
  id: string;
  name?: string;
  /** Full-body image URL (transparent PNG preferred). */
  full?: string;
  /** Expression variants: expression key -> URL. */
  variants?: Record<string, string>;
  /** Fallback CSS gradient (used when image missing). */
  fallback?: { from: string; to: string };
  accent?: string;
}

export interface VNStageProps {
  background?: string;
  fallbackBg?: { from: string; to: string };
  sprites: CharacterSpriteState[];
  assets: Record<string, SpriteAsset>;
  effect?: StageEffectPayload | null;
  showSprites?: boolean;
  onEffectEnd?: () => void;
}

const posClass: Record<Position, string> = {
  left: "left",
  "center-left": "center-left",
  center: "center",
  "center-right": "center-right",
  right: "right",
};

export function VNStage({
  background, fallbackBg, sprites, assets, effect, showSprites = true, onEffectEnd,
}: VNStageProps): React.ReactElement {
  const [shake, setShake] = useState(false);
  const [flash, setFlash] = useState(false);
  const bgRef = useRef<string | undefined>();

  const bgStyle = useMemo<React.CSSProperties>(() => {
    if (background) {
      return { backgroundImage: `url("${background}")` };
    }
    if (fallbackBg) {
      return { background: `linear-gradient(180deg, ${fallbackBg.from}, ${fallbackBg.to})` };
    }
    return { background: "#0c0a08" };
  }, [background, fallbackBg]);

  useEffect(() => {
    if (bgRef.current !== background) {
      bgRef.current = background;
    }
  }, [background]);

  useEffect(() => {
    if (!effect) return;
    let fired = false;
    const done = () => {
      if (fired) return;
      fired = true;
      setShake(false);
      setFlash(false);
      onEffectEnd?.();
    };
    if (effect.shake) {
      setShake(true);
      window.setTimeout(() => setShake(false), 360);
    }
    if (effect.flash) {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 360);
    }
    if (effect.fadeMs && effect.fadeMs > 0) {
      window.setTimeout(done, effect.fadeMs + 50);
    } else if (effect.shake || effect.flash) {
      window.setTimeout(done, 400);
    } else {
      done();
    }
    return () => { fired = true; };
  }, [effect, onEffectEnd]);

  return (
    <div className="vn-render-surface">
      <div className={`vn-render-inner ${shake ? "shake" : ""} ${flash ? "flash" : ""}`} style={bgStyle}>
        {showSprites && sprites.map((s) => {
          const a = assets[s.id];
          const url = s.expression && a?.variants?.[s.expression]
            ? a.variants[s.expression]
            : a?.full;
          return (
            <SpriteLayer
              key={s.id}
              pos={s.pos}
              visible={s.visible !== false}
              active={s.active}
              imageUrl={url}
              glyph={a?.name?.charAt(0) ?? s.id.charAt(0).toUpperCase()}
              accent={a?.accent}
              fallback={a?.fallback}
            />
          );
        })}
      </div>
    </div>
  );
}

function SpriteLayer({
  pos, visible, active, imageUrl, glyph, accent, fallback,
}: {
  pos: Position;
  visible: boolean;
  active: boolean;
  imageUrl?: string;
  glyph: string;
  accent?: string;
  fallback?: { from: string; to: string };
}): React.ReactElement {
  const cls = `vn-sprite ${posClass[pos]} ${visible ? "" : "hidden"}`;
  const style: React.CSSProperties = {
    filter: active ? "brightness(1.05) saturate(1.05)" : "brightness(0.75) saturate(0.9)",
    transform: active ? "scale(1.03)" : undefined,
  };
  return (
    <div className={cls} style={style}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={glyph}
          draggable={false}
          style={{ height: "100%", width: "auto", display: "block", objectFit: "contain" }}
        />
      ) : (
        <div style={{
          width: 220, height: "100%",
          background: fallback
            ? `linear-gradient(180deg, ${fallback.from}, ${fallback.to})`
            : "linear-gradient(180deg, #2a2018, #0c0a08)",
          borderTopLeftRadius: 110, borderTopRightRadius: 110,
          border: "1px solid var(--vn-border)",
          display: "flex", alignItems: "flex-start", justifyContent: "center",
          paddingTop: 48,
        }}>
          <div style={{
            fontFamily: "var(--vn-font-serif)", fontWeight: 900,
            fontSize: 96, color: accent ?? "var(--vn-accent)", opacity: 0.85,
          }}>
            {glyph}
          </div>
        </div>
      )}
    </div>
  );
}
