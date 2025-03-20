import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/font-app/',
  optimizeDeps: {
    exclude: ['crypto']
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
