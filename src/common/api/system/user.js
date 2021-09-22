// 用户管理
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/boss-admin`;
const client_service = `${url}/iemc-system`;
// 查询原始密码是否正确
export function GET_CHECKPWD(data) {
  return request({
    url: `${service}/system/user/checkpwd?internet=no`,
    method: "post",
    data: data,
  });
}

// 修改原始密码
export function PUT_PWD(data) {
  return request({
    url: `${service}/system/user/resetPwd`,
    method: "put",
    data: data,
  });
}
// ----------------------------------------------------------
// 查询用户列表
export function GET_USER_LIST(data) {
  return request({
    url: `${service}/system/user/list?internet=no`,
    method: "get",
    params: data,
  });
}

// 根据用户编号获取详细信息
export function GET_USER(userId) {
  return request({
    url: `${service}/system/user/${userId}?internet=no`,
    method: "get",
  });
}

// 新增、编辑用户
export function ADD_EDITOR_USER(method, data) {
  return request({
    url: `${service}/system/user`,
    method: method,
    data: data,
  });
}

// 删除用户
export function DELETE_USER(userId) {
  return request({
    url: `${service}/system/user/${userId}`,
    method: "delete",
  });
}

// 修改用户状态
export function PUT_CHANGE_STATUS(data) {
  return request({
    url: `${service}/system/user/changeStatus`,
    method: "put",
    data: data,
  });
}

// 检查是否是超管
export function GET_CHECK_USER(userId) {
  return request({
    url: `${service}/system/user/checkUser/${userId}`,
    method: "GET",
  });
}

// 查询组织下的当前用户列表和技术支持
export function GET_ORGID_USER_LIST(orgId) {
  return request({
    url: `${service}/system/user/quaryUserInfoByOrgId/${orgId}`,
    method: "GET",
  });
}

// 查询用户端组织下的当前用户列表和技术支持
export function GET_CLIENT_ORGID_USER_LIST(orgId) {
  return request({
    url: `${client_service}/system/user/quaryUserInfoByOrgId/${orgId}`,
    method: "GET",
  });
}
