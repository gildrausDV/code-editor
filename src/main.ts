import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import {createModal} from '@kolirt/vue-modal'

const app = createApp(App);
app.use(createModal());
app.mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));
