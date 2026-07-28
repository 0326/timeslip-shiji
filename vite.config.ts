import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
	plugins: [
		react(),
		cloudflare({
			configPath: "./wrangler.json",
			remoteBindings: false,
		}),
	],
	resolve: {
		alias: {
			"ink-vn-core": path.resolve(__dirname, "packages/ink-vn-core/src/index.ts"),
		},
		// 强制 React 单实例，避免 R3F 的 react-reconciler 拿到独立 React 副本
		dedupe: ["react", "react-dom", "scheduler"],
	},
});
