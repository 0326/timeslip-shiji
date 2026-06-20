// Worker 绑定类型（全部可选：缺失时相关功能优雅降级，不阻塞游戏）。
// 生产环境通过 `wrangler secret put ANTHROPIC_API_KEY`、wrangler.json vars / kv_namespaces 注入。
export interface Bindings {
	/** Anthropic 密钥（仅服务端可见）。未配置时 /api/hint 返回 503，前端回退本地启发。 */
	ANTHROPIC_API_KEY?: string;
	/** 允许调用 /api/hint 的来源，逗号分隔。未配置时不做来源校验（便于本地开发）。 */
	ALLOWED_ORIGIN?: string;
	/** 限流计数 KV。未绑定时跳过限流。 */
	RL_KV?: KVNamespace;
}
