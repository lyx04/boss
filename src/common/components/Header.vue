<template>
  <div>
    <div class="header">
      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="collapseChage">
        <i v-if="!collapse" class="el-icon-s-fold"></i>
        <i v-else class="el-icon-s-unfold"></i>
      </div>
      <div class="logo">电力能源后台系统</div>
      <el-menu
        :default-active="activeIndex"
        class="topmenu-container"
        mode="horizontal"
        @select="handleSelect"
      >
        <template v-for="item in navMenu">
          <el-menu-item :index="String(item.menuId)" :key="item.menuId">{{
            item.menuName
          }}</el-menu-item>
        </template>
      </el-menu>
      <div class="header-right">
        <div class="header-user-con">
          <!-- 用户头像 -->
          <div class="user-avator">
            <img src="@/common/assets/img/common/user.png" />
          </div>
          <!-- 用户名下拉菜单 -->
          <el-dropdown
            class="user-name"
            trigger="click"
            @command="handleCommand"
          >
            <span class="el-dropdown-link">
              {{ userInfo.nickName }}
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu>
              <el-dropdown-item command="editorPassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item divided command="loginout"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
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
          size="small"
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
import { logout } from "@/common/api/login";
import modal from "@/common/components/Modal";
import { GET_CHECKPWD, PUT_PWD } from "@/common/api/system/user";
import qs from "querystring";
import { mapState } from "vuex";

export default {
  components: {
    modal,
  },
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
      fullscreen: false,
      message: 2,
      // 用户信息
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      //   导航列表
      navMenu: JSON.parse(sessionStorage.getItem("navMenu")),
      // 修改密码弹框
      dialogVisibleChangePassword: false,
      ruleForm: {},
      rules: {
        password: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur",
          },
          { validator: validateNewPassword, trigger: "blur" },
        ],
        newPassword2: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur",
          },
          { validator: validateNewPassword2, trigger: "blur" },
        ],
      },
      flag: [false, false, false],
    };
  },
  computed: {
    ...mapState(["indexId"]),
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    collapse() {
      return this.$store.state.collapse;
    },
    activeIndex() {
      return this.indexId && this.indexId.length > 0 ? this.indexId[0] : "";
    },
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        logout().then(() => {
          sessionStorage.clear();
          this.$router.push("/login");
          this.$notify.closeAll();
          this.$store.commit("clearTags");
        });
      } else {
        this.reset();
        this.dialogVisibleChangePassword = true;
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.$store.commit("hadndleCollapse", !this.collapse);
    },
    // 导航
    handleSelect(key, keyPath) {
      this.activeIndex = key;
      this.resetSetItem("indexId", JSON.stringify(keyPath));
      this.$store.dispatch(
        "setindexId",
        JSON.parse(sessionStorage.getItem("indexId"))
      );
    },
    // 重置密码
    reset() {
      this.ruleForm = {
        password: undefined,
        newPassword: undefined,
        newPassword2: undefined,
      };
      this.resetForm("ruleForm");
    },
    //  确认修改
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let pwd = {
            pwd: this.ruleForm.password,
          };
          GET_CHECKPWD(qs.stringify(pwd)).then(() => {
            let params = {
              userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
              password: this.ruleForm.newPassword,
            };
            PUT_PWD(params).then(() => {
              this.$message({
                message: "修改密码成功，请重新登录",
                type: "success",
              });
              this.handleCommand("loginout");
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
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
    if (!JSON.parse(sessionStorage.getItem("indexId"))) {
      this.resetSetItem("indexId", JSON.stringify([this.navMenu[0].menuId]));
      this.$store.dispatch(
        "setindexId",
        JSON.parse(sessionStorage.getItem("indexId"))
      );
    }
  },
};
</script>
<style scoped lang="scss">
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 18px;
  color: #fff;
  background-color: #242f42;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}
.header .logo {
  float: left;
  line-height: 70px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.topmenu-container {
  position: absolute;
  left: 270px;
  background-color: transparent;
  border: 0;
  .el-menu-item {
    color: #ffffff;
    background-color: transparent;
    height: 70px;
    line-height: 70px;
    font-size: 16px;
    font-weight: normal;
    &:hover,
    &:focus {
      outline: 0 !important;
      color: #ffffff !important;
      background-color: transparent !important;
    }
    &.is-active {
      border-bottom: 3px solid #409eff;
      color: #ffffff;
    }
  }
}
</style>
