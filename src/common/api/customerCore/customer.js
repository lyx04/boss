// 客户中心
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
const service_ema = `${url}/iemc-ema`;
const service_boss = `${url}/boss-admin`;

//获取客户列表
export function GET_CUSTOMER_LIST(data) {
  return request({
    method: "POST",
    params: data,
    url: `${service}/boss/clientManagement/loadClientManagementList?internet=no`,
  });
}
//修改客户状态
export function UPDATE_STATUS(orgid, status) {
  return request({
    url: `${service}/boss/clientManagement/updateStatus/${orgid}/${status}`,
    method: "PUT",
  });
}
//查看客户的详情
export function GET_CUSTOMER_VIEW(orgId) {
  return request({
    url: `${service}/boss/clientManagement/getClientManagementByOrgId/${orgId}?internet=no`,
    method: "GET",
  });
}
//获取客户的设备数量
export function GET_CUSTOMER_DEVICE(orgid) {
  return request({
    url: `${service_ema}/boss/customer/getRoomEquipmentByOrgId/${orgid}?internet=no`,
    method: "GET",
  });
}
//获取客户的接线图数量
export function GET_CUSTOMER_DIAGRAM(orgid) {
  return request({
    url: `${service_ema}/boss/customer/countDiagramByOrgId/${orgid}?internet=no`,
    method: "GET",
  });
}
//获取客户所有网关与最后通讯时间
export function GET_ORGGATEWAY(params) {
  return request({
    url: `${service_ema}/ema/monitor/gatewaybyorg?internet=no`,
    method: "GET",
    params: params,
  });
}

//获取企业或者配电室下含有某个测点的间隔信息
export function GET_INTERVAL_ELE_ID(params) {
  return request({
    url: `${service_ema}/dynamicEnvironment/getIntervalsByEleId?internet=no`,
    method: "GET",
    params: params,
  });
}

//获取具有下拉的监控设备列表
export function GET_METER_SELECT(id, category) {
  return request({
    url: `${service_ema}/ema/electricroom/querymeterselect/${id}/${category}?internet=no`,
    method: "get",
  });
}

//根据temp_code查询生效的模板
export function QUERY_BY_TEMPCODE(tempcode) {
  return request({
    url: `${service}/electricity/eleTemp/queryByTempCode/${tempcode}?internet=no`,
    method: "GET",
  });
}
//查询电价模板
export function QUERY_TEMP_BY_ORG(params) {
  return request({
    url: `${service}/electricity/eleTemp/quaryTempByOrg?internet=no`,
    method: "POST",
    data: params,
  });
}
//修改企业电费配置
export function UPDATE_ELEPRICES(params) {
  return request({
    url: `${service}/eleprices/config`,
    method: "POST",
    data: params,
  });
}
//查询企业电费配置详情
export function GET_ELEPRICES_DETAILS(params) {
  return request({
    url: `${service}/eleprices/config/details?internet=no`,
    method: "GET",
    params: params,
  });
}
//获取抄表日的企业配置详情
export function GET_ORG_SHARE(orgid) {
  return request({
    url: `${service}/system/config/company/getOrgShareByOrg/${orgid}?internet=no`,
  });
}

//查询分时方案列表
export function GET_PLAN_LIST(params) {
  return request({
    url: `${service}/system/config/plan/list?internet=no`,
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
//批量修改技术支持
export function UPDATE_TECHNICAL_SUPPORT(parentId, technicalSupportId, params) {
  return request({
    url: `${service}/boss/clientManagement/updateTechnicalSupport`,
    method: "POST",
    data: params,
    params: {
      parentId: parentId,
      technicalSupportId: technicalSupportId,
    },
  });
}
// 查询聚合商系数
export function GET_COEFFICIENT() {
  return request({
    url: `${service_boss}/system/org/getSendCoefficient?internet=no`,
    method: "get",
  });
}
//修改聚合商系数
export function UPDATE_COEFFICIENT(params) {
  return request({
    url: `${service_boss}/system/org/updateSendCoefficient`,
    method: "put",
    params: params,
  });
}
