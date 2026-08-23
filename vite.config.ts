import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Using relative paths so it works seamlessly on GitHub Pages
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
