// 数据补录
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
const ema = `${url}/iemc-ema`;
const switchIn = `${url}/swich-in`;
//获取客户列表
export function GET_CUSTOMER_LIST(data) {
  return request({
    method: "POST",
    params: data,
    url: `${service}/boss/clientManagement/loadClientManagementList`,
  });
}

//获取企业的5分钟负荷
export function GET_ORG_FIVEMINUTE(data) {
  return request({
    method: "GET",
    params: data,
    url: `${switchIn}/controlOrgDate/loadPByFiveMinute`,
  });
}
//数据采集补录
export function SET_FIVE_MINUTE(data) {
  return request({
    method: "POST",
    data: data,
    url: `${switchIn}/controlOrgDate/replenishPByFiveMinute`,
  });
}

// 懒加载设备树
export function GET_TREE(data) {
  return request({
    url: `${ema}/ema/electricroom/queryeleroomtree/${data}?internet=no`,
    method: "get",
  });
}

//获取企业或者配电室下含有某个测点的间隔信息
export function GET_INTERVAL_ELE_ID(params) {
  return request({
    url: `${ema}/dynamicEnvironment/getIntervalsByEleId`,
    method: "GET",
    params: params,
  });
}

//获取聚合商自动补录的开关
export function GET_CLEARING() {
  return request({
    url: `${switchIn}/controllConfig/getClearing`,
    method: "GET",
  });
}

// 修改补录开关
export function UPDATA_CLEARING(params) {
  return request({
    url: `${switchIn}/controllConfig/updateClearing`,
    method: "PUT",
    params: params,
  });
}
