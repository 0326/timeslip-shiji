import type { BgmTrack, GameContent } from "vn-content-schemas";
import type { SystemContext } from "./types";

/**
 * Very small audio manager abstraction — plays BGM and SE with volume control.
 * No WebAudio graph required; we wrap HTMLAudioElement so SSR-safe consumers
 * can replace this with a no-op.
 *
 * The manager accepts a SettingsSystem-style getter so it can read effective
 * volumes on every play() call (user can tune mid-play).
 */
export interface AudioEnv {
  createAudio?: (src: string) => {
    play(): Promise<unknown> | unknown;
    pause(): void;
    currentTime: number;
    volume: number;
    loop: boolean;
    muted: boolean;
  };
  now(): number;
  /** Resolve a relative BGM/SE path to a URL or absolute path. */
  resolvePath?(relPath: string): string;
}

export class AudioManager {
  private bgmAudio: ReturnType<NonNullable<AudioEnv["createAudio"]>> | null = null;
  private currentBgmId: string | null = null;
  private seQueue = new Set<ReturnType<NonNullable<AudioEnv["createAudio"]>>>();
  private content: GameContent;
  private env: Required<AudioEnv>;
  private settingsEffective: () => { bgm: number; se: number; muted?: boolean };

  constructor(
    ctx: SystemContext,
    env: AudioEnv,
    settingsEffective: () => { bgm: number; se: number; muted?: boolean }
  ) {
    this.content = ctx.content;
    this.env = {
      now: env.now ?? (() => Date.now()),
      resolvePath: env.resolvePath ?? ((p) => p),
      createAudio:
        env.createAudio ??
        (() => {
          // No-op fallback when no DOM: never plays.
          return {
            play: () => Promise.resolve(),
            pause: () => {},
            currentTime: 0,
            volume: 1,
            loop: false,
            muted: false,
          };
        }),
    };
    this.settingsEffective = settingsEffective;
  }

  private findBgm(id: string): BgmTrack | undefined {
    return this.content.bgm.tracks.find((t) => t.id === id);
  }

  playBgm(id: string | null): void {
    if (id === this.currentBgmId) return;
    if (this.bgmAudio) {
      try { this.bgmAudio.pause(); } catch { /* ignore */ }
      this.bgmAudio = null;
    }
    this.currentBgmId = id;
    if (!id) return;
    const track = this.findBgm(id);
    if (!track) return;
    const audio = this.env.createAudio(this.env.resolvePath(track.path));
    audio.loop = true;
    audio.volume = this.settingsEffective().bgm;
    audio.muted = this.settingsEffective().muted ?? false;
    const p = audio.play();
    if (p && typeof (p as Promise<unknown>).then === "function") {
      (p as Promise<unknown>).catch(() => { /* autoplay block — OK */ });
    }
    this.bgmAudio = audio;
  }

  stopBgm(): void {
    this.playBgm(null);
  }

  /** Apply new volume from SettingsSystem changes — called on every settings.changed bgm_volume/master_volume. */
  refreshBgmVolume(): void {
    if (this.bgmAudio) {
      const v = this.settingsEffective();
      this.bgmAudio.volume = v.bgm;
      this.bgmAudio.muted = v.muted ?? false;
    }
  }

  playSe(pathOrId: string): void {
    // Prefer lookup by id; fallback to direct path
    const track = this.content.bgm.tracks.find((t) => t.id === pathOrId);
    const src = track ? this.env.resolvePath(track.path) : this.env.resolvePath(pathOrId);
    const audio = this.env.createAudio(src);
    audio.volume = this.settingsEffective().se;
    audio.muted = this.settingsEffective().muted ?? false;
    audio.loop = false;
    this.seQueue.add(audio);
    const onDone = () => this.seQueue.delete(audio);
    const p = audio.play();
    if (p && typeof (p as Promise<unknown>).then === "function") {
      (p as Promise<unknown>).then(onDone, onDone);
    } else {
      onDone();
    }
  }
}
