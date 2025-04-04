// Node.js script to update font paths in fonts.json
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the fonts.json file
const fontsJsonPath = path.join(__dirname, 'public', 'fonts.json');
let fonts = JSON.parse(fs.readFileSync(fontsJsonPath, 'utf8'));

// Function to update font paths
function updateFontPath(oldPath) {
  // Remove the /kotype/public/ prefix and add /fonts/ prefix
  if (oldPath && oldPath.includes('/kotype/public/')) {
    return '/fonts/' + oldPath.split('/kotype/public/')[1];
  }
  return oldPath;
}

// Process each font and update paths
fonts.forEach(font => {
  // Update regular styles
  if (font.styles) {
    font.styles.forEach(style => {
      if (style.file) {
        style.file = updateFontPath(style.file);
      }
      if (style.files) {
        style.files = style.files.map(updateFontPath);
      }
    });
  }
  
  // Update variable fonts
  if (font.variable) {
    font.variable.forEach(varFont => {
      if (varFont.file) {
        varFont.file = updateFontPath(varFont.file);
      }
      if (varFont.files) {
        varFont.files = varFont.files.map(updateFontPath);
      }
    });
  }
});

// Write the updated JSON back to the file
fs.writeFileSync(fontsJsonPath, JSON.stringify(fonts, null, 4), 'utf8');
console.log('Font paths updated successfully!'); 