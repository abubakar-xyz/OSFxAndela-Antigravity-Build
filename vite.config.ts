import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// The browser talks to one origin. In dev, Vite forwards the voice socket and
// the Gemini-backed REST calls to the node proxy; in production both are served
// together. This is what lets `resolveSocketUrl()` use the page's own host, so
// WAZI works when the dev server is opened from a phone on the same network —
// the previous hardcoded ws://localhost:8080 never could.
const PROXY_TARGET = process.env.WAZI_PROXY_TARGET || 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/live': { target: PROXY_TARGET, ws: true, changeOrigin: true },
      '/api': { target: PROXY_TARGET, changeOrigin: true }
    }
  }
});
