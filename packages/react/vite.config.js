import tailwindcss from '@tailwindcss/postcss';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  // Shared component .scss uses Tailwind @apply; compile it to plain CSS.
  css: { postcss: { plugins: [tailwindcss()] } },
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
