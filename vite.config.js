import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['three'], // Separate Three.js into its own chunk
        },
      },
    },
  },
});
