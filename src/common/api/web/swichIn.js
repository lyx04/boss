// 组织结构
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/swich-in`;
// 获取所属运营商
export function GET_OPER_LIST() {
  return request({
    url: `${service}/oper/select?internet=no`,
    method: "GET",
  });
}
