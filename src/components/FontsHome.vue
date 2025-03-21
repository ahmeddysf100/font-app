<script setup>
import { ref, computed, reactive, onMounted, watch } from "vue";
import { useFontStore } from "../stores/fonts";
import FontCard from "./FontCard.vue";
import SearchFilters from "./SearchFilters.vue";
import { fonts } from "../utils/fontLoader"; // Import fonts directly from fontLoader

/**
 * Dynamic Text Sample Collections
 * 
 * These text collections provide unique samples for each font based on the selected text type.
 * - Each font will display a consistent sample for each text type
 * - Arabic fonts automatically display Arabic text samples
 * - 20 variants are available for each text type (cities, names, excerpts)
 * - Sample text is selected based on the font's ID (modulo 20)
 */

// Sample text collections by type
const cityNames = [
  "New York", "Tokyo", "London", "Paris", "Dubai",
  "Singapore", "Barcelona", "Istanbul", "Sydney", "Cairo",
  "Rio de Janeiro", "Amsterdam", "Prague", "San Francisco", "Cape Town",
  "Seoul", "Moscow", "Venice", "Bangkok", "Vienna"
];

const nameExamples = [
  "Emma Thompson", "Mohammed Al-Farsi", "Chen Wei", "Sofia Rodriguez", "James Wilson",
  "Aisha Patel", "Hiroshi Tanaka", "Olga Petrov", "Juan Carlos", "Fatima Ahmed",
  "Robert Kim", "Isabella Costa", "Raj Sharma", "Maria Lopez", "David Johnson",
  "Amara Okafor", "Yuki Nakamura", "Sven Johansson", "Leila Morad", "Thomas Smith"
];

const textExcerpts = [
  "The journey of a thousand miles begins with a single step.",
  "Design is not just what it looks like and feels like. Design is how it works.",
  "Simplicity is the ultimate sophistication.",
  "In the middle of difficulty lies opportunity.",
  "The best way to predict the future is to invent it.",
  "Creativity is intelligence having fun.",
  "Less is more. Simplicity is the key to brilliance.",
  "The details are not the details. They make the design.",
  "Typography is what language looks like.",
  "Good design is obvious. Great design is transparent.",
  "Where words fail, typography speaks.",
  "To create, one must first question everything.",
  "Form follows function. Function follows clarity.",
  "The best ideas come as jokes. Make your thinking as funny as possible.",
  "Whitespace is to be regarded as an active element, not a passive background.",
  "Design creates culture. Culture shapes values. Values determine the future.",
  "Every great design begins with an even better story.",
  "Make it simple, but significant.",
  "Design is where science and art break even.",
  "Readers are leaders. Typography leads readers."
];

// Arabic sample text collections
const arabicCityNames = [
  "القاهرة", "دبي", "الرياض", "بيروت", "عمّان",
  "مراكش", "الدوحة", "أبو ظبي", "بغداد", "الجزائر",
  "مسقط", "صنعاء", "الخرطوم", "طرابلس", "تونس",
  "الدار البيضاء", "المنامة", "دمشق", "الكويت", "جدة"
];

const arabicNameExamples = [
  "محمد العلي", "فاطمة الزهراء", "أحمد المصري", "نور الهدى", "علي حسن",
  "سارة المغربي", "عمر السعيد", "ليلى العبد الله", "خالد المنصور", "آية الرحمن",
  "زياد الحسن", "هدى السالم", "يوسف القادري", "زينب المحمدي", "إبراهيم عبد الرحمن",
  "سلمى الخطيب", "ياسر السليم", "رنا الحميد", "طارق الصديق", "منى العلوي"
];

const arabicTextExcerpts = [
  "الجمال هو الحق، والحق هو الجمال.",
  "الخط العربي فن وإبداع يعكس جمال اللغة العربية.",
  "حروف اللغة العربية تحمل أسرار الجمال والإبداع.",
  "الخط العربي يجمع بين الفن والهندسة في تناغم فريد.",
  "الكلمة الطيبة صدقة، والخط الجميل متعة للناظرين.",
  "اللغة العربية بحر واسع من الجمال والإبداع.",
  "حروفنا العربية تبدأ مفردة وتنتهي متناغمة.",
  "التصميم الجيد يبدأ بفهم عميق للغة والثقافة.",
  "الخط العربي يتنفس في المساحات البيضاء.",
  "الحرف العربي هندسة روحانية بأدوات مادية.",
  "الخط العربي يرسم الكلمات ويصور المعاني.",
  "جمال اللغة العربية في مرونة حروفها وتنوع أشكالها.",
  "الخط هو موسيقى للعين، وإيقاع للروح.",
  "الحروف العربية كالنجوم، تتناثر لتشكل سماء الإبداع.",
  "الخط العربي فن الزمان والمكان في لوحة واحدة.",
  "التصميم بالحروف العربية يجمع بين الأصالة والمعاصرة.",
  "حروفنا العربية تعانق بعضها لتشكل هوية وإبداع.",
  "الفراغ في التصميم العربي هو صمت يتحدث بلغة الجمال.",
  "الخط العربي هو الهندسة الروحانية التي تتجلى من خلال الأداة المادية.",
  "الخط العربي سفير الثقافة والحضارة."
];

