<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFontStore } from "../stores/fonts";
import { useSittingsStore } from "../stores/sittings";
import { useThemeStore } from "../stores/theme";
import { useSeo } from "../composables/useSeo";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_STYLES,
  generateFontStyle,
} from "../utils/fontUtils";
// Import fonts from fontLoader
import fonts from "../../public/fonts.json";
import FontFamilyView from "./FontFamilyView.vue";

const route = useRoute();
const router = useRouter();
const fontStore = useFontStore();
const sittingsStore = useSittingsStore();
const primaryColor = ref(sittingsStore.primaryColor);
const themeStore = useThemeStore();
// Get the font from the store instead of hardcoding
const fontId = parseInt(route.params.id);
const font = computed(
  () => fontStore.currentFont || fontStore.getFontById(fontId) || {}
);
console.log(font.value);
// Get current font data from the new fonts array
const currentFontData = computed(() => {
  return fonts.find((f) => f.name === font.value.name) || null;
});
console.log(currentFontData.value);
// Available styles based on the new font structure
const styleOptions = computed(() => {
  if (!currentFontData.value) return [];
  return currentFontData.value.styles
    .map((style) => {
      const fontFamily = style.fontFamily || currentFontData.value.fontFamily;
      console.log(fontFamily, "fontFamily");
      return {
        title: style.name,
        weight: style.weight || 400,
        italic: style.style === "italic",
        fontFamily: fontFamily,
        isVariable: false,
      };
    })
    .concat(
      currentFontData.value.variable
        ? currentFontData.value.variable.map((varFont) => ({
            title: "Variable" + (varFont.style === "italic" ? " Italic" : ""),
            weight: 400,
            italic: varFont.style === "italic",
            fontFamily: varFont.fontFamily,
            isVariable: true,
          }))
        : []
    );
});

// Initialize style based on font data
const initSelectedStyle = () => {
  if (!styleOptions.value.length) return;

  // Try to find a matching style based on current weight and style
  const matchingStyle = styleOptions.value.find(
    (style) =>
      style.weight === fontWeight.value &&
      style.italic === (fontStyle.value === "italic")
  );

  selectedStyle.value = matchingStyle || styleOptions.value[0];

  // Apply the initial style
  if (selectedStyle.value) {
    currentFontFamily.value = selectedStyle.value.fontFamily;
    isVariableFont.value = selectedStyle.value.isVariable;
  }
};

// Style change handler with improved font switching
const handleStyleChange = (style) => {
  selectedStyle.value = style;
  fontWeight.value = style.weight;
  fontStyle.value = style.italic ? "italic" : "normal";
  currentFontFamily.value = style.fontFamily;
  isVariableFont.value = style.isVariable;
};

// Font family management
const currentFontFamily = ref("");
const isVariableFont = ref(false);
const selectedStyle = ref(null);
const showStyleMenu = ref(false);

// Debug mode for development
const showDebugInfo = import.meta.env.VITE_APP_DEBUG === "true";
const toggleDebugInfo = () => {
  showDebugInfo.value = !showDebugInfo.value;
};

// Check if this font is a favorite
const isFavorite = computed(() => fontStore.isFavorite(fontId));

// Set default sample text for Arabic fonts
const getDefaultSampleText = () => {
  if (font.value?.name && font.value.name.toLowerCase().startsWith("ko")) {
    return "السلام عليكم";
  }
  return font.value?.name || "Sample Text";
};

// Font customization controls
const sampleText = ref(getDefaultSampleText());
const fontSize = ref(180);

const fontWeight = ref(400);
const fontLeading = ref(1);
const fontTracking = ref(0);
const fontStyle = ref("normal");

// Options for columns display
const columns = ref("single");

// Add a computed property for column styles
const columnStyles = computed(() => {
  switch (columns.value) {
    case "double":
      return { columns: "2", columnGap: "2rem" };
    case "triple":
      return { columns: "3", columnGap: "2rem" };
    default:
      return { columns: "1" };
  }
});

// Color mode
const colorMode = ref("white");
const textAlign = ref("center");

// Special characters for the character grid
const specialChars = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "!",
  "@",
  "#",
  "$",
  "%",
  "^",
  "&",
  "*",
  "(",
  ")",
  "_",
  "+",
  "-",
  "=",
  "[",
  "]",
  "{",
  "}",
  "\\",
  "|",
  ";",
  ":",
  "'",
  '"',
  ",",
  ".",
  "<",
  ">",
  "?",
];

// Arabic characters for the character grid
const arabicChars = [
  "ا",
  "ب",
  "ت",
  "ث",
  "ج",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "س",
  "ش",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ك",
  "ل",
  "م",
  "ن",
  "ه",
  "و",
  "ي",
];

// Get appropriate characters based on font type
const displayChars = computed(() => {
  return isArabicFont.value ? arabicChars : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
});

// Get appropriate lowercase characters based on font type
const displayLowerChars = computed(() => {
  return isArabicFont.value ? [] : "abcdefghijklmnopqrstuvwxyz";
});

// Character selected for anatomy view
const selectedCharacter = ref(
  font.value &&
    font.value.name &&
    (font.value.name.startsWith("KO") || font.value.name.startsWith("Ko"))
    ? "ا"
    : "I"
);

// Set the selected character for anatomy view
const setSelectedCharacter = (char) => {
  selectedCharacter.value = char;
};

// Features and stylistic sets
const features = ref({
  fractions: false,
  ligatures: false,
  discretionaryLigatures: false,
  ordinals: false,
  stylisticAlternates: false,
  proportionalNumerals: false,
  tabularNumerals: false,
});

const stylisticSets = ref({
  alternateT: false,
  alternateQ: false,
  alternateG: false,
  alternateSmallG: false,
});

