<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useThemeStore } from "../stores/theme.js";
import { useSittingsStore } from "../stores/sittings";
import { useRoute, useRouter } from "vue-router";
import logoImage from "../assets/kotype.svg"; // Import the image
import { useFontStore } from "../stores/fonts";
const fontStore = useFontStore();
const themeStore = useThemeStore();
const drawer = ref(false);
const route = useRoute();
const router = useRouter();
const sittingsStore = useSittingsStore();
const totalFontsCount = computed(() => fontStore.fonts.length);
const menuItems = [
  { title: "Fonts", count: totalFontsCount, path: "/fonts" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
  { title: "Terms & conditions", path: "/terms" },
];
sittingsStore.menuItems = menuItems;

const navigate = (path) => {
  router.push(path);
};

// Compute which menu item is active based on current route
const isActive = (path) => {
  return route.path.startsWith(path);
};

// Check if mobile view
const isMobile = ref(false);

// Check screen size on mount and when window resizes
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};


const primaryColor = computed(() => sittingsStore.primaryColor);

watch(drawer, (newVal) => {
  sittingsStore.drawer = newVal;
});

// Call on component mount
onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

// Remove event listener on unmount
onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<template>
  <div class="nav-container border-b-2 border-primary" :class="{ 'bg-black': themeStore.darkMode, 'bg-white': !themeStore.darkMode }">
    <!-- Main Horizontal Navigation -->
    <div
      class="main-nav d-flex justify-space-between align-center"
      :class="{ 'mobile-nav': isMobile }"
    >
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="p-4 pr-0">
          <router-link to="/" class="logo-link">
            <img
              :src="logoImage"
              alt="Kotype Logo"
              class="logo-image"
              width="200px"
              height="auto"
            />
          </router-link>
        </div>
      </div>

      <!-- Desktop Menu -->
      <div
        v-if="!isMobile"
        class="d-flex justify-center align-center flex-grow-1 h-100 menu-container"
      >
        <!-- Menu Items -->
        <div
          v-for="item in menuItems"
          :key="item.title"
          class="menu-item-col  border-primary-pages     "
          :class="{ 'active-menu-item': isActive(item.path) }"
          @click="navigate(item.path)"
        >
          <div class="menu-item py-2 py-md-4 text-center d-flex flex-column justify-center">
            <span class="text-subtitle-1">{{ item.title }}</span>
            <span v-if="item.count" class="count-text mt-2">{{ item.count }}</span>
          </div>
        </div>
      </div>

      <!-- Theme Toggle Button -->
      <div class="theme-toggle-section d-flex align-center">
        <v-btn
          icon
          @click="themeStore.toggleDarkMode()"
          class="theme-toggle-btn"
        >
          <v-icon :color="primaryColor" :size="isMobile ? 'large' : 'x-large'">
            {{ themeStore.darkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
          </v-icon>
        </v-btn>
      </div>

      <!-- Hamburger Menu Section -->
      <div
        v-if="isMobile"
        class="hamburger-section d-flex justify-end align-center"
      >
        <div class="p-3 p-md-4 d-flex justify-center align-center">
          <v-btn icon @click="drawer = !drawer" class="hamburger-btn">
            <v-icon :color="primaryColor" :size="isMobile ? 'large' : 'x-large'">mdi-menu</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

   
  </div>
</template>

<style scoped>
.border-primary {
  border-color: v-bind(primaryColor);
}

.border-primary-pages:hover {
  border-bottom: 5px solid v-bind(primaryColor);
}

.nav-container {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: background-color 0.3s ease;
}

.main-nav {
  height: 80px;
  transition: all 0.3s ease;
}

.mobile-nav {
  height: 60px !important;
}

.logo-section {
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-link {
  display: block;
  transition: transform 0.3s ease;
}

.logo-link:hover {
  transform: scale(1.05);
}

.menu-container {
  max-width: 800px;
  margin: 0 auto;
  justify-content: center;
}

.menu-item-col {
  height: 100%;
  padding: 0 2rem;
  color: v-bind('themeStore.darkMode ? "white" : "black"');
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-item {
  height: 100%;
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.active-menu-item {
  position: relative;
}

.active-menu-item .text-subtitle-1,
.active-menu-item .count-text {
  transition: color 0.3s ease;
  animation: textColorChange 0.3s ease forwards;
}

.active-menu-item::before {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0;
  background-color: v-bind(primaryColor);
  z-index: 1;
  animation: fillUp 0.3s ease forwards;
}

@keyframes fillUp {
  0% {
    height: 0;
  }
  100% {
    height: 100%;
  }
}

@keyframes textColorChange {
  0% {
    color: white;
  }
  80% {
    color: white;
  }
  100% {
    color: black;
  }
}

.count-text {
  font-size: 0.875rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.menu-item-col:hover .count-text {
  opacity: 1;
}

.hamburger-section {
  height: 100%;
  display: flex;
  align-items: center;
  padding-right: 1rem;
}

.hamburger-btn {
  transition: transform 0.2s ease;
}

.hamburger-btn:hover {
  transform: scale(1.1);
}

.logo-image {
  max-width: 150px;
  height: auto;
  transition: max-width 0.3s ease;
}

.mobile-drawer {
  background: rgba(0, 0, 0, 0.98) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.drawer-header {
  padding-top: 16px;
  padding-bottom: 16px;
}

.drawer-list-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.drawer-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.drawer-list-item.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.count-badge {
  background-color: v-bind(primaryColor);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 960px) {
  .logo-image {
    max-width: 120px;
  }
}

@media (max-width: 768px) {
  .logo-image {
    max-width: 100px;
  }
  
  .main-nav {
    height: 60px;
  }
}

@media (max-width: 480px) {
  .logo-image {
    max-width: 90px;
  }
}

.theme-toggle-section {
  padding-right: 1rem;
}

.theme-toggle-btn {
  transition: transform 0.2s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}
</style>
