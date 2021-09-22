// 角色
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/boss-admin`;
// 查询角色列表
export function GET_SYSTEM_ROLE_LIST(query) {
  return request({
    url: `${service}/system/role/list?internet=no`,
    method: "GET",
    params: query,
  });
}
// 新增、修改角色
export function ADD_EDITOR_SYSTEM_ROLE(method, data) {
  return request({
    url: `${service}/system/role`,
    method: method,
    data: data,
  });
}

// 根据角色编号获取详细信息
export function GET_SYSTEM_ROLE_ID(id) {
  return request({
    url: `${service}/system/role/${id}?internet=no`,
    method: "get",
  });
}

// 删除角色
export function DELETE_SYSTEM_ROLE_ID(id) {
  return request({
    url: `${service}/system/role/${id}`,
    method: "delete",
  });
}
