import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { reihDevTunnel } from './vite-plugins/reihDevTunnel.js';
import { reihStageEnv } from './vite-plugins/reihStageEnv.js';
import { WIDGET_DEV_API_BASE_URL } from './src/widgetEnv.js';

const reihApiProxy = {
  '/api/reih': {
    target: WIDGET_DEV_API_BASE_URL,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/reih/, ''),
  },
};

export default defineConfig({
  plugins: [reihStageEnv(), reihDevTunnel(), react()],
  server: {
    port: 5180,
    strictPort: true,
    proxy: reihApiProxy,
  },
  preview: {
    port: 5180,
    strictPort: true,
    proxy: reihApiProxy,
  },
});
