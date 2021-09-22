export default [
  {
    path: "/customer/list",
    meta: {
      title: "客户管理",
      requireAuth: true,
      perms: ["sys:boss:list"],
    },
    component: (resolve) => require(["@/views/customer/list"], resolve),
  },
  {
    path: "/customer/view/:orgid",
    meta: {
      title: "客户详情",
      requireAuth: true,
      perms: ["sys:boss:query"],
    },
    component: (resolve) => require(["@/views/customer/view"], resolve),
  },
];
