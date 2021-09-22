export default [
  {
    path: "/dict",
    name: "dictionary",
    meta: {
      title: "字典管理",
      requireAuth: true,
      perms: [],
    },
    component: (resolve) => require(["@/views/system/dictionary"], resolve),
  },
  {
    path: "dict/:dictType",
    name: "dictDta",
    meta: {
      title: "字典数据",
      requireAuth: true,
      perms: [],
    },
    component: (resolve) => require(["@/views/system/dictDta"], resolve),
  },
  {
    path: "area",
    name: "area",
    meta: {
      title: "区域管理",
      requireAuth: true,
      perms: ["system:area:list"],
    },
    component: (resolve) => require(["@/views/system/area"], resolve),
  },
  {
    path: "bossmenu",
    name: "bosmenu",
    meta: {
      title: "后台菜单",
      requireAuth: true,
      perms: [],
    },
    component: (resolve) => require(["@/views/system/bosmenu"], resolve),
  },
  {
    path: "alarmStrategy",
    name: "alarmStrategy",
    meta: {
      title: "告警策略库",
      requireAuth: true,
      perms: ["system:rule:list"],
    },
    component: (resolve) => require(["@/views/system/alarmStrategy"], resolve),
  },
  {
    path: "bosslog",
    name: "boslog",
    meta: {
      title: "后台日志",
      requireAuth: true,
      perms: ["boss:log:list"],
    },
    component: (resolve) => require(["@/views/system/boslog"], resolve),
  },
  {
    path: "role",
    name: "role",
    meta: {
      title: "角色管理",
      requireAuth: true,
      perms: ["boss:role:list"],
    },
    component: (resolve) => require(["@/views/system/role"], resolve),
  },
  {
    path: "user",
    name: "user",
    meta: {
      title: "用户管理",
      requireAuth: true,
      perms: ["boss:user:list"],
    },
    component: (resolve) => require(["@/views/system/user.vue"], resolve),
  },
  {
    path: "dept",
    name: "dept",
    meta: {
      title: "部门管理",
      requireAuth: true,
      perms: ["boss:dept:list"],
    },
    component: (resolve) => require(["@/views/system/dept"], resolve),
  },
  {
    path: "cpsMeasure",
    name: "cpsMeasure",
    meta: {
      title: "量测量映射",
    },
    component: (resolve) =>
      require(["@/views/system/cps/measure/index"], resolve),
  },
  {
    path: "cpsdevice",
    name: "cpsdevice",
    meta: {
      title: "设备编码",
    },
    component: (resolve) =>
      require(["@/views/system/cps/device/index"], resolve),
  },
  {
    path: "cpsorg",
    name: "cpsorg",
    meta: {
      title: "企业编码",
    },
    component: (resolve) => require(["@/views/system/cps/org/index"], resolve),
  },
];
