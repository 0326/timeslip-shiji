import type { EventBus } from "./eventBus";
import type { GameSystem, SettingsState, SystemContext } from "./types";
import { DEFAULT_SETTINGS } from "./types";

export class SettingsSystem implements GameSystem {
  state: SettingsState = { ...DEFAULT_SETTINGS };
  private bus: EventBus;
  /** SettingsDialog open/close state (UI layer reads this). */
  _dialogOpen = false;

  constructor(ctx: SystemContext) {
    this.bus = ctx.bus;
  }

  /** Convenience getter — returns a readonly view of settings (UI calls this). */
  get values(): Readonly<SettingsState> {
    return this.state;
  }

  set<K extends keyof SettingsState>(key: K, value: SettingsState[K]): void {
    // Bounds & type guards so callers can be sloppy
    if (typeof this.state[key] === "number" && typeof value === "number") {
      const num = value as number;
      if (/(volume)/.test(String(key))) value = Math.max(0, Math.min(1, num)) as SettingsState[K];
      if (/(speed_ms)/.test(String(key))) value = Math.max(0, num) as SettingsState[K];
    }
    this.state = { ...this.state, [key]: value };
    // Sync aliases
    this.syncAliases(key);
    this.bus.emit("settings.changed", { key: String(key), value });
  }

  /** Apply a partial patch of settings in one shot — used by SettingsDialog onChange. */
  patch(patch: Partial<SettingsState>): void {
    let changed: Array<[string, unknown]> = [];
    const next: SettingsState = { ...this.state };
    for (const k of Object.keys(patch) as Array<keyof SettingsState>) {
      const v = patch[k];
      if (v === undefined) continue;
      if (typeof next[k] === "number" && typeof v === "number") {
        const num = v as number;
        if (/(volume)/.test(String(k))) { next[k] = Math.max(0, Math.min(1, num)) as SettingsState[typeof k]; continue; }
        if (/(speed_ms)/.test(String(k))) { next[k] = Math.max(0, num) as SettingsState[typeof k]; continue; }
      }
      next[k] = v;
      changed.push([String(k), v]);
    }
    this.state = next;
    // Sync all alias bidirectionally
    if (this.state.read_speed_ms !== this.state.text_speed_ms) {
      this.state.text_speed_ms = this.state.read_speed_ms;
    } else if (this.state.text_speed_ms !== this.state.read_speed_ms) {
      this.state.read_speed_ms = this.state.text_speed_ms;
    }
    if (this.state.auto_speed_ms && !this.state.auto_play_delay_sec) {
      this.state.auto_play_delay_sec = this.state.auto_speed_ms / 1000;
    } else if (this.state.auto_play_delay_sec && !this.state.auto_speed_ms) {
      this.state.auto_speed_ms = Math.round(this.state.auto_play_delay_sec * 1000);
    }
    if (this.state.strict_mode !== this.state.strict_death) {
      this.state.strict_death = this.state.strict_mode;
    }
    // Emit each changed key individually (for systems that listen per-key)
    for (const [k, v] of changed) this.bus.emit("settings.changed", { key: k, value: v });
    // Then emit a bulk patch event
    this.bus.emit("settings.patched", { patch });
  }

  get<K extends keyof SettingsState>(key: K): SettingsState[K] {
    return this.state[key];
  }

  /** Settings dialog open/close control. */
  open(): void {
    this._dialogOpen = true;
    this.bus.emit("settings.dialog.opened", {});
  }
  close(): void {
    this._dialogOpen = false;
    this.bus.emit("settings.dialog.closed", {});
  }
  isDialogOpen(): boolean {
    return this._dialogOpen;
  }

  /** Effective bgm volume (master × bgm) — UI or audio manager calls this. */
  effectiveBgmVolume(): number {
    return this.state.master_volume * this.state.bgm_volume;
  }

  effectiveSeVolume(): number {
    return this.state.master_volume * this.state.se_volume;
  }

  effectiveVoiceVolume(): number {
    return this.state.master_volume * this.state.voice_volume;
  }

  reset(): void {
    Object.keys(DEFAULT_SETTINGS).forEach((k) => {
      const key = k as keyof SettingsState;
      this.set(key, DEFAULT_SETTINGS[key]);
    });
  }

  serialize(): SettingsState {
    return { ...this.state };
  }

  restore(raw: unknown): void {
    if (!raw || typeof raw !== "object") {
      this.state = { ...DEFAULT_SETTINGS };
      return;
    }
    this.patch(raw as Partial<SettingsState>);
    // Ensure defaults fill in any holes
    this.state = { ...DEFAULT_SETTINGS, ...this.state };
  }

  // -------- internals --------
  private syncAliases(lastKey: keyof SettingsState): void {
    switch (lastKey) {
      case "read_speed_ms":
        if (this.state.text_speed_ms !== this.state.read_speed_ms)
          this.state.text_speed_ms = this.state.read_speed_ms;
        break;
      case "text_speed_ms":
        if (this.state.read_speed_ms !== this.state.text_speed_ms)
          this.state.read_speed_ms = this.state.text_speed_ms;
        break;
      case "auto_speed_ms":
        this.state.auto_play_delay_sec = this.state.auto_speed_ms / 1000;
        break;
      case "auto_play_delay_sec":
        this.state.auto_speed_ms = Math.round(this.state.auto_play_delay_sec * 1000);
        break;
      case "strict_mode":
        this.state.strict_death = this.state.strict_mode;
        break;
      case "strict_death":
        this.state.strict_mode = this.state.strict_death;
        break;
    }
  }
}
