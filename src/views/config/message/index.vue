<template>
  <div class="config container">
    <tab
      @tabs-change="tabschange"
      :tabsData="tabsData"
      :tabsActiveId="tabsActiveId"
    ></tab>
    <template v-if="tabsActiveId == 1">
      <list></list>
    </template>
    <template v-if="tabsActiveId == 2">
      <configtemp></configtemp>
    </template>
  </div>
</template>

<script>
import tab from "@/common/components/Tabs";
import list from "./configlist";
import configtemp from "./configTemp";
export default {
  components: { tab, list, configtemp },
  data() {
    return {
      tabsActiveId: 1,
      tabsData: [
        {
          value: 1,
          label: "消息分类",
        },
        {
          value: 2,
          label: "消息模板",
        },
      ],
    };
  },
  methods: {
    tabschange(e) {
      this.tabsActiveId = e;
    },
  },
};
</script>

<style scoped lang="scss">
.config {
  padding: 25px 27px 0 25px;
}
</style>
