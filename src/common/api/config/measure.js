import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-ema`;
// 查询量测量列表
export function GET_EMA_MPARAM_LIST(data) {
  return request({
    url: `${service}/ema/mparam/treeId`,
    method: "POST",
    data: data,
  });
}
// 查询对应量测量类型
export function GET_EMA_MPARAM_TYPE_LIST(type) {
  return request({
    url: `${service}/ema/mparam/{treeId}?type=${type}`,
    method: "POST",
  });
}

// 新增量测量
export function ADD_EMA_MPARAM(data) {
  return request({
    url: `${service}/ema/mparam/batchAdd`,
    method: "POST",
    data: data,
  });
}

// 修改量测量
export function EDITOR_EMA_MPARAM(data) {
  return request({
    url: `${service}/ema/mparam/update`,
    method: "POST",
    data: data,
  });
}

// 删除量测量
export function DELETE_EMA_MPARAM(data) {
  return request({
    url: `${service}/ema/mparam/del`,
    method: "delete",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  });
}
// 按名称或者标识查询量测量
export function GET_EMA_MPARAM_QUERYPARAM(data) {
  return request({
    url: `${service}/ema/mparam/queryParam`,
    method: "get",
    params: data,
  });
}

//-----------------------------------------------------
// 厂家列表
export function GET_EMA_FACTORY(data) {
  return request({
    url: `${service}/ema/factory?internet=no`,
    method: "get",
    params: data,
  });
}

// 新增厂家名称
export function ADD_EMA_FACTORY(data) {
  return request({
    url: `${service}/ema/factory/add`,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  });
}

// 修改厂家名称
export function UPDATE_EMA_FACTORY(data) {
  return request({
    url: `${service}/ema/factory/update`,
    method: "put",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  });
}

// 删除厂家
export function DELETE_EMA_FACTORY(id) {
  return request({
    url: `${service}/ema/factory/del/${id}`,
    method: "delete",
  });
}
//---------------------------------------------------------

// 厂家-量测量映射关系列表
export function GET_EMA_FACTORY_BINDLIST(data) {
  return request({
    url: `${service}/ema/factory/bindList`,
    method: "get",
    params: data,
  });
}
// 新增映射关系表
export function ADD_EMA_FACTORY_BATCHADD(data) {
  return request({
    url: `${service}/ema/factory/batchAdd`,
    method: "post",
    data: data,
  });
}
// 修改映射关系表
export function UPDATE_EMA_FACTORY_PFUPDATE(data) {
  return request({
    url: `${service}/ema/factory/pfUpdate`,
    method: "put",
    data: data,
  });
}
// 删除映射关系表
export function DELETE_EMA_FACTORY_PFDEL(data) {
  return request({
    url: `${service}/ema/factory/pfdel`,
    method: "delete",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  });
}

// 查询参数管理、量测量树结构
export function GET_EMA_TREE_LIST(treeId, query) {
  return request({
    url: `${service}/ema/tree/${treeId}`,
    method: "get",
    params: query,
  });
}

// 增加节点参数管理、量测量
export function ADD_EMA_TREE(data) {
  return request({
    url: `${service}/ema/tree/addNode`,
    method: "post",
    data: data,
  });
}

// 修改节点参数管理、量测量
export function EDITOR_EMA_TREE(data) {
  return request({
    url: `${service}/ema/tree/updateNode`,
    method: "post",
    data: data,
  });
}
