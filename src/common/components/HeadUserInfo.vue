<template>
  <div>
    <div class="header-user-info">
      <ul>
        <li class="header-user-info-item">
          <div class="info-content">
            <el-dropdown @command="changeCommand">
              <div style="cursor: pointer;">
                <i class="iconfont icon-icontouxiang header-icon"></i>
                <span>{{ userInfo.nickName || "--" }}</span>
                <em class="el-icon-arrow-down"></em>
              </div>
              <el-dropdown-menu
                slot="dropdown"
                class="userInfo-dropdown-menu"
                popper-append-to-body="false"
              >
                <el-dropdown-item command="1">修改密码</el-dropdown-item>
                <el-dropdown-item command="2">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </li>
        <li class="header-user-info-item">
          <!---->
          <div class="info-content" id="myPanel">
            <el-badge :is-dot="isDot">
              <i
                class="el-icon-message-solid header-icon"
                @click="messageModal"
              ></i>
              <!--消息弹框messageModal-->
              <div class="message-content" v-if="messageIsShowModal">
                <div class="message-list">
                  <ul v-if="messageTotal > 0">
                    <li v-for="(item, index) in messageList" :key="index">
                      <el-tooltip
                        :content="item.content"
                        :disabled="
                          item.content && item.content.length > 40
                            ? false
                            : true
                        "
                        class="item"
                        effect="dark"
                        :visible-arrow="false"
                        :open-delay="1000"
                        placement="bottom"
                      >
                        <span @click="messageChange(item, index)">{{
                          item.content | ellipsis(40)
                        }}</span>
                      </el-tooltip>
                      <label @click="messageChange(item, index)">{{
                        item.sendTime
                      }}</label>
                    </li>
                  </ul>
                  <div class="load-more" v-if="isloadMore" @click="loadMore">
                    加载更多
                  </div>
                  <div
                    v-if="messageTotal == 0"
                    class="not-message"
                    style="padding: 10px 0"
                  >
                    <i class="iconfont icon-xiaoxi2"></i
                    ><span>还没有新消息</span>
                  </div>
                </div>
                <div class="alarm-list">
                  <div
                    class="alarm-list-title"
                    style="cursor: pointer;"
                    @click="alarmRouter"
                  >
                    <span>告警</span
                    ><el-badge
                      :value="alarm.untreatNum"
                      :max="99"
                      type="warning"
                      :hidden="alarm.untreatNum == 0"
                    >
                      <i class="iconfont icon-gaojing1"></i>
                    </el-badge>
                  </div>
                  <div class="alarm-list-content">
                    <div
                      v-if="
                        alarm.untreatNum > 0 && alarm.describe && alarm.datetime
                      "
                      class="alarm-list-content-content"
                    >
                      <el-tooltip
                        :content="alarm.describe"
                        :disabled="
                          alarm.describe && alarm.describe.length > 40
                            ? false
                            : true
                        "
                        class="item"
                        effect="dark"
                        :visible-arrow="false"
                        placement="bottom"
                        ><span @click="alarmRouter">{{
                          alarm.describe | ellipsis(40)
                        }}</span>
                      </el-tooltip>
                      <div class="alarm-list-content-date" @click="alarmRouter">
                        {{ alarm.datetime }}
                      </div>
                    </div>
                    <div v-else class="not-message">
                      <i
                        class="iconfont icon-gaojingguanli"
                        style="vertical-align:text-top;margin-top: -2px;display: inline-block;"
                      ></i
                      ><span>没有未处理告警</span>
                    </div>
                  </div>
                </div>
                <div class="message-setup">
                  <div class="message-setup-switch">
                    <el-tooltip
                      content="告警实时弹窗开关"
                      class="item"
                      effect="dark"
                      :visible-arrow="false"
                      placement="bottom"
                    >
                      <el-switch
                        v-model="alarmConfig.isReceive"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-value="0"
                        inactive-value="1"
                        @change="alarmConfigChange"
                      >
                      </el-switch>
                    </el-tooltip>
                  </div>
                  <div class="message-mall" @click="messageRouter">
                    全部消息
                  </div>
                </div>
              </div>
            </el-badge>
          </div>
        </li>
        <li class="header-user-info-item">
          <div class="info-content">
            <i class="iconfont icon-bangzhu header-icon"></i>
          </div>
        </li>
        <li
          v-hasPermi="['overview:screen:list']"
          class="btn-none header-user-info-item"
        >
          <div class="info-content" @click="routeOpen('/screen')">
            <i class="iconfont icon-diannao header-icon"></i>
          </div>
        </li>
      </ul>
    </div>
    <modal
      :visible="dialogVisibleChangePassword"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleChangePassword = false"
    >
      <template slot="head">
        <span>修改密码</span>
      </template>
      <template slot="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="164px"
          class="cusomer-ruleForm change-password"
        >
          <el-form-item label="原密码：" prop="password">
            <el-input
              v-model.trim="ruleForm.password"
              :type="flag[0] ? 'text' : 'password'"
              ref="password"
              maxlength="12"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
          <!--请输入新密码-->
          <el-form-item label="请输入新密码：" prop="newPassword">
            <el-input
              v-model.trim="ruleForm.newPassword"
              minlength="8"
              maxlength="12"
              :type="flag[1] ? 'text' : 'password'"
              ref="newPassword"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
          <!--请再次输入新密码-->
          <el-form-item label="请再次输入新密码：" prop="newPassword2">
            <el-input
              v-model.trim="ruleForm.newPassword2"
              minlength="8"
              maxlength="12"
              :type="flag[2] ? 'text' : 'password'"
              ref="newPassword2"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleChangePassword = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
