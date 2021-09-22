// 组织结构
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/boss-admin`;
// 获取部门列表
export function GET_SYSTEM_DEPT_LIST(query) {
  return request({
    url: `${service}/system/dept/list?internet=no`,
    method: "GET",
    params: query,
  });
}

// 新增、修改部门
export function ADD_EDITOR_DEPT(method, data) {
  return request({
    url: `${service}/system/dept`,
    method: method,
    data: data,
  });
}

// 根据部门编号获取详细信息
export function GET_DEPT_ID(deptId) {
  return request({
    url: `${service}/system/dept/${deptId}?internet=no`,
    method: "get",
  });
}
// 删除部门
export function DELETE_DEPT(deptId) {
  return request({
    url: `${service}/system/dept/${deptId}`,
    method: "DELETE",
  });
}

// 获取部门下拉树列表
export function GET_DEPT_TREESELECT(query) {
  return request({
    url: `${service}/system/dept/treeselect?internet=no`,
    method: "GET",
    params: query,
  });
}
