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

export default {
  methods: {
  },
};
</script>
<style lang="scss">
#app {
  height: 100%;
}
</style>
