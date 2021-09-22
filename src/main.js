import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { iconfontUrl, iconfontVersion } from "@/common/config/env";
import { loadStyle } from "@/common/util/util";
import "@/common/assets/css/index.scss";

Vue.config.productionTip = false;
//Element
Vue.use(Element);
// iconfont
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

// sessionStorage
Vue.prototype.resetSetItem = function (key, newVal) {
  // 创建一个StorageEvent事件
  var newStorageEvent = document.createEvent("StorageEvent");
  const storage = {
    setItem: function (k, val) {
      sessionStorage.setItem(k, val);

      // 初始化创建的事件
      newStorageEvent.initStorageEvent(
        "setItem",
        false,
        false,
        k,
        null,
        val,
        null,
        null
      );

      // 派发对象
      window.dispatchEvent(newStorageEvent);
    },
  };
  return storage.setItem(key, newVal);
};
window.appvue = new Vue({
  router,
  store,
  render: (h) => h(App),
  multihtmlCache: true,
}).$mount("#app");
