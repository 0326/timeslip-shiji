import { useEffect, useMemo, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, RotateCcw, SkipForward, Wheat, Shield, Users, AlertTriangle } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./logistics.css";

interface FrontRequirement {
	food: number;
	arm: number;
	troop: number;
}

interface FrontData {
	name: string;
	scene: string;
	requirement: FrontRequirement;
}

interface LevelData {
	id: number;
	name: string;
	historyNote: string;
	total: FrontRequirement;
	maxOps: number;
	fronts: [FrontData, FrontData, FrontData];
}

const LEVELS: LevelData[] = [
	{
		id: 1,
		name: "官渡之战 · 引子",
		historyNote: "建安五年，官渡对峙。袁绍军盛，公兵少粮缺——先调粮草，稳三军之心。",
		total: { food: 15, arm: 10, troop: 12 },
		maxOps: 25,
		fronts: [
			{ name: "左军", scene: "延津渡口 · 拒袁军侧翼", requirement: { food: 4, arm: 1, troop: 2 } },
			{ name: "中军", scene: "官渡大营 · 曹公主阵地", requirement: { food: 6, arm: 5, troop: 6 } },
			{ name: "右军", scene: "白马故地 · 奇兵迂回", requirement: { food: 2, arm: 3, troop: 2 } },
		],
	},
	{
		id: 2,
		name: "赤壁 · 联军",
		historyNote: "建安十三年，赤壁连营。孙刘合兵，北拒曹公——八万士卒，皆仰此调度。",
		total: { food: 20, arm: 15, troop: 18 },
		maxOps: 30,
		fronts: [
			{ name: "左军", scene: "夏口 · 周瑜水师左翼", requirement: { food: 5, arm: 4, troop: 3 } },
			{ name: "中军", scene: "赤壁 · 联军主帅大营", requirement: { food: 8, arm: 6, troop: 9 } },
			{ name: "右军", scene: "樊口 · 刘备步军右翼", requirement: { food: 4, arm: 4, troop: 4 } },
		],
	},
	{
		id: 3,
		name: "垓下 · 决胜",
		historyNote: "汉五年，垓下之围。项王虽勇，然兵少食尽——三十万众，调度毫厘必争。",
		total: { food: 28, arm: 22, troop: 25 },
		maxOps: 35,
		fronts: [
			{ name: "左军", scene: "淮水北岸 · 韩信左翼", requirement: { food: 7, arm: 6, troop: 7 } },
			{ name: "中军", scene: "垓下 · 汉王刘邦主营", requirement: { food: 12, arm: 9, troop: 11 } },
			{ name: "右军", scene: "东城古道 · 彭越断后", requirement: { food: 6, arm: 5, troop: 5 } },
		],
	},
];

type ResourceKey = "food" | "arm" | "troop";

const RESOURCE_META: Record<ResourceKey, { label: string; short: string; color: string; Icon: typeof Wheat }> = {
	food: { label: "粮草", short: "粮", color: "gold", Icon: Wheat },
	arm: { label: "军械", short: "械", color: "cyan", Icon: Shield },
	troop: { label: "兵员", short: "兵", color: "vermilion", Icon: Users },
};

