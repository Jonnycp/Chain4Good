import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    nodePolyfills({
      include: ["buffer", "process"],
    }),
    VitePWA({
      strategies: "generateSW",
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
        type: "module",
      },
      includeAssets: [
        "favicon.svg",
        "logos/logo-192x192.png",
        "logos/logo-512x512.png",
      ],
      manifest: {
        name: "Chain4Good",
        short_name: "C4G",
        description: "Crowdfunding etico e trasparente su Blockchain",
        theme_color: "#6AAB29",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        screenshots: [
          {
            src: "/screenshots/mobile-1.png",
            sizes: "1080x1920",
            type: "image/png",
            form_factor: "narrow",
            label: "Progetto singolo su Chain4Good",
          },
          {
            src: "/screenshots/desktop-1.png",
            sizes: "1920x1080",
            type: "image/png",
            form_factor: "wide",
            label: "Schermata principale Chain4Good",
          },
        ],
        icons: [
          {
            src: "logos/logo-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "logos/logo-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  define: {
    global: "globalThis",
  },
});
