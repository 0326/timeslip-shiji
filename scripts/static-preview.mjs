// 无依赖静态服务器 + SPA 回退，用于本地验证已构建的客户端产物。
// 仅供预览：/api/* 不可用（前端会优雅降级）。
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, normalize } from "node:path";

const ROOT = join(process.cwd(), "dist/client");
const PORT = Number(process.env.PORT ?? 4399);

const MIME = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".webp": "image/webp",
	".woff2": "font/woff2",
	".ico": "image/x-icon",
};

async function serveFile(res, path) {
	const data = await readFile(path);
	res.writeHead(200, { "content-type": MIME[extname(path)] ?? "application/octet-stream" });
	res.end(data);
}

createServer(async (req, res) => {
	try {
		const url = new URL(req.url, `http://localhost:${PORT}`);
		if (url.pathname.startsWith("/api/")) {
			res.writeHead(503, { "content-type": "application/json" });
			res.end(JSON.stringify({ error: "api_unavailable_in_static_preview" }));
			return;
		}
		const rel = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
		const candidate = join(ROOT, rel);
		try {
			const s = await stat(candidate);
			if (s.isFile()) return await serveFile(res, candidate);
		} catch {
			/* fall through to SPA */
		}
		// SPA 回退
		return await serveFile(res, join(ROOT, "index.html"));
	} catch (e) {
		res.writeHead(500);
		res.end(String(e));
	}
}).listen(PORT, () => console.log(`static preview on http://localhost:${PORT}`));
