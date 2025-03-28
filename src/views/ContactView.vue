<script setup>
import { ref, computed, onMounted } from "vue";
import { useThemeStore } from "../stores/theme.js";
import logoImage from "../assets/kotype.svg";
import fonts from "../../public/fonts.json";
import { useSittingsStore } from "../stores/sittings.js";

const themeStore = useThemeStore();
const isMobile = ref(false);
const sittingsStore = useSittingsStore();

const primaryColor = computed(() => sittingsStore.primaryColor);

// Form data
const formData = ref({
  name: "",
  email: "",
  message: "",
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(false);

// Get Arabic fonts for background decoration
const arabicFonts = computed(() => {
  return fonts.filter(
    (font) => font.name.startsWith("KO") || font.name.startsWith("Ko")
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
  document.documentElement.style.setProperty(
    "--bg-color",
    isDark ? primaryColor.value : "white"
  );
  document.documentElement.style.setProperty(
    "--accent-color",
    isDark ? primaryColor.value : "#ff69b4"
  );
  document.documentElement.style.setProperty(
    "--accent-light-color",
    isDark ? primaryColor.value : "rgba(255, 105, 180, 0.1)"
  );
  // document.documentElement.style.setProperty('--accent-medium-color', isDark ? primaryColor.value : 'rgba(255, 105, 180, 0.3)');
  document.documentElement.style.setProperty(
    "--section-bg-color",
    isDark ? "#151515" : "#f8f8f8"
  );
  document.documentElement.style.setProperty(
    "--text-color",
    isDark ? "#f5f5f5" : "#111"
  );
};

// Handle form submission
const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = false;

  try {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    submitSuccess.value = true;
    formData.value = { name: "", email: "", message: "" };
  } catch (error) {
    submitError.value = true;
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);
  updateThemeVariables();
});
</script>

<template>
  <div 
    class="contact-view"
    :style="{
      backgroundColor: themeStore.darkMode ? 'black' : 'white',
      color: themeStore.darkMode ? '#f5f5f5' : '#111',
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }"
  >
    <div 
      class="page-header"
      :style="{
        backgroundColor: themeStore.darkMode ? 'black' : 'white',
        transition: 'background-color 0.3s ease'
      }"
    >
      <v-container>
        <div class="header-content">
          <h1 
            class="page-title"
            :style="{
              backgroundColor: primaryColor,
              color: '#fff',
              transition: 'background-color 0.3s ease'
            }"
          >
            Contact Us
          </h1>
          <div 
            class="title-underline"
            :style="{
              backgroundColor: primaryColor,
              transition: 'background-color 0.3s ease'
            }"
          ></div>
        </div>
      </v-container>
    </div>

    <v-container class="main-content " >
      <v-row>
        <v-col cols="12" md="6">
          <div class="contact-info">
            <div class="info-section">
              <h2 
                class="section-title"
                :style="{
                  color: primaryColor,
                  transition: 'color 0.3s ease'
                }"
              >
                Let's Connect
              </h2>

              <p 
                class="mb-6"
                :style="{
                  color: themeStore.darkMode ? 'rgba(255, 255, 255, 0.9)' : '#111',
                  transition: 'color 0.3s ease'
                }"
              >
                We're always on the lookout for new free Arabic fonts and new
                talents. If you'd like to publish with us or join our journey,
                we also offer consultation and feedback sessions for both
                students and professionals.
              </p>

              <p 
                class="mb-6"
                :style="{
                  color: themeStore.darkMode ? 'rgba(255, 255, 255, 0.9)' : '#111',
                  transition: 'color 0.3s ease'
                }"
              >
                We offer ad banner space in our main page, for ads that related
                to our community interests like workshops, submissions..etc.
              </p>

              <p 
                class="contact-cta"
                :style="{
                  color: themeStore.darkMode ? 'rgba(255, 255, 255, 0.9)' : '#111',
                  transition: 'color 0.3s ease'
                }"
              >
                Feel free to reach out:
                <a 
                  :href="'contact.kotype@gmail.com'" 
                  class="email-link"
                  :style="{
                    color: primaryColor,
                    transition: 'color 0.3s ease'
                  }"
                >
                  <span class="email-text">contact.kotype@gmail.com</span>
                </a>
              </p>

              <p 
                class="mt-8 donation-text"
                :style="{
                  color: themeStore.darkMode ? 'rgba(255, 255, 255, 0.9)' : '#111',
                  borderColor: themeStore.darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  transition: 'color 0.3s ease, border-color 0.3s ease'
                }"
              >
                If you like our fonts and our activities, please consider
                donating. This will allow us to continue distributing new
                quality, free fonts and improving our existing catalogue.
                <v-btn
                  :color="primaryColor"
                  variant="elevated"
                  size="large"
                  class="mt-3 donation-btn d-flex align-center"
                  href="https://ko-fi.com/kotype"
                  target="_blank"
                >
                  Visit our donation page
                </v-btn>
              </p>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div 
            class="contact-form-wrapper"
            :style="{
              backgroundColor: themeStore.darkMode ? '#151515' : '#f8f8f8',
              boxShadow: themeStore.darkMode ? '0 5px 20px rgba(0, 0, 0, 0.2)' : '0 5px 20px rgba(0, 0, 0, 0.05)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
            }"
          >
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <input
                  type="text"
                  v-model="formData.name"
                  placeholder="Name*"
                  required
                  class="form-input"
                  :style="{
                    backgroundColor: themeStore.darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: themeStore.darkMode ? '#f5f5f5' : '#111',
                    borderColor: primaryColor,
                    transition: 'all 0.3s ease'
                  }"
                />
              </div>

              <div class="form-group mt-4">
                <input
                  type="email"
                  v-model="formData.email"
                  placeholder="Email*"
                  required
                  class="form-input"
                  :style="{
                    backgroundColor: themeStore.darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: themeStore.darkMode ? '#f5f5f5' : '#111',
                    borderColor: primaryColor,
                    transition: 'all 0.3s ease'
                  }"
                />
              </div>

              <div class="form-group mt-4">
                <textarea
                  v-model="formData.message"
                  placeholder="Message / Message"
                  rows="5"
                  class="form-input"
                  :style="{
                    backgroundColor: themeStore.darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: themeStore.darkMode ? '#f5f5f5' : '#111',
                    borderColor: primaryColor,
                    transition: 'all 0.3s ease'
                  }"
                ></textarea>
              </div>

              <div class="form-group submit-group mt-4">
                <v-btn
                  type="submit"
                  class="submit-btn"
                  :disabled="isSubmitting"
                  :style="{
                    backgroundColor: primaryColor,
                    transition: 'all 0.3s ease'
                  }"
                  block
                  variant="elevated"
                >
                  <span v-if="isSubmitting">Sending...</span>
                  <span v-else>Send</span>
                </v-btn>
              </div>

              <div v-if="submitSuccess" class="success-message">
                <v-alert type="success" variant="tonal">
                  Thank you for your message! We will get back to you soon.
                </v-alert>
              </div>

              <div v-if="submitError" class="error-message">
                <v-alert type="error" variant="tonal">
                  There was an error sending your message. Please try again.
                </v-alert>
              </div>
            </form>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="decorative-text-bg">
      <div
        v-if="randomFont"
        class="decorative-font decorative-line1"
        :style="{ 
          fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily,
          opacity: '0.5',
          color: themeStore.darkMode ? '#fff' : '#000',
          transition: 'color 0.3s ease, opacity 0.3s ease'
        }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line2"
        :style="{ 
          fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily,
          opacity: '0.5',
          color: themeStore.darkMode ? '#fff' : '#000',
          transition: 'color 0.3s ease, opacity 0.3s ease'
        }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line3"
        :style="{ 
          fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily,
          opacity: '0.5',
          color: themeStore.darkMode ? '#fff' : '#000',
          transition: 'color 0.3s ease, opacity 0.3s ease'
        }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line4"
        :style="{ 
          fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily,
          opacity: '0.5',
          color: themeStore.darkMode ? '#fff' : '#000',
          transition: 'color 0.3s ease, opacity 0.3s ease'
        }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line5"
        :style="{ 
          fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily,
          opacity: '0.5',
          color: themeStore.darkMode ? '#fff' : '#000',
          transition: 'color 0.3s ease, opacity 0.3s ease'
        }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
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
  z-index: 1;
}

