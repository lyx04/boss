<template>
  <div>
    <modal
      :visible="dialogVisibleRole"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleRoleClosed"
    >
      <template slot="head">
        <span>{{ title }}</span>
      </template>
      <template slot="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="130px"
          class="cusomer-ruleForm"
          size="small"
        >
          <el-form-item label="角色名称：" prop="roleName">
            <el-input
              v-model.trim="ruleForm.roleName"
              placeholder="请输入角色名称"
              maxlength="8"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属客户：" prop="orgId">
            <el-select
              v-model="ruleForm.orgId"
              placeholder="请选择所属客户"
              disabled
              filterable
            >
              <el-option
                v-for="item in orgList"
                :key="item.orgId"
                :label="item.name"
                :value="item.orgId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="角色范围：" prop="dataScope">
            <el-select
              v-model="ruleForm.dataScope"
              placeholder="请选择角色范围"
            >
              <template v-for="item in scopeList">
                <el-option
                  v-if="item.dictValue != 1"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="角色排序：" prop="roleSort">
            <el-input-number
              v-model="ruleForm.roleSort"
              controls-position="right"
              :min="1"
            />
          </el-form-item>
          <el-form-item label="PC端角色权限：" prop="menuIds">
            <el-tree
              :data="treeData"
              :props="props"
              node-key="id"
              ref="menu"
              show-checkbox
              :default-checked-keys="ruleForm.menuIds"
              empty-text="加载中，请稍后"
            >
              <span
                class="custom-tree-node"
                :id="data.id"
                slot-scope="{ node, data }"
              >
                <span class="custom-tree-node-item-content" :title="data.label"
                  >{{ data.label
                  }}<i
                    style="font-size: 12px; margin-left: 4px"
                    v-if="data.type"
                    >({{ data.type | businessEventsTypeFilter(that) }})</i
                  ></span
                >
              </span>
            </el-tree>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleRoleClosed">取消</el-button>
        <el-button type="primary" @click="roleSubmit('ruleForm')"
          >提交</el-button
        >
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";
import {
  ADD_EDITOR_SYSTEM_ROLE,
  GET_SYSTEM_ROLE_ID,
} from "@/common/api/system/role";
import {
  GET_MENU_TREESELECT,
  GET_MENU_ROLE_TREESELECT,
} from "@/common/api/system/menu";
import { mapState } from "vuex";

export default {
  name: "addEditorRoleModal",
  props: {
    dialogVisibleRole: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "新增角色",
    },
    row: {
      type: Object,
    },
    scopeList: {
      type: Array,
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      that: this,
      ruleForm: {
        roleKey: "common", // 角色类型
        roleName: "", // 角色名称
        orgId: "", // 所属客户
        dataScope: "", // 角色范围
        menuIds: [], // 角色权限
        roleSort: 1, // 角色排序
        roleCode: 123123,
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
        ],
        orgId: [
          { required: true, message: "请选择所属客户", trigger: "change" },
        ],
        dataScope: [
          { required: true, message: "请选择角色范围", trigger: "change" },
        ],
        menuIds: [
          { required: true, message: "请选择PC端角色权限", trigger: "change" },
        ],
        permissions: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个角色权限",
            trigger: "change",
          },
        ],
      },
      props: {
        label: "label",
        children: "children",
      },
      treeData: [], // 树结构
      orgList: [], // 所属客户列表
    };
  },
  computed: {
    ...mapState(["dict"]),
    roleId: function () {
      if (this.title === "修改角色") {
        if (this.row.roleId) {
          this.getRoleId(this.row.roleId);
        }
      } else {
        this.getbusinessTypeList();
      }
      return 1;
    },
  },
  filters: {
    typeFilter: function (val, that) {
      if (
        that.dict.business_events_type &&
        that.dict.business_events_type.length > 0
      ) {
        for (let i in that.dict.business_events_type) {
          if (val == that.dict.business_events_type[i].dictValue) {
            return that.dict.business_events_type[i].dictLabel;
          }
        }
      }
    },
    businessEventsTypeFilter: function (val, that) {
      if (val && val.split(",").length > 0) {
        var array = [];
        val.split(",").forEach((item) => {
          that.dict.business_events_type.forEach((i) => {
            if (item == i.dictValue) {
              array.push(i.dictLabel);
            }
          });
        });
        return array.toString();
      } else {
        return "--";
      }
    },
  },
  methods: {
    // 关闭弹框
    dialogVisibleRoleClosed() {
      this.$emit("on-closed");
      this.resetForm("ruleForm");
      this.$refs.menu.setCheckedKeys([]);
    },
    // PC端所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      let checkedKeys = this.$refs.menu.getHalfCheckedKeys();
      // 半选中的菜单节点
      let halfCheckedKeys = this.$refs.menu.getCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    //  提交
    roleSubmit(formName) {
      this.ruleForm.menuIds = this.$refs.menu.getCheckedKeys();
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === "修改角色") {
            this.ruleForm.menuIds = this.getMenuAllCheckedKeys();
            ADD_EDITOR_SYSTEM_ROLE("put", this.ruleForm).then(() => {
              this.$message({
                message: "修改角色成功",
                type: "success",
              });
              this.dialogVisibleRoleClosed();
              this.$emit("submit-refresh");
              this.resetForm("ruleForm");
              this.$refs.menu.setCheckedKeys([]);
            });
          } else {
            ADD_EDITOR_SYSTEM_ROLE("post", this.ruleForm).then(() => {
              this.$message({
                message: "新增角色成功",
                type: "success",
              });
              this.dialogVisibleRoleClosed();
              this.$emit("submit-refresh");
              this.resetForm("ruleForm");
              this.$refs.menu.setCheckedKeys([]);
            });
          }
        } else {
          return false;
        }
      });
    },
    //  查询操作类型
    getbusinessTypeList() {
      GET_SYSTEM_ORG_LIST().then((res) => {
        this.orgList = res.data;
        this.ruleForm.orgId = 0; // 所属客户
      });
      // pc查询端树
      GET_MENU_TREESELECT().then((res) => {
        this.treeData = res.data;
      });
    },
    getRoleId(roleId) {
      GET_SYSTEM_ORG_LIST().then((res) => {
        this.orgList = res.data;
      });
      GET_SYSTEM_ROLE_ID(roleId).then((res) => {
        this.ruleForm = res.data;
        GET_MENU_ROLE_TREESELECT(roleId).then((res) => {
          this.ruleForm.menuIds = res.data.checkedKeys;
        });
        // pc查询端树
        GET_MENU_TREESELECT().then((res) => {
          this.treeData = res.data;
        });
      });
    },
  },
  watch: {
    roleId: function (val) {
      if (val) {
        // this.getOneUserInfoByUseIdAndRoleId()
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
