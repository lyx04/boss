<template>
  <div>
    <modal
      :visible="dialogVisibleAddEditorUserModal"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleAddEditorUserModalClosed"
    >
      <template slot="head">
        <span>{{ title }}</span>
      </template>
      <template slot="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="cusomer-ruleForm"
          size="small"
        >
          <el-form-item label="姓名：" prop="nickName">
            <el-input
              v-model.trim="ruleForm.nickName"
              placeholder="请输入姓名"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="phonenumber">
            <el-input
              type="text"
              v-model.trim="ruleForm.phonenumber"
              maxlength="11"
              oninput="value=value.replace(/^\+|[^\d]/g,'')"
              placeholder="请输入手机号"
              @blur="salaryChange"
              autocomplete="new-phonenumber"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password" v-if="!userRow.userId">
            <el-input
              v-model.trim="ruleForm.password"
              minlength="8"
              maxlength="12"
              type="password"
              placeholder="请输入密码"
              @copy.native.capture.prevent="handlePaste"
              show-password="true"
              autocomplete="new-password"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="sex">
            <el-radio-group v-model.trim="ruleForm.sex">
              <el-radio
                v-for="item in sexList"
                :key="item.dictValue"
                :label="item.dictValue"
                >{{ item.dictLabel }}</el-radio
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态：" prop="status" v-if="!userRow.userId">
            <el-radio-group v-model.trim="ruleForm.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属部门：" prop="deptCode">
            <treeselect
              noOptionsText="暂无部门"
              noResultsText="暂无部门"
              v-model.trim="ruleForm.deptCode"
              :options="deptOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级部门"
            />
          </el-form-item>
          <el-form-item label="角色：" prop="roleIds">
            <el-select
              v-model.trim="ruleForm.roleIds"
              multiple
              placeholder="请选择角色"
            >
              <template v-for="item in roleList">
                <el-option
                  v-if="item.roleKey != 'superadmin'"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="岗位：" prop="postIds">-->
          <!--<el-input-->
          <!--v-model.trim="ruleForm.postIds"-->
          <!--placeholder="请输入岗位"-->
          <!--&gt;</el-input>-->
          <!--</el-form-item>-->
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleAddEditorUserModalClosed"
          >取消</el-button
        >
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { GET_DICT_DATA_TYPE } from "@/common/api/system/dictionary";
import { GET_SYSTEM_DEPT_LIST } from "@/common/api/system/dept";
import { GET_SYSTEM_ROLE_LIST } from "@/common/api/system/role";
import {
  ADD_EDITOR_USER,
  GET_USER,
  DELETE_USER,
} from "@/common/api/system/user";
export default {
  name: "AddEditorUserModal",
  props: {
    dialogVisibleAddEditorUserModal: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "新增用户",
    },
    userRow: {
      type: Object,
    },
  },
  components: {
    modal,
    Treeselect,
  },
  data() {
    return {
      orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      ruleForm: {},
      rules: {
        nickName: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        phonenumber: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        deptCode: [
          { required: true, message: "请选择所属部门", trigger: "blur" },
        ],
        roleIds: [{ required: true, message: "请选择角色", trigger: "change" }],
        sex: [{ required: true, message: "请选择性别", trigger: "change" }],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 8,
            max: 12,
            message: "长度在 8 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
      dialogVisibleAddEditorUserDelete: false, // 删除弹框
      sexList: [], // 性别列表
      roleList: [], // 角色列表
      deptOptions: [], // 部门树选项
    };
  },
  methods: {
    salaryChange(e) {
      this.ruleForm.phonenumber = e.target.value;
    },
    handlePaste: {},
    // 关闭弹框
    dialogVisibleAddEditorUserModalClosed() {
      this.$emit("on-closed");
      this.reset();
    },
    //  新增确定
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.ruleForm.userName = this.ruleForm.phonenumber;
          this.ruleForm.userType = "00";
          this.ruleForm.tenantId = JSON.parse(
            sessionStorage.getItem("userInfo")
          ).tenantId;
          if (this.ruleForm.userId != undefined) {
            ADD_EDITOR_USER("put", this.ruleForm).then(() => {
              this.$message({
                message: "编辑用户成功",
                type: "success",
              });
              this.$emit("user-submit");
              this.dialogVisibleAddEditorUserModalClosed();
              this.reset();
            });
          } else {
            ADD_EDITOR_USER("post", this.ruleForm).then(() => {
              this.$message({
                message: "添加用户成功",
                type: "success",
              });
              this.$emit("user-submit");
              this.dialogVisibleAddEditorUserModalClosed();
              this.reset();
            });
          }
        } else {
          return false;
        }
      });
    },
    //  删除确认
    deleteModaluser() {
      DELETE_USER(this.ruleForm.userId).then(() => {
        this.$message({
          message: "删除用户成功",
          type: "success",
        });
        this.dialogVisibleAddEditorUserDelete = false;
        this.dialogVisibleAddEditorUserModalClosed();
        this.$emit("user-submit");
      });
    },
    // 表单重置
    reset() {
      this.ruleForm = {
        userId: undefined,
        deptCode: undefined,
        orgId: this.orgId,
        nickName: undefined,
        phonenumber: undefined,
        sex: "0",
        password: undefined,
        status: 0,
        roleIds: [],
      };
      this.resetForm("ruleForm");
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      GET_SYSTEM_DEPT_LIST({ orgId: this.orgId }).then((res) => {
        this.deptOptions = [];
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].parentId) {
            res.data[i].parentId = 0;
          }
        }
        this.deptOptions = this.handleTree(res.data, "deptId");
      });
    },
    //  查询字典信息与角色列表
    getDictRole() {
      // 性别
      GET_DICT_DATA_TYPE("sys_user_sex").then((res) => {
        this.sexList = res.data;
      });
      //  角色

      GET_SYSTEM_ROLE_LIST({ searchOrgId: this.orgId }).then((res) => {
        res.rows = res.rows.filter((item) => {
          return item.orgId == this.orgId;
        });
        this.roleList = res.rows;
      });
    },
  },
  mounted() {
    this.reset();
    if (this.userRow.userId) {
      GET_USER(this.userRow.userId).then((res) => {
        this.ruleForm = {
          userId: res.data.user.userId,
          deptCode: res.data.user.deptCode,
          orgId: res.data.user.orgId,
          nickName: res.data.user.nickName,
          phonenumber: res.data.user.phonenumber,
          sex: res.data.user.sex,
          status: Number(res.data.user.status),
          roleIds: res.data.user.roleIds,
        };
      });
    }
    this.getDictRole();
    this.getTreeselect();
  },
};
</script>

<style scoped lang="scss">
::v-deep .vue-treeselect__control {
  height: auto;
}
</style>
