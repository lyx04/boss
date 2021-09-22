<template>
  <div class="container main-content">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="4" :xs="24" class="org-right">
        <div class="org-title">
          <span>组织结构</span
          ><i
            class="el-icon-edit"
            title="修改"
            @click="deptRouter"
            v-hasPermi="['boss:dept:list']"
          ></i>
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">
        <!--筛选-->
        <div class="form-screening">
          <el-form
            :model="request"
            ref="request"
            label-width="80px"
            :inline="true"
            size="small"
          >
            <el-form-item label="姓名：" prop="nickName">
              <el-input
                v-model="request.nickName"
                placeholder="请输入姓名"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号：" prop="phonenumber">
              <el-input
                v-model="request.phonenumber"
                placeholder="请输入手机号"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-select
                v-model="request.status"
                placeholder="用户状态"
                clearable
                size="small"
              >
                <el-option label="启用" value="0" />
                <el-option label="停用" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleQuery" size="mini"
                >查询</el-button
              ><el-button @click="resetQuery" size="mini">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="add-form">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleUserAdd"
            v-hasPermi="['boss:user:add']"
            >新增</el-button
          >
        </div>
        <!--table-->
        <div class="h-table-content">
          <el-table :data="userData" style="width: 100%">
            <el-table-column prop="nickName" align="center" label="姓名">
            </el-table-column>
            <el-table-column
              prop="phonenumber"
              align="center"
              label="手机号"
              width="180"
            >
            </el-table-column>
            <el-table-column align="center" label="所属部门">
              <template slot-scope="scope">
                {{ scope.row.deptCode | deptFiltter(that) }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model.trim="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  active-color="#2689EE"
                  inactive-color="#E97E62"
                  :disabled="userId == scope.row.userId"
                  @click.native.prevent="changeListType(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column align="center" label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="editorUser(scope.row)"
                  v-hasPermi="['boss:user:edit']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="deleteUser(scope.row)"
                  v-hasPermi="['boss:user:remove']"
                  v-if="scope.row.status != 0"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-key"
                  @click="handleResetPwd(scope.row)"
                  v-hasPermi="['boss:user:edit']"
                  >重置</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <page
            :pageSize="request.pageSize"
            :currentPage1.sync="request.pageNum"
            :total="totalNum"
            @size-change="handleSizeChange"
            @handleCurrent="handleCurrent"
          ></page>
        </div>
      </el-col>
    </el-row>
    <!--新增用户、编辑用户-->
    <add-editor-user-modal
      v-if="dialogVisibleAddEditorUserModal"
      :dialogVisibleAddEditorUserModal="dialogVisibleAddEditorUserModal"
      :title="userTitle"
      :userRow="userRow"
      @user-submit="userSubmit"
      @on-closed="dialogVisibleAddEditorUserModalClosed"
    ></add-editor-user-modal>
    <!--重置密码-->
    <modal
      :visible="dialogVisibleChangePassword"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleChangePassword = false"
    >
      <template slot="head">
        <span>重置密码</span>
      </template>
      <template slot="body">
        <el-form
          :model="form"
          :rules="rules"
          ref="form"
          label-width="150px"
          class="cusomer-ruleForm change-password"
          size="small"
        >
          <!--请输入新密码-->
          <el-form-item label="请输入新密码：" prop="newPassword">
            <el-input
              v-model.trim="form.newPassword"
              minlength="8"
              maxlength="12"
              ref="newPassword"
              :type="flag[0] ? 'text' : 'password'"
              @copy.native.capture.prevent="handlePaste"
              style="width: 220px"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
          <!--请再次输入新密码-->
          <el-form-item label="请再次输入新密码：" prop="newPassword2">
            <el-input
              v-model.trim="form.newPassword2"
              maxlength="12"
              :type="flag[1] ? 'text' : 'password'"
              ref="newPassword2"
              @copy.native.capture.prevent="handlePaste"
              style="width: 220px"
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
import { GET_DEPT_TREESELECT } from "@/common/api/system/dept";
import {
  GET_USER_LIST,
  GET_CHECK_USER,
  DELETE_USER,
  PUT_PWD,
  PUT_CHANGE_STATUS,
} from "@/common/api/system/user";
import { GET_SYSTEM_DEPT_LIST } from "@/common/api/system/dept";
import page from "@/common/components/Pagination";
import AddEditorUserModal from "./components/AddEditorUserModal";
import modal from "@/common/components/Modal";

export default {
  name: "index",
  components: {
    page,
    AddEditorUserModal,
    modal,
  },
  filters: {
    deptFiltter: function (val, that) {
      var array = that.deptList.filter((item) => {
        if (item.deptId == val) {
          return item.deptName;
        }
      });
      return array.length > 0 ? array[0].deptName : "--";
    },
  },
  data() {
    let validateNewPassword2 = (rule, value, callback) => {
      if (value !== this.form.newPassword) {
        callback(new Error("与新密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      that: this,
      userId: JSON.parse(sessionStorage.getItem("userInfo")).userId,
      deptList: [], // 部门
      // 组织id
      orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      // 部门树选项
      deptOptions: undefined,
      defaultProps: {
        children: "children",
        label: "label",
      },
      //  基本信息
      request: {
        orgId: this.orgId,
        nickName: "",
        phonenumber: "",
        status: "",
        deptCode: "",
        pageSize: 10,
        pageNum: 1,
      },
      // 用户列表
      userData: [],
      totalNum: 0,
      userTitle: "新增用户", // 用户弹框标题
      dialogVisibleAddEditorUserModal: false, // 用户弹框
      userRow: {}, //  编辑用户信息
      dialogVisibleChangePassword: false, // 重置密码
      form: {
        newPassword: "", // 新密码
        newPassword2: "", // 确认密码
      },
      rules: {
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur",
          },
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
      flag: [false, false],
    };
  },
  methods: {
    // 跳转部门
    deptRouter() {
      this.$router.replace({
        path: "/dept",
      });
    },
    // 节点单击事件
    handleNodeClick(data) {
      data.type == "org"
        ? (this.request.deptCode = "")
        : (this.request.deptCode = data.id);

      this.request.pageNum = 1;
      this.getUserList();
    },
    /** 查询用户列表 */
    getUserList() {
      GET_USER_LIST(this.request).then((response) => {
        this.userData = response.rows;
        this.totalNum = response.total;
      });
      GET_SYSTEM_DEPT_LIST({ orgId: this.orgId }).then((res) => {
        this.deptList = res.data;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      var data = {
        orgId: this.orgId,
      };
      GET_DEPT_TREESELECT(data).then((response) => {
        var list = {
          id: this.orgId,
          label: JSON.parse(sessionStorage.getItem("userInfo")).orgName,
          children: response.data,
          type: "org",
        };
        this.deptOptions = [list];
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.request.pageNum = 1;
      this.getUserList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("request");
      this.handleQuery();
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getUserList();
    },
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getUserList();
    },
    /** 新增按钮操作 */
    handleUserAdd() {
      this.dialogVisibleAddEditorUserModal = true;
      this.userTitle = "新增用户";
    },
    // 新增、编辑用户提交
    userSubmit() {
      this.getUserList();
      this.userRow = {};
    },
    //  编辑用户
    editorUser(row) {
      GET_CHECK_USER(row.userId).then(() => {
        this.dialogVisibleAddEditorUserModal = true;
        this.userTitle = "修改用户";
        this.userRow = row;
      });
    },
    //  关闭用户编辑弹框
    dialogVisibleAddEditorUserModalClosed() {
      this.dialogVisibleAddEditorUserModal = false;
      this.userRow = {};
    },
    // 删除用户
    deleteUser(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除该用户吗？删除后该用户将无法登录系统",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_USER(row.userId).then(() => {
            this.request.pageNum = 1;
            this.$message({
              message: "删除用户成功",
              type: "success",
            });
            this.getUserList();
          });
        })
        .catch(() => {});
    },
    //  重置用户密码
    handleResetPwd(row) {
      this.userRow = {};
      this.resetForm("form");
      this.userRow = row;
      this.dialogVisibleChangePassword = true;
      this.resetPwd();
    },

    // 表单重置
    resetPwd() {
      this.form = {
        newPassword: undefined, // 新密码
        newPassword2: undefined, // 确认密码
      };
      this.resetForm("form");
    },
    // 眼睛
    hangePassword(index) {
      this.flag[index] = this.flag[index] ? false : true;
      if (index === 0) {
        if (this.flag[0]) {
          this.$refs.newPassword.$el.children[0].type = "text";
        } else {
          this.$refs.newPassword.$el.children[0].type = "password";
        }
      } else if (index === 1) {
        if (this.flag[1]) {
          this.$refs.newPassword2.$el.children[0].type = "text";
        } else {
          this.$refs.newPassword2.$el.children[0].type = "password";
        }
      }
    },
    //  提交重置密码
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let params = {
            password: this.form.newPassword2,
            userId: this.userRow.userId,
            orgId: this.request.orgId,
            deptCode: this.userRow.deptCode,
          };
          PUT_PWD(params).then(() => {
            this.$message({
              message: "重置密码成功",
              type: "success",
            });
            this.userRow = {};
            this.getUserList();
            this.dialogVisibleChangePassword = false;
            this.resetPwd();
          });
        }
      });
    },
    // 用户禁止
    changeListType(row) {
      var num = 0;
      if (this.userId != row.userId) {
        GET_CHECK_USER(row.userId)
          .then(() => {
            let perm = "boss:user:edit";
            JSON.parse(sessionStorage.getItem("permissions")).forEach(
              (item) => {
                if (item === perm || item === "*:*:*") {
                  num += 1;
                  if (num == 1) {
                    let data = {
                      status: row.status == 0 ? "0" : "1",
                      userId: row.userId,
                      orgId: this.request.orgId,
                      deptCode: row.deptCode,
                      tenantId: JSON.parse(sessionStorage.getItem("userInfo"))
                        .tenantId,
                    };
                    PUT_CHANGE_STATUS(data)
                      .then(() => {
                        this.getUserList();
                        if (data.status === "1") {
                          this.$message({
                            type: "success",
                            message: "禁用成功",
                          });
                        } else {
                          this.$message({
                            type: "success",
                            message: "启用成功",
                          });
                        }
                        num = 0;
                      })
                      .catch(() => {
                        this.getUserList();
                      });
                  }
                }
              }
            );
          })
          .catch(() => {
            this.getUserList();
          });
      }
    },
  },
  mounted() {
    this.getUserList();
    this.getTreeselect();
  },
};
</script>

<style scoped lang="scss">
.main-content {
  .add-form {
    margin-left: 26px;
    margin-bottom: 12px;
  }
  .org-title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 7px 0;
    span {
      color: #000000;
    }
    i {
      color: #409eff;
      cursor: pointer;
    }
  }
  .h-table-content {
    margin-left: 26px;
  }
}
</style>
