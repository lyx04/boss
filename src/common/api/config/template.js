import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-maintain`;
// 模板管理----查询模板
export function GET_MAINTAIN_TEMPLATE() {
  return request({
    url: `${service}/maintain/template/query?internet=no`,
    method: "get",
  });
}

// 模板管理 ----- 新增模板
export function ADD_MAINTAIN_TEMPLATE(data) {
  return request({
    url: `${service}/maintain/template`,
    method: "post",
    data: data,
  });
}
