// 组织结构
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
// 获取组织结构列表
export function GET_SYSTEM_ORG_LIST(query) {
  return request({
    url: `${service}/system/org/list?internet=no`,
    method: "GET",
    params: query,
  });
}
// 获取组织结构列表树
export function GET_SYSTEM_ORG_TREESELECT(query) {
  return request({
    url: `${service}/system/org/treeselect?internet=no`,
    method: "GET",
    params: query,
  });
}
// 获取组织机构详细信息
export function GET_SYSTEM_ORG(orgId) {
  return request({
    url: `${service}/system/org/${orgId}?internet=no`,
    method: "GET",
  });
}

// 添加组织
export function ADD_ORG(method, data, isUpdateAddInfo) {
  return request({
    url: `${service}/system/org?isUpdateAddInfo=${isUpdateAddInfo}`,
    method: method,
    data: data,
  });
}
//编辑组织
export function EDITOR_ORG(method, data, isUpdateAddInfo) {
  return request({
    url: `${service}/system/org?isUpdateAddInfo=${isUpdateAddInfo}`,
    method: method,
    data: data,
  });
}
//删除组织
export function DELETE_ORG(orgId) {
  return request({
    url: `${service}/system/org/${orgId}`,
    method: "delete",
  });
}
//获取组织机构相信信息
export function GET_ORG(orgId) {
  return request({
    url: `${service}/system/org/${orgId}?internet=no`,
    method: "get",
  });
}

// 查询用户列表
export function GET_USER_LIST(data) {
  return request({
    url: `${service}/system/user/list?internet=no`,
    method: "get",
    params: data,
  });
}

// 查询组织下的当前用户列表和技术支持
export function GET_ORGID_USER_LIST(orgId) {
  return request({
    url: `${service}/system/user/quaryUserInfoByOrgId/${orgId}?internet=no`,
    method: "GET",
  });
}
