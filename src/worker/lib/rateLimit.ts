// 简单的 KV 固定窗口限流。绑定缺失时直接放行（本地开发无 KV）。
export async function rateLimit(
	kv: KVNamespace | undefined,
	key: string,
	limit: number,
	windowSec: number,
): Promise<boolean> {
	if (!kv) return true; // 无 KV → 不限流
	const k = `rl:${key}`;
	const cur = parseInt((await kv.get(k)) ?? "0", 10);
	if (cur >= limit) return false;
	await kv.put(k, String(cur + 1), { expirationTtl: windowSec });
	return true;
}
