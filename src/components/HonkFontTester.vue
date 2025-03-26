<template>
  <div class="honk-font-tester pa-6">
    <h2 class="text-h4 mb-4">Honk Variable Font Tester</h2>
    
    <v-card class="pa-4 mb-6">
      <v-card-title>Honk Font Example</v-card-title>
      <v-card-text>
        <div class="honk-sample mb-6">
          <p :style="{ 
              fontFamily: 'Honk', 
              fontSize: '32px',
              fontVariationSettings: `'MORF' ${morphValue}, 'SHLN' ${shadowValue}`
             }" 
             class="honk-text"
          >
            Whereas recognition of the inherent dignity
          </p>
        </div>
        
        <v-slider
          v-model="morphValue"
          min="0"
          max="45"
          step="1"
          label="MORF (Morphing)"
          thumb-label
          class="mb-4"
        ></v-slider>
        
        <v-slider
          v-model="shadowValue"
          min="0"
          max="100"
          step="1"
          label="SHLN (Shadow Length)"
          thumb-label
          class="mb-4"
        ></v-slider>
        
        <div class="mt-4 font-details">
          <p>Current settings: <code>font-variation-settings: 'MORF' {{ morphValue }}, 'SHLN' {{ shadowValue }}</code></p>
          <p class="mt-2">Font loaded from: <code>https://fonts.googleapis.com/css2?family=Honk:MORF,SHLN@0..45,0..100&display=swap</code></p>
        </div>
      </v-card-text>
    </v-card>
    
    <v-card class="pa-4">
      <v-card-title>About Variable Fonts</v-card-title>
      <v-card-text>
        <p>Variable fonts allow for dynamic adjustment of font properties through CSS variation settings.</p>
        <p class="mt-2">The Honk font has two variable axes:</p>
        <ul class="mt-2">
          <li><strong>MORF (Morphing)</strong>: Values from 0 to 45</li>
          <li><strong>SHLN (Shadow Length)</strong>: Values from 0 to 100</li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const morphValue = ref(15);
const shadowValue = ref(50);
</script>

<style scoped>
.honk-text {
  line-height: 1.4;
  transition: font-variation-settings 0.3s ease;
}

.font-details {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
}

.honk-sample {
  padding: 20px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.03);
}
</style> 