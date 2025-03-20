<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { useSittingsStore } from "../stores/sittings";

const props = defineProps({
  initialSearchQuery: {
    type: String,
    default: "",
  },
});
const settingsStore = useSittingsStore();

const emit = defineEmits([
  "search",
  "filter-change",
  "font-size-change",
]);

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
const sampleText = ref("Your Text");

// Reset all filters
const resetAll = () => {
  // Update settings in Pinia store
  settingsStore.resetFlag = !settingsStore.resetFlag;
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

const updateTextType = (type) => {
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

const updateSampleText = () => {
  settingsStore.textSample = sampleText.value;
  emit("filter-change", { type: "sampleText", value: sampleText.value });
};

// Click outside handler for font size dropdown
const fontSizeRef = ref(null);

const handleClickOutside = (event) => {
  if (fontSizeRef.value && !fontSizeRef.value.contains(event.target)) {
    showFontSizeMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="search-filters bg-black dark:bg-black text-white">
    <!-- Search Bar Row -->
    <div class="py-4 border-b border-gray-800 dark:border-gray-700">
      <v-container>
        <div class="flex items-center">
          <div class="search-box flex items-center flex-grow mr-4">
            <v-icon class="mr-2 text-gray-500">mdi-magnify</v-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search"
              class="bg-transparent border-none outline-none text-white w-full"
            />
          </div>

          <!-- Categories Dropdown -->
          <div class="ml-6 relative">
            <v-menu>
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="flex items-center cursor-pointer">
                  <span class="mr-1 text-gray-400">{{ selectedCategory }}</span>
                  <v-icon size="small" class="text-gray-400"
                    >mdi-chevron-down</v-icon
                  >
                </div>
              </template>
              <v-list class="bg-gray-900">
                <v-list-item
                  v-for="(category, index) in categories"
                  :key="index"
                  :value="category.value"
                  @click="updateCategory(category.text)"
                  class="text-white"
                >
                  {{ category.text }}
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Properties Dropdown -->
          <div class="ml-6 relative">
            <v-menu>
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="flex items-center cursor-pointer">
                  <span class="mr-1 text-gray-400">{{ selectedProperty }}</span>
                  <v-icon size="small" class="text-gray-400"
                    >mdi-chevron-down</v-icon
                  >
                </div>
              </template>
              <v-list class="bg-gray-900">
                <v-list-item
                  v-for="(property, index) in properties"
                  :key="index"
                  :value="property.value"
                  @click="updateProperty(property.text)"
                  class="text-white"
                >
                  {{ property.text }}
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Font Size -->
          <div class="ml-auto flex items-center">
            <div class="relative" ref="fontSizeRef">
              <div
                class="font-size-select flex items-center cursor-pointer px-2 py-1 border border-gray-700 rounded"
                @click.stop="toggleFontSizeMenu"
              >
                <span class="text-white mr-1">{{ fontSizeText }}</span>
                <v-icon size="small" color="white">mdi-chevron-down</v-icon>
              </div>

              <!-- Font Size Dropdown -->
              <div
                v-if="showFontSizeMenu"
                class="font-size-dropdown absolute right-0 mt-1 w-40 bg-gray-900 border border-gray-700 rounded max-h-72 overflow-y-auto z-50"
                style="scrollbar-width: thin; scrollbar-color: #666 #333"
              >
                <div class="py-1 bg-black">
                  <div
                    v-for="option in fontSizeOptions"
                    :key="option.value"
                    class="font-size-option px-4 py-2 hover:bg-gray-800 bg-black cursor-pointer flex items-center"
                    :class="{ 'selected-size': fontSize === option.value }"
                    @click="selectFontSize(option.value)"
                  >
                    <div
                      class="size-indicator mr-2"
                      :class="{ 'active-indicator': fontSize === option.value }"
                    >
                      <div
                        v-if="fontSize === option.value"
                        class="indicator-dot"
                      ></div>
                    </div>
                    <span>{{ option.label }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Font Slider Button -->
            <div class="ml-4">
              <v-slider
                v-model="fontSize"
                min="8"
                max="280"
                step="1"
                class="slider-thumb mt-0 pt-0"
                density="compact"
                hide-details
                track-color="white"
                thumb-color="white"
                thumb-label
                @update:model-value="updateFontSize"
              ></v-slider>
            </div>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Sample Text Entry Row -->
    <div class="py-4 border-b border-gray-800 dark:border-gray-700">
      <v-container>
        <div class="flex items-center">
          <div class="flex items-center flex-grow">
            <v-icon class="mr-2 text-gray-500">mdi-pencil</v-icon>
            <input
              v-model="sampleText"
              type="text"
              placeholder="Type your sample text here"
              class="bg-transparent border-none outline-none text-white w-full"
              @input="updateSampleText"
            />
          </div>

          <!-- Personality Filter -->
          <div class="ml-6 relative">
            <v-menu>
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="flex items-center cursor-pointer">
                  <span class="mr-1 text-gray-400">{{
                    selectedPersonality
                  }}</span>
                  <v-icon size="small" class="text-gray-400"
                    >mdi-chevron-down</v-icon
                  >
                </div>
              </template>
              <v-list class="bg-gray-900">
                <v-list-item
                  v-for="(personality, index) in personalities"
                  :key="index"
                  :value="personality.value"
                  @click="updatePersonality(personality.text)"
                  class="text-white"
                >
                  {{ personality.text }}
                </v-list-item>
              </v-list>
            </v-menu>
          </div>

          <!-- Text Type Selector -->
          <div class="ml-8 flex items-center">
            <v-btn
              variant="text"
              color="grey"
              class="text-caption mr-2"
              :class="{ 'font-weight-bold text-white': cityNames }"
              @click="updateTextType('cities')"
            >
              Cities
            </v-btn>

            <v-btn
              variant="text"
              color="grey"
              class="text-caption mr-2"
              :class="{ 'font-weight-bold text-white': excerpts }"
              @click="updateTextType('excerpts')"
            >
              Excerpts
            </v-btn>

            <v-btn
              variant="text"
              color="grey"
              class="text-caption"
              :class="{ 'font-weight-bold text-white': namesSelected }"
              @click="updateTextType('names')"
            >
              Names
            </v-btn>
          </div>

          <!-- Text Alignment -->
          <div class="ml-6 flex">
            <v-btn-toggle
              v-model="alignment"
              color="white"
              density="comfortable"
              mandatory
              class="border-0"
            >
              <v-btn
                value="left"
                icon="mdi-format-align-left"
                size="small"
                @click="updateAlignment('left')"
              ></v-btn>
              <v-btn
                value="center"
                icon="mdi-format-align-center"
                size="small"
                @click="updateAlignment('center')"
              ></v-btn>
              <v-btn
                value="right"
                icon="mdi-format-align-right"
                size="small"
                @click="updateAlignment('right')"
              ></v-btn>
            </v-btn-toggle>
          </div>

          <!-- Theme Toggle -->
          <div class="ml-4 flex items-center">
            <v-btn icon size="small" variant="text" color="white">
              <v-icon>{{
                themeMode === "dark" ? "mdi-weather-night" : "mdi-weather-sunny"
              }}</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              color="grey-lighten-1"
              class="ml-2"
            >
              <v-icon>mdi-moon-waning-crescent</v-icon>
            </v-btn>
          </div>

          <!-- Reset All -->
          <div class="ml-6">
            <v-btn
              variant="text"
              color="grey-lighten-1"
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
  background-color: rgba(255, 255, 255, 0.1);
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

.active-indicator {
  border: 1px solid #fff;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: white;
}

/* Custom slider styles */
.slider-thumb {
  width: 100px;
}

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
</style>
