import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-ema`;
// 查询参数列表
export function GET_EMA_EQUIPTYPE_LIST(query) {
  return request({
    url: `${service}/ema/equiptype/list`,
    method: "get",
    params: query,
  });
}

// 新增参数
export function ADD_EMA_EQUIPTYPE(query) {
  return request({
    url: `${service}/ema/equiptype/add`,
    method: "get",
    params: query,
  });
}

// 修改参数
export function UPDATE_EMA_EQUIPTYPE(query) {
  return request({
    url: `${service}/ema/equiptype/update`,
    method: "put",
    data: query,
  });
}

// 删除参数
export function DELETE_EMA_EQUIPTYPE(id) {
  return request({
    url: `${service}/ema/equiptype/del/${id}`,
    method: "delete",
  });
}
