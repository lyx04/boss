<template>
  <div class="h-tabs">
    <ul>
      <li
        v-for="(item, index) in tabsData"
        :key="index"
        :class="item.value === tabsActiveId ? 'active' : ''"
        v-hasPermi="[`${item.perms}`]"
        ref="gtabsItem"
        @click="tabsChange(item)"
      >
        <span>{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "tabs",
  props: {
    tabsData: {
      type: Array,
    },
    tabsActiveId: {
      type: String,
    },
  },
  methods: {
    tabsChange(item) {
      this.$emit("tabs-change", item.value);
    },
  },
  mounted() {},
};
</script>

<style scoped lang="scss">
.h-tabs {
  ul {
    display: flex;
    li {
      padding: 9px 24px;
      border: 1px solid #dcdfe6;
      border-radius: 2px 8px 0px 0px;
      color: #606266;
      margin-left: 8px;
      cursor: pointer;
      span {
        font-size: 14px;
      }
      &:first-child {
        margin-left: 0;
      }
      &.active {
        border: 1px solid #409eff;
        color: #409eff;
      }
    }
  }
}
</style>