export function LogisticsGame({ param, onComplete, onSkip }: MinigameProps) {
	const levelIdx = useMemo(() => {
		if (param) {
			const n = parseInt(param, 10);
			if (!Number.isNaN(n) && n >= 1 && n <= LEVELS.length) return n - 1;
		}
		return 0;
	}, [param]);

	const level = LEVELS[levelIdx];

	const [warehouse, setWarehouse] = useState<FrontRequirement>({ ...level.total });
	const [allocations, setAllocations] = useState<[FrontRequirement, FrontRequirement, FrontRequirement]>([
		{ food: 0, arm: 0, troop: 0 },
		{ food: 0, arm: 0, troop: 0 },
		{ food: 0, arm: 0, troop: 0 },
	]);
	const [usedOps, setUsedOps] = useState(0);
	const [toast, setToast] = useState<{ type: "error" | "info"; text: string } | null>(null);
	const [won, setWon] = useState(false);
	const [validating, setValidating] = useState(false);

	useEffect(() => {
		setWarehouse({ ...level.total });
		setAllocations([
			{ food: 0, arm: 0, troop: 0 },
			{ food: 0, arm: 0, troop: 0 },
			{ food: 0, arm: 0, troop: 0 },
		]);
		setUsedOps(0);
		setToast(null);
		setWon(false);
		setValidating(false);
	}, [level]);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 2600);
		return () => clearTimeout(t);
	}, [toast]);

	function handleAllocate(frontIdx: number, key: ResourceKey, delta: number) {
		if (won || validating) return;
		if (usedOps >= level.maxOps) {
			sfx.play("wrong");
			setToast({ type: "error", text: "操作次数已用尽，请重置或校验" });
			return;
		}

		const curAlloc = allocations[frontIdx][key];
		if (delta > 0) {
			if (warehouse[key] <= 0) {
				sfx.play("wrong");
				setToast({ type: "error", text: `仓库中${RESOURCE_META[key].label}不足` });
				return;
			}
		} else {
			if (curAlloc <= 0) return;
		}

		const newAllocations = allocations.map((a, i) =>
			i === frontIdx ? { ...a, [key]: a[key] + delta } : a,
		) as [FrontRequirement, FrontRequirement, FrontRequirement];
		const newWarehouse = { ...warehouse, [key]: warehouse[key] - delta };

		setAllocations(newAllocations);
		setWarehouse(newWarehouse);
		setUsedOps((o) => o + 1);

		if (delta > 0) {
			sfx.play("place");
			const front = level.fronts[frontIdx];
			const wasFrontMet = (Object.keys(front.requirement) as ResourceKey[]).every(
				(k) => allocations[frontIdx][k] >= front.requirement[k],
			);
			const nowFrontMet = (Object.keys(front.requirement) as ResourceKey[]).every(
				(k) => newAllocations[frontIdx][k] >= front.requirement[k],
			);
			if (!wasFrontMet && nowFrontMet) {
				sfx.play("match");
			}
		}
	}

	function handleReset() {
		if (won || validating) return;
		sfx.resetCombo();
		setWarehouse({ ...level.total });
		setAllocations([
			{ food: 0, arm: 0, troop: 0 },
			{ food: 0, arm: 0, troop: 0 },
			{ food: 0, arm: 0, troop: 0 },
		]);
		setUsedOps(0);
		setToast({ type: "info", text: "已全部回收至仓库" });
	}

	function handleValidate() {
		if (won || validating) return;

		const insufficient: string[] = [];
		level.fronts.forEach((front, fi) => {
			const alloc = allocations[fi];
			(Object.keys(front.requirement) as ResourceKey[]).forEach((key) => {
				if (alloc[key] < front.requirement[key]) {
					insufficient.push(
						`${front.name}${RESOURCE_META[key].label}不足（需${front.requirement[key]}，现有${alloc[key]}）`,
					);
				}
			});
		});

		if (insufficient.length > 0) {
			sfx.play("wrong");
			setToast({ type: "error", text: insufficient.join("；") });
			return;
		}

		setValidating(true);
		setWon(true);
		sfx.play("win");
		const score = Math.min(100, 60 + Math.floor((1 - usedOps / level.maxOps) * 40));
		const t = setTimeout(() => {
			onComplete({ result: "win", score });
		}, 1500);
		return () => clearTimeout(t);
	}

	const remainingOps = level.maxOps - usedOps;
	const opsPercent = (remainingOps / level.maxOps) * 100;

	return (
		<div className="lo-root">
			<div className="lo-hud">
				<div className="lo-title-wrap">
					<div className="lo-title serif">粮草调度</div>
					<div className="lo-level-tag">
						第 {level.id} 关 · {level.name}
					</div>
				</div>
				<div className="lo-ops-wrap">
					<div className="lo-ops-label">剩余操作</div>
					<div className="lo-ops-bar">
						<div
							className={`lo-ops-bar-fill ${remainingOps <= level.maxOps * 0.3 ? "low" : ""}`}
							style={{ width: `${opsPercent}%` }}
						/>
					</div>
					<div className="lo-ops-num">
						<span className={remainingOps <= 3 ? "low" : ""}>{remainingOps}</span>
						<span className="lo-ops-total"> / {level.maxOps}</span>
					</div>
				</div>
			</div>

			<div className="lo-note">
				<AlertTriangle size={14} />
				<span>{level.historyNote}</span>
			</div>

			<div className="lo-warehouse">
				<div className="lo-warehouse-title">仓 · 库</div>
				<div className="lo-warehouse-grid">
					{(Object.keys(RESOURCE_META) as ResourceKey[]).map((key) => {
						const meta = RESOURCE_META[key];
						const total = level.total[key];
						const remain = warehouse[key];
						const isEmpty = remain === 0;
						return (
							<div key={key} className={`lo-res lo-res-${meta.color} ${isEmpty ? "empty" : ""}`}>
								<div className="lo-res-icon">
									<meta.Icon size={22} />
								</div>
								<div className="lo-res-info">
									<div className="lo-res-label">{meta.label}</div>
									<div className="lo-res-nums">
										<span className="lo-res-cur">{remain}</span>
										<span className="lo-res-total"> / {total}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className="lo-fronts">
				{level.fronts.map((front, fi) => (
					<div key={fi} className="lo-front-card">
						<div className="lo-front-head">
							<div className="lo-front-name serif">{front.name}</div>
							<div className="lo-front-scene">{front.scene}</div>
						</div>
						<div className="lo-front-body">
							{(Object.keys(RESOURCE_META) as ResourceKey[]).map((key) => {
								const meta = RESOURCE_META[key];
								const req = front.requirement[key];
								const cur = allocations[fi][key];
								const percent = Math.min(100, (cur / req) * 100);
								const met = cur >= req;
								return (
									<div key={key} className={`lo-row lo-row-${meta.color} ${met ? "met" : ""}`}>
										<div className="lo-row-label">
											<meta.Icon size={14} />
											<span>{meta.label}</span>
										</div>
										<div className="lo-row-bar-wrap">
											<div className="lo-row-bar">
												<div
													className={`lo-row-bar-fill ${met ? "ok" : ""}`}
													style={{ width: `${percent}%` }}
												/>
											</div>
											<div className="lo-row-nums">
												<span className={met ? "ok-num" : ""}>{cur}</span>
												<span className="lo-row-req"> / {req}</span>
											</div>
										</div>
										<div className="lo-row-ctls">
											<button
												type="button"
												className="lo-ctl lo-ctl-minus"
												onClick={() => handleAllocate(fi, key, -1)}
												disabled={won || validating || cur === 0}
												aria-label={`收回${meta.label}`}
											>
												−
											</button>
											<button
												type="button"
												className="lo-ctl lo-ctl-plus"
												onClick={() => handleAllocate(fi, key, 1)}
												disabled={won || validating || warehouse[key] === 0 || usedOps >= level.maxOps}
												aria-label={`分配${meta.label}`}
											>
												+
											</button>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				))}
			</div>

			<div className="lo-controls">
				<button className="btn btn-ghost" onClick={onSkip} disabled={won || validating}>
					<SkipForward size={14} /> 跳过
				</button>
				<button className="btn btn-ghost" onClick={handleReset} disabled={won || validating}>
					<RotateCcw size={14} /> 重置
				</button>
				<button className="btn btn-primary btn-cut lo-btn-check" onClick={handleValidate} disabled={won || validating}>
					<CheckCircle2 size={16} /> 校验调度
				</button>
			</div>

			{toast && (
				<div className={`lo-toast lo-toast-${toast.type}`}>
					<AlertTriangle size={16} />
					<span>{toast.text}</span>
				</div>
			)}

			{won && (
				<div className="lo-win">
					<div className="lo-win-rays" aria-hidden />
					<CheckCircle2 size={52} />
					<div className="lo-win-title serif">粮草调度得当</div>
					<div className="lo-win-subtitle">三军奏凯 · 指挥若定</div>
					<div className="lo-win-score">
						<span className="lo-win-score-label">评</span>
						<span className="lo-win-score-num">{Math.min(100, 60 + Math.floor((1 - usedOps / level.maxOps) * 40))}</span>
					</div>
				</div>
			)}
		</div>
	);
}