// Get fonts from store
const fontStore = useFontStore();

// Filter states
const searchQuery = ref("");
const fontSize = ref(60);
const sampleText = ref("السلام عليكم");
const textAlignment = ref("left");
const fontWeight = ref(400);
const fontStyle = ref("normal");
const leading = ref(1.2);
const tracking = ref(0);
const isAllCaps = ref(false);



// Reactive font CSS with computed properties for better reactivity
const fontCss = computed(() => ({
  fontSize: `${fontSize.value}px`,
  fontWeight: fontWeight.value,
  fontStyle: fontStyle.value,
  lineHeight: leading.value,
  letterSpacing: `${tracking.value}px`,
  textAlign: textAlignment.value,
  textTransform: isAllCaps.value ? 'uppercase' : 'none'
}));

const filterState = reactive({
  category: "All",
  property: "All",
  personality: "All",
  textType: "names",
  style: "All",
  variable: false, // Add filter for variable fonts
});

// Font display options
const viewMode = ref("list"); // 'grid' or 'list'
const sortBy = ref("favorite"); // 'favorite', 'new', 'alphabetical'
const showVariableOnly = ref(false);

// Initialize store
onMounted(() => {
  fontStore.loadFavorites();
  
  // Update fontCss when font parameters change
  updateFontCss();
});

// Update font CSS when any font parameters change
const updateFontCss = () => {
  // This is now handled by the computed property
};

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
      // Update sample text based on new text type
      if (['cities', 'names', 'excerpts'].includes(filter.value)) {
        // Don't set a specific sampleText here, we'll use the getSampleTextForFont function
        // to dynamically generate it for each font
      } else {
        sampleText.value = filter.value === 'arabic' ? "السلام عليكم" : "Your Text";
      }
      break;
    case "alignment":
      textAlignment.value = filter.value;
      break;
    case "sampleText":
      sampleText.value = filter.value;
      break;
    case "variable":
      filterState.variable = filter.value;
      break;
  }
};

const textDarkMode = ref(false);
const handleToggleTheme = (theme) => {
  textDarkMode.value = theme;
};

const handleFontSizeChange = (size) => {
  fontSize.value = size;
};

const toggleVariableOnly = () => {
  showVariableOnly.value = !showVariableOnly.value;
  filterState.variable = showVariableOnly.value;
};

const handleReset = () => {
  // Reset all filters to default values
  searchQuery.value = "";
  fontSize.value = 60;
  fontWeight.value = 400;
  fontStyle.value = "normal";
  leading.value = 1.2;
  tracking.value = 0;
  textAlignment.value = "center";
  isAllCaps.value = false;
  
  // Reset filter state
  Object.assign(filterState, {
    category: "All",
    property: "All",
    personality: "All",
    textType: "names", // Default to 'names' text type
    style: "All",
    variable: false,
  });
  
  showVariableOnly.value = false;
};

// Filter fonts based on all criteria
const filteredFonts = computed(() => {
  let filtered = fontStore.getFilteredFonts({
    search: searchQuery.value,
    category: filterState.category,
    property: filterState.property,
    textType: filterState.textType,
    // Other filters can be added here
  });
  
  // Additional filter for variable fonts
  if (filterState.variable) {
    filtered = filtered.filter(font => {
      // Check if this font has variable options in the new font structure
      const fontData = fonts.find(f => f.name === font.name);
      return fontData && fontData.variable && fontData.variable.length > 0;
    });
  }
  
  return filtered;
});

