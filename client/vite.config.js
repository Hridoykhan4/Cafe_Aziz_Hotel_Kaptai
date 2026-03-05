import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 1. Change target to 'es2015' for better deployment stability
    target: "es2015",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      // 2. Add this to prevent 'i' variable mangling issues
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        // 3. Keep chunks simpler to avoid circular initialization issues
        manualChunks: {
          "firebase-vendor": [
            "firebase/app",
            "firebase/auth",
            "firebase/firestore",
          ],
          "ui-vendor": ["framer-motion", "sweetalert2"],
          "react-vendor": ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});