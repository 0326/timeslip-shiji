import { useCallback, useEffect, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, XCircle, Flame } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./beacon.css";

interface Note {
	id: number;
	track: number;
	time: number;
	hit: boolean;
	judged: boolean;
}

type Judgement = "Perfect" | "Good" | "Miss" | null;

interface TrackFeedback {
	judgement: Judgement;
	expireAt: number;
}

const LEVEL_CONFIGS = [
	{ id: 1, name: "缓报", beatMs: 1200 },
	{ id: 2, name: "急报", beatMs: 900 },
	{ id: 3, name: "警报", beatMs: 600 },
];

const TOTAL_NOTES = 80;
const NOTE_TRAVEL_MS = 2000;
const JUDGE_CENTER = 89;
const PERFECT_RANGE = 5;
const GOOD_RANGE = 12;
const JUDGE_START = 80;
const JUDGE_END = 98;
const MISS_THRESHOLD = 99;

const KEY_TO_TRACK: Record<string, number> = {
	d: 0, D: 0,
	f: 1, F: 1,
	j: 2, J: 2,
	k: 3, K: 3,
};
const TRACK_KEYS = ["D", "F", "J", "K"];

function buildLevelNotes(levelIndex: number): Note[] {
	const config = LEVEL_CONFIGS[levelIndex] ?? LEVEL_CONFIGS[0];
	const notes: Note[] = [];
	for (let i = 0; i < TOTAL_NOTES; i++) {
		notes.push({
			id: i,
			track: Math.floor(Math.random() * 4),
			time: config.beatMs * (i + 2),
			hit: false,
			judged: false,
		});
	}
	return notes;
}

