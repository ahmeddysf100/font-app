<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useThemeStore } from "../stores/theme.js";
import logoImage from "../assets/kotype.svg"; // Import the SVG logo
import fonts from "../../public/fonts.json";
import { useSittingsStore } from "../stores/sittings.js";
import { useRouter } from "vue-router";
const router = useRouter();
const themeStore = useThemeStore();
const isMobile = ref(false);
const settingsStore = useSittingsStore();
const primaryColor = computed(() => settingsStore.primaryColor);
// Get Arabic fonts only
const arabicFonts = computed(() => {
  return fonts.filter(
    (font) => font.name.startsWith("KO") || font.name.startsWith("Ko")
  );
});
console.log(arabicFonts.value);

// Currently displayed font in banner
const currentFontIndex = ref(0);
const currentFont = computed(
  () => arabicFonts.value[currentFontIndex.value] || {}
);

// Arabic quotes for the rotating text
const arabicQuotes = [
  {
    text: "وَمَا الحُبُّ إِلَّا لِلْحَبِيبِ الْأَوَّلِ",
    translation: "True love is only for the first beloved",
  },
  {
    text: "قَفَا نَبْكِ مِنْ ذِكْرَى حَبِيبٍ وَمَنْزِلِ",
    translation: "Let us stop and weep at the memory of a beloved and a place",
  },
  {
    text: "أَلَا لَيْتَ شِعْرِي هَلْ أَبِيتَنَّ لَيْلَةً",
    translation: "Oh, I wish I knew if I would spend a night",
  },
  {
    text: "وَإِنِّي لَتَعْرُونِي لِذِكْرَاكِ هِزَّةٌ",
    translation: "And I tremble at your memory",
  },
  {
    text: "إِذَا المَرْءُ لَمْ يَدْنَسْ مِنَ اللُؤْمِ عِرْضُهُ",
    translation: "When a person's honor is not stained by baseness",
  },
  {
    text: "وَمَا نَيْلُ المَطَالِبِ بِالتَّمَنِّي",
    translation: "Goals are not achieved by mere wishes",
  },
  {
    text: "العِلْمُ فِي الصِّغَرِ كَالنَّقْشِ عَلَى الحَجَرِ",
    translation: "Learning in youth is like engraving on stone",
  },
  {
    text: "مَنْ طَلَبَ العُلَا سَهِرَ اللَّيَالِي",
    translation: "Whoever seeks glory stays up at night",
  },
  {
    text: "الكِتَابُ خَيْرُ جَلِيسٍ",
    translation: "A book is the best companion",
  },
  {
    text: "لِكُلِّ مَقَامٍ مَقَالٌ",
    translation: "For every situation, there is an appropriate speech",
  },
  {
    text: "خَيْرُ الكَلَامِ مَا قَلَّ وَدَلَّ",
    translation: "The best speech is concise and meaningful",
  },
  {
    text: "الصَّبْرُ مِفْتَاحُ الفَرَجِ",
    translation: "Patience is the key to relief",
  },
  {
    text: "رُبَّ ضَارَّةٍ نَافِعَةٍ",
    translation: "Sometimes harm brings benefit",
  },
  {
    text: "مَنْ جَدَّ وَجَدَ",
    translation: "Whoever strives shall succeed",
  },
  {
    text: "العَقْلُ السَّلِيمُ فِي الجِسْمِ السَّلِيمِ",
    translation: "A sound mind in a sound body",
  },
  {
    text: "الوَقْتُ كَالسَّيْفِ إِنْ لَمْ تَقْطَعْهُ قَطَعَكَ",
    translation: "Time is like a sword: if you don't cut it, it cuts you",
  },
  {
    text: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ",
    translation: "The best of people are those most beneficial to others",
  },
  {
    text: "لَيْسَ الجَمَالُ بِأَثْوَابٍ تُزَيِّنُنَا",
    translation: "Beauty is not in the clothes that adorn us",
  },
  {
    text: "إِذَا تَمَّ العَقْلُ نَقَصَ الكَلَامُ",
    translation: "When wisdom is complete, speech becomes less",
  },
  {
    text: "لِسَانُكَ حِصَانُكَ إِنْ صُنْتَهُ صَانَكَ",
    translation:
      "Your tongue is your horse: if you take care of it, it takes care of you",
  },
  {
    text: "الحَقُّ أَبْلَجُ وَالبَاطِلُ لَجْلَجٌ",
    translation: "Truth is clear and falsehood stammers",
  },
  {
    text: "مَنْ سَارَ عَلَى الدَّرْبِ وَصَلَ",
    translation: "Whoever follows the path will reach the destination",
  },
  {
    text: "لَا تُؤَجِّلْ عَمَلَ اليَوْمِ إِلَى الغَدِ",
    translation: "Don't postpone today's work until tomorrow",
  },
  {
    text: "الأَدَبُ خَيْرٌ مِنَ الذَّهَبِ",
    translation: "Good manners are better than gold",
  },
  {
    text: "الجَارُ قَبْلَ الدَّارِ",
    translation: "The neighbor before the house",
  },
  {
    text: "رُبَّ أَخٍ لَكَ لَمْ تَلِدْهُ أُمُّكَ",
    translation: "Sometimes your brother is not from your mother",
  },
  {
    text: "الصِّدْقُ مُنْجِيٌ وَالكَذِبُ مُهْلِكٌ",
    translation: "Honesty saves and lying destroys",
  },
  {
    text: "الصَّدِيقُ وَقْتَ الضِّيقِ",
    translation: "A friend in need is a friend indeed",
  },
  {
    text: "الحِكْمَةُ ضَالَّةُ المُؤْمِنِ",
    translation: "Wisdom is the lost property of the believer",
  },
  {
    text: "خَيْرُ الأُمُورِ الوَسَطُ",
    translation: "The best of matters is the middle course",
  },
];

