/**
 * Default SEO configuration for the application
 */
export const defaultSeoMeta = {
  title: 'Kotype - Font Library',
  description: 'Explore beautiful fonts for your next project with Kotype, the modern font library.',
  keywords: 'fonts, typography, web fonts, design, kotype',
  author: 'Kotype',
  image: '/src/assets/kotype.svg',
  ogTitle: 'Kotype - Font Library',
  ogDescription: 'Explore beautiful fonts for your next project',
  ogType: 'website',
  ogUrl: 'https://yourdomain.com/kotype/',
  twitterCard: 'summary_large_image',
}

/**
 * Generate SEO meta tags for specific pages
 * @param {Object} meta - Custom meta data to override defaults
 * @returns {Object} Complete meta configuration
 */
export function generateSeoMeta(meta = {}) {
  return {
    title: meta.title || defaultSeoMeta.title,
    meta: [
      { name: 'description', content: meta.description || defaultSeoMeta.description },
      { name: 'keywords', content: meta.keywords || defaultSeoMeta.keywords },
      { name: 'author', content: meta.author || defaultSeoMeta.author },
      
      // Open Graph
      { property: 'og:title', content: meta.ogTitle || meta.title || defaultSeoMeta.ogTitle },
      { property: 'og:description', content: meta.ogDescription || meta.description || defaultSeoMeta.ogDescription },
      { property: 'og:type', content: meta.ogType || defaultSeoMeta.ogType },
      { property: 'og:url', content: meta.ogUrl || defaultSeoMeta.ogUrl },
      { property: 'og:image', content: meta.image || defaultSeoMeta.image },
      
      // Twitter
      { name: 'twitter:card', content: meta.twitterCard || defaultSeoMeta.twitterCard },
      { name: 'twitter:title', content: meta.title || defaultSeoMeta.title },
      { name: 'twitter:description', content: meta.description || defaultSeoMeta.description },
      { name: 'twitter:image', content: meta.image || defaultSeoMeta.image },
    ],
    link: [
      { rel: 'canonical', href: meta.canonicalUrl || defaultSeoMeta.ogUrl }
    ]
  }
} 