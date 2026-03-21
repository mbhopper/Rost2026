import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const alias = {
  'react-router-dom': new URL('./vendor/react-router-dom/index.js', import.meta.url).pathname,
  zustand: new URL('./vendor/zustand/index.js', import.meta.url).pathname,
  clsx: new URL('./vendor/clsx/index.js', import.meta.url).pathname,
  'class-variance-authority': new URL('./vendor/class-variance-authority/index.js', import.meta.url).pathname,
  'qrcode.react': new URL('./vendor/qrcode.react/index.js', import.meta.url).pathname,
  'date-fns': new URL('./vendor/date-fns/index.js', import.meta.url).pathname,
  'lucide-react': new URL('./vendor/lucide-react/index.js', import.meta.url).pathname,
};

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  server: {
    port: 5173,
    host: true,
  },
});
