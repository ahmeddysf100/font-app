<script setup>
import { ref, computed } from "vue";
import { useThemeStore } from "../stores/theme.js";
import { useRoute } from "vue-router";
import logoImage from "../assets/kotype.svg"; // Import the image

const themeStore = useThemeStore();
const drawer = ref(false);
const route = useRoute();

const menuItems = [
  { title: "Fonts", count: "100", path: "/fonts" },
  { title: "Pairs", count: "59", path: "/pairs" },
  { title: "Licenses", path: "/licenses" },
];

// Compute which menu item is active based on current route
const isActive = (path) => {
  return route.path.startsWith(path);
};
</script>

<template>
  <div class="nav-container bg-black">
    <!-- Main Horizontal Navigation -->
    <div
      class="main-nav bg-black d-flex justify-around align-center"
      style="height: 150px !important"
    >
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="p-4 w-100">
          <router-link to="/">
            <img
              :src="logoImage"
              alt="Kotype Logo"
              class="logo-image w-100"
            />
          </router-link>
        </div>
      </div>

      <div class="d-flex justify-center align-center w-100 h-100">
        <!-- Menu Items -->
        <div
          v-for="item in menuItems"
          :key="item.title"
          cols="1"
          class="menu-item-col px-8 w-70"
          :class="{ 'active-menu-item': isActive(item.path) }"
        >
          <router-link :to="item.path" custom v-slot="{ navigate }">
            <div
              @click="navigate"
              class="menu-item p-4 text-center d-flex flex-column justify-center"
            >
              <span class="text-subtitle-1">{{ item.title }}</span>
              <span v-if="item.count" class="count-text mt-2">{{
                item.count
              }}</span>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Hamburger Menu Section -->
      <div
        class="hamburger-section bg-black d-flex justify-end align-center"
      >
        <div class="p-4 d-flex justify-center align-center">
          <v-btn icon @click="drawer = !drawer">
            <v-icon size="x-large">mdi-menu</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- No Styles Section -->
      <!-- <div cols="3" class="styles-section bg-black">
        <div class="pa-8 d-flex justify-center align-center">
          <span class="text-grey">No styles selected</span>
        </div>
      </div> -->
    </div>

    <!-- Mobile Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      location="right"
      color="black"
    >
      <v-list color="black">
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          :active="isActive(item.path)"
          color="white"
          link
        >
          <template v-slot:title>
            {{ item.title }}
          </template>
          <template v-slot:append v-if="item.count">
            <span class="text-white">{{ item.count }}</span>
          </template>
        </v-list-item>

        <v-divider class="my-2 bg-grey-darken-3"></v-divider>

        <v-list-item color="white" @click="themeStore.toggleDarkMode()">
          <template v-slot:prepend>
            <v-icon color="white">{{
              themeStore.darkMode ? "mdi-weather-sunny" : "mdi-weather-night"
            }}</v-icon>
          </template>
          <template v-slot:title> Toggle Theme </template>
        </v-list-item>
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
  height: 180px;
  border-bottom: 1px solid #333;
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
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.active-menu-item {
  background-color: #fff9de; /* Light yellow background for active tab */
  color: black;
}

.menu-item {
  height: 100%;
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
}

/* Make column widths more accurate on smaller screens */
@media (max-width: 960px) {
  .logo-section {
    width: 30%;
  }

  .menu-item-col {
    width: 20%;
  }

  .hamburger-section {
    width: 10%;
  }

  .styles-section {
    width: 20%;
  }
}
</style>
