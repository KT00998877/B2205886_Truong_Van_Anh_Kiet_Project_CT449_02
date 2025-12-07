import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import "./assets/css/auth.css";
import "./assets/css/layout.css";
import "./assets/bootstrap.min.css";


const app = createApp(App);

app.use(router);
app.mount("#app");
