<template>
  <component 
    :is="tag" 
    :style="computedStyle" 
    :class="className"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { FONT_FAMILIES, FONT_WEIGHTS, FONT_STYLES, generateFontStyle } from '../utils/fontUtils';

// Props for the component
const props = defineProps({
  // Font properties
  family: {
    type: String,
    default: FONT_FAMILIES.KOAYNAMA_SHARP
  },
  weight: {
    type: [Number, String],
    default: null
  },
  style: {
    type: String,
    default: null
  },
  size: {
    type: [Number, String],
    default: null
  },
  lineHeight: {
    type: [Number, String],
    default: null
  },
  letterSpacing: {
    type: [Number, String],
    default: null
  },
  color: {
    type: String,
    default: null
  },
  
  // HTML element to render
  tag: {
    type: String,
    default: 'span'
  },
  
  // Additional class names
  class: {
    type: String,
    default: ''
  }
});

// Computed style object
const computedStyle = computed(() => {
  const baseStyle = generateFontStyle(props.family, props.weight, props.style);
  
  // Add additional styling properties if provided
  if (props.size) {
    baseStyle.fontSize = typeof props.size === 'number' ? `${props.size}px` : props.size;
  }
  
  if (props.lineHeight) {
    baseStyle.lineHeight = props.lineHeight;
  }
  
  if (props.letterSpacing) {
    baseStyle.letterSpacing = typeof props.letterSpacing === 'number' ? `${props.letterSpacing}px` : props.letterSpacing;
  }
  
  if (props.color) {
    baseStyle.color = props.color;
  }
  
  return baseStyle;
});

// Pass through the class prop
const className = computed(() => props.class);
</script>

<style scoped>
/* Any additional styling can go here */
</style> 