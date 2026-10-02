import { defineConfig } from 'vite'

export default defineConfig({
  // iPad の Safari から LAN アクセスできるよう host を開放
  base: './',
  server: {
    host: true,
    port: 5173,
  },
})
