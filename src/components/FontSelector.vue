<template>
  <div>
    <v-select
      v-model="selectedFont"
      :items="fontOptions"
      label="Select Font"
      item-title="name"
      item-value="value"
      return-object
      @update:model-value="applyFont"
    ></v-select>
    
    <div v-if="selectedFont" class="font-preview mt-4 pa-4 rounded" :style="fontStyle">
      <p class="text-h5">Font Preview</p>
      <p class="text-body-1">
        {{ sampleText }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { getSpecializedFontStyles } from '../utils/fontUtils';

const props = defineProps({
  elementId: {
    type: String,
    default: null
  },
  sampleText: {
    type: String,
    default: 'The quick brown fox jumps over the lazy dog. 1234567890'
  }
});

const emit = defineEmits(['font-change']);

// Get all font styles using our utility
const { allStyles } = getSpecializedFontStyles();
const fontOptions = allStyles;

const selectedFont = ref(null);

const fontStyle = computed(() => {
  if (!selectedFont.value) return {};
  return selectedFont.value.value;
});

const applyFont = () => {
  // If an element ID is provided, apply the font to that element
  if (props.elementId) {
    const element = document.getElementById(props.elementId);
    if (element) {
      Object.assign(element.style, fontStyle.value);
    }
  }
  
  // Emit the font change event with the selected font style
  emit('font-change', fontStyle.value);
  console.log(fontStyle.value);
};
</script>

<style scoped>
.font-preview {
  border: 1px solid #e0e0e0;
  background-color: #151515;
}
</style> 