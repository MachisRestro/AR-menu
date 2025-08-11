import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/submit': {
        target: 'https://script.google.com/macros/s/AKfycbxZ9_-fkYafvQU11aPWESzlfWQIOwzryJul9HkCrKqJFt97sIk7ursBIvFB7lF4T985/exec',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/submit/, ''),
      }
    }
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
