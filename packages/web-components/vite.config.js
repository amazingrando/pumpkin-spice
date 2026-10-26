import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      // Consumers install lit and the stylesheet once; don't bundle copies.
      external: [/^lit/, /^@pumpkin-spice\//],
    },
  },
});
