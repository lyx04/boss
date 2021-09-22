import { connect } from "mqtt";
var client;
export function mqConnect() {
  return new Promise(resolve => {
    const IS_HTTPS = document.location.protocol.includes("https"); //容错 http https
    const wsProtocol = IS_HTTPS ? "wss://" : "ws://";
    client = connect(wsProtocol + process.env.VUE_APP_WS + "/mqtt", {
      clean: true, // 保留回话
      // 认证信息
      clientId:
        "web_" +
        Math.random()
          .toString(16)
          .substr(2, 8),
      username: "hlcx",
      password: "hlcx"
    });
    Vue.prototype.mqttClient = client;
    client.on("reconnect", error => {
      console.log("正在重连:", error);
    });
    client.on("connect", () => {
      resolve();
    });
    client.on("error", error => {
      console.log("连接失败:", error);
    });
    client.on("close", () => {});
  });
}
