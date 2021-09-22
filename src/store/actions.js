// 字典
export const setDict = ({ commit }, state) => {
  commit("dictStatus", state);
};
// 导航
export const setHeaderList = ({ commit }, state) => {
  commit("headerListStatus", state);
};
// 导航选中id
export const setindexId = ({ commit }, state) => {
  commit("indexIdStatus", state);
};
// loading
export const setloading = ({ commit }, user) => {
  commit("loadingStatus", user);
};
