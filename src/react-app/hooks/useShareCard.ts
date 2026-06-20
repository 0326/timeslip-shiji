import { useCallback } from "react";

export interface ShareCardParams {
	achievementName: string;
	achievementDesc: string;
	classicalQuote: string;
	icon: string;
	characterName?: string;
}

/** 用 Canvas 绘制竖版成就分享卡，返回可下载的 dataURL */
export function useShareCard() {
	const generate = useCallback(async (p: ShareCardParams): Promise<string> => {
		// 等待字体就绪，避免回退系统字体
		if (document.fonts && document.fonts.ready) {
			try {
				await document.fonts.ready;
			} catch {
				/* ignore */
			}
		}

		const W = 600;
		const H = 900;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const canvas = document.createElement("canvas");
		canvas.width = W * dpr;
		canvas.height = H * dpr;
		const ctx = canvas.getContext("2d")!;
		ctx.scale(dpr, dpr);

		// 背景
		const bg = ctx.createLinearGradient(0, 0, 0, H);
		bg.addColorStop(0, "#14110d");
		bg.addColorStop(1, "#0d0b08");
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, W, H);

		// 金色双框
		ctx.strokeStyle = "#b8973a";
		ctx.lineWidth = 2;
		ctx.strokeRect(24, 24, W - 48, H - 48);
		ctx.strokeStyle = "rgba(184,151,58,0.35)";
		ctx.lineWidth = 1;
		ctx.strokeRect(34, 34, W - 68, H - 68);

		ctx.textAlign = "center";

		// 顶部 Logo
		ctx.fillStyle = "#b8973a";
		ctx.font = '700 22px "Noto Serif SC", serif';
		ctx.fillText("穿越 · 史记", W / 2, 86);
		ctx.fillStyle = "rgba(242,236,216,0.4)";
		ctx.font = '400 13px "Noto Sans SC", sans-serif';
		ctx.fillText("ACHIEVEMENT UNLOCKED", W / 2, 110);

		// 图标
		ctx.font = "84px serif";
		ctx.fillText(p.icon, W / 2, 250);

		// 成就名
		ctx.fillStyle = "#f2ecd8";
		ctx.font = '700 40px "Noto Serif SC", serif';
		ctx.fillText(p.achievementName, W / 2, 340);

		// 描述
		ctx.fillStyle = "rgba(242,236,216,0.7)";
		ctx.font = '400 18px "Noto Sans SC", sans-serif';
		wrap(ctx, p.achievementDesc, W - 140).forEach((line, i) => {
			ctx.fillText(line, W / 2, 390 + i * 30);
		});

		// 朱印分隔
		ctx.fillStyle = "#c0392b";
		ctx.fillRect(W / 2 - 24, 470, 48, 3);

		// 原文
		ctx.fillStyle = "rgba(242,236,216,0.55)";
		ctx.font = '400 21px "Noto Serif SC", serif';
		wrap(ctx, p.classicalQuote, W - 160).forEach((line, i) => {
			ctx.fillText(line, W / 2, 540 + i * 38);
		});

		// 底部署名
		ctx.fillStyle = "#b8973a";
		ctx.font = '500 17px "Noto Sans SC", sans-serif';
		const name = p.characterName ? `我在《穿越·史记》中穿越成了 ${p.characterName}` : "我在《穿越·史记》中亲历了一段历史";
		ctx.fillText(name, W / 2, H - 90);

		// 仿二维码方块装饰
		drawFakeQR(ctx, W / 2 - 30, H - 72, 24);

		return canvas.toDataURL("image/png");
	}, []);

	return { generate };
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
	const lines: string[] = [];
	let cur = "";
	for (const ch of text) {
		if (ctx.measureText(cur + ch).width > maxWidth) {
			lines.push(cur);
			cur = ch;
		} else {
			cur += ch;
		}
	}
	if (cur) lines.push(cur);
	return lines;
}

function drawFakeQR(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
	const cells = 6;
	const s = size / cells;
	ctx.fillStyle = "rgba(242,236,216,0.55)";
	// 固定图案（避免随机），仅作装饰
	const pattern = [
		[1, 1, 1, 0, 1, 1],
		[1, 0, 1, 0, 0, 1],
		[1, 1, 1, 0, 1, 0],
		[0, 0, 0, 1, 0, 1],
		[1, 0, 1, 0, 1, 1],
		[1, 1, 0, 1, 0, 1],
	];
	for (let r = 0; r < cells; r++) {
		for (let c = 0; c < cells; c++) {
			if (pattern[r][c]) ctx.fillRect(x + c * s, y + r * s, s, s);
		}
	}
}
