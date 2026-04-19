import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@src': path.resolve(dirname, 'src'),
      '@assets': path.resolve(dirname, 'src/assets'),
      '@components': path.resolve(dirname, 'src/components'),
      '@hooks': path.resolve(dirname, 'src/hooks'),
      '@pages': path.resolve(dirname, 'src/pages'),
      '@utils': path.resolve(dirname, 'src/utils'),
      '@styles': path.resolve(dirname, 'src/styles'),
    }
  }
});
