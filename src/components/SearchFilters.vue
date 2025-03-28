<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { useSittingsStore } from "../stores/sittings";
import { useThemeStore } from '../stores/theme.js';

const props = defineProps({
  initialSearchQuery: {
    type: String,
    default: "",
  },
});
const settingsStore = useSittingsStore();
const themeStore = useThemeStore();

const emit = defineEmits([
  "search",
  "filter-change",
  "font-size-change",
  "toggle-theme",
]);

// Mobile detection
const isMobile = ref(false);
const isFilterPanelOpen = ref(false);

// Check screen size on mount and when window resizes
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 868;
  if (!isMobile.value) {
    isFilterPanelOpen.value = false;
  }
};

// Toggle filter panel on mobile
const toggleFilterPanel = () => {
  isFilterPanelOpen.value = !isFilterPanelOpen.value;
};

// Search
const searchQuery = ref(props.initialSearchQuery);
watch(searchQuery, (newValue) => {
  emit("search", newValue);
});

// Categories and Properties dropdowns
const categories = ref([
  { text: "Display", value: "display" },
  { text: "Sans Serif", value: "sans-serif" },
  { text: "Serif", value: "serif" },
  { text: "Mono", value: "mono" },
  { text: "Script", value: "script" },
  { text: "Handwriting", value: "handwriting" },
]);
const selectedCategory = ref("Categories");

const properties = ref([
  { text: "Variable", value: "variable" },
  { text: "Static", value: "static" },
  { text: "Italic", value: "italic" },
  { text: "Bold", value: "bold" },
  { text: "Light", value: "light" },
]);
const selectedProperty = ref("Properties");

// Font size options
const fontSizeOptions = ref([
  { value: 8, label: "8px" },
  { value: 12, label: "12px" },
  { value: 14, label: "14px" },
  { value: 20, label: "20px" },
  { value: 24, label: "24px" },
  { value: 32, label: "32px" },
  { value: 40, label: "40px" },
  { value: 50, label: "50px" },
  { value: 64, label: "64px" },
  { value: 80, label: "80px" },
  { value: 96, label: "96px" },
  { value: 120, label: "120px" },
  { value: 144, label: "144px" },
  { value: 160, label: "160px" },
  { value: 192, label: "192px" },
  { value: 224, label: "224px" },
  { value: 256, label: "256px" },
  { value: 280, label: "280px" },
]);

// Font size slider
const fontSize = ref(60);
const fontSizeText = ref("60px");

// Personality filter
const personalities = ref([
  { text: "All", value: "all" },
  { text: "Elegant", value: "elegant" },
  { text: "Modern", value: "modern" },
  { text: "Vintage", value: "vintage" },
  { text: "Playful", value: "playful" },
  { text: "Technical", value: "technical" },
]);
const selectedPersonality = ref("Personality");

// Text type filter
const cityNames = ref(false);
const excerpts = ref(false);
const namesSelected = ref(true);

// Text alignment options
const alignment = ref("left");

// Dark/light theme toggle
const themeMode = ref("light");

// Sample text input
const sampleText = ref("");

// Add color options
const colorOptions = ref([
  { text: "Pink", value: "#FA82D1" },
  { text: "Blue", value: "blue" },
  { text: "Green", value: "green" },
  { text: "Purple", value: "purple" },
  { text: "Red", value: "red" },
  { text: "Orange", value: "orange" },
  { text: "Pink", value: "pink" },
  { text: "Teal", value: "teal" },
]);

const selectedColor = computed(() => settingsStore.primaryColor);
const borderColor = computed(() => `${selectedColor.value}`);
// Reset all filters
const resetAll = () => {
  // Update settings in Pinia store
  settingsStore.resetFlag = !settingsStore.resetFlag;
  if (isMobile.value) {
    isFilterPanelOpen.value = false;
  }
};

// Update functions
const updateFontSize = (size) => {
  settingsStore.fontSize = size;
  fontSize.value = size;
  fontSizeText.value = `${size}px`;
  emit("font-size-change", size);
};

const selectFontSize = (size) => {
  fontSize.value = size;
  fontSizeText.value = `${size}px`;
  settingsStore.fontSize = size;
  emit("font-size-change", size);
  showFontSizeMenu.value = false;
};

