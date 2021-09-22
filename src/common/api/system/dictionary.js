import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
// 字典类型列表
export function GET_DICT_LIST(query) {
  return request({
    url: `${service}/system/dict/type/list?internet=no`,
    method: "GET",
    params: query,
  });
}
// 新增或者修改数据类型
export function ADD_DICT_TYPE(method, data) {
  return request({
    url: `${service}/system/dict/type`,
    method: method,
    data: data,
  });
}
// 删除字典类型
export function DELETE_DICT_TYPE(id) {
  return request({
    url: `${service}/system/dict/type/${id}`,
    method: "delete",
  });
}
// ----------------------------------------------------------
// 字典数据列表
export function GET_DICT_DATA_TYPE(query) {
  return request({
    url: `${service}/system/dict/data/type/${query}?internet=no`,
    method: "GET",
  });
}

// 新增、修改字典数据列表
export function ADD_EDITOR_DICT_DATA_TYPE(method, data) {
  return request({
    url: `${service}/system/dict/data`,
    method: method,
    data: data,
  });
}
// 删除字典数据
export function DELETE_DICT_DATA(type, id) {
  return request({
    url: `${service}/system/dict/data/${type}/${id}`,
    method: "delete",
  });
}

// 全部字典数据列表
export function GET_ALL_DICT_DATA_LIST() {
  return request({
    url: `${service}/system/dict/data/list?internet=no`,
    method: "GET",
  });
}
