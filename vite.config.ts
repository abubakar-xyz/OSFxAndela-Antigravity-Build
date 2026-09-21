import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// No dev server block and no proxy: Vite runs as middleware inside server.js,
// so the UI, the /api routes and the /live WebSocket are all one origin on one
// port. See the comment at the top of server.js for why that matters.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' }
});
