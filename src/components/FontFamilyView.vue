<script setup>
import fonts  from "../../public/fonts.json";
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFontStore } from '../stores/fonts'
import { useSittingsStore } from "../stores/sittings";
import { generateFontStyle } from '../utils/fontUtils'
import { useThemeStore } from '../stores/theme'
// Remove import for isGoogleFontsUrl

const route = useRoute()
const router = useRouter()
const fontStore = useFontStore()
const settingsStore = useSittingsStore();
const themeStore = useThemeStore();

// Store font family and style tracking variables
const currentFontFamily = ref('');
const isVariableFont = ref(false);

const primaryColor = computed(() => settingsStore.primaryColor);

// Mobile detection
const isMobile = ref(false);

// Check screen size function
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 868;
};

// Get the font from the store based on route params
const fontId = parseInt(route.params.id)
const font = computed(() => fontStore.currentFont || fontStore.getFontById(fontId) || {})

// Get current font data from the new fonts array with proper error handling
const currentFontData = computed(() => {
  const fontData = fonts.find((f) => f.name === font.value.name);
  if (!fontData) {
    console.warn(`Font data not found for: ${font.value.name}`);
    return null;
  }
  return fontData;
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
// Remove showGoogleFonts ref
const searchQuery = ref("");
const sortBy = ref("default"); // default, weight-asc, weight-desc, name

// New loading state for fonts
const fontsLoading = ref(true);
const loadingError = ref(null);

// Remove Google Fonts related refs and tracking variables

// Get available styles based on the new font structure
const fontStyles = computed(() => {
  if (!currentFontData.value) return [];
  
  let allStyles = [];
  
  // Add all static styles from the current font
  if (showStaticFonts.value) {
    allStyles = currentFontData.value.styles.map(style => {
      // Get the actual font family to use for this style
      const actualFontFamily = style.fontFamily || currentFontData.value.fontFamily;
      
      const baseStyle = generateFontStyle(
        actualFontFamily,
        style.weight || 400,
        style.style || "normal"
      );
      
      return {
        id: `${style.name}-${style.weight || 400}-${style.style || "normal"}`,
        name: style.name,
        category: currentFontData.value.category,
        isVariable: false,
        fontFamily: actualFontFamily, // Store font family directly in the style object
        value: {
          ...baseStyle,
          fontFamily: actualFontFamily, // Properly quoted font family
          fontSize: `${fontSize.value}px`,
          lineHeight: 1.3,
           direction: textDirection.value,
        },
        details: {
          weight: style.weight || 400,
          style: style.style || "normal",
          fontFamily: actualFontFamily
        }
      };
    });
  }
  
  // Add variable styles if available and enabled
  if (showVariableFonts.value && currentFontData.value.variable) {
    const variableStyles = currentFontData.value.variable.map(varStyle => {
      // Parse weight range from variationSettings if available
      let weightRange = [100, 200, 300, 400, 500, 600, 700, 800, 900];
      
      if (varStyle.variationSettings) {
        // Check for weight range in format "'wght' 100 500" or similar
        const wghtMatch = varStyle.variationSettings.match(/'wght'\s+(\d+)\s+(\d+)/);
        
        if (wghtMatch) {
          const minWeight = parseInt(wghtMatch[1]);
          const maxWeight = parseInt(wghtMatch[2]);
          
          console.log(`Found weight range in variationSettings: ${minWeight} to ${maxWeight}`);
          
          // Generate weights within the specified range
          const step = (maxWeight - minWeight) <= 400 ? 100 : 200;
          weightRange = [];
          
          for (let weight = minWeight; weight <= maxWeight; weight += step) {
            weightRange.push(weight);
          }
          
          // Always include the min and max values
          if (!weightRange.includes(minWeight)) weightRange.unshift(minWeight);
          if (!weightRange.includes(maxWeight)) weightRange.push(maxWeight);
        }
      }
      
      // Create styles for different weights to showcase variable font capabilities
      return weightRange.map(weight => {
        const baseStyle = generateFontStyle(
          varStyle.fontFamily,
          weight,
          varStyle.style || "normal"
        );
        
        // Handle specific variation settings if available
        const fontVariationSettings = varStyle.variationSettings 
          ? varStyle.variationSettings.replace(/wght/g, `'wght' ${weight}`) 
          : `'wght' ${weight}`;
        
        return {
          id: `variable-${varStyle.style || "normal"}-${weight}`,
          name: `Variable ${varStyle.style === "italic" ? "Italic" : ""} ${weight}`,
          category: currentFontData.value.category,
          isVariable: true,
          fontFamily: varStyle.fontFamily, // Store font family directly
          value: {
            ...baseStyle,
            fontFamily: `"${varStyle.fontFamily}", sans-serif`, // Properly quoted font family
            fontSize: `${fontSize.value}px`,
            lineHeight: 1.3,
            color: colorMode.value === "white" ? "white" : "black",
            fontVariationSettings: fontVariationSettings,
            direction: textDirection.value,
          },
          details: {
            weight: weight,
            style: varStyle.style || "normal",
            fontFamily: varStyle.fontFamily,
            variationSettings: fontVariationSettings
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
  
  // Remove Google Fonts filter
  
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

// Remove toggleGoogleFonts function

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

// Remove all Google Fonts related functions: checkGoogleFontsLoaded, reloadGoogleFonts, extractGoogleFontInfo, debugLoadedFonts

// Initialize font family tracking
const initFontFamilyTracking = () => {
  if (!currentFontData.value) return;
  
  // Set the default font family from the first available style
  if (currentFontData.value.styles && currentFontData.value.styles.length > 0) {
    const firstStyle = currentFontData.value.styles[0];
    currentFontFamily.value = firstStyle.fontFamily || currentFontData.value.fontFamily;
    isVariableFont.value = false;
  } else if (currentFontData.value.variable && currentFontData.value.variable.length > 0) {
    const firstVariable = currentFontData.value.variable[0];
    currentFontFamily.value = firstVariable.fontFamily;
    isVariableFont.value = true;
  }
  
  console.log(`Initialized font family tracking with: ${currentFontFamily.value}`);
};

onMounted(() => {
  // Ensure the font is loaded in the store
  try {
    fontStore.setCurrentFont(fontId);
    
    // Verify font data is available after a short delay
    setTimeout(() => {
      if (!currentFontData.value) {
        loadingError.value = `Could not load font data for ID: ${fontId}`;
      } else {
        // Initialize font family tracking
        initFontFamilyTracking();
      }
      fontsLoading.value = false;
    }, 500);
  } catch (error) {
    console.error("Error loading font:", error);
    loadingError.value = "Failed to load font data";
    fontsLoading.value = false;
  }
  
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
  
  // Initialize font family tracking for the new font
  setTimeout(() => {
    initFontFamilyTracking();
  }, 500);
}, { immediate: true });

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div 
    class="font-family-view"
    :style="{
      backgroundColor: themeStore.darkMode ? 'black' : 'white',
      color: themeStore.darkMode ? 'white' : 'black',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }"
  >
    <!-- Back button -->
    <!-- <div class="px-6 pt-4">
      <v-btn
        :color="primaryColor"
        variant="text"
        @click="backToFontDetail"
        class="mb-4"
        :style="{
          color: themeStore.darkMode ? 'white' : 'black',
          transition: 'color 0.3s ease'
        }"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Font
      </v-btn>
    </div> -->

    <!-- Font Family Header -->
    <div 
      class="font-family-header p-6  flex justify-between"
      :style="{
        backgroundColor: themeStore.darkMode ? 'black' : 'white',
        color: themeStore.darkMode ? 'white' : 'black',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }"
    >
      <h1 
        class="text-2xl font-bold  inline-block"
        :style="{
          color: themeStore.darkMode ? 'white' : 'black',
          transition: 'color 0.3s ease'
        }"
      >
        {{ font.name }} Family
      </h1>
      
      <!-- Controls -->
      <div class="controls   gap-4  inline-block">
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
            :color="primaryColor"
            :track-color="primaryColor"
            :thumb-color="primaryColor"
            @update:model-value="updateFontSize"
          ></v-slider>
          <span class="text-xs ml-1">{{ fontSize }}px</span>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="px-6 py-4 ">
      <div class="flex flex-wrap gap-4 items-center">
        <div class="search-box flex-grow max-w-md ">
          <div class="relative  border-b-2 primary-border">
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
              class="w-full py-2 pl-9 pr-4 rounded  text-white  "
            >
          </div>
        </div>
        
        <div class="filter-options flex flex-wrap gap-3">
          <v-chip
            :color="showVariableFonts ? primaryColor : 'gray'"
            variant="outlined"
            @click="toggleVariableFonts"
            :class="showVariableFonts ? 'border-opacity-100' : 'border-opacity-50 opacity-50'"
          >
            Variable
          </v-chip>
          
          <v-chip
            :color="showStaticFonts ? primaryColor : 'gray'"
            variant="outlined"
            @click="toggleStaticFonts"
            :class="showStaticFonts ? 'border-opacity-100' : 'border-opacity-50 opacity-50'"
          >
            Static
          </v-chip>
          
          <!-- Remove Google Fonts chip -->
          
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                size="small"
                class="ml-1"
                :color="primaryColor"
              >
                <v-icon start>mdi-sort</v-icon>
                Sort
              </v-btn>
            </template>
            <v-list :bg-color="themeStore.darkMode   ? 'rgb(30, 30, 30)' : 'white'">
              <v-list-item
                value="default"
                @click="sortBy = 'default'"
                :active="sortBy === 'default'"
                :color="primaryColor"
              >
                <v-list-item-title>Default</v-list-item-title>
              </v-list-item>
              <v-list-item
                value="weight-asc"
                @click="sortBy = 'weight-asc'"
                :active="sortBy === 'weight-asc'"
                :color="primaryColor"
              >
                <v-list-item-title>Weight (Lightest first)</v-list-item-title>
              </v-list-item>
              <v-list-item
                value="weight-desc"
                @click="sortBy = 'weight-desc'"
                :active="sortBy === 'weight-desc'"
                :color="primaryColor"
              >
                <v-list-item-title>Weight (Heaviest first)</v-list-item-title>
              </v-list-item>
              <v-list-item
                value="name"
                @click="sortBy = 'name'"
                :active="sortBy === 'name'"
                :color="primaryColor"
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
      <!-- Loading state -->
      <div v-if="fontsLoading" class="text-center py-12">
        <v-progress-circular
          indeterminate
          :color="primaryColor"
          size="64"
          width="4"
        ></v-progress-circular>
        <p class="mt-4 text-gray-400">Loading font styles...</p>
      </div>
      
      <!-- Remove Google Fonts loading state -->
      
      <!-- Error state -->
      <div v-else-if="loadingError" class="text-center py-12 text-red-500">
        <v-icon icon="mdi-alert-circle" size="64" color="error"></v-icon>
        <p class="mt-4">{{ loadingError }}</p>
        <v-btn 
          @click="router.push('/fonts')" 
          class="mt-4" 
          :color="primaryColor"
          variant="outlined"
        >
          Return to fonts list
        </v-btn>
      </div>
      
      <!-- No styles with current filters -->
      <div v-else-if="fontStyles.length === 0" class="text-center py-12 opacity-60">
        No styles available with the current filters.
      </div>
      
      <!-- Font styles display -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="style in fontStyles" 
          :key="style.id"
          class="font-style-card rounded-lg transition-all duration-300 overflow-hidden border-2 primary-border"
          :style="{
            backgroundColor: themeStore.darkMode ? 'black' : 'white',
            color: themeStore.darkMode ? 'white' : 'black',
            borderColor: primaryColor,
            transition: 'all 0.3s ease'
          }"
        >
          <div class="flex justify-between items-center p-4 border-b-[1px] primary-border border-opacity-10"
              >
            <h3 class="font-medium truncate" :title="style.name">{{ style.name }}</h3>
            <div class="flex items-center gap-2">
              <v-chip 
                v-if="style.isVariable"
                size="x-small" 
                :color="themeStore.darkMode  ? 'amber-darken-2' : 'amber-darken-3'" 
                :variant="themeStore.darkMode ? 'tonal' : 'tonal'"
                class="text-xs variable-badge"
              >
                Variable
              </v-chip>
              <!-- Remove Google Fonts chip -->
              <v-chip 
                size="x-small" 
                :color="themeStore.darkMode ? 'gray' : 'gray-light'" 
                variant="outlined"
                class="text-xs"
              >
                {{ style.details.weight }} {{ style.details.style }}
              </v-chip>
            </div>
          </div>
          
          <div 
            contenteditable="true"
            class="font-preview p-6 text-center border-none"
            :style="style.value, { color: themeStore.darkMode ? 'white' : 'black' }"
            :dir="textDirection"
            :class="[
              themeStore.darkMode 
                ? ' bg-black text-white' 
                : ' bg-white text-black'
            ]"
          >
            {{ sampleText }}
          </div>
          
          <div v-if="style.isVariable" class="variable-controls p-3 border-t-2  "
               :style="{ borderColor: primaryColor }">
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
                :color="primaryColor"
                :track-color="primaryColor"
                :thumb-color="primaryColor"
              ></v-slider>
              <span class="text-xs ml-1">{{ style.details.weight }}</span>
            </div>
          </div>
          <!-- Remove Google Fonts indicator -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.primary-border {
  border-color: v-bind(primaryColor);
}

.font-preview {
  font-size: 32px;
  line-height: 1.3;
  min-height: 100px;
  transition: all 0.3s ease;
  outline: none; /* Remove outline when focused */
}

/* Remove focus border for contenteditable elements */
[contenteditable="true"]:focus {
  outline: none;
  border: none;
  box-shadow: none;
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

/* Remove Google Fonts styles */

.font-family-view {
  min-height: 100vh;
}

.font-family-header {
  border-bottom: 1px solid v-bind(primaryColor);
}

.font-styles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.style-card {
  border: 1px solid v-bind(primaryColor);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.style-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style> 