// Helper function to get font family based on font name - replicated from FontCard.vue
const getFontFamilyForFont = (font) => {
  if (!font) return "";

  // Create a direct mapping for more reliable font family selection
  const fontMapping = {
    KOLemaza: FONT_FAMILIES.KOLEMAZA,
    "KOAynama Sharp": FONT_FAMILIES.KOAYNAMA_SHARP,
    "KOAynama Curved": FONT_FAMILIES.KOAYNAMA_CURVED,
    KoShareb: FONT_FAMILIES.KOSHAREB,
    "Ko Banzeen": FONT_FAMILIES.KOBANZEEN,
    KoDongol: FONT_FAMILIES.KODONGOL,
    KoKhalaya: FONT_FAMILIES.KOKHALAYA,
    "KoKhalaya Variable": FONT_FAMILIES.KOKHALAYA_VARIABLE,
    KORubbama: FONT_FAMILIES.KORUBBAMA,
    "KORubbama Expanded": FONT_FAMILIES.KORUBBAMA_EXPANDED,
    KoGaliModern: FONT_FAMILIES.KOGALIMODERN,
    Satoshi: FONT_FAMILIES.SATOSHI,
    "Satoshi Variable": FONT_FAMILIES.SATOSHI_VARIABLE,
  };

  // Try to get the font family from our mapping
  if (fontMapping[font.name]) {
    return fontMapping[font.name];
  }

  // Fallback to the font family specified in the font object if available
  if (font.fontFamily) {
    return font.fontFamily;
  }

  // Last resort: just use the font name
  return `'${font.name}'`;
};

// Detect if this is an Arabic font
const isArabicFont = computed(() => {
  return (
    font.value &&
    font.value.name &&
    (font.value.name.startsWith("KO") || font.value.name.startsWith("Ko"))
  );
});

// Set text direction based on font type
const textDirection = computed(() => {
  return isArabicFont.value ? "rtl" : "ltr";
});

const fontStylesAnatomy = computed(() => {
  const fontFamily =
    currentFontFamily.value ||
    currentFontData.value?.fontFamily ||
    getFontFamilyForFont(font.value);

  // Add additional styling properties

  // Add additional styling properties
  const styles = {
    fontFamily,
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    color: "white",
    direction: textDirection.value,
  };

  return styles;
});

// Computed font styles using proper font family and utilities
const fontStyles = computed(() => {
  const fontFamily =
    currentFontFamily.value ||
    currentFontData.value?.fontFamily ||
    getFontFamilyForFont(font.value);

  // Build font feature settings string
  let featureSettings = "";

  // Enable ligatures by default for Arabic fonts
  if (features.value.ligatures || isArabicFont.value)
    featureSettings += '"liga" 1, ';
  if (features.value.discretionaryLigatures) featureSettings += '"dlig" 1, ';
  if (features.value.fractions) featureSettings += '"frac" 1, ';
  if (features.value.ordinals) featureSettings += '"ordn" 1, ';
  if (features.value.stylisticAlternates) featureSettings += '"salt" 1, ';
  if (features.value.proportionalNumerals) featureSettings += '"pnum" 1, ';
  if (features.value.tabularNumerals) featureSettings += '"tnum" 1, ';

  // Add stylistic sets
  if (stylisticSets.value.alternateT) featureSettings += '"ss01" 1, ';
  if (stylisticSets.value.alternateQ) featureSettings += '"ss02" 1, ';
  if (stylisticSets.value.alternateG) featureSettings += '"ss03" 1, ';
  if (stylisticSets.value.alternateSmallG) featureSettings += '"ss04" 1, ';

  // Remove trailing comma and space if any features are enabled
  if (featureSettings.length > 0) {
    featureSettings = featureSettings.slice(0, -2);
  }

  // Add additional styling properties
  const styles = {
    fontFamily,
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    fontSize: isMobile.value
      ? `${fontSize.value}px`
      : `${fontSize.value * 0.8}px`,
    lineHeight: fontLeading.value,
    letterSpacing: `${fontTracking.value}px`,
     textAlign: textAlign.value,
    direction: textDirection.value,
  };

  // Add font feature settings if any are enabled
  if (featureSettings.length > 0) {
    styles.fontFeatureSettings = featureSettings;
  }

  // Add variable font settings if applicable
  if (isVariableFont.value) {
    styles.fontVariationSettings = `'wght' ${fontWeight.value}`;
  }

  return styles;
});

const fontStylesCharacter = computed(() => {
  const fontFamily =
    currentFontFamily.value ||
    currentFontData.value?.fontFamily ||
    getFontFamilyForFont(font.value);

  // Build font feature settings string
  let featureSettings = "";

  // Enable ligatures by default for Arabic fonts
  if (features.value.ligatures || isArabicFont.value)
    featureSettings += '"liga" 1, ';
  if (features.value.discretionaryLigatures) featureSettings += '"dlig" 1, ';
  if (features.value.fractions) featureSettings += '"frac" 1, ';
  if (features.value.ordinals) featureSettings += '"ordn" 1, ';
  if (features.value.stylisticAlternates) featureSettings += '"salt" 1, ';
  if (features.value.proportionalNumerals) featureSettings += '"pnum" 1, ';
  if (features.value.tabularNumerals) featureSettings += '"tnum" 1, ';

  // Add stylistic sets
  if (stylisticSets.value.alternateT) featureSettings += '"ss01" 1, ';
  if (stylisticSets.value.alternateQ) featureSettings += '"ss02" 1, ';
  if (stylisticSets.value.alternateG) featureSettings += '"ss03" 1, ';
  if (stylisticSets.value.alternateSmallG) featureSettings += '"ss04" 1, ';

  // Remove trailing comma and space if any features are enabled
  if (featureSettings.length > 0) {
    featureSettings = featureSettings.slice(0, -2);
  }

  // Add additional styling properties
  const styles = {
    fontFamily,
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    fontSize: isMobile.value
      ? `${fontSize.value}px`
      : `${fontSize.value * 0.8}px`,
    textAlign: 'center',
    direction: textDirection.value,
  };

  // Add font feature settings if any are enabled
  if (featureSettings.length > 0) {
    styles.fontFeatureSettings = featureSettings;
  }

  // Add variable font settings if applicable
  if (isVariableFont.value) {
    styles.fontVariationSettings = `'wght' ${fontWeight.value}`;
  }

  return styles;
});

// Goto family view
const goToFontFamily = () => {
  router.push(`/fonts/${route.params.id}/family`);
};

// Add favorites
const addToFavorites = () => {
  fontStore.toggleFavorite(fontId);
};

// Apply styles to all selected fonts
const applyToAll = () => {
  // Implementation would go here
  alert("Styles applied to all selected fonts");
};

// Reset all styles
const resetStyles = () => {
  fontSize.value = 180;
  fontWeight.value = 400;
  fontLeading.value = 1;
  fontTracking.value = 0;
  fontStyle.value = "normal";
  columns.value = "single";
  colorMode.value = "white";

  // Reset features
  Object.keys(features.value).forEach((key) => {
    features.value[key] = false;
  });

  // Reset stylistic sets
  Object.keys(stylisticSets.value).forEach((key) => {
    stylisticSets.value[key] = false;
  });
};

