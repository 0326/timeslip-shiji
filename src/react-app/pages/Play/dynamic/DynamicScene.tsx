/**
 * DynamicScene —— VN 场景的动态背景层（Canvas2D 实现）。
 *
 * 用单张 Canvas 替换原 .vn-bg 静态层，叠加四层动态效果：
 *  1. 背景层：加载现有背景图或 CSS 渐变 fallback，叠加昼夜调色与 Ken Burns 微动
 *  2. 体积雾：径向渐变 + 噪声扰动，色温与浓度随 mood 平滑过渡
 *  3. 天气粒子：rain / snow / petals / firefly / embers / mist / storm（GPU 友好的批量绘制）
 *  4. 镜头微动：呼吸平移 + 震动衰减 + 推拉缩放
 *
 * 这一层是纯视觉氛围，不承载游戏逻辑；所有状态由 VNEngine 通过 props 注入。
 * 使用 Canvas2D 而非 WebGL，避免与 @cloudflare/vite-plugin 的 SSR 环境冲突。
 */
import { useEffect, useRef, useMemo } from "react";
import { resolveMood, type SceneMood, type Weather } from "./sceneMoods";

interface Props {
	/** 当前背景 key（与原 getBackground 一致） */
	backgroundKey: string;
	/** 背景图 URL（若有） */
	backgroundImage?: string;
	/** 背景渐变 CSS（图缺失时用） */
	backgroundCss?: string;
	/** 是否处于死亡覆盖态 */
	death?: boolean;
	/** 是否处于通关覆盖态 */
	cleared?: boolean;
	/** 触发震动（每次变化即震一次） */
	shakeKey?: string | number;
}

interface Particle {
	x: number;
	y: number;
	z: number; // 深度，影响大小与速度
	seed: number;
	phase: number;
}

interface WeatherConfig {
	count: number;
	color: string;
	size: number;
	/** 下落速度（y 正方向，像素/秒） */
	fall: number;
	/** 水平漂移幅度 */
	drift: number;
	/** 闪烁/呼吸系数（0=不闪） */
	flicker: number;
	/** 起始透明度 */
	opacity: number;
	/** 是否向上飘（embers） */
	rise: boolean;
	/** 形状：circle / line / soft */
	shape: "circle" | "line" | "soft";
}

const WEATHER_PRESETS: Record<Weather, WeatherConfig> = {
	clear: { count: 0, color: "#ffffff", size: 0, fall: 0, drift: 0, flicker: 0, opacity: 0, rise: false, shape: "circle" },
	rain: { count: 320, color: "rgba(180,200,235,0.55)", size: 1.2, fall: 620, drift: 80, flicker: 0, opacity: 0.55, rise: false, shape: "line" },
	snow: { count: 180, color: "rgba(245,248,255,0.9)", size: 2.8, fall: 48, drift: 40, flicker: 0, opacity: 0.9, rise: false, shape: "circle" },
	petals: { count: 60, color: "rgba(245,178,200,0.92)", size: 6, fall: 36, drift: 90, flicker: 0, opacity: 0.92, rise: false, shape: "circle" },
	firefly: { count: 36, color: "rgba(190,255,160,0.95)", size: 3.5, fall: 4, drift: 24, flicker: 1.0, opacity: 1.0, rise: false, shape: "circle" },
	embers: { count: 90, color: "rgba(255,130,50,0.95)", size: 2.2, fall: -28, drift: 40, flicker: 0.8, opacity: 0.95, rise: true, shape: "circle" },
	mist: { count: 24, color: "rgba(220,222,225,0.22)", size: 120, fall: 2, drift: 14, flicker: 0.15, opacity: 0.22, rise: false, shape: "soft" },
	storm: { count: 460, color: "rgba(165,180,210,0.6)", size: 1.4, fall: 780, drift: 160, flicker: 0, opacity: 0.6, rise: false, shape: "line" },
};

/** RGB 0-1 转 CSS rgb 字符串 */
function rgb(c: [number, number, number]): string {
	return `rgb(${Math.round(c[0] * 255)},${Math.round(c[1] * 255)},${Math.round(c[2] * 255)})`;
}

