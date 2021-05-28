import { createApp } from 'vue'

import { createPinia } from 'pinia'

import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'


import './index.css'

createApp(App)
    .use(createPinia())
    .use(router)
    .use(ElementPlus)
    .mount('#app')
