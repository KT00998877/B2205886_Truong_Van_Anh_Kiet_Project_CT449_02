import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import "./assets/css/styles.css";
import "./assets/css/global.css";
import "./assets/css/auth.css";

const app = createApp(App);

app.use(router);
app.mount("#app");
