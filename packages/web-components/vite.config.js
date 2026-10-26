import { defineConfig } from 'vite';

export default defineConfig({
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
