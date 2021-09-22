<template>
  <div class="tags" v-if="showTags">
    <ul>
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
      >
        <router-link
          class="tags-li-title"
          tag="span"
          :to="{
            path: item.path,
            params: item.params,
            fullPath: item.fullPath,
          }"
          >{{ item.title }}</router-link
        >
        <span
          class="tags-li-icon"
          @click="closeTags(index)"
          v-if="item.path != '/index'"
        >
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <div class="tags-close-box">
      <el-dropdown @command="handleTags">
        <el-button size="mini" type="primary">
          标签选项
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu size="small">
            <el-dropdown-item command="other">关闭其他</el-dropdown-item>
            <el-dropdown-item command="all">关闭所有</el-dropdown-item>
            <el-dropdown-item command="refresh"
              >刷&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;新</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  inject: ["reload"],
  computed: {
    tagsList() {
      return this.$store.state.tagsList;
    },
    showTags() {
      return this.tagsList.length > 0;
    },
  },
  methods: {
    isActive(path) {
      return path === this.$route.fullPath;
    },
    // 关闭单个标签
    closeTags(index) {
      const delItem = this.tagsList[index];
      this.$store.commit("delTagsItem", { index });
      const item = this.tagsList[index]
        ? this.tagsList[index]
        : this.tagsList[index - 1];
      if (item) {
        delItem.path === this.$route.fullPath && this.$router.push(item.path);
      } else {
        this.$router.push("/");
      }
    },
    // 关闭全部标签
    closeAll() {
      if (this.tagsList.length > 1) {
        this.$store.commit("clearTags");
        this.$router.push("/");
        this.$store.commit("setTagsItem", {
          name: "index",
          title: "首页",
          path: "/index",
        });
      }
    },
    // 关闭其他标签
    closeOther() {
      const curItem = this.tagsList.filter((item) => {
        return item.path === this.$route.fullPath;
      });
      curItem.unshift({
        name: "index",
        title: "首页",
        path: "/index",
      });
      this.$store.commit("closeTagsOther", curItem);
    },
    // 设置标签
    setTags(route) {
      const isExist = this.tagsList.some((item) => {
        return item.path === route.fullPath;
      });
      if (!isExist) {
        this.$store.commit("setTagsItem", {
          name: route.name,
          title: route.meta.title,
          path: route.fullPath,
        });
      }
    },
    handleTags(command) {
      switch (command) {
        case "other":
          this.closeOther();
          break;
        case "all":
          this.closeAll();
          break;
        case "refresh":
          this.refresh();
          break;
      }
    },
    //  刷新
    refresh() {
      this.reload();
    },
  },
  watch: {
    $route(newValue) {
      this.setTags(newValue);
    },
  },
  created() {
    // 关闭当前页面的标签页
    if (this.$route.fullPath != "/index") {
      this.$store.commit("setTagsItem", {
        name: "index",
        title: "首页",
        path: "/index",
      });
    }
    this.setTags(this.$route);
  },
};
</script>

<style lang="scss">
.tags {
  position: relative;
  height: 38px;
  overflow: hidden;
  background: #fff;
  padding: 4px 10px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  z-index: 999;
}

.tags ul {
  box-sizing: border-box;
  width: 88%;
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  &:hover {
    overflow-x: auto;
    overflow-y: hidden;
  }
}

.tags-li {
  display: inline-block;
  margin: 3px 5px 2px 3px;
  border-radius: 3px;
  font-size: 12px;
  overflow: hidden;
  cursor: pointer;
  height: 22px;
  line-height: 20px;
  border: 1px solid #e9eaec;
  background: #fff;
  padding: 0 5px 0 12px;
  vertical-align: middle;
  color: #666;
  -webkit-transition: all 0.3s ease-in;
  -moz-transition: all 0.3s ease-in;
  transition: all 0.3s ease-in;
}

.tags-li:not(.active):hover {
  background: #f8f8f8;
}

.tags-li.active {
  color: #fff;
}

.tags-li-title {
  float: left;
  max-width: 80px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 5px;
  color: #666;
}

.tags-li.active .tags-li-title {
  color: #fff;
}

.tags-close-box {
  position: absolute;
  right: 10px;
  top: 4px;
  box-sizing: border-box;
  padding-top: 1px;
  text-align: center;
  width: 110px;
  height: 30px;
  background: #fff;
  z-index: 10;
}
</style>
