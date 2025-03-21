<script setup>
import { ref, computed, onMounted } from 'vue';
import { useThemeStore } from "../stores/theme.js";
import { fonts } from "../utils/fontLoader";

const themeStore = useThemeStore();
const isMobile = ref(false);

// Get Arabic fonts for background decoration
const arabicFonts = computed(() => {
  return fonts.filter(font => 
    font.name.startsWith('KO') || font.name.startsWith('Ko')
  );
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
  document.documentElement.style.setProperty('--bg-color', isDark ? '#0d0d0d' : 'white');
  document.documentElement.style.setProperty('--accent-color', isDark ? '#ff1493' : '#ff69b4');
  document.documentElement.style.setProperty('--accent-light-color', isDark ? 'rgba(255, 20, 147, 0.1)' : 'rgba(255, 105, 180, 0.1)');
  document.documentElement.style.setProperty('--accent-medium-color', isDark ? 'rgba(255, 20, 147, 0.3)' : 'rgba(255, 105, 180, 0.3)');
  document.documentElement.style.setProperty('--section-bg-color', isDark ? '#151515' : '#f8f8f8');
  document.documentElement.style.setProperty('--text-color', isDark ? '#f5f5f5' : '#111');
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
  updateThemeVariables();
});
</script>

<template>
  <div class="terms-view bg-black" :class="{ 'dark-theme': themeStore.darkMode }">
    <div class="page-header bg-black">
      <v-container>
        <div class="header-content bg-black">
          <h1 class="page-title">Terms & Conditions</h1>
          <div class="title-underline"></div>
        </div>
      </v-container>
    </div>
    
    <v-container class="main-content">
      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="terms-container">
            <div class="terms-header-pill">
              <h2>Basic Terms & Conditions</h2>
            </div>
            
            <div class="terms-content">
              <div class="term-item">
                <span class="term-number">1-</span>
                <p>Kotype Arabic fonts are free to use in personal and commercial works.</p>
              </div>
              
              <div class="term-item">
                <span class="term-number">2-</span>
                <p>Kotype fonts can be used on any medium: poster, logo, magazine, website, app, t-shirt, music video, bike trailer… Remember to credit the name of the type designer or the foundry whenever you use the fonts.</p>
              </div>
              
              <div class="term-item">
                <span class="term-number">3-</span>
                <p>Redistribution of the fonts without written permission is not allowed.</p>
              </div>
              
              <div class="term-item">
                <span class="term-number">4-</span>
                <p>Modification of the font file without written permission is not allowed.</p>
              </div>
              
              <div class="term-item">
                <span class="term-number">5-</span>
                <p>Kotype Free Arabic fonts may not be added to or used within any online or offline design tools or apps (e.g., Canva, photoshop) that allow users to create, edit, or distribute images using the fonts without proper licensing from Kotype or the designer of the typeface.</p>
              </div>
            </div>
            
            <div class="donation-section">
              <p>If you like our Free fonts and our activities, please consider donating. This will allow us to continue distributing new quality, free fonts and improving our existing catalogue.</p>
              <v-btn 
                color="pink" 
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
      <div v-if="randomFont" class="decorative-font" :style="{ fontFamily: randomFont.fontFamily }">
        شروط
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-view {
  background-color: #fff;
  color: #111;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.terms-view.dark-theme {
  background-color: #0d0d0d;
  color: #f5f5f5;
}

.page-header {
  background-color: var(--section-bg-color, #f8f8f8);
  padding: 80px 0 40px;
  position: relative;
  box-shadow: var(--section-shadow, 0 5px 15px rgba(0,0,0,0.03));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.header-content {
  text-align: center;
}

.page-title {
  display: inline-block;
  background-color: var(--accent-color, #ff69b4);
  color: white;
  padding: 15px 30px;
  border-radius: 30px;
  font-size: 2rem;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px var(--accent-medium-color, rgba(255, 105, 180, 0.2));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.title-underline {
  height: 4px;
  background-color: var(--accent-color, #ff69b4);
  width: 120px;
  margin: 10px auto 0;
  border-radius: 2px;
  opacity: 0.6;
  transition: background-color 0.3s ease;
}

.main-content {
  padding: 60px 0;
  position: relative;
  z-index: 2;
}

.terms-container {
  background-color: var(--bg-color, white);
  border-radius: 16px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.03);
  padding: 40px;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.terms-header-pill {
  background-color: var(--accent-color, #ff69b4);
  color: white;
  padding: 12px 25px;
  border-radius: 100px;
  display: inline-block;
  margin-bottom: 30px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 10px var(--accent-light-color, rgba(255, 105, 180, 0.2));
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
  color: var(--accent-color, #ff69b4);
}

.term-item p {
  margin: 0;
  color: var(--text-color, #111);
  transition: color 0.3s ease;
}

.donation-section {
  margin-top: 60px;
  padding-top: 30px;
  border-top: 1px solid var(--accent-light-color, rgba(255, 105, 180, 0.2));
  text-align: center;
}

.donation-section p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color, #111);
  max-width: 700px;
  margin: 0 auto;
  transition: color 0.3s ease;
}

.donation-btn {
  background-color: var(--accent-color, #ff69b4) !important;
  color: white !important;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px var(--accent-light-color, rgba(255, 105, 180, 0.2));
}

.donation-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px var(--accent-medium-color, rgba(255, 105, 180, 0.3));
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
  color: var(--accent-color, #ff69b4);
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