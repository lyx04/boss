<template>
  <el-breadcrumb
    separator-class="el-icon-arrow-right"
    v-if="breadListLast.length > 0"
  >
    <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-for="(item, index) in breadListLast" :key="index">{{
      item.menuName
    }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Breadcrumb",
  computed: {
    ...mapState(["indexId"]),
    breadListLast() {
      let breadcrumbs = [];
      // 获取的菜单列表
      let menuList = JSON.parse(sessionStorage.getItem("navMenu"));
      // 获取面包屑路由菜单对象
      var indexBreadcrumbs = this.indexId;
      if (indexBreadcrumbs && indexBreadcrumbs.length > 0) {
        indexBreadcrumbs.map(item => {
          for (let i = 0; i < menuList.length; i++) {
            if (item == menuList[i].menuId) {
              breadcrumbs.push(menuList[i]);
              if (menuList[i].children) {
                menuList = menuList[i].children;
              }
              break;
            }
          }
        });
      }
      return breadcrumbs;
    }
  },
  created() {
    this.$store.dispatch(
      "setindexId",
      JSON.parse(sessionStorage.getItem("indexId"))
    );
  }
};
</script>

<style scoped></style>
