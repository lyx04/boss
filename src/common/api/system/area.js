// 区域管理
import request from "@/common/util/request";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-system`;
// 获取区域下拉树列表
export function GET_AREA_TREE() {
  return request({
    url: `${service}/system/area/tree?internet=no`,
    method: "GET",
  });
}

//新增区域信息
export function NEW_AREA(data) {
  return request({
    url: `${service}/system/area`,
    method: "POST",
    data: data,
  });
}

//修改区域信息
export function PUT_AREA(data) {
  return request({
    url: `${service}/system/area`,
    method: "put",
    data: data,
  });
}

//查询区域信息
export function GET_AREA_INFO(areaId) {
  return request({
    url: `${service}/system/area/${areaId}?internet=no`,
    method: "get",
  });
}

//删除区域信息
export function DELETE_AREA(areaId) {
  return request({
    url: `${service}/system/area/${areaId}`,
    method: "delete",
  });
}
