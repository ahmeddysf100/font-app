<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFontStore } from '../stores/fonts'
import { useSittingsStore } from "../stores/sittings";
import { generateFontStyle } from '../utils/fontUtils'
// Import fonts from fontLoader
import { fonts } from "../utils/fontLoader";

const route = useRoute()
const router = useRouter()
const fontStore = useFontStore()
const settingsStore = useSittingsStore();

// Mobile detection
const isMobile = ref(false);

// Check screen size function
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 868;
};

// Get the font from the store based on route params
const fontId = parseInt(route.params.id)
const font = computed(() => fontStore.currentFont || fontStore.getFontById(fontId) || {})

// Get current font data from the new fonts array
const currentFontData = computed(() => {
  return fonts.find((f) => f.name === font.value.name) || null;
});

// Set default sample text for Arabic fonts
const getDefaultSampleText = () => {
  if (isArabicFont.value) {
    return 'السلام عليكم';
  }
  return font.value?.name || 'Sample Text';
};

// Detect if this is an Arabic font
const isArabicFont = computed(() => {
  return (
    font.value &&
    font.value.name &&
    (font.value.name.startsWith("KO") || font.value.name.startsWith("Ko"))
  );
});

// Text direction based on font type
const textDirection = computed(() => {
  return isArabicFont.value ? "rtl" : "ltr";
});

// Sample text for displaying styles
const sampleText = ref(getDefaultSampleText());
const fontSize = ref(32);
const colorMode = ref("white");

// Filter options
const showVariableFonts = ref(true);
const showStaticFonts = ref(true);
const searchQuery = ref("");
const sortBy = ref("default"); // default, weight-asc, weight-desc, name

// Get available styles based on the new font structure
const fontStyles = computed(() => {
  if (!currentFontData.value) return [];
  
  let allStyles = [];
  
  // Add all static styles from the current font
  if (showStaticFonts.value) {
    allStyles = currentFontData.value.styles.map(style => {
      const baseStyle = generateFontStyle(
        style.fontFamily || currentFontData.value.fontFamily,
        style.weight || 400,
        style.style || "normal"
      );
      
      return {
        id: `${style.name}-${style.weight || 400}-${style.style || "normal"}`,
        name: style.name,
        category: currentFontData.value.category,
        isVariable: false,
        value: {
          ...baseStyle,
          fontSize: `${fontSize.value}px`,
          lineHeight: 1.3,
          color: colorMode.value === "white" ? "white" : "black",
          direction: textDirection.value,
        },
        details: {
          weight: style.weight || 400,
          style: style.style || "normal",
          fontFamily: style.fontFamily || currentFontData.value.fontFamily
        }
      };
    });
  }
  
  // Add variable styles if available and enabled
  if (showVariableFonts.value && currentFontData.value.variable) {
    const variableStyles = currentFontData.value.variable.map(varStyle => {
      // Create styles for different weights to showcase variable font capabilities
      return [100, 300, 400, 500, 700, 900].map(weight => {
        const baseStyle = generateFontStyle(
          varStyle.fontFamily,
          weight,
          varStyle.style || "normal"
        );
        
        return {
          id: `variable-${varStyle.style || "normal"}-${weight}`,
          name: `Variable ${varStyle.style === "italic" ? "Italic" : ""} ${weight}`,
          category: currentFontData.value.category,
          isVariable: true,
          value: {
            ...baseStyle,
            fontSize: `${fontSize.value}px`,
            lineHeight: 1.3,
            color: colorMode.value === "white" ? "white" : "black",
            fontVariationSettings: `'wght' ${weight}`,
            direction: textDirection.value,
          },
          details: {
            weight: weight,
            style: varStyle.style || "normal",
            fontFamily: varStyle.fontFamily
          }
        };
      });
    }).flat();
    
    allStyles = [...allStyles, ...variableStyles];
  }
  
  // Filter by search query if provided
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    allStyles = allStyles.filter(style => 
      style.name.toLowerCase().includes(query) || 
      `${style.details.weight}`.includes(query) ||
      style.details.style.toLowerCase().includes(query)
    );
  }
  
  // Sort styles
  switch (sortBy.value) {
    case "weight-asc":
      return allStyles.sort((a, b) => a.details.weight - b.details.weight);
    case "weight-desc":
      return allStyles.sort((a, b) => b.details.weight - a.details.weight);
    case "name":
      return allStyles.sort((a, b) => a.name.localeCompare(b.name));
    default:
      // Default sorting: variable fonts first, then by weight
      return allStyles.sort((a, b) => {
        if (a.isVariable !== b.isVariable) {
          return a.isVariable ? -1 : 1;
        }
        return a.details.weight - b.details.weight;
      });
  }
});

