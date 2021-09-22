// app应用管理
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
// 获取菜单下拉列表
export function GET_APPINFO_MENU_LIST(query) {
  return request({
    url: `${service}/appinfo/appmodel/list?internet=no`,
    method: "GET",
    params: query,
  });
}

// 新增、修改菜单
export function ADD_APPINFO_EDITOR_SYSTEM_MENU(method, data) {
  return request({
    url: `${service}/appinfo/appmodel`,
    method: method,
    data: data,
  });
}

// 根据菜单编号查询详情
export function GET_APPINFO_SYSTEM_MENU(id, query) {
  return request({
    url: `${service}/appinfo/appmodel/${id}?internet=no`,
    method: "get",
    params: query,
  });
}

// 根据菜单编号删除
export function DELETE_APPINFO_SYSTEM_MENU(id) {
  return request({
    url: `${service}/appinfo/appmodel/${id}`,
    method: "delete",
  });
}

// 获取菜单下拉列表
export function GET_APPINFO_MENU_TREESELECT() {
  return request({
    url: `${service}/appinfo/appmodel/treeselect?internet=no`,
    method: "get",
  });
}

// 加载对应角色菜单列表树
export function GET_APPINFO_MENU_ROLE_TREESELECT(roleId) {
  return request({
    url: `${service}/appinfo/appmodel/roleMenuTreeselect/${roleId}?internet=no`,
    method: "get",
  });
}