const showFontSizeMenu = ref(false);
const toggleFontSizeMenu = () => {
  showFontSizeMenu.value = !showFontSizeMenu.value;
};

const updateCategory = (category) => {
  selectedCategory.value = category;
  emit("filter-change", { type: "category", value: category });
};

const updateProperty = (property) => {
  selectedProperty.value = property;
  emit("filter-change", { type: "property", value: property });
};

const updatePersonality = (personality) => {
  selectedPersonality.value = personality;
  emit("filter-change", { type: "personality", value: personality });
};

const selectedTextType = ref("cities");
const updateTextType = (type) => {
  selectedTextType.value = type;
  cityNames.value = type === "cities";
  excerpts.value = type === "excerpts";
  namesSelected.value = type === "names";
  emit("filter-change", { type: "textType", value: type });
};

const updateAlignment = (align) => {
  alignment.value = align;
  settingsStore.fontAlignment = align;
  emit("filter-change", { type: "alignment", value: align });
};

const updateSampleText = (text) => {
  let sampleText = text.target.value;
  if (sampleText.length <= 0) {
    sampleText = "السلام عليكم";
  }
  settingsStore.textSample = sampleText;
  emit("filter-change", { type: "sampleText", value: sampleText });
};

const textDarkMode = ref(false);
const toggleTheme = () => {
  textDarkMode.value = !textDarkMode.value;
  emit("toggle-theme", textDarkMode.value);
};

// Click outside handler for font size dropdown
const fontSizeRef = ref(null);

const handleClickOutside = (event) => {
  if (fontSizeRef.value && !fontSizeRef.value.contains(event.target)) {
    showFontSizeMenu.value = false;
  }
};

// Add color update function
const updateColor = (color) => {
  selectedColor.value = color;
  settingsStore.primaryColor = color;
  settingsStore.storeColorInLocalStorage();
  emit("filter-change", { type: "color", value: color });
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  window.removeEventListener("resize", checkScreenSize);
});
</script>

