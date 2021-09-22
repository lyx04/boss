/* eslint-disable no-undef */
// import Vue from "vue";
// import axios from "axios";
import { Message } from "element-ui";
import errorCode from "@/common/util/errorCode";
import store from "../../store";

var needLoadingRequestCount = 0; //当前正在请求的数量

function showLoading() {
  needLoadingRequestCount++;
  store.dispatch("setloading", true);
}
function closeLoading() {
  Vue.nextTick(() => {
    // 以服务的方式调用的 Loading 需要异步关闭
    needLoadingRequestCount--;
    if (needLoadingRequestCount <= 0) {
      store.dispatch("setloading", false);
      needLoadingRequestCount = 0;
    }
  });
}
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: process.env.VUE_APP_BASE_API,
  // 超时
  timeout: 15000,
});
// request拦截器
var token;
if (sessionStorage.getItem("access_token")) {
  token = "Bearer " + JSON.parse(sessionStorage.getItem("access_token"));
} else {
  token = null;
}
axios.defaults.headers["Content-Type"] = token
  ? "application/json;charset=utf-8"
  : "application/x-www-form-urlencoded";
service.interceptors.request.use(
  (config) => {
    if (sessionStorage.getItem("access_token")) {
      token = "Bearer " + JSON.parse(sessionStorage.getItem("access_token"));
    } else {
      token = null;
    }
    config.headers["Authorization"] = token
      ? token
      : "Basic Ym9zc3dlYjoxMjM0NTY=";
    config.loading == false ? "" : showLoading();
    return config;
  },
  (error) => {
    closeLoading();
    Promise.reject(error);
  }
);
// 响应拦截器
service.interceptors.response.use(
  (res) => {
    closeLoading();
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode["default"];
    if (code === 5000) {
      Message({
        message: msg,
        type: "error",
      });
      window.appvue.$router.replace({
        path: "/login",
        query: {
          redirect: window.appvue.$router.currentRoute.fullPath,
        },
      });
    } else if (code === 1002 || code === 1003 || code === 4005) {
      Message({
        message: msg,
        type: "error",
      });
      //这里直接报错有可能影响程序停止
      return Promise.reject(new Error(msg));
    } else if (code !== 200) {
      Message({
        message: msg,
        type: "error",
      });
      //这里直接报错有可能影响程序停止
      return Promise.reject(new Error(msg));
    } else {
      return res.data;
    }
  },
  (error) => {
    closeLoading();
    let { message } = error;
    if (error.response && error.response.status == "401") {
      if (error.response.data && error.response.data.code == 500) {
        message = error.response.data.message;
      } else {
        message = "暂无权限，请重新登录！";
        setTimeout(function () {
          window.appvue.$router.replace({
            path: "/login",
          });
        }, 2000);
      }
    } else if (error.response && error.response.status == "500") {
      message =
        error.response.data.message ||
        error.response.data.msg ||
        error.response.data.error_description;
    } else if (error.response && error.response.status == "403") {
      message =
        error.response.data.message ||
        error.response.data.msg ||
        error.response.data.error_description;
    } else if (message == "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = "系统接口" + message.substr(message.length - 3) + "异常";
    }
    if (error.response.data.code != 7003) {
      Message({
        message: message || "系统错误，请联系管理员",
        type: "error",
        duration: 2 * 1000,
      });
    }

    return Promise.reject(error);
  }
);

export default service;
