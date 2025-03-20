<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useFontStore } from "../stores/fonts";
import FontCard from "./FontCard.vue";
import SearchFilters from "./SearchFilters.vue";

// Get fonts from store
const fontStore = useFontStore();

// Filter states
const searchQuery = ref("");
const fontSize = ref(60);
const sampleText = ref("Your Text");
const textAlignment = ref("left");
const fontWeight = ref(400);
const leading = ref(1.2);
const tracking = ref(0);
const isAllCaps = ref(false);
const fontCss = reactive({
  fontSize: `${fontSize.value}px`,
  fontWeight: `${fontWeight.value}`,
  leading: `${leading.value}`,
  tracking: `${tracking.value}`,
  textAlign: `${textAlignment.value}`,
  sampleText: `${sampleText.value}`,
  isAllCaps: `${isAllCaps.value}`,
});
const filterState = reactive({
  category: "All",
  property: "All",
  personality: "All",
  textType: "names",
  style: "All",
});

// Font display options
const viewMode = ref("list"); // 'grid' or 'list'
const sortBy = ref("popular"); // 'popular', 'new', 'alphabetical'

// Initialize store
onMounted(() => {
  fontStore.loadFavorites();
});

// Handle filter changes from SearchFilters component
const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleFilterChange = (filter) => {
  switch (filter.type) {
    case "category":
      if (filter.value === "Display") filterState.category = "Display";
      else if (filter.value === "Sans Serif")
        filterState.category = "Sans-serif";
      else if (filter.value === "Serif") filterState.category = "Serif";
      else if (filter.value === "Mono") filterState.category = "Mono";
      else if (filter.value === "Script") filterState.category = "Script";
      else filterState.category = "All";
      break;
    case "property":
      filterState.property = filter.value;
      break;
    case "personality":
      filterState.personality = filter.value;
      break;
    case "textType":
      filterState.textType = filter.value;
      break;
    case "alignment":
      textAlignment.value = filter.value;
      break;
    case "sampleText":
      sampleText.value = filter.value;
      break;
  }
};

const handleFontSizeChange = (size) => {
  fontSize.value = size;
};

const handleReset = ref({
  searchQuery: "",
  fontSize: 60,
  fontWeight: 400,  
  leading: 1.2,
  tracking: 0,
  sampleText: "Your Text",
  textAlignment: "center",
  isAllCaps: false,
  category: "All",
  property: "All",
  personality: "All",
  textType: "names",
  style: "All",
});

// Filter fonts based on all criteria
const filteredFonts = computed(() => {
  return fontStore.getFilteredFonts({
    search: searchQuery.value,
    category: filterState.category,
    property: filterState.property,
    // Other filters can be added here
  });
});

// Sort the filtered fonts based on the sort option
const sortedFilteredFonts = computed(() => {
  const fonts = [...filteredFonts.value];
  
  switch (sortBy.value) {
    case 'alphabetical':
      return fonts.sort((a, b) => a.name.localeCompare(b.name));
    case 'new':
      // In a real app, you might have a 'dateAdded' field
      // For this example, we'll just reverse the list
      return fonts.sort((a, b) => b.id - a.id);
    case 'popular':
    default:
      // For now, we'll just use the existing order
      return fonts;
  }
});

// UI Controls
const totalFontsCount = computed(() => fontStore.fonts.length);
const toggleView = (view) => {
  viewMode.value = view;
};

const setSortBy = (sort) => {
  sortBy.value = sort;
};
</script>

<template>
  <div>
    <!-- Search Filters component -->
    <SearchFilters
      :initial-search-query="searchQuery"
      @search="handleSearch"
      @filter-change="handleFilterChange"
      @font-size-change="handleFontSizeChange"
      @reset="handleReset"
    />

    <!-- Font display options -->
    <div
      class="font-options-bar bg-black text-white py-4 border-b border-gray-800"
    >
      <v-container>
        <div class="flex items-center">
          <!-- Font count -->
          <div class="font-count text-3xl font-bold mr-8">
            {{ totalFontsCount }}
          </div>

          <!-- View options -->
          <div class="view-options">
            <v-btn-toggle v-model="viewMode" density="comfortable" color="grey">
              <v-btn value="list" variant="text" class="text-caption px-2">
                List view
              </v-btn>
              <v-btn value="grid" variant="text" class="text-caption px-2">
                Grid view
              </v-btn>
            </v-btn-toggle>
          </div>

          <!-- View filters -->
          <div class="flex items-center ml-8 space-x-4">
            <v-btn variant="text" color="grey" class="text-caption">
              Top 20
            </v-btn>
            <v-btn variant="text" color="grey" class="text-caption">
              Hot 20
            </v-btn>
            <v-btn variant="text" color="grey" class="text-caption">
              Variable
            </v-btn>
          </div>

          <v-spacer></v-spacer>

          <!-- Sort options -->
          <div class="sort-options flex items-center">
            <span class="text-gray-400 mr-4">Sort by</span>
            <v-btn-toggle v-model="sortBy" density="comfortable" color="grey">
              <v-btn value="new" variant="text" class="text-caption px-2">
                New
              </v-btn>
              <v-btn value="popular" variant="text" class="text-caption px-2">
                Popular
              </v-btn>
              <v-btn
                value="alphabetical"
                variant="text"
                class="text-caption px-2"
              >
                Alphabetical
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Font Grid with Preview -->
    <div class="font-grid bg-black text-white py-8">
      <div class="w-[90%] mx-auto">
        <v-row>
          <v-col 
            v-for="font in sortedFilteredFonts" 
            :key="font.id"
            cols="12" 
            :sm="viewMode === 'list' ? 12 : 6" 
            :md="viewMode === 'list' ? 12 : 6"
            :lg="viewMode === 'list' ? 12 : 6"
            class="mb-4"
          >
            <FontCard 
              :font="font" 
              :font-css="fontCss"
            />
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<style scoped>
.font-preview {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.font-card {
  transition: all 0.2s ease;
}

.font-card:hover {
  transform: translateY(-2px);
}

/* Override Vuetify button toggle styles */
:deep(.v-btn-toggle) {
  background-color: transparent !important;
}

:deep(.v-btn-toggle .v-btn) {
  opacity: 0.7;
}

:deep(.v-btn-toggle .v-btn.v-btn--active) {
  opacity: 1;
  background-color: transparent !important;
  color: white !important;
}
</style>