.contact-info {
  padding: 20px 0;
}

.section-title {
  font-size: 1.8rem;
  margin-bottom: 20px;
  font-weight: 600;
}

.contact-info p {
  font-size: 1.1rem;
  line-height: 1.6;
}

.contact-cta {
  font-size: 1.2rem;
  font-weight: 500;
}

.email-link {
  position: relative;
  text-decoration: none;
  font-weight: 700;
  margin-left: 5px;
}

.email-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  transform: scaleX(0);
  transform-origin: bottom right;
  transition: transform 0.3s ease;
}

.email-link:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

.donation-text {
  font-size: 1.1rem;
  line-height: 1.6;
  border-top: 1px solid;
  padding-top: 20px;
}

.donation-btn {
  display: block;
  margin-top: 15px;
  font-weight: 500;
  border-radius: 30px;
}

.donation-btn:hover {
  transform: translateY(-2px);
}

.contact-form-wrapper {
  border-radius: 16px;
  padding: 30px;
}

.form-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid;
  border-radius: 30px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
}

.form-input::placeholder {
  color: #999;
  opacity: 0.7;
}

textarea.form-input {
  min-height: 120px;
  resize: vertical;
}

.submit-btn {
  color: white;
  border: none;
  padding: 25px 60px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message,
.error-message {
  margin-top: 20px;
}

.decorative-text-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.decorative-font {
  position: absolute;
  right: 0;
  white-space: nowrap;
  animation: slideRightToLeft 60s linear infinite;
  text-shadow: none;
}

.decorative-line1 {
  top: 10%;
  font-size: 30rem;
  animation-duration: 80s;
}

.decorative-line2 {
  top: 30%;
  font-size: 30rem;
  animation-duration: 60s;
  animation-delay: -20s;
}

.decorative-line3 {
  top: 50%;
  font-size: 30rem;
  animation-duration: 70s;
  animation-delay: -40s;
}

.decorative-line4 {
  top: 70%;
  font-size: 30rem;
  animation-duration: 75s;
  animation-delay: -15s;
}

.decorative-line5 {
  top: 90%;
  font-size: 30rem;
  animation-duration: 65s;
  animation-delay: -30s;
}

@keyframes slideRightToLeft {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

@media (max-width: 959px) {
  .contact-info {
    margin-bottom: 40px;
  }

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

  .contact-form-wrapper {
    padding: 20px;
  }

  .form-input {
    padding: 12px 15px;
  }

  .submit-btn {
    padding: 12px 40px;
    width: 100%;
  }

  .decorative-font {
    font-size: 15rem;
  }
}

@media (max-width: 479px) {
  .section-title {
    font-size: 1.5rem;
  }

  .contact-info p {
    font-size: 1rem;
  }

  .decorative-font {
    font-size: 10rem;
  }
}
</style>
