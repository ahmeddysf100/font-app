import { useFontStore } from "../stores/fonts";
import fonts from "../../public/fonts.json";

// Get file format based on file extension
const getFileFormat = (filename) => {
  if (filename.endsWith(".otf")) return "opentype";
  if (filename.endsWith(".ttf")) return "truetype";
  if (filename.endsWith(".woff")) return "woff";
  if (filename.endsWith(".woff2")) return "woff2";
  if (filename.endsWith(".eot")) return "embedded-opentype";
  if (filename.endsWith(".svg")) return "svg";
  return "truetype";
};

// Function to check if a URL is from Google Fonts
export const isGoogleFontsUrl = (url) => {
  return url && (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com'));
};

// Function to check if a URL is an HTTP/HTTPS URL
export const isHttpUrl = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://'));
};

// // Function to properly format font family strings in CSS
// // Handles cases where the fontFamily includes both the font name and fallbacks in one string
// export const formatFontFamily = (fontFamily) => {
//   if (!fontFamily) return "";
  
//   // Split by commas to separate the font names
//   const parts = fontFamily.split(",").map(part => part.trim());
  
//   // Process each font name
//   const formattedParts = parts.map(part => {
//     // Generic font families don't need quotes
//     const genericFamilies = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui", "ui-serif", "ui-sans-serif", "ui-monospace", "ui-rounded", "emoji", "math", "fangsong"];
    
//     if (genericFamilies.includes(part.toLowerCase())) {
//       return part;
//     }
    
//     // Font names with spaces or special characters need quotes
//     if (part.includes(" ") || /[^a-zA-Z0-9\-_]/.test(part)) {
//       // If it already has quotes, keep them
//       if ((part.startsWith("'") && part.endsWith("'")) || 
//           (part.startsWith('"') && part.endsWith('"'))) {
//         return part;
//       }
//       // Otherwise add single quotes
//       return `'${part}'`;
//     }
    
//     // Simple font names don't strictly need quotes but we'll add them for consistency
//     return `'${part}'`;
//   });
  
//   // Join back with commas
//   return formattedParts.join(", ");
// };

// fonts.forEach((font) => {
//   console.log(font.fontFamily);
//   font.fontFamily = formatFontFamily(font.fontFamily);
//   font?.variable?.forEach((varFont) => {
//     varFont.fontFamily = formatFontFamily(varFont.fontFamily);
//   });
//   font?.styles?.forEach((style) => {
//     style.fontFamily = formatFontFamily(style.fontFamily);
//   });
// });

// Create CSS for the fonts


const createFontFaces = () => {

  let fontFacesCSS = "";
  console.log("Creating font faces for", fonts.length, "fonts");
  
  // Track web font URLs to load
  const webFontUrls = new Set();

  fonts.forEach((font) => {
    // Process regular styles
    font?.styles?.forEach((style) => {
      // Check if this is a web font (HTTP URL)
      if (style.file && isHttpUrl(style.file)) {
        // Add to collection of web fonts to load
        webFontUrls.add(style.file);
        return; // Skip creating @font-face for web fonts
      }
      
      if (Array.isArray(style.files)) {
        // Check if any file is a web font
        if (style.files.some(file => isHttpUrl(file))) {
          // Add all web font URLs
          style.files.forEach(file => {
            if (isHttpUrl(file)) webFontUrls.add(file);
          });
          return; // Skip creating @font-face for web fonts
        }
        
        // Handle multiple format files (e.g., Satoshi with woff2 and woff)
        const sources = style.files
          .map(
            (file) => `url('${file}') format('${getFileFormat(file)}')`
          )
          .join(",\n       ");

        fontFacesCSS += `
    @font-face {
            font-family: '${style.fontFamily || font.fontFamily}';
            src: ${sources};
            font-weight: ${style.weight || 400};
            font-style: ${style.style || "normal"};
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
            font-style: ${style.style || "normal"};
            ${
              style.variationSettings
                ? `font-variation-settings: ${style.variationSettings};`
                : ""
            }
            font-display: swap;
          }
        `;
      }
    });

    // Process variable fonts if available
    if (font.variable) {
      font.variable.forEach((varFont) => {
        // Check if this is a web font
        if (varFont.file && isHttpUrl(varFont.file)) {
          // Add to collection of web fonts to load
          webFontUrls.add(varFont.file);
          return; // Skip creating @font-face for web fonts
        }
        
        if (Array.isArray(varFont.files)) {
          // Check if any file is a web font
          if (varFont.files.some(file => isHttpUrl(file))) {
            // Add all web font URLs
            varFont.files.forEach(file => {
              if (isHttpUrl(file)) webFontUrls.add(file);
            });
            return; // Skip creating @font-face for web fonts
          }
          
          const sources = varFont.files
            .map(
              (file) => `url('${file}') format('${getFileFormat(file)}')`
            )
            .join(",\n       ");

          fontFacesCSS += `
    @font-face {
              font-family: '${varFont.fontFamily}';
              src: ${sources};
              font-weight: 100 1000;
              font-style: ${varFont.style};
              font-display: swap;
            }
          `;
        } else {
          fontFacesCSS += `
    @font-face {
              font-family: '${varFont.fontFamily}';
              src: url('${varFont.file}') format('${getFileFormat(varFont.file)}');
              font-weight: 100 1000;
              font-variation-settings: ${varFont.variationSettings};
              font-style: ${varFont.style};
              font-display: swap;
            }
          `;
        }
      });
    }
  });

  // Create and append style element for local fonts
  const style = document.createElement("style");
  style.textContent = fontFacesCSS;
  document.head.appendChild(style);
  
  // Load web fonts via link elements
  webFontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    console.log("Loaded web font:", url);
  });
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
      style: font?.styles?.[0]?.name,
      variable: !!font.variable,
      designer: font.designer,
      imageUrl: font.imageUrl,
      isPremium: font.isPremium,
      styleCount: font?.styles?.length + (font?.variable?.length || 0),
      fontFamily: font.fontFamily,
      styles: font?.styles?.map((s) => ({
        name: s.name,
        weight: s.weight,
        style: s.style || "normal",
      })),
    });
  });

  console.log("Fonts loaded into store:", fonts.length);
};

export default initializeFonts; 
