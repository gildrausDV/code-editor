import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import 'bootstrap-vue/dist/bootstrap-vue.css'; // Import BootstrapVue CSS
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

const app = createApp(App);
//app.use(BootstrapVue);
//app.use(IconsPlugin); 
app.mount('#app').$nextTick(() => postMessage({ payload: 'removeLoading' }, '*'));
