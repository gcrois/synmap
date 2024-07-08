import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	base: "/synmap/",
	plugins: [react()],
	build: {
		rollupOptions: {
			input: {
				main: "./index.html",
				popout: "./popout.html",
			},
		},
	},
	resolve: {
		alias: {
			"@src": path.resolve(__dirname, "./src"),
			"@app": path.resolve(__dirname, "./app"),
			"@assets": path.resolve(__dirname, "./assets"),
		},
	},
	define: {
		"import.meta.env.VITE_BUILD_DATE": new Date(),
		"import.meta.env.VITE_APP_VERSION": JSON.stringify(
			process.env.npm_package_version,
		),
	},
});
