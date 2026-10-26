import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // Shared component .css uses Tailwind @apply; compile it to plain CSS.
  plugins: [tailwindcss()],
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rollupOptions: {
      // Consumers install lit once; don't ship a second copy inside this bundle.
      external: [/^lit/],
    },
  },
});
