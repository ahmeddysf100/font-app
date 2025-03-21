import { useFontStore } from "../stores/fonts";

// Import all font files
// KOAynama
import KOAynamaSharp from "../assets/fonts/KOAynama/KOAynama-Sharp.ttf";
import KOAynamaCurved from "../assets/fonts/KOAynama/KOAynama-Curved.ttf";

// KoShareb
import KoSharebDisplay from "../assets/fonts/KoShareb/TTF/KoShareb-Display.ttf";

// Ko_Banzeen
import KoBanzeenNormal from "../assets/fonts/Ko_Banzeen/Ko_Banzeen-Normal.otf";
import KoBanzeenSlantedL from "../assets/fonts/Ko_Banzeen/Ko_Banzeen-SlantedL.otf";
import KoBanzeenSlantedR from "../assets/fonts/Ko_Banzeen/Ko_Banzeen-SlantedR.otf";

// KoDongol
import KoDongolRegular from "../assets/fonts/KoDongol/KoDongol-Regular.otf";

// KOLemaza
import KOLemazaBlack from "../assets/fonts/KOLemaza/KOLemaza-Black.otf";
import KOLemazaBold from "../assets/fonts/KOLemaza/KOLemaza-Bold.otf";
import KOLemazaExtraBold from "../assets/fonts/KOLemaza/KOLemaza-ExtraBold.otf";
import KOLemazaMedium from "../assets/fonts/KOLemaza/KOLemaza-Medium.otf";
import KOLemazaRegular from "../assets/fonts/KOLemaza/KOLemaza-Regular.otf";
import KOLemazaSemiBold from "../assets/fonts/KOLemaza/KOLemaza-SemiBold.otf";

// KoGaliModern
import KoGaliModernBlack from "../assets/fonts/KoGaliModern/KoGaliModern-Black.otf";
import KoGaliModernBold from "../assets/fonts/KoGaliModern/KoGaliModern-Bold.otf";
import KoGaliModernExtraBold from "../assets/fonts/KoGaliModern/KoGaliModern-ExtraBold.otf";
import KoGaliModernMedium from "../assets/fonts/KoGaliModern/KoGaliModern-Medium.otf";
import KoGaliModernSemiBold from "../assets/fonts/KoGaliModern/KoGaliModern-SemiBold.otf";
import KoGaliModernLight from "../assets/fonts/KoGaliModern/KoGaliModern-Light.otf";
import KoGaliModernExtraLight from "../assets/fonts/KoGaliModern/KoGaliModern-ExtraLight.otf";
import KoGaliModernHeavy from "../assets/fonts/KoGaliModern/KoGaliModern-Heavy.otf";
import KoGaliModernUltraBold from "../assets/fonts/KoGaliModern/KoGaliModern-Regular.otf";
import KoGaliModernUltraLight from "../assets/fonts/KoGaliModern/KoGaliModern-UltraLight.otf";

// KoKhalaya
import KoKhalaya55 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-5-5.otf";
import KoKhalaya56 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-5-6.otf";
import KoKhalaya57 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-5-7.otf";
import KoKhalaya58 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-5-8.otf";
import KoKhalaya59 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-5-9.otf";
import KoKhalaya65 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-6-5.otf";
import KoKhalaya66 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-6-6.otf";
import KoKhalaya67 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-6-7.otf";
import KoKhalaya68 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-6-8.otf";
import KoKhalaya69 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-6-9.otf";
import KoKhalaya75 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-7-5.otf";
import KoKhalaya76 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-7-6.otf";
import KoKhalaya77 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-7-7.otf";
import KoKhalaya78 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-7-8.otf";
import KoKhalaya79 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-7-9.otf";
import KoKhalaya85 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-8-5.otf";
import KoKhalaya86 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-8-6.otf";
import KoKhalaya87 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-8-7.otf";
import KoKhalaya88 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-8-8.otf";
import KoKhalaya89 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-8-9.otf";
import KoKhalaya95 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-9-5.otf";
import KoKhalaya96 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-9-6.otf";
import KoKhalaya97 from "../assets/fonts/KoKhalaya/weights/KoKhalaya-9-7.otf";
import KoKhalayaVF from "../assets/fonts/KoKhalaya/variable/KoKhalayaVF.ttf";

// KORubbama
import KORubbamaBlack from "../assets/fonts/KORubbama/KORubbama-Black.otf";
import KORubbamaBlackExpanded from "../assets/fonts/KORubbama/KORubbamaExpanded-BlackExpanded.otf";

