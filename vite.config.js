import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import sitemap from 'vite-plugin-sitemap'
import { robots } from 'vite-plugin-robots'

// Define your routes for the sitemap
const routes = [
  '/',
  '/fonts',
  '/about',
  '/contact',
  '/terms',
 
  // Dynamic routes will be added from fonts.json during build
]

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    sitemap({
      hostname: 'https://yourdomain.com/font-app',
      lastmod: new Date().toISOString(),
      routes,
      changefreq: 'weekly',
      priority: 0.8,
      exclude: ['/404']
    }),
    robots({
      sitemap: 'https://yourdomain.com/font-app/sitemap.xml',
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/admin', '/private'],
        }
      ]
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  publicDir: 'public',
  build: {
    assetsDir: 'assets'
  }
})
