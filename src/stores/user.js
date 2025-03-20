import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    name: '',
    isAuthenticated: false,
  }),
  actions: {
    login(username) {
      this.name = username
      this.isAuthenticated = true
    },
    logout() {
      this.name = ''
      this.isAuthenticated = false
    }
  }
}) 