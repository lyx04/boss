// 菜单管理
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/boss-admin`;
// 获取菜单下拉列表
export function GET_MENU_LIST(query) {
  return request({
    url: `${service}/system/menu/list?internet=no`,
    method: "GET",
    params: query,
  });
}

// 新增、修改菜单
export function ADD_EDITOR_SYSTEM_MENU(method, data) {
  return request({
    url: `${service}/system/menu`,
    method: method,
    data: data,
  });
}

// 根据菜单编号查询详情
export function GET_SYSTEM_MENU(id, query) {
  return request({
    url: `${service}/system/menu/${id}?internet=no`,
    method: "get",
    params: query,
  });
}

// 根据菜单编号删除
export function DELETE_SYSTEM_MENU(id) {
  return request({
    url: `${service}/system/menu/${id}`,
    method: "delete",
  });
}

// 获取菜单下拉列表
export function GET_MENU_TREESELECT(query) {
  return request({
    url: `${service}/system/menu/treeselect?internet=no`,
    method: "get",
    params: query,
  });
}

// 加载对应角色菜单列表树
export function GET_MENU_ROLE_TREESELECT(roleId) {
  return request({
    url: `${service}/system/menu/roleMenuTreeselect/${roleId}?internet=no`,
    method: "get",
  });
}
