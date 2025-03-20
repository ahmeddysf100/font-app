import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import './assets/main.css'
import './assets/fonts.css'
import initializeFonts from './utils/fontLoader'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(vuetify)
app.use(router)

// Initialize local fonts after pinia is set up
initializeFonts()

app.mount('#app')