// Satoshi
import SatoshiBlack2 from "../assets/fonts/Satoshi/Satoshi-Black.woff2";
import SatoshiBlack from "../assets/fonts/Satoshi/Satoshi-Black.woff";
import SatoshiBlackItalic2 from "../assets/fonts/Satoshi/Satoshi-BlackItalic.woff2";
import SatoshiBlackItalic from "../assets/fonts/Satoshi/Satoshi-BlackItalic.woff";
import SatoshiBold2 from "../assets/fonts/Satoshi/Satoshi-Bold.woff2";
import SatoshiBold from "../assets/fonts/Satoshi/Satoshi-Bold.woff";
import SatoshiBoldItalic2 from "../assets/fonts/Satoshi/Satoshi-BoldItalic.woff2";
import SatoshiBoldItalic from "../assets/fonts/Satoshi/Satoshi-BoldItalic.woff";
import SatoshiItalic2 from "../assets/fonts/Satoshi/Satoshi-Italic.woff2";
import SatoshiItalic from "../assets/fonts/Satoshi/Satoshi-Italic.woff";
import SatoshiLight2 from "../assets/fonts/Satoshi/Satoshi-Light.woff2";
import SatoshiLight from "../assets/fonts/Satoshi/Satoshi-Light.woff";
import SatoshiMedium2 from "../assets/fonts/Satoshi/Satoshi-Medium.woff2";
import SatoshiMedium from "../assets/fonts/Satoshi/Satoshi-Medium.woff";
import SatoshiLightItalic2 from "../assets/fonts/Satoshi/Satoshi-LightItalic.woff2";
import SatoshiLightItalic from "../assets/fonts/Satoshi/Satoshi-LightItalic.woff";
import SatoshiMediumItalic2 from "../assets/fonts/Satoshi/Satoshi-MediumItalic.woff2";
import SatoshiMediumItalic from "../assets/fonts/Satoshi/Satoshi-MediumItalic.woff";
import SatoshiRegular2 from "../assets/fonts/Satoshi/Satoshi-Regular.woff2";
import SatoshiRegular from "../assets/fonts/Satoshi/Satoshi-Regular.woff";
import SatoshiVariable2 from "../assets/fonts/Satoshi/Satoshi-Variable.woff2";
import SatoshiVariable from "../assets/fonts/Satoshi/Satoshi-Variable.woff";
import SatoshiVariableItalic2 from "../assets/fonts/Satoshi/Satoshi-VariableItalic.woff2";
import SatoshiVariableItalic from "../assets/fonts/Satoshi/Satoshi-VariableItalic.woff";

