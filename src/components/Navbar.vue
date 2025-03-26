<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
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
const totalFontsCount = computed(() => fontStore.fonts.length);
const menuItems = [
  { title: "Fonts", count: totalFontsCount, path: "/fonts" },
  { title: "About", path: "/about" },
  { title: "Contact", path: "/contact" },
  { title: "Terms & conditions", path: "/terms" },
];

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

const sittingsStore = useSittingsStore();
const primaryColor = computed(() => sittingsStore.primaryColor);

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
  <div class="nav-container bg-black">
    <!-- Main Horizontal Navigation -->
    <div
      class="main-nav bg-black d-flex justify-space-between align-center border-primary"
      :class="{ 'mobile-nav': isMobile }"
    >
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="p-4 pr-0">
          <router-link to="/">
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
        class="d-flex justify-center align-center flex-grow-1 h-100"
      >
        <!-- Menu Items -->
        <div
          v-for="item in menuItems"
          :key="item.title"
          class="menu-item-col px-4 px-md-8 border-primary"
          :class="{ 'active-menu-item': isActive(item.path) }"
          @click="navigate(item.path)"
        >
          <div
            @click="navigate"
            class="menu-item py-2 py-md-4 text-center d-flex flex-column justify-center"
          >
            <span class="text-subtitle-1">{{ item.title }}</span>
            <span v-if="item.count" class="count-text mt-2">{{
              item.count
            }}</span>
          </div>
        </div>
      </div>

      <!-- Hamburger Menu Section -->
      <div
        v-if="isMobile"
        class="hamburger-section bg-black d-flex justify-end align-center"
      >
        <div class="p-3 p-md-4 d-flex justify-center align-center">
          <v-btn icon @click="drawer = !drawer" class="hamburger-btn">
            <v-icon :color="primaryColor" :size="isMobile ? 'large' : 'x-large'">mdi-menu</v-icon>
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      width="280"
      color="black"
    >
      <div class="pa-4 drawer-header">
        <div class="d-flex justify-space-between align-center">
          <h3 class="text-white">Menu</h3>
          <v-btn icon @click="drawer = false" :color="primaryColor" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>

      <v-divider class="my-2 bg-grey-darken-3"></v-divider>

      <v-list color="black">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :active="isActive(item.path)"
          :color="primaryColor"
          class="drawer-list-item"
          link
        >
          <template v-slot:title>
            <span class="text-h6">{{ item.title }}</span>
          </template>
          <template v-slot:append v-if="item.count">
            <span class="  count-badge" :style="{ color: primaryColor }">{{ item.count }}</span>
          </template>
        </v-list-item>

        <v-divider class="my-4 bg-grey-darken-3"></v-divider>

        <!-- <v-list-item color="white" @click="themeStore.toggleDarkMode()" class="theme-toggle-item">
          <template v-slot:prepend>
            <v-icon color="white">
              {{ themeStore.darkMode ? "mdi-weather-sunny" : "mdi-weather-night" }}
            </v-icon>
          </template>
          <template v-slot:title>
            <span class="text-body-1">Toggle Theme</span>
          </template>
        </v-list-item> -->
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<style scoped>
.nav-container {
  width: 100%;
}

.main-nav {
  background-color: #111;
  height: 150px;
  border-bottom: 1px solid #333;
  transition: height 0.3s ease;
}

.mobile-nav {
  height: 80px !important;
}

.logo-section {
  background-color: #000000;
  height: 100%;
  display: flex;
  align-items: center;
}

.menu-item-col {
  height: 100%;
  border-right: 1px solid #333;
  border-left: 1px solid #333;
  color: white;
  cursor: pointer;
  background-color: black;
  position: relative;
  overflow: hidden;
}

.border-primary {
  border-color: v-bind(primaryColor) !important;
}

.menu-item-col:hover {
  border-bottom: 2px solid v-bind(primaryColor) !important;
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

.menu-item {
  height: 100%;
  position: relative;
  z-index: 1;
}

.count-text {
  font-size: 16px;
}

.hamburger-section {
  background-color: #111;
  color: white;
  height: 100%;
  display: flex;
  align-items: center;
  border-right: 1px solid #333;
}

.hamburger-btn {
  transition: transform 0.2s ease;
}

.hamburger-btn:hover {
  transform: scale(1.1);
}

.styles-section {
  background-color: #111;
  height: 100%;
  display: flex;
  align-items: center;
}

.logo-image {
  max-width: 150px;
  height: auto;
  display: block; /* Ensures the image is visible */
  transition: max-width 0.3s ease;
}

.drawer-header {
  padding-top: 16px;
  padding-bottom: 16px;
}

.drawer-list-item {
  margin-bottom: 8px;
  padding: 16px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.drawer-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.drawer-list-item.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.count-badge {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.theme-toggle-item {
  margin-top: 8px;
}

/* Media queries for responsive design */
@media (max-width: 960px) {
  .logo-image {
    max-width: 120px;
  }

  .menu-item-col {
    padding-left: 16px !important;
    padding-right: 16px !important;
  }
}

@media (max-width: 768px) {
  .logo-image {
    max-width: 100px;
  }

  .logo-section {
    padding-left: 8px;
  }

  .count-text {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .logo-image {
    max-width: 90px;
  }

  .hamburger-section {
    padding-right: 8px;
  }
}
</style>
