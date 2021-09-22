<template>
  <div class="cpsmeasure">
    <el-form size="mini" inline :model="request" label-width="80px">
      <el-form-item>
        <el-input
          v-model.trim="request.name"
          clearable
          placeholder="请输入量测量名称或标签"
          @change="refreshList(true)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" size="mini"> 搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="all-measurement">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="addAllMeasurement"
      >
        批量添加量测量</el-button
      >
      <el-button
        v-preventReClick
        plain
        size="mini"
        icon="el-icon-download"
        type="warning"
        @click="exportMeasure"
        >导出</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" align="center" label="序号" width="60">
      </el-table-column>
      <el-table-column align="center" prop="name" label="量测量名称">
      </el-table-column>
      <el-table-column align="center" prop="label" label="标签" width="180">
      </el-table-column>
      <el-table-column align="center" prop="cpsLabel" label="CPS量测量标识">
      </el-table-column>
      <el-table-column
        align="center"
        prop="callType"
        label="CPS量测量分类码"
        :formatter="callTypeFormatter"
        :render-header="typeTooltip"
      >
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editMeasure(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleteMeasure(scope.row.id)"
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
    <transfer-and-table
      v-if="modalvisible"
      :visible.sync="modalvisible"
      @on-closed="dialogVisibleMeasureClosed"
      @submit-measure="measuresSubmit"
    ></transfer-and-table>
    <add-excel-measure
      v-if="modalExcelMeasurevisible"
      :modalExcelMeasurevisible="modalExcelMeasurevisible"
      :addExcelSetting="addExcelSetting"
      @on-excel-closed="dialogVisibleExcelMeasureClosed"
      @submit-excel-measure="refreshList"
    ></add-excel-measure>
    <!--修改-->
    <edit-measure-modal
      v-if="dialogVisibleEditMeasure"
      :dialogVisibleEditMeasure="dialogVisibleEditMeasure"
      :measureIndex="measureIndex"
      @dialogVisibleEditMeasureClosed="dialogVisibleEditMeasureClosed"
      @measureEditSubmit="refreshList"
    ></edit-measure-modal>
  </div>
</template>

<script>
import page from "@/common/components/Pagination";
import transferAndTable from "../components/transfer";
import AddExcelMeasure from "../components/AddExcelMeasure";
import EditMeasureModal from "../components/EditMeasureModal";
import promptMessages from "@/common/components/promptMessages";
import {
  GET_CPS_IEMC_SIGHT,
  DELETE_CPS_IEMC_SIGHT,
} from "@/common/api/system/cps.js";

export default {
  components: {
    page,
    transferAndTable,
    AddExcelMeasure,
    EditMeasureModal,
  },
  data() {
    return {
      modalvisible: false,
      request: {
        name: "",
        pageNum: 1,
        pageSize: 10,
      },
      totalNum: 0, // 列表总数
      tableData: [],
      modalExcelMeasurevisible: false, // excel弹框
      addExcelSetting: [], //选择数据,
      dialogVisibleEditMeasure: false, // 修改弹框
      measureIndex: {}, // 当前量测量
    };
  },
  methods: {
    typeTooltip(h, { column }) {
      return h("div", {}, [
        h("span", column.label),
        h(promptMessages, {
          props: {
            message: ["1：遥信", "2：SOE", "3：遥测"],
          },
        }),
      ]);
    },
    //  点击批量量测量
    addAllMeasurement() {
      this.modalvisible = true;
    },
    //  搜索
    search() {
      this.request.pageNum = 1;
      this.getcpsIemcSight();
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getcpsIemcSight();
    },
    //  选择每页条数
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getcpsIemcSight();
    },
    //  关闭选择框
    dialogVisibleMeasureClosed() {
      this.modalvisible = false;
    },
    //  选择弹框
    measuresSubmit(val) {
      this.addExcelSetting = val;
      this.dialogVisibleMeasureClosed();
      this.modalExcelMeasurevisible = true;
    },
    //关闭在线弹框
    dialogVisibleExcelMeasureClosed() {
      this.modalExcelMeasurevisible = false;
    },
    // 刷新
    refreshList(page) {
      if (page) {
        this.request.pageNum = 1;
      }
      this.getcpsIemcSight();
    },
    //  删除
    deleteMeasure(id) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前量测量映射",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_CPS_IEMC_SIGHT(id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.request.pageNum = 1;
            this.getcpsIemcSight();
          });
        })
        .catch(() => {});
    },
    //  修改
    editMeasure(row) {
      this.measureIndex = JSON.parse(JSON.stringify(row));
      this.dialogVisibleEditMeasure = true;
    },
    //  取消修改
    dialogVisibleEditMeasureClosed() {
      this.dialogVisibleEditMeasure = false;
    },
    //  查询列表
    getcpsIemcSight() {
      this.tableData = [];
      this.totalNum = 0;
      GET_CPS_IEMC_SIGHT(this.request).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    },
    callTypeFormatter(row) {
      if (row.callType) {
        var data = [
          {
            id: 1,
            name: "遥信",
          },
          {
            id: 2,
            name: "SOE",
          },
          {
            id: 3,
            name: "遥测",
          },
        ];
        var name;
        data.forEach((item) => {
          if (item.id == row.callType) {
            name = item.name;
          }
        });
        return name;
      } else {
        return "--";
      }
    },
    // 导出
    exportMeasure() {
      window.open(
        `${process.env.VUE_APP_BASE_URL}/swich-in/cps/excel/excelMeasure?name=${
          this.request.name
        }&accessToken=${JSON.parse(sessionStorage.getItem("access_token"))}`
      );
    },
  },
  mounted() {
    this.getcpsIemcSight();
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
  ::v-deep .el-icon-question {
    font-size: 16px;
    margin-left: 10px;
  }
}
</style>
