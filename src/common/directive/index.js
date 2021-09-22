import hasPermi from "./hasPermi";
import preventReClick from "./btnDisabled";
const install = function (Vue) {
  Vue.directive("hasPermi", hasPermi);
  Vue.directive("preventReClick", preventReClick);
};
if (window.Vue) {
  window["hasPermi"] = hasPermi;
  window["preventReClick"] = preventReClick;
  Vue.use(install); // eslint-disable-line
}

export default install;
