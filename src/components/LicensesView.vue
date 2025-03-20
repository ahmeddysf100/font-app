<template>
  <div class="licenses-container">
    <v-container>
      <h1 class="text-h3 font-weight-bold mb-6">Font Licenses</h1>
      <p class="text-body-1 mb-8">Information about how our fonts can be used in your projects.</p>
      
      <v-card class="mb-6">
        <v-card-title class="text-h5">Free License</v-card-title>
        <v-card-text>
          <p class="mb-4">Our free license allows you to use our fonts in:</p>
          <ul class="mb-4">
            <li>Personal projects</li>
            <li>Educational work</li>
            <li>Non-commercial projects</li>
          </ul>
          <p>Attribution is appreciated but not required.</p>
        </v-card-text>
      </v-card>
      
      <v-card class="mb-6">
        <v-card-title class="text-h5">Commercial License</v-card-title>
        <v-card-text>
          <p class="mb-4">For commercial use, our premium license includes:</p>
          <ul class="mb-4">
            <li>Use in commercial projects and products</li>
            <li>Unlimited number of projects</li>
            <li>Access to all font weights and styles</li>
            <li>Web embedding</li>
            <li>App embedding</li>
          </ul>
          <v-btn color="primary">Purchase Commercial License</v-btn>
        </v-card-text>
      </v-card>
      
      <v-card>
        <v-card-title class="text-h5">Extended License</v-card-title>
        <v-card-text>
          <p class="mb-4">For more extensive usage, contact us for custom licensing terms.</p>
          <v-btn variant="outlined" color="primary">Contact Us</v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script setup>
// Component logic will go here
</script>

<style scoped>
.licenses-container {
  padding-top: 24px;
  padding-bottom: 48px;
}
</style> 