// Sort the filtered fonts based on the sort option
const sortedFilteredFonts = computed(() => {
  const fontsList = [...filteredFonts.value];
  
  switch (sortBy.value) {
    case 'alphabetical':
      return fontsList.sort((a, b) => a.name.localeCompare(b.name));
    case 'new':
      // In a real app, you might have a 'dateAdded' field
      return fontsList.sort((a, b) => b.id - a.id);
    case 'favorite':
      // Get favorites from localStorage
      const fontFavorites = JSON.parse(localStorage.getItem('fontFavorites') || '[]');
      
      // Get the favorites from the store for fallback
      const storeFavorites = fontStore.favorites || [];
      
      // Combine both sources of favorites, prioritizing localStorage order
      const allFavorites = [...new Set([...fontFavorites, ...storeFavorites])];
      
      if (allFavorites.length > 0) {
        // Create a map for quick lookup of favorite positions
        const favoritePositions = new Map(
          allFavorites.map((id, index) => [id, index])
        );
        
        // Sort fonts: favorites first (in order), then non-favorites
        return fontsList.sort((a, b) => {
          const aIsFavorite = favoritePositions.has(a.id);
          const bIsFavorite = favoritePositions.has(b.id);
          
          // If both are favorites, sort by position
          if (aIsFavorite && bIsFavorite) {
            return favoritePositions.get(a.id) - favoritePositions.get(b.id);
          }
          
          // If only one is favorite, it comes first
          if (aIsFavorite) return -1;
          if (bIsFavorite) return 1;
          
          // If neither is favorite, sort alphabetically
          return a.name.localeCompare(b.name);
        });
      }
      return fontsList;
    default:
      return fontsList;
  }
});

// UI Controls
const totalFontsCount = computed(() => filteredFonts.value.length);
const toggleView = (view) => {
  viewMode.value = view;
};

const setSortBy = (sort) => {
  sortBy.value = sort;
};

// Watch for changes to update fontCss
watch([fontSize, fontWeight, fontStyle, leading, tracking, textAlignment, isAllCaps, sampleText], 
  () => {
    updateFontCss();
  }
);

// Add this computed property
const getSampleTextForFontComputed = computed(() => {
  // Capture the dependency on filterState.textType
  const currentTextType = filterState.textType;
  
  // Return a function that uses the captured textType
  return (font) => {
    // Check if font is Arabic
    const isArabicFont = font.name && (font.name.startsWith("KO") || font.name.startsWith("Ko"));
    
    // Get font index to select consistent sample for each font
    const fontIndex = font.id % 20;
    
    switch(currentTextType) {
      case 'cities':
        return isArabicFont ? arabicCityNames[fontIndex] : cityNames[fontIndex];
      case 'names':
        return isArabicFont ? arabicNameExamples[fontIndex] : nameExamples[fontIndex];
      case 'excerpts':
        return isArabicFont ? arabicTextExcerpts[fontIndex] : textExcerpts[fontIndex];
      default:
        return isArabicFont ? "السلام عليكم" : "Your Text";
    }
  };
});
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
      @toggle-theme="handleToggleTheme"
    />

    <!-- Font display options -->
    <div
      class="font-options-bar bg-black text-white py-4 border-b border-gray-800"
    >
      <v-container>
        <div class="flex items-center flex-wrap">
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
            <v-btn 
              variant="text" 
              color="grey" 
              class="text-caption"
              :class="{ 'v-btn--active': showVariableOnly }"
              @click="toggleVariableOnly"
            >
              Variable
            </v-btn>
          </div>

          <v-spacer></v-spacer>

          <!-- Sort options -->
          <div class="sort-options flex items-center mt-2 md:mt-0">
            <span class="text-gray-400 mr-4">Sort by</span>
            <v-btn-toggle v-model="sortBy" density="comfortable" color="grey">
              <v-btn value="new" variant="text" class="text-caption px-2">
                New
              </v-btn>
              <v-btn value="favorite" variant="text" class="text-caption px-2">
                Favorite
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
            :md="viewMode === 'list' ? 12 : 4"
            :lg="viewMode === 'list' ? 12 : 3"
            class="mb-4"
          >
            <FontCard 
              :font="font" 
              :font-css="fontCss"
              :sample-text="getSampleTextForFontComputed(font)"
              :key="`${font.id}-${filterState.textType}-${textDarkMode}`"
              :text-dark-mode="textDarkMode"
            />
          </v-col>
        </v-row>
        
        <!-- No results message -->
        <div v-if="sortedFilteredFonts.length === 0" class="no-results text-center py-12">
          <p class="text-gray-400 text-lg">No fonts match your filters</p>
          <v-btn color="primary" class="mt-4" @click="handleReset">Reset Filters</v-btn>
        </div>
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

/* Responsive styles */
@media (max-width: 768px) {
  .font-options-bar .flex {
    justify-content: center;
  }
  
  .font-count {
    margin-right: 16px;
  }
  
  .sort-options {
    margin-top: 12px;
  }
}
</style>
