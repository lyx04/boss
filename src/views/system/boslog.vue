<template>
  <div class="container main-content">
    <!--选中的菜单-->
    <div class="log-content">
      <tabs
        :tabsData="tabsData"
        :tabsActiveId="tabsActiveId"
        @tabs-change="tabsChange"
      ></tabs>
      <!--内容-->
      <div class="operation-log" v-if="tabsActiveId === '10'">
        <operation-log></operation-log>
      </div>
      <div class="login-log" v-if="tabsActiveId === '20'">
        <logine-log></logine-log>
      </div>
    </div>
  </div>
</template>

<script>
import tabs from "@/common/components/Tabs";
import OperationLog from "./components/OperationLog";
import LogineLog from "./components/LogineLog";

export default {
  name: "boslog",
  components: {
    tabs,
    OperationLog,
    LogineLog,
  },
  data() {
    return {
      tabsData: [
        {
          label: "操作日志",
          value: "10",
          perms: "boss:monitor:operlog:list",
        },
        {
          label: "登录日志",
          value: "20",
          perms: "boss:monitor:logininfor:list",
        },
      ], // tabs数据
      tabsActiveId: "10", // tabs选中结果
    };
  },
  methods: {
    //  tabs切换
    tabsChange(val) {
      this.tabsActiveId = val;
    },
  },
  mounted() {
    let perm = "boss:monitor:operlog:list";
    var num = 0;
    JSON.parse(sessionStorage.getItem("permissions")).forEach((item) => {
      if (item === perm || item === "*:*:*") {
        num = 1;
        if (num > 0) {
          this.tabsActiveId = "10";
        }
      } else if (num == 0) {
        this.tabsActiveId = "20";
      }
    });
  },
};
</script>

<style scoped lang="scss">
.log-content {
  .operation-log,
  .login-log {
    margin-top: 25px;
  }
}
</style>
