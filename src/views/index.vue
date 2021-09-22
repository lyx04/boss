<template>
  <div class="translation"></div>
</template>

<script>
export default {
  name: "index",
};
</script>

<style scoped lang="scss">
.translation {
  width: 100%;
  height: 100%;
  position: relative;
  background: #ffffff;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 800px;
    height: 240px;
    background: url("../common/assets/img/common/translation.png") no-repeat;
    background-size: 100% 100%;
  }
}
</style>
