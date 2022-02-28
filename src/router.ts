import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  RouterOptions,
} from "vue-router";

import Home from "@/views/Home.vue";
import NodePage from "@/views/NodePage.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/node-page/:id",
    component: NodePage,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: "/",
  },
];

const options: RouterOptions = {
  history: createWebHashHistory(),
  routes,
};

export const router = createRouter(options);
