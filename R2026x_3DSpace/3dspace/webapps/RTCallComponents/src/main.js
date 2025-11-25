import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Vuekit from '@ds/vuekit/dist/VUEKIT.umd.cjs'
import '@ds/vuekit/dist/VUEKIT.css'
import App from './App.vue'
import { initRequireJs } from './modules/require'
import { initDevEnv } from './api/callhistory_api'

(async() => {
await initRequireJs();
initDevEnv();

await requirejs(['css!DS/UIKIT/UIKIT']);

const pinia = createPinia();
const app = createApp(App);


app.use(pinia)
app.use(Vuekit, { globalRegister: true })

app.mount('#app');
})()
