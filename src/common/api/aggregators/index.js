// 客户中心
import request from "@/common/util/request";

const url = `${process.env.VUE_APP_BASE_URL}`;
const service_boss = `${url}/boss-admin`;

// 查询聚合商系数
export function GET_COEFFICIENT() {
  return request({
    url: `${service_boss}/system/org/getSendCoefficient?internet=no`,
    method: "get",
  });
}
//修改聚合商系数
export function UPDATE_COEFFICIENT(data) {
  return request({
    url: `${service_boss}/system/org/updateSendCoefficient`,
    method: "put",
    params: data,
  });
}
