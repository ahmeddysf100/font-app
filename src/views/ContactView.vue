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
  <div class="contact-view" :class="{ 'dark-theme': themeStore.darkMode }">
    <div class="page-header bg-black">
      <v-container>
        <div class="header-content">
          <h1 class="page-title">Contact Us</h1>
          <div class="title-underline"></div>
        </div>
      </v-container>
    </div>

    <v-container class="main-content">
      <v-row>
        <v-col cols="12" md="6">
          <div class="contact-info">
            <div class="info-section">
              <h2 class="section-title">Let's Connect</h2>

              <p class="mb-6">
                We're always on the lookout for new free Arabic fonts and new
                talents. If you'd like to publish with us or join our journey,
                we also offer consultation and feedback sessions for both
                students and professionals.
              </p>

              <p class="mb-6">
                We offer ad banner space in our main page, for ads that related
                to our community interests like workshops, submissions..etc.
              </p>

              <p class="contact-cta">
                Feel free to reach out:
                <a :href="'contact.kotype@gmail.com'" class="email-link">
                  <span class="email-text">contact.kotype@gmail.com</span>
                </a>
              </p>

              <p class="mt-8 donation-text">
                If you like our fonts and our activities, please consider
                donating. This will allow us to continue distributing new
                quality, free fonts and improving our existing catalogue.
                <v-btn
                  color="pink"
                  variant=" "
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
          <div class="contact-form-wrapper">
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <input
                  type="text"
                  v-model="formData.name"
                  placeholder="Name*"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <input
                  type="email"
                  v-model="formData.email"
                  placeholder="Email*"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <textarea
                  v-model="formData.message"
                  placeholder="Message / Message"
                  rows="5"
                  class="form-input"
                ></textarea>
              </div>

              <div class="form-group submit-group">
                <button
                  type="submit"
                  class="submit-btn"
                  :disabled="isSubmitting"
                >
                  <span v-if="isSubmitting">Sending...</span>
                  <span v-else>Send</span>
                </button>
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
        :style="{ fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line2"
        :style="{ fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line3"
        :style="{ fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line4"
        :style="{ fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
      <div
        v-if="randomFont"
        class="decorative-font decorative-line5"
        :style="{ fontFamily: randomFont.styles?.[0]?.fontFamily || randomFont.variable?.[0]?.fontFamily || randomFont.fontFamily }"
      >
        تواصل معنا تواصل معنا تواصل معنا تواصل معنا تواصل معنا
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-view {
  background-color: #fff;
  color: #111;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.contact-view.dark-theme {
  background-color: #0d0d0d;
  color: #f5f5f5;
}

.page-header {
  background-color: var(--section-bg-color, #f8f8f8);
  padding: 80px 0 40px;
  position: relative;
  box-shadow: var(--section-shadow, 0 5px 15px rgba(0, 0, 0, 0.03));
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  z-index: 1;
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
  z-index: 1;
}

.contact-info {
  padding: 20px 0;
}

.section-title {
  font-size: 1.8rem;
  color: var(--accent-color, #ff69b4);
  margin-bottom: 20px;
  font-weight: 600;
  transition: color 0.3s ease;
}

.contact-info p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color, #111);
  transition: color 0.3s ease;
}

.contact-cta {
  font-size: 1.2rem;
  font-weight: 500;
}

.email-link {
  position: relative;
  color: var(--accent-color, #ff69b4);
  text-decoration: none;
  font-weight: 700;
  margin-left: 5px;
  transition: color 0.3s ease;
}

.email-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--accent-color, #ff69b4);
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
  border-top: 1px solid var(--accent-light-color, rgba(255, 105, 180, 0.2));
  padding-top: 20px;
}

.donation-btn {
  display: block;
  margin-top: 15px;
  background-color: var(--accent-color, #ff69b4) !important;
  color: white !important;
  font-weight: 500;
  border-radius: 30px;
  transition: all 0.3s ease;
}

.donation-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px var(--accent-medium-color, rgba(255, 105, 180, 0.3));
}

/* Form Styles */
.contact-form-wrapper {
  background-color: var(--section-bg-color, #f8f8f8);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.contact-form {
  width: 100%;
}

.form-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid var(--accent-light-color, rgba(255, 105, 180, 0.2));
  border-radius: 30px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.9);
  color: #111;
  transition: all 0.3s ease;
}

.dark-theme .form-input {
  background-color: rgba(30, 30, 30, 0.9);
  color: #f5f5f5;
  border-color: var(--accent-light-color, rgba(255, 20, 147, 0.2));
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-color, #ff69b4);
  box-shadow: 0 0 0 3px var(--accent-light-color, rgba(255, 105, 180, 0.2));
}

.form-input::placeholder {
  color: #999;
  opacity: 0.7;
}

textarea.form-input {
  min-height: 120px;
  resize: vertical;
}

.submit-group {
  text-align: center;
}

.submit-btn {
  background-color: var(--accent-color, #ff69b4);
  color: white;
  border: none;
  padding: 15px 60px;
  font-size: 1.1rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px var(--accent-light-color, rgba(255, 105, 180, 0.3));
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px var(--accent-medium-color, rgba(255, 105, 180, 0.4));
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.success-message,
.error-message {
  margin-top: 20px;
}

/* Decorative Background */
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
  color: white;
  opacity: 0.035;
  animation: slideRightToLeft 60s linear infinite;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
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
