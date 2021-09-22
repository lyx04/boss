// 日志查询
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/boss-admin`;
// 操作日志查询
export function GET_OPERLOG_LIST(query) {
  return request({
    url: `${service}/monitor/operlog/list?internet=no`,
    method: "GET",
    params: query,
  });
}

// 登录日志查询
export function GET_LOGININFOR_LIST(query) {
  return request({
    url: `${service}/monitor/logininfor/list?internet=no`,
    method: "GET",
    params: query,
  });
}
