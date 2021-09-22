/**
 @name: 全局过滤器
 @description:
 @developer:  闫海军
 **/
/* eslint-disable no-undef */
// import Vue from "vue";
// 省略号
import ellipsis from "./ellipsis";

const injectFilters = () => {
  Vue.filter("ellipsis", ellipsis);
};

export default injectFilters;