// Toggle filters
const toggleVariableFonts = () => {
  showVariableFonts.value = !showVariableFonts.value;
};

const toggleStaticFonts = () => {
  showStaticFonts.value = !showStaticFonts.value;
};

// Update font size
const updateFontSize = (size) => {
  fontSize.value = size;
};

// Toggle color mode
const toggleColorMode = () => {
  colorMode.value = colorMode.value === "white" ? "black" : "white";
};

// Back to font detail
const backToFontDetail = () => {
  router.push(`/fonts/${fontId}`);
};

onMounted(() => {
  // Ensure the font is loaded in the store
  fontStore.setCurrentFont(fontId);
  
  // Initialize mobile detection
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

// Watch for changes in route params and update the page accordingly
watch(() => route.params.id, (newId) => {
  const id = parseInt(newId);
  fontStore.setCurrentFont(id);
  
  // Update sample text with default for the new font
  sampleText.value = getDefaultSampleText();
}, { immediate: true });

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div 
    class="font-family-view min-h-screen bg-black text-white"
  >
    <!-- Header -->
    <div class="px-6 pt-4">
      <v-btn 
        variant="text" 
        @click="backToFontDetail" 
        class="mb-4"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Font Detail
      </v-btn>
      
      <div class="border-b border-opacity-20" >
        <div class="flex flex-wrap justify-between items-center pb-4">
          <div>
            <h1 class="text-2xl font-bold">{{ font.name }} Family</h1>
            <p class="text-opacity-70 mt-1 text-gray-400" >
              Designed by {{ font.designer }}
              <span v-if="font.styleCount"> • {{ font.styleCount }} styles</span>
              <span v-if="font.isPremium"> • Premium</span>
            </p>
          </div>
          
          <!-- Controls -->
          <div class="controls mt-3 md:mt-0 flex flex-wrap items-center gap-3">
            <!-- Color mode toggle -->
            <v-btn 
              icon 
              variant="text" 
              @click="toggleColorMode"
            >
              <v-icon>{{ colorMode === 'white' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
            </v-btn>
            
            <!-- Font size slider -->
            <div class="flex items-center">
              <span class="text-sm mr-2 opacity-70">Size</span>
              <v-slider
                v-model="fontSize"
                min="12"
                max="120"
                step="1"
                class="slider-thumb w-24 md:w-32"
                density="compact"
                hide-details
                :track-color="colorMode === 'white' ? '' : ''"
                :thumb-color="colorMode === 'white' ? '' : ''"
                @update:model-value="updateFontSize"
              ></v-slider>
              <span class="text-xs ml-1">{{ fontSize }}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="px-6 py-4">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="search-box flex-grow max-w-md">
          <div class="relative">
            <v-icon 
              class="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-50" 
              size="small"
            >
              mdi-magnify
            </v-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search styles"
              class="w-full py-2 pl-9 pr-4 rounded bg-gray-900 text-white"
            >
          </div>
        </div>
        
        <div class="filter-options flex flex-wrap gap-3">
          <v-chip
            :color="showVariableFonts ? 'yellow' : 'gray'"
            variant="outlined"
            @click="toggleVariableFonts"
            :class="showVariableFonts ? 'border-opacity-100' : 'border-opacity-50 opacity-50'"
          >
            Variable
          </v-chip>
          
          <v-chip
            :color="showStaticFonts ? 'yellow' : 'gray'"
            variant="outlined"
            @click="toggleStaticFonts"
            :class="showStaticFonts ? 'border-opacity-100' : 'border-opacity-50 opacity-50'"
          >
            Static
          </v-chip>
          
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                size="small"
                class="ml-1"
              >
                <v-icon start>mdi-sort</v-icon>
                Sort
              </v-btn>
            </template>
            <v-list :bg-color="colorMode === 'white' ? 'rgb(30, 30, 30)' : 'white'">
              <v-list-item
                value="default"
                @click="sortBy = 'default'"
                :active="sortBy === 'default'"
              >
                <v-list-item-title>Default</v-list-item-title>
              </v-list-item>
              <v-list-item
                value="weight-asc"
                @click="sortBy = 'weight-asc'"
                :active="sortBy === 'weight-asc'"
              >
                <v-list-item-title>Weight (Lightest first)</v-list-item-title>
              </v-list-item>
              <v-list-item
                value="weight-desc"
                @click="sortBy = 'weight-desc'"
                :active="sortBy === 'weight-desc'"
              >
                <v-list-item-title>Weight (Heaviest first)</v-list-item-title>
              </v-list-item>
              <v-list-item
                value="name"
                @click="sortBy = 'name'"
                :active="sortBy === 'name'"
              >
                <v-list-item-title>Name</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
    
    <!-- Font Family Styles -->
    <div class="px-6 pb-12">
      <div v-if="fontStyles.length === 0" class="text-center py-12 opacity-60">
        No styles available with the current filters.
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="style in fontStyles" 
          :key="style.id"
          class="font-style-card rounded-lg transition-all duration-300 overflow-hidden"
          :class="[
            colorMode === 'white' 
              ? 'border border-gray-800 hover:border-yellow-500 ' 
              : 'border border-gray-300 hover:border-yellow-600 hover:shadow-md'
          ]"
        >
          <div class="flex justify-between items-center p-4 border-b border-opacity-20"
               :class="colorMode === 'white' ? 'border-gray-700' : 'border-gray-300'">
            <h3 class="font-medium truncate" :title="style.name">{{ style.name }}</h3>
            <div class="flex items-center gap-2">
              <v-chip 
                v-if="style.isVariable"
                size="x-small" 
                color="yellow" 
                variant="outlined"
                class="text-xs variable-badge"
              >
                Variable
              </v-chip>
              <v-chip 
                size="x-small" 
                :color="colorMode === 'white' ? 'gray' : 'gray-light'" 
                variant="outlined"
                class="text-xs"
              >
                {{ style.details.weight }} {{ style.details.style }}
              </v-chip>
            </div>
          </div>
          
          <div 
            class="font-preview p-6 text-center"
            :style="style.value"
            :dir="textDirection"
            :class="[
            colorMode === 'white' 
              ? ' bg-black text-white' 
              : ' bg-white text-black'
          ]"
          >
            {{ sampleText }}
          </div>
          
          <div v-if="style.isVariable" class="variable-controls p-3 border-t border-opacity-20"
               :class="colorMode === 'white' ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-gray-100'">
            <div class="flex items-center">
              <span class="text-xs opacity-70 mr-2">Weight</span>
              <v-slider
                :model-value="style.details.weight"
                min="100"
                max="900"
                step="1"
                class="slider-thumb flex-grow"
                density="compact"
                hide-details
                disabled
                :track-color="colorMode === 'white' ? 'white' : 'black'"
                :thumb-color="colorMode === 'white' ? 'white' : 'black'"
              ></v-slider>
              <span class="text-xs ml-1">{{ style.details.weight }}</span>
            </div>
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

.variable-badge {
  height: 18px;
  padding: 2px 6px;
  font-size: 10px !important;
}

/* Slider styles */
:deep(.v-slider .v-slider__track) {
  height: 2px !important;
}

:deep(.v-slider .v-slider__thumb) {
  width: 12px;
  height: 12px;
}

.font-style-card {
  display: flex;
  flex-direction: column;
}

.font-preview {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

input {
  transition: all 0.3s ease;
}

input:focus {
  outline: none;
  ring: 2px;
  ring-color: rgba(255, 193, 7, 0.5);
}

/* Make the style cards responsive */
@media (max-width: 768px) {
  .font-preview {
    font-size: 28px;
    min-height: 80px;
    padding: 16px;
  }
  
  .controls {
    width: 100%;
    justify-content: flex-start;
    margin-top: 16px;
  }
}

@media (max-width: 480px) {
  .font-preview {
    font-size: 24px;
    min-height: 70px;
  }
  
  .filter-options {
    width: 100%;
    margin-top: 8px;
  }
  
  .search-box {
    width: 100%;
  }
}
</style> 