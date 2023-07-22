import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App);
app.mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));
