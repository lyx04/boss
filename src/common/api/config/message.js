// 消息配置
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const message = `${url}/iemc-message`;
var userinfo = JSON.parse(sessionStorage.getItem("userInfo"));
//获取全部消息分类
export function GET_TYPE_ALl() {
  var params = {
    tenantId: userinfo.tenantId,
  };
  return request({
    url: `${message}/type/select`,
    params: params,
    method: "get",
  });
}
//消息分类列表
export function GET_MESSAGE_TYPE(params = {}) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/type`,
    params: params,
    method: "get",
  });
}
//新增消息类型
export function ADD_MESSAGE_TYPE(params) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/type`,
    params: params,
    method: "post",
  });
}
//修改消息类型
export function UPDATE_MESSAGE_TYPE(params = {}) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/type`,
    params: params,
    method: "put",
  });
}

//查询消息类型
export function GET_MESSAGE_TYPE_INFO(id) {
  var params = {
    tenantId: userinfo.tenantId,
  };
  return request({
    url: `${message}/type/${id}`,
    params: params,
    method: "get",
  });
}
//删除消息类型
export function DELETE_MESSAGE_TYPE(id) {
  var params = {
    tenantId: userinfo.tenantId,
  };
  return request({
    url: `${message}/type/${id}`,
    params: params,
    method: "delete",
  });
}

//消息模板列表
export function GET_TEMPLATE_TYPE(params = {}) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/config`,
    params: params,
    method: "get",
  });
}
//新增消息模板
export function ADD_TEMPLATE_TYPE(params) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/config`,
    params: params,
    method: "post",
  });
}
//修改消息模板
export function UPDATE_TEMPLATE_TYPE(params = {}) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/config`,
    params: params,
    method: "put",
  });
}

//查询消息模板
export function GET_TEMPLATE_TYPE_INFO(id) {
  var params = {
    tenantId: userinfo.tenantId,
  };
  return request({
    url: `${message}/config/${id}`,
    params: params,
    method: "get",
  });
}
//删除消息模板
export function DELETE_TEMPLATE_TYPE(id) {
  var params = {
    tenantId: userinfo.tenantId,
  };
  return request({
    url: `${message}/config/${id}`,
    params: params,
    method: "delete",
  });
}

//获取全部消息模板
export function GET_TEMPLATE_ALl(params) {
  params["tenantId"] = userinfo.tenantId;

  return request({
    url: `${message}/config/select`,
    params: params,
    method: "get",
  });
}
//获取消息列表
export function GET_MESSAGE_LIST(params) {
  params["tenantId"] = userinfo.tenantId;
  return request({
    url: `${message}/message/user/list`,
    params: params,
    method: "get",
  });
}

//消息标记已读
export function MESSSAGE_USER(params) {
  return request({
    url: `${message}/message/user?userId=${params.userId ? params.userId : ""}`,
    data: params.ids ? params.ids : [],
    method: "put",
  });
}

//删除消息
export function MESSSAGE_USER_DELETE(params) {
  return request({
    url: `${message}/message/user`,
    data: params,
    method: "delete",
  });
}
