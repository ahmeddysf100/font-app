import { defineStore } from 'pinia'

export const useFontStore = defineStore('fonts', {
  state: () => ({
    fonts: [
      // {
      //   id: 1,
      //   name: "KOAynama",
      //   category: "Sans-serif",
      //   style: "Regular",
      //   variable: true,
      //   designer: "Indian Type Foundry",
      //   imageUrl: "https://api.fontshare.com/v2/fonts/satoshi/images/thumb.svg",
      //   isPremium: false,
      //   styleCount: 12,
      // },
   
    ],
    favorites: [],
    currentFont: null,
  }),
  
  getters: {
    getAllFonts: (state) => state.fonts,
    
    getFontById: (state) => (id) => {
      return state.fonts.find(font => font.id === id)
    },
    
    getFavorites: (state) => state.favorites,
    
    isFavorite: (state) => (id) => {
      return state.favorites.includes(id)
    },
    
    getFilteredFonts: (state) => (filters) => {
      return state.fonts.filter(font => {
        // Filter by category if filter is set
        if (filters.category && filters.category !== 'All' && font.category !== filters.category) {
          return false
        }
        
        // Filter by search term if set
        if (filters.search && !font.name.toLowerCase().includes(filters.search.toLowerCase())) {
          return false
        }
        
        // Filter by style if set
        if (filters.style && font.style !== filters.style) {
          return false
        }
        
        // Filter by premium status if set
        if (filters.isPremium !== undefined && font.isPremium !== filters.isPremium) {
          return false
        }
        
        // Filter by variable if set
        if (filters.variable !== undefined && font.variable !== filters.variable) {
          return false
        }
        
        return true
      })
    }
  },
  
  actions: {
    setCurrentFont(fontId) {
      this.currentFont = this.getFontById(fontId)
    },
    
    addToFavorites(fontId) {
      if (!this.favorites.includes(fontId)) {
        this.favorites.push(fontId)
        // Save to localStorage
        localStorage.setItem('fontFavorites', JSON.stringify(this.favorites))
      }
    },
    
    removeFromFavorites(fontId) {
      const index = this.favorites.indexOf(fontId)
      if (index !== -1) {
        this.favorites.splice(index, 1)
        // Update localStorage
        localStorage.setItem('fontFavorites', JSON.stringify(this.favorites))
      }
    },
    
    toggleFavorite(fontId) {
      if (this.isFavorite(fontId)) {
        this.removeFromFavorites(fontId)
      } else {
        this.addToFavorites(fontId)
      }
    },
    
    loadFavorites() {
      const saved = localStorage.getItem('fontFavorites')
      if (saved) {
        this.favorites = JSON.parse(saved)
      }
    },
    
    // Method to add more fonts if needed
    addFont(font) {
     
      this.fonts.push(font)
    }
  }
}) 