<template>
  <div class="dynamic-font-tester">
    <h2 class="text-h4 mb-4">Dynamic Font Tester</h2>
    
    <div v-for="font in availableFonts" :key="font.id" class="font-card mb-6">
      <v-card>
        <v-card-title>
          <span>{{ font.name }}</span>
          <v-chip size="small" color="primary" class="ml-2">{{ font.category }}</v-chip>
          <v-chip v-if="font.variable" size="small" color="secondary" class="ml-2">Variable</v-chip>
        </v-card-title>
        
        <v-card-text>
          <div v-for="style in font.styles" :key="style.name" class="font-style-sample pa-3 mb-3 rounded border">
            <div class="d-flex align-center justify-space-between mb-2">
              <span class="text-subtitle-2">{{ style.name }} ({{ style.weight || 400 }})</span>
              <span class="text-caption">{{ style.style || 'normal' }}</span>
            </div>
            
            <p :style="{
                fontFamily: `'${style.fontFamily || font.fontFamily}'`,
                fontWeight: style.weight || 400,
                fontStyle: style.style || 'normal',
                fontSize: '24px'
              }" 
              class="text-sample mb-2"
            >
              السلام.
            </p>
            
            <p :style="{
                fontFamily: `'${style.fontFamily || font.fontFamily}'`,
                fontWeight: style.weight || 400,
                fontStyle: style.style || 'normal',
                fontSize: '16px'
              }"
            >
              ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>
              abcdefghijklmnopqrstuvwxyz<br>
              0123456789 !@#$%^&*()_+
            </p>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { useAvailableFonts } from '../utils/fontUtils';

const availableFonts = useAvailableFonts();
</script>

<style scoped>
.font-style-sample {
  transition: all 0.2s ease;
}

.font-style-sample:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.text-sample {
  line-height: 1.4;
}
</style> 