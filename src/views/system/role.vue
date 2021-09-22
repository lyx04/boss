<template>
  <div class="container main-content">
    <!--role筛选-->
    <div class="form-screening">
      <el-form
        :model="request"
        ref="request"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item prop="roleName" label="角色名称:">
          <el-input
            v-model.trim="request.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色范围:" prop="dataScope">
          <el-select
            v-model.trim="request.dataScope"
            placeholder="请选择角色范围"
          >
            <el-option label="全部" value=""></el-option>
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
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button
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
        @click="addRole"
        v-hasPermi="['boss:role:add']"
        >新增</el-button
      >
    </div>
    <!--table-->
    <div class="h-table-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="roleName" align="center" label="角色名称">
        </el-table-column>
        <el-table-column align="center" label="所属客户">
          <template slot-scope="scope">
            {{ scope.row.orgId | orgFilter(that) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色范围">
          <template slot-scope="scope">
            {{ scope.row.dataScope | scopeFilter(that) }}
          </template>
        </el-table-column>
        <el-table-column prop="roleSort" align="center" label="角色排序">
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-view"
              @click="getRole(scope.row)"
              v-hasPermi="['boss:role:query']"
              >查看</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-if="scope.row.roleKey !== 'superadmin'"
              @click="editorRole(scope.row)"
              v-hasPermi="['boss:role:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteRole(scope.row)"
              v-hasPermi="['boss:role:remove']"
              >删除</el-button
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
    <!--新增修改角色弹框-->
    <add-editor-role-modal
      v-if="dialogVisibleRole"
      :dialogVisibleRole="dialogVisibleRole"
      :title="dialogVisibleRoleTitle"
      :row="roleRow"
      :scopeList="scopeList"
      @submit-refresh="getSystemRoleList"
      @on-closed="dialogVisibleRoleClosed"
    ></add-editor-role-modal>
    <!--查看角色弹框-->
    <role-modal
      v-if="dialogVisibleGetRole"
      :dialogVisibleGetRole="dialogVisibleGetRole"
      :row="roleRow"
      :scopeList="scopeList"
      @on-closed="dialogVisibleGetRoleClosed"
    ></role-modal>
  </div>
</template>

<script>
import addEditorRoleModal from "./components/addEditorRoleModal";
import RoleModal from "./components/RoleModal";
import page from "@/common/components/Pagination";
import {
  GET_SYSTEM_ROLE_LIST,
  DELETE_SYSTEM_ROLE_ID,
} from "@/common/api/system/role";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";
import { GET_DICT_DATA_TYPE } from "@/common/api/system/dictionary";
import * as ConstVal from "@/common/config/roleType";
export default {
  name: "role",
  components: {
    addEditorRoleModal,
    RoleModal,
    page,
  },
  data() {
    return {
      that: this,
      roleKey: JSON.parse(sessionStorage.getItem("userInfo")).roles[0].roleKey,
      request: {
        dataScope: "", // 角色范围
        roleName: "", // 关键字
        pageNum: 1,
        pageSize: 10,
        searchOrgId: "0",
      },
      tableData: [],
      totalNum: 0,
      dialogVisibleRole: false, // 新增修改角色
      dialogVisibleRoleTitle: "新增角色", // 新增修改角色title
      roleRow: {}, // 编辑角色传的值
      dialogVisibleGetRole: false, // 查看角色
      orgList: [], // 所属客户列表
      roleTypeList: ConstVal.ROLE_TYPE_LIST, // 角色类型
      scopeList: [], // 角色范围
    };
  },
  filters: {
    orgFilter: function (val, that) {
      for (let i in that.orgList) {
        if (val == that.orgList[i].orgId) {
          return that.orgList[i].name;
        }
      }
    },
    roleTypeFilter: function (val, that) {
      for (let i in that.roleTypeList) {
        if (val == that.roleTypeList[i].value) {
          return that.roleTypeList[i].label;
        }
      }
    },
    scopeFilter: function (val, that) {
      for (let i in that.scopeList) {
        if (val == that.scopeList[i].dictValue) {
          return that.scopeList[i].dictLabel;
        }
      }
    },
  },
  methods: {
    // 关闭新增修改角色弹框
    dialogVisibleRoleClosed() {
      this.dialogVisibleRole = false;
      this.roleRow = {};
    },
    // 新增角色
    addRole() {
      this.dialogVisibleRole = true;
      this.dialogVisibleRoleTitle = "新增角色";
    },
    //  编辑当前角色
    editorRole(row) {
      this.dialogVisibleRole = true;
      this.dialogVisibleRoleTitle = "修改角色";
      this.roleRow = row;
    },
    // 查看角色弹框
    getRole(row) {
      this.roleRow = row;
      this.dialogVisibleGetRole = true;
    },
    // 关闭查看角色弹框
    dialogVisibleGetRoleClosed() {
      this.roleRow = {};
      this.dialogVisibleGetRole = false;
    },
    //  删除角色弹框
    deleteRole(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除该角色吗",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_SYSTEM_ROLE_ID(row.roleId).then(() => {
            this.request.pageNum = 1;
            this.getSystemRoleList();
            this.$message({
              message: "删除角色成功",
              type: "success",
            });
          });
        })
        .catch(() => {});
    },
    //  查询角色列表
    getSystemRoleList() {
      this.tableData = [];
      this.totalNum = 0;
      GET_SYSTEM_ROLE_LIST(this.request).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    },
    /** 搜索按钮*/
    search() {
      this.request.pageNum = 1;
      this.getSystemRoleList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("request");
      this.request.pageNum = 1;
      this.getSystemRoleList();
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getSystemRoleList();
    },
    // 切换条数
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getSystemRoleList();
    },
    //  查询操作类型
    getbusinessTypeList() {
      GET_SYSTEM_ORG_LIST().then((res) => {
        this.orgList = res.data;
      });
      GET_DICT_DATA_TYPE("role_scope").then((res) => {
        this.scopeList = res.data;
      });
    },
  },
  mounted() {
    this.getSystemRoleList();
    this.getbusinessTypeList();
  },
};
</script>

<style scoped lang="scss">
.main-content {
  .add-form {
    margin-left: 8px;
    margin-bottom: 12px;
  }
  .h-table-content {
    margin-left: 8px;
  }
}
</style>
