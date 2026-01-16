import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://viztopia.github.io',
  base: '/Boundary-Marker',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
