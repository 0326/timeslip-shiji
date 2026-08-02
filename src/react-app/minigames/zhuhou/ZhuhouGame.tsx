import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { MinigameProps } from "../types";
import { CheckCircle2, XCircle, RotateCcw, SkipForward } from "lucide-react";
import { sfx } from "../../lib/sfx";
import "./zhuhou.css";

const BOARD_SIZE = 6;
const EMPTY = 0;
const BLUE = 1;
const RED = 2;

type Cell = typeof EMPTY | typeof BLUE | typeof RED;
type Board = Cell[][];
type Player = typeof BLUE | typeof RED;
type Phase = "playing" | "won" | "lost";

const DIRS: Array<[number, number]> = [
	[-1, -1], [-1, 0], [-1, 1],
	[0, -1],          [0, 1],
	[1, -1],  [1, 0],  [1, 1],
];

function createInitialBoard(): Board {
	const board: Board = Array.from({ length: BOARD_SIZE }, () =>
		Array(BOARD_SIZE).fill(EMPTY)
	);
	const mid = BOARD_SIZE / 2;
	board[mid - 1][mid - 1] = BLUE;
	board[mid - 1][mid] = RED;
	board[mid][mid - 1] = RED;
	board[mid][mid] = BLUE;
	return board;
}

function cloneBoard(board: Board): Board {
	return board.map((row) => [...row]);
}

function inBounds(x: number, y: number): boolean {
	return x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;
}

function countPieces(board: Board): { blue: number; red: number } {
	let blue = 0;
	let red = 0;
	for (let r = 0; r < BOARD_SIZE; r++) {
		for (let c = 0; c < BOARD_SIZE; c++) {
			if (board[r][c] === BLUE) blue++;
			else if (board[r][c] === RED) red++;
		}
	}
	return { blue, red };
}

function getFlipsInDirection(
	board: Board,
	x: number,
	y: number,
	dx: number,
	dy: number,
	player: Player
): Array<[number, number]> {
	const opponent = player === BLUE ? RED : BLUE;
	const flips: Array<[number, number]> = [];
	let cx = x + dx;
	let cy = y + dy;

	while (inBounds(cx, cy) && board[cx][cy] === opponent) {
		flips.push([cx, cy]);
		cx += dx;
		cy += dy;
	}

	if (flips.length >= 1 && flips.length <= 3 && inBounds(cx, cy) && board[cx][cy] === player) {
		return flips;
	}
	return [];
}

function getAllFlips(
	board: Board,
	x: number,
	y: number,
	player: Player
): Array<[number, number]> {
	const allFlips: Array<[number, number]> = [];
	for (const [dx, dy] of DIRS) {
		const flips = getFlipsInDirection(board, x, y, dx, dy, player);
		allFlips.push(...flips);
	}
	return allFlips;
}

function canPlace(board: Board, x: number, y: number, player: Player): boolean {
	if (board[x][y] !== EMPTY) return false;
	return getAllFlips(board, x, y, player).length > 0;
}

function getValidMoves(board: Board, player: Player): Array<{ x: number; y: number; flips: number }> {
	const moves: Array<{ x: number; y: number; flips: number }> = [];
	for (let r = 0; r < BOARD_SIZE; r++) {
		for (let c = 0; c < BOARD_SIZE; c++) {
			if (canPlace(board, r, c, player)) {
				const flips = getAllFlips(board, r, c, player).length;
				moves.push({ x: r, y: c, flips });
			}
		}
	}
	return moves;
}

function place(board: Board, x: number, y: number, player: Player): Board {
	const newBoard = cloneBoard(board);
	newBoard[x][y] = player;
	const flips = getAllFlips(board, x, y, player);
	for (const [fx, fy] of flips) {
		newBoard[fx][fy] = player;
	}
	return newBoard;
}

function getFlippedCells(
	board: Board,
	x: number,
	y: number,
	player: Player
): Set<string> {
	const set = new Set<string>();
	for (const [fx, fy] of getAllFlips(board, x, y, player)) {
		set.add(`${fx},${fy}`);
	}
	return set;
}

function chooseAIMove(
	board: Board
): { x: number; y: number } | null {
	const moves = getValidMoves(board, RED);
	if (moves.length === 0) return null;
	moves.sort((a, b) => b.flips - a.flips);
	const bestFlips = moves[0].flips;
	const bestMoves = moves.filter((m) => m.flips === bestFlips);
	const chosen = bestMoves[Math.floor(Math.random() * bestMoves.length)];
	return { x: chosen.x, y: chosen.y };
}

