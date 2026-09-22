import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api/v1": {
        target: "https://paymentgateway.daeroom.my.id",
        changeOrigin: true,
        secure: false
      }
    }
  }
});