export function BeaconGame({ param, onComplete, onSkip }: MinigameProps) {
	const levelIndex = param ? parseInt(param, 10) - 1 : 0;
	const safeLevel = Math.max(0, Math.min(2, isNaN(levelIndex) ? 0 : levelIndex));
	const config = LEVEL_CONFIGS[safeLevel];

	const [notes, setNotes] = useState<Note[]>(() => buildLevelNotes(safeLevel));
	const [startTime] = useState<number>(() => performance.now());
	const [now, setNow] = useState<number>(() => performance.now());
	const [score, setScore] = useState(0);
	const [combo, setCombo] = useState(0);
	const [maxCombo, setMaxCombo] = useState(0);
	const [countPerfect, setCountPerfect] = useState(0);
	const [countGood, setCountGood] = useState(0);
	const [countMiss, setCountMiss] = useState(0);
	const [gameEnded, setGameEnded] = useState(false);
	const [won, setWon] = useState(false);
	const [lost, setLost] = useState(false);
	const [pressedTracks, setPressedTracks] = useState<boolean[]>([false, false, false, false]);
	const [trackFeedbacks, setTrackFeedbacks] = useState<TrackFeedback[]>([
		{ judgement: null, expireAt: 0 },
		{ judgement: null, expireAt: 0 },
		{ judgement: null, expireAt: 0 },
		{ judgement: null, expireAt: 0 },
	]);

	const comboRef = useRef(0);
	const maxComboRef = useRef(0);
	const notesRef = useRef<Note[]>(notes);
	notesRef.current = notes;

	useEffect(() => {
		if (gameEnded) return;
		const interval = setInterval(() => {
			const t = performance.now();
			setNow(t);
			setNotes((prev) => {
				let changed = false;
				let missDelta = 0;
				const next = prev.map((n) => {
					if (n.judged) return n;
					const elapsed = t - startTime;
					const x = ((elapsed - n.time + NOTE_TRAVEL_MS) / NOTE_TRAVEL_MS) * 100;
					if (x > MISS_THRESHOLD) {
						changed = true;
						missDelta++;
						return { ...n, judged: true };
					}
					return n;
				});
				if (missDelta > 0) {
					setCountMiss((c) => c + missDelta);
					setCombo(0);
					comboRef.current = 0;
				}
				return changed ? next : prev;
			});
		}, 30);
		return () => clearInterval(interval);
	}, [startTime, gameEnded]);

	useEffect(() => {
		const t = setInterval(() => {
			const nowTs = performance.now();
			setTrackFeedbacks((prev) =>
				prev.map((fb) =>
					fb.expireAt > 0 && nowTs >= fb.expireAt
						? { judgement: null, expireAt: 0 }
						: fb,
				),
			);
		}, 60);
		return () => clearInterval(t);
	}, []);

	const finishCheckRef = useRef(false);
	useEffect(() => {
		if (finishCheckRef.current) return;
		const judgedCount = notesRef.current.filter((n) => n.judged).length;
		if (judgedCount >= TOTAL_NOTES) {
			finishCheckRef.current = true;
			setGameEnded(true);
			const totalScoreValue = countPerfect * 2 + countGood;
			const maxPossible = TOTAL_NOTES * 2;
			const accuracy = totalScoreValue / maxPossible;
			if (accuracy >= 0.7) {
				const finalScore = Math.min(100, Math.round(60 + accuracy * 40));
				setWon(true);
				sfx.play("win");
				sfx.resetCombo();
				setTimeout(() => onComplete({ result: "win", score: finalScore }), 1500);
			} else {
				setLost(true);
				sfx.play("lose");
				sfx.resetCombo();
				setTimeout(() => onComplete({ result: "lose", score: 0 }), 1500);
			}
		}
	}, [now, notes, countPerfect, countGood, onComplete]);

	const setTrackFeedback = useCallback((track: number, judgement: Judgement) => {
		setTrackFeedbacks((prev) => {
			const next = [...prev];
			next[track] = { judgement, expireAt: performance.now() + 500 };
			return next;
		});
	}, []);

	const triggerJudge = useCallback(
		(track: number) => {
			if (gameEnded) return;
			const elapsed = performance.now() - startTime;
			let targetId: number | null = null;
			let minDist = Infinity;
			for (const n of notesRef.current) {
				if (n.judged || n.track !== track) continue;
				const x = ((elapsed - n.time + NOTE_TRAVEL_MS) / NOTE_TRAVEL_MS) * 100;
				if (x >= JUDGE_START && x <= JUDGE_END) {
					const dist = Math.abs(x - JUDGE_CENTER);
					if (dist < minDist) {
						minDist = dist;
						targetId = n.id;
					}
				}
			}
			if (targetId === null) {
				return;
			}
			let judgement: Judgement = "Miss";
			let scoreDelta = 0;
			if (minDist <= PERFECT_RANGE) {
				judgement = "Perfect";
				scoreDelta = 2;
				comboRef.current += 1;
			} else if (minDist <= GOOD_RANGE) {
				judgement = "Good";
				scoreDelta = 1;
				comboRef.current += 1;
			} else {
				comboRef.current = 0;
			}
			const curCombo = comboRef.current;
			// 音效：命中节拍 tick，连击 combo，失误 wrong
			if (judgement === "Perfect" || judgement === "Good") {
				sfx.play("tick");
				if (curCombo > 1) sfx.play("combo");
			} else {
				sfx.play("wrong");
			}
			if (curCombo > maxComboRef.current) {
				maxComboRef.current = curCombo;
				setMaxCombo(curCombo);
			}
			if (judgement === "Perfect") {
				setCountPerfect((c) => c + 1);
			} else if (judgement === "Good") {
				setCountGood((c) => c + 1);
			} else {
				setCountMiss((c) => c + 1);
			}
			setScore((s) => s + scoreDelta);
			setCombo(curCombo);
			setTrackFeedback(track, judgement);
			setNotes((prev) =>
				prev.map((n) => (n.id === targetId ? { ...n, hit: true, judged: true } : n)),
			);
		},
		[startTime, gameEnded, setTrackFeedback],
	);

	const onTrackPress = useCallback(
		(track: number) => {
			if (gameEnded) return;
			setPressedTracks((prev) => {
				const next = [...prev];
				next[track] = true;
				return next;
			});
			triggerJudge(track);
		},
		[triggerJudge, gameEnded],
	);

	const onTrackRelease = useCallback((track: number) => {
		setPressedTracks((prev) => {
			const next = [...prev];
			next[track] = false;
			return next;
		});
	}, []);

	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			const track = KEY_TO_TRACK[e.key];
			if (track !== undefined) {
				e.preventDefault();
				onTrackPress(track);
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			const track = KEY_TO_TRACK[e.key];
			if (track !== undefined) {
				e.preventDefault();
				onTrackRelease(track);
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [onTrackPress, onTrackRelease]);

	const elapsed = now - startTime;

	return (
		<div className="bc-root">
			<div className="bc-bg" aria-hidden="true" />

			<div className="bc-hud">
				<div className="bc-title serif">烽火传信 · {config.name}</div>
				<div className="bc-stats">
					<span className="bc-score">
						<Flame size={12} className="bc-score-ico" />
						{score}
					</span>
					<span className="bc-combo">连击 {combo}</span>
					<span className="bc-count-perfect">P {countPerfect}</span>
					<span className="bc-count-good">G {countGood}</span>
					<span className="bc-count-miss">M {countMiss}</span>
				</div>
			</div>

			<p className="bc-hint">
				狼烟起，速传信！当火团抵达金色判定区时，按 <kbd>D</kbd> <kbd>F</kbd> <kbd>J</kbd> <kbd>K</kbd> 点燃对应烽火台。
			</p>

			<div className="bc-stage">
				<div className="bc-tracks">
					{[0, 1, 2, 3].map((trackIdx) => {
						const fb = trackFeedbacks[trackIdx];
						return (
							<div
								key={trackIdx}
								className={[
									"bc-track",
									pressedTracks[trackIdx] ? "pressed" : "",
									fb.judgement === "Perfect" ? "fb-perfect" : "",
									fb.judgement === "Good" ? "fb-good" : "",
									fb.judgement === "Miss" ? "fb-miss" : "",
								].filter(Boolean).join(" ")}
							>
								<div className="bc-track-inner">
									<div className="bc-judge-zone" />
									{notes.map((n) => {
										if (n.judged) return null;
										if (n.track !== trackIdx) return null;
										const x = ((elapsed - n.time + NOTE_TRAVEL_MS) / NOTE_TRAVEL_MS) * 100;
										if (x < -8 || x > 102) return null;
										return (
											<div
												key={n.id}
												className="bc-note"
												style={{ transform: `translateX(${x}%)` }}
											>
												<div className="bc-note-core" />
											</div>
										);
									})}
									{fb.judgement && (
										<div
											className={[
												"bc-judgement-label",
												fb.judgement === "Perfect" ? "perfect" : "",
												fb.judgement === "Good" ? "good" : "",
												fb.judgement === "Miss" ? "miss" : "",
											].filter(Boolean).join(" ")}
										>
											{fb.judgement}
											{fb.judgement !== "Miss" && combo > 1 && (
												<span className="bc-judgement-combo">×{combo}</span>
											)}
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>

				<div className="bc-buttons">
					{[0, 1, 2, 3].map((trackIdx) => (
						<button
							key={trackIdx}
							type="button"
							className={[
								"bc-btn",
								pressedTracks[trackIdx] ? "pressed" : "",
							].filter(Boolean).join(" ")}
							onMouseDown={() => onTrackPress(trackIdx)}
							onMouseUp={() => onTrackRelease(trackIdx)}
							onMouseLeave={() => onTrackRelease(trackIdx)}
							onTouchStart={(e) => { e.preventDefault(); onTrackPress(trackIdx); }}
							onTouchEnd={(e) => { e.preventDefault(); onTrackRelease(trackIdx); }}
							disabled={gameEnded}
							aria-label={`烽火台 ${trackIdx + 1} (${TRACK_KEYS[trackIdx]})`}
						>
							<Flame size={22} className="bc-btn-ico" />
							<span className="bc-btn-key serif">{TRACK_KEYS[trackIdx]}</span>
						</button>
					))}
				</div>
			</div>

			<div className="bc-progress">
				<div
					className="bc-progress-bar"
					style={{ width: `${(notes.filter((n) => n.judged).length / TOTAL_NOTES) * 100}%` }}
				/>
			</div>

			<div className="bc-controls">
				<button className="btn btn-ghost" onClick={onSkip} disabled={gameEnded}>
					跳过
				</button>
			</div>

			{won && (
				<div className="bc-result win">
					<CheckCircle2 size={46} />
					<div className="bc-result-title">传信成功！</div>
					<div className="bc-result-sub">
						诸侯闻警，率师勤王 · 最高连击 {maxCombo}
					</div>
				</div>
			)}
			{lost && (
				<div className="bc-result lose">
					<XCircle size={46} />
					<div className="bc-result-title">烽烟断续</div>
					<div className="bc-result-sub">
						信号未至，诸侯来迟 · 仍推进剧情
					</div>
				</div>
			)}
		</div>
	);
}
