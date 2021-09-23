<template>
  <div class="app-container">
    <!-- <v-header />
    <v-sidebar /> -->
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <v-tags></v-tags>
      <div class="content">
        <transition name="fade-transform" mode="out-in">
          <keep-alive v-if="isRouterAlive">
            <router-view
              v-slot="{ Component }"
              :key="$route.path"
              v-if="isRouterAlive"
            >
              <component :is="Component" />
            </router-view>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "layout",

  data() {
    return {
      isRouterAlive: true,
    };
  },
};
</script>

<style scoped lang="scss"></style>
