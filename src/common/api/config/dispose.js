// 配置管理
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
//查询企业列表
export function GET_COMPANY_LIST(params) {
  return request({
    url: `${service}/system/config/company/list`,
    method: "get",
    params: params,
  });
}
//修改抄表日
export function UPDATE_COMPANY(params) {
  return request({
    url: `${service}/system/config/company/update`,
    method: "put",
    data: params,
  });
}
//查询分时方案列表
export function GET_PLAN_LIST(params) {
  return request({
    url: `${service}/system/config/plan/list`,
    method: "get",
    params: params,
  });
}
//删除分时方案
export function DELECT_PLAN(id) {
  return request({
    url: `${service}/system/config/plan/delete/${id}`,
    method: "delete",
  });
}
//查询当前方案的分时列表
export function GET_PLAN_QUERY(id) {
  return request({
    url: `${service}/system/config/plan/query/${id}`,
    method: "get",
  });
}
//修改分时方案
export function UPDATE_PLAN(params) {
  return request({
    url: `${service}/system/config/plan/update`,
    method: "put",
    data: params,
  });
}
//新增分时方案
export function ADD_PLAN(params) {
  return request({
    url: `${service}/system/config/plan`,
    method: "post",
    data: params,
  });
}
