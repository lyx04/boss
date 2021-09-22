<!--新增修改部门弹框-->
<template>
  <div>
    <modal
      :visible="dialogVisibleDepartment"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleDepartmentClosed"
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
          <el-form-item label="上级部门：" prop="parentId">
            <treeselect
              noOptionsText="暂无部门"
              noResultsText="暂无部门"
              v-model.trim="ruleForm.parentId"
              :options="deptOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级部门"
            />
          </el-form-item>
          <el-form-item label="部门名称：" prop="deptName">
            <el-input
              v-model.trim="ruleForm.deptName"
              placeholder="请输入部门名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门负责人：" prop="leaderUserId">
            <el-select
              filterable
              v-model.trim="ruleForm.leaderUserId"
              placeholder="请选择部门负责人"
            >
              <el-option
                v-for="item in leaderList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示排序：" prop="orderNum">
            <el-input-number
              v-model.trim="ruleForm.orderNum"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
          <!--<el-form-item label="显示状态：">-->
          <!--<el-radio-group v-model="ruleForm.status">-->
          <!--<el-radio label="0">正常</el-radio>-->
          <!--<el-radio label="1">停用</el-radio>-->
          <!--</el-radio-group>-->
          <!--</el-form-item>-->
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleDepartmentClosed">取消</el-button>
        <el-button type="primary" @click="submitForm" :disabled="deptLength"
          >提交</el-button
        >
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  GET_SYSTEM_DEPT_LIST,
  ADD_EDITOR_DEPT,
  GET_DEPT_ID,
} from "@/common/api/system/dept";
import { GET_USER_LIST } from "@/common/api/system/user";
export default {
  name: "AddEditorDepartment",
  props: {
    dialogVisibleDepartment: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "新增部门",
    },
    rowDept: {
      type: Object,
    },
    orgId: {
      type: Number,
    },
  },
  components: {
    modal,
    Treeselect,
  },
  data() {
    return {
      ruleForm: {},
      rules: {
        deptName: [
          { required: true, message: "请输入部门名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        // parentId: [
        //   { required: true, message: "上级部门不能为空", trigger: "blur" }
        // ]
      },
      dialogVisibleDepartmentDelete: false, // 删除弹框
      deptOptions: [], //上级部门树选项
      leaderList: [], // 用户list
      deptLength: false,
    };
  },
  methods: {
    // 关闭弹框
    dialogVisibleDepartmentClosed() {
      this.$emit("on-closed");
    },
    //  提交
    submitForm() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.leaderList.map((item) => {
            if (item.userId == this.ruleForm.leaderUserId) {
              this.ruleForm.leader = item.nickName;
            }
          });
          if (this.ruleForm.deptId != undefined) {
            ADD_EDITOR_DEPT("put", this.ruleForm).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.dialogVisibleDepartmentClosed();
              this.$emit("dept-submit");
            });
          } else {
            ADD_EDITOR_DEPT("post", this.ruleForm).then(() => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.$emit("dept-submit");
              this.dialogVisibleDepartmentClosed();
            });
          }
        } else {
          return false;
        }
      });
    },
    //   删除弹框确定
    deleteModalDetermine() {
      this.dialogVisibleDepartmentClosed();
      this.dialogVisibleDepartmentDelete = false;
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
    // 表单重置
    reset() {
      this.ruleForm = {
        deptId: undefined,
        orgId: this.orgId,
        parentId: undefined,
        deptName: undefined,
        orderNum: 1,
        leader: undefined,
        leaderUserId: undefined,
        status: "0",
      };
      this.resetForm("ruleForm");
    },
    //  拉取部门负责人list
    getUserList() {
      let data = {
        orgId: this.orgId,
      };
      GET_USER_LIST(data).then((res) => {
        this.leaderList = res.rows;
      });
    },
  },
  mounted() {
    this.reset();
    if (this.rowDept.deptId) {
      GET_DEPT_ID(this.rowDept.deptId).then((res) => {
        this.ruleForm = {
          deptId: res.data.deptId,
          orgId: res.data.orgId,
          parentId: res.data.parentId,
          deptName: res.data.deptName,
          orderNum: res.data.orderNum,
          leader: res.data.leader,
          leaderUserId: res.data.leaderUserId,
          status: res.data.status,
        };
      });
    }
    if (this.rowDept.parentId) {
      this.ruleForm.parentId = this.rowDept.parentId;
    }
    this.getTreeselect();
    this.getUserList();
  },
};
</script>

<style scoped lang="scss">
::v-deep .vue-treeselect__control {
  height: auto;
}
</style>
