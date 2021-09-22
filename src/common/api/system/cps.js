// 映射关系
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const ema = `${url}/iemc-ema`;
const service = `${url}/swich-in`;
//获取企业下配电室、变压器、间隔的信息
export function GET_ORG_DEV(params) {
  return request({
    url: `${ema}/dynamicEnvironment/getIntervalsByEleId`,
    method: "get",
    params: params,
  });
}
//删除设备
export function DELETE_DEV(id) {
  return request({
    url: `${service}/cpsIemcDev/${id}`,
    method: "delete",
  });
}
//获取量测量列表
export function GET_IEMC_SIGHT(params) {
  return request({
    url: `${service}/cpsIemcSight`,
    method: "get",
    params: params,
  });
}
//获取cps组织用户
export function GET_CPS_ORG(params) {
  return request({
    url: `${service}/cpsIemcOrg`,
    method: "get",
    params: params,
  });
}
//批量新增设备
export function ADD_DEV_CPS(params) {
  return request({
    url: `${service}/cpsIemcDev`,
    method: "POST",
    data: params,
  });
}
//获取设备的未绑定的量测量
export function GET_IEMCDEVSIGHT_MEASURELIST(params) {
  return request({
    url: `${service}/cpsIemcDevSight/addMeasureList`,
    method: "get",
    params: params,
  });
}
//获取设备绑定的量测量
export function GET_IEMC_DEV_MEASURE(params) {
  return request({
    url: `${service}/cpsIemcDevSight`,
    method: "get",
    params: params,
  });
}
//新增设备的量测量
export function SET_CPS_DEV_MEASURE(params) {
  return request({
    url: `${service}/cpsIemcDevSight`,
    data: params,
    method: "post",
  });
}
//删除设备绑定的量测量
export function DELETE_DEV_MEASURE(params) {
  return request({
    url: `${service}/cpsIemcDevSight`,
    method: "DELETE",
    params: params,
  });
}
//修改设备信息
export function UPDATE_DEV_INFO(params) {
  return request({
    url: `${service}/cpsIemcDev`,
    method: "PUT",
    params: params,
  });
}
//获取设备接口
export function GET_CPSIEMC_DEV(params) {
  return request({
    url: `${service}/cpsIemcDev`,
    method: "get",
    params: params,
  });
}
//批量重置测点
export function RESET_MEASURE(params) {
  return request({
    url: `${service}/cpsIemcDev/resetMeasure`,
    method: "post",
    data: params,
  });
}
//--------------量测量映射-------------------

//量测量映射列表
export function GET_CPS_IEMC_SIGHT(params) {
  return request({
    url: `${service}/cpsIemcSight`,
    method: "GET",
    params: params,
  });
}

// 批量新增量测量映射
export function ADD_ALL_CPS_IEMC_SIGHT(data) {
  return request({
    url: `${service}/cpsIemcSight`,
    method: "POST",
    data: data,
  });
}

// 修改量测量映射
export function PUT_CPS_IEMC_SIGHT(data) {
  return request({
    url: `${service}/cpsIemcSight`,
    method: "PUT",
    data: data,
  });
}

// 删除量测量映射
export function DELETE_CPS_IEMC_SIGHT(id) {
  return request({
    url: `${service}/cpsIemcSight/${id}`,
    method: "delete",
  });
}

//-------------企业编码--------------------
// 企业编码列表
export function GET_CPS_IEMC_ORG(params) {
  return request({
    url: `${service}/cpsIemcOrg`,
    method: "GET",
    params: params,
  });
}

// 批量新增企业编码
export function ADD_ALL_CPS_IEMC_ORG(data) {
  return request({
    url: `${service}/cpsIemcOrg`,
    method: "POST",
    data: data,
  });
}

// 修改企业编码
export function PUT_CPS_IEMC_ORG(data) {
  return request({
    url: `${service}/cpsIemcOrg`,
    method: "PUT",
    data: data,
  });
}

// 删除企业编码
export function DELETE_CPS_IEMC_ORG(id) {
  return request({
    url: `${service}/cpsIemcOrg/${id}`,
    method: "delete",
  });
}
