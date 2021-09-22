<template>
  <span class="tooltip">
    <el-tooltip effect="dark" placement="top-start">
      <div slot="content">
        <div v-for="(item, index) in message" :key="index">{{ item }}</div>
      </div>
      <i
        class="el-icon-question"
        style="font-size: 16px; margin-left: 10px"
      ></i>
    </el-tooltip>
  </span>
</template>

<script>
export default {
  name: "promptMessages",
  props: {
    message: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style scoped></style>
