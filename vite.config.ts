import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import path from "path";

export default defineConfig({
	plugins: [react(), cloudflare()],
	resolve: {
		alias: {
			"ink-vn-core": path.resolve(__dirname, "packages/ink-vn-core/src/index.ts"),
		},
	},
});
