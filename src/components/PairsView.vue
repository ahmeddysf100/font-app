<template>
  <div class="pairs-container">
    <v-container>
      <h1 class="text-h3 font-weight-bold mb-6">Font Pairs</h1>
      <p class="text-body-1 mb-8">Discover perfect font combinations for your design projects.</p>
      
      <v-alert type="info" class="mb-6">
        This section is under development. Check back soon for curated font pairs!
      </v-alert>
      
      <v-row>
        <v-col cols="12" md="6" lg="4" v-for="i in 3" :key="i">
          <v-card class="pa-4 mb-4">
            <v-card-title>Font Pair Example {{ i }}</v-card-title>
            <v-card-text>
              <p class="text-h5 mb-2">Heading Font</p>
              <p class="text-body-1">Paragraph font that pairs well with the heading.</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
// Component logic will go here
</script>

<style scoped>
.pairs-container {
  padding-top: 24px;
  padding-bottom: 48px;
}
</style> 