import request from "@/common/util/request";
import axios from "axios";
const url = `${process.env.VUE_APP_BASE_URL}`;
const service = `${url}/iemc-oss`;
// 上传文件
export function uploadFile(data, customname) {
  if (customname) {
    data.set("filename", customname);
  } else {
    let name = data.get("file").name;
    data.set("filename", new Date().getTime() + "~" + name);
  }
  return request({
    url: `${service}/minio/uploadFileForWeb`,
    method: "post",
    data: data,
    timeout: null,
  });
}

//版本管理上传
export function VersionUpload(data, progress, cancel) {
  const CancelToken = axios.CancelToken;
  let name = data.get("file").name;
  data.set("filename", new Date().getTime() + "~" + name);
  return request({
    url: `${service}/minio/uploadFileForAndroid`,
    method: "post",
    data: data,
    timeout: null,
    loading: false,
    onUploadProgress: progress ? progress : "",
    cancelToken: new CancelToken(cancel),
  });
}
