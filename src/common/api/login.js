import request from "@/common/util/request";
const url = `${process.env.VUE_APP_LOGIN_URL}`;
const service = `${url}/iemc-auth`;
// 登录方法
export function login(data) {
  return request({
    url: `${service}/oauth/token`,
    method: "post",
    data: data,
  });
}
// 退出方法
export function logout() {
  return request({
    url: `${service}/sys/logout`,
    method: "post",
  });
}
