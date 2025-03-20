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

// KoKhalaya - Static Weights (selected weights)
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

// Add export statement for fontToImport
export const fontToImport = [
  {
    id: 1,
    name: "Ko_Banzeen",
    fontFamily: "Ko_Banzeen",
    styles: [KoBanzeenNormal, KoBanzeenSlantedL, KoBanzeenSlantedR],
    styleNames: ["Normal", "Slanted Left", "Slanted Right"],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 3,
  },
  {
    id: 2,
    name: "KOAynama",
    fontFamily: "KOAynama",
    styles: [KOAynamaSharp, KOAynamaCurved],
    styleNames: ["Sharp", "Curved"],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 2,
  },
  {
    id: 3,
    name: "KoDongol",
    fontFamily: "KoDongol",
    styles: [KoDongolRegular],
    styleNames: ["Regular"],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
  },
  {
    id: 4,
    name: "KoGaliModern",
    fontFamily: "KoGaliModern",
    styles: [
      KoGaliModernBlack,
      KoGaliModernBold,
      KoGaliModernExtraBold,
      KoGaliModernMedium,
      KoGaliModernSemiBold,
      KoGaliModernLight,
      KoGaliModernExtraLight,
      KoGaliModernHeavy,
      KoGaliModernUltraBold,
      KoGaliModernUltraLight,
    ],
    styleNames: [
      "Black",
      "Bold",
      "ExtraBold",
      "Medium",
      "SemiBold",
      "Light",
      "ExtraLight",
      "Heavy",
      "Regular",
      "UltraLight",
    ],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 10,
  },
  {
    id: 15,
    name: "KoKhalaya",
    fontFamily: "KoKhalaya",
    styles: [
      KoKhalaya55,
      KoKhalaya56,
      KoKhalaya57,
      KoKhalaya58,
      KoKhalaya59,
      KoKhalaya65,
      KoKhalaya66,
      KoKhalaya67,
      KoKhalaya68,
      KoKhalaya69,
      KoKhalaya75,
      KoKhalaya76,
      KoKhalaya77,
      KoKhalaya78,
      KoKhalaya79,
      KoKhalaya85,
      KoKhalaya86,
      KoKhalaya87,
      KoKhalaya88,
      KoKhalaya89,
      KoKhalaya95,
      KoKhalaya96,
      KoKhalaya97,
    ],
    styleNames: [
      "55",
      "56",
      "57",
      "58",
      "59",
      "65",
      "66",
      "67",
      "68",
      "69",
      "75",
      "76",
      "77",
      "78",
      "79",
      "85",
      "86",
      "87",
      "88",
      "89",
      "95",
      "96",
      "97",
    ],
    variable: [KoKhalayaVF],
    variableFontFamily: "KoKhalaya-Variable",
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 10,
  },
  {
    id: 16,
    name: "KOLemaza",
    fontFamily: "KOLemaza",
    styles: [
      KOLemazaBlack,
      KOLemazaBold,
      KOLemazaExtraBold,
      KOLemazaMedium,
      KOLemazaRegular,
      KOLemazaSemiBold,
    ],
    styleNames: ["Black", "Bold", "ExtraBold", "Medium", "Regular", "SemiBold"],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 6,
  },
  {
    id: 17,
    name: "KORubbama",
    fontFamily: "KORubbama",
    styles: [KORubbamaBlack, KORubbamaBlackExpanded],
    styleNames: ["Black", "BlackExpanded"],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 2,
  },
  {
    id: 18,
    name: "KoShareb",
    fontFamily: "KoShareb",
    styles: [KoSharebDisplay],
    styleNames: ["Display"],
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
  },
  // Add Satoshi fonts
  {
    id: 14,
    name: "Satoshi",
    fontFamily: "Satoshi",
    styles: [
      // Primary WOFF files (the WOFF2 versions will be used as fallbacks in the font-face declarations)
      SatoshiBlack,
      SatoshiBlackItalic,
      SatoshiBold,
      SatoshiBoldItalic,
      SatoshiItalic,
      SatoshiLight,
      SatoshiLightItalic,
      SatoshiMedium,
      SatoshiMediumItalic,
      SatoshiRegular
    ],
    styleNames: [
      "Black",
      "Black Italic",
      "Bold",
      "Bold Italic",
      "Italic",
      "Light",
      "Light Italic",
      "Medium",
      "Medium Italic",
      "Regular"
    ],
    variable: [SatoshiVariable, SatoshiVariableItalic],
    variableFontFamily: "Satoshi-Variable",
    designer: "Deni Anggara",
    imageUrl: null,
    isPremium: true,
    styleCount: 10,
  }
];