export function ZhuhouGame({ onComplete, onSkip }: MinigameProps) {
	const [board, setBoard] = useState<Board>(() => createInitialBoard());
	const [currentPlayer, setCurrentPlayer] = useState<Player>(BLUE);
	const [phase, setPhase] = useState<Phase>("playing");
	const [message, setMessage] = useState<string>("");
	const [flippingCells, setFlippingCells] = useState<Set<string>>(new Set());
	const [lastMove, setLastMove] = useState<{ x: number; y: number } | null>(null);
	const [aiThinking, setAiThinking] = useState(false);
	const aiTimeoutRef = useRef<number | null>(null);
	const outcomeCalledRef = useRef(false);

	const { blue, red } = useMemo(() => countPieces(board), [board]);

	const validMoves = useMemo(() => {
		if (phase !== "playing" || currentPlayer !== BLUE || aiThinking) return new Set<string>();
		const moves = getValidMoves(board, BLUE);
		const set = new Set<string>();
		for (const m of moves) set.add(`${m.x},${m.y}`);
		return set;
	}, [board, currentPlayer, phase, aiThinking]);

	const calcScore = useCallback((blueCount: number, redCount: number): number => {
		if (blueCount <= redCount) return 0;
		if (blueCount >= 28) return 100;
		if (blueCount >= 22) return 80;
		return 60;
	}, []);

	const endGame = useCallback(
		(finalBoard: Board) => {
			const { blue: b, red: r } = countPieces(finalBoard);
			setBoard(finalBoard);
			if (b >= r) {
				setPhase("won");
				sfx.play("win");
			} else {
				setPhase("lost");
				sfx.play("lose");
			}
			const score = calcScore(b, r);
			if (outcomeCalledRef.current) return;
			outcomeCalledRef.current = true;
			setTimeout(() => {
				onComplete({
					result: b >= r ? "win" : "lose",
					score,
				});
			}, 1800);
		},
		[calcScore, onComplete]
	);

	const runAIMove = useCallback(
		(currentBoard: Board) => {
			const aiMoves = getValidMoves(currentBoard, RED);
			if (aiMoves.length === 0) {
				const playerMoves = getValidMoves(currentBoard, BLUE);
				if (playerMoves.length === 0) {
					endGame(currentBoard);
				} else {
					setMessage("楚军无棋可下，轮到汉军");
					setCurrentPlayer(BLUE);
				}
				return;
			}

			setAiThinking(true);
			aiTimeoutRef.current = window.setTimeout(() => {
				const move = chooseAIMove(currentBoard);
				if (!move) {
					setAiThinking(false);
					return;
				}
				const flipped = getFlippedCells(currentBoard, move.x, move.y, RED);
				setFlippingCells(flipped);
				setLastMove({ x: move.x, y: move.y });
				sfx.play("place");
				if (flipped.size > 0) sfx.play("flip");

				setTimeout(() => {
					const newBoard = place(currentBoard, move.x, move.y, RED);
					setBoard(newBoard);
					setFlippingCells(new Set());
					setAiThinking(false);

					const playerMoves = getValidMoves(newBoard, BLUE);
					if (playerMoves.length === 0) {
						const aiHasMoves = getValidMoves(newBoard, RED).length > 0;
						if (!aiHasMoves) {
							endGame(newBoard);
						} else {
							sfx.play("wrong"); setMessage("汉军无棋可下，轮到楚军");
							setCurrentPlayer(RED);
							setTimeout(() => runAIMove(newBoard), 600);
						}
					} else {
						setCurrentPlayer(BLUE);
						setMessage("");
					}
				}, 550);
			}, 600);
		},
		[endGame]
	);

	const handleCellClick = useCallback(
		(x: number, y: number) => {
			if (phase !== "playing") return;
			if (currentPlayer !== BLUE) return;
			if (aiThinking) return;
			if (!validMoves.has(`${x},${y}`)) return;

			const flipped = getFlippedCells(board, x, y, BLUE);
			setFlippingCells(flipped);
			setLastMove({ x, y });
			sfx.play("place");
			if (flipped.size > 0) sfx.play("flip");

			setTimeout(() => {
				const newBoard = place(board, x, y, BLUE);
				setBoard(newBoard);
				setFlippingCells(new Set());

				const aiHasMoves = getValidMoves(newBoard, RED).length > 0;
				const playerHasMovesAfter = getValidMoves(newBoard, BLUE).length > 0;

				if (!aiHasMoves && !playerHasMovesAfter) {
					endGame(newBoard);
				} else if (!aiHasMoves) {
					setMessage("楚军无棋可下，汉军继续");
				} else {
					setCurrentPlayer(RED);
					setMessage("");
					setTimeout(() => runAIMove(newBoard), 100);
				}
			}, 550);
		},
		[board, currentPlayer, phase, aiThinking, validMoves, endGame, runAIMove]
	);

	useEffect(() => {
		if (phase !== "playing") return;
		if (currentPlayer !== BLUE) return;

		const playerMoves = getValidMoves(board, BLUE);
		if (playerMoves.length === 0) {
			const aiMoves = getValidMoves(board, RED);
			if (aiMoves.length === 0) {
				endGame(board);
			} else {
				sfx.play("wrong"); setMessage("汉军无棋可下，轮到楚军");
				setCurrentPlayer(RED);
				setTimeout(() => runAIMove(board), 600);
			}
		}
	}, [board, currentPlayer, phase, endGame, runAIMove]);

	useEffect(() => {
		return () => {
			if (aiTimeoutRef.current !== null) {
				window.clearTimeout(aiTimeoutRef.current);
			}
		};
	}, []);

	const handleRestart = () => {
		if (aiTimeoutRef.current !== null) {
			window.clearTimeout(aiTimeoutRef.current);
			aiTimeoutRef.current = null;
		}
		sfx.resetCombo(); setBoard(createInitialBoard());
		setCurrentPlayer(BLUE);
		setPhase("playing");
		setMessage("");
		setFlippingCells(new Set());
		setLastMove(null);
		setAiThinking(false);
		outcomeCalledRef.current = false;
	};

	const currentTurnText =
		currentPlayer === BLUE ? "汉军回合 · 点击落子" : aiThinking ? "楚军思考中…" : "楚军回合";

	return (
		<div className="zu-root">
			<div className="zu-hud">
				<div className="zu-title-wrap">
					<div className="zu-title serif">诸侯争霸</div>
					<div className="zu-subtitle">楚汉相争 · 逐鹿中原</div>
				</div>
				<div className="zu-scoreboard">
					<div className={`zu-score zu-score-blue ${currentPlayer === BLUE && phase === "playing" ? "zu-active" : ""}`}>
						<div className="zu-piece-dot zu-dot-blue" />
						<span className="zu-score-label">汉</span>
						<span className="zu-score-num">{blue}</span>
					</div>
					<div className="zu-score-divider">:</div>
					<div className={`zu-score zu-score-red ${currentPlayer === RED && phase === "playing" ? "zu-active" : ""}`}>
						<span className="zu-score-num">{red}</span>
						<span className="zu-score-label">楚</span>
						<div className="zu-piece-dot zu-dot-red" />
					</div>
				</div>
			</div>

			<div className="zu-turn-indicator">
				{message ? (
					<span className="zu-turn-msg">{message}</span>
				) : (
					<span className={phase === "playing" ? (currentPlayer === BLUE ? "zu-turn-blue" : "zu-turn-red") : ""}>
						{currentTurnText}
					</span>
				)}
			</div>

			<div className="zu-board-wrap">
				<div className="zu-board">
					{board.map((row, r) => (
						<div key={r} className="zu-row">
							{row.map((cell, c) => {
								const key = `${r},${c}`;
								const isValid = validMoves.has(key);
								const isFlipping = flippingCells.has(key);
								const isLast = lastMove?.x === r && lastMove?.y === c;
								return (
									<button
										key={c}
										type="button"
										className={[
											"zu-cell",
											isValid ? "zu-cell-valid" : "",
											isLast ? "zu-cell-last" : "",
										]
											.filter(Boolean)
											.join(" ")}
										onClick={() => handleCellClick(r, c)}
										disabled={phase !== "playing" || currentPlayer !== BLUE || aiThinking || !isValid}
									>
										{cell !== EMPTY && (
											<div
												className={[
													"zu-piece",
													cell === BLUE ? "zu-piece-blue" : "zu-piece-red",
													isFlipping ? "zu-piece-flipping" : "",
												]
													.filter(Boolean)
													.join(" ")}
											>
												<div className="zu-piece-inner">
													<div className="zu-piece-front">
														<span className="zu-piece-char serif">
															{cell === BLUE ? "汉" : "楚"}
														</span>
													</div>
													<div className="zu-piece-back">
														<span className="zu-piece-char serif">
															{cell === BLUE ? "楚" : "汉"}
														</span>
													</div>
												</div>
											</div>
										)}
										{cell === EMPTY && isValid && <div className="zu-hint-dot" />}
									</button>
								);
							})}
						</div>
					))}
				</div>
			</div>

			<p className="zu-hint">
				落子后，若己方棋子在任意方向夹住连续的楚军（1-3枚），可将其翻转为汉军。逐城争夺，直至棋满。
			</p>

			<div className="zu-controls">
				<button className="btn btn-ghost" onClick={handleRestart} type="button">
					<RotateCcw size={14} /> 重开
				</button>
				<button className="btn btn-ghost" onClick={onSkip} type="button">
					<SkipForward size={14} /> 跳过
				</button>
			</div>

			{phase === "won" && (
				<div className="zu-overlay zu-win">
					<CheckCircle2 size={48} />
					<div className="zu-overlay-title serif">六合归秦</div>
					<div className="zu-overlay-sub">天下一统！ · 汉 {blue} : 楚 {red} · 得分 {calcScore(blue, red)}</div>
				</div>
			)}
			{phase === "lost" && (
				<div className="zu-overlay zu-lose">
					<XCircle size={48} />
					<div className="zu-overlay-title serif">楚虽三户</div>
					<div className="zu-overlay-sub">亡秦必楚！ · 汉 {blue} : 楚 {red}</div>
				</div>
			)}
		</div>
	);
}
