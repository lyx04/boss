<template>
  <div class="cpsdevice">
    <el-form size="mini" inline label-width="80px">
      <el-form-item>
        <el-select v-model="page.orgId" filterable>
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in selectData"
            :key="item.id"
            :label="item.name"
            :value="item.orgId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="mini"
          type="primary"
          @click="inittabData(1)"
          v-hasPermi="['*:*:*']"
        >
          搜索</el-button
        >
        <el-button
          size="mini"
          type="primary"
          v-preventReClick
          @click="openOutputModal"
          v-hasPermi="['*:*:*']"
        >
          导出设备列表</el-button
        >
      </el-form-item>
    </el-form>

    <el-button
      size="mini"
      type="primary"
      @click="opendevModal"
      v-hasPermi="['*:*:*']"
    >
      批量添加设备</el-button
    >
    <el-button
      size="mini"
      type="primary"
      :disabled="!tableChangeData.length"
      v-hasPermi="['*:*:*']"
      @click="openbatchModal"
    >
      批量重置测点</el-button
    >
    <el-button
      size="mini"
      style="float: right"
      v-hasPermi="['*:*:*']"
      @click="outputMeasure"
    >
      导出</el-button
    >
    <el-table
      :data="tableData"
      @selection-change="tableChange"
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column align="center" prop="orgName" label="企业名称">
      </el-table-column>
      <el-table-column align="center" prop="roomName" label="配电室">
      </el-table-column>
      <el-table-column align="center" prop="devName" label="设备名称">
      </el-table-column>
      <el-table-column align="center" prop="typeName" label="设备类型">
      </el-table-column>
      <el-table-column align="center" prop="cpsCode" label="设备编码">
      </el-table-column>
      <el-table-column align="center" prop="devType" label="设备类型编码">
      </el-table-column>
      <el-table-column align="center" prop="count" label="测点数量">
        <template slot-scope="scope">
          <span
            style="cursor: pointer"
            @click="openMeasureModal(scope.row.cpsCode)"
            >{{ scope.row.count }}</span
          >
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间">
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editrow(scope.row)"
            plain
            v-hasPermi="['*:*:*']"
          >
            修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            plain
            @click="deleterow(scope.row)"
            v-hasPermi="['*:*:*']"
          >
            删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <page
      layout="->,sizes,total,prev,pager,next,jumper"
      :pageSize.sync="page.pagesize"
      :total="page.total"
      :currentPage1.sync="page.pageNum"
      @handleCurrent="handleCurrent"
      @size-change="sizeChange"
    ></page>
    <batch-andnew-measure
      v-if="batchModal.active"
      :visible.sync="batchModal.active"
      title="批量重置测点"
      @cpslabels="cpslabelssub"
    ></batch-andnew-measure>
    <edit
      v-if="editModal.active"
      :row="editModal.row"
      :visible.sync="editModal.active"
    ></edit>
    <measure
      :cpsCode="measureModal.cpsCode"
      v-if="measureModal.active"
      :visible.sync="measureModal.active"
      title="新增测点"
    ></measure>
    <batch-device
      :visible.sync="devModal.active"
      v-if="devModal.active"
    ></batch-device>
    <modal
      customClass="Miniform"
      v-if="outputorgModal.active"
      @on-closed="onclosed"
      :visible="outputorgModal.active"
    >
      <template slot="head"> 导出设备列表 </template>
      <template slot="body">
        <el-form size="mini" inline :model="form" label-width="100px">
          <el-form-item label="选择企业">
            <el-select multiple v-model="outputorgModal.orgids" filterable>
              <el-option label="全部" value=""></el-option>

              <el-option
                v-for="item in selectData"
                :key="item.id"
                :label="item.name"
                :value="item.orgId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="onclosed">取消</el-button>
        <el-button type="primary" @click="outputDev">确认</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import page from "@/common/components/Pagination";
import batchAndnewMeasure from "./components/batchAndnewMeasure";
import edit from "./components/edit";
import measure from "./components/measure";
import batchDevice from "./components/batchDevice";
import modal from "@/common/components/Modal";
import {
  GET_CPSIEMC_DEV,
  GET_CPS_ORG,
  RESET_MEASURE,
  DELETE_DEV,
} from "@/common/api/system/cps";
export default {
  components: {
    page,
    batchAndnewMeasure,
    edit,
    measure,
    batchDevice,
    modal,
  },
  mounted() {
    this.inittabData();
    this.initData();
  },
  methods: {
    onclosed() {
      this.outputorgModal.active = false;
    },
    inittabData(e = this.page.pageNum) {
      this.page.pageNum = e;
      GET_CPSIEMC_DEV(this.page).then((e) => {
        this.tableData = e.rows;
        this.page.total = e.total;
      });
    },
    initData() {
      GET_CPS_ORG().then((e) => {
        this.selectData = e.rows;
      });
    },
    handleCurrent(e) {
      this.page.pageNum = e;
      this.inittabData();
    },
    sizeChange(e) {
      this.page.pageSize = e;
      this.inittabData(1);
    },
    tableChange(e) {
      this.tableChangeData = e;
    },
    //打开测点列表弹窗
    openMeasureModal(cpscode) {
      this.measureModal.cpsCode = cpscode;
      this.measureModal.active = true;
    },
    //打开批量重置测点
    openbatchModal() {
      this.batchModal.active = true;
    },
    editrow(row) {
      this.editModal.row = Object.assign({}, row);
      this.editModal.active = true;
    },
    deleterow(e) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前设备",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_DEV(e.id).then((res) => {
            if (res.code == 200) {
              this.inittabData(1);
            }
          });
        })
        .catch(() => {});
    },
    opendevModal() {
      this.devModal.active = true;
    },
    //批量量测量提交
    cpslabelssub(e) {
      var params = {
        cpsIemcDevCpsCode: [],
        cpsIemcSightCpsLabel: [],
      };
      this.tableChangeData.forEach((i) => {
        params.cpsIemcDevCpsCode.push(i.cpsCode);
      });
      params.cpsIemcSightCpsLabel = e;
      RESET_MEASURE(params).then((e) => {
        if (e.code == 200) {
          this.$message.success("修改成功");
          this.inittabData(1);
        }
      });
    },
    outputMeasure() {
      window.open(
        `${process.env.VUE_APP_BASE_URL}/swich-in/cps/excel/excelDevs?orgId=${
          this.page.orgId
        }&accessToken=${JSON.parse(sessionStorage.getItem("access_token"))}`
      );
    },
    //导出
    openOutputModal() {
      this.outputorgModal.active = true;
    },
    //导出设备列表
    outputDev() {
      this.onclosed();
      window.open(
        `${process.env.VUE_APP_BASE_URL}/swich-in/cps/excel/excelIemcs?orgIds=${
          this.outputorgModal.orgids
        }&accessToken=${JSON.parse(sessionStorage.getItem("access_token"))}`
      );
    },
    //  关闭批量添加设备
    devModalClosed() {
      this.devModal.active = false;
    },
  },
  data() {
    return {
      outputorgModal: {
        active: false,

        orgids: [],
      },

      batchModal: {
        active: false,
      },
      measureModal: {
        active: false,
        cpsCode: "",
      },
      editModal: {
        active: false,
        row: "",
      },
      devModal: {
        active: false,
      },
      selectData: [],
      tableData: [],
      tableChangeData: [],
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
        orgId: "",
      },
    };
  },
};
</script>

<style scoped lang="scss">
.cpsdevice {
  padding: 25px 27px 0 25px;
}
</style>
