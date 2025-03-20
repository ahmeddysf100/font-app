import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: false
  }),
  actions: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      
      // Update the class for Tailwind
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      // Save preference to localStorage
      localStorage.setItem('darkMode', this.darkMode)
    },
    initTheme() {
      // Check for saved theme preference or use device preference
      const savedTheme = localStorage.getItem('darkMode')
      const deviceDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      this.darkMode = savedTheme !== null 
        ? savedTheme === 'true' 
        : deviceDarkMode
        
      // Apply theme for Tailwind
      if (this.darkMode) {
        document.documentElement.classList.add('dark')
      }
    }
  }
}) 