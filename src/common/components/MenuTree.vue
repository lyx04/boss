<template>
  <div>
    <template v-for="item in this.navMenu">
      <el-submenu
        :key="item.path"
        :index="item.menuId"
        v-if="item.children && item.children.length > 0"
        :class="
          item.parentId ? 'submenu-item submenu-children-item' : 'submenu-item'
        "
      >
        <template #title>
          <i
            :class="item.icon"
            style="vertical-align: -2px"
            v-if="item.icon"
          ></i
          ><i v-else class="el-icon-menu"></i>
          <span>{{ item.menuName }}</span>
        </template>
        <menu-tree :navMenu="item.children"></menu-tree>
      </el-submenu>
      <el-menu-item
        :key="item.path"
        :index="item.path"
        :permsId="`${item.perms}`"
        v-hasPermi="[`${item.perms}`]"
        v-if="
          ((item.perms && item.perms.length > 0) || permissions == '*:*:*') &&
          item.children &&
          item.children.length == 0
        "
      >
        <i :class="item.icon" style="vertical-align: -2px" v-if="item.icon"></i
        ><i v-else class="el-icon-tickets"></i
        ><template #title>{{ item.menuName }}</template>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuTree",
  data() {
    return {
      enterpriseProperty: JSON.parse(sessionStorage.getItem("userInfo"))
        .enterpriseProperty,
      permissions: JSON.parse(sessionStorage.getItem("permissions"))[0],
    };
  },
  props: ["navMenu"],
  methods: {
    menuparent(rows) {
      if (JSON.parse(sessionStorage.getItem("permissions"))[0] === "*:*:*") {
        return true;
      } else {
        return this.checkOwnSameItem(
          rows.perms,
          JSON.parse(sessionStorage.getItem("permissions"))
        );
      }
    },
    checkOwnSameItem(arr1, arr2) {
      for (var s in arr1) {
        for (var x in arr2) {
          if (arr1[s] == arr2[x]) {
            return true;
          }
        }
      }
    },
  },
};
</script>

<style>
/*隐藏文字*/
.el-menu--collapse .el-submenu__title span {
  display: none;
}
</style>
