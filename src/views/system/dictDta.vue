<template>
  <div class="container main-content">
    <div class="add-form">
      <router-link :to="`/dict`" style="margin-right: 10px"
        ><el-button type="info" plain icon="el-icon-arrow-left" size="mini"
          >返回</el-button
        ></router-link
      >
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="addDictData"
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
        <el-table-column prop="dictLabel" align="center" label="字典标签">
        </el-table-column>
        <el-table-column prop="dictValue" align="center" label="字典键值">
        </el-table-column>
        <el-table-column prop="dictSort" align="center" label="字典排序">
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
    </div>
    <!-- 新增修改弹框-->
    <add-editor-dict-data-modal
      v-if="dialogVisibleDict"
      :dialogVisibleDict="dialogVisibleDict"
      :title="dialogVisibleDictTitle"
      :row="dictRow"
      @on-closed="dialogVisibleDictClosed"
      @submit-modal="submitModal"
    ></add-editor-dict-data-modal>
  </div>
</template>

<script>
import {
  GET_DICT_DATA_TYPE,
  DELETE_DICT_DATA,
} from "@/common/api/system/dictionary";
import AddEditorDictDataModal from "./components/AddEditorDictDataModal";

export default {
  name: "dictData",
  components: {
    AddEditorDictDataModal,
  },
  data() {
    return {
      tableData: [],
      totalNum: 0,
      dialogVisibleDict: false, // 新增修改弹框
      dialogVisibleDictTitle: "添加字典数据", // 新增修改弹框标题
    };
  },
  methods: {
    getDictList() {
      GET_DICT_DATA_TYPE(this.decode(this.$route.params.dictType)).then(
        (res) => {
          this.tableData = res.data;
          // this.ruleFormQualification.url = res.data;
        }
      );
    },
    addDictData() {
      this.dialogVisibleDict = true;
      this.dialogVisibleDictTitle = "添加字典类型";
    },
    // 编辑字典
    editorDict(row) {
      this.dictRow = row;
      this.dialogVisibleDict = true;
      this.dialogVisibleDictTitle = "修改字典数据";
    },
    // 删除字典
    deleteDict(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除当前字典数据吗",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_DICT_DATA(
            this.decode(this.$route.params.dictType),
            row.dictCode
          ).then(() => {
            this.$message({
              message: "删除字典数据成功",
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
  .form-screening-inline {
    display: inline-block;
    ::v-deep.el-form-item__content {
      width: 200px;
    }
  }
  .form-screening-line-btn {
    margin-left: 8px;
    position: relative;
    top: -1px;
    .el-button {
      padding: 9px 20px;
    }
  }
  .add-form {
    margin-left: 30px;
    margin-bottom: 12px;
  }
  .h-table-content {
    margin-left: 23px;
  }
}
</style>
