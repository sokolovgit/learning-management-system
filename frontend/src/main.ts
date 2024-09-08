import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { primeVuePreset } from '@/primeVuePreset'
import PrimeVue from 'primevue/config'
import 'primeicons/primeicons.css'

import router from './router'
import App from './App.vue'

import './index.css'

const app = createApp(App)

app.use(router)
app.use(createPinia())

app.use(PrimeVue, {
  theme: {
    preset: primeVuePreset,
    options: {
      darkModeSelector: '.my-app-dark',
      prefix: 'p',
      cssLayer: {
        name: 'primevue',
        order: 'tailwind-base, primevue, tailwind-utilities'
      }
    }
  }
})

app.mount('#app')
