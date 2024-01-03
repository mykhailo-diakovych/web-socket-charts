import { createApp } from "vue";
import App from "./App.vue";
import VChart from "vue-echarts";
import "echarts";
import "./main.css";
import { store } from "@/store";

const app = createApp(App);
app.use(store);
app.component("VChart", VChart);
app.mount("#app");
