export default [
  {
    path: "/config/measure",
    name: "TreeAside",
    meta: {
      title: "量测量管理",
      requireAuth: true,
      perms: ["ema:ema:list"],
    },
    component: (resolve) => require(["@/views/config/measure/index"], resolve),
  },
  {
    path: "/config/parameter",
    meta: {
      title: "设备参数",
      requireAuth: true,
      perms: ["ema:qType:list"],
    },
    component: (resolve) =>
      require(["@/views/config/parameter/index"], resolve),
  },
  {
    path: "/config/message",
    meta: {
      title: "消息配置",
      requireAuth: true,
      perms: [],
    },
    component: (resolve) => require(["@/views/config/message/index"], resolve),
  },
  {
    path: "/config/version",
    meta: {
      title: "版本管理",
      requireAuth: true,
      perms: [],
    },
    component: (resolve) => require(["@/views/config/version"], resolve),
  },
  {
    path: "/config/dispose",
    meta: {
      title: "分时计量配置",
      requireAuth: true,
      perms: ["system:plan:list"],
    },
    component: (resolve) => require(["@/views/config/dispose"], resolve),
  },
  {
    path: "menu",
    name: "menu",
    meta: {
      title: "前台菜单",
      requireAuth: true,
      perms: [],
    },
    component: (resolve) => require(["@/views/config/menu/index"], resolve),
  },
  {
    path: "log",
    name: "log",
    meta: {
      title: "前台日志",
      requireAuth: true,
      perms: ["monitor:operlog:list", "monitor:logininfor:list"],
    },
    component: (resolve) => require(["@/views/config/log/index"], resolve),
  },
  {
    path: "template",
    name: "template",
    meta: {
      title: "巡视模板",
      requireAuth: true,
      perms: ["maintain:template:query"],
    },
    component: (resolve) => require(["@/views/config/template/index"], resolve),
  },
  {
    path: "appMenu",
    name: "appMenu",
    meta: {
      title: "APP应用管理",
      requireAuth: true,
    },
    component: (resolve) => require(["@/views/config/appMenu/index"], resolve),
  },
];
