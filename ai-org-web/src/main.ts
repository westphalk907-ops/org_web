import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import App from './App.vue'
import router from './router'
import './styles/index.scss'

NProgress.configure({ showSpinner: false, trickleSpeed: 200 })

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPersist)

app.use(pinia)
app.use(router)

router.beforeEach(() => {
  NProgress.start()
})
router.afterEach(() => {
  NProgress.done()
})
router.onError(() => {
  NProgress.done()
})

app.mount('#app')
