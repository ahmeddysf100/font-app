<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useFontStore } from "../stores/fonts";
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_STYLES,
  generateFontStyle,
} from "../utils/fontUtils";

const route = useRoute();
const router = useRouter();
const fontStore = useFontStore();

// Get the font from the store instead of hardcoding
const fontId = parseInt(route.params.id);
const font = computed(
  () => fontStore.currentFont || fontStore.getFontById(fontId) || {}
);

// Check if this font is a favorite
const isFavorite = computed(() => fontStore.isFavorite(fontId));

// Set default sample text for Arabic fonts
const getDefaultSampleText = () => {
  // If the font name starts with "KO" or "Ko", it's probably an Arabic font
  if (
    font.value &&
    font.value.name &&
    (font.value.name.startsWith("KO") || font.value.name.startsWith("Ko"))
  ) {
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

// Computed font styles using proper font family and utilities
const fontStyles = computed(() => {
  const fontFamily = getFontFamilyForFont(font.value);

  // Use generateFontStyle utility to build the base style
  const baseStyle = generateFontStyle(
    fontFamily,
    fontWeight.value,
    fontStyle.value
  );

  // Build font feature settings string
  let featureSettings = "";
  if (features.value.ligatures) featureSettings += '"liga" 1, ';
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
    ...baseStyle,
    fontSize: `${fontSize.value}px`,
    lineHeight: fontLeading.value,
    letterSpacing: `${fontTracking.value}px`,
    color: colorMode.value === "white" ? "white" : "black",
    textAlign: textAlign.value,
  };

  // Add font feature settings if any are enabled
  if (featureSettings.length > 0) {
    styles.fontFeatureSettings = featureSettings;
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

onMounted(() => {
  // Set current font in store
  fontStore.setCurrentFont(fontId);

  // Load favorites
  fontStore.loadFavorites();

  // Set sample text to font name (if available) or default
  if (font.value && font.value.name) {
    sampleText.value = font.value.name;
  }
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
  },
  { immediate: true }
);
</script>

<template>
  <div class="font-detail-view bg-black text-white min-h-screen">
    <!-- Back button -->
    <div class="px-6 pt-4">
      <v-btn color="gray" variant="text" @click="backToFonts" class="mb-4">
        <v-icon start>mdi-arrow-left</v-icon>
        Back to Fonts
      </v-btn>
    </div>

    <!-- Font Detail Header -->
    <div
      class="border border-gray-800 p-6"
      :style="{ backgroundColor: colorMode === 'black' ? '#ffffe3' : 'black' }"
    >
      <div class="flex justify-between items-center mb-4">
        <!-- Font Name and Info -->
        <div class="flex items-center">
          <h1
            class="text-2xl font-bold mr-3"
            :style="{ color: colorMode === 'black' ? 'black' : 'white' }"
          >
            {{ font.name }}
          </h1>
          <v-icon
            class="mr-3 cursor-pointer"
            :color="isFavorite ? 'yellow' : 'gray-400'"
            @click="addToFavorites"
          >
            {{ isFavorite ? "mdi-star" : "mdi-star-outline" }}
          </v-icon>
          <span class="text-gray-400 variable-tag">{{
            font.variable ? "Variable" : "Static"
          }}</span>
        </div>

        <!-- Controls -->
        <div class="controls flex items-center space-x-4">
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
              track-color="white"
              thumb-color="white"
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
              track-color="white"
              thumb-color="white"
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
              track-color="white"
              thumb-color="white"
            ></v-slider>
          </div>
          <!-- Tracking Control -->
          <div class="control-group">
            <span class="text-gray-400 text-sm mr-2">Tracking</span>
            <v-slider
              v-model="fontTracking"
              min="-100"
              max="100"
              step="1"
              class="slider-thumb d-inline-block w-24"
              density="compact"
              hide-details
              track-color="white"
              thumb-color="white"
            ></v-slider>
          </div>

          <!-- Info and License -->
          <div class="ml-6 text-sm text-gray-400">
            <div>{{ font.styleCount }} styles</div>
            <div>{{ font.isPremium ? "Premium" : "Free" }}</div>
          </div>
        </div>
      </div>

      <!-- Font Preview Area -->
      <div
        class="font-preview-area py-24 text-center"
        :style="{ color: colorMode === 'white' ? 'white' : 'black' }"
      >
        <div
          class="sample-text"
          contenteditable="true"
          :style="{ ...fontStyles, ...columnStyles }"
          @input="(e) => (sampleText = e.target.innerText)"
        >
          {{ sampleText }}
        </div>
      </div>

      <!-- Designer Info -->
      <div
        class="designer-info flex justify-between mt-4 text-sm text-gray-400"
      >
        <div>Designed by {{ font.designer }}</div>
        <v-btn
          color="yellow"
          variant="outlined"
          size="small"
          @click="goToFontFamily"
          :disabled="!font.id"
        >
          View Family
        </v-btn>
      </div>
    </div>

    <!-- Font Controls Section -->
    <div class="border-x border-b border-gray-800 p-6">
      <div class="flex justify-between mb-6">
        <!-- Text Controls -->
        <div class="text-controls">
          <h2 class="text-xl mb-4">Text</h2>

          <div class="flex items-center space-x-4">
            <!-- Text Alignment -->
            <div class="alignment-controls">
              <v-btn-toggle
                v-model="textAlign"
                mandatory
                color="white"
                density="comfortable"
              >
                <v-btn value="left" icon="mdi-format-align-left"></v-btn>
                <v-btn value="center" icon="mdi-format-align-center"></v-btn>
                <v-btn value="right" icon="mdi-format-align-right"></v-btn>
              </v-btn-toggle>
            </div>

            <!-- Columns -->
            <div class="columns-control ml-6">
              <span class="text-gray-400 text-sm mr-2">Columns</span>
              <v-btn-toggle
                v-model="columns"
                mandatory
                color="white"
                density="comfortable"
              >
                <v-btn value="single">Single</v-btn>
                <v-btn value="double">Double</v-btn>
                <v-btn value="triple">Triple</v-btn>
              </v-btn-toggle>
            </div>

            <!-- Color Mode -->
            <div class="color-mode-control ml-6">
              <span class="text-gray-400 text-sm mr-2">Color mode</span>
              <v-btn-toggle
                v-model="colorMode"
                mandatory
                color="white"
                density="comfortable"
              >
                <v-btn value="white">White</v-btn>
                <v-btn value="black">Black</v-btn>
              </v-btn-toggle>
            </div>
          </div>
        </div>

        <!-- Apply and Reset -->
        <div class="action-buttons flex items-center space-x-4">
          <v-btn color="primary" @click="applyToAll">Apply to All</v-btn>
          <v-btn variant="outlined" color="gray" @click="resetStyles"
            >Reset</v-btn
          >
        </div>
      </div>

      <!-- Features and Stylistic Sets -->
      <div class="grid-feature grid-cols-2 gap-8 mt-8 bg-black">
        <!-- Features -->
        <div class="features">
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
                <div v-if="features.tabularNumerals" class="checkbox-dot"></div>
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

        <!-- Stylistic Sets -->
        <div class="stylistic-sets bg-black">
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
                <div v-if="stylisticSets.alternateT" class="checkbox-dot"></div>
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
                <div v-if="stylisticSets.alternateQ" class="checkbox-dot"></div>
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
                <div v-if="stylisticSets.alternateG" class="checkbox-dot"></div>
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
    </div>

    <!-- font letter -->
    <div class="font-letters">
      <!-- Character Anatomy Section -->
      <div class="character-anatomy p-6 pb-10" >
        <div class="section-label mb-6">Character Anatomy</div>

        <div
          class="flex flex-col md:flex-row gap-10 justify-between items-center"
        >
          <!-- Left side: Character with measurements -->
          <div
            class="character-measurements w-full md:w-1/2  items-center"
          >
            <div class="char-container">
              <!-- Display character -->
              <div
                class="display-character"
                :style="{ ...fontStyles, fontSize: '420px' }"
              >
                {{ selectedCharacter }}
              </div>
            </div>
          </div>

          <!-- Right side: Grid view of some letters -->
          <div 
            class="letter-showcase bg-black overflow-y-auto" 
            style="max-height: 580px;"
          >
            <p class="text-gray-400 text-sm mb-2">alphabet capital</p>
            <div class="grid grid-cols-4 gap-4 bg-black">
              <div
                v-for="char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"
                :key="char"
                class="showcase-cell bg-black"
                :class="{ selected: char === selectedCharacter }"
                @click="setSelectedCharacter(char)"
              >
                <div class="showcase-char" :style="fontStyles">{{ char }}</div>
              </div>
            </div>

            <div class="mt-4">
              <p class="text-gray-400 text-sm mb-2">alphabet small</p>
              <div class="grid grid-cols-4 gap-4 bg-black">
                <div
                  v-for="char in 'abcdefghijklmnopqrstuvwxyz'"
                  :key="char"
                  class="showcase-cell bg-black"
                  :class="{ selected: char === selectedCharacter }"
                  @click="setSelectedCharacter(char)"
                >
                  <div class="showcase-char" :style="fontStyles">
                    {{ char }}
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <p class="text-gray-400 text-sm mb-2 text">special characters</p>
              <div class="grid grid-cols-4 gap-4 bg-black">
                <div
                  v-for="char in specialChars"
                  :key="char"
                  class="showcase-cell bg-black"
                  :class="{ selected: char === selectedCharacter }"
                  @click="setSelectedCharacter(char)"
                >
                  <div class="showcase-char" :style="fontStyles">
                    {{ char }}
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4 bg-black mt-4">
              <div
                v-for="char in specialChars"
                :key="char"
                class="showcase-cell bg-black"
                :class="{ selected: char === selectedCharacter }"
                @click="setSelectedCharacter(char)"
              >
                <div class="showcase-char" :style="fontStyles">{{ char }}</div>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-4 bg-black mt-4">
              <div
                v-for="char in specialChars"
                :key="char"
                class="showcase-cell bg-black"
                :class="{ selected: char === selectedCharacter }"
                @click="setSelectedCharacter(char)"
              >
                <div class="showcase-char" :style="fontStyles">{{ char }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.variable-tag {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
  font-size: 70px !important;
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

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background-color: rgba(255, 255, 255, 0.1);
}

.character-cell {
  background-color: rgba(20, 20, 20, 0.95);
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.character-cell.selected {
  border: 1px solid rgba(255, 220, 0, 0.8);
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
    font-size: 32px;
  }

  .display-character {
    font-size: 80px;
  }
}

@media (max-width: 480px) {
  .showcase-char {
    font-size: 24px;
  }
}
</style>
