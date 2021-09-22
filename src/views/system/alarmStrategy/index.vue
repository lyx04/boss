<template>
  <div class="container">
    <user-alarm></user-alarm>
  </div>
</template>

<script>
import userAlarm from "./userAlarm";
export default {
  name: "index",
  components: {
    userAlarm,
  },
};
</script>

<style scoped></style>
