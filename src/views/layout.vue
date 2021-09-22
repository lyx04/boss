<template>
  <div class="app-container">
    <v-header />
    <v-sidebar />
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
import vHeader from "@/common/components/Header";
import vSidebar from "@/common/components/Sidebar";
import vTags from "@/common/components/Tags.vue";

export default {
  name: "layout",
  components: {
    vHeader,
    vSidebar,
    vTags,
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  computed: {
    tagsList() {
      return this.$store.state.tagsList.map((item) => item.name);
    },
    collapse() {
      return this.$store.state.collapse;
    },
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
