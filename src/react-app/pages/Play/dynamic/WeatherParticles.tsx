/**
 * 天气粒子系统：单 BufferGeometry + ShaderMaterial 驱动多类粒子。
 * 通过 instanced point sprite 渲染，避免每帧重建几何。
 *
 * 粒子类型：rain / snow / petals / firefly / embers / mist
 * 每类有独立的下落速度、漂移、生命周期、颜色与大小。
 */
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Weather } from "./sceneMoods";

interface WeatherConfig {
	count: number;
	color: THREE.Color;
	size: number;
	/** 下落速度（y 负方向） */
	fall: number;
	/** 水平漂移幅度 */
	drift: number;
	/** 闪烁/呼吸系数（0=不闪） */
	flicker: number;
	/** 起始透明度 */
	opacity: number;
}

const WEATHER_PRESETS: Record<Weather, WeatherConfig> = {
	clear: { count: 0, color: new THREE.Color(1, 1, 1), size: 0, fall: 0, drift: 0, flicker: 0, opacity: 0 },
	rain: { count: 900, color: new THREE.Color(0.7, 0.8, 0.95), size: 0.035, fall: 14, drift: 1.2, flicker: 0, opacity: 0.45 },
	snow: { count: 500, color: new THREE.Color(0.95, 0.97, 1.0), size: 0.07, fall: 1.4, drift: 0.8, flicker: 0, opacity: 0.8 },
	petals: { count: 160, color: new THREE.Color(0.96, 0.7, 0.78), size: 0.16, fall: 0.9, drift: 2.2, flicker: 0, opacity: 0.9 },
	firefly: { count: 90, color: new THREE.Color(0.75, 1.0, 0.6), size: 0.09, fall: 0.08, drift: 0.6, flicker: 1.0, opacity: 1.0 },
	embers: { count: 220, color: new THREE.Color(1.0, 0.5, 0.18), size: 0.05, fall: -0.6, drift: 1.0, flicker: 0.8, opacity: 0.9 },
	mist: { count: 60, color: new THREE.Color(0.85, 0.85, 0.85), size: 2.4, fall: 0.04, drift: 0.5, flicker: 0.15, opacity: 0.18 },
	storm: { count: 1200, color: new THREE.Color(0.65, 0.72, 0.9), size: 0.04, fall: 18, drift: 3.5, flicker: 0, opacity: 0.5 },
};

const AREA = { x: 16, y: 10, z: 8 };

const vertexShader = /* glsl */ `
	attribute float aSeed;
	attribute float aSize;
	attribute float aPhase;
	varying float vSeed;
	varying float vPhase;
	varying float vAlpha;
	uniform float uTime;
	uniform float uFall;
	uniform float uDrift;
	uniform float uFlicker;
	uniform float uSize;
	uniform float uOpacity;
	uniform vec3 uArea;

	void main() {
		vSeed = aSeed;
		vPhase = aPhase;
		// 生命周期：用 seed 产生独立相位，速度受 fall 控制
		float life = fract(uTime * (0.05 + uFall * 0.04) + aSeed);
		// y 从顶部下落到底部，循环
		float yPos = (1.0 - life) * (uArea.y * 2.0) - uArea.y;
		// 水平漂移：正弦 + 随机
		float xDrift = sin(uTime * 0.6 + aSeed * 6.2831) * uDrift;
		float zDrift = cos(uTime * 0.4 + aSeed * 12.566) * uDrift * 0.5;
		vec3 pos = position;
		pos.x += xDrift;
		pos.y = yPos;
		pos.z += zDrift;
		// 闪烁
		float flick = uFlicker > 0.0 ? (0.5 + 0.5 * sin(uTime * 3.0 + aPhase * 6.2831)) : 1.0;
		vAlpha = uOpacity * flick;
		// 生命周期首尾淡入淡出
		float edge = smoothstep(0.0, 0.08, life) * smoothstep(1.0, 0.92, life);
		vAlpha *= edge;
		vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
		gl_PointSize = aSize * uSize * (320.0 / -mvPosition.z);
		gl_Position = projectionMatrix * mvPosition;
	}
`;

const fragmentShader = /* glsl */ `
	varying float vSeed;
	varying float vPhase;
	varying float vAlpha;
	uniform vec3 uColor;
	uniform float uSoft; // 边缘软度：mist=1, 其余=0

	void main() {
		vec2 uv = gl_PointCoord - 0.5;
		float d = length(uv);
		// 实心粒子：圆盘 + 软边
		float solid = smoothstep(0.5, 0.35, d);
		// 雾粒：径向衰减
		float soft = smoothstep(0.5, 0.0, d);
		float alpha = mix(solid, soft, uSoft) * vAlpha;
		if (alpha < 0.01) discard;
		// 中心略亮
		vec3 col = uColor * mix(1.0, 1.4, 1.0 - d * 2.0);
		gl_FragColor = vec4(col, alpha);
	}
`;

interface Props {
	weather: Weather;
	intensity?: number; // 0-1，情绪越强烈粒子越多
}

export function WeatherParticles({ weather, intensity = 1 }: Props) {
	const matRef = useRef<THREE.ShaderMaterial>(null);
	const preset = WEATHER_PRESETS[weather];
	const count = Math.max(0, Math.floor(preset.count * intensity));

	const { geometry, uniforms } = useMemo(() => {
		const geo = new THREE.BufferGeometry();
		if (count === 0) {
			geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(0), 3));
			geo.setAttribute("aSeed", new THREE.BufferAttribute(new Float32Array(0), 1));
			geo.setAttribute("aSize", new THREE.BufferAttribute(new Float32Array(0), 1));
			geo.setAttribute("aPhase", new THREE.BufferAttribute(new Float32Array(0), 1));
			return { geometry: geo, uniforms: null! };
		}
		const positions = new Float32Array(count * 3);
		const seeds = new Float32Array(count);
		const sizes = new Float32Array(count);
		const phases = new Float32Array(count);
		for (let i = 0; i < count; i++) {
			positions[i * 3] = (Math.random() - 0.5) * AREA.x * 2;
			positions[i * 3 + 1] = (Math.random() - 0.5) * AREA.y * 2;
			positions[i * 3 + 2] = (Math.random() - 0.5) * AREA.z * 2;
			seeds[i] = Math.random();
			sizes[i] = 0.6 + Math.random() * 0.8;
			phases[i] = Math.random();
		}
		geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
		geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
		geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
		const u = {
			uTime: { value: 0 },
			uColor: { value: preset.color.clone() },
			uSize: { value: preset.size },
			uFall: { value: preset.fall },
			uDrift: { value: preset.drift },
			uFlicker: { value: preset.flicker },
			uOpacity: { value: preset.opacity },
			uSoft: { value: weather === "mist" ? 1.0 : 0.0 },
			uArea: { value: new THREE.Vector3(AREA.x, AREA.y, AREA.z) },
		};
		return { geometry: geo, uniforms: u };
	}, [count, preset, weather]);

	useFrame((_, delta) => {
		if (matRef.current && uniforms) {
			uniforms.uTime.value += delta;
		}
	});

	if (count === 0) return null;

	return (
		<points geometry={geometry} frustumCulled={false}>
			<shaderMaterial
				ref={matRef}
				uniforms={uniforms}
				vertexShader={vertexShader}
				fragmentShader={fragmentShader}
				transparent
				depthWrite={false}
				blending={weather === "embers" || weather === "firefly" ? THREE.AdditiveBlending : THREE.NormalBlending}
			/>
		</points>
	);
}
