import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode || 'development', process.cwd(), '');
  const port = parseInt(env.PORT || process.env.PORT || '3000', 10);
  const targetHost = env.API_TARGET || `http://localhost:${port}`;

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port,
      proxy: {
        '/api': {
          target: targetHost,
          changeOrigin: true,
          secure: false,
          ws: true,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.warn(`[Vite Proxy] Warning: Unable to proxy ${req.url} to ${options.target}. Backend service may be starting or offline.`);
              if (res && 'writeHead' in res && !(res as any).headersSent) {
                (res as any).writeHead(503, { 'Content-Type': 'application/json' });
                (res as any).end(JSON.stringify({
                  error: 'Backend API Service Offline',
                  message: `Could not reach API backend at ${options.target}. If running standalone client mode, ensure backend is running with 'npm run dev:server'.`,
                  status: 503,
                }));
              }
            });
          },
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port,
    },
  };
});
