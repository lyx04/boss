<template>
  <div
    id="app"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <router-view />
  </div>
</template>
<script>
import { mapState } from "vuex";
import { GET_ALL_DICT_DATA_LIST } from "@/common/api/system/dictionary";

export default {
  computed: {
    ...mapState(["loading"]),
  },
  methods: {
    // 关闭平台提示或者刷新提示
    shutDownPlatform() {
      let _this = this;
      window.onbeforeunload = function (e) {
        if (_this.$route.name === "login") {
          window.onbeforeunload = null;
        } else {
          e = e || window.event;
          if (e) {
            e.returnValue = "关闭提示";
          }
          return "关闭提示";
        }
        return false;
      };
    },
    // 获取字典
    getAllDictList() {
      if (JSON.parse(sessionStorage.getItem("access_token"))) {
        const arr = [];
        GET_ALL_DICT_DATA_LIST().then((res) => {
          res.rows.forEach((item) => {
            const parent = arr.find(
              (cur) => Object.keys(cur)[0] === item.dictType
            );
            if (parent) {
              parent[Object.keys(parent)[0]].push(item);
            } else {
              let obj = {
                [item.dictType]: [item],
              };
              arr.push(obj);
            }
          });
          const obj = {};
          arr.forEach((item) => {
            obj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
          });
          this.$store.dispatch("setDict", obj);
        });
      }
    },
  },
  created() {
    this.getAllDictList();
    this.shutDownPlatform();
  },
};
</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
