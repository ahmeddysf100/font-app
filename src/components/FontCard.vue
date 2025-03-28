<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useFontStore } from "../stores/fonts";
import { useSittingsStore } from "../stores/sittings";
import { useThemeStore } from "../stores/theme";

// Import fonts from fontLoader
import fonts from "../../public/fonts.json";
// console.log("fonts", fonts);
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
const themeStore = useThemeStore();
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

// Add these variables for variable font parameters
const variableFontParams = ref({});

// A computed property to get available variable font axes for the current font
const variableFontAxes = computed(() => {
  if (
    !currentFontData.value ||
    !currentFontData.value.variable ||
    currentFontData.value.variable.length === 0
  ) {
    return [];
  }
  // console.log("selectedStyle", selectedStyle.value);
  const varFont = selectedStyle.value;
  if (!varFont?.variationSettings) return [];

  // Extract axes from variationSettings (e.g., "'MORF' 15, 'SHLN' 50" or "'wght' 400, 'slnt' 0")
  const axesMatches =
    varFont.variationSettings.match(/'([^']+)'\s+([0-9.-]+)/g) || [];

  return axesMatches.map((match) => {
    const [_, axis, value] = match.match(/'([^']+)'\s+([0-9.-]+)/);

    // Define min/max ranges for known axes, defaults for unknown ones
    let min = 0;
    let max = 1000;
    let step = 1;

    // Set appropriate ranges for each axis type
    switch (axis) {
      case "wght":
        min = 1;
        max = 1000;
        step = 1;
        break;
      case "slnt":
        min = -15;
        max = 15;
        step = 1;
        break;
      case "MORF":
        min = 0;
        max = 45;
        step = 1;
        break;
      case "SHLN":
        min = 0;
        max = 100;
        step = 1;
        break;
    }

    return {
      axis,
      value: parseFloat(value),
      min,
      max,
      step,
    };
  });
});

// Check if the current font has variable font axes
const hasVariableFontAxes = computed(() => {
  return variableFontAxes.value.length > 0;
});

// Initialize variable font parameters
const initVariableFontParams = () => {
  if (variableFontAxes.value.length > 0) {
    const params = {};
    variableFontAxes.value.forEach((axis) => {
      params[axis.axis] = axis.value;
    });
    variableFontParams.value = params;
  }
};

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
const showStyleMenuMobile = ref(false);
const isMobile = ref(false);

// Add this function to check screen size
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768; // or your breakpoint
};

// Current font data from the new fonts array
const currentFontData = computed(() => {
  return fonts.find((f) => f.name === props.font.name) || null;
});

