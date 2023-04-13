import { createApp } from "vue";
import App from "./App.vue";
import vue3GoogleLogin from "vue3-google-login";

const app = createApp(App);

// install all modules from `modules/*.ts`
const modules = import.meta.glob<any>("/src/modules/*.ts", { eager: true });
Object.values(modules).forEach((module) => module.install?.(app));

app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_VUE_APP_CLIENT_ID,
});

app.mount("#app");