// import Vue from "vue";
import modal from "@/common/components/Modal";
import { logout } from "@/common/api/login";
import { GET_CHECKPWD, PUT_PWD } from "@/common/api/system/user";
import qs from "querystring";
import currentTime from "@/common/mixins/currentTime";
import lastMonth from "@/common/mixins/lastMonth";
import { mapState } from "vuex";
import {
  GET_ALARM_MESSAGE,
  GET_MESSAGE_LIST,
  PUT_MESSAGE_READ,
  GET_SUBSCRIBE_CONFIG,
  SUBMIT_SUBSCRIBE
} from "@/common/api/index";

export default {
  name: "headerUserInfo",
  components: {
    modal
  },
  mixins: [currentTime, lastMonth],
  data() {
    let validateNewPassword = (rule, value, callback) => {
      if (value === this.ruleForm.password) {
        callback(new Error("新密码不能与原密码相同!"));
      } else {
        callback();
      }
    };
    let validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.ruleForm.newPassword) {
        callback(new Error("与新密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisibleChangePassword: false, // 修改密码弹框
      ruleForm: {},
      rules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur"
          },
          { validator: validateNewPassword, trigger: "blur" }
        ],
        newPassword2: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur"
          },
          { validator: validateNewPassword2, trigger: "blur" }
        ]
      },
      flag: [false, false, false],
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      isDot: false,
      messageIsShowModal: false, // 消息弹框
      request: {
        pageNum: 1,
        pageSize: 10
      },
      messageList: [], // 消息列表
      messageTotal: 0, // 未读消息数量
      isloadMore: true, // 翻页
      alarm: {
        describe: "", // 内容
        datetime: "", // 时间
        untreatNum: 0 // 总数
      },
      // 告警开关
      alarmConfig: {
        id: "",
        isReceive: "0"
      }
    };
  },
  methods: {
    // 跳转
    routeOpen(val) {
      let newUrl = this.$router.resolve({
        path: val
      });
      window.open(newUrl.href, "_blank");
    },
    handlePaste() {},
    // 重置密码
    reset() {
      this.ruleForm = {
        password: undefined,
        newPassword: undefined,
        newPassword2: undefined
      };
      this.resetForm("ruleForm");
    },
    //  确认修改
    submitForm() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let pwd = {
            pwd: this.ruleForm.password
          };
          GET_CHECKPWD(qs.stringify(pwd)).then(() => {
            let params = {
              userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
              password: this.ruleForm.newPassword
            };
            PUT_PWD(params).then(() => {
              this.$message({
                message: "修改密码成功，请重新登录",
                type: "success"
              });
              this.changeCommand("2");
              this.dialogVisibleChangePassword = false;
            });
          });
        } else {
          return false;
        }
      });
    },
    // 眼睛
    hangePassword(index) {
      this.flag[index] = this.flag[index] ? false : true;
      if (index === 0) {
        if (this.flag[0]) {
          this.$refs.password.$el.children[0].type = "text";
        } else {
          this.$refs.password.$el.children[0].type = "password";
        }
      } else if (index === 1) {
        if (this.flag[1]) {
          this.$refs.newPassword.$el.children[0].type = "text";
        } else {
          this.$refs.newPassword.$el.children[0].type = "password";
        }
      } else if (index === 2) {
        if (this.flag[2]) {
          this.$refs.newPassword2.$el.children[0].type = "text";
        } else {
          this.$refs.newPassword2.$el.children[0].type = "password";
        }
      }
    },
    // 点击用户退出。修改密码
    changeCommand(val) {
      if (val === "1") {
        this.reset();
        this.dialogVisibleChangePassword = true;
      } else if (val === "2") {
        this.mqttClient.end(true);
        Vue.prototype.mqFlag = true;
        logout().then(() => {
          sessionStorage.clear();
          this.$router.push({
            path: "/login"
          });
          this.$notify.closeAll();
        });
      }
    },
    // 点击告警跳转
    alarmRouter() {
      var per = "monitor:alarm:list";
      var permissions = JSON.parse(sessionStorage.getItem("permissions"));
      if (permissions.indexOf(per) >= 0 || permissions.indexOf("*:*:*") >= 0) {
        sessionStorage.removeItem("indexId");
        this.$router.push({
          path: "/index/all/monitor/alarm"
        });
        // this.isDot = false;
      } else {
        this.$message({
          message: "暂无权限",
          type: "error",
          duration: 2 * 1000
        });
      }
    },
    //  点击消息
    messageModal() {
      this.messageIsShowModal = !this.messageIsShowModal;
      this.getnoReadMessageList(true);
      this.getAlarmMessage();
    },
    // 查询告警消息
    getAlarmMessage() {
      GET_ALARM_MESSAGE().then(res => {
        if (res.data.untreatNum > 0) {
          this.isDot = true;
        }
        this.alarm.untreatNum = res.data.untreatNum;
        this.alarm.datetime = res.data.alarm.datetime;
        this.alarm.describe =
          res.data.alarm.orgName + "-" + res.data.alarm.describe;
      });
    },
    // 消息翻页
    loadMore() {
      this.request.pageNum += 1;
      this.getnoReadMessageList();
    },
    //  查询未读消息列表
    getnoReadMessageList(empty) {
      if (empty) {
        this.request.pageNum = 1;
        this.messageList = [];
        this.messageTotal = 0;
      }
      let data = {
        startTime: this.lastDayMonth(
          this.getcurrentTime("yyyy-MM-dd"),
          "yyyy-MM-dd"
        ),
        endTime: this.getcurrentTime("yyyy-MM-dd"),
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
        isRead: 0,
        pageNum: this.request.pageNum,
        pageSize: this.request.pageSize
      };
      GET_MESSAGE_LIST(data).then(res => {
        this.messageList = this.messageList.concat(res.rows);
        this.messageTotal = res.total;
        if (res.rows.length > 0) {
          this.isDot = true;
        }
        if (res.rows.length < this.request.pageSize) {
          this.isloadMore = false;
        } else {
          this.isloadMore = true;
        }
      });
    },
    // 点击消息变已读并跳转
    messageChange(item, index) {
      this.messageList.splice(index, 1);
      this.messageTotal -= 1;
      this.putMessageRead(item.id);
      if (this.messageTotal == 0 && this.alarm.untreatNum == 0) {
        this.isDot = false;
      }
      var per = "maintain:workOrder:list";
      var permissions = JSON.parse(sessionStorage.getItem("permissions"));
      if (permissions.indexOf(per) >= 0 || permissions.indexOf("*:*:*") >= 0) {
        sessionStorage.removeItem("indexId");
        this.$router.push({
          path: "/index/smart/repairOrder"
        });
        this.resetSetItem("orderNo", JSON.parse(item.extraMapJson).orderNo);
      } else {
        this.$message({
          message: "暂无权限",
          type: "error",
          duration: 2 * 1000
        });
      }
    },
    // 消息设置已读
    putMessageRead(id) {
      PUT_MESSAGE_READ([id]).then();
    },
    //  查询告警配置是否开启
    getSubscribeConfig() {
      var data = {
        platform: "pc",
        tenantId: JSON.parse(sessionStorage.getItem("userInfo")).tenantId,
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
      };
      GET_SUBSCRIBE_CONFIG(data).then(res => {
        var resData = res.data.filter(item => item.id == 1);
        this.alarmConfig.id = resData[0].id;
        this.alarmConfig.isReceive = resData[0].isReceive;
      });
    },
    //  切换告警开关
    alarmConfigChange(val) {
      var data = {
        configId: this.alarmConfig.id,
        isReceive: val,
        platform: "pc",
        tenantId: JSON.parse(sessionStorage.getItem("userInfo")).tenantId,
        userId: JSON.parse(sessionStorage.getItem("userInfo")).userId
      };
      SUBMIT_SUBSCRIBE(qs.stringify(data))
        .then(() => {
          this.$message({
            type: "success",
            message: "设置成功"
          });
        })
        .catch(() => {
          this.alarmConfig.isReceive = val == 0 ? "1" : "0";
        });
    },
    //  点击全部消息跳转
    messageRouter() {
      sessionStorage.removeItem("indexId");
      this.$router.push({
        path: "/index/system/message"
      });
    }
  },
  computed: {
    ...mapState(["mqttFlag"]),
    mqttWatch() {
      if (this.mqttFlag) {
        this.mqttClient.on("message", (topic, message) => {
          if (topic.indexOf("alarm") != -1) {
            var alarm = JSON.parse(message.toString());
            if (alarm.id && alarm.alarmType != "00") {
              this.isDot = true;
              this.$notify.closeAll();
              if (
                document.getElementsByClassName("el-notification").length > 0
              ) {
                document.getElementsByClassName("el-notification")[0].remove();
              }
              this.alarm.untreatNum = this.alarm.untreatNum + 1;
              this.alarm.datetime = alarm.datetime;
              this.alarm.describe = alarm.orgName + "-" + alarm.describe;
              if (this.alarmConfig.isReceive == 0) {
                this.$notify({
                  title: "告警提示",
                  dangerouslyUseHTMLString: true,
                  message: `<div>${alarm.orgName}</div><div>${alarm.describe}</div><div>${alarm.datetime}</div>`,
                  type: "warning",
                  duration: 0,
                  offset: 70
                });
              }
            }
          }
        });
      }
      return this.mqttFlag;
    }
  },
  watch: {
    mqttWatch() {}
  },
  mounted() {
    document.addEventListener("click", e => {
      const iconEl = document.querySelector(".el-badge"); // 这里是要隐藏的弹窗 类名
      if (iconEl && !iconEl.contains(e.target)) {
        this.messageIsShowModal = false;
      }
    });
    this.getAlarmMessage();
    this.getnoReadMessageList(true);
    this.getSubscribeConfig();
  }
};
</script>

