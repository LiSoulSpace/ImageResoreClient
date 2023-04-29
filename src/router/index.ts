import { createRouter, createWebHistory } from "vue-router";
import { userInfoStore } from "@/stores/userInfo";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/imageshow",
      name: "imageshow",
      component: () => import("../views/ImageShow.vue"),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/imageinfo/:imagemd5",
      name: "imageInfo",
      component: () => import("../views/ImageInfoSingle.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
    },
  ],
});

export default router;
