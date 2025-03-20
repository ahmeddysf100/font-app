<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <v-card>
    <v-card-title>Counter Example</v-card-title>
    <v-card-text>
      <p>Count: {{ count }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="count++">Increment</v-btn>
      <v-btn color="error" @click="count = 0">Reset</v-btn>
    </v-card-actions>
  </v-card>
</template> 