/** 平滑过渡的数值缓存 */
function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}
function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
	return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

export function DynamicScene({ backgroundKey, backgroundImage, backgroundCss: _backgroundCss, death, cleared, shakeKey }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const bgImgRef = useRef<HTMLImageElement | null>(null);
	const rafRef = useRef(0);

	// 平滑过渡的状态缓存（避免每帧 setState）
	const moodRef = useRef<SceneMood>(resolveMood(backgroundKey));
	const targetMoodRef = useRef<SceneMood>(resolveMood(backgroundKey));
	const shakeRef = useRef(0);
	const prevShakeKey = useRef(shakeKey);
	const particlesRef = useRef<Particle[]>([]);
	const startRef = useRef(performance.now());

	// 解析当前情绪：死亡/通关时覆盖
	const mood = useMemo<SceneMood>(() => {
		if (death) return { ...resolveMood(backgroundKey), ...DEATH_OVERRIDE };
		if (cleared) return { ...resolveMood(backgroundKey), ...CLEAR_OVERRIDE };
		return resolveMood(backgroundKey);
	}, [backgroundKey, death, cleared]);

	targetMoodRef.current = mood;

	// 震动触发
	useEffect(() => {
		if (shakeKey !== undefined && shakeKey !== prevShakeKey.current) {
			prevShakeKey.current = shakeKey;
			shakeRef.current = death ? 1.0 : 0.4;
		}
	}, [shakeKey, death]);

	// 加载背景图
	useEffect(() => {
		if (!backgroundImage) {
			bgImgRef.current = null;
			return;
		}
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.src = backgroundImage;
		img.onload = () => { bgImgRef.current = img; };
		img.onerror = () => { bgImgRef.current = null; };
	}, [backgroundImage]);

	// 主渲染循环
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		let dpr = Math.min(window.devicePixelRatio || 1, 2);
		let W = 0, H = 0;

		const resize = () => {
			dpr = Math.min(window.devicePixelRatio || 1, 2);
			W = canvas.clientWidth;
			H = canvas.clientHeight;
			canvas.width = W * dpr;
			canvas.height = H * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();
		window.addEventListener("resize", resize);

		// 初始化粒子池
		const initParticles = (weather: Weather) => {
			const preset = WEATHER_PRESETS[weather];
			const count = preset.count;
			const arr: Particle[] = [];
			for (let i = 0; i < count; i++) {
				arr.push({
					x: Math.random() * W,
					y: Math.random() * H,
					z: 0.4 + Math.random() * 0.6,
					seed: Math.random(),
					phase: Math.random() * Math.PI * 2,
				});
			}
			particlesRef.current = arr;
		};
		initParticles(mood.weather);

		// 当前实际渲染的 weather（用于检测切换）
		let currentWeather: Weather = mood.weather;

		const draw = (now: number) => {
			rafRef.current = requestAnimationFrame(draw);
			const t = (now - startRef.current) / 1000;
			const delta = Math.min(0.05, (now - (draw as any)._prev) / 1000 || 0.016);
			(draw as any)._prev = now;

			// 平滑过渡 mood
			const cur = moodRef.current;
			const tgt = targetMoodRef.current;
			const k = Math.min(1, delta * 1.6);
			const sm: SceneMood = {
				...tgt,
				skyColor: lerpColor(cur.skyColor, tgt.skyColor, k),
				groundColor: lerpColor(cur.groundColor, tgt.groundColor, k),
				fogColor: lerpColor(cur.fogColor, tgt.fogColor, k),
				fogDensity: lerp(cur.fogDensity, tgt.fogDensity, k),
				ambientIntensity: lerp(cur.ambientIntensity, tgt.ambientIntensity, k),
				keyLightIntensity: lerp(cur.keyLightIntensity, tgt.keyLightIntensity, k),
				keyLightColor: lerpColor(cur.keyLightColor, tgt.keyLightColor, k),
				cameraBreath: lerp(cur.cameraBreath, tgt.cameraBreath, k),
			};
			moodRef.current = sm;

			// 检测 weather 切换
			if (tgt.weather !== currentWeather) {
				currentWeather = tgt.weather;
				initParticles(currentWeather);
			}

			// 震动衰减
			shakeRef.current = Math.max(0, shakeRef.current - delta * 1.8);

			ctx.clearRect(0, 0, W, H);

			// ========== 1. 背景层 ==========
			// 镜头微动：呼吸 + 震动 + 推拉
			const breath = sm.cameraBreath;
			const bx = Math.sin(t * 0.18) * breath * 12;
			const by = Math.sin(t * 0.13 + 1.2) * breath * 8;
			const shakeAmt = shakeRef.current;
			const sx = (Math.sin(t * 47) + Math.sin(t * 71)) * shakeAmt * 10;
			const sy = (Math.sin(t * 53) + Math.sin(t * 83)) * shakeAmt * 8;
			const zoom = death ? 1.08 + Math.sin(t * 0.2) * 0.02 : 1.0 + Math.sin(t * 0.08) * 0.01;
			const offX = bx + sx;
			const offY = by + sy;

			ctx.save();
			ctx.translate(W / 2, H / 2);
			ctx.scale(zoom, zoom);
			ctx.translate(-W / 2 + offX, -H / 2 + offY);

			if (bgImgRef.current) {
				// 背景图 + 昼夜调色叠加
				ctx.drawImage(bgImgRef.current, -20, -20, W + 40, H + 40);
				// 昼夜调色：用 keyLightColor 与 ambient 叠加
				const lightAlpha = Math.min(0.55, 1 - sm.ambientIntensity * 0.7);
				ctx.fillStyle = rgb(sm.keyLightColor);
				ctx.globalAlpha = lightAlpha * 0.35;
				ctx.globalCompositeOperation = "overlay";
				ctx.fillRect(-40, -40, W + 80, H + 80);
				ctx.globalAlpha = 1;
				ctx.globalCompositeOperation = "source-over";
			} else {
				// CSS 渐变 fallback：解析失败则用 skyColor 径向渐变
				const grad = ctx.createRadialGradient(W / 2, H * 0.3, 0, W / 2, H / 2, Math.max(W, H));
				const sky = sm.skyColor;
				grad.addColorStop(0, `rgba(${Math.round(sky[0] * 255)},${Math.round(sky[1] * 255)},${Math.round(sky[2] * 255)},1)`);
				grad.addColorStop(1, `rgba(${Math.round(sm.groundColor[0] * 255)},${Math.round(sm.groundColor[1] * 255)},${Math.round(sm.groundColor[2] * 255)},1)`);
				ctx.fillStyle = grad;
				ctx.fillRect(-40, -40, W + 80, H + 80);
			}
			ctx.restore();

			// ========== 2. 体积雾层 ==========
			const fogAlpha = Math.min(0.6, sm.fogDensity * 12);
			if (fogAlpha > 0.02) {
				const fg = ctx.createRadialGradient(W / 2, H * 0.5, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
				fg.addColorStop(0, "transparent");
				fg.addColorStop(0.6, `rgba(${Math.round(sm.fogColor[0] * 255)},${Math.round(sm.fogColor[1] * 255)},${Math.round(sm.fogColor[2] * 255)},${fogAlpha * 0.5})`);
				fg.addColorStop(1, `rgba(${Math.round(sm.fogColor[0] * 255)},${Math.round(sm.fogColor[1] * 255)},${Math.round(sm.fogColor[2] * 255)},${fogAlpha})`);
				ctx.fillStyle = fg;
				ctx.fillRect(0, 0, W, H);
			}

			// ========== 3. 天气粒子 ==========
			const preset = WEATHER_PRESETS[currentWeather];
			const particles = particlesRef.current;
			if (preset.count > 0) {
				for (let i = 0; i < particles.length; i++) {
					const p = particles[i];
					// 更新位置
					const speedY = preset.fall * p.z;
					p.y += speedY * delta;
					// 水平漂移：正弦 + 随机
					p.x += Math.sin(t * 0.6 + p.seed * 6.28) * preset.drift * delta;
					// 边界回收
					if (preset.rise) {
						if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
						if (p.y > H + 20) { p.y = H + 20; }
					} else {
						if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
						if (p.y < -40) { p.y = H + 20; p.x = Math.random() * W; }
					}
					if (p.x < -40) p.x = W + 40;
					if (p.x > W + 40) p.x = -40;

					// 闪烁
					let flick = 1;
					if (preset.flicker > 0) {
						flick = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 3 + p.phase));
					}
					const alpha = preset.opacity * flick * p.z;

					if (preset.shape === "line") {
						// rain / storm：细长线
						ctx.strokeStyle = preset.color;
						ctx.globalAlpha = alpha;
						ctx.lineWidth = preset.size * p.z;
						ctx.beginPath();
						const len = preset.fall > 400 ? 14 : 8;
						const ang = Math.atan2(speedY, preset.drift);
						ctx.moveTo(p.x, p.y);
						ctx.lineTo(p.x - Math.sin(ang) * len, p.y - Math.cos(ang) * len);
						ctx.stroke();
					} else if (preset.shape === "soft") {
						// mist：大模糊圆
						const r = preset.size * p.z;
						const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
						g.addColorStop(0, preset.color);
						g.addColorStop(1, "transparent");
						ctx.fillStyle = g;
						ctx.globalAlpha = alpha * 0.5;
						ctx.beginPath();
						ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
						ctx.fill();
					} else {
						// circle：snow / petals / firefly / embers
						ctx.fillStyle = preset.color;
						ctx.globalAlpha = alpha;
						ctx.beginPath();
						ctx.arc(p.x, p.y, preset.size * p.z, 0, Math.PI * 2);
						ctx.fill();
						// 发光粒子（firefly / embers）：加光晕
						if (preset.flicker > 0.5) {
							ctx.globalAlpha = alpha * 0.4;
							ctx.beginPath();
							ctx.arc(p.x, p.y, preset.size * p.z * 2.5, 0, Math.PI * 2);
							ctx.fill();
						}
					}
				}
				ctx.globalAlpha = 1;
			}

			// ========== 4. 暗角与色调强化 ==========
			// 死亡时压暗 + 红调；通关时提亮 + 暖调
			if (death) {
				ctx.fillStyle = "rgba(40,8,4,0.45)";
				ctx.fillRect(0, 0, W, H);
			} else if (cleared) {
				ctx.fillStyle = "rgba(255,220,160,0.12)";
				ctx.fillRect(0, 0, W, H);
			}

			// 底部渐暗，保证对话框可读性
			const bottomGrad = ctx.createLinearGradient(0, H * 0.55, 0, H);
			bottomGrad.addColorStop(0, "transparent");
			bottomGrad.addColorStop(1, "rgba(5,4,3,0.7)");
			ctx.fillStyle = bottomGrad;
			ctx.fillRect(0, 0, W, H);
		};
		rafRef.current = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", resize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// 当 mood 变化导致 weather 变化时，重新初始化粒子
	useEffect(() => {
		// 由渲染循环内部检测 targetMood.weather 切换并自动 initParticles
	}, [mood.weather]);

	return (
		<canvas
			ref={canvasRef}
			className="vn-dynamic-scene"
			style={{
				position: "absolute",
				inset: 0,
				zIndex: 1,
				pointerEvents: "none",
				width: "100%",
				height: "100%",
			}}
			aria-hidden
		/>
	);
}

// 死亡 / 通关情绪覆盖（仅改关键字段，保留 weather）
const DEATH_OVERRIDE: Partial<SceneMood> = {
	skyColor: [0.18, 0.04, 0.03],
	groundColor: [0.03, 0.01, 0.01],
	fogColor: [0.12, 0.03, 0.02],
	fogDensity: 0.04,
	ambientIntensity: 0.25,
	keyLightIntensity: 0.5,
	keyLightColor: [0.95, 0.55, 0.42],
	cameraBreath: 0.9,
	mood: "tragic",
};
const CLEAR_OVERRIDE: Partial<SceneMood> = {
	skyColor: [0.28, 0.22, 0.12],
	groundColor: [0.08, 0.06, 0.03],
	fogColor: [0.18, 0.14, 0.08],
	fogDensity: 0.016,
	ambientIntensity: 0.5,
	keyLightIntensity: 1.0,
	keyLightColor: [1.0, 0.82, 0.58],
	cameraBreath: 0.4,
	mood: "warm",
};
