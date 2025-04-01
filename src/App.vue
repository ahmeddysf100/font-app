<script setup>
import { onMounted, computed, watch, ref } from "vue";
import { useHead } from "@vueuse/head";
import { useThemeStore } from "./stores/theme.js";
import { useSittingsStore } from "./stores/sittings";
import { defaultSeoMeta } from "./utils/seo";
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";

const themeStore = useThemeStore();
const sittingsStore = useSittingsStore();

const route = useRoute();
const primaryColor = computed(() => sittingsStore.primaryColor);
const drawer = computed(() => sittingsStore.drawer);
const menuItems = computed(() => sittingsStore.menuItems);
// Compute which menu item is active based on current route
const isActive = (path) => {
  return route.path.startsWith(path);
};

// For scroll to top button
const showScrollBtn = ref(false);

const handleScroll = () => {
  showScrollBtn.value = window.scrollY > 100;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};

// Setup global SEO meta tags
useHead({
  title: defaultSeoMeta.title,
  meta: [
    { name: "description", content: defaultSeoMeta.description },
    { name: "keywords", content: defaultSeoMeta.keywords },
    { name: "author", content: defaultSeoMeta.author },

    // Open Graph
    { property: "og:title", content: defaultSeoMeta.ogTitle },
    { property: "og:description", content: defaultSeoMeta.ogDescription },
    { property: "og:type", content: defaultSeoMeta.ogType },
    { property: "og:url", content: defaultSeoMeta.ogUrl },
    { property: "og:image", content: defaultSeoMeta.image },

    // Twitter
    { name: "twitter:card", content: defaultSeoMeta.twitterCard },
    { name: "twitter:title", content: defaultSeoMeta.title },
    { name: "twitter:description", content: defaultSeoMeta.description },
    { name: "twitter:image", content: defaultSeoMeta.image },
  ],
  link: [{ rel: "canonical", href: defaultSeoMeta.ogUrl }],
});

onMounted(() => {
  themeStore.initTheme();
  sittingsStore.getColorFromLocalStorage();
  window.addEventListener('scroll', handleScroll);
});
</script>

<template>
  <v-app :theme="themeStore.darkMode ? 'dark' : 'light'" :color="primaryColor">
    <Navbar />

    <v-main>
      <!-- Using router-view to display the current route component -->
      <router-view></router-view>
    </v-main>

    <!-- Scroll to top button moved outside of other components -->
    <v-fade-transition>
      <v-btn
        v-show="showScrollBtn"
        icon
        color="primary"
        size="large"
        elevation="4"
        class="scroll-to-top-btn"
        @click="scrollToTop"
      >
        <v-icon>mdi-arrow-up</v-icon>
      </v-btn>
    </v-fade-transition>

    <v-footer class="py-4 text-center  " :style="{ backgroundColor: themeStore.darkMode ? 'black' : 'white' }">
      <div class="w-full">
        <p class="text-primary dark:text-gray-400">
          © {{ new Date().getFullYear() }} Kotype. All rights reserved.
        </p>
        <div class="mt-2 flex justify-center space-x-4 ">
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-twitter</v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-instagram</v-icon>
          </v-btn>
          <v-btn icon variant="text" size="small">
            <v-icon>mdi-github</v-icon>
          </v-btn>
        </div>
      </div>
    </v-footer>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      width="280"
      class="mobile-drawer dark:bg-black"
    >
      <div class="pa-4 drawer-header">
        <div class="d-flex justify-space-between align-center">
          <h3 class="text-h5 font-weight-bold">Menu</h3>
          <v-btn icon @click="sittingsStore.drawer = false" class="close-btn">
            <v-icon class="text-primary">mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <v-divider class="my-2"></v-divider>

      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :active="isActive(item.path)"
          color="primary"
          class="drawer-list-item"
          link
        >
          <template v-slot:title>
            <span class="text-h6">{{ item.title }}</span>
          </template>
          <template v-slot:append v-if="item.count">
            <span class="count-badge">{{ item.count }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<style>
/* Global styles that apply to the whole app */
html {
  overflow-y: auto;
}

/* For Tailwind dark mode to work with Vuetify's theme system */
:root {
  --v-theme-overlay-multiplier: 1;
}

.dark {
  --v-theme-overlay-multiplier: 2;
}

/* Grid styles for Tailwind to work with Vuetify */
@media (min-width: 960px) {
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}


/* Scroll to top button styling */
.scroll-to-top-btn {
  position: fixed !important;
  bottom: 24px !important;
  right: 24px !important;
  z-index: 9999 !important;
}

@media (min-width: 1400px) {
  .scroll-to-top-btn {
    right: calc((100% - 1400px) / 2 + 24px);
  }
}
</style>
