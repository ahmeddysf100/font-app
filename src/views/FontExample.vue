<template>
  <div class="font-example pa-6">
    <v-container>
      <v-row>
        <v-col cols="12">
          <h1 class="text-h3 mb-6">Font System Examples</h1>
          <p class="text-body-1 mb-8">
            This page demonstrates how to use the font system in different ways throughout your app.
          </p>
        </v-col>
      </v-row>
      
      <!-- Method 1: Using the FontText component -->
      <v-row class="mb-8">
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>Method 1: Using the FontText Component</v-card-title>
            <v-card-text>
              <div class="mt-4">
                <FontText 
                  family="KOAynama-Sharp" 
                  tag="h2" 
                  size="28" 
                  class="mb-4"
                >
                  This is KOAynama Sharp
                </FontText>
                
                <FontText 
                  family="KOAynama-Curved" 
                  tag="h2" 
                  size="28" 
                  class="mb-4"
                >
                  This is KOAynama Curved
                </FontText>
                
                <FontText 
                  family="KoShareb" 
                  tag="h2" 
                  size="28" 
                  class="mb-4"
                >
                  This is KoShareb Display
                </FontText>
                
                <FontText 
                  family="Ko_Banzeen" 
                  style="italic"
                  tag="h2" 
                  size="28" 
                  class="mb-4"
                >
                  This is Ko_Banzeen Slanted Left
                </FontText>
                
                <FontText 
                  family="KoKhalaya" 
                  weight="700"
                  tag="p" 
                  size="20" 
                  class="mb-4"
                >
                  This is KoKhalaya Bold
                </FontText>
                
                <FontText 
                  family="KoKhalaya-Variable" 
                  weight="550"
                  tag="p" 
                  size="20" 
                  class="mb-4"
                >
                  This is KoKhalaya Variable with weight 550
                </FontText>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Method 2: Using CSS Constants + CSS Classes -->
      <v-row class="mb-8">
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>Method 2: Using CSS Classes</v-card-title>
            <v-card-text>
              <div class="mt-4">
                <h2 class="font-koaynama-sharp  mb-4">This is KOAynama Sharp via CSS class</h2>
                <h2 class="font-koshareb  mb-4">This is KoShareb via CSS class</h2>
                <p class="font-kokhalaya font-weight-bold mb-4">This is KoKhalaya Bold via CSS class</p>
                <p class="font-korubbama mb-4">This is KORubbama via CSS class</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Method 3: Using the FontSelector component -->
      <v-row class="mb-8">
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>Method 3: Using Font Selector</v-card-title>
            <v-card-text>
              <FontSelector @font-change="updateDynamicText" />
              
              <div id="dynamic-text" class="dynamic-text mt-6 pa-4">
                This text will change font when you select a font above.
                The quick brown fox jumps over the lazy dog. 1234567890
                !@#$%^&*()_+{}|:"<>?
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Method 4: Using Inline Style Binding with Constants -->
      <v-row>
        <v-col cols="12">
          <v-card class="pa-4">
            <v-card-title>Method 4: Using Style Binding with Font Constants</v-card-title>
            <v-card-text>
              <div class="mt-4">
                <h2 :style="koSharebStyle" class="mb-4">This is KoShareb via style binding</h2>
                <h2 :style="koBanzeenStyle" class="mb-4">This is Ko_Banzeen Slanted Right via style binding</h2>
                <p :style="koKhalayaVariableStyle" class="mb-4">This is KoKhalaya Variable via style binding</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FontText from '../components/FontText.vue';
import FontSelector from '../components/FontSelector.vue';
import { FONT_FAMILIES, FONT_STYLES, FONT_WEIGHTS, generateFontStyle } from '../utils/fontUtils';

// Method 3: Dynamic text update
const updateDynamicText = (fontStyle) => {
  const element = document.getElementById('dynamic-text');
  if (element) {
    Object.assign(element.style, fontStyle);
  }
};

// Method 4: Style objects
const koSharebStyle = generateFontStyle(FONT_FAMILIES.KOSHAREB);
const koBanzeenStyle = generateFontStyle(FONT_FAMILIES.KOBANZEEN, null, FONT_STYLES.OBLIQUE);
const koKhalayaVariableStyle = generateFontStyle(FONT_FAMILIES.KOKHALAYA_VARIABLE, 650);
</script>

<style>
/* Method 2: CSS Classes for fonts */
.font-koaynama-sharp {
  font-family: 'KOAynama-Sharp', sans-serif;
}

.font-koaynama-curved {
  font-family: 'KOAynama-Curved', sans-serif;
}

.font-koshareb {
  font-family: 'KoShareb', serif;
}

.font-kobanzeen {
  font-family: 'Ko_Banzeen', sans-serif;
}

.font-kodongol {
  font-family: 'KoDongol', serif;
}

.font-kolemaza {
  font-family: 'KOLemaza', sans-serif;
}

.font-kokhalaya {
  font-family: 'KoKhalaya', sans-serif;
}

.font-kokhalaya-variable {
  font-family: 'KoKhalaya-Variable', sans-serif;
}

.font-korubbama {
  font-family: 'KORubbama', cursive;
  font-weight: 900;
}

.font-kogalimodern {
  font-family: 'KoGaliModern', monospace;
}

/* For Method 3 */
.dynamic-text {
  min-height: 150px;
  border: 1px dashed #ccc;
  border-radius: 4px;
  font-size: 18px;
  line-height: 1.5;
}
</style> 