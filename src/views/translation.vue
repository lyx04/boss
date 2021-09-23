<template>
  <el-container class="h-all">
    <el-header height="74px">
      <div class="header-left">
        <router-link to="/index"
          ><div class="header-logo">电力能源综合数字平台</div></router-link
        >
        <head-nav></head-nav>
      </div>
      <div class="header-right">
        <head-user-info></head-user-info>
      </div>
    </el-header>
    <div class="translation"></div>
  </el-container>
</template>

<script>
export default {
  name: "translation",
};
</script>

<style scoped lang="scss">
.translation {
  width: 100%;
  height: 100%;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 50%;
    height: 50%;
    background-size: 100% 100%;
  }
}
</style>