<template>
  <div 
    class="search-filters" 
    :class="{ 
      'bg-black': themeStore.darkMode, 
      'bg-white': !themeStore.darkMode 
    }"
    :style="{ 
      color: themeStore.darkMode ? 'white' : 'black',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }"
  >
    <!-- Search Bar Row - Always visible -->
    <div class="py-3 md:py-4 border-b border-primary">
      <v-container>
        <div class="flex items-center">
          <div class="search-box flex items-center flex-grow">
            <v-text-field
              v-model="searchQuery"
              placeholder="Search"
              variant="outlined"
              density="comfortable"
              hide-details
              class="search-input"
              :color="selectedColor"
              :bg-color="themeStore.darkMode ? 'black' : 'white'"
              :style="{ 
                'caret-color': selectedColor,
                color: themeStore.darkMode ? 'white' : 'black'
              }"
            >
              <template v-slot:prepend-inner>
                <v-icon :color="selectedColor">mdi-magnify</v-icon>
              </template>
            </v-text-field>
          </div>

          <!-- Mobile Filter Toggle -->
          <div v-if="isMobile" class="ml-2">
            <v-btn
              icon
              variant="text"
              :color="selectedColor"
              @click="toggleFilterPanel"
              class="filter-toggle-btn"
            >
              <v-icon>mdi-filter</v-icon>
            </v-btn>
          </div>

          <!-- Desktop Filters -->
          <div v-if="!isMobile" class="flex items-center ml-4">
            <!-- Categories Dropdown -->
            <div class="mr-8 relative">
              <v-select
                v-model="selectedCategory"
                @update:model-value="updateCategory"
                :items="categories"
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
                class="category-select"
                :bg-color="themeStore.darkMode ? 'black' : 'white'"
                hide-details
                label="Category"
                clearable
                :color="selectedColor"
              >
                <template v-slot:selection="{ item }">
                  <span :style="{ color: selectedColor }">{{ item.raw.text }}</span>
                </template>
              </v-select>
            </div>

            <!-- Color Selector -->
            <div class="ml-8 relative">
              <v-select
                v-model="selectedColor"
                @update:model-value="updateColor"
                :items="colorOptions"
                item-title="text"
                item-value="value"
                variant="outlined"
                density="comfortable"
                class="color-select"
                :bg-color="themeStore.darkMode ? 'black' : 'white'"
                hide-details
                label="Color"
                :color="selectedColor"
              >
                <template v-slot:selection="{ item }">
                  <span :style="{ color: selectedColor }">{{ item.raw.text }}</span>
                </template>
              </v-select>
            </div>

            <!-- Font Size (Desktop) -->
            <div class="ml-auto flex items-center">
              <div class="mr-4 ml-4 w-24">
                <v-select
                  v-model="fontSize"
                  :items="fontSizeOptions"
                  item-title="label"
                  item-value="value"
                  variant="outlined"
                  density="compact"
                  class="font-size-select"
                  :bg-color="themeStore.darkMode ? 'black' : 'white'"
                  hide-details
                  :color="selectedColor"
                  label="Font Size"
                  @update:model-value="updateFontSize"
                >
                  <template v-slot:selection="{ item }">
                    <span :style="{ color: selectedColor }">{{ item.raw.label }}</span>
                  </template>
                </v-select>
              </div>

              <!-- Keep the slider -->
              <div class="flex items-center justify-between ml-4">
                <v-slider
                  v-model="fontSize"
                  min="8"
                  max="280"
                  step="1"
                  class="slider-thumb mt-0 pt-0"
                  density="compact"
                  hide-details
                  :color="selectedColor"
                  :track-color="`${selectedColor}50`"
                  :thumb-color="selectedColor"
                  thumb-label
                  @update:model-value="updateFontSize"
                ></v-slider>
                <span class="pl-4" :style="{ color: selectedColor }">{{ fontSizeText }}</span>
              </div>
            </div>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Mobile Filter Panel - Collapsible -->
    <div
      v-if="isMobile"
      class="mobile-filter-panel"
      :class="{ 
        'panel-open': isFilterPanelOpen,
        'bg-black': themeStore.darkMode,
        'bg-white': !themeStore.darkMode
      }"
      :style="{ 
        color: themeStore.darkMode ? 'white' : 'black',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }"
    >
      <v-container>
        <!-- Categories and Properties in mobile view -->
        <div class="py-3 border-b border-primary">
          <div class="flex flex-wrap items-center justify-between">
            <!-- Categories Dropdown Mobile -->
            <div class="mobile-dropdown mb-3 w-full">
              <v-select
                v-model="selectedCategory"
                @update:model-value="updateCategory"
                :items="categories"
                item-title="text"
                item-value="text"
                variant="outlined"
                density="comfortable"
                class=" "
                :bg-color="themeStore.darkMode ? 'black' : 'white'"
                hide-details
                label="Category"
                clearable
                :color="selectedColor"
              >
              <template v-slot:selection="{ item }">
                  <span :style="{ color: selectedColor }">{{ item.raw.text }}</span>
                </template>
              </v-select>
            </div>

            <!-- Color Selector Mobile -->
            <div class="mobile-dropdown mb-3 mt-3 w-full">
              <v-select
                v-model="selectedColor"
                @update:model-value="updateColor"
                :items="colorOptions"
                item-title="text"
                item-value="value"
                variant="outlined"
                density="comfortable"
                class=""
                :bg-color="themeStore.darkMode ? 'black' : 'white'"
                hide-details
                label="Color"
                :color="selectedColor"
              >
                <template v-slot:selection="{ item }">
                  <span :style="{ color: selectedColor }">{{
                    item.raw.text
                  }}</span>
                </template>
              </v-select>
            </div>
          </div>
        </div>

        <!-- Font Size Mobile -->
        <div class="py-3 border-b border-primary">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Font Size</span>
            <span :style="{ color: selectedColor }">{{ fontSizeText }}</span>
          </div>
          <v-slider
            v-model="fontSize"
            min="8"
            max="280"
            step="1"
            class="mobile-slider mt-0 pt-0"
            density="compact"
            :color="selectedColor"
            :track-color="`${selectedColor}50`"
            :thumb-color="selectedColor"
            thumb-label
            @update:model-value="updateFontSize"
          ></v-slider>
        </div>

        <!-- Sample Text Mobile -->
        <div class="py-3 border-b border-primary">
          <span class="text-gray-400 text-sm mb-1 block">Sample Text</span>
          <div class="flex items-center w-full">
            <v-text-field
              v-model="sampleText"
              placeholder="Type your sample text here"
              variant="outlined"
              density="comfortable"
              hide-details
              class="sample-text-input"
              :color="selectedColor"
              :bg-color="themeStore.darkMode ? 'black' : 'white'"
              :style="{ 
                'caret-color': selectedColor,
                color: themeStore.darkMode ? 'white' : 'black'
              }"
            >
              <template v-slot:prepend-inner>
                <v-icon :color="selectedColor">mdi-pencil</v-icon>
              </template>
            </v-text-field>
          </div>
        </div>

        <!-- Text Type Mobile -->
        <div class="py-3 border-b border-primary">
          <span class="text-gray-400 text-sm mb-2 block">Text Type</span>
          <div class="flex flex-wrap justify-between w-full">
            <v-btn
              variant="text"
              :active="cityNames"
              :active-color="selectedColor"
              class="text-caption mr-3 mb-2 px-3 py-2"
              :class="{ 'mobile-active-btn': cityNames }"
              @click="updateTextType('cities')"
            >
              Cities
            </v-btn>

            <v-btn
              variant="text"
              :active="excerpts"
              :active-color="selectedColor"
              class="text-caption mr-3 mb-2 px-3 py-2"
              :class="{ 'mobile-active-btn': excerpts }"
              @click="updateTextType('excerpts')"
            >
              Excerpts
            </v-btn>

            <v-btn
              variant="text"
              :active="namesSelected"
              :active-color="selectedColor"
              class="text-caption mb-2 px-3 py-2"
              :class="{ 'mobile-active-btn': namesSelected }"
              @click="updateTextType('names')"
            >
              Names
            </v-btn>
          </div>
        </div>

        <!--  Alignment Mobile -->
        <div class="py-3 border-b border-primary">
          <div class="flex flex-wrap items-start justify-between">
            <!-- Text Alignment Mobile -->
            <div class="w-full sm:pl-2">
              <span class="text-gray-400 text-sm mb-1 block">Alignment</span>
              <div class="flex flex-wrap justify-between w-full">
                <v-btn
                  variant="text"
                  :active="alignment === 'left'"
                  :active-color="selectedColor"
                  class="text-caption mr-3 mb-2 px-3 py-2 flex-1"
                  @click="updateAlignment('left')"
                >
                  <v-icon>mdi-format-align-left</v-icon>
                </v-btn>

                <v-btn
                  variant="text"
                  :active="alignment === 'center'"
                  :active-color="selectedColor"
                  class="text-caption mr-3 mb-2 px-3 py-2 flex-1"
                  @click="updateAlignment('center')"
                >
                  <v-icon>mdi-format-align-center</v-icon>
                </v-btn>

                <v-btn
                  variant="text"
                  :active="alignment === 'right'"
                  :active-color="selectedColor"
                  class="text-caption mb-2 px-3 py-2 flex-1"
                  @click="updateAlignment('right')"
                >
                  <v-icon>mdi-format-align-right</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
        </div>

        <!-- Reset Button Mobile -->
        <div class="py-3 flex justify-center">
          <v-btn
            :variant="themeStore.darkMode ? 'outlined' : 'tonal'"
            :color="selectedColor"
            class="px-6"
            @click="resetAll"
          >
            Reset All Filters
          </v-btn>
        </div>
      </v-container>
    </div>

    <!-- Sample Text Entry Row (Desktop Only) -->
    <div v-if="!isMobile" class="py-4 border-b border-primary">
      <v-container>
        <div class="flex items-center">
          <div class="flex items-center flex-grow">
            <v-text-field
              v-model="sampleText"
              placeholder="Type your sample text here"
              variant="outlined"
              density="comfortable"
              hide-details
              class="sample-text-input"
              :color="selectedColor"
              :bg-color="themeStore.darkMode ? 'black' : 'white'"
              :style="{ 
                'caret-color': selectedColor,
                color: themeStore.darkMode ? 'white' : 'black'
              }"
            >
              <template v-slot:prepend-inner>
                <v-icon :color="selectedColor">mdi-pencil</v-icon>
              </template>
            </v-text-field>
          </div>

          <!-- Text Type Selector -->
          <div class="ml-8 flex items-center">
            <v-btn
              variant="text"
              class="text-caption mr-2"
              :active="selectedTextType === 'cities'"
              :active-color="selectedColor"
              @click="updateTextType('cities')"
            >
              Cities
            </v-btn>

            <v-btn
              variant="text"
              :active="selectedTextType === 'excerpts'"
              :active-color="selectedColor"
              class="text-caption mr-2"
              @click="updateTextType('excerpts')"
            >
              Excerpts
            </v-btn>

            <v-btn
              variant="text"
              :active="selectedTextType === 'names'"
              :active-color="selectedColor"
              class="text-caption"
              @click="updateTextType('names')"
            >
              Names
            </v-btn>
          </div>

          <!-- Text Alignment -->
          <div class="ml-6 flex flex-wrap">
            <v-btn
              value="left"
              @click="updateAlignment('left')"
              class="flex-1"
              variant="text"
              :active="alignment === 'left'"
              :active-color="selectedColor"
            >
              <v-icon>mdi-format-align-left</v-icon></v-btn
            >
            <v-btn
              value="center"
              @click="updateAlignment('center')"
              class="flex-1"
              variant="text"
              :active="alignment === 'center'"
              :active-color="selectedColor"
            >
              <v-icon>mdi-format-align-center</v-icon></v-btn
            >
            <v-btn
              value="right"
              @click="updateAlignment('right')"
              class="flex-1"
              variant="text"
              :active="alignment === 'right'"
              :active-color="selectedColor"
            >
              <v-icon>mdi-format-align-right</v-icon></v-btn
            >
          </div>

          <!-- Reset All -->
          <div class="ml-6">
            <v-btn
              :variant="themeStore.darkMode ? 'outlined' : 'tonal'"
              :color="selectedColor"
              class="text-caption"
              @click="resetAll"
            >
              Reset All
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.border-primary {
  border-color: v-bind(borderColor) !important;
}