// Toggle a feature
const toggleFeature = (feature) => {
  features.value[feature] = !features.value[feature];
};

// Toggle a stylistic set
const toggleStylisticSet = (set) => {
  stylisticSets.value[set] = !stylisticSets.value[set];
};

// Handle "back to fonts" action
const backToFonts = () => {
  router.push("/fonts");
};

// Add mobile detection
const isMobile = ref(false);
const isControlsVisible = ref(false);

// Check screen size function
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 868;
};

// Toggle controls visibility on mobile
const toggleControls = () => {
  isControlsVisible.value = !isControlsVisible.value;
};

// Set up dynamic SEO for this font detail page
useSeo((route) => {
  const id = parseInt(route.params.id);
  const fontData = fontStore.getFontById(id) || {};
  const fontName = fontData.name || "Font";

  return {
    title: `${fontName} | Kotype Font Library`,
    description: `Explore ${fontName} font details, styles, and usage examples. ${
      fontData.description || "Beautiful typography for your design projects."
    }`,
    keywords: `${fontName}, font, typography, design, kotype, ${
      fontData.tags?.join(", ") || ""
    }`,
    ogTitle: `${fontName} Font | Kotype`,
    ogDescription: `Discover the beauty of ${fontName} typography`,
    ogImage: fontData.previewImage || undefined,
    canonicalUrl: `https://yourdomain.com/kotype/fonts/${id}`,
  };
});

// Add downloadFont method
const downloadFont = async () => {
  if (!font.value?.downloadUrl) {
    alert(`Download URL not available for ${font.value.name} font`);
    return;
  }

  try {
    const response = await fetch(font.value.downloadUrl);
    if (!response.ok) throw new Error('Download failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading font:', error);
    alert('Failed to download font. Please try again later.');
  }
};

onMounted(() => {
  // Set current font in store
  fontStore.setCurrentFont(fontId);

  // Load favorites
  fontStore.loadFavorites();

  // Initialize font style
  initSelectedStyle();

  // Initialize mobile detection
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
});

// Watch for changes in route params and update the page accordingly
watch(
  () => route.params.id,
  (newId) => {
    const id = parseInt(newId);
    fontStore.setCurrentFont(id);

    // Update sample text with default for the new font
    sampleText.value = getDefaultSampleText();

    // Reset selected character based on font type
    const newFont = fontStore.getFontById(id);
    if (
      newFont &&
      newFont.name &&
      (newFont.name.startsWith("KO") || newFont.name.startsWith("Ko"))
    ) {
      selectedCharacter.value = "ا";
    } else {
      selectedCharacter.value = "I";
    }

    // Initialize style for the new font
    initSelectedStyle();
  },
  { immediate: true }
);

// Watch for font changes
watch(
  () => font.value,
  () => {
    initSelectedStyle();
  },
  { deep: true }
);

// Mobile UI state
const isControlsSectionVisible = ref(false);
const isFeaturesOpen = ref(false);
const isStylisticSetsOpen = ref(false);

