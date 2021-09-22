<template>
  <div class="sidebar">
    <div class="head-container" v-if="!collapse">
      <el-input
        v-model="menuName"
        placeholder="请输入菜单名称搜索"
        size="small"
        clearable
        prefix-icon="el-icon-search"
        @input="searchMenu"
      />
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router
    >
      <!-- 引入组件 -->
      <menu-tree :navMenu="treeList"></menu-tree>
    </el-menu>
  </div>
</template>

<script>
import MenuTree from "./MenuTree";
import { mapState } from "vuex";

export default {
  components: {
    MenuTree,
  },
  data() {
    return {
      menuName: "",
      treeList: [],
    };
  },
  computed: {
    ...mapState(["headerList", "indexId"]),
    onRoutes() {
      return this.$route.path.replace("/", "");
    },
    collapse() {
      return this.$store.state.collapse;
    },
    navMenu() {
      var that = this;
      if (
        sessionStorage.getItem("navMenu") &&
        JSON.parse(sessionStorage.getItem("navMenu")).length > 0 &&
        this.indexId &&
        this.indexId.length > 0
      ) {
        that.menuName = "";
        return that.rescursion(
          JSON.parse(sessionStorage.getItem("navMenu")),
          this.indexId[0]
        ).children;
      } else {
        return [];
      }
    },
  },
  methods: {
    // 过滤查找当前树结构对象
    rescursion(data, id) {
      let result;
      for (var i = 0; i < data.length; i++) {
        let item = data[i];
        if (item.menuId == id) {
          result = item;
          break;
        } else if (item.children && item.children.length > 0) {
          result = this.rescursion(item.children, id);
          if (result) return result;
        }
      }
      return result;
    },
    searchMenu() {
      this.treeList = [];
      let treeListTmp = this.navMenu;
      let tmp = this.menuName
        ? this.rebuildData(this.menuName, treeListTmp)
        : JSON.parse(JSON.stringify(treeListTmp));
      this.treeList.push(...tmp);
    },
    rebuildData(value, arr) {
      if (!arr) {
        return [];
      }
      let newarr = [];
      if (Object.prototype.toString.call(arr) === "[object Array]") {
        arr.forEach((element) => {
          if (element.menuName.indexOf(value) > -1) {
            const ab = this.rebuildData(value, element.children);
            const obj = {
              ...element,
              children: ab,
            };
            newarr.push(obj);
          } else {
            if (element.children && element.children.length > 0) {
              const ab = this.rebuildData(value, element.children);
              const obj = {
                ...element,
                children: ab,
              };
              if (ab && ab.length > 0) {
                newarr.push(obj);
              }
            }
          }
        });
      }
      return newarr;
    },
  },
  created() {
    this.$store.dispatch(
      "setindexId",
      JSON.parse(sessionStorage.getItem("indexId"))
    );
  },
  watch: {
    navMenu(val) {
      this.treeList = val;
    },
  },
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.head-container {
  background-color: #324157;
  padding: 20px;
  width: 250px;
  border-right: solid 1px #e6e6e6;
}
</style>
