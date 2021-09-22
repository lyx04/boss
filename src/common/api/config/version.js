import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;

// 获取版本列表
export function GET_VERSION_LIST(params) {
  return request({
    url: `${service}/appinfo/version/list`,
    method: "GET",
    params: params,
  });
}
// 新增版本
export function ADD_VERSION(params) {
  return request({
    url: `${service}/appinfo/version`,
    method: "POST",
    data: params,
  });
}
//修改版本信息
export function EDIT_VERSION(params) {
  return request({
    url: `${service}/appinfo/version`,
    method: "put",
    data: params,
  });
}
//获取详细信息
export function GET_VERSION_DETAILE(versioncode, systemtype) {
  return request({
    url: `${service}/appinfo/version/${versioncode}/${systemtype}`,
    method: "GET",
  });
}
//删除版本信息
export function DELECT_VERSION(ids) {
  return request({
    url: `${service}/appinfo/version/${ids}`,
    method: "DELETE",
  });
}
