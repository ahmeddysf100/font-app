// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#FA82D1',
          secondary: '#5CBBF6',
          // You can customize other colors here
        },
      },
      dark: {
        colors: {
          primary: '#FA82D1',
          secondary: '#424242',
          // Dark theme colors
        },
      },
    },
  },
})

export default vuetify 