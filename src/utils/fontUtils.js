import { computed } from 'vue';
import { useFontStore } from '../stores/fonts';

// Font Family Constants
export const FONT_FAMILIES = {
  // KOAynama
  KOAYNAMA_SHARP: 'KOAynama-Sharp',
  KOAYNAMA_CURVED: 'KOAynama-Curved',
  
  // KoShareb
  KOSHAREB: 'KoShareb',
  
  // Ko_Banzeen
  KOBANZEEN: 'Ko_Banzeen',
  
  // KoDongol
  KODONGOL: 'KoDongol',
  
  // KOLemaza
  KOLEMAZA: 'KOLemaza',
  
  // KoKhalaya
  KOKHALAYA: 'KoKhalaya',
  KOKHALAYA_VARIABLE: 'KoKhalaya-Variable',
  
  // KORubbama
  KORUBBAMA: 'KORubbama',
  KORUBBAMA_EXPANDED: 'KORubbama-Expanded',
  
  // KoGaliModern
  KOGALIMODERN: 'KoGaliModern',
  
  // Satoshi
  SATOSHI: 'Satoshi',
  SATOSHI_VARIABLE: 'Satoshi-Variable'
};

// Weight Constants
export const FONT_WEIGHTS = {
  THIN: 100,
  EXTRA_LIGHT: 200,
  LIGHT: 300,
  REGULAR: 400,
  MEDIUM: 500,
  SEMI_BOLD: 600,
  BOLD: 700,
  EXTRA_BOLD: 800,
  BLACK: 900
};

// Style Constants
export const FONT_STYLES = {
  NORMAL: 'normal',
  ITALIC: 'italic',
  OBLIQUE: 'oblique'
};

// Get all available fonts
export const useAvailableFonts = () => {
  const fontStore = useFontStore();
  return computed(() => fontStore.getAllFonts);
};

// Apply font to element
export const applyFontToElement = (element, fontFamily, weight = null, style = null) => {
  if (!element) return;
  
  element.style.fontFamily = `'${fontFamily}'`;
  
  if (weight) {
    element.style.fontWeight = weight;
  }
  
  if (style) {
    element.style.fontStyle = style;
  }
};

// Generate font style object for binding
export const generateFontStyle = (fontFamily, weight = null, style = null) => {
  const styleObj = {
    fontFamily: `'${fontFamily}'`
  };
  
  if (weight) {
    styleObj.fontWeight = weight;
  }
  
  if (style) {
    styleObj.fontStyle = style;
  }
  
  return styleObj;
};

// Get specialized styles for specific fonts
export const getSpecializedFontStyles = () => {
  // KoKhalaya specific styles
  const koKhalayaStyles = [55, 65, 75, 85, 95].map(weight => ({
    name: `KoKhalaya ${weight}`,
    value: generateFontStyle(FONT_FAMILIES.KOKHALAYA, weight * 10)
  }));
  
  // KoBanzeen specific styles
  const koBanzeenStyles = [
    { name: 'Ko_Banzeen Normal', value: generateFontStyle(FONT_FAMILIES.KOBANZEEN, null, FONT_STYLES.NORMAL) },
    { name: 'Ko_Banzeen Slanted Left', value: generateFontStyle(FONT_FAMILIES.KOBANZEEN, null, FONT_STYLES.ITALIC) },
    { name: 'Ko_Banzeen Slanted Right', value: generateFontStyle(FONT_FAMILIES.KOBANZEEN, null, FONT_STYLES.OBLIQUE) }
  ];
  
  // KOAynama specific styles
  const koAynamaStyles = [
    { name: 'KOAynama Sharp', value: generateFontStyle(FONT_FAMILIES.KOAYNAMA_SHARP) },
    { name: 'KOAynama Curved', value: generateFontStyle(FONT_FAMILIES.KOAYNAMA_CURVED) }
  ];
  
  // KORubbama specific styles
  const koRubbamaStyles = [
    { name: 'KORubbama Black', value: generateFontStyle(FONT_FAMILIES.KORUBBAMA, FONT_WEIGHTS.BLACK) },
    { name: 'KORubbama Expanded', value: generateFontStyle(FONT_FAMILIES.KORUBBAMA_EXPANDED, FONT_WEIGHTS.BLACK) }
  ];
  
  // Satoshi specific styles
  const satoshiStyles = [
    { name: 'Satoshi Light', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.LIGHT) },
    { name: 'Satoshi Light Italic', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.LIGHT, FONT_STYLES.ITALIC) },
    { name: 'Satoshi Regular', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.REGULAR) },
    { name: 'Satoshi Italic', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.REGULAR, FONT_STYLES.ITALIC) },
    { name: 'Satoshi Medium', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.MEDIUM) },
    { name: 'Satoshi Medium Italic', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.MEDIUM, FONT_STYLES.ITALIC) },
    { name: 'Satoshi Bold', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.BOLD) },
    { name: 'Satoshi Bold Italic', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.BOLD, FONT_STYLES.ITALIC) },
    { name: 'Satoshi Black', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.BLACK) },
    { name: 'Satoshi Black Italic', value: generateFontStyle(FONT_FAMILIES.SATOSHI, FONT_WEIGHTS.BLACK, FONT_STYLES.ITALIC) }
  ];
  
  // Satoshi Variable styles
  const satoshiVariableStyles = [
    { name: 'Satoshi Variable Regular', value: generateFontStyle(FONT_FAMILIES.SATOSHI_VARIABLE, FONT_WEIGHTS.REGULAR) },
    { name: 'Satoshi Variable Bold', value: generateFontStyle(FONT_FAMILIES.SATOSHI_VARIABLE, FONT_WEIGHTS.BOLD) },
    { name: 'Satoshi Variable Italic', value: generateFontStyle(FONT_FAMILIES.SATOSHI_VARIABLE, FONT_WEIGHTS.REGULAR, FONT_STYLES.ITALIC) }
  ];
  
  return {
    koKhalayaStyles,
    koBanzeenStyles,
    koAynamaStyles,
    koRubbamaStyles,
    satoshiStyles,
    satoshiVariableStyles,
    allStyles: [
      ...koKhalayaStyles,
      ...koBanzeenStyles,
      ...koAynamaStyles,
      ...koRubbamaStyles,
      ...satoshiStyles,
      ...satoshiVariableStyles,
      { name: 'KoShareb Display', value: generateFontStyle(FONT_FAMILIES.KOSHAREB) },
      { name: 'KoDongol Regular', value: generateFontStyle(FONT_FAMILIES.KODONGOL) },
      { name: 'KOLemaza Regular', value: generateFontStyle(FONT_FAMILIES.KOLEMAZA) },
      { name: 'KoGaliModern Regular', value: generateFontStyle(FONT_FAMILIES.KOGALIMODERN) },
      { name: 'KoKhalaya Variable', value: generateFontStyle(FONT_FAMILIES.KOKHALAYA_VARIABLE) }
    ]
  };
}; 