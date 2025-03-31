<script setup>
import { ref, computed, onMounted } from "vue";
import { useThemeStore } from "../stores/theme.js";
import { useSittingsStore } from "../stores/sittings.js";
import fonts from "../../public/fonts.json";

const themeStore = useThemeStore();
const isMobile = ref(false);
const settingsStore = useSittingsStore();
// Get Arabic fonts for background decoration
const arabicFonts = computed(() => {
  return fonts.filter(
    (font) => font.name.startsWith("KO") || font.name.startsWith("Ko")
  );
});

const primaryColor = computed(() => {
  return settingsStore.primaryColor;
});

// Random font for accent elements
const randomFont = computed(() => {
  if (arabicFonts.value.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * arabicFonts.value.length);
  return arabicFonts.value[randomIndex];
});

// Check screen size
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

// Update theme variables
const updateThemeVariables = () => {
  const isDark = themeStore.darkMode;
  document.documentElement.style.setProperty(
    "--bg-color",
    isDark ? "#0d0d0d" : "white"
  );
  document.documentElement.style.setProperty(
    "--accent-color",
    isDark ? primaryColor.value : "#ff69b4"
  );
  document.documentElement.style.setProperty(
    "--accent-light-color",
    isDark ? "rgba(255, 20, 147, 0.1)" : "rgba(255, 105, 180, 0.1)"
  );
  document.documentElement.style.setProperty(
    "--accent-medium-color",
    isDark ? "rgba(255, 20, 147, 0.3)" : "rgba(255, 105, 180, 0.3)"
  );
  document.documentElement.style.setProperty(
    "--section-bg-color",
    isDark ? "#151515" : "#f8f8f8"
  );
  document.documentElement.style.setProperty(
    "--text-color",
    isDark ? "#f5f5f5" : "#111"
  );
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  // updateThemeVariables();
});
</script>