<style scoped lang="scss">
.header-user-info {
  margin: 10px auto 0;
  width: fit-content;
  ul {
    display: flex;
    li {
      position: relative;
      .info-content {
        padding: 0 14px;
        position: relative;
        i.header-icon {
          font-size: 16px;
          position: relative;
          top: -3px;
          vertical-align: sub;
          cursor: pointer;
        }
        span {
          padding: 0 4px;
        }
        em {
          font-size: 12px;
        }
        ::v-deep.el-dropdown {
          color: #ffffff;
        }
      }
      &:before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        width: 2px;
        height: 16px;
        background-color: #ffffff;
      }
      &:last-child:before {
        width: 0;
        height: 0;
        background-color: transparent;
      }
      &:first-child .info-content {
        padding-right: 18px;
      }
      .message-content {
        position: absolute;
        top: 32px;
        left: -230px;
        z-index: 7;
        width: 291px;
        background: #142d89;
        border: 1px solid #00ccff;
        border-radius: 4px;
        padding: 0 10px;
        &:after,
        &:before {
          content: "";
          position: absolute;
          width: 0;
          height: 0;
          border: 6px solid transparent;
          border-bottom-color: #142d89;
          left: 81%;
          margin-left: -4px;
          top: -12px;
          z-index: 3;
        }
        &:after {
          border-bottom-color: #00ccff;
          z-index: 3;
          top: -13px;
          z-index: 2;
        }
        .message-list {
          max-height: 250px;
          overflow: auto;
          border-bottom: 1px dashed #ffffff;
          ul {
            display: block;
            li {
              font-size: 12px;
              border-bottom: 1px dashed #00ccff;
              margin: 10px 0;
              line-height: 14px;
              span {
                cursor: pointer;
              }
              label {
                text-align: right;
                display: block;
                cursor: pointer;
                margin-bottom: 10px;
              }
              &:last-child {
                border: 0;
              }
            }
          }
        }
        .load-more {
          font-size: 10px;
          color: #00ccff;
          text-align: center;
          cursor: pointer;
          margin-bottom: 10px;
        }
        .alarm-list {
          font-size: 12px;
          line-height: 14px;
          padding: 10px 0;
          border-bottom: 1px dashed #ffffff;
          .alarm-list-title {
            color: #00ccff;
            margin-bottom: 10px;
            i {
              margin-left: 5px;
              vertical-align: super;
            }
            span {
              padding: 0;
            }
            ::v-deep.el-badge__content {
              line-height: 14px;
            }
          }
          .alarm-list-content {
            .alarm-list-content-content {
              cursor: pointer;
            }
            .alarm-list-content-date {
              text-align: right;
            }
          }
        }
        .message-setup {
          display: flex;
          justify-content: space-between;
          color: #00ccff;
          font-size: 12px;
          padding: 10px 0;
          .message-mall {
            line-height: 18px;
            cursor: pointer;
          }
        }
        .not-message {
          text-align: left !important;
          font-size: 12px;
          color: #ffffff;
          i {
            margin-right: 7px;
            vertical-align: sub;
          }
        }
      }
      &:first-child:hover {
        em {
          -webkit-transform: rotate(-180deg);
          transform: rotate(-180deg);
        }
      }
    }
  }
}
.userInfo-dropdown-menu {
  background: transparent;
  background-image: url("../assets/img/common/Rectangle.png");
  background-size: 100% 100%;
  border: 0;
  li {
    color: #ffffff;
    &:hover {
      background: transparent;
      color: #ffffff;
      background-image: url("../assets/img/common/menu_active.png");
      background-repeat: no-repeat;
      background-size: auto;
    }
  }
  ::v-deep.popper__arrow:after {
    border-bottom-color: #79caf1;
  }
}
.change-password {
  .icon-yanjing {
    color: rgba(255, 255, 255, 0.5) !important;
  }
}
</style>
