import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  // Shared component .css uses Tailwind @apply; compile it to plain CSS.
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [/^react($|\/)/, /^react-dom($|\/)/, /^@pumpkin-spice\//, /^lit/],
    },
  },
});
