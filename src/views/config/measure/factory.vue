<!--映射厂家-->
<template>
  <div class="factory">
    <div class="table_option">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="
          modalVisible = true;
          modalTitle = '新增厂家';
        "
        v-hasPermi="['ema:factory:add']"
        >新增</el-button
      >
      <div class="table_right">
        <el-input
          size="mini"
          v-model="request.queryName"
          suffix-icon="el-icon-search"
          clearable
          placeholder="输入名称以检索"
          @change="keyword"
        ></el-input>
      </div>
    </div>
    <div class="factory_table">
      <el-table class="system" :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" align="center" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="factoryName" align="center" label="厂家名称">
        </el-table-column>
        <el-table-column align="center" label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark || "--" }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasPermi="['ema:factory:update']"
              @click="editRow(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['ema:factory:del']"
              @click="deleteFactory(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <pagination
      :pageSize="request.pageSize"
      :currentPage1.sync="request.pageNum"
      :total="totalNum"
      @handleCurrent="current"
      @size-change="listSizeChange"
    ></pagination>
    <!-- 分割线 -->
    <commonModal
      customClass="Miniform"
      :visible="modalVisible"
      @on-closed="modalClose('modalVisible')"
    >
      <template slot="head">
        <span> {{ modalTitle }}</span>
      </template>
      <template slot="body">
        <el-form
          ref="modalForm"
          :model="modalForm"
          :rules="rules"
          size="mini"
          label-width="120px"
        >
          <el-form-item label="厂家名称:" prop="factoryName">
            <el-input
              maxlength="20"
              type="name"
              placeholder="请输入厂家名称"
              v-model="modalForm.factoryName"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              maxlength="50"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="modalForm.remark"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="modalClose('modalVisible')" size="mini"
          >取消</el-button
        >
        <el-button type="primary" @click="manufacturerSubmit" size="mini"
          >提交</el-button
        >
      </template>
    </commonModal>
  </div>
</template>
<script>
import commonModal from "@/common/components/Modal";
import pagination from "@/common/components/Pagination";
import {
  ADD_EMA_FACTORY,
  UPDATE_EMA_FACTORY,
  GET_EMA_FACTORY,
  DELETE_EMA_FACTORY,
} from "@/common/api/config/measure";
import qs from "querystring";
export default {
  components: { commonModal, pagination },
  data() {
    return {
      // 列表参数
      request: {
        queryName: undefined, // 厂家名称
        pageNum: 1,
        pageSize: 10,
      },
      totalNum: 0, // 总数量
      tableData: [],
      factory_name: "",
      modalVisible: false,
      modalTitle: "",
      modalDelect: false,
      modalForm: {},
      rules: {
        factoryName: [
          { required: true, message: "请输入厂家名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    listSizeChange(e) {
      this.request.pageSize = e;
      this.getFactoryList();
    },
    // 翻页
    current(val) {
      this.request.pageNum = val;
      this.getFactoryList();
    },
    modalClose(data) {
      this[data] = false;
      this.reset();
    },
    editRow(data) {
      this.modalTitle = "修改厂家";
      this.modalVisible = true;
      this.reset();
      this.modalForm.factoryName = data.factoryName;
      this.modalForm.remark = data.remark;
      this.modalForm.id = data.id;
    },
    //查询厂家列表
    getFactoryList() {
      this.tableData = [];
      this.totalNum = 0;
      GET_EMA_FACTORY(this.request).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    },
    // 表单重置
    reset() {
      this.modalForm = {
        factoryName: undefined,
        remark: undefined,
        id: undefined,
      };
      this.resetForm("modalForm");
    },
    //  新增，修改提交表单
    manufacturerSubmit() {
      this.$refs["modalForm"].validate((valid) => {
        if (valid) {
          if (this.modalForm.id != undefined) {
            UPDATE_EMA_FACTORY(qs.stringify(this.modalForm)).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.modalVisible = false;
              this.getFactoryList();
              this.reset();
            });
          } else {
            ADD_EMA_FACTORY(qs.stringify(this.modalForm)).then(() => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.modalVisible = false;
              this.reset();
              this.getFactoryList();
            });
          }
          this.reset();
        }
      });
    },
    //  搜索
    keyword() {
      this.request.pageNum = 1;
      this.getFactoryList();
    },
    //  删除当前厂家
    deleteFactory(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前厂家",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_EMA_FACTORY(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getFactoryList();
          });
        })
        .catch(() => {});
    },
  },
  created() {
    this.getFactoryList();
  },
};
</script>
<style scoped lang="scss">
.factory {
  .table_option {
    margin-bottom: 10px;
    ::v-deep.el-input__icon {
      line-height: 32px;
    }
  }
}
</style>