// Create CSS for the fonts
const createFontFaces = () => {
  let fontFacesCSS = "";

  // Add explicit font-face declarations for each font family
  // KoShareb
  fontFacesCSS += `
    @font-face {
      font-family: 'KoShareb';
      src: url('${KoSharebDisplay}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  
  // KoDongol
  fontFacesCSS += `
    @font-face {
      font-family: 'KoDongol';
      src: url('${KoDongolRegular}') format('opentype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  
  // KOAynama Sharp
  fontFacesCSS += `
    @font-face {
      font-family: 'KOAynama-Sharp';
      src: url('${KOAynamaSharp}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  
  // KOAynama Curved
  fontFacesCSS += `
    @font-face {
      font-family: 'KOAynama-Curved';
      src: url('${KOAynamaCurved}') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;
  
  // Add special handling for Satoshi WOFF/WOFF2 formats
  // Satoshi Regular
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiRegular2}') format('woff2'),
           url('${SatoshiRegular}') format('woff');
      font-weight: 400;
      font-style: normal;
    }
  `;
  
  // Satoshi Italic
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiItalic2}') format('woff2'),
           url('${SatoshiItalic}') format('woff');
      font-weight: 400;
      font-style: italic;
    }
  `;
  
  // Satoshi Light
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiLight2}') format('woff2'),
           url('${SatoshiLight}') format('woff');
      font-weight: 300;
      font-style: normal;
    }
  `;
  
  // Satoshi Light Italic
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiLightItalic2}') format('woff2'),
           url('${SatoshiLightItalic}') format('woff');
      font-weight: 300;
      font-style: italic;
    }
  `;
  
  // Satoshi Medium
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiMedium2}') format('woff2'),
           url('${SatoshiMedium}') format('woff');
      font-weight: 500;
      font-style: normal;
    }
  `;
  
  // Satoshi Medium Italic
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiMediumItalic2}') format('woff2'),
           url('${SatoshiMediumItalic}') format('woff');
      font-weight: 500;
      font-style: italic;
    }
  `;
  
  // Satoshi Bold
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiBold2}') format('woff2'),
           url('${SatoshiBold}') format('woff');
      font-weight: 700;
      font-style: normal;
    }
  `;
  
  // Satoshi Bold Italic
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiBoldItalic2}') format('woff2'),
           url('${SatoshiBoldItalic}') format('woff');
      font-weight: 700;
      font-style: italic;
    }
  `;
  
  // Satoshi Black
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiBlack2}') format('woff2'),
           url('${SatoshiBlack}') format('woff');
      font-weight: 900;
      font-style: normal;
    }
  `;
  
  // Satoshi Black Italic
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi';
      src: url('${SatoshiBlackItalic2}') format('woff2'),
           url('${SatoshiBlackItalic}') format('woff');
      font-weight: 900;
      font-style: italic;
    }
  `;
  
  // Satoshi Variable
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi-Variable';
      src: url('${SatoshiVariable2}') format('woff2'),
           url('${SatoshiVariable}') format('woff');
      font-weight: 300 900;
      font-style: normal;
      font-display: swap;
    }
  `;
  
  // Satoshi Variable Italic
  fontFacesCSS += `
    @font-face {
      font-family: 'Satoshi-Variable';
      src: url('${SatoshiVariableItalic2}') format('woff2'),
           url('${SatoshiVariableItalic}') format('woff');
      font-weight: 300 900;
      font-style: italic;
      font-display: swap;
    }
  `;

  // Define the remaining fonts via the loop
  fontToImport.forEach(font => {
    // Skip the fonts we've already defined explicitly
    if (font.name === "KOAynama" || 
        font.name === "KoDongol" || 
        font.name === "KoShareb" ||
        font.name === "Satoshi") {
      return;
    }
    
    // Process regular styles
    font.styles.forEach((styleFile, index) => {
      const styleName = font.styleNames ? font.styleNames[index] : 'Regular';
      let fontStyle = 'normal';
      let fontWeight = 400;
      let variationSettings = '';
      
      // Handle special cases
      if (font.name === "Ko_Banzeen") {
        if (styleName === "Slanted Left") {
          fontStyle = "italic";
          variationSettings = "font-variation-settings: 'slnt' -15;";
        } else if (styleName === "Slanted Right") {
          fontStyle = "oblique";
          variationSettings = "font-variation-settings: 'slnt' 15;";
        }
      } else {
        // Map weight names to numeric values for weight-based styles
        if (
          ["Black", "Bold", "ExtraBold", "Medium", "SemiBold", 
           "Light", "ExtraLight", "Heavy", "Regular", "UltraLight"].includes(styleName)
        ) {
          const weightMap = {
            "UltraLight": 100,
            "ExtraLight": 200,
            "Light": 300,
            "Regular": 400,
            "Medium": 500,
            "SemiBold": 600,
            "Bold": 700,
            "ExtraBold": 800,
            "Heavy": 900,
            "Black": 900
          };
          fontWeight = weightMap[styleName] || 400;
        } 
        // For KoKhalaya's numbered weights
        else if (font.name === "KoKhalaya" && styleName.match(/^\d\d$/)) {
          const firstDigit = parseInt(styleName.charAt(0));
          fontWeight = firstDigit * 100 + 100; // 5-> 600, 6-> 700, etc.
        }
      }
      
      // Determine the format based on the file extension
      const getFormat = (file) => {
        if (file.endsWith('.otf')) return 'opentype';
        if (file.endsWith('.ttf')) return 'truetype';
        if (file.endsWith('.woff')) return 'woff';
        if (file.endsWith('.woff2')) return 'woff2';
        return 'truetype'; // default
      };
      
      // Only add the font-face if we haven't skipped it
      fontFacesCSS += `
        @font-face {
          font-family: '${font.fontFamily}';
          src: url('${styleFile}') format('${getFormat(styleFile)}');
          font-weight: ${fontWeight};
          font-style: ${fontStyle};
          ${variationSettings}
          font-display: swap;
        }
      `;
    });
    
    // Process variable font if available
    if (font.variable) {
      const variableFontFamily = font.variableFontFamily || `${font.fontFamily}-Variable`;
      
      // Handle multiple variable files (e.g., normal and italic)
      font.variable.forEach((varFile, idx) => {
        const isItalic = idx > 0; // Assume first is normal, second is italic
        
        fontFacesCSS += `
          @font-face {
            font-family: '${variableFontFamily}';
            src: url('${varFile}') format('${varFile.endsWith('.woff2') ? 'woff2' : 
                                           varFile.endsWith('.woff') ? 'woff' : 'truetype'}')
            ${varFile.endsWith('.ttf') ? ' tech(\'variations\')' : ''};
            font-weight: 100 900;
            font-style: ${isItalic ? 'italic' : 'normal'};
            font-display: swap;
          }
        `;
      });
    }
  });
  
  console.log('Created font-face declarations for all fonts');
  
  // Create and append style element
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(fontFacesCSS));
  document.head.appendChild(style);
};

// Define font data
const localFonts = [
  {
    id: 1,
    name: "KOAynama Sharp",
    category: "Sans-serif",
    style: "Regular",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KOAynama-Sharp",
  },
  {
    id: 2,
    name: "KOAynama Curved",
    category: "Sans-serif",
    style: "Regular",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KOAynama-Curved",
  },
  {
    id: 3,
    name: "KoShareb",
    category: "Serif",
    style: "Display",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KoShareb",
  },
  {
    id: 4,
    name: "Ko Banzeen",
    category: "Display",
    style: "Normal",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 3,
    fontFamily: "Ko_Banzeen",
    styles: [
      { name: "Normal", value: "normal" },
      { name: "Slanted Left", value: "italic" },
      { name: "Slanted Right", value: "oblique" },
    ],
  },
  {
    id: 5,
    name: "KoDongol",
    category: "Serif",
    style: "Regular",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KoDongol",
  },
  {
    id: 6,
    name: "KOLemaza",
    category: "Display",
    style: "Regular",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KOLemaza",
  },
  {
    id: 7,
    name: "KoKhalaya Variable",
    category: "Sans-serif",
    style: "Variable",
    variable: true,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KoKhalaya-Variable",
  },
  {
    id: 8,
    name: "KoKhalaya",
    category: "Sans-serif",
    style: "Regular",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 5,
    fontFamily: "KoKhalaya",
    weights: [500, 600, 700, 800, 900],
  },
  {
    id: 9,
    name: "KORubbama",
    category: "Script",
    style: "Black",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KORubbama",
  },
  {
    id: 10,
    name: "KORubbama Expanded",
    category: "Script",
    style: "Black Expanded",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KORubbama-Expanded",
  },
  {
    id: 11,
    name: "KoGaliModern",
    category: "Mono",
    style: "Regular",
    variable: false,
    designer: "Kotype",
    imageUrl: null,
    isPremium: false,
    styleCount: 1,
    fontFamily: "KoGaliModern",
  },
  // Add Satoshi
  {
    id: 12,
    name: "Satoshi",
    category: "Sans-serif",
    style: "Regular",
    variable: false,
    designer: "Deni Anggara",
    imageUrl: null,
    isPremium: false,
    styleCount: 10,
    fontFamily: "Satoshi",
    weights: [300, 400, 500, 700, 900],
    styles: [
      { name: "Light", weight: 300, style: "normal" },
      { name: "Light Italic", weight: 300, style: "italic" },
      { name: "Regular", weight: 400, style: "normal" },
      { name: "Italic", weight: 400, style: "italic" },
      { name: "Medium", weight: 500, style: "normal" },
      { name: "Medium Italic", weight: 500, style: "italic" },
      { name: "Bold", weight: 700, style: "normal" },
      { name: "Bold Italic", weight: 700, style: "italic" },
      { name: "Black", weight: 900, style: "normal" },
      { name: "Black Italic", weight: 900, style: "italic" },
    ]
  },
  {
    id: 13,
    name: "Satoshi Variable",
    category: "Sans-serif",
    style: "Variable",
    variable: true,
    designer: "Deni Anggara",
    imageUrl: null,
    isPremium: false,
    styleCount: 2,
    fontFamily: "Satoshi-Variable",
    variableAxes: ["weight"],
    styles: [
      { name: "Regular Variable", style: "normal" },
      { name: "Italic Variable", style: "italic" }
    ]
  }
];

// Initialize fonts
export const initializeFonts = () => {
  // Add font-face definitions to document
  createFontFaces();

  // Add fonts to store
  const fontStore = useFontStore();

  // Add each font to the store
  localFonts.forEach((font) => {
    fontStore.addFont(font);
  });

  console.log("Local fonts loaded into store:", localFonts.length);
};

export default initializeFonts;