// Available styles based on the new font structure
const styleOptions = computed(() => {
  if (!currentFontData.value) return [];

  return currentFontData.value?.styles
    .map((style) => ({
      title: style.name,
      weight: style.weight || 400,
      italic: style.style === "italic",
      fontFamily: style.fontFamily || currentFontData.value.fontFamily,
      isVariable: false,
      variationSettings: style.variationSettings,
    }))
    .concat(
      currentFontData.value?.variable
        ? currentFontData.value.variable.map((varFont) => ({
            title: "Variable" + (varFont.style === "italic" ? " Italic" : ""),
            weight: 400,
            italic: varFont.style === "italic",
            fontFamily: varFont.fontFamily,
            isVariable: true,
            variationSettings: varFont.variationSettings,
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
  if (
    isVariableFont.value &&
    Object.keys(variableFontParams.value).length > 0
  ) {
    // Build font-variation-settings string from all available axes
    const settings = Object.entries(variableFontParams.value)
      .map(([axis, value]) => `'${axis}' ${value}`)
      .join(", ");

    if (settings) {
      style.fontVariationSettings = settings;
    }
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

  // Initialize variable font parameters
  initVariableFontParams();

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
    initVariableFontParams();
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
  let style = {};
  style.fontName = fontName;
  style.fontWeight = fontWeight.value;
  style.fontStyle = fontStyle.value;

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

const isDarkMode = computed(() => {
  return themeStore.darkMode === true ? "white" : "black";
});

// Watch for changes to the primary color
const primaryColor = ref(sittingsStore.primaryColor);
const borderStyle = ref({ borderColor: `${primaryColor.value}99 !important` }); // Dynamic style
watch(
  () => sittingsStore.primaryColor,
  (color) => {
    primaryColor.value = color;
  }
);

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});
onUnmounted(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<template>
  <div
    class="font-card-container relative transition-all overflow-hidden"
    :class="{
      'options-active': showOptions,
    }"
    style="border-radius: 15px;"
  >
    <!-- Main Card with integrated options panel -->
    <div
      class="font-card relative overflow-hidden border-2 border-primary"
      :class="{
        'bg-black': themeStore.darkMode,
        'bg-card': !themeStore.darkMode
      }"
      :style="{
        color: themeStore.darkMode ? 'white' : 'black',
        transition: 'background-color 0.3s ease, color 0.3s ease',
        borderRadius: '15px'
      }"
    >
      <div
        class="px-6 py-4 flex flex-wrap justify-between items-center border-b-2 border-primary"
      >
        <div>
          <h3
            class="font-bold text-xl"
            :class="{
              'text-white': themeStore.darkMode,
              'text-black': !themeStore.darkMode,
            }"
          >
            {{ font.name }}
          </h3>
          <div class="flex items-center mt-1">
            <span class="text-gray-400 text-sm mr-2 cursor-pointer">
              <span
                class=" "
                :class="{
                  'text-white': themeStore.darkMode,
                  'text-black': !themeStore.darkMode,
                }"
                >{{ selectedStyle?.title || "Regular" }}</span
              >
              <span v-if="styleOptions.length > 1" class="style-count ml-2">
                +{{ styleOptions.length - 1 }}
              </span>
            </span>
            <span
              class="text-gray-400 text-sm ml-2"
              :class="{
                'text-gray-400': themeStore.darkMode,
                'text-gray-600': !themeStore.darkMode,
              }"
            >
              {{
                isVariableFont
                  ? "Variable"
                  : currentFontData?.category || font.category
              }}
            </span>
          </div>
        </div>

        <!-- Font controls moved to header -->
        <div class="font-controls flex items-center desktop-only">
          <!-- Size Slider (replacing dropdown) - desktop only -->
          <div class="size-selector mr-4">
            <div class="flex items-center">
              <div class="text-xs text-gray-400 mr-2">Size</div>
              <div class="header-slider">
                <v-slider
                  v-model="fontSize"
                  min="10"
                  max="280"
                  step="1"
                  class="slider-thumb compact-slider"
                  hide-details
                  density="compact"
                  :color="primaryColor"
                  :thumb-color="primaryColor"
                  :track-color="primaryColor"
                  @click.stop
                  thumb-label="hover"
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    {{ modelValue }}px
                  </template>
                </v-slider>
              </div>
              <div class="ml-1 text-white text-xs font-mono">
                {{ fontSize }}
              </div>
            </div>
          </div>

          <!-- Weight Slider (if not variable font with wght axis) -->
          <div
            v-if="!isVariableFont || !variableFontParams['wght']"
            class="weight-selector mr-4"
          >
            <div class="flex items-center">
              <div class="text-xs text-gray-400 mr-2">Weight</div>
              <div class="header-slider">
                <v-slider
                  v-model="fontWeight"
                  min="100"
                  max="900"
                  step="1"
                  class="slider-thumb compact-slider"
                  hide-details
                  density="compact"
                  :color="primaryColor"
                  :thumb-color="primaryColor"
                  :track-color="primaryColor"
                  @click.stop
                  thumb-label="hover"
                >
                  <template v-slot:thumb-label="{ modelValue }">
                    {{ getWeightName(modelValue) }}
                  </template>
                </v-slider>
              </div>
              <div class="ml-1 text-white text-xs font-mono">
                {{ fontWeight }}
              </div>
            </div>
          </div>

          <!-- Dynamic Variable Font Controls - desktop only -->
          <div
            v-for="axis in variableFontAxes"
            :key="axis.axis"
            class="var-control-selector mr-4 flex"
          >
            <div class="flex items-center">
              <div class="text-xs text-gray-400 mr-2">{{ axis.axis }}</div>
              <div class="header-slider">
                <v-slider
                  v-model="variableFontParams[axis.axis]"
                  :min="axis.min"
                  :max="axis.max"
                  :step="axis.step"
                  class="slider-thumb compact-slider"
                  hide-details
                  density="compact"
                  :color="primaryColor"
                  :thumb-color="primaryColor"
                  :track-color="primaryColor"
                  @click.stop
                  thumb-label="hover"
                >
                </v-slider>
              </div>
              <div class="ml-2 text-white text-xs font-mono">
                {{ variableFontParams[axis.axis] }}
              </div>
            </div>
          </div>

          <!-- Style Menu Button -->
          <div class="style-menu-container mr-2">
            <v-menu
              v-model="showStyleMenu"
              :close-on-content-click="false"
              location="bottom"
              offset="5"
              :class="{ 'mobile-menu': isMobile }"
            >
              <template v-slot:activator="{ props }">
                <v-btn
                  icon
                  variant="text"
                  :color="primaryColor"
                  v-bind="props"
                  @click.stop
                  class="style-btn"
                >
                  <v-icon>mdi-format-font</v-icon>
                </v-btn>
              </template>
              <v-list
                class="style-list   border border-gray-700 rounded pa-2"
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
                  class="style-list-item rounded mb-1 px-3 py-1 "
                  :class="{
                    'style-list-item-active':
                      selectedStyle && selectedStyle.title === style.title,
                    'style-list-item-variable': style.isVariable,
                  }"
                  :style="{
                    color: primaryColor,
                  }"
                >
                  <template v-slot:prepend>
                    <div class="radio-circle  mr-2 border border-primary">
                      <div
                        v-if="
                          selectedStyle && selectedStyle.title === style.title
                        "
                        class="radio-dot"
                        :style="{ 'background-color': primaryColor }"
                      ></div>
                    </div>
                  </template>
                  <v-list-item-title class="text-sm">
                    {{ style.title }}
                    <span
                      v-if="style.isVariable"
                      class="variable-badge"
                      :style="{
                        color: primaryColor,
                        'background-color': `${primaryColor}50`,
                        'border-radius': '8px',
                      }"
                      >Variable</span
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Mobile edit button to open options panel -->
          <v-btn
            icon
            variant="text"
            :color="primaryColor"
            class="mr-2"
            @click.stop="toggleOptions"
          >
            <v-icon>{{ showOptions ? "mdi-arrow-up" : " mdi-tune" }}</v-icon>
          </v-btn>

          <!-- Favorite and Detail Buttons -->
          <v-btn
            icon
            variant="text"
            :color="isFavorite ? 'yellow' : primaryColor"
            class="mr-2"
            @click.stop="addToFavorites"
          >
            <v-icon>{{ isFavorite ? "mdi-star" : "mdi-star-outline" }}</v-icon>
          </v-btn>
          <v-btn
            icon
            variant="text"
            :color="primaryColor"
            @click.stop="viewFontDetail"
          >
            <v-icon>mdi-arrow-top-right</v-icon>
          </v-btn>
        </div>

        <!-- Mobile-only controls for the header -->
        <div class="mobile-only font-controls-mobile">
          <div class="flex items-center">
            <!-- Style Menu Button -->
            <div class="style-menu-container mr-2">
              <v-menu
                v-model="showStyleMenuMobile"
                :close-on-content-click="false"
                location="bottom"
                offset="5"
                id="style-menu-mobile"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon
                    variant="text"
                    :color="primaryColor"
                    v-bind="props"
                    @click.stop
                    class="style-btn"
                  >
                    <v-icon>mdi-format-font</v-icon>
                  </v-btn>
                </template>
                <v-list
                  id="style-list-mobile"
                  class="style-list   border border-gray-700 rounded pa-2"
                  max-height="300"
                >
                  <!-- Same list items as desktop -->
                  <v-list-item
                    v-for="style in styleOptions"
                    :key="style.title"
                    :value="style"
                    @click="
                      handleStyleChange(style);
                      showStyleMenuMobile = false;
                    "
                    :active="
                      selectedStyle && selectedStyle.title === style.title
                    "
                    class="style-list-item rounded mb-1 px-3 py-1"
                    :class="{
                      'style-list-item-active':
                        selectedStyle && selectedStyle.title === style.title,
                      'style-list-item-variable': style.isVariable,
                    }"
                    :style="{
                      color: primaryColor,
                    }"
                  >
                    <template v-slot:prepend>
                      <div class="radio-circle mr-2 border border-primary" >
                        <div
                          v-if="
                            selectedStyle && selectedStyle.title === style.title
                          "
                          class="radio-dot "
                          :style="{ 'background-color': primaryColor }"
                        ></div>
                      </div>
                    </template>
                    <v-list-item-title class="text-sm">
                      {{ style.title }}
                      <span
                        v-if="style.isVariable"
                        class="variable-badge"
                        :style="{
                          color: primaryColor,
                          'background-color': `${primaryColor}50`,
                          'border-radius': '8px',
                        }"
                        >Variable</span
                      >
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>

            <!-- Mobile edit button to open options panel -->
            <v-btn
              icon
              variant="text"
              :color="primaryColor"
              class="mr-2"
              @click.stop="toggleOptions"
            >
              <v-icon>{{ showOptions ? "mdi-arrow-up" : " mdi-tune" }}</v-icon>
            </v-btn>

            <!-- Favorite Button -->
            <v-btn
              icon
              variant="text"
              :color="isFavorite ? 'yellow' : primaryColor"
              class="mr-2"
              @click.stop="addToFavorites"
            >
              <v-icon>{{
                isFavorite ? "mdi-star" : "mdi-star-outline"
              }}</v-icon>
            </v-btn>

            <!-- Detail Button -->
            <v-btn
              icon
              variant="text"
              :color="primaryColor"
              @click.stop="viewFontDetail"
            >
              <v-icon>mdi-arrow-top-right</v-icon>
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Font Preview -->
      <div
        class="font-preview px-6 py-10"
        :class="{
          'preview-collapsed': showOptions,
          'auto-height': fontSize > 80,
          'arabic-font': font.category === 'Arabic',
          'bg-dark-btn': themeStore.darkMode,
          'bg-light-btn': themeStore.darkMode,
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
          class="sample-text-editor m-0   text-wrap overflow-y-hidden"
          @input="updateSampleText"
          v-text="localSampleText"
          :class="[
            `weight-${fontWeight}`,
            { 'rtl-text': font.category === 'Arabic' },
            { 'text-black !important': !themeStore.darkMode },
            { 'text-white !important': !!themeStore.darkMode },
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
          <!-- Mobile version of all controls -->
          <div class="mobile-only">
            <!-- Size Slider -->
            <div class="option-row flex items-center mb-4">
              <div class="option-label   text-sm w-20" :class="{'text-black': !themeStore.darkMode, 'text-white': themeStore.darkMode}">Size</div>
              <div class="flex-grow">
                <div class="flex items-center">
                  <v-slider
                    v-model="fontSize"
                    min="10"
                    max="280"
                    step="1"
                    class="slider-thumb flex-grow"
                    density="compact"
                    :color="primaryColor"
                    :thumb-color="primaryColor"
                    :track-color="primaryColor"
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

            <!-- Weight Slider for mobile (if not variable font with wght axis) -->
            <div
              v-if="!isVariableFont || !variableFontParams['wght']"
              class="option-row flex items-center mb-4"
            >
              <div class="option-label   text-sm w-20" :class="{'text-black': !themeStore.darkMode, 'text-white': themeStore.darkMode}">Weight</div>
              <div class="flex-grow">
                <div class="flex items-center">
                  <v-slider
                    v-model="fontWeight"
                    min="100"
                    max="900"
                    step="100"
                    class="slider-thumb flex-grow"
                    density="compact"
                    :color="primaryColor"
                    :thumb-color="primaryColor"
                    :track-color="primaryColor"
                    hide-details
                    @update:model-value="updateFontWeight"
                    thumb-label
                  >
                    <template v-slot:thumb-label="{ modelValue }">
                      {{ getWeightName(modelValue) }}
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

            <!-- Variable Font Controls for mobile -->
            <div
              v-if="isVariableFont && hasVariableFontAxes"
              class="variable-font-controls border-b border-primary border-gray-700 pb-4 mb-4"
              :class="{
                'bg-card': themeStore.darkMode,
                'bg-white': !themeStore.darkMode,
              }"
            >
              <div class="text-white text-sm font-medium mb-3">
                Variable Font Controls
              </div>

              <!-- Dynamic sliders for all variable font axes -->
              <div
                v-for="axis in variableFontAxes"
                :key="axis.axis"
                class="option-row flex items-center mt-2 mb-4"
              >
                <div
                  class="option-label text-sm w-20"
                  :class="{
                    'text-black': themeStore.darkMode,
                    'text-white': themeStore.darkMode,
                  }"
                >
                  {{ axis.axis }}
                </div>
                <div class="flex-grow">
                  <div class="flex items-center">
                    <v-slider
                      v-model="variableFontParams[axis.axis]"
                      :min="axis.min"
                      :max="axis.max"
                      :step="axis.step"
                      class="slider-thumb flex-grow"
                      density="compact"
                      :color="primaryColor"
                      :thumb-color="primaryColor"
                      :track-color="primaryColor"
                      hide-details
                      thumb-label
                    >
                      <template v-slot:thumb-label="{ modelValue }">
                        {{ modelValue }}
                      </template>
                    </v-slider>
                    <div
                      class="weight-indicator ml-2 text-white text-xs min-w-[40px] text-right"
                    >
                      {{ variableFontParams[axis.axis] }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Leading Slider (both mobile and desktop) -->
          <div class="option-row flex items-center">
            <div
              class="option-label text-sm w-20"
              :class="{
                'text-black': themeStore.darkMode,
                'text-white': themeStore.darkMode,
              }"
            >
              Leading
            </div>
            <v-slider
              v-model="leading"
              min="0.8"
              max="2"
              step="0.05"
              class="slider-thumb flex-grow"
              density="compact"
              :color="primaryColor"
              :thumb-color="primaryColor"
              :track-color="primaryColor"
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

          <!-- Tracking/Letter Spacing (both mobile and desktop) -->
          <div class="option-row flex items-center">
            <div
              class="option-label text-sm w-20"
              :class="{
                'text-black': themeStore.darkMode,
                'text-white': themeStore.darkMode,
              }"
            >
              Tracking
            </div>
            <v-slider
              v-model="tracking"
              min="-20"
              max="100"
              step="0.5"
              class="slider-thumb flex-grow"
              density="compact"
              :color="primaryColor"
              :thumb-color="primaryColor"
              :track-color="primaryColor"
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

          <!-- Mobile-optimized controls for alignment, caps, italic -->
          <div class="flex justify-between items-center flex-wrap">
            <div class="mb-3 w-full md:w-auto">
              <!-- Text Alignment -->
              <div class="option-row flex items-center">
                <div
                  class="option-label text-sm w-20"
                  :class="{
                    'text-black': themeStore.darkMode,
                    'text-white': themeStore.darkMode,
                  }"
                >
                  Align
                </div>

                <v-btn
                  variant="text"
                  value="left"
                  icon="mdi-format-align-left"
                  size="small"
                  class="touch-btn"
                  :active="textAlign === 'left'"
                  :active-color="primaryColor"
                  @click="textAlign = 'left'"
                ></v-btn>
                <v-btn
                  variant="text"
                  value="center"
                  icon="mdi-format-align-center"
                  size="small"
                  class="touch-btn"
                  :active="textAlign === 'center'"
                  :active-color="primaryColor"
                  @click="textAlign = 'center'"
                ></v-btn>
                <v-btn
                  variant="text"
                  value="right"
                  icon="mdi-format-align-right"
                  size="small"
                  class="touch-btn"
                  :active="textAlign === 'right'"
                  :active-color="primaryColor"
                  @click="textAlign = 'right'"
                ></v-btn>
              </div>
            </div>
            <div class="w-full md:w-auto">
              <!-- Text Transform (All Caps) and Italic - mobile-optimized -->
              <div
                class="option-row text-transform flex items-center justify-start gap-4 mt-1"
              >
                <v-btn
                  :variant="themeStore.darkMode ? 'outlined' : 'tonal'"
                  size="small"
                  :color="primaryColor"
                  class="text-transform-btn"
                  :class="{ 'btn-active': isAllCaps }"
                  @click="toggleAllCaps"
                  :style="{
                    backgroundColor: isAllCaps
                      ? `${primaryColor}50`
                      : 'transparent',
                  }"
                >
                  <span class="font-bold mr-2" :style="{ color: primaryColor }"
                    >A</span
                  >
                  <span class="text-xs">All Caps</span>
                </v-btn>

                <!-- Italic Toggle -->
                <v-btn
                  :variant="themeStore.darkMode ? 'outlined' : 'tonal'"
                  size="small"
                  :color="primaryColor"
                  class="text-transform-btn"
                  :class="{ 'btn-active': fontStyle === 'italic' }"
                  @click="toggleItalic"
                  :style="{
                    backgroundColor:
                      fontStyle === 'italic'
                        ? `${primaryColor}50`
                        : 'transparent',
                  }"
                >
                  <span class="italic mr-2" :style="{ color: primaryColor }"
                    >I</span
                  >
                  <span class="text-xs">Italic</span>
                </v-btn>
              </div>
            </div>
          </div>

          <!-- OpenType Features Section - same for both mobile and desktop -->
          <!-- <div class="pt-2 mt-2 border-t border-gray-700">
            <div class="text-white text-sm font-medium mb-3">
              OpenType Features
            </div>

            <div class="grid grid-cols-2 gap-x-4 gap-y-2">
              <div
                class="feature-option touch-feature"
                @click="toggleFeature('ligatures')"
              >
                <div
                  class="feature-checkbox touch-checkbox"
                  :class="{ active: features.ligatures }"
                >
                  <div v-if="features.ligatures" class="checkbox-dot"></div>
                </div>
                <span class="ml-2 text-xs">Ligatures</span>
              </div>

              <div
                class="feature-option touch-feature"
                @click="toggleFeature('discretionaryLigatures')"
              >
                <div
                  class="feature-checkbox touch-checkbox"
                  :class="{ active: features.discretionaryLigatures }"
                >
                  <div
                    v-if="features.discretionaryLigatures"
                    class="checkbox-dot"
                  ></div>
                </div>
                <span class="ml-2 text-xs">Discretionary Ligatures</span>
              </div>

              <div
                class="feature-option touch-feature"
                @click="toggleFeature('fractions')"
              >
                <div
                  class="feature-checkbox touch-checkbox"
                  :class="{ active: features.fractions }"
                >
                  <div v-if="features.fractions" class="checkbox-dot"></div>
                </div>
                <span class="ml-2 text-xs">Fractions</span>
              </div>

              <div
                class="feature-option touch-feature"
                @click="toggleFeature('ordinals')"
              >
                <div
                  class="feature-checkbox touch-checkbox"
                  :class="{ active: features.ordinals }"
                >
                  <div v-if="features.ordinals" class="checkbox-dot"></div>
                </div>
                <span class="ml-2 text-xs">Ordinals</span>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-card-container {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 20px;
  transform: translateY(0);
  will-change: transform;
}

