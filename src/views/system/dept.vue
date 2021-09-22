<template>
  <div class="container main-content">
    <!--筛选-->
    <div class="form-screening">
      <el-form
        :model="request"
        ref="request"
        label-width="100px"
        :inline="true"
        size="small"
      >
        <el-form-item label="部门名称：" prop="deptName">
          <el-input
            v-model="request.deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="部门负责人：" prop="leader">
          <el-input
            v-model="request.leader"
            placeholder="请输入部门负责人"
            clearable
            size="small"
          />
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
        @click="handleDeptAdd"
        v-hasPermi="['boss:dept:add']"
        >新增</el-button
      >
    </div>
    <!--table-->
    <div class="h-table-content">
      <el-table
        v-loading="loading"
        :data="deptList"
        row-key="deptId"
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column
          prop="deptName"
          label="部门名称"
          width="260"
        ></el-table-column>
        <el-table-column prop="leader" label="部门负责人" width="200">
          <template slot-scope="scope">
            {{ scope.row.leader || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="orderNum" label="排序" width="100">
          <template slot-scope="scope">
            {{ scope.row.orderNum || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="200"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="editorDept(scope.row)"
              v-hasPermi="['boss:dept:edit']"
              v-if="scope.row.type != 'org'"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleDeptAdd(scope.row)"
              v-hasPermi="['boss:dept:add']"
              v-if="scope.row.type != 'org'"
              >新增</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteDept(scope.row)"
              v-hasPermi="['boss:dept:remove']"
              v-if="scope.row.type != 'org'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增部门、编辑部门-->
    <new-add-department
      v-if="dialogVisibleDepartment"
      :dialogVisibleDepartment="dialogVisibleDepartment"
      :title="departmentTitle"
      :rowDept="rowDept"
      :orgId="Number(this.request.orgId)"
      @dept-submit="deptSubmit"
      @on-closed="dialogVisibleDepartmentClosed"
    ></new-add-department>
  </div>
</template>

<script>
import NewAddDepartment from "./components/AddEditorDepartment";
import { GET_SYSTEM_DEPT_LIST, DELETE_DEPT } from "@/common/api/system/dept";

export default {
  name: "dept",
  components: {
    NewAddDepartment,
  },
  data() {
    return {
      request: {
        orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
        deptName: "",
        leader: "",
      },
      deptList: [],
      departmentTitle: "新增部门", //  新增部门/修改部门标题
      dialogVisibleDepartment: false, // 新增部门/修改部门
      rowDept: {}, // 编辑部门信息
    };
  },
  methods: {
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("request");
      this.handleQuery();
    },
    /** 查询部门列表 */
    getList() {
      GET_SYSTEM_DEPT_LIST(this.request).then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          if (!response.data[i].parentId) {
            response.data[i].parentId = 0;
          }
        }
        var list = {
          deptId: this.request.orgId,
          deptName: JSON.parse(sessionStorage.getItem("userInfo")).orgName,
          children: this.handleTree(response.data, "deptId"),
          type: "org",
        };
        this.deptList = [list];
      });
    },
    //  新增
    handleDeptAdd(row) {
      if (row != undefined) {
        this.rowDept.parentId = row.deptId;
      }
      this.dialogVisibleDepartment = true;
      this.departmentTitle = "添加部门";
    },
    // 编辑部门
    editorDept(row) {
      this.departmentTitle = "修改部门"; //  新增部门/修改部门标题
      this.dialogVisibleDepartment = true;
      this.rowDept = row;
    },
    // 新增修改部门提交刷新列表
    deptSubmit() {
      this.getList();
    },
    // 关闭新增部门弹框
    dialogVisibleDepartmentClosed() {
      this.dialogVisibleDepartment = false;
      this.rowDept = {};
    },
    //  删除
    deleteDept(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message:
          "确定要删除该部门吗？删除后该部门下的所有数据将被删除且不可恢复",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_DEPT(row.deptId).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped lang="scss">
.main-content {
  .add-form {
    margin-left: 18px;
    margin-bottom: 12px;
  }
  .h-table-content {
    margin-left: 18px;
  }
}
</style>
