import { useCallback, useEffect, useRef } from "react";
import { resolveBgm } from "../data/bgm";

const FADE_MS = 2000;
const TARGET_VOLUME = 0.35;
const STORAGE_KEY = "cysj-bgm";
const CDN_FALLBACK = {
	danger: "https://freesound-down.audiodown.com:3321/preview?file=Inf%2FCinematic+Tense+Dramatic+by+Infraction+%5BNo+Copyright+Music%5D+_+Diabolus.mp3",
	sorrow: "https://freesound-down.audiodown.com:3321/preview?file=FTUM%2FSad+Puppy+-+Brave.mp3",
};

interface BgmAudio {
	audio: HTMLAudioElement;
	trackId: string;
	volume: number;
}

function readEnabled(): boolean {
	try {
		return localStorage.getItem(STORAGE_KEY) !== "off";
	} catch {
		return true;
	}
}

interface UseBgmPlayerOptions {
	enabled?: boolean;
}

/** BGM 播放器：双音频交叉淡入淡出，无缝切换 */
export function useBgmPlayer(opts: UseBgmPlayerOptions = {}) {
	const activeRef = useRef<BgmAudio | null>(null);
	const nextRef = useRef<BgmAudio | null>(null);
	const fadeRafRef = useRef<number>(0);
	const pendingTrackRef = useRef<string>("");
	const triedFallbackRef = useRef<Set<string>>(new Set());
	const switchingRef = useRef<boolean>(false);
	const enabledRef = useRef<boolean>(opts.enabled ?? readEnabled());
	const lastTrackRef = useRef<string>("");
	const pendingInteractRef = useRef<Array<() => void>>([]);

	// 同步外部开关状态
	useEffect(() => {
		enabledRef.current = opts.enabled ?? readEnabled();
	}, [opts.enabled]);

	const crossFade = useCallback((from: BgmAudio | null, to: BgmAudio | null) => {
		cancelAnimationFrame(fadeRafRef.current);
		if (!to) return;

		const startFromVol = from?.volume ?? 0;
		const startToVol = to.volume;
		const startT = performance.now();

		const step = (now: number) => {
			const t = Math.min(1, (now - startT) / FADE_MS);
			const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

			if (from) {
				from.volume = Math.max(0, startFromVol * (1 - eased));
				from.audio.volume = from.volume;
			}
			to.volume = Math.min(TARGET_VOLUME, startToVol + (TARGET_VOLUME - startToVol) * eased);
			to.audio.volume = to.volume;

			if (t < 1) {
				fadeRafRef.current = requestAnimationFrame(step);
			} else {
				if (from) {
					from.audio.pause();
					from.audio.src = "";
				}
				activeRef.current = to;
				nextRef.current = null;
				switchingRef.current = false;
			}
		};
		fadeRafRef.current = requestAnimationFrame(step);
	}, []);

	const stopInternal = useCallback(() => {
		cancelAnimationFrame(fadeRafRef.current);
		if (activeRef.current) {
			activeRef.current.audio.pause();
			activeRef.current.audio.src = "";
			activeRef.current = null;
		}
		if (nextRef.current) {
			nextRef.current.audio.pause();
			nextRef.current.audio.src = "";
			nextRef.current = null;
		}
		switchingRef.current = false;
		pendingTrackRef.current = "";
		// 清理所有待处理的交互监听器，防止组件卸载后点击页面仍触发BGM
		while (pendingInteractRef.current.length > 0) {
			const cleanup = pendingInteractRef.current.pop();
			if (cleanup) cleanup();
		}
	}, []);

	const playWithUrl = useCallback(
		(trackId: string, url: string) => {
			lastTrackRef.current = trackId;
			if (!enabledRef.current) {
				stopInternal();
				return;
			}

			if (activeRef.current?.trackId === trackId) return;
			if (switchingRef.current && nextRef.current?.trackId === trackId) return;

			// 清理正在切换中的残留 audio，防止泄漏导致多个BGM同时播放
			if (switchingRef.current && nextRef.current) {
				nextRef.current.audio.pause();
				nextRef.current.audio.src = "";
				nextRef.current = null;
				switchingRef.current = false;
			}

			const audio = new Audio(url);
			audio.loop = true;
			audio.volume = 0;
			audio.preload = "auto";

			const newTrack: BgmAudio = { audio, trackId, volume: 0 };

			const startPlay = () => {
				audio.play().then(() => {
					switchingRef.current = true;
					nextRef.current = newTrack;
					crossFade(activeRef.current, newTrack);
				}).catch(() => {
					pendingTrackRef.current = trackId;
					const onInteract = () => {
						audio.play().then(() => {
							switchingRef.current = true;
							nextRef.current = newTrack;
							crossFade(activeRef.current, newTrack);
						}).catch(() => {});
						document.removeEventListener("click", onInteract);
						document.removeEventListener("keydown", onInteract);
						pendingInteractRef.current = pendingInteractRef.current.filter((f) => f !== cleanup);
					};
					const cleanup = () => {
						document.removeEventListener("click", onInteract);
						document.removeEventListener("keydown", onInteract);
					};
					pendingInteractRef.current.push(cleanup);
					document.addEventListener("click", onInteract, { once: true });
					document.addEventListener("keydown", onInteract, { once: true });
				});
			};

			audio.onerror = () => {
				const fallback = CDN_FALLBACK[trackId as keyof typeof CDN_FALLBACK];
				if (fallback && !triedFallbackRef.current.has(trackId)) {
					triedFallbackRef.current.add(trackId);
					playWithUrl(trackId, fallback);
				}
			};

			startPlay();
		},
		[crossFade, stopInternal],
	);

	const playTrack = useCallback(
		(trackId: string) => {
			if (!trackId) return;
			lastTrackRef.current = trackId;
			if (!enabledRef.current) {
				stopInternal();
				return;
			}
			if (activeRef.current?.trackId === trackId) return;
			if (switchingRef.current && nextRef.current?.trackId === trackId) return;
			const track = resolveBgm(trackId);
			if (!track.url) return;

			triedFallbackRef.current.delete(trackId);
			playWithUrl(trackId, track.url);
		},
		[playWithUrl, stopInternal],
	);

	useEffect(() => {
		const onInteract = () => {
			if (pendingTrackRef.current) {
				const track = pendingTrackRef.current;
				pendingTrackRef.current = "";
				playTrack(track);
			}
		};
		document.addEventListener("click", onInteract, { once: true });
		document.addEventListener("keydown", onInteract, { once: true });
		return () => {
			document.removeEventListener("click", onInteract);
			document.removeEventListener("keydown", onInteract);
		};
	}, [playTrack]);

	const stop = useCallback(() => {
		stopInternal();
	}, [stopInternal]);

	// 供用户交互（点击开关）时同步调用，避免 useEffect 异步执行被浏览器自动播放策略拦截
	const pause = useCallback(() => {
		enabledRef.current = false;
		stopInternal();
	}, [stopInternal]);

	const resume = useCallback(() => {
		enabledRef.current = true;
		if (lastTrackRef.current) {
			playTrack(lastTrackRef.current);
		}
	}, [playTrack]);

	// 响应外部 BGM 开关变化：关闭时立即停止，开启时重播最近曲目
	useEffect(() => {
		if (opts.enabled === undefined) return;
		if (opts.enabled) {
			if (lastTrackRef.current) {
				playTrack(lastTrackRef.current);
			}
		} else {
			stopInternal();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [opts.enabled]);

	useEffect(() => {
		return () => {
			stopInternal();
		};
	}, [stopInternal]);

	return { playTrack, stop, pause, resume };
}