// Add to existing onUnmounted (or create if not exists)
onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div 
    class="font-detail-view min-h-screen"
    :style="{
      backgroundColor: themeStore.darkMode ? 'black' : 'white',
      color: themeStore.darkMode ? '#f5f5f5' : '#111',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }"
  >
    <!-- Back button -->
    <div class="px-6 pt-4">
      <v-btn
        color="primary"
        variant="text"
        @click="backToFonts"
        class="mb-4"
        :style="{
          color: themeStore.darkMode ? '#f5f5f5' : '#111',
          transition: 'color 0.3s ease'
        }"
      >
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Fonts
      </v-btn>
    </div>

    <!-- Font Detail Header -->
    <div
      class="border border-primary-js p-6"
      :style="{
        backgroundColor: themeStore.darkMode ? 'black' : 'white',
        color: themeStore.darkMode ? '#f5f5f5' : '#111',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }"
    >
      <div class="flex justify-between items-center mb-4">
        <!-- Font Name and Info -->
        <div class="flex items-center justify-between flex-wrap">
          <div class="flex items-center flex-wrap">
            <h1
              class="text-2xl font-bold mr-3"
              :style="{ color: themeStore.darkMode ? '#f5f5f5' : '#111' }"
            >
              {{ font.name }}
            </h1>
            <v-icon
              class="mr-3 cursor-pointer"
              color="primary"
              @click="addToFavorites"
            >
              {{ isFavorite ? "mdi-star" : "mdi-star-outline" }}
            </v-icon>
            <span
              class="text-gray-400 variable-tag border-[1.1px] border-gray-400 dark:border-white"
              :class="{ 'variable-tag-active border-[1.1px] border-primary': isVariableFont }"
              >{{ isVariableFont ? "Variable" : "Static" }}</span
            >
            <span
              v-if="selectedStyle"
              class="current-style ml-3"
              :style="{ color: themeStore.darkMode ? '#f5f5f5' : '#111' }"
            >
              {{ selectedStyle.title }}
            </span>
          </div>

          <!-- Mobile Controls Toggle Button -->
          <v-btn
            v-if="isMobile"
            icon
            variant="text"
            active-color="primary"
            class="ml-3"
            @click="toggleControls"
            :active="!!isControlsVisible"
          >
            <v-icon> mdi-filter </v-icon>
          </v-btn>
        </div>

        <!-- Desktop Controls (horizontal) -->
        <div v-if="!isMobile" class="controls flex items-center space-x-4 mt-4">
          <!-- Style Selector -->
          <div class="style-selector mr-4">
            <v-menu
              v-model="showStyleMenu"
              :close-on-content-click="false"
              location="bottom"
              offset="5"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  v-bind="props"
                  active-color="primary"
                  :active="showStyleMenu"

                  class="style-btn"
                  :style="{
                    color: themeStore.darkMode ? '#f5f5f5' : '#111',
                  }"
                >
                  <v-icon >mdi-format-font</v-icon>
                </v-btn>
              </template>
              <v-list
                class="style-list   border border-primary rounded pa-2"
                max-height="300"
                :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }"
              >
                <v-list-item
                  v-for="style in styleOptions"
                  :key="style.title"
                  :value="style"
                  @click="
                    handleStyleChange(style);
                    showStyleMenu = false;
                  "
                  :active="selectedStyle && selectedStyle.title === style.title"
                  class="style-list-item rounded mb-1 px-3 py-1 text-primary"
                  :class="{
                    'style-list-item-active':
                      selectedStyle && selectedStyle.title === style.title,
                    'style-list-item-variable': style.isVariable,
                  }"
             
                > 
                  <template v-slot:prepend>
                    <div class="radio-circle mr-2 border border-primary-js">
                      <div
                        v-if="
                          selectedStyle && selectedStyle.title === style.title
                        "
                        class="radio-dot bg-primary"
                      ></div>
                    </div>
                  </template>
                  <v-list-item-title class="text-sm !text-primary" >
                    {{ style.title }}
                    <span v-if="style.isVariable" class="variable-badge"
                      >Variable</span
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Weight Control -->
          <div class="control-group">
            <span class="text-gray-400 text-sm mr-2">Weight</span>
            <v-slider
              v-model="fontWeight"
              min="100"
              max="900"
              step="1"
              class="slider-thumb d-inline-block w-24"
              density="compact"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"

            ></v-slider>
          </div>

          <!-- Size Control -->
          <div class="control-group">
            <span class="text-gray-400 text-sm mr-2">Size</span>
            <v-slider
              v-model="fontSize"
              min="12"
              max="280"
              step="1"
              class="slider-thumb d-inline-block w-24"
              density="compact"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"

            ></v-slider>
          </div>

          <!-- Leading Control -->
          <div class="control-group">
            <span class="text-gray-400 text-sm mr-2">Leading</span>
            <v-slider
              v-model="fontLeading"
              min="0.8"
              max="2"
              step="0.1"
              class="slider-thumb d-inline-block w-24"
              density="compact"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"

            ></v-slider>
          </div>

          <!-- Tracking Control -->
          <div class="control-group">
            <span class="text-gray-400 text-sm mr-2">Tracking</span>
            <v-slider
              v-model="fontTracking"
              min="-100"
              max="100"
              step="0.5"
              class="slider-thumb d-inline-block w-24"
              density="compact"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"

            >
          
          </v-slider>
          </div>

          <!-- Info and License -->
          <div class="ml-6 text-sm text-gray-400">
            <div>{{ font.styleCount }} styles</div>
            <div>{{ font.isPremium ? "Premium" : "Free" }}</div>
          </div>
        </div>
      </div>

      <!-- Mobile Controls (vertical, collapsible) -->
      <div
        v-if="isMobile && isControlsVisible"
        class="mobile-controls mt-4 border-t border-gray-700 pt-4 animate-slide-down"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="style-selector flex items-center">
            <span class="text-gray-400 text-sm mr-3">Style</span>
            <v-menu
              v-model="showStyleMenu"
              :close-on-content-click="false"
              location="bottom"
              offset="5"
              color="primary"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  variant="text"
                  color="primary"
                  v-bind="props"
                  class="style-select-btn text-truncate"
                  style="max-width: 180px"
                  :active="showStyleMenu"
                  active-color="primary"
                >
                  {{ selectedStyle ? selectedStyle.title : "Select Style" }}
                  <v-icon end>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list
                class="style-list   border border-primary rounded pa-2"
                max-height="300"
                :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }"
              >
                <v-list-item
                  v-for="style in styleOptions"
                  :key="style.title"
                  :value="style"
                  @click="
                    handleStyleChange(style);
                    showStyleMenu = false;
                  "
                  :active="selectedStyle && selectedStyle.title === style.title"
                  class="style-list-item rounded mb-1 px-3 py-2 text-primary"
                  :class="{
                    'style-list-item-active':
                      selectedStyle && selectedStyle.title === style.title,
                    'style-list-item-variable': style.isVariable,
                  }"
                
                >
                  <template v-slot:prepend>
                    <div class="radio-circle mr-2 border border-primary-js">
                      <div
                        v-if="
                          selectedStyle && selectedStyle.title === style.title
                        "
                        class="radio-dot bg-primary"
                      ></div>
                    </div>
                  </template>
                  <v-list-item-title
                    class="text-sm !text-primary"
                  >
                    {{ style.title }}
                    <span
                      v-if="style.isVariable"
                      class="variable-badge !text-primary"
                      :style="{ color: themeStore.darkMode ? '#f5f5f5' : '#111' }"
                      >Variable</span
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Info and License (Mobile) -->
          <div class="text-sm text-gray-400">
            <div>{{ font.styleCount }} styles</div>
            <div>{{ font.isPremium ? "Premium" : "Free" }}</div>
          </div>
        </div>

        <!-- Mobile Sliders - Stacked vertically -->
        <div class="mobile-sliders space-y-5">
          <!-- Weight Control (Mobile) -->
          <div class="mobile-control-group">
            <div class="flex items-center justify-between mb-1">
              <span class="text-gray-400 text-sm">Weight</span>
              <span class="text-gray-400 text-sm">{{ fontWeight }}</span>
            </div>
            <v-slider
              v-model="fontWeight"
              min="100"
              max="900"
              step="1"
              class="mobile-slider"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"
            ></v-slider>
          </div>

          <!-- Size Control (Mobile) -->
          <div class="mobile-control-group">
            <div class="flex items-center justify-between mb-1">
              <span class="text-gray-400 text-sm">Size</span>
              <span class="text-gray-400 text-sm">{{ fontSize }}px</span>
            </div>
            <v-slider
              v-model="fontSize"
              min="12"
              max="280"
              step="1"
              class="mobile-slider"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"
            ></v-slider>
          </div>

          <!-- Leading Control (Mobile) -->
          <div class="mobile-control-group">
            <div class="flex items-center justify-between mb-1">
              <span class="text-gray-400 text-sm">Leading</span>
              <span class="text-gray-400 text-sm">{{ fontLeading }}</span>
            </div>
            <v-slider
              v-model="fontLeading"
              min="0.8"
              max="2"
              step="0.1"
              class="mobile-slider"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"
            ></v-slider>
          </div>

          <!-- Tracking Control (Mobile) -->
          <div class="mobile-control-group">
            <div class="flex items-center justify-between mb-1">
              <span class="text-gray-400 text-sm">Tracking</span>
              <span class="text-gray-400 text-sm">{{ fontTracking }}</span>
            </div>
            <v-slider
              v-model="fontTracking"
              min="-100"
              max="100"
              step="1"
              class="mobile-slider"
              hide-details
              track-color="primary"
              color="primary"
              thumb-color="primary"
              thumb-label="hover"
            ></v-slider>
          </div>
        </div>
      </div>

      <!-- Font Preview Area -->
      <div
        class="font-preview-area py-24 text-center"
        :style="{ color: themeStore.darkMode ? 'white' : 'black' }"
      >
        <p
          class="sample-text"
          contenteditable="true"
          :style="{ ...fontStyles, ...columnStyles, color: themeStore.darkMode ? 'white' : 'black' }"
          @input="(e) => (sampleText = e.target.innerText)"
          :dir="textDirection"
        >
          {{ sampleText }}
        </p>
      </div>

      <!-- Designer Info -->
      <div
        class="designer-info flex justify-between mt-4 text-sm text-gray-400"
      >
        <div>Designed by {{ font.designer }}</div>
        <!-- <v-btn
          :color="primaryColor"
          variant="outlined"
          size="small"
          @click="goToFontFamily"
          :disabled="!font.id"
        >
          View Family
        </v-btn> -->
      </div>
    </div>

    <!-- Font Controls Section -->
    <!-- Font Controls Section -->
    <div class="    p-6">
      <!-- Mobile Controls Header with Toggle -->
      <div v-if="isMobile" class="flex justify-between items-center mb-4">
        <h2 class="text-xl">Font Controls</h2>
        <v-btn
          icon
          variant="text"
          color="primary"
          @click="isControlsSectionVisible = !isControlsSectionVisible"
          :active="isControlsSectionVisible"
          active-color="primary"
        >
          <v-icon>mdi-filter</v-icon>
        </v-btn>
      </div>

      <!-- Desktop view or expanded mobile view -->
      <div
        v-if="!isMobile || isControlsSectionVisible"
        :class="{ 'mobile-controls-container': isMobile }"
      >
        <!-- Desktop version -->
        <div v-if="!isMobile" class="flex justify-between mb-6">
          <!-- Text Controls -->
          <div class="text-controls">
            <h2 class="text-xl mb-4">Text</h2>

            <div class="flex items-center space-x-4 ">
              <span class="text-gray-400 text-sm mr-2">Alignment</span>

              <!-- Text Alignment -->
              <div class="alignment-controls mr-12">
                <v-btn
                  active-color="primary"
                  :active="textAlign === 'left'"
                  value="left"
                  icon="mdi-format-align-left"
                  variant="text"
                  @click="textAlign = 'left'"
                ></v-btn>
                <v-btn
                  active-color="primary"
                  :active="textAlign === 'center'"
                  value="center"
                  icon="mdi-format-align-center"
                  variant="text"
                  @click="textAlign = 'center'"
                ></v-btn>
                <v-btn
                  active-color="primary"
                  :active="textAlign === 'right'"
                  value="right"
                  icon="mdi-format-align-right"
                  variant="text"
                  @click="textAlign = 'right'"
                ></v-btn>
              </div>

              <!-- Columns -->
              <div class="columns-control ml-6">
                <span class="text-gray-400 text-sm mr-2">Columns</span>
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="columns === 'single'"
                  value="single"
                  @click="columns = 'single'"
                  >Single</v-btn
                >
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="columns === 'double'"
                  value="double"
                  @click="columns = 'double'"
                  >Double</v-btn
                >
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="columns === 'triple'"
                  value="triple"
                  @click="columns = 'triple'"
                  >Triple</v-btn
                >
              </div>
              <!-- Color Mode -->
              <!-- <div class="color-mode-control ml-6">
                <span class="text-gray-400 text-sm mr-2">Color mode</span>

                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="colorMode === 'white'"
                  value="white"
                  @click="colorMode = 'white'"
                  >White</v-btn
                >
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="colorMode === 'black'"
                  value="black"
                  @click="colorMode = 'black'"
                  >Black</v-btn
                >
              </div> -->
            </div>
          </div>
          
          <!-- Apply and Reset -->
          <div class="action-buttons flex items-center space-x-4 mt-12" :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }">
            <!-- <v-btn :color="primaryColor" @click="applyToAll"
              >Apply to All</v-btn
            > -->
            <v-btn variant="outlined" color="primary" @click="resetStyles"
              >Reset</v-btn
            >
            <!-- Download Button -->
            <v-btn
              variant="outlined"
              color="primary"
              class="download-btn"
              @click="downloadFont"
            >
              <span class="font-bold mr-2">
                <v-icon class="download-icon">mdi-download</v-icon>
              </span>
              <span>Download</span>
            </v-btn>
          </div>
        </div>

        <!-- Mobile version - vertical layout -->
        <div v-else class="mobile-text-controls">
          <h2 class="text-xl mb-4">Text</h2>

          <div class="space-y-5">
            <!-- Text Alignment (Mobile) -->
            <div class="mobile-control-group flex items-center justify-between">
              <span class="text-gray-400 text-sm block mb-2 mr-2"
                >Text Alignment</span
              >
              <div class="flex-1">
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="textAlign === 'left'"
                  value="left"
                  icon="mdi-format-align-left"
                  @click="textAlign = 'left'"
                ></v-btn>
              </div>
              <div class="flex-1">
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="textAlign === 'center'"
                  value="center"
                  icon="mdi-format-align-center"
                  @click="textAlign = 'center'"
                ></v-btn>
              </div>
              <div class="flex-1">
                <v-btn
                  variant="text"
                  active-color="primary"
                  :active="textAlign === 'right'"
                  value="right"
                  icon="mdi-format-align-right"
                  @click="textAlign = 'right'"
                ></v-btn>
              </div>
            </div>

            <!-- Columns (Mobile) -->
            <div class="mobile-control-group flex items-center justify-between">
              <span class="text-gray-400 text-sm block mb-2 mr-2">Columns</span>

              <v-btn
                variant="text"
                active-color="primary"
                :active="columns === 'single'"
                value="single"
                @click="columns = 'single'"
                class="flex-1"
                >Single</v-btn
              >
              <v-btn
                variant="text"
                active-color="primary"
                :active="columns === 'double'"
                value="double"
                @click="columns = 'double'"
                class="flex-1"
                >Double</v-btn
              >
              <v-btn
                variant="text"
                active-color="primary"
                :active="columns === 'triple'"
                value="triple"
                @click="columns = 'triple'"
                class="flex-1"
                >Triple</v-btn
              >
            </div>

            <!-- Color Mode (Mobile) -->
            <!-- <div class="mobile-control-group flex items-center justify-between">
              <span class="text-gray-400 text-sm block mb-2 mr-2"
                >Color Mode</span
              >

              <v-btn
                variant="text"
                :active="colorMode === 'white'"
                active-color="primary"
                value="white"
                class="flex-1"
                >White</v-btn
              >
              <v-btn
                variant="text"
                :active="colorMode === 'black'"
                active-color="primary"
                value="black"
                class="flex-1"
                >Black</v-btn
              >
            </div> -->

            <!-- Action Buttons (Mobile) -->
            <div
              class="mobile-control-group action-buttons-mobile mt-6 grid grid-cols-2 gap-4  "
              :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }"
            >
              <!-- <v-btn :color="primaryColor" @click="applyToAll" class="py-3" block
                >Apply to All</v-btn
              > -->
              <v-btn
                variant="outlined"
                color="primary"
                @click="resetStyles"
                class="py-3"
                block
                >Reset</v-btn
              >
              <!-- Download Button -->
              <v-btn
               variant="outlined"
               color="primary"
               class="download-btn"
               @click="downloadFont"
             >
               <span class="font-bold mr-2">
                 <v-icon class="download-icon">mdi-download</v-icon>
               </span>
               <span>Download</span>
             </v-btn>
            </div>

          </div>
        </div>

        <!-- Features and Stylistic Sets Section -->
        <!-- <div
          :class="
            isMobile ? 'mt-6' : 'grid-feature grid-cols-2 gap-8 mt-8 bg-black'
          "
        >
           <div v-if="isMobile" class="mobile-feature-toggles">
             <div
              class="mobile-section-header py-3 border-t border-gray-700"
              @click="isFeaturesOpen = !isFeaturesOpen"
            >
              <div class="flex justify-between items-center">
                <h2 class="text-xl">Features</h2>
                <v-icon>{{
                  isFeaturesOpen ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </div>
            </div>

             <div v-show="isFeaturesOpen" class="mobile-feature-content py-3">
              <div class="grid grid-cols-1 gap-4 bg-black">
                <div class="feature-option" @click="toggleFeature('fractions')">
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.fractions }"
                  >
                    <div v-if="features.fractions" class="checkbox-dot"></div>
                  </div>
                  <span class="ml-2">Fractions</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleFeature('proportionalNumerals')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.proportionalNumerals }"
                  >
                    <div
                      v-if="features.proportionalNumerals"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Proportional numerals</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleFeature('discretionaryLigatures')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.discretionaryLigatures }"
                  >
                    <div
                      v-if="features.discretionaryLigatures"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Discretionary ligatures</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleFeature('tabularNumerals')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.tabularNumerals }"
                  >
                    <div
                      v-if="features.tabularNumerals"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Tabular numerals</span>
                </div>

                <div class="feature-option" @click="toggleFeature('ligatures')">
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.ligatures }"
                  >
                    <div v-if="features.ligatures" class="checkbox-dot"></div>
                  </div>
                  <span class="ml-2">Ligatures</span>
                </div>

                <div class="feature-option" @click="toggleFeature('ordinals')">
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.ordinals }"
                  >
                    <div v-if="features.ordinals" class="checkbox-dot"></div>
                  </div>
                  <span class="ml-2">Ordinals</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleFeature('stylisticAlternates')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: features.stylisticAlternates }"
                  >
                    <div
                      v-if="features.stylisticAlternates"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Stylistic alternates</span>
                </div>
              </div>
            </div>

             <div
              class="mobile-section-header py-3 border-t border-gray-700"
              @click="isStylisticSetsOpen = !isStylisticSetsOpen"
            >
              <div class="flex justify-between items-center">
                <h2 class="text-xl">Stylistic Sets</h2>
                <v-icon>{{
                  isStylisticSetsOpen ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </div>
            </div>

             <div
              v-show="isStylisticSetsOpen"
              class="mobile-feature-content py-3"
            >
              <div class="grid grid-cols-1 gap-4 bg-black">
                <div
                  class="feature-option"
                  @click="toggleStylisticSet('alternateT')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: stylisticSets.alternateT }"
                  >
                    <div
                      v-if="stylisticSets.alternateT"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Alternate t</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleStylisticSet('alternateQ')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: stylisticSets.alternateQ }"
                  >
                    <div
                      v-if="stylisticSets.alternateQ"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Alternate Q</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleStylisticSet('alternateG')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: stylisticSets.alternateG }"
                  >
                    <div
                      v-if="stylisticSets.alternateG"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Alternate G, a, registered sign</span>
                </div>

                <div
                  class="feature-option"
                  @click="toggleStylisticSet('alternateSmallG')"
                >
                  <div
                    class="feature-checkbox"
                    :class="{ active: stylisticSets.alternateSmallG }"
                  >
                    <div
                      v-if="stylisticSets.alternateSmallG"
                      class="checkbox-dot"
                    ></div>
                  </div>
                  <span class="ml-2">Alternate g</span>
                </div>
              </div>
            </div>
          </div>

           <div v-if="!isMobile" class="features">
            <h2 class="text-xl mb-4">Features</h2>

            <div class="grid-feature grid-cols-2 gap-4 bg-black">
              <div class="feature-option" @click="toggleFeature('fractions')">
                <div
                  class="feature-checkbox"
                  :class="{ active: features.fractions }"
                >
                  <div v-if="features.fractions" class="checkbox-dot"></div>
                </div>
                <span class="ml-2">Fractions</span>
              </div>

              <div
                class="feature-option"
                @click="toggleFeature('proportionalNumerals')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: features.proportionalNumerals }"
                >
                  <div
                    v-if="features.proportionalNumerals"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Proportional numerals</span>
              </div>

              <div
                class="feature-option"
                @click="toggleFeature('discretionaryLigatures')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: features.discretionaryLigatures }"
                >
                  <div
                    v-if="features.discretionaryLigatures"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Discretionary ligatures</span>
              </div>

              <div
                class="feature-option"
                @click="toggleFeature('tabularNumerals')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: features.tabularNumerals }"
                >
                  <div
                    v-if="features.tabularNumerals"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Tabular numerals</span>
              </div>

              <div class="feature-option" @click="toggleFeature('ligatures')">
                <div
                  class="feature-checkbox"
                  :class="{ active: features.ligatures }"
                >
                  <div v-if="features.ligatures" class="checkbox-dot"></div>
                </div>
                <span class="ml-2">Ligatures</span>
              </div>

              <div class="feature-option" @click="toggleFeature('ordinals')">
                <div
                  class="feature-checkbox"
                  :class="{ active: features.ordinals }"
                >
                  <div v-if="features.ordinals" class="checkbox-dot"></div>
                </div>
                <span class="ml-2">Ordinals</span>
              </div>

              <div
                class="feature-option"
                @click="toggleFeature('stylisticAlternates')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: features.stylisticAlternates }"
                >
                  <div
                    v-if="features.stylisticAlternates"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Stylistic alternates</span>
              </div>
            </div>
          </div>

           <div v-if="!isMobile" class="stylistic-sets bg-black">
            <h2 class="text-xl mb-4">Stylistic Sets</h2>

            <div class="grid-feature grid-cols-1 gap-4 bg-black">
              <div
                class="feature-option"
                @click="toggleStylisticSet('alternateT')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: stylisticSets.alternateT }"
                >
                  <div
                    v-if="stylisticSets.alternateT"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Alternate t</span>
              </div>

              <div
                class="feature-option"
                @click="toggleStylisticSet('alternateQ')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: stylisticSets.alternateQ }"
                >
                  <div
                    v-if="stylisticSets.alternateQ"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Alternate Q</span>
              </div>

              <div
                class="feature-option"
                @click="toggleStylisticSet('alternateG')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: stylisticSets.alternateG }"
                >
                  <div
                    v-if="stylisticSets.alternateG"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Alternate G, a, registered sign</span>
              </div>

              <div
                class="feature-option"
                @click="toggleStylisticSet('alternateSmallG')"
              >
                <div
                  class="feature-checkbox"
                  :class="{ active: stylisticSets.alternateSmallG }"
                >
                  <div
                    v-if="stylisticSets.alternateSmallG"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2">Alternate g</span>
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>

    <!-- font letter -->
    <div class="font-letters border-primary-js border-b-[1px]">
      <!-- Character Anatomy Section -->
      <div class="character-anatomy p-6 pb-10">
        <div class="section-label mb-6">Character Anatomy</div>

        <div
          class="flex flex-col md:flex-row gap-10 justify-between items-center"
        >
          <!-- Left side: Character with measurements -->
          <div
            class="character-measurements w-full md:w-1/2 items-center border-primary border-[2px]"
          >
            <div class="char-container">
              <!-- Display character -->
              <div
                class="display-character"
                :style="{
                  ...fontStylesAnatomy,
                  fontSize: isMobile ? '200px' : '420px',
                }"
              >
                {{ selectedCharacter }}
              </div>
            </div>
          </div>

          <!-- Right side: Grid view of some letters -->
          <div
            class="letter-showcase   overflow-y-auto"
            style="max-height: 580px"
            :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }"
          >
            <p class="text-gray-400 text-sm mb-2">
              {{ isArabicFont ? "Arabic letters" : "alphabet capital" }}
            </p>
            <div class="grid grid-cols-8 " :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }" >
              <div
                v-for="char in displayChars"
                :key="char"
                class="character-cell border-2 hover:border-primary p-1   overflow-x-hidden overflow-y-hidden"
                :class="{
                  'border-primary   ':
                    char === selectedCharacter,
                }" 
                :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }"
                @click="setSelectedCharacter(char)"
              >
                <div
                  class="showcase-char cursor-pointer p-1 "
                  :style="fontStylesCharacter, { color: themeStore.darkMode ? 'white' : 'black' }"
                  :dir="textDirection"
                >
                  {{ char }}
                </div>
              </div>
            </div>

            <div v-if="displayLowerChars.length > 0" class="mt-4">
              <p class="text-gray-400 text-sm mb-2">alphabet small</p>
              <div class="grid grid-cols-8 " :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }" >
                <div
                  v-for="char in displayLowerChars"
                  :key="char"
                  class="character-cell border-2 hover:border-primary p-1   overflow-x-hidden overflow-y-hidden"
                  :class="{
                    'border-primary    ': char === selectedCharacter,
                  }"
                  :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }"
                  @click="setSelectedCharacter(char)"
                >
                  <div class="showcase-char cursor-pointer" :style="fontStylesCharacter, { color: themeStore.darkMode ? 'white' : 'black' }">
                    {{ char }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <p class="text-gray-400 text-sm mb-2 text">special characters</p>
              <div class="grid grid-cols-8 " :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }" >
                <div
                  v-for="char in specialChars"
                  :key="char"
                  class="character-cell border-2 hover:border-primary p-1 "
                  :class="{
                    'border-primary    ': char === selectedCharacter,
                  }"
                  @click="setSelectedCharacter(char)"
                >
                  <div
                    class="showcase-char cursor-pointer  "
                    :style="fontStylesCharacter, { color: themeStore.darkMode ? 'white' : 'black' }"
                  >
                    {{ char }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <FontFamilyView />

  <!-- Debug Info (Development Only) -->
  <div v-if="showDebugInfo" class="debug-info p-4 border-t border-gray-800">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold">Font Debug Information</h3>
      <v-btn small text @click="toggleDebugInfo">Close</v-btn>
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div class="debug-column">
        <h4 class="text-md font-semibold mb-2">Font Details</h4>
        <div class="debug-item">
          <span class="debug-label">Font ID:</span>
          <span class="debug-value">{{ fontId }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Font Name:</span>
          <span class="debug-value">{{ font.name }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Font Family:</span>
          <span class="debug-value">{{
            currentFontFamily || getFontFamilyForFont(font.value)
          }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Is Variable:</span>
          <span class="debug-value">{{ isVariableFont }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Style Count:</span>
          <span class="debug-value">{{ styleOptions.length }}</span>
        </div>
      </div>

      <div class="debug-column">
        <h4 class="text-md font-semibold mb-2">Current Style</h4>
        <div class="debug-item" v-if="selectedStyle">
          <span class="debug-label">Selected Style:</span>
          <span class="debug-value">{{ selectedStyle.title }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Weight:</span>
          <span class="debug-value">{{ fontWeight }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Style:</span>
          <span class="debug-value">{{ fontStyle }}</span>
        </div>
        <div class="debug-item">
          <span class="debug-label">Size:</span>
          <span class="debug-value">{{ fontSize }}px</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Debug Toggle Button -->
  <!-- <div class="fixed bottom-4 right-4 z-50">
    <v-btn
      icon
      small
      elevation="4"
      color="gray"
      @click="toggleDebugInfo"
      class="debug-toggle"
    >
      <v-icon>mdi-bug</v-icon>
    </v-btn>
  </div> -->
</template>

<style scoped>
.border-primary-js {
  border-color: v-bind(primaryColor) !important;
}

.border-primary-js-hover:hover {
  border-color: v-bind(primaryColor) !important;
}

.trans {
  transition: all 0.3s ease;
}

.char-stretch {
  display: inline-block;
  transform-origin: center;
  transition: transform 0.3s ease;
}

.char-stretch:hover {
  transform: scaleX(1.2);
}

.variable-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.sample-text {
  outline: none;
  transition: all 0.3s ease;
  column-fill: auto;
  text-align: left;
}

.sample-text:focus {
  outline: 1px dashed rgba(255, 255, 255, 0.3);
}

.feature-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.feature-checkbox {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.2s ease;
}

.feature-checkbox.active {
  border-color: white;
}

.checkbox-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
}

/* Slider styles */
:deep(.v-slider .v-slider__track) {
  height: 2px !important;
  background-color: rgba(255, 255, 255, 0.3) !important;
}

:deep(.v-slider .v-slider__thumb) {
  width: 12px;
  height: 12px;
}

:deep(.v-slider .v-slider__track-fill) {
  background-color: white !important;
}

:deep(.v-btn-toggle) {
  background-color: transparent !important;
}

:deep(.v-btn-toggle .v-btn) {
  opacity: 0.7;
  background-color: transparent !important;
  color: rgba(255, 255, 255, 0.7) !important;
}

:deep(.v-btn-toggle .v-btn.v-btn--active) {
  opacity: 1;
  color: white !important;
}

.font-letters {
  margin-top: 40px;
  padding: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.character-anatomy {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: white;
}

.grid-feature {
  display: grid;
  grid-template-columns: repeat(4);
  gap: 1px;
  background-color: rgba(255, 255, 255, 0.1);
}

.char-container {
  height: 580px;
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.display-character {
  position: relative;
  z-index: 2;
  color: rgba(255, 255, 200, 0.9);
  font-size: 120px;
}

.measurement-line {
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.measurement-line::before {
  content: attr(data-label);
  position: absolute;
  left: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.measurement-value {
  position: absolute;
  right: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.showcase-cell {
  aspect-ratio: 1/1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(20, 20, 20, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.showcase-cell.selected {
  border-color: rgba(255, 220, 0, 0.8);
  background-color: rgba(40, 40, 20, 0.9);
}

.showcase-char {
  font-size: 50px !important;
}

.character-grid {
  color: var(--text-color, white);
}

.character-section {
  margin-bottom: 30px;
}

.section-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.character-cell {
  aspect-ratio: 1/1;

  cursor: pointer;
  transition: all 0.2s ease;
}

.character-cell.selected {
  border: 2px solid rgba(255, 220, 0, 0.8);
  background-color: rgba(40, 40, 20, 0.9);
}

.character {
  font-size: 24px;
  transition: transform 0.2s ease-in-out;
}

.character-cell:hover .character {
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .showcase-char {
    font-size: 30px !important;
  }

  .display-character {
    font-size: 80px;
  }

  .controls {
    flex-wrap: wrap;
  }

  .control-group {
    margin-bottom: 12px;
  }
}

@media (max-width: 480px) {
  .showcase-char {
    font-size: 20px !important;
  }
}

.style-selector {
  position: relative;
}

.style-btn {
  transition: all 0.2s ease;
}

.style-btn-active {
  color: #ffc107 !important;
  background-color: rgba(255, 193, 7, 0.1) !important;
}

.style-list-item {
  transition: all 0.2s ease;
}

.style-list-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.style-list-item-active {
  background: rgba(255, 193, 7, 0.1) !important;
}



.style-list-item-variable {
  border-left: 2px solid #ffc107;
}

.variable-badge {
  font-size: 10px;
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  padding: 1px 4px;
  border-radius: 8px;
  margin-left: 4px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.radio-circle {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: dotAppear 0.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes dotAppear {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* Debug Styles */
.debug-info {
  background-color: #1a1a1a;
  border-radius: 4px;
  margin-top: 20px;
}

.debug-column {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 12px;
}

.debug-item {
  margin-bottom: 8px;
  display: flex;
  font-size: 12px;
}

.debug-label {
  flex: 0 0 100px;
  color: rgba(255, 255, 255, 0.6);
}

.debug-value {
  color: rgba(255, 255, 255, 0.9);
  font-family: monospace;
}

.debug-toggle {
  background-color: rgba(30, 30, 30, 0.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Style display */
.current-style {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
}

.variable-tag-active {
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border-color: rgba(255, 193, 7, 0.3);
}

/* Mobile styles */
.mobile-controls-toggle {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.mobile-controls-toggle:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.mobile-controls {
  overflow: hidden;
}

.animate-slide-down {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 500px;
    opacity: 1;
  }
}

.mobile-slider {
  height: 36px;
}

.mobile-slider :deep(.v-slider__thumb) {
  width: 20px;
  height: 20px;
}

.mobile-control-group {
  padding: 6px 0;
}

.style-select-btn {
  min-height: 40px;
}

@media (max-width: 480px) {
  .mobile-sliders {
    margin-top: 10px;
  }

  .mobile-control-group {
    margin-bottom: 16px;
  }
}

/* Mobile styles for controls section */
.mobile-controls-container {
  animation: fadeIn 0.3s ease-out;
}

.mobile-section-toggle {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
}

.mobile-control-group {
  margin-bottom: 20px;
}

.mobile-section-header {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.mobile-section-header:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.mobile-feature-content {
  padding-left: 8px;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
  margin-left: 8px;
}

.feature-option {
  padding: 8px 0;
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .feature-option {
    padding: 12px 8px; /* Larger touch target */
  }

  .feature-checkbox {
    width: 24px; /* Larger checkbox */
    height: 24px;
  }

  .checkbox-dot {
    width: 12px; /* Larger dot */
    height: 12px;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Download button animation */
.download-btn:hover .download-icon {
  animation: rotate360 0.5s ease-in-out;
}

@keyframes rotate360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
