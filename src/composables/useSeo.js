import { useHead } from '@vueuse/head'
import { useRoute } from 'vue-router'
import { watch, computed } from 'vue'
import { generateSeoMeta } from '../utils/seo'

/**
 * Composable for handling SEO in dynamic routes with reactive updates
 * 
 * @param {Function} metaGenerator - Function that returns SEO meta object based on route or props
 * @returns {Object} - Reactive meta object
 */
export function useSeo(metaGenerator) {
  const route = useRoute()
  
  // Compute meta data based on current route
  const meta = computed(() => {
    return generateSeoMeta(metaGenerator(route))
  })
  
  // Apply meta tags
  useHead(meta)
  
  // Update meta when route changes
  watch(
    () => route.params,
    () => {
      useHead(meta.value)
    },
    { deep: true }
  )
  
  return { meta }
}

/**
 * Composable for handling SEO with reactive data
 * 
 * @param {Object|Function} metaData - Static object or function that returns SEO meta data
 * @returns {Object} - Reactive meta object
 */
export function useStaticSeo(metaData) {
  // Handle both object and function inputs
  const meta = typeof metaData === 'function' 
    ? computed(metaData)
    : computed(() => generateSeoMeta(metaData))
  
  // Apply meta tags
  useHead(meta)
  
  return { meta }
} 