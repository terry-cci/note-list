import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterOptions,
} from "vue-router";

import Home from "@/views/Home.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
  },
];

const options: RouterOptions = {
  history: createWebHashHistory(),
  routes,
};

export const router = createRouter(options);