// Combined fonts configuration
export const fonts = [
  {
    id: 1,
    name: "Ko_Banzeen",
    fontFamily: "Ko_Banzeen",
    category: "Display",
    styles: [
      { file: KoBanzeenNormal, name: "Normal", style: "normal", weight: 400 },
      { file: KoBanzeenSlantedL, name: "Slanted Left", style: "italic", weight: 400, variationSettings: "'slnt' -15" },
      { file: KoBanzeenSlantedR, name: "Slanted Right", style: "oblique", weight: 400, variationSettings: "'slnt' 15" }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 3
  },
  {
    id: 2,
    name: "KOAynama",
    category: "Sans-serif",
    styles: [
      { file: KOAynamaSharp, name: "Sharp", style: "normal", weight: 400, fontFamily: "KOAynama-Sharp" },
      { file: KOAynamaCurved, name: "Curved", style: "normal", weight: 400, fontFamily: "KOAynama-Curved" }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 2
  },
  {
    id: 3,
    name: "KoDongol",
    fontFamily: "KoDongol",
    category: "Serif",
    styles: [
      { file: KoDongolRegular, name: "Regular", style: "normal", weight: 400 }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1
  },
  {
    id: 4,
    name: "KoGaliModern",
    fontFamily: "KoGaliModern",
    category: "Mono",
    styles: [
      { file: KoGaliModernUltraLight, name: "UltraLight", weight: 100 },
      { file: KoGaliModernExtraLight, name: "ExtraLight", weight: 200 },
      { file: KoGaliModernLight, name: "Light", weight: 300 },
      { file: KoGaliModernUltraBold, name: "Regular", weight: 400 },
      { file: KoGaliModernMedium, name: "Medium", weight: 500 },
      { file: KoGaliModernSemiBold, name: "SemiBold", weight: 600 },
      { file: KoGaliModernBold, name: "Bold", weight: 700 },
      { file: KoGaliModernExtraBold, name: "ExtraBold", weight: 800 },
      { file: KoGaliModernBlack, name: "Black", weight: 900 },
      { file: KoGaliModernHeavy, name: "Heavy", weight: 900 }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 10
  },
  {
    id: 5,
    name: "KoKhalaya",
    fontFamily: "KoKhalaya",
    category: "Sans-serif",
    styles: [
      { file: KoKhalaya55, name: "55", weight: 600 },
      { file: KoKhalaya56, name: "56", weight: 600 },
      { file: KoKhalaya57, name: "57", weight: 600 },
      { file: KoKhalaya58, name: "58", weight: 600 },
      { file: KoKhalaya59, name: "59", weight: 600 },
      { file: KoKhalaya65, name: "65", weight: 700 },
      { file: KoKhalaya66, name: "66", weight: 700 },
      { file: KoKhalaya67, name: "67", weight: 700 },
      { file: KoKhalaya68, name: "68", weight: 700 },
      { file: KoKhalaya69, name: "69", weight: 700 },
      { file: KoKhalaya75, name: "75", weight: 800 },
      { file: KoKhalaya76, name: "76", weight: 800 },
      { file: KoKhalaya77, name: "77", weight: 800 },
      { file: KoKhalaya78, name: "78", weight: 800 },
      { file: KoKhalaya79, name: "79", weight: 800 },
      { file: KoKhalaya85, name: "85", weight: 900 },
      { file: KoKhalaya86, name: "86", weight: 900 },
      { file: KoKhalaya87, name: "87", weight: 900 },
      { file: KoKhalaya88, name: "88", weight: 900 },
      { file: KoKhalaya89, name: "89", weight: 900 },
      { file: KoKhalaya95, name: "95", weight: 1000 },
      { file: KoKhalaya96, name: "96", weight: 1000 },
      { file: KoKhalaya97, name: "97", weight: 1000 }
    ],
    variable: [
      { file: KoKhalayaVF, style: "normal", fontFamily: "KoKhalaya-Variable" }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 23
  },
  {
    id: 6,
    name: "KOLemaza",
    fontFamily: "KOLemaza",
    category: "Display",
    styles: [
      { file: KOLemazaRegular, name: "Regular", weight: 400 },
      { file: KOLemazaMedium, name: "Medium", weight: 500 },
      { file: KOLemazaSemiBold, name: "SemiBold", weight: 600 },
      { file: KOLemazaBold, name: "Bold", weight: 700 },
      { file: KOLemazaExtraBold, name: "ExtraBold", weight: 800 },
      { file: KOLemazaBlack, name: "Black", weight: 900 }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 6
  },
  {
    id: 7,
    name: "KORubbama",
    fontFamily: "KORubbama",
    category: "Script",
    styles: [
      { file: KORubbamaBlack, name: "Black", weight: 900, fontFamily: "KORubbama" },
      { file: KORubbamaBlackExpanded, name: "BlackExpanded", weight: 900, fontFamily: "KORubbama-Expanded" }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 2
  },
  {
    id: 8,
    name: "KoShareb",
    fontFamily: "KoShareb",
    category: "Serif",
    styles: [
      { file: KoSharebDisplay, name: "Display", style: "normal", weight: 400 }
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1
  },
  {
    id: 9,
    name: "Satoshi",
    fontFamily: "Satoshi",
    category: "Sans-serif",
    styles: [
      { 
        files: [SatoshiLight2, SatoshiLight],
        formats: ["woff2", "woff"],
        name: "Light",
        weight: 300,
        style: "normal"
      },
      {
        files: [SatoshiLightItalic2, SatoshiLightItalic],
        formats: ["woff2", "woff"],
        name: "Light Italic",
        weight: 300,
        style: "italic"
      },
      {
        files: [SatoshiRegular2, SatoshiRegular],
        formats: ["woff2", "woff"],
        name: "Regular",
        weight: 400,
        style: "normal"
      },
      {
        files: [SatoshiItalic2, SatoshiItalic],
        formats: ["woff2", "woff"],
        name: "Italic",
        weight: 400,
        style: "italic"
      },
      {
        files: [SatoshiMedium2, SatoshiMedium],
        formats: ["woff2", "woff"],
        name: "Medium",
        weight: 500,
        style: "normal"
      },
      {
        files: [SatoshiMediumItalic2, SatoshiMediumItalic],
        formats: ["woff2", "woff"],
        name: "Medium Italic",
        weight: 500,
        style: "italic"
      },
      {
        files: [SatoshiBold2, SatoshiBold],
        formats: ["woff2", "woff"],
        name: "Bold",
        weight: 700,
        style: "normal"
      },
      {
        files: [SatoshiBoldItalic2, SatoshiBoldItalic],
        formats: ["woff2", "woff"],
        name: "Bold Italic",
        weight: 700,
        style: "italic"
      },
      {
        files: [SatoshiBlack2, SatoshiBlack],
        formats: ["woff2", "woff"],
        name: "Black",
        weight: 900,
        style: "normal"
      },
      {
        files: [SatoshiBlackItalic2, SatoshiBlackItalic],
        formats: ["woff2", "woff"],
        name: "Black Italic",
        weight: 900,
        style: "italic"
      }
    ],
    variable: [
      {
        files: [SatoshiVariable2, SatoshiVariable],
        formats: ["woff2", "woff"],
        style: "normal",
        fontFamily: "Satoshi-Variable"
      },
      {
        files: [SatoshiVariableItalic2, SatoshiVariableItalic],
        formats: ["woff2", "woff"],
        style: "italic",
        fontFamily: "Satoshi-Variable"
      }
    ],
    designer: "Deni Anggara",
    imageUrl: null,
    isPremium: true,
    styleCount: 10
  }
];

// Helper function to get file format
const getFileFormat = (filename) => {
  if (filename.endsWith('.otf')) return 'opentype';
  if (filename.endsWith('.ttf')) return 'truetype';
  if (filename.endsWith('.woff')) return 'woff';
  if (filename.endsWith('.woff2')) return 'woff2';
  return 'truetype';
};

// Create CSS for the fonts
const createFontFaces = () => {
  let fontFacesCSS = "";

  fonts.forEach(font => {
    // Process regular styles
    font.styles.forEach(style => {
      if (Array.isArray(style.files)) {
        // Handle multiple format files (e.g., Satoshi with woff2 and woff)
        const sources = style.files.map((file, index) => 
          `url('${file}') format('${style.formats[index]}')`
        ).join(',\n       ');

        fontFacesCSS += `
          @font-face {
            font-family: '${style.fontFamily || font.fontFamily}';
            src: ${sources};
            font-weight: ${style.weight};
            font-style: ${style.style || 'normal'};
            font-display: swap;
          }
        `;
      } else {
        // Handle single file formats
        fontFacesCSS += `
          @font-face {
            font-family: '${style.fontFamily || font.fontFamily}';
            src: url('${style.file}') format('${getFileFormat(style.file)}');
            font-weight: ${style.weight || 400};
            font-style: ${style.style || 'normal'};
            ${style.variationSettings ? `font-variation-settings: ${style.variationSettings};` : ''}
            font-display: swap;
          }
        `;
      }
    });

    // Process variable fonts if available
    if (font.variable) {
      font.variable.forEach(varFont => {
        if (Array.isArray(varFont.files)) {
          const sources = varFont.files.map((file, index) => 
            `url('${file}') format('${varFont.formats[index]}')`
          ).join(',\n       ');

          fontFacesCSS += `
            @font-face {
              font-family: '${varFont.fontFamily}';
              src: ${sources};
              font-weight: 300 900;
              font-style: ${varFont.style};
              font-display: swap;
            }
          `;
        } else {
          fontFacesCSS += `
            @font-face {
              font-family: '${varFont.fontFamily}';
              src: url('${varFont.file}') format('${getFileFormat(varFont.file)}');
              font-weight: 300 900;
              font-style: ${varFont.style};
              font-display: swap;
            }
          `;
        }
      });
    }
  });

  // Create and append style element
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(fontFacesCSS));
  document.head.appendChild(style);
};

// Initialize fonts
export const initializeFonts = () => {
  // Add font-face definitions to document
  createFontFaces();

  // Add fonts to store
  const fontStore = useFontStore();

  // Add each font to the store
  fonts.forEach((font) => {
    fontStore.addFont({
      id: font.id,
      name: font.name,
      category: font.category,
      style: font.styles[0].name,
      variable: !!font.variable,
      designer: font.designer,
      imageUrl: font.imageUrl,
      isPremium: font.isPremium,
      styleCount: font.styleCount,
      fontFamily: font.fontFamily,
      styles: font.styles.map(s => ({
        name: s.name,
        weight: s.weight,
        style: s.style || 'normal'
      }))
    });
  });

  console.log("Fonts loaded into store:", fonts.length);
};

export default initializeFonts;
