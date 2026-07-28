/**
 * 水墨晕染转场：场景切换时全屏覆盖一层墨晕 shader。
 * 用噪声驱动墨迹扩散，从中心向四周晕开再消散，模拟宣纸落墨。
 *
 * 作为 DOM 层叠加在 Canvas 之上（pointer-events:none），由 React 控制 opacity。
 */
import { useEffect, useRef, useState } from "react";

interface Props {
	/** 触发转场的 key（背景切换时变化） */
	transitionKey: string;
	/** 墨色 */
	color?: string;
	/** 持续时长 ms */
	duration?: number;
}

const INK_SHADER = `
precision highp float;
uniform float uProgress; // 0→1：墨晕扩散；1→0：消散
uniform float uTime;
uniform vec2 uResolution;
uniform float uNoise;
varying vec2 vUv;

// 简化版 fbm 噪声
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
	vec2 i = floor(p), f = fract(p);
	float a = hash(i), b = hash(i + vec2(1, 0)), c = hash(i + vec2(0, 1)), d = hash(i + vec2(1, 1));
	vec2 u = f * f * (3.0 - 2.0 * f);
	return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
float fbm(vec2 p) {
	float v = 0.0, a = 0.5;
	for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
	return v;
}

void main() {
	vec2 uv = vUv;
	vec2 centered = uv - 0.5;
	float dist = length(centered);
	// 墨迹边缘：噪声扰动半径
	float n = fbm(uv * 6.0 + uTime * 0.15) * uNoise;
	float inkEdge = 0.35 + n * 0.25;
	// 扩散：progress 驱动半径增长
	float mask = smoothstep(inkEdge * uProgress + 0.05, inkEdge * uProgress - 0.08, dist);
	// 墨色不均匀：内部更浓
	float density = mix(0.92, 0.78, dist * 2.0) * mask;
	// 飞白纹理
	float streak = fbm(uv * vec2(3.0, 18.0)) * 0.15;
	density *= (1.0 - streak * mask);
	gl_FragColor = vec4(0.02, 0.015, 0.01, density * uProgress);
}
`;

export function SceneTransition({ transitionKey, color: _color, duration = 900 }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [active, setActive] = useState(false);
	const progRef = useRef(0);
	const startRef = useRef(0);
	const rafRef = useRef(0);

	// 监听 transitionKey 变化触发一次转场
	useEffect(() => {
		if (!transitionKey) return;
		setActive(true);
		startRef.current = performance.now();
		return () => cancelAnimationFrame(rafRef.current);
	}, [transitionKey]);

	useEffect(() => {
		if (!active) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false });
		if (!gl) return;

		const vs = gl.createShader(gl.VERTEX_SHADER)!;
		gl.shaderSource(vs, `attribute vec2 aPos; varying vec2 vUv; void main(){ vUv = aPos * 0.5 + 0.5; gl_Position = vec4(aPos, 0.0, 1.0); }`);
		gl.compileShader(vs);
		const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
		gl.shaderSource(fs, INK_SHADER);
		gl.compileShader(fs);
		const prog = gl.createProgram()!;
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		gl.useProgram(prog);

		const buf = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
		const loc = gl.getAttribLocation(prog, "aPos");
		gl.enableVertexAttribArray(loc);
		gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

		const uProgress = gl.getUniformLocation(prog, "uProgress");
		const uTime = gl.getUniformLocation(prog, "uTime");
		const uNoise = gl.getUniformLocation(prog, "uNoise");
		const uRes = gl.getUniformLocation(prog, "uResolution");

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio, 2);
			canvas.width = window.innerWidth * dpr;
			canvas.height = window.innerHeight * dpr;
			gl.viewport(0, 0, canvas.width, canvas.height);
		};
		resize();
		window.addEventListener("resize", resize);

		const tick = () => {
			const now = performance.now();
			const elapsed = now - startRef.current;
			const half = duration / 2;
			// 双相：前半段扩散到 1，后半段消散到 0
			let p: number;
			if (elapsed < half) p = elapsed / half;
			else p = Math.max(0, 1 - (elapsed - half) / half);
			progRef.current = p;
			if (elapsed >= duration) {
				setActive(false);
				return;
			}
			gl.clearColor(0, 0, 0, 0);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.uniform1f(uProgress, p);
			gl.uniform1f(uTime, elapsed / 1000);
			gl.uniform1f(uNoise, 1.0);
			gl.uniform2f(uRes, canvas.width, canvas.height);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
			rafRef.current = requestAnimationFrame(tick);
		};
		rafRef.current = requestAnimationFrame(tick);

		return () => {
			cancelAnimationFrame(rafRef.current);
			window.removeEventListener("resize", resize);
		};
	}, [active, duration]);

	if (!active) return null;

	return (
		<canvas
			ref={canvasRef}
			className="vn-scene-transition"
			style={{
				position: "fixed",
				inset: 0,
				zIndex: 8,
				pointerEvents: "none",
				width: "100vw",
				height: "100vh",
			}}
			aria-hidden
		/>
	);
}
