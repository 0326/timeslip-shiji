import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
	plugins: [
		react(),
		// cloudflare({
		// 	configPath: "./wrangler.json",
		// 	remoteBindings: false,
		// }),
	],
	resolve: {
		alias: {
			"ink-vn-core": path.resolve(__dirname, "packages/ink-vn-core/src/index.ts"),
		},
		// 强制 React 单实例，避免 R3F 的 react-reconciler 拿到独立 React 副本
		dedupe: ["react", "react-dom", "scheduler"],
	},
	build: {
		rollupOptions: {
			output: {
				// 第三方依赖拆成稳定 vendor chunk，主包只保留应用代码 + 共享运行时。
				// 注意顺序：@react-three 含 "react" 子串，须先于 react 判定。
				manualChunks(id: string) {
					if (!id.includes("node_modules")) return;
					if (id.includes("@react-three") || id.includes("three")) return "vendor-three";
					if (id.includes("framer-motion")) return "vendor-framer";
					if (id.includes("d3-") || id.includes("/d3/") || id.includes("/d3.")) return "vendor-d3";
					if (id.includes("inkjs")) return "vendor-ink";
					if (
						id.includes("react") ||
						id.includes("zustand") ||
						id.includes("react-router") ||
						id.includes("scheduler")
					)
						return "vendor-react";
					if (id.includes("lucide-react")) return "vendor-lucide";
					return "vendor-other";
				},
			},
		},
	},
});
