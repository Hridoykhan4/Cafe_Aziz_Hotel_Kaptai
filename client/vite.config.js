import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  build: {
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        safari10: true,
      },
    },

    rollupOptions: {
      output: {
        /*
          WHY THIS CHANGED:
          ─────────────────────────────────────────────────────────────
          The old config put framer-motion in "ui-vendor" chunk.
          framer-motion is imported by: Main.jsx, Cover.jsx, FoodCard.jsx,
          Banner.jsx, Navbar.jsx, Order.jsx, Dashboard.jsx — basically
          every single page.

          When a user visits /order for the first time:
            1. Browser loads main bundle
            2. Main bundle discovers it needs "ui-vendor" (framer-motion)
            3. Browser fetches "ui-vendor" chunk (separate network request)
            4. Only THEN can React render anything with motion.*

          This sequential waterfall is what caused the blank screen until
          reload (second visit has the chunk cached, first visit does not).

          FIX: Keep firebase separate (large, only needed for auth pages)
          and react-router together (tight coupling). Let framer-motion
          and sweetalert2 be part of the main vendor bundle — they're
          needed on page 1 anyway, so splitting them only adds latency.
          ─────────────────────────────────────────────────────────────
        */
        manualChunks: {
          // Firebase is large (~300KB) and only needed after login
          // Splitting it means auth pages load it on demand, not upfront
          "firebase-vendor": ["firebase/app", "firebase/auth"],
          // React core — small, always needed, good to isolate for caching
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // Recharts is large and only used on AdminHome — split it
          "chart-vendor": ["recharts"],
        },
      },
    },
  },
});
