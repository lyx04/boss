<template>
  <div class="cpsmeasure">
    <el-form size="mini" inline :model="request" label-width="80px">
      <el-form-item>
        <el-input
          v-model.trim="request.name"
          clearable
          placeholder="请输入企业名称或企业编码"
          @change="refreshList(true)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini"> 搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="all-measurement">
      <el-button
        @click="addAllorg"
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
      >
        批量添加企业</el-button
      >
      <el-button
        v-preventReClick
        @click="exportOrg"
        plain
        size="mini"
        icon="el-icon-download"
        type="warning"
        >导出</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="name" label="企业名称">
      </el-table-column>
      <el-table-column align="center" prop="cpsCode" label="企业编码">
      </el-table-column>
      <el-table-column align="center" prop="areaNo" label="地区编码">
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editCpsorg(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteCpsorg(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <page
      layout="->,sizes,total,prev,pager,next,jumper"
      :pageSize="request.pageSize"
      :currentPage1.sync="request.pageNum"
      :total="totalNum"
      @handleCurrent="handleCurrent"
      @size-change="handleSizeChange"
    ></page>
    <org-select-modal
      v-if="dialogVisibleorgSelect"
      :dialogVisibleorgSelect="dialogVisibleorgSelect"
      @on-closed="dialogVisibleorgSelectClosed"
      @submit-orgSelect="orgSelectSubmit"
    ></org-select-modal>
    <add-excel-org
      v-if="modalExcelorgvisible"
      :modalExcelorgvisible="modalExcelorgvisible"
      :addExcelSetting="addExcelSetting"
      @on-org-closed="dialogVisibleExcelorgClosed"
      @submit-excel-org="refreshList"
    ></add-excel-org>
    <!--修改-->
    <edit-cpsorg-modal
      v-if="dialogVisiblecpsorg"
      :dialogVisiblecpsorg="dialogVisiblecpsorg"
      :cpsorgIndex="cpsorgIndex"
      @dialogVisiblecpsorgClosed="dialogVisiblecpsorgClosed"
      @orgClosedEditSubmit="refreshList"
    ></edit-cpsorg-modal>
  </div>
</template>

<script>
import page from "@/common/components/Pagination";
import orgSelectModal from "../components/orgSelectModal";
import AddExcelOrg from "../components/AddExcelOrg";
import EditCpsorgModal from "../components/EditCpsorgModal";
import {
  GET_CPS_IEMC_ORG,
  DELETE_CPS_IEMC_ORG,
} from "@/common/api/system/cps.js";

export default {
  components: {
    page,
    orgSelectModal,
    AddExcelOrg,
    EditCpsorgModal,
  },
  data() {
    return {
      dialogVisibleorgSelect: false, // org选择
      request: {
        name: "",
        pageNum: 1,
        pageSize: 10,
      },
      totalNum: 0, // 列表总数
      tableData: [],
      modalExcelorgvisible: false, // excel弹框
      addExcelSetting: [], //选择数据,
      dialogVisiblecpsorg: false, // 修改弹框
      cpsorgIndex: {}, // 当前企业编码
    };
  },

  methods: {
    //  点击批量量测量
    addAllorg() {
      this.dialogVisibleorgSelect = true;
    },
    //  搜索
    search() {
      this.request.pageNum = 1;
      this.getcpsIemcOrg();
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getcpsIemcOrg();
    },
    //  选择每页条数
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getcpsIemcOrg();
    },
    //  关闭选择框
    dialogVisibleorgSelectClosed() {
      this.dialogVisibleorgSelect = false;
    },
    //  选择弹框
    orgSelectSubmit(val) {
      this.addExcelSetting = val;
      this.dialogVisibleorgSelectClosed();
      this.modalExcelorgvisible = true;
    },
    //关闭在线弹框
    dialogVisibleExcelorgClosed() {
      this.modalExcelorgvisible = false;
    },
    // 刷新
    refreshList(page) {
      if (page) {
        this.request.pageNum = 1;
      }
      this.getcpsIemcOrg();
    },
    //  删除
    deleteCpsorg(id) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "删除企业将清除下设所有设备数据",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_CPS_IEMC_ORG(id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.request.pageNum = 1;
            this.getcpsIemcOrg();
          });
        })
        .catch(() => {});
    },
    //  修改
    editCpsorg(row) {
      this.cpsorgIndex = JSON.parse(JSON.stringify(row));
      this.dialogVisiblecpsorg = true;
    },
    //  取消修改
    dialogVisiblecpsorgClosed() {
      this.dialogVisiblecpsorg = false;
    },
    //  查询列表
    getcpsIemcOrg() {
      this.tableData = [];
      this.totalNum = 0;
      GET_CPS_IEMC_ORG(this.request).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    },
    exportOrg() {
      window.open(
        `${process.env.VUE_APP_BASE_URL}/swich-in/cps/excel/excelOrg?name=${
          this.request.name
        }&accessToken=${JSON.parse(sessionStorage.getItem("access_token"))}`
      );
    },
  },
  mounted() {
    this.getcpsIemcOrg();
  },
};
</script>

<style scoped lang="scss">
.cpsmeasure {
  padding: 25px 27px 0 25px;
  .all-measurement {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
}
</style>
