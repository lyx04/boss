import Vue from "vue";
import VueRouter from "vue-router";
import layout from "../views/layout.vue";
import system from "./system";
import config from "./config";
import customer from "./customer";
import aggregators from "./aggregators";

Vue.use(VueRouter);

/**
 * Note: 路由配置项
 *
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    requireAuth:true             // 如果设置为true需要登录
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/common/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */
const routes = [
  {
    path: "/",
    redirect: "/index",
  },
  {
    path: "*",
    redirect: "/404",
  },
  {
    path: "/login",
    name: "login",
    meta: {
      title: "登录",
      requireAuth: false,
    },
    component: (resolve) => require(["../views/login.vue"], resolve),
  },
  {
    path: "/404",
    name: "error",
    meta: {
      title: "404",
    },
    component: (resolve) => require(["../views/error.vue"], resolve),
  },
  {
    path: "/",
    name: "Home",
    component: layout,
    children: [
      {
        path: "/translation",
        name: "translation",
        meta: {
          title: "欢迎",
          requireAuth: true,
        },
        component: (resolve) => require(["../views/translation"], resolve),
      },
      {
        path: "/index",
        name: "index",
        meta: {
          title: "首页",
          requireAuth: true,
        },
        component: (resolve) => require(["../views/index"], resolve),
      },
      ...config,
      ...system,
      ...customer,
      ...aggregators,
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: "boss",
  routes,
});

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0); // 跳转后返回顶部
  if (to.meta.title) {
    document.title = to.meta.title
      ? to.meta.title + " - 电力能源后台系统"
      : "电力能源后台系统";
  }
  if (to.path != "/login") {
    document.onkeydown = function (e) {
      var ev = typeof event != "undefined" ? window.event : e;
      if (ev.keyCode == 13) {
        return false;
      }
    };
  } else {
    document.onkeydown = function (e) {
      var ev = typeof event != "undefined" ? window.event : e;
      if (ev.keyCode == 13) {
        return true;
      }
    };
  }
  if (to.matched.some((record) => record.meta.requireAuth)) {
    // 判断该路由是否需要登录权限
    if (sessionStorage.getItem("access_token")) {
      next();
    } else {
      next({
        path: "/login",
      });
    }
  } else {
    next();
  }
});
export default router;
