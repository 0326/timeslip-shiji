/**
 * 镜头系统：在固定机位上叠加呼吸 / 平移 / 推拉 / 震动四种微动。
 * 不接管用户控制，仅做程序化运镜，避免与 drei OrbitControls 冲突。
 *
 * 震动用于死亡/战火等强烈情绪；呼吸是常态；推拉用于场景切换强调。
 */
import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export interface CameraRigProps {
	/** 呼吸幅度 0-1 */
	breath?: number;
	/** 震动强度 0-1，会随时间衰减 */
	shake?: number;
	/** 推拉：正=推近，负=拉远，0=静止 */
	zoom?: number;
	/** 镜头基调偏移，用于不同场景微调构图 */
	bias?: [number, number];
}

const BASE_POS = new THREE.Vector3(0, 0, 12);

export function CameraRig({ breath = 0.4, shake = 0, zoom = 0, bias = [0, 0] }: CameraRigProps) {
	const { camera } = useThree();
	const shakeRef = useRef(shake);
	const targetZoomRef = useRef(zoom);
	const currentZoomRef = useRef(0);

	// 震动触发时记录峰值，按指数衰减
	useEffect(() => {
		if (shake > 0) shakeRef.current = shake;
	}, [shake]);
	useEffect(() => {
		targetZoomRef.current = zoom;
	}, [zoom]);

	useFrame((state, delta) => {
		const t = state.clock.elapsedTime;
		// 呼吸：低频正弦，多轴叠加避免机械感
		const b = breath * 0.6;
		const breathX = Math.sin(t * 0.18) * b * 0.5 + bias[0];
		const breathY = Math.sin(t * 0.13 + 1.2) * b * 0.35;
		const breathZ = Math.sin(t * 0.09 + 0.6) * b * 0.2;

		// 震动衰减
		shakeRef.current *= Math.max(0, 1 - delta * 1.8);
		const shakeAmt = shakeRef.current;
		const shakeX = (Math.sin(t * 47) + Math.sin(t * 71)) * shakeAmt * 0.15;
		const shakeY = (Math.sin(t * 53) + Math.sin(t * 83)) * shakeAmt * 0.12;

		// 推拉平滑过渡
		currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * Math.min(1, delta * 1.5);
		const z = BASE_POS.z - currentZoomRef.current * 4;

		camera.position.set(
			breathX + shakeX,
			breathY + shakeY,
			z + breathZ,
		);
		camera.lookAt(breathX * 0.3, breathY * 0.3 - 0.5, 0);
	});

	return null;
}

/** 触发一次震动冲击（死亡 / 重大抉择） */
export function useCameraShakeTrigger() {
	const ref = useRef(0);
	return {
		trigger: (intensity = 1) => { ref.current = intensity; },
		shakeProp: ref,
	};
}
