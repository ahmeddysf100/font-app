<script setup>
import { onMounted, computed, watch } from "vue";
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
});
</script>

<template>
  <v-app :theme="themeStore.darkMode ? 'dark' : 'light'" :color="primaryColor">
    <Navbar />

    <v-main>
      <!-- Using router-view to display the current route component -->
      <router-view></router-view>
    </v-main>

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

/* Font families */
.font-koaynama-sharp {
  font-family: "KOAynama-Sharp", sans-serif;
}

.font-koaynama-curved {
  font-family: "KOAynama-Curved", sans-serif;
}

.font-koshareb {
  font-family: "KoShareb", serif;
}

.font-kobanzeen {
  font-family: "Ko_Banzeen", sans-serif;
}

.font-kodongol {
  font-family: "KoDongol", serif;
}

.font-kolemaza {
  font-family: "KOLemaza", sans-serif;
}

.font-kokhalaya {
  font-family: "KoKhalaya", sans-serif;
}

.font-kokhalaya-variable {
  font-family: "KoKhalaya-Variable", sans-serif;
}

.font-korubbama {
  font-family: "KORubbama", cursive;
  font-weight: 900;
}

.font-kogalimodern {
  font-family: "KoGaliModern", monospace;
}

/* @font-face {
  font-family: 'Ko_Banzeen ';
  src: url('./assets/fonts/Ko_Banzeen/Ko_Banzeen-Normal.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'Ko_Banzeen Slanted Left';
  src: url('./assets/fonts/Ko_Banzeen/Ko_Banzeen-SlantedL.otf') format('opentype');
  font-weight: normal;
  font-style: italic;
}
@font-face {
  font-family: 'Ko_Banzeen Slanted Right';
  src: url('./assets/fonts/Ko_Banzeen/Ko_Banzeen-SlantedR.otf') format('opentype');
  font-weight: normal;
  font-style: oblique;
}


@font-face {
  font-family: 'KOAynama Curved';
  src: url('./assets/fonts/KOAynama/KOAynama-Curved.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'KOAynama Sharp';
  src: url('./assets/fonts/KOAynama/KOAynama-Sharp.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'KoDongol';
  src: url('./assets/fonts/KoDongol/KoDongol-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}




@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Black.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Bold.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-ExtraBold.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Medium.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-SemiBold.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Thin.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-UltraLight.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Light.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-ExtraLight.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-Heavy.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: 'KoGaliModern';
  src: url('./assets/fonts/KoGaliModern/KoGaliModern-SemiBold.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}





@font-face {
  font-family: 'KoKhalaya Variable';
  src: url('./assets/fonts/KoKhalaya/variable/KoKhalayaVF.ttf') format('truetype');
  font-weight: 300 900;
  font-style: normal;
}

@font-face {
  font-family: 'KoKhalaya';
  src: url('./assets/fonts/KoKhalaya/weights/KoKhalaya-5-5.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
} */
</style>
