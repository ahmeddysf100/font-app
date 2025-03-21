<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFontStore } from "../stores/fonts";
import { useSittingsStore } from "../stores/sittings";

// Import the font utility functions
import {
  FONT_FAMILIES,
  FONT_WEIGHTS,
  FONT_STYLES,
  generateFontStyle,
} from "../utils/fontUtils";
// Import fonts from fontLoader
import { fonts } from "../utils/fontLoader";

// Add development mode constant
const isDevelopment = import.meta.env.NODE_ENV === "development";

const props = defineProps({
  font: {
    type: Object,
    required: true,
  },
  fontSize: {
    type: Number,
    default: 60,
  },
  textAlignment: {
    type: String,
    default: "center",
  },
  sampleText: {
    type: String,
    default: "السلام عليكم",
  },
  textDarkMode: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();
const fontStore = useFontStore();
const showOptions = ref(false);
const sittingsStore = useSittingsStore();
// Font customization controls
const textDarkMode = ref(props.textDarkMode);
const fontWeight = ref(400);
const fontSize = ref(props.fontSize);
const fontStyle = ref("normal");
const leading = ref(1.2);
const tracking = ref(0);
const textAlign = ref(props.textAlignment);
const isAllCaps = ref(false);
const features = ref({
  ligatures: true,
  discretionaryLigatures: false,
  fractions: false,
  ordinals: false,
});

watch(
  () => sittingsStore.resetFlag,
  (newVal, oldVal) => {
    console.log("resetFlag", newVal, oldVal);
    if (newVal !== oldVal) {
      fontWeight.value = 400;
      fontSize.value = 60;
      leading.value = 1.2;
      tracking.value = 0;
      textAlign.value = "center";
      isAllCaps.value = false;
      features.value = {
        ligatures: true,
        discretionaryLigatures: false,
        fractions: false,
        ordinals: false,
      };
    }
  }
);
watch(
  () => sittingsStore.fontSize,
  (newVal) => {
    fontSize.value = newVal;
  }
);
watch(
  () => sittingsStore.fontAlignment,
  (newVal) => {
    textAlign.value = newVal;
  }
);
watch(
  () => sittingsStore.textSample,
  (newVal) => {
    localSampleText.value = newVal;
  }
);

// Initialize weight based on font.style if available
if (props.font) {
  if (props.font.style === "Thin") {
    fontWeight.value = 100;
  } else if (props.font.style === "ExtraLight") {
    fontWeight.value = 200;
  } else if (props.font.style === "Light") {
    fontWeight.value = 300;
  } else if (props.font.style === "Regular") {
    fontWeight.value = 400;
  } else if (props.font.style === "Medium") {
    fontWeight.value = 500;
  } else if (props.font.style === "SemiBold") {
    fontWeight.value = 600;
  } else if (props.font.style === "Bold") {
    fontWeight.value = 700;
  } else if (props.font.style === "ExtraBold") {
    fontWeight.value = 800;
  } else if (props.font.style === "Black") {
    fontWeight.value = 900;
  } else {
    fontWeight.value = 400; // Default to Regular
  }
}

// Computed property to check if font is a favorite
const isFavorite = computed(() => {
  return fontStore.isFavorite(props.font.id);
});

// View font detail page
const viewFontDetail = (e) => {
  e.preventDefault();
  // Set current font in store before navigating
  fontStore.setCurrentFont(props.font.id);
  router.push(`/fonts/${props.font.id}`);
};

// Toggle the options panel
const toggleOptions = (e) => {
  // Don't trigger if we're clicking inside options panel or preview
  if (
    e.target.closest(".font-options-panel") ||
    e.target.closest(".sample-text-editor") 
    // e.target.closest("button") ||
    // e.target.closest(".v-btn")
  ) {
    return;
  }

  e.preventDefault();
  e.stopPropagation();

  // Prevent focus that might cause outline
  const activeElement = document.activeElement;
  if (activeElement && activeElement !== document.body) {
    activeElement.blur();
  }

  showOptions.value = !showOptions.value;
};

// Methods to control font parameters
const updateFontWeight = (weight) => {
  fontWeight.value = parseInt(weight);
};

const updateFontSize = (size) => {
  fontSize.value = parseInt(size);
};

const updateLeading = (value) => {
  leading.value = value;
};

const toggleItalic = () => {
  fontStyle.value = fontStyle.value === "italic" ? "normal" : "italic";
};

const toggleAllCaps = () => {
  isAllCaps.value = !isAllCaps.value;
};

const toggleFeature = (feature) => {
  features.value[feature] = !features.value[feature];
};

const updateTracking = (value) => {
  tracking.value = value;
};

// Download font
const downloadFont = () => {
  // Implementation of downloadFont method
  alert(`Downloading ${props.font.name} font`);
};

// Add to favorites using the store
const addToFavorites = (e) => {
  e.stopPropagation();
  fontStore.toggleFavorite(props.font.id);
};

// Local sample text
const localSampleText = ref(props.sampleText);

// Update local sample text
const updateSampleText = (event) => {
  localSampleText.value = event.target.innerText;
};

// Helper function to get weight name
const getWeightName = (value) => {
  switch (value) {
    case 100:
      return "Thin";
    case 200:
      return "ExtraLight";
    case 300:
      return "Light";
    case 400:
      return "Regular";
    case 500:
      return "Medium";
    case 600:
      return "SemiBold";
    case 700:
      return "Bold";
    case 800:
      return "ExtraBold";
    case 900:
      return "Black";
    default:
      return value.toString();
  }
};

// New variables for the style dropdown
const selectedStyle = ref(null);
const showStyleMenu = ref(false);

// Current font data from the new fonts array
const currentFontData = computed(() => {
  return fonts.find((f) => f.name === props.font.name) || null;
});

// Available styles based on the new font structure
const styleOptions = computed(() => {
  if (!currentFontData.value) return [];

  return currentFontData.value.styles
    .map((style) => ({
      title: style.name,
      weight: style.weight || 400,
      italic: style.style === "italic",
      fontFamily: style.fontFamily || currentFontData.value.fontFamily,
      isVariable: false,
    }))
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

// Enhanced sample text style computation
const sampleTextStyle = computed(() => {
  const style = {
    fontFamily:
      currentFontFamily.value ||
      currentFontData.value?.fontFamily ||
      props.font.fontFamily,
    fontSize: `${fontSize.value}px`,
    lineHeight: leading.value,
    letterSpacing: `${tracking.value}px`,
    textAlign: textAlign.value,
    textTransform: isAllCaps.value ? "uppercase" : "none",
    fontWeight: fontWeight.value,
    fontStyle: fontStyle.value,
    color: textDarkMode ? "white" : "black",
  };

  // Add variable font settings if applicable
  if (isVariableFont.value) {
    style.fontVariationSettings = `'wght' ${fontWeight.value}`;
  }

  // Add OpenType features
  const featureSettings = [];
  if (features.value.ligatures) featureSettings.push('"liga" 1');
  if (features.value.discretionaryLigatures) featureSettings.push('"dlig" 1');
  if (features.value.fractions) featureSettings.push('"frac" 1');
  if (features.value.ordinals) featureSettings.push('"ordn" 1');

  if (featureSettings.length > 0) {
    style.fontFeatureSettings = featureSettings.join(", ");
  }

  return style;
});

// Initialize component
onMounted(() => {
  initSelectedStyle();

  // Set initial weight based on font style
  if (currentFontData.value?.styles[0]?.weight) {
    fontWeight.value = currentFontData.value.styles[0].weight;
  }

  // Enable appropriate features for Arabic fonts
  if (props.font.category === "Arabic") {
    features.value.ligatures = true;
  }
});

// Watch for font changes
watch(
  () => props.font,
  () => {
    initSelectedStyle();
  },
  { deep: true }
);

watch(
  () => props.textDarkMode,
  (newVal) => {
    textDarkMode.value = newVal;
  }
);

// Add a watch to track changes in the settings store
watch(
  () => sittingsStore.fontSize,
  (newVal) => {
    fontSize.value = newVal;
  }
);

watch(
  () => sittingsStore.fontWeight,
  (newVal) => {
    fontWeight.value = newVal;
    // Update selected style based on new weight if possible
    if (styleOptions.value.length > 0) {
      const matchingStyle = styleOptions.value.find(
        (style) =>
          style.weight === newVal &&
          style.italic === (fontStyle.value === "italic")
      );
      if (matchingStyle) {
        selectedStyle.value = matchingStyle;
      }
    }
  }
);

watch(
  () => sittingsStore.leading,
  (newVal) => {
    leading.value = newVal;
  }
);

watch(
  () => sittingsStore.tracking,
  (newVal) => {
    tracking.value = newVal;
  }
);

watch(
  () => sittingsStore.textAlign,
  (newVal) => {
    textAlign.value = newVal;
  }
);

watch(
  () => sittingsStore.sampleText,
  (newVal) => {
    localSampleText.value = newVal;
  }
);

watch(
  () => sittingsStore.isAllCaps,
  (newVal) => {
    isAllCaps.value = newVal;
  }
);

// Updated computed properties
// Replace the fontStyles computed property with this:
const previewContainerStyle = computed(() => {
  // Use the current font family (which updates based on style selection)
  const fontName =
    currentFontFamily.value ||
    currentFontData.value?.fontFamily ||
    props.font.fontFamily;

  // Use our font utilities to generate the base style
  let style = generateFontStyle(fontName, fontWeight.value, fontStyle.value);

  // Add size and alignment properties
  style.fontSize = `${fontSize.value}px`;
  style.textAlign = textAlign.value;
  style.lineHeight = leading.value;

  // Add variation settings for variable fonts if needed
  if (isVariableFont.value) {
    style.fontVariationSettings = `'wght' ${fontWeight.value}`;
  }

  return style;
});

// Helper function to get font family based on font name
const getFontFamilyForFont = (font) => {
  if (!font) return "";

  console.log("Processing font:", font.name);

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

  // Fallback to the conditional checks
  return font.name === "KOLemaza"
    ? FONT_FAMILIES.KOLEMAZA
    : font.name === "KOAynama Sharp"
    ? FONT_FAMILIES.KOAYNAMA_SHARP
    : font.name === "KOAynama Curved"
    ? FONT_FAMILIES.KOAYNAMA_CURVED
    : font.name === "KoShareb"
    ? FONT_FAMILIES.KOSHAREB
    : font.name === "Ko Banzeen"
    ? FONT_FAMILIES.KOBANZEEN
    : font.name === "KoDongol"
    ? FONT_FAMILIES.KODONGOL
    : font.name === "KoKhalaya"
    ? FONT_FAMILIES.KOKHALAYA
    : font.name === "KoKhalaya Variable"
    ? FONT_FAMILIES.KOKHALAYA_VARIABLE
    : font.name === "KORubbama"
    ? FONT_FAMILIES.KORUBBAMA
    : font.name === "KORubbama Expanded"
    ? FONT_FAMILIES.KORUBBAMA_EXPANDED
    : font.name === "KoGaliModern"
    ? FONT_FAMILIES.KOGALIMODERN
    : font.name === "Satoshi"
    ? FONT_FAMILIES.SATOSHI
    : font.name === "Satoshi Variable"
    ? FONT_FAMILIES.SATOSHI_VARIABLE
    : `'${font.name}'`;
};

onMounted(() => {
});
</script>

<template>
  <div
    class="font-card-container relative transition-all"
    :class="{ 'options-active': showOptions }"
  >
    <!-- Main Card with integrated options panel -->
    <v-card
      flat
      class="font-card bg-black border border-gray-800 text-white hover:border-yellow-500 transition-all duration-300"
    >
      <div
        class="px-6 py-4 flex justify-between items-center border-b border-gray-800"
        @click="toggleOptions"
      >
        <div>
          <h3 class="font-bold text-xl">{{ font.name }}</h3>
          <div class="flex items-center mt-1">
            <span
              class="text-gray-400 text-sm mr-2 cursor-pointer"
              @click.stop="showStyleMenu = !showStyleMenu"
            >
              <span class="text-white">{{
                selectedStyle?.title || "Regular"
              }}</span>
              <span v-if="styleOptions.length > 1" class="style-count ml-2">
                +{{ styleOptions.length - 1 }}
              </span>
            </span>
            <span class="text-gray-400 text-sm ml-2">
              {{
                isVariableFont
                  ? "Variable"
                  : currentFontData?.category || font.category
              }}
            </span>
          </div>
        </div>
        <div class="flex items-center bg-black">
          <!-- Font Style Dropdown using v-menu -->
          <div class="style-menu-container mr-2">
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
                  color="grey"
                  v-bind="props"
                  @click.stop
                  class="style-btn"
                  :class="{ 'style-btn-active': showStyleMenu }"
                >
                  <v-icon>mdi-format-font</v-icon>
                </v-btn>
              </template>
              <v-list
                class="style-list bg-black border border-gray-700 rounded pa-2"
                max-height="300"
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
                  class="style-list-item rounded mb-1 px-3 py-1"
                  :class="{
                    'style-list-item-active':
                      selectedStyle && selectedStyle.title === style.title,
                    'style-list-item-variable': style.isVariable,
                  }"
                >
                  <template v-slot:prepend>
                    <div class="radio-circle mr-2">
                      <div
                        v-if="
                          selectedStyle && selectedStyle.title === style.title
                        "
                        class="radio-dot"
                      ></div>
                    </div>
                  </template>
                  <v-list-item-title class="text-sm">
                    {{ style.title }}
                    <span v-if="style.isVariable" class="variable-badge"
                      >Variable</span
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
          <v-btn
            icon
            variant="text"
            :color="isFavorite ? 'yellow' : 'grey'"
            class="mr-2"
            @click.stop="addToFavorites"
          >
            <v-icon>{{ isFavorite ? "mdi-star" : "mdi-star-outline" }}</v-icon>
          </v-btn>
          <v-btn icon variant="text" color="grey" @click.stop="viewFontDetail">
            <v-icon>mdi-arrow-top-right</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- Font Preview -->
      <div
        class="font-preview px-6"
        :class="{
          'preview-collapsed': showOptions,
          'auto-height': fontSize > 80,
          'arabic-font': font.category === 'Arabic',
          'bg-dark-btn': textDarkMode,
          'bg-light-btn': !textDarkMode,
        }"
        :style="previewContainerStyle"
        @click.stop
      >
        <!-- Debug info - only visible in development mode -->
        <div v-if="isDevelopment" class="font-debug-info">
          <div class="font-debug-label">Font: {{ font.name }}</div>
          <div class="font-debug-label">
            Family: {{ currentFontFamily || currentFontData?.fontFamily }}
          </div>
          <div class="font-debug-label">
            Style: {{ selectedStyle?.title }} ({{ fontWeight }} {{ fontStyle }})
          </div>
          <div class="font-debug-label">
            Variable: {{ isVariableFont ? "Yes" : "No" }}
          </div>
          <div class="font-debug-label">
            Category: {{ currentFontData?.category }}
          </div>
        </div>

        <p
          contenteditable="true"
          class="sample-text-editor m-0 text-wrap"
          @input="updateSampleText"
          v-text="localSampleText"
          :class="[
            `weight-${fontWeight}`,
            { 'rtl-text': font.category === 'Arabic' },
            { 'text-dark-btn': !textDarkMode },
            { 'text-light-btn': textDarkMode },
          ]"
          :style="sampleTextStyle"
        ></p>
      </div>

      <!-- Font Options Panel (Integrated within card) -->
      <div
        v-show="showOptions"
        class="font-options-panel px-6 py-4 border-t border-yellow-500 animate-fadeIn"
        @click.stop
      >
        <div class="grid grid-cols-1 gap-4">
          <!-- Weight Slider -->
          <div class="option-row flex items-center mt-7">
            <div class="option-label text-white text-sm w-20">Size</div>
            <div class="flex-grow">
              <div class="flex items-center">
                <v-slider
                  v-model="fontSize"
                  min="10"
                  max="280"
                  step="1"
                  class="slider-thumb flex-grow"
                  density="compact"
                  track-color="white"
                  thumb-color="white"
                  hide-details
                  @update:model-value="updateFontSize"
                  thumb-label
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    {{ modelValue }}
                  </template>
                </v-slider>
                <div
                  class="weight-indicator ml-2 text-white text-xs min-w-[40px] text-right"
                >
                  {{ fontSize }}
                </div>
              </div>
            </div>
          </div>

          <!-- Weight Slider -->
          <div class="option-row flex items-center mt-7">
            <div class="option-label text-white text-sm w-20">Weight</div>
            <div class="flex-grow">
              <div class="flex items-center">
                <v-slider
                  v-model="fontWeight"
                  min="100"
                  max="900"
                  step="1"
                  class="slider-thumb flex-grow"
                  density="compact"
                  track-color="white"
                  thumb-color="white"
                  hide-details
                  @update:model-value="updateFontWeight"
                  thumb-label
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    {{ modelValue }}
                  </template>
                </v-slider>
                <div
                  class="weight-indicator ml-2 text-white text-xs min-w-[40px] text-right"
                >
                  {{ fontWeight }}
                </div>
              </div>
            </div>
          </div>

          <!-- Size/Leading Slider -->
          <div class="option-row flex items-center">
            <div class="option-label text-white text-sm w-20">Leading</div>
            <v-slider
              v-model="leading"
              min="0.8"
              max="2"
              step="0.05"
              class="slider-thumb flex-grow"
              density="compact"
              track-color="white"
              thumb-color="white"
              hide-details
              @update:model-value="updateLeading"
            >
              <template v-slot:thumb-label="{ modelValue }">
                {{ modelValue }}
              </template>
            </v-slider>
            <div
              class="weight-indicator ml-2 text-white text-xs min-w-[40px] text-right"
            >
              {{ leading }}
            </div>
          </div>

          <!-- Tracking/Letter Spacing -->
          <div class="option-row flex items-center">
            <div class="option-label text-white text-sm w-20">Tracking</div>
            <v-slider
              v-model="tracking"
              min="-100"
              max="100"
              step="1"
              class="slider-thumb flex-grow"
              density="compact"
              track-color="white"
              thumb-color="white"
              hide-details
              @update:model-value="updateTracking"
            >
              <template v-slot:thumb-label="{ modelValue }">
                {{ modelValue }}
              </template>
            </v-slider>
            <div
              class="weight-indicator ml-2 text-white text-xs min-w-[40px] text-right"
            >
              {{ tracking }}
            </div>
          </div>

          <div class="flex justify-between items-center">
            <div>
              <!-- Text Alignment -->
              <div class="option-row flex items-center">
                <div class="option-label text-white text-sm w-20">Align</div>
                <v-btn-toggle
                  v-model="textAlign"
                  color="white"
                  density="comfortable"
                  mandatory
                  class="border-0"
                >
                  <v-btn
                    value="left"
                    icon="mdi-format-align-left"
                    size="small"
                  ></v-btn>
                  <v-btn
                    value="center"
                    icon="mdi-format-align-center"
                    size="small"
                  ></v-btn>
                  <v-btn
                    value="right"
                    icon="mdi-format-align-right"
                    size="small"
                  ></v-btn>
                </v-btn-toggle>
              </div>
            </div>
            <div>
              <!-- Text Transform (All Caps) -->
              <div
                class="option-row text-transform flex items-center justify-start gap-4 mt-1"
              >
                <div class="feature-option" @click="toggleAllCaps">
                  <div
                    class="feature-checkbox-square"
                    :class="{ active: isAllCaps }"
                  >
                    <span class="checkbox-text font-bold">A</span>
                  </div>
                  <span class="ml-2 text-xs">All Caps</span>
                </div>

                <!-- Italic Toggle -->
                <div class="feature-option" @click="toggleItalic">
                  <div
                    class="feature-checkbox-square"
                    :class="{ active: fontStyle === 'italic' }"
                  >
                    <span class="checkbox-text italic">I</span>
                  </div>
                  <span class="ml-2 text-xs">Italic</span>
                </div>
              </div>
            </div>
          </div>

          <!-- OpenType Features Section -->
          <div class="pt-2 mt-2 border-t border-gray-700">
            <div class="text-white text-sm font-medium mb-3">
              OpenType Features
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-2">
              <!-- Feature Controls -->
              <div class="feature-option" @click="toggleFeature('ligatures')">
                <div
                  class="feature-checkbox"
                  :class="{ active: features.ligatures }"
                >
                  <div v-if="features.ligatures" class="checkbox-dot"></div>
                </div>
                <span class="ml-2 text-xs">Ligatures</span>
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
                <span class="ml-2 text-xs">Discretionary Ligatures</span>
              </div>

              <div class="feature-option" @click="toggleFeature('fractions')">
                <div
                  class="feature-checkbox"
                  :class="{ active: features.fractions }"
                >
                  <div v-if="features.fractions" class="checkbox-dot"></div>
                </div>
                <span class="ml-2 text-xs">Fractions</span>
              </div>

              <div class="feature-option" @click="toggleFeature('ordinals')">
                <div
                  class="feature-checkbox"
                  :class="{ active: features.ordinals }"
                >
                  <div v-if="features.ordinals" class="checkbox-dot"></div>
                </div>
                <span class="ml-2 text-xs">Ordinals</span>
              </div>
            </div>
          </div>

          <!-- Actions Row -->
          <div
            class="actions-row flex items-center justify-between mt-2 pt-2 border-t border-gray-700"
          >
            <v-btn
              size="small"
              color="primary"
              variant="flat"
              density="comfortable"
              @click="downloadFont"
              prepend-icon="mdi-download"
            >
              {{ font.isPremium ? "Buy" : "Download" }}
            </v-btn>

            <v-btn
              size="small"
              color="yellow"
              variant="outlined"
              @click.stop="viewFontDetail"
            >
              View Family
            </v-btn>

            <v-btn
              size="small"
              :color="isFavorite ? 'yellow' : 'gray'"
              icon
              variant="text"
              @click="addToFavorites"
            >
              <v-icon>{{
                isFavorite ? "mdi-star" : "mdi-star-outline"
              }}</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Designer info -->
      <div
        class="px-6 py-4 border-t border-gray-800 text-gray-400 text-sm flex justify-between"
      >
        <span>By {{ font.designer }}</span>
        <v-btn
          size="small"
          variant="text"
          color="gray"
          icon
          @click="toggleOptions"
          class="customize-btn"
        >
          <v-icon>{{ showOptions ? "mdi-chevron-up" : "mdi-tune" }}</v-icon>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<style scoped>

.text-dark-btn {
  color: rgb(255,255,227) !important;
}

.text-light-btn {
  color: black !important;
}

.bg-dark-btn {
  background-color: rgb(255,255,227) !important;
}

.bg-light-btn {
  background-color: black !important;
}
.font-card-container {
  margin-bottom: 20px;
}

.font-card {
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  position: relative;
  overflow: hidden;
  border-color: transparent;
}

.font-card:hover {
  transform: translateY(-2px);
  border-color: #ffc107 !important;
}

.font-preview {
  min-height: 180px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
  padding-top: 48px;
  padding-bottom: 48px;
  font-variation-settings: inherit; /* Inherit font variation settings */
  width: 100%;
}

.preview-collapsed {
  min-height: 120px;
  height: auto;
  padding-top: 24px;
  padding-bottom: 24px;
}

.auto-height {
  min-height: 250px;
}

.customize-btn {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.font-card:hover .customize-btn {
  opacity: 1;
}

.font-options-panel {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.65s cubic-bezier(0.25, 1, 0.5, 1),
    opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.55s cubic-bezier(0.25, 1, 0.5, 1);
  transform: translateY(-10px);
}

.options-active .font-options-panel {
  max-height: 600px;
  opacity: 1;
  overflow-y: auto;
  transform: translateY(0);
}

.options-active .font-card {
  border-color: #ffc107 !important;
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

.animate-fadeIn {
  animation: fadeIn 0.55s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(-15px);
  }
  30% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Button toggle styles */
:deep(.v-btn-toggle) {
  background-color: transparent !important;
  border: none !important;
  transition: all 0.3s ease;
}

:deep(.v-btn-toggle .v-btn) {
  opacity: 0.7;
  color: rgba(255, 255, 255, 0.7) !important;
  min-width: 32px;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

:deep(.v-btn-toggle .v-btn.v-btn--active) {
  opacity: 1;
  color: white !important;
  background-color: rgba(255, 255, 255, 0.1) !important;
  transform: scale(1.05);
}

:deep(.v-btn) {
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1) !important;
}

:deep(.v-btn:hover) {
  transform: translateY(-1px);
}

:deep(.v-btn:active) {
  transform: translateY(0);
}

/* Feature checkbox styles */
.feature-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  padding: 4px;
  border-radius: 4px;
}

.feature-option:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(2px);
}

.feature-checkbox {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.feature-checkbox.active {
  border-color: #ffc107;
  background-color: rgba(255, 193, 7, 0.1);
}

.checkbox-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffc107;
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

/* Scrollbar styles */
.font-options-panel::-webkit-scrollbar {
  width: 4px;
}

.font-options-panel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.font-options-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.font-options-panel::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sample-text-editor {
  width: 100%;
  height: auto;
  min-height: calc(100% - 20px);
  display: block;
  outline: none;
  cursor: text;
  transition: all 0.2s ease;
  font-synthesis: none; /* Prevents the browser from synthesizing missing font faces */
  /* Ensure font smoothing is optimal */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  overflow-y: auto;
  padding: 10px;
}

.sample-text-editor:focus {
  outline: 1px dashed rgba(255, 255, 255, 0.2);
}

/* Style dropdown */
.style-menu-container {
  position: relative;
}

.style-selector-button {
  background: rgba(50, 50, 50, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  min-width: 120px;
}

.style-selector-button:hover {
  background: rgba(60, 60, 60, 0.5);
  border-color: rgba(255, 255, 255, 0.2);
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

.style-list-item-active .v-list-item-title {
  color: #ffc107 !important;
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
  background-color: #ffc107;
  animation: dotAppear 0.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

:deep(.v-overlay__content) {
  border-radius: 6px;
  overflow: hidden !important;
}

:deep(.v-list.style-list) {
  padding: 6px !important;
  max-height: 300px;
  overflow-y: auto;
}

:deep(.v-list-item) {
  min-height: 32px !important;
}

:deep(.v-list.style-list::-webkit-scrollbar) {
  width: 4px;
}

:deep(.v-list.style-list::-webkit-scrollbar-track) {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.v-list.style-list::-webkit-scrollbar-thumb) {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

:deep(.v-list.style-list::-webkit-scrollbar-thumb:hover) {
  background: rgba(255, 255, 255, 0.3);
}

/* Let's also add special styles for the "All Caps" feature since we removed the button */
.option-row.text-transform {
  margin-top: -8px;
}

.style-radio {
  flex-shrink: 0;
}

/* Weight-specific classes using font-variation-settings */
.weight-100 {
  font-variation-settings: "wght" 100;
}
.weight-200 {
  font-variation-settings: "wght" 200;
}
.weight-300 {
  font-variation-settings: "wght" 300;
}
.weight-400 {
  font-variation-settings: "wght" 400;
}
.weight-500 {
  font-variation-settings: "wght" 500;
}
.weight-600 {
  font-variation-settings: "wght" 600;
}
.weight-700 {
  font-variation-settings: "wght" 700;
}
.weight-800 {
  font-variation-settings: "wght" 800;
}
.weight-900 {
  font-variation-settings: "wght" 900;
}

.yellow-box.active {
  background-color: #ffeb3b;
  border-color: #ffc107;
}

.yellow-box.active .checkbox-dot {
  background-color: #212121;
}

/* Square checkbox styles for text formatting options */
.feature-checkbox-square {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
  background-color: rgba(30, 30, 30, 0.8);
}

.feature-checkbox-square:hover {
  border-color: #ffeb3b;
}

.feature-checkbox-square.active {
  border-color: #ffc107;
  background-color: #212121;
  box-shadow: 0 0 0 1px #ffc107;
}

.checkbox-text {
  color: white;
  font-size: 14px;
  line-height: 1;
}

.feature-checkbox-square.active .checkbox-text {
  color: #ffeb3b;
}

.feature-option:hover .feature-checkbox-square {
  border-color: #ffeb3b;
}

.font-debug-label {
  margin-bottom: 2px;
}

.font-monospace {
  font-family: "Courier New", monospace;
  padding: 1px 3px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 2px;
}

/* Style count badge */
.style-count {
  display: inline-block;
  background-color: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  font-size: 11px;
  padding: 1px 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

/* Style button active state */
.style-btn-active {
  color: #ffc107 !important;
  background-color: rgba(255, 193, 7, 0.1) !important;
}

/* New and enhanced styles */
.rtl-text {
  direction: rtl;
  text-align: right;
}

.arabic-font {
  font-feature-settings: "liga" 1, "kern" 1;
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

.style-list-item-variable {
  border-left: 2px solid #ffc107;
}

.font-debug-info {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #888;
  z-index: 1;
}

/* Enhanced animation for style changes */
.sample-text-editor {
  transition: font-weight 0.3s ease, font-style 0.3s ease, font-size 0.3s ease;
}
</style>
