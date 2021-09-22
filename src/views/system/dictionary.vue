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
        <el-form-item label="字典名称:" prop="dictName">
          <div class="form-screening-inline form-screening-inline-keyword">
            <el-input
              v-model.trim="request.dictName"
              clearable
              placeholder="请输入字典名称"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item label="字典类型:" prop="dictType">
          <div class="form-screening-inline form-screening-inline-keyword">
            <el-input
              v-model.trim="request.dictType"
              clearable
              placeholder="请输入字典类型"
            ></el-input>
          </div>
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
        @click="addDialog"
        v-hasPermi="['system:dict:add']"
        >新增</el-button
      >
    </div>
    <!--table-->
    <div class="h-table-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" label="字典编号" width="100">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="dictName" align="center" label="字典名称">
        </el-table-column>
        <el-table-column align="center" label="字典类型">
          <template slot-scope="scope">
            <router-link :to="`/dict/${encode(scope.row.dictType)}`">{{
              scope.row.dictType
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status === "0" ? "正常" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间"
          width="160"
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="editorDict(scope.row)"
              v-hasPermi="['system:dict:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteDict(scope.row)"
              v-hasPermi="['system:dict:remove']"
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
    <!-- 新增修改弹框-->
    <add-editor-dict-modal
      v-if="dialogVisibleDict"
      :dialogVisibleDict="dialogVisibleDict"
      :title="dialogVisibleDictTitle"
      :row="dictRow"
      @on-closed="dialogVisibleDictClosed"
      @submit-modal="submitModal"
    ></add-editor-dict-modal>
  </div>
</template>

<script>
import {
  GET_DICT_LIST,
  DELETE_DICT_TYPE,
} from "@/common/api/system/dictionary";
import AddEditorDictModal from "./components/AddEditorDictModal";
import page from "@/common/components/Pagination";
export default {
  name: "dictionary",
  components: {
    AddEditorDictModal,
    page,
  },
  data() {
    return {
      request: {
        pageNum: 1,
        pageSize: 10,
        dictName: "",
        dictType: "",
      },
      tableData: [],
      totalNum: 0,
      dialogVisibleDict: false, // 新增修改弹框
      dialogVisibleDictTitle: "添加字典类型", // 新增修改弹框标题
    };
  },
  methods: {
    getDictList() {
      GET_DICT_LIST(this.request).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
        // this.ruleFormQualification.url = res.data;
      });
    },
    // 搜索按钮
    search() {
      this.request.pageNum = 1;
      this.getDictList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("request");
      this.request.pageNum = 1;
      this.getDictList();
    },
    // 新增字典
    addDialog() {
      this.dialogVisibleDict = true;
      this.dialogVisibleDictTitle = "新增字典类型";
    },
    // 编辑字典
    editorDict(row) {
      this.dictRow = row;
      this.dialogVisibleDict = true;
      this.dialogVisibleDictTitle = "修改字典类型";
    },
    // 删除字典
    deleteDict(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除当前字典类型吗",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_DICT_TYPE(row.dictId).then(() => {
            this.request.pageNum = 1;
            this.$message({
              message: "删除字典类型成功",
              type: "success",
            });
            this.getDictList();
          });
        })
        .catch(() => {});
    },
    // 关闭新增修改弹框
    dialogVisibleDictClosed() {
      this.dictRow = {};
      this.dialogVisibleDict = false;
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getDictList();
    },
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getDictList();
    },
    submitModal() {
      this.getDictList();
    },
  },
  mounted() {
    this.getDictList();
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
