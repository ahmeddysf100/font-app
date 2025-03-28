/**
 * Script to generate dynamic routes for the sitemap based on font data
 * 
 * This script reads the fonts.json file and generates route entries for each font
 * to be included in the sitemap.xml file during build.
 */

import fs from 'fs';
import path from 'path';

// Read the fonts.json file
const fontsPath = path.resolve('public/fonts.json');
const fonts = JSON.parse(fs.readFileSync(fontsPath, 'utf8'));

// Base routes
const baseRoutes = [
  '/',
  '/fonts',
  '/pairs',
  '/licenses',
  '/about',
  '/contact',
  '/terms',
  '/font-example',
  '/dynamic-fonts',
  '/honk-font'
];

// Generate dynamic routes for each font
const fontRoutes = fonts.map((font, index) => {
  // Use the index as the ID for simplicity, adjust if you use different IDs
  return `/fonts/${index}`;
});

// Generate dynamic routes for each font family
const fontFamilyRoutes = fonts.map((font, index) => {
  return `/fonts/${index}/family`;
});

// Combine all routes
const allRoutes = [
  ...baseRoutes,
  ...fontRoutes,
  ...fontFamilyRoutes
];

// Save to a file that can be imported by vite.config.js
const outputPath = path.resolve('scripts/sitemap-routes.js');
const outputContent = `
// Generated sitemap routes - do not edit manually
export const routes = ${JSON.stringify(allRoutes, null, 2)};
`;

// Ensure the directory exists
if (!fs.existsSync(path.dirname(outputPath))) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
}

fs.writeFileSync(outputPath, outputContent);
console.log(`Generated ${allRoutes.length} routes for sitemap`); 