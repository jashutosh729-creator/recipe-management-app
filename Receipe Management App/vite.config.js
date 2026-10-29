import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // React Router is currently hoisted to the parent workspace's node_modules.
    // Force it and the app to use this project's React instance.
    dedupe: ['react', 'react-dom'],
  },
})
