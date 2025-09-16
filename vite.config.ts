import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(() => {
  const env = loadEnv(process.env.NODE_ENV as string, process.cwd(), "VITE_");
  return {
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          headers: {
            "X-API-KEY": env.VITE_XAPI_KEY,
          },
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
    plugins: [tailwindcss(), react()],
  };
});
