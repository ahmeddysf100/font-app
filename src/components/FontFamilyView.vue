<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFontStore } from '../stores/fonts'
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_STYLES, generateFontStyle, getSpecializedFontStyles } from '../utils/fontUtils'

const route = useRoute()
const router = useRouter()
const fontStore = useFontStore()

// Get the font from the store based on route params
const fontId = parseInt(route.params.id)
const font = computed(() => fontStore.currentFont || fontStore.getFontById(fontId) || {})

// Set default sample text for Arabic fonts
const getDefaultSampleText = () => {
  // If the font name starts with "KO" or "Ko", it's probably an Arabic font
  if (font.value && font.value.name && (font.value.name.startsWith('KO') || font.value.name.startsWith('Ko'))) {
    return 'السلام عليكم';
  }
  return font.value?.name || 'Sample Text';
};

// Sample text for displaying styles
const sampleText = ref(getDefaultSampleText())

// Get available styles for this font
const fontStyles = computed(() => {
  if (!font.value || !font.value.name) return [];
  
  // Get specialized font styles from fontUtils
  const allStyles = getSpecializedFontStyles();
  
  // Find the matching font family styles
  switch (font.value.name) {
    case 'KOAynama Sharp':
    case 'KOAynama Curved':
      return allStyles.koAynamaStyles;
    case 'Ko Banzeen':
      return allStyles.koBanzeenStyles;
    case 'KoKhalaya':
    case 'KoKhalaya Variable':
      return allStyles.koKhalayaStyles;
    case 'KORubbama':
    case 'KORubbama Expanded':
      return allStyles.koRubbamaStyles;
    case 'Satoshi':
    case 'Satoshi Variable':
      return allStyles.satoshiStyles.concat(allStyles.satoshiVariableStyles);
    default:
      // Return all styles that might match this font name
      return allStyles.allStyles.filter(style => 
        style.name.toLowerCase().includes(font.value.name.toLowerCase())
      );
  }
});

// Back to font detail
const backToFontDetail = () => {
  router.push(`/fonts/${fontId}`);
};

onMounted(() => {
  // Ensure the font is loaded in the store
  fontStore.setCurrentFont(fontId);
});

// Watch for changes in route params and update the page accordingly
watch(() => route.params.id, (newId) => {
  const id = parseInt(newId);
  fontStore.setCurrentFont(id);
  
  // Update sample text with default for the new font
  sampleText.value = getDefaultSampleText();
}, { immediate: true });
</script>

<template>
  <div class="font-family-view bg-black text-white min-h-screen">
    <!-- Header -->
    <div class="px-6 pt-4">
      <v-btn color="gray" variant="text" @click="backToFontDetail" class="mb-4">
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Font Detail
      </v-btn>
      
      <div class="border-b border-gray-800 pb-4 mb-6">
        <h1 class="text-2xl font-bold">{{ font.name }} Family</h1>
        <p class="text-gray-400 mt-2">
          Designed by {{ font.designer }}
          <span v-if="font.styleCount"> • {{ font.styleCount }} styles</span>
          <span v-if="font.isPremium"> • Premium</span>
        </p>
      </div>
    </div>
    
    <!-- Font Family Styles -->
    <div class="px-6">
      <div v-if="fontStyles.length === 0" class="text-center py-12 text-gray-400">
        No styles available for this font.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(style, index) in fontStyles" 
          :key="index"
          class="font-style-card border border-gray-800 p-4 rounded-lg hover:border-yellow-500 transition-colors"
        >
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-medium">{{ style.name }}</h3>
            <v-chip 
              size="small" 
              color="gray" 
              variant="outlined"
              class="text-xs"
            >
              {{ style.value.fontWeight || 'Regular' }} {{ style.value.fontStyle || 'Normal' }}
            </v-chip>
          </div>
          
          <div 
            class="font-preview py-6 text-center"
            :style="style.value"
          >
            {{ sampleText }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-preview {
  font-size: 32px;
  line-height: 1.3;
  min-height: 100px;
  transition: all 0.3s ease;
}

/* Make the style cards responsive */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style> 