import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import VChart from "vue-echarts";
import "echarts"
import './main.css'

const app = createApp(App)

app.use(store)
app.component('v-chart', VChart)
app.mount('#app')