// Currently displayed quote
const currentQuoteIndex = ref(0);
const currentQuote = computed(() => arabicQuotes[currentQuoteIndex.value]);

// Change font and quote periodically
const changeDisplayedFont = () => {
  currentFontIndex.value =
    (currentFontIndex.value + 1) % arabicFonts.value.length;
  if (currentFontIndex.value === 0) {
    // Change quote when we cycle through all fonts
    currentQuoteIndex.value =
      (currentQuoteIndex.value + 1) % arabicQuotes.length;
  }
};

let fontInterval;

// Background colors -
const darkModeColors = [
  "#ff1493",
  "#9370db",
  "#00bfff",
  "#ff4500",
  "#20b2aa",
  "#ba55d3",
  "#8b008b",
  "#4b0082",
  "#800080",
  "#9932cc",
  "#8a2be2",
  "#9400d3",
  "#6a5acd",
  "#483d8b",
  "#7b68ee",
  "#0000cd",
  "#0000ff",
  "#4169e1",
  "#1e90ff",
  "#00008b",
  "#008080",
  "#2e8b57",
  "#006400",
  "#228b22",
  "#556b2f",
  "#8b4513",
  "#a0522d",
  "#b22222",
  "#dc143c",
  "#c71585",
];
// const darkModeColors = ['#0d0d0d', '#1a1a1a', '#111111', '#151515', '#1e1e1e', '#0a0a0a'];
const currentBgIndex = ref(0);

// Select color based on theme
const currentBgColor = computed(() => {
  return darkModeColors[currentBgIndex.value];
});

// Check screen size on mount and when window resizes
const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

// Scroll reveal functionality (moved from script tag to Vue lifecycle)
const initScrollReveal = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-reveal-active");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  document.querySelectorAll(".scroll-reveal").forEach((section) => {
    observer.observe(section);
  });

  return observer;
};

let scrollObserver;

// Update divider color based on theme
const updateDividerColor = () => {
  const isDark = themeStore.darkMode;
  document.documentElement.style.setProperty("--bg-color", primaryColor.value);
  document.documentElement.style.setProperty(
    "--accent-color",
    primaryColor.value
  );
  document.documentElement.style.setProperty(
    "--accent-light-color",
    primaryColor.value
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
    "--footer-bg-color",
    isDark ? "#1a1a1a" : "#f0f0f0"
  );
  document.documentElement.style.setProperty(
    "--text-color",
    isDark ? "#f5f5f5" : "#111"
  );
  document.documentElement.style.setProperty(
    "--section-shadow",
    isDark ? "0 5px 15px rgba(0,0,0,0.2)" : "0 5px 15px rgba(0,0,0,0.03)"
  );
};