.font-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-color: transparent;
  border-width: 2px;
  border-style: solid;
  will-change: transform, border-color;
}

.font-card-container:hover {
  transform: translateY(-5px);
}

.font-card-container:hover .font-card {
  border-color: v-bind(primaryColor) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Remove the old hover style */
.font-card:hover {
  transform: none;
  border-color: transparent;
}

.font-preview {
  transition: all 0.3s ease;
}

.font-info {
  transition: all 0.3s ease;
}

.font-options-panel {
  transition: all 0.3s ease;
}

.border-primary {
  border-color: v-bind(primaryColor) !important;
}

.text-dark-btn {
  color: rgb(255, 255, 227) !important;
}

.text-light-btn {
  color: black !important;
}

.bg-dark-btn {
  background-color: rgb(255, 255, 227) !important;
}

.bg-light-btn {
  background-color: black !important;
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
  border-color: v-bind(isDarkMode) !important;
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
  color: v-bind(primaryColor);
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
  transition: font-weight 0.3s ease, font-style 0.3s ease, font-size 0.3s ease, 
    line-height 0.3s ease, text-align 0.3s ease, font-variation-settings 0.3s ease;
}

/* Add new styles for the font controls in header */
.font-controls {
   border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.font-controls-mobile {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.variable-font-controls {
   border-radius: 4px;
  padding: 10px;
  margin-bottom: 15px;
}

.variable-badge {
  font-size: 10px;
  background-color: rgba(255, 196, 0, 0.8);
  color: black;
  padding: 2px 4px;
  border-radius: 4px;
  margin-left: 4px;
}

/* Header slider styles */
.header-slider {
  width: 80px;
  margin: 0 4px;
}

:deep(.compact-slider.v-slider) {
  margin: 0;
}

:deep(.compact-slider .v-slider__track) {
  height: 2px !important;
}

:deep(.compact-slider .v-slider__thumb) {
  width: 10px !important;
  height: 10px !important;
}

/* Responsive design classes */
@media (max-width: 767px) {
  .desktop-only {
    display: none !important;
  }

  /* Make mobile font preview take up more space */
  .font-preview {
    min-height: 150px;
    padding-top: 32px;
    padding-bottom: 32px;
  }

  /* Make checkboxes and buttons larger for touch */
  .touch-checkbox {
    width: 20px !important;
    height: 20px !important;
  }

  .feature-checkbox-square.touch-checkbox {
    width: 44px !important;
    height: 44px !important;
  }

  .touch-btn {
    min-width: 40px !important;
    height: 40px !important;
  }

  .mobile-touch-friendly {
    padding: 4px;
  }

  .touch-feature {
    padding: 8px 4px;
  }

  /* More space in the options panel for mobile */
  .font-options-panel {
    padding: 16px 12px;
  }

  /* Better layout for mobile alignment toggles */
  .option-row {
    margin-bottom: 16px;
  }
}

@media (min-width: 768px) {
  .mobile-only {
    display: none !important;
  }
}

.style-list-item-variable {
  border-left: 2px solid #ffc107;
}

.text-transform-btn {
  border-width: 1px !important;
  min-width: 90px !important;
  justify-content: flex-start !important;
  padding-left: 12px !important;
  transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
}

.text-transform-btn.btn-active {
  border-color: v-bind(primaryColor) !important;
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

.bg-card {
  background-color: rgba(226, 252, 252, 0.478) !important;
}
</style>
