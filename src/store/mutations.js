export const loadingStatus = (state, user) => {
  state.loading = user;
};
export const dictStatus = (state, user) => {
  state.dict = user;
};
export const headerListStatus = (state, user) => {
  state.headerList = user;
};
export const indexIdStatus = (state, user) => {
  state.indexId = user;
};

export const delTagsItem = (state, data) => {
  state.tagsList.splice(data.index, 1);
};

export const setTagsItem = (state, data) => {
  state.tagsList.push(data);
};

export const clearTags = (state) => {
  state.tagsList = [];
};
export const closeTagsOther = (state, data) => {
  state.tagsList = data;
};

// 侧边栏折叠
export const hadndleCollapse = (state, data) => {
  state.collapse = data;
};
