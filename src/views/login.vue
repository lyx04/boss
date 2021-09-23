<template>
  <div class="login">
    成功
    <!-- <div class="login-content">
      <div class="login-content-title">
        <div class="login-content-title-code">
          <div>股票代码：871229</div>
          <div>服务电话：400-0351-233</div>
        </div>
        <div>电力能源综合数字平台</div>
        <div style="margin-top: 0.34rem">用户登录</div>
      </div>
      <div class="login-content-form">
        <el-form @submit.native.prevent>
          <el-input
            v-model.trim="loginForm.username"
            placeholder="请输入账号"
          ></el-input>
          <el-input
            v-model.trim="loginForm.password"
            placeholder="请输入密码"
            type="password"
            maxlength="12"
            @copy.native.capture.prevent="handlePaste"
          ></el-input>
          <div class="login-content-form-info">忘记密码请联系管理员重置</div>
          <el-button
            native-type="submit"
            type="primary"
            @click="handleLogin('loginForm')"
            >登录</el-button
          >
        </el-form>
      </div>
      <div class="org-name">
        <img src="../common/assets/img/login/org-name.png" alt="" /> 
      </div>
    </div> -->
    <!--app二维码-->
    <!-- <div class="app-code">
     <img
        src="../common/assets/img/login/prod.png"
        v-if="isProduction == 'prod'"
      /> 
      <img src="../common/assets/img/login/test.png" v-else />
      <span>扫码下载APP</span>
    </div> -->
    <!--备案-->
    <!-- <div class="login-record">
      <i></i><span>{{ record }}</span
      ><i></i>
    </div> -->
  </div>
</template>

<script>
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
      isProduction: process.env.NODE_ENV,
    };
  },
  methods: {
    // 禁止复制粘贴剪切
    handlePaste() {},
    // 登录
    handleLogin() {},
  },
};
</script>

<style scoped lang="scss">
// .login {
//   height: 100%;
//   background-repeat: no-repeat;
//   background-size: 100% 100%;
//   position: relative;
//   .login-content {
//     width: 5.84rem;
//     position: absolute;
//     top: 1.49rem;
//     left: 2.84rem;
//     z-index: 2;
//     .login-content-title {
//       text-align: center;
//       font-size: 0.3rem;
//       color: #478aff;
//       .login-content-title-code {
//         font-size: 18px;
//         color: #4689ff;
//         text-align: left;
//         margin-bottom: 0.36rem;
//         position: relative;
//         div:last-child {
//           position: absolute;
//           top: 0;
//           right: -142%;
//           color: #ffffff;
//         }
//       }
//     }
//     .login-content-form {
//       margin-top: 0.2rem;
//       background: #ffffff;
//       ::v-deep.el-input {
//         input[type="text"],
//         input[type="password"] {
//           height: 0.6rem;
//           background: #ffffff;
//           border: 2px solid #cccccc;
//           color: #999999;
//           line-height: 0.6rem;
//           font-size: 0.2rem;
//           margin-top: 0.34rem;
//         }
//       }
//       .login-content-form-info {
//         font-size: 0.18rem;
//         color: #5c96ff;
//         margin: 0.28rem 0 0.32rem;
//       }
//       ::v-deep.el-button {
//         width: 100%;
//         height: 0.6rem;
//         font-weight: normal;
//         font-size: 0.28rem;
//       }
//     }
//     .org-name {
//       text-align: center;
//       img {
//         width: 1.61rem;
//         height: 0.43rem;
//         margin-top: 0.35rem;
//       }
//     }
//   }
//   .app-code {
//     width: 150px;
//     position: absolute;
//     bottom: 1.7rem;
//     right: 2.12rem;
//     z-index: 2;
//     img {
//       width: 150px;
//       height: 150px;
//     }
//     span {
//       font-size: 18px;
//       color: #ffffff;
//       display: block;
//       text-align: center;
//     }
//   }
//   .login-record {
//     /*width: 6.8rem;*/
//     height: 0.18rem;
//     position: absolute;
//     bottom: 0.52rem;
//     left: 0;
//     right: 0;
//     z-index: 2;
//     /*background-image: url("../common/assets/img/login/record.png");*/
//     /*background-repeat: no-repeat;*/
//     /*background-size: 100% 100%;*/
//     margin: auto;
//     text-align: center;
//     overflow: hidden;
//     color: #4689ff;
//     &::before,
//     &::after {
//       content: "";
//       display: inline-block;
//       width: 90px;
//       height: 1px;
//       position: absolute;
//       background: #4689ff;
//       top: 50%;
//     }
//     &::before {
//       margin-left: -40px;
//       transform: translateX(-100%);
//     }
//     &::after {
//       margin-left: 40px;
//     }
//     i {
//       width: 8px;
//       height: 8px;
//       background: #4689ff;
//       border-radius: 50%;
//       position: absolute;
//       margin-left: -40px;
//       top: 26%;
//     }
//     i:last-child {
//       margin-left: 40px;
//     }
//   }
// }
</style>
