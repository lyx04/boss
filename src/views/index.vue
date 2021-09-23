<template>
  <el-container class="h-all">
    <el-header height="74px">
      <div class="header-left">
        <router-link to="/index"
          ><div class="header-logo">电力能源综合数字平台</div></router-link
        >
      </div>
      <div class="header-right"></div>
    </el-header>
    <!--内容-->
    <router-view />
  </el-container>
</template>

<script>
export default {
  name: "index",
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss"></style>
