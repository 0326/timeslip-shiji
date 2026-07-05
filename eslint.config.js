import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{ ignores: ["dist", "node_modules"] },
	// ── 全局规则 ──
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
				},
			],
		},
	},
	// ── ink-vn-core 包边界规则 ──
	// 核心包源码（src/）不得 import 任何 app 层代码（根目录 src/）或 React，保持领域无关
	// 注意：test/ 文件可以导入同包 src/ 下的代码，这是正常的
	{
		files: ["packages/ink-vn-core/src/**/*.ts"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						{
							// From packages/ink-vn-core/src/, ../../../src/ points to root src/
							group: ["../../../src/**"],
							message: "ink-vn-core must not import app-layer code from src/",
						},
						{
							group: ["react", "react-dom", "react-router-dom", "zustand", "framer-motion"],
							message: "ink-vn-core must not depend on React or app frameworks",
						},
					],
				},
			],
		},
	},
);
