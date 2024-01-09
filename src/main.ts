import { createApp } from "vue";
import App from "./App.vue";
import VChart from "vue-echarts";
import "echarts";
import "./main.css";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.component("VChart", VChart);
app.mount("#app");
