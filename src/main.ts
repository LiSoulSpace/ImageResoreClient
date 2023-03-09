import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "viewerjs/dist/viewer.css";
import VueViewer from "v-viewer";
import ElementPlus from "element-plus";

import "bulma";
import "element-plus/dist/index.css";
import "viewerjs/dist/viewer.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const pinia = createPinia();
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia);
app.use(router);
app.use(VueViewer);
app.use(ElementPlus);

app.mount("#app");
