<template>
  <div class="login">
    <div class="login-main">
      <div class="login-left">
        <h1>Welcome</h1>
        <div></div>
        <span>电力能源后台系统</span>
      </div>
      <div class="login-content">
        <div class="login-content-title">
          <div>账号密码登录</div>
        </div>
        <div class="login-content-form">
          <el-form @submit.native.prevent>
            <el-input
              v-model.trim="loginForm.username"
              placeholder="请输入账号"
              prefix-icon="el-icon-mobile-phone"
            ></el-input>
            <el-input
              v-model.trim="loginForm.password"
              placeholder="请输入密码"
              type="password"
              maxlength="12"
              @copy.native.capture.prevent="handlePaste"
              prefix-icon="el-icon-lock"
            ></el-input>
            <el-button
              native-type="submit"
              type="primary"
              @click="handleLogin('loginForm')"
              >登录</el-button
            >
          </el-form>
        </div>
      </div>
    </div>
    <!--备案-->
    <div class="login-record">
      <i></i><span>{{ record }}</span
      ><i></i>
    </div>
  </div>
</template>

<script>
import { login } from "@/common/api/login";
import { GET_ALL_DICT_DATA_LIST } from "@/common/api/system/dictionary";
import { GET_IS_TOP } from "@/common/api/system/organization";
import { GET_MENU_LIST } from "@/common/api/system/menu";
import qs from "querystring";
import "@/common/util/rem";

export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        grant_type: "password",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      permsList: [], // 权限
      record: process.env.VUE_APP_RECORD,
    };
  },
  methods: {
    // 禁止复制粘贴剪切
    handlePaste() {},
    // 登录
    handleLogin() {
      if (this.loginForm.username && this.loginForm.password) {
        login(qs.stringify(this.loginForm)).then((res) => {
          this.resetSetItem("access_token", JSON.stringify(res.access_token));
          // this.resetSetItem("userInfo", JSON.stringify(res.userInfo));
          // 查询是否是顶级机构
          GET_IS_TOP(res.userInfo.orgId).then((e) => {
            res.userInfo.isTop = e.data;
            this.resetSetItem("userInfo", JSON.stringify(res.userInfo));
          });
          // 导航
          GET_MENU_LIST().then((e) => {
            this.permsList = e.data;
            e.data = e.data.filter((item) => {
              return item.menuType != "F" && item.visible == 0;
            });
            for (let i = 0; i < e.data.length; i++) {
              if (!e.data[i].parentId) {
                e.data[i].parentId = 0;
              }
              e.data[i].children = [];
            }
            let datalist = this.handleTree(e.data, "menuId");
            datalist.sort(this.compare).forEach((a) => {
              a.children.sort(this.compare).forEach((b) => {
                b.children.sort(this.compare);
              });
            });
            this.$store.dispatch("setHeaderList", datalist);
            this.resetSetItem("navMenu", JSON.stringify(datalist));
            // 权限
            var arr = [];
            if (res.userInfo.permissions[0] == "*:*:*") {
              arr.push("*:*:*");
            } else {
              this.permsList.forEach((item) => {
                if (item.perms) {
                  arr.push(item.perms);
                }
              });
            }
            this.resetSetItem("permissions", JSON.stringify(arr));
            this.$router.replace({
              path: "/index",
            });
            this.getAllDictList();
          });
        });
      } else {
        this.$message.error("请输入账号密码");
      }
    },
    // 获取字典
    getAllDictList() {
      const arr = [];
      GET_ALL_DICT_DATA_LIST().then((res) => {
        res.rows.forEach((item) => {
          const parent = arr.find(
            (cur) => Object.keys(cur)[0] === item.dictType
          );
          if (parent) {
            parent[Object.keys(parent)[0]].push(item);
          } else {
            let obj = {
              [item.dictType]: [item],
            };
            arr.push(obj);
          }
        });
        const obj = {};
        arr.forEach((item) => {
          obj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
        });
        this.$store.dispatch("setDict", obj);
      });
    },
  },
  created() {
    sessionStorage.clear();
  },
  mounted() {
    sessionStorage.clear();
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  position: relative;
  background: linear-gradient(270deg, #4bc9ff 0%, #3270f3 100%);
  .login-main {
    .login-left {
      position: absolute;
      width: 6.1rem;
      height: 4.71rem;
      top: 0;
      bottom: 0;
      margin: auto;
      left: 4.47rem;
      background: url("../common/assets/img/login/login-back.png") no-repeat;
      background-size: 100% 100%;
      padding: 0.45rem 0.35rem;
      h1 {
        font-size: 0.66rem;
        font-weight: bold;
        color: #ffffff;
      }
      div {
        width: 46px;
        height: 7px;
        background: #ffffff;
        margin: 0.25rem 0 0.21rem;
      }
      span {
        font-size: 0.4rem;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
  .login-content {
    width: 5.33rem;
    height: max-content;
    background: #ffffff;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 9.42rem;
    z-index: 2;
    padding: 0 0.46rem;
    border-radius: 5px;
    box-shadow: -13px 13px 19px 1px rgba(0, 0, 0, 0.4);
    .login-content-title {
      text-align: center;
      font-size: 0.38rem;
      color: #006afe;
      margin-top: 0.72rem;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        bottom: -0.1rem;
        left: 0;
        right: 0;
        margin: auto;
        width: 2.23rem;
        height: 0.19rem;
        background-color: rgba(0, 106, 254, 0.3);
      }
    }
    .login-content-form {
      margin-top: 0.4rem;
      ::v-deep.el-input {
        margin-top: 0.4rem;
        .el-input__icon {
          width: auto;
          font-size: 0.2rem;
        }
      }
      ::v-deep.el-input {
        input[type="text"],
        input[type="password"] {
          background: #ffffff;
          border: 0;
          border-bottom: 1px solid #cccccc;
          color: #999999;
          line-height: 0.6rem;
          font-size: 0.2rem;
          padding-left: 0.42rem;
          border-radius: 0;
        }
      }
      ::v-deep.el-button {
        width: 100%;
        height: 0.6rem;
        font-weight: normal;
        font-size: 0.28rem;
        margin: 0.86rem 0 0.86rem;
      }
    }
  }
  .app-code {
    width: 150px;
    position: absolute;
    bottom: 1.7rem;
    right: 2.12rem;
    z-index: 2;
    img {
      width: 150px;
      height: 150px;
    }
    span {
      font-size: 18px;
      color: #ffffff;
      display: block;
      text-align: center;
    }
  }
  .login-record {
    height: 0.18rem;
    position: absolute;
    bottom: 0.52rem;
    left: 0;
    right: 0;
    z-index: 2;
    margin: auto;
    text-align: center;
    overflow: hidden;
    color: #ffffff;
    &::before,
    &::after {
      content: "";
      display: inline-block;
      width: 90px;
      height: 1px;
      position: absolute;
      background: #ffffff;
      top: 50%;
    }
    &::before {
      margin-left: -40px;
      transform: translateX(-100%);
    }
    &::after {
      margin-left: 40px;
    }
    i {
      width: 8px;
      height: 8px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;
      margin-left: -40px;
      top: 26%;
    }
    i:last-child {
      margin-left: 40px;
    }
  }
}
</style>
