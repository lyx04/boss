import Vue from "vue";
import Vuex from "vuex";

import * as getters from "./getters";
import * as mutations from "./mutations";
import * as actions from "./actions";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loading: false, // 加载中。。。。
    dict: {}, // 字典
    headerList: [], // 导航
    indexId: [], // 选中的导航，
    tagsList: [],
    collapse: false,
  },
  getters,
  mutations,
  actions,
});
