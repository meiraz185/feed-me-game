import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path must match the GitHub repository name so asset URLs resolve correctly
// at https://<username>.github.io/feed-me-game/
export default defineConfig({
  plugins: [react()],
  base: '/feed-me-game/',
});