<template>
  <div
    class="terms-view"
    :style="{
      backgroundColor: themeStore.darkMode ? 'black' : 'white',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }"
  >
    <div 
      class="page-header"
      :style="{
        backgroundColor: themeStore.darkMode ? 'black' : 'white',
        boxShadow: themeStore.darkMode ? '0 5px 15px rgba(0, 0, 0, 0.2)' : '0 5px 15px rgba(0, 0, 0, 0.03)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
      }"
    >
      <v-container>
        <div class="header-content">
          <h1 
            class="page-title bg-primary !text-white"
            :style="{
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
              color: 'white'
            }"
          >
            Terms & Conditions
          </h1>
          <div 
            class="title-underline bg-primary"
            :style="{
              transition: 'background-color 0.3s ease'
            }"
          ></div>
        </div>
      </v-container>
    </div>

    <v-container class="main-content">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div 
            class="terms-container"
            :style="{
              backgroundColor: themeStore.darkMode ? '#151515' : '',
              boxShadow: themeStore.darkMode ? '0 5px 20px rgba(0, 0, 0, 0.2)' : '0 5px 20px rgba(0, 0, 0, 0.03), 0 2px 8px rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
            }"
          >
            <div 
              class="terms-header-pill bg-primary"
              :style="{
                transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
              }"
            >
              <h2>Basic Terms & Conditions</h2>
            </div>

            <div class="terms-content">
              <div 
                v-for="(item, index) in [
                  'Kotype Arabic fonts are free to use in personal and commercial works.',
                  'Kotype fonts can be used on any medium: poster, logo, magazine, website, app, t-shirt, music video, bike trailer… Remember to credit the name of the type designer or the foundry whenever you use the fonts.',
                  'Redistribution of the fonts without written permission is not allowed.',
                  'Modification of the font file without written permission is not allowed.',
                  'Kotype Free Arabic fonts may not be added to or used within any online or offline design tools or apps (e.g., Canva, photoshop) that allow users to create, edit, or distribute images using the fonts without proper licensing from Kotype or the designer of the typeface.'
                ]"
                :key="index"
                class="term-item"
              >
                <span 
                  class="term-number text-primary "
                  :style="{
                    transition: 'color 0.3s ease'
                  }"
                >
                  {{ index + 1 }}-
                </span>
                <p
                  :style="{
                    color: themeStore.darkMode ? 'rgba(255, 255, 255, 0.9)' : '#111',
                    transition: 'color 0.3s ease'
                  }"
                >
                  {{ item }}
                </p>
              </div>
            </div>

            <div 
              class="donation-section"
              :style="{
                borderColor: themeStore.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                transition: 'border-color 0.3s ease'
              }"
            >
              <p
                :style="{
                  color: themeStore.darkMode ? 'rgba(255, 255, 255, 0.9)' : '#111',
                  transition: 'color 0.3s ease'
                }"
              >
                If you like our Free fonts and our activities, please consider
                donating. This will allow us to continue distributing new
                quality, free fonts and improving our existing catalogue.
              </p>
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                class="mt-3 donation-btn"
                href="https://ko-fi.com/kotype"
                target="_blank"
              >
                Visit our donation page
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="decorative-text-bg">
      <div
        v-if="randomFont"
        class="decorative-font"
        :style="{ 
          fontFamily: randomFont.fontFamily,
          color: themeStore.darkMode ? '#fff' : '#000',
          opacity: themeStore.darkMode ? '0.05' : '0.03',
          transition: 'color 0.3s ease, opacity 0.3s ease'
        }"
      >
        شروط
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-view {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.page-header {
  padding: 80px 0 40px;
  position: relative;
  z-index: 1;
}

.header-content {
  text-align: center;
}

.page-title {
  display: inline-block;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 2rem;
  position: relative;
  z-index: 2;
}

.title-underline {
  height: 4px;
  width: 120px;
  margin: 10px auto 0;
  border-radius: 2px;
  opacity: 0.6;
}

.main-content {
  padding: 60px 0;
  position: relative;
  z-index: 2;
}

.terms-container {
  border-radius: 16px;
  padding: 40px;
  position: relative;
}

.terms-header-pill {
  padding: 12px 25px;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.terms-header-pill h2 {
  margin: 0;
  font-size: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.terms-content {
  margin-bottom: 40px;
}

.term-item {
  display: flex;
  margin-bottom: 20px;
  font-size: 1.1rem;
  line-height: 1.6;
}

.term-number {
  font-weight: 700;
  font-size: 1.2rem;
  margin-right: 8px;
  flex-shrink: 0;
}

.term-item p {
  margin: 0;
}

.donation-section {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid;
  text-align: center;
}

.donation-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto;
}

.donation-btn {
  font-weight: 500;
  transition: transform 0.3s ease;
}

.donation-btn:hover {
  transform: translateY(-2px);
}

/* Decorative Background */
.decorative-text-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  opacity: 0.03;
}

.decorative-font {
  position: absolute;
  top: 10%;
  right: -5%;
  font-size: 30rem;
  transform: rotate(-10deg);
  white-space: nowrap;
  line-height: 1;
}

@media (max-width: 959px) {
  .decorative-font {
    font-size: 20rem;
  }
}

@media (max-width: 767px) {
  .page-header {
    padding: 60px 0 30px;
  }

  .page-title {
    font-size: 1.6rem;
    padding: 12px 25px;
  }

  .main-content {
    padding: 40px 0;
  }

  .terms-container {
    padding: 30px 20px;
  }

  .terms-header-pill {
    padding: 10px 20px;
    margin-bottom: 20px;
  }

  .terms-header-pill h2 {
    font-size: 1.3rem;
  }

  .term-item {
    font-size: 1rem;
  }

  .term-number {
    font-size: 1.1rem;
  }

  .decorative-font {
    font-size: 15rem;
    top: 50%;
    right: -20%;
  }

  .donation-section p {
    font-size: 1rem;
  }
}

@media (max-width: 479px) {
  .terms-container {
    padding: 20px 15px;
  }

  .terms-header-pill h2 {
    font-size: 1.1rem;
  }

  .decorative-font {
    font-size: 10rem;
  }
}
</style>