// Call on component mount
onMounted(async () => {
  checkScreenSize();
  window.addEventListener("resize", checkScreenSize);

  // Change font every 3 seconds
  fontInterval = setInterval(() => {
    changeDisplayedFont();
    // Change background color every 2 font changes
    if (currentFontIndex.value % 2 === 0) {
      currentBgIndex.value = (currentBgIndex.value + 1) % darkModeColors.length;
    }
  }, 3000);

  // Wait for the DOM to be fully updated
  await nextTick();

  // Initialize scroll reveal
  scrollObserver = initScrollReveal();

  // Set initial divider color
  // updateDividerColor();
});

// Remove event listener on unmount
onUnmounted(() => {
  window.removeEventListener("resize", checkScreenSize);
  clearInterval(fontInterval);

  // Disconnect the intersection observer
  if (scrollObserver) {
    scrollObserver.disconnect();
  }
});

// Banner styling based on current font and color
const bannerStyle = computed(() => {
  return {
    color: currentBgColor.value,
    transition: "background-color 1.5s ease",
  };
});

// Quote font styling based on current font
const quoteFontStyle = computed(() => {
  if (!currentFont.value || !currentFont.value.fontFamily) {
    return { fontFamily: "Arial" };
  }
  console.log(currentFont.value);
  let fontStyle = {
    fontFamily:
      currentFont.value.styles[0].fontFamily ||
      currentFont.value.variable?.[0].fontFamily ||
      currentFont.value.fontFamily,
    fontWeight: 400,
    direction: "rtl",
    color: currentBgColor.value,
    transition: "color 1.5s ease",
  };

  // If the font has styles, use the heaviest weight
  if (currentFont.value.styles && currentFont.value.styles.length > 0) {
    const weights = currentFont.value.styles
      .map((s) => s.weight)
      .filter((w) => w)
      .sort((a, b) => b - a);

    if (weights.length > 0) {
      fontStyle.fontWeight = weights[0];
    }
  }

  return fontStyle;
});

// Animate in/out animations for the quotes
const isQuoteVisible = ref(true);

// Watch for changes in quote to add animation
watch([currentQuoteIndex], () => {
  isQuoteVisible.value = false;
  setTimeout(() => {
    isQuoteVisible.value = true;
  }, 300);
});

// Watch for changes in font to highlight the font name
const isFontChanging = ref(false);
watch([currentFontIndex], () => {
  isFontChanging.value = true;
  setTimeout(() => {
    isFontChanging.value = false;
  }, 700);
});

// Watch for theme changes to update divider color
watch(
  () => themeStore.darkMode,
  () => {
    // updateDividerColor();
  }
);
</script>

