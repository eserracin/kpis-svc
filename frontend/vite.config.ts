import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from './package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dependencies = pkg.dependencies;

export default defineConfig({
  plugins: [
    react(), 
    federation({
      name: 'kpis_ui',
      filename: 'remoteEntry.js',
      remotes: {
        dashboard_ui: {
          type: 'module',
          entry: 'http://localhost:5300/remoteEntry.js',
          name: 'dashboard_ui',
          entryGlobalName: 'dashboard_ui',
          shareScope: 'default',
        },
      },
      exposes: {
        './KpiCardDashboard': './src/components/KpiCardDashboard.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: dependencies['react'],
        },
        'react-dom': {
          singleton: true,
          requiredVersion: dependencies['react-dom'],
        },
        'react-router-dom': {
          singleton: true,
          requiredVersion: dependencies['react-router-dom'],
        },
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: dependencies['@tanstack/react-query'],
        },
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3002,
    host: '0.0.0.0',
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8002',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: 3002,
  },
});
