export default [
  {
    path: "datacollect",
    name: "datacollect",
    meta: {
      title: "采集数据补录",
      requireAuth: true,
      perms: ["system:datacollect:list"],
    },
    component: (resolve) =>
      require(["@/views/aggregators/datacollect"], resolve),
  },
  {
    path: "giving",
    name: "giving",
    meta: {
      title: "上送数据配置",
      requireAuth: true,
      perms: ["system:giving:list"],
    },
    component: (resolve) => require(["@/views/aggregators/giving"], resolve),
  },
];