<template>
  <div
    class="about-view"
    :style="{
      color: themeStore.darkMode ? '#fff' : '#000',
      transition: 'color 0.3s ease',
    }"
  >
    <!-- Banner Image -->
    <div
      class="banner-image-container"
      :class="{
        'bg-black': themeStore.darkMode,
        'bg-card': !themeStore.darkMode,
      }"
      :style="{
        transition: 'background-color 0.3s ease',
      }"
    >
      <div class="overlay"></div>
      <div
        class="font-info"
        :style="{
          color: themeStore.darkMode ? 'white' : 'black',
          transition: 'color 0.3s ease',
        }"
      >
        <v-chip
          :class="['current-font-chip bg-primary', { pulse: isFontChanging }]"
          variant="elevated"
          size="large"
        >
          {{ currentFont.name || "KO-TYPE" }}
        </v-chip>
      </div>

      <div class="banner-text">
        <transition name="fade">
          <div v-if="isQuoteVisible" class="quote-container">
            <h1 class="arabic-quote" :style="quoteFontStyle">
              {{ currentQuote.text }}
            </h1>
            <p class="quote-translation" :style="bannerStyle">
              {{ currentQuote.translation }}
            </p>
          </div>
        </transition>
      </div>

      <div class="font-indicators">
        <div
          v-for="(font, index) in arabicFonts"
          :key="font.id"
          class="font-indicator "
          :class="{ active: index === currentFontIndex, 'bg-primary': index === currentFontIndex, 'bg-black': themeStore.darkMode, 'bg-white': themeStore.darkMode }"
          
          @click="currentFontIndex = index"
        ></div>
      </div>
    </div>

    <!-- Header Section -->
    <section
      class="header-section"
      :class="{
        'bg-black': themeStore.darkMode,
        'bg-card': !themeStore.darkMode,
      }"
      :style="{
        color: themeStore.darkMode ? 'white' : 'black',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }"
    >
      <v-container>
        <v-row align="center" class="header-row">
          <v-col
            cols="12"
            md="6"
            class="d-flex align-center justify-center logo-col"
          >
            <div class="logo-container">
              <img
                :src="logoImage"
                alt="Kotype Logo"
                class="kotype-logo"
                width="300px"
              />
            </div>
          </v-col>
          <v-col cols="12" md="6" class="d-flex flex-column justify-center">
            <div class="section-heading">
              <div class="section-title-container">
                <h2
                  class="section-title"
                  :style="{
                    color: themeStore.darkMode ? '#fff' : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  What Is Kotype!
                </h2>
                <div class="title-underline bg-primary"></div>
              </div>
              <div
                class="section-text"
                :style="{
                  color: themeStore.darkMode
                    ? 'rgba(255, 255, 255, 0.9)'
                    : '#000',
                  transition: 'color 0.3s ease',
                }"
              >
                <p
                  :class="{
                    'text-white !important': themeStore.darkMode,
                    'text-black !important': !themeStore.darkMode,
                  }"
                >
                  This is KO-type. The move you probably anticipated, that will
                  knock all free font-haters out of their chairs. That was a
                  joke. Kotype is a community dedicated to the love of Arabic
                  fonts. Whether it's appreciation, creation, or simply usage,
                  we are all connected by the love of Arabic Fonts, just like
                  our love for the Arabic language.
                </p>
              </div>
            </div>
          </v-col>
        </v-row>
        <div class=" divider-fancy text-primary" style="visibility: visible; display: block;"></div>
      </v-container>
    </section>



    <!-- Content Section -->
    <section
      :class="{
        'bg-black': themeStore.darkMode,
        'bg-card': !themeStore.darkMode,
      }"
      :style="{
        color: themeStore.darkMode ? 'white' : 'black',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="section mb-5 scroll-reveal">
              <div class="section-heading">
                <div class="section-title-container">
                  <h2
                    class="section-title"
                    :style="{
                      color: themeStore.darkMode ? '#fff' : '#000',
                      transition: 'color 0.3s ease',
                    }"
                  >
                    Our Mission
                  </h2>
                  <div class="title-underline bg-primary"></div>
                </div>
                <div
                  class="section-text"
                  :style="{
                    color: themeStore.darkMode
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  <div class="quote-block bg-primary">
                    <v-icon  class="quote-icon text-white"
                      >mdi-format-quote-open</v-icon
                    >
                    <p class="mission-quote ">
                      <em
                        >Give a man a fish, and you feed him for a day; teach a
                        man to fish, and you feed him for a lifetime.</em
                      >
                    </p>
                    <v-icon  class="quote-icon quote-close text-white"
                      >mdi-format-quote-close</v-icon
                    >
                  </div>
                  <p>
                    At Kotype, we hand out rods so you can go happily fishing.
                    We will do our best to teach the community how fonts are
                    created and share tips of the process and results.
                  </p>
                </div>
              </div>
            </div>

            <div class="section mb-5 scroll-reveal">
              <div class="section-heading">
                <div class="section-title-container">
                  <h2
                    class="section-title"
                    :style="{
                      color: themeStore.darkMode ? '#fff' : '#000',
                      transition: 'color 0.3s ease',
                    }"
                  >
                    Our Vision
                  </h2>
                  <div class="title-underline bg-primary"></div>
                </div>
                <div
                  class="section-text"
                  :style="{
                    color: themeStore.darkMode
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  <p>
                    The limited resources and repeated Arabic font designs are
                    killing this saturated market. We need more hands to work,
                    more minds unafraid to explore, to push those limits and
                    create more resources for the next generation, hopefully.
                  </p>
                </div>
              </div>
            </div>

            <div class="section mb-5 scroll-reveal">
              <div class="section-heading">
                <div class="section-title-container">
                  <h2
                    class="section-title"
                    :style="{
                      color: themeStore.darkMode ? '#fff' : '#000',
                      transition: 'color 0.3s ease',
                    }"
                  >
                    Honestly
                  </h2>
                  <div class="title-underline bg-primary"></div>
                </div>
                <div
                  class="section-text"
                  :style="{
                    color: themeStore.darkMode
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  <p>
                    We are done with pirated libraries continue to steal the
                    efforts of designers, exploiting creations that may have
                    taken years of work, research, and development. This affects
                    many designers' determination to create or forces them to
                    only design for clients.
                  </p>
                  <p>
                    We aren't making any promises that we are going to create a
                    utopia. Instead, we are trying to highlight the work of
                    talented designers, share the expert process, and create a
                    positive vibe around the Arabic design community.
                  </p>
                </div>
              </div>
            </div>

            <div class="my-8 divider-fancy text-primary" style="visibility: visible; display: block;"></div>

            <div class="section mb-5 scroll-reveal">
              <div class="section-heading">
                <div class="section-title-container">
                  <h2
                    class="section-title"
                    :style="{
                      color: themeStore.darkMode ? '#fff' : '#000',
                      transition: 'color 0.3s ease',
                    }"
                  >
                    Font License
                  </h2>
                  <div class="title-underline bg-primary"></div>
                </div>
                <div
                  class="section-text"
                  :style="{
                    color: themeStore.darkMode
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  <p>
                    All fonts available on our platform are copyrighted and
                    owned by the respective designers who have submitted them.
                    By submitting fonts, the designer confirms that they are the
                    original creator and hold the necessary rights to distribute
                    the font.
                  </p>
                  <p>
                    Any inquiries regarding modifications or alterations to a
                    font should be directed to the designer of the font. We do
                    not facilitate or mediate requests for modified versions of
                    any fonts.
                  </p>

                  <v-list class="license-list transparent">
                    <v-list-item
                      v-for="(item, i) in 5"
                      :key="i"
                      class="px-0 license-item"
                    >
                      <template v-slot:prepend>
                        <div
                          class="license-icon-container "
                        >
                          <v-icon class="text-primary" size="25"
                            >mdi-checkbox-marked-circle</v-icon
                          >
                        </div>
                      </template>
                      <v-list-item-title>
                        <span v-if="i === 0"
                          >Kotype Arabic fonts are free to use in personal and
                          commercial works.</span
                        >
                        <span v-else-if="i === 1"
                          >Kotype fonts can be used on any medium: poster, logo,
                          magazine, website, app, t-shirt, music video, bike
                          trailer… Remember to credit the name of the type
                          designer or the foundry whenever you use the
                          fonts.</span
                        >
                        <span v-else-if="i === 2"
                          >Redistribution of the fonts without written
                          permission is not allowed.</span
                        >
                        <span v-else-if="i === 3"
                          >Modification of the font file without written
                          permission is not allowed.</span
                        >
                        <span v-else-if="i === 4"
                          >Kotype Free Arabic fonts may not be added to or used
                          within any online or offline design tools or apps
                          (e.g., Canva, photoshop) that allow users to create,
                          edit, or distribute images using the fonts without
                          proper licensing from Kotype or the designer of the
                          typeface.</span
                        >
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </div>
              </div>
            </div>

            <div class="section mb-5 scroll-reveal">
              <div class="section-heading">
                <div class="section-title-container">
                  <h2
                    class="section-title"
                    :style="{
                      color: themeStore.darkMode ? '#fff' : '#000',
                      transition: 'color 0.3s ease',
                    }"
                  >
                    Support Us
                  </h2>
                  <div class="title-underline bg-primary"></div>
                </div>
                <div
                  class="section-text"
                  :style="{
                    color: themeStore.darkMode
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  <p>
                    If you like our Free fonts and our activities, please
                    consider donating. This will allow us to continue
                    distributing new quality, free fonts and improving our
                    existing catalogue. Visit our donation page.
                  </p>
                </div>
              </div>
            </div>

            <!-- New Dedicated Donate Section -->
            <div class="donate-section scroll-reveal">
              <div class="donate-container">
                <div class="donate-content">
                  <v-icon size="48" class="donate-icon text-primary"
                    >mdi-heart</v-icon
                  >
                  <h3 class="donate-title">Support Kotype</h3>
                  <p class="donate-text">
                    Help us continue creating and sharing beautiful Arabic fonts
                  </p>
                  <v-btn
                    color="primary"
                    variant="elevated"
                    size="x-large"
                    class="donate-btn"
                    href="https://ko-fi.com/kotype"
                    target="_blank"
                  >
                    <v-icon start class="support-icon">mdi-coffee</v-icon>
                    Buy us a coffee
                  </v-btn>
                </div>
              </div>
            </div>

            <div class="section mb-5 scroll-reveal">
              <div class="section-heading">
                <div class="section-title-container">
                  <h2
                    class="section-title"
                    :style="{
                      color: themeStore.darkMode ? '#fff' : '#000',
                      transition: 'color 0.3s ease',
                    }"
                  >
                    About the Team
                  </h2>
                  <div class="title-underline bg-primary"></div>
                </div>
                <div
                  class="section-text"
                  :style="{
                    color: themeStore.darkMode
                      ? 'rgba(255, 255, 255, 0.9)'
                      : '#000',
                    transition: 'color 0.3s ease',
                  }"
                >
                  <p>
                    We are a collective from different countries, united by a
                    common goal: to share our knowledge of type design and
                    typography by creating free fonts that highlight the process
                    of font creation. These fonts are provided as working
                    product examples, with the design process documented and
                    shared as educational materials.
                  </p>

                  <div class="team-highlight">
                    <p>
                      The project is currently managed by kotype team, with
                      special thanks to everyone who embraced the idea and
                      worked tirelessly to bring it to life, especially:
                    </p>
                    <ul class="team-members">
                      <li>
                        <v-btn
                          href="https://www.heyporterposter.com/"
                          target="_blank"
                          variant="outlined"
                          class="team-member-btn"
                          color="primary"
                          elevation="0"
                          rounded
                        >
                          <v-icon start size="small">mdi-account</v-icon>
                          Hey Porter! (Tawfiq Dawi)
                        </v-btn>
                      </li>
                      <li>
                        <v-btn
                          href="http://abdomohamed.com/"
                          target="_blank"
                          variant="outlined"
                          class="team-member-btn"
                          color="primary"
                          elevation="0"
                          rounded
                        >
                          <v-icon start size="small">mdi-account</v-icon>
                          Abdo Mohamed
                        </v-btn>
                      </li>
                      <li>
                        <v-btn
                          href="https://www.instagram.com/ibrohamdi/"
                          target="_blank"
                          variant="outlined"
                          class="team-member-btn"
                          color="primary"
                          elevation="0"
                          rounded
                        >
                          <v-icon start size="small">mdi-instagram</v-icon>
                          Ibrahim Hamdi
                        </v-btn>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Footer with font credits -->
    <div
      class="footer-section"
      :class="{
        'dark-footer': themeStore.darkMode,
        'bg-black': themeStore.darkMode,
        'bg-card': !themeStore.darkMode,
      }"
    >
      <v-container>
        <div class="font-credits">
          <p>Explore our Arabic fonts:</p>
          <div class="font-tags">
            <v-chip
              v-for="font in arabicFonts"
              :key="font.id"
              variant="outlined"
              class="font-tag"
              color="primary"
              @click="router.push(`/fonts/${font.id}`)"
            >
              {{ font.name }}
            </v-chip>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.about-view {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.banner-image-container,
.header-section,
.content-section {
  transition: background-color 0.3s ease, color 0.3s ease;
}

.section-title,
.section-text {
  transition: color 0.3s ease;
}

.bg-card {
  background-color: white !important;
}

.dark-theme {
  background-color: #000;
  color: #fff;
}

.dark-theme .section-title {
  color: #fff;
}

.dark-theme .section-text {
  color: rgba(255, 255, 255, 0.9);
}

.dark-theme .quote-translation {
  color: rgba(255, 255, 255, 0.9);
}

.dark-theme .mission-quote {
  color: rgba(255, 255, 255, 0.95);
}





 

.dark-theme .font-credits {
  color: rgba(255, 255, 255, 0.9);
}







.section-text,
.quote-translation,
.mission-quote,
.license-list :deep(.v-list-item-title),
.team-members li a,
.font-credits,
.donate-text {
  transition: color 0.3s ease;
}

.quote-block,
.team-highlight,
.team-members li {
  transition: background-color 0.3s ease;
}

/* Banner Image */
.banner-image-container {
  position: relative;
  height: 500px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.banner-text {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.font-info {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 3;
}

.current-font-chip {
  color: #111 !important;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.pulse {
  animation: pulse-animation 0.7s ease-in-out;
}

@keyframes pulse-animation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.quote-container {
  max-width: 90%;
  padding: 20px;
}

.arabic-quote {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.quote-translation {
  font-size: 1.5rem;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
  font-weight: 300;
  font-style: italic;
}

.font-indicators {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
  z-index: 3;
}

.font-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(69, 64, 64, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.font-indicator.active {
    transform: scale(1.2);
}

/* Header Section - IMPROVED */
.header-section {
  padding: 80px 0;
  background-color: var(--section-bg-color, #f8f8f8);
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.logo-col {
  min-height: 180px;
}

.logo-container {
  position: relative;
  display: inline-block;
}

.kotype-logo {
  max-width: 300px;
  height: auto;
  position: relative;
  z-index: 2;
  transition: all 0.5s ease;
}

.kotype-logo:hover {
  transform: scale(1.05);
}

.logo-flare {
  position: absolute;
  top: -20%;
  left: -20%;
  width: 140%;
  height: 140%;
  background: radial-gradient(
    ellipse at center,
    var(--accent-light-color, rgba(255, 105, 180, 0.2)) 0%,
    rgba(255, 105, 180, 0) 70%
  );
  z-index: 1;
  border-radius: 50%;
  opacity: 0.7;
  animation: rotate 15s infinite linear;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Content Section - IMPROVED */
.content-section {
  position: relative;
  z-index: 1;
}

.content-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 120px;
  
  z-index: -1;
  pointer-events: none;
  transition: background 0.3s ease;
}

.section {
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
  position: relative;
}

.section.scroll-reveal-active {
  opacity: 1;
  transform: translateY(0);
}

.section-heading {
  margin-bottom: 30px;
}

.section-title-container {
  position: relative;
  display: inline-block;
  margin-bottom: 20px;
}

.section-title {
  display: inline-block;
  color: white;
  padding: 10px 25px;
  border-radius: 30px;
  font-size: 1.6rem;
  margin-bottom: 5px;
  position: relative;
  @apply bg-primary;
  z-index: 2;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.title-underline {
  height: 4px;
  background-color: var(--accent-color, v-bind(primaryColor));
  width: 50%;
  position: relative;
  left: 25%;
  border-radius: 2px;
  margin-top: -2px;
  opacity: 0.6;
  transition: background-color 0.3s ease;
}

.section-text {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--text-color, #111);
  transition: color 0.3s ease;
}

.section-text p {
  margin-bottom: 1.2rem;
}

.quote-block {
  background-color: var(--accent-light-color, rgba(255, 105, 180, 0.05));
   padding: 20px;
  margin: 20px 0;
  position: relative;
  border-radius: 9px;
  transition: background-color 0.3s ease, border-color 0.3s ease,
    box-shadow 0.3s ease;
}

.mission-quote {
  font-size: 1.3rem;
  line-height: 1.5;
  margin: 0;
  padding: 10px 40px;
  text-align: center;
}

.quote-icon {
  position: absolute;
  top: 15px;
  left: 15px;
  opacity: 0.6;
   transition: color 0.3s ease;
}

.quote-close {
  top: auto;
  left: auto;
  right: 15px;
  bottom: 15px;
}

.license-list {
  padding-left: 0;
  margin-top: 20px;
}

.license-item {
  margin-bottom: 10px;
  transition: background-color 0.3s ease;
  border-radius: 8px;
}

/* .license-item:hover {
  background-color: var(
    --accent-light-color,
    rgba(255, 105, 180, 0.05)
  ) !important;
} */

.license-icon-container {

  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  transition: background-color 0.3s ease;
}

.license-list :deep(.v-list-item-title) {
  white-space: normal;
  line-height: 1.6;
  transition: color 0.3s ease;
}

.transparent {
  background-color: transparent !important;
}

.divider-fancy {
  position: relative;
  height: 10px;
  
  overflow: visible;
  margin: 60px 0;
  transition: background 0.3s ease;
}

.divider-fancy::after {
  content: "❖";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
   padding: 0 15px;
   font-size: 20px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.support-btn {
  transition: all 0.3s ease;
  background-color: var(--accent-color, v-bind(primaryColor)) !important;
  color: white !important;
}

.support-btn:hover {
  transform: translateY(-2px);
}

.support-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.team-highlight {
  border-radius: 12px;
  padding: 20px;
  margin-top: 20px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.team-members {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
}

.team-members li {
  padding: 8px 15px;
  border-radius: 20px;
  display: inline-block;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
}

.team-members li a {
  color: var(--text-color, #111);
  text-decoration: none;
  transition: color 0.3s ease;
}

.team-members li:hover {
  transform: translateY(-2px);
}

.footer-section {
  background-color: var(--footer-bg-color, #f0f0f0);
  padding: 40px 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.dark-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.font-credits {
  text-align: center;
  color: var(--text-color, #111);
  transition: color 0.3s ease;
}

.font-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
}

.font-tag {
  transition: all 0.3s ease;
  cursor: pointer;
  
}

.font-tag:hover {
  /* background-color: var(--accent-light-color, rgba(255, 105, 180, 0.1)); */
  transform: translateY(-2px);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 767px) {
  .banner-image-container {
    height: 400px;
  }

  .arabic-quote {
    font-size: 2.5rem;
  }

  .quote-translation {
    font-size: 1.2rem;
  }

  .header-section {
    padding: 40px 0;
  }

  .header-row {
    min-height: auto;
  }

  .logo-col {
    min-height: 150px;
    margin-bottom: 20px;
  }

 

  .section-title {
    font-size: 1.3rem;
    padding: 8px 20px;
  }

  .section-text {
    font-size: 1rem;
  }

  .kotype-logo {
    max-width: 200px;
  }

  .mission-quote {
    font-size: 1.1rem;
    padding: 5px 30px;
  }

  .team-members {
    flex-direction: column;
    gap: 10px;
  }

  .font-tags {
    gap: 8px;
  }

  .divider-fancy {
    margin: 40px 0;
  }
}

@media (max-width: 480px) {
  .banner-image-container {
    height: 350px;
  }

  .arabic-quote {
    font-size: 2rem;
  }

  .quote-translation {
    font-size: 1rem;
  }

  .font-info {
    top: 10px;
    left: 10px;
  }

  .current-font-chip {
    font-size: 0.8rem !important;
    height: auto !important;
    padding: 4px 8px !important;
  }
}

.donate-section {
  margin: 60px 0;
  padding: 40px 0;
 
  border-radius: 20px;
  transition: all 0.3s ease;
}

.donate-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.donate-content {
  text-align: center;
  padding: 20px;
}

.donate-icon {
  margin-bottom: 20px;
  animation: float 3s ease-in-out infinite;
}

.donate-title {
  font-size: 2rem;
  margin-bottom: 15px;
  font-weight: 600;
}

.donate-text {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.donate-btn {
  padding: 15px 40px !important;
  font-size: 1.1rem !important;
  letter-spacing: 0.5px !important;
  transition: all 0.3s ease !important;
}

.donate-btn:hover {
  transform: translateY(-3px);
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

@media (max-width: 767px) {
  .donate-section {
    margin: 40px 0;
    padding: 30px 0;
  }

  .donate-title {
    font-size: 1.6rem;
  }

  .donate-text {
    font-size: 1.1rem;
  }

  .donate-btn {
    padding: 12px 30px !important;
    font-size: 1rem !important;
  }
}
</style>
