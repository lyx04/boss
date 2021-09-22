import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import injectFilters from "./common/filters";
import { iconfontUrl, iconfontVersion } from "@/common/config/env";
import { loadStyle } from "@/common/util/util";
import "@/common/assets/css/index.scss";
import VueAMap from "vue-amap";
import { encode, decode } from "js-base64";
// import "./common/directive/hasPermi";
import directive from "./common/directive";
import {
  resetForm,
  handleTree,
  compare,
  addDateRange,
} from "@/common/util/hlcx";

// 地图
Vue.use(VueAMap);
// 地图
VueAMap.initAMapApiLoader({
  key: "548152141dc625e4768f56722e253f50",
  plugin: [
    "AMap.Autocomplete",
    "AMap.PlaceSearch",
    "AMap.Scale",
    "AMap.OverView",
    "AMap.ToolBar",
    "AMap.MapType",
    "AMap.Geolocation",
    "AMap.Geocoder",
    "AMap.AMapManager",
    "AMap.Marker",
    "AMap.MarkerClusterer",
  ],
  v: "1.4.4", //版本
  uiVersion: "1.0", //ui版本
});

Vue.config.productionTip = false;
// 自定义指令
Vue.use(directive);
//Element
Vue.use(Element);
// 全局过滤器
injectFilters(Vue);
// iconfont
iconfontVersion.forEach((ele) => {
  loadStyle(iconfontUrl.replace("$key", ele));
});

// 全局方法挂载
Vue.prototype.encode = encode;
Vue.prototype.decode = decode;
Vue.prototype.resetForm = resetForm;
Vue.prototype.handleTree = handleTree;
Vue.prototype.compare = compare;
Vue.prototype.addDateRange = addDateRange;

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
Vue.directive("focus", function (el, option) {
  var defClass = "el-textarea",
    defTag = "textarea";
  var value = option.value || true;
  if (typeof value === "boolean")
    value = { cls: defClass, tag: defTag, foc: value };
  else
    value = {
      cls: value.cls || defClass,
      tag: value.tag || defTag,
      foc: value.foc || false,
    };
  if (el.classList.contains(value.cls) && value.foc)
    setTimeout(() => {
      el.getElementsByTagName(value.tag)[0].focus();
    }, 500);
});
window.appvue = new Vue({
  router,
  store,
  render: (h) => h(App),
  multihtmlCache: true,
}).$mount("#apps");