.search-filters {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.v-btn-toggle {
  background-color: transparent !important;
}

/* Font size dropdown styles */
.font-size-select {
  background-color: #111;
  min-width: 80px;
}

.font-size-dropdown {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4);
}

.font-size-option {
  color: rgba(255, 255, 255, 0.7);
  transition: background-color 0.2s ease;
}

.selected-size {
  color: white;
}

.size-indicator {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* Custom slider styles */
.slider-thumb {
  width: 100px;
}

/* Mobile styles */
.filter-toggle-btn {
  height: 40px;
  width: 40px;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.mobile-filter-panel {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  background-color: #0a0a0a;
  border-bottom: none;
}

.panel-open {
  max-height: 1000px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-dropdown .v-menu {
  width: 100%;
}

.mobile-active-btn {
  font-weight: bold !important;
  border-radius: 4px;
}

.mobile-slider {
  padding: 10px 0;
}

.mobile-slider :deep(.v-slider__thumb) {
  width: 20px !important;
  height: 20px !important;
}

.category-select {
  max-width: 180px; /* adjust as needed */
  width: 180px;
}

.color-select {
  max-width: 150px;
  width: 150px;
}

/* Override Vuetify's default styles */
:deep(.v-select .v-field__append-inner) {
  padding: 0;
}

:deep(.v-select .v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
}

.search-filters {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.mobile-filter-panel {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.search-input :deep(.v-field__input),
.sample-text-input :deep(.v-field__input) {
  padding-top: 0;
  padding-bottom: 0;
  min-height: 32px;
}

.search-input :deep(.v-field__prepend-inner),
.sample-text-input :deep(.v-field__prepend-inner) {
  padding-right: 8px;
}

.search-input :deep(.v-field),
.sample-text-input :deep(.v-field) {
  background: transparent !important;
}

.search-input :deep(.v-field__outline),
.sample-text-input :deep(.v-field__outline) {
  --v-field-border-width: 0;
}
</style>
