// 测点列表
<template>
  <div class="measuremodel">
    <modal customClass="Maxform" :visible="visible" @on-closed="closed">
      <template slot="head">
        <div class="title_left">
          {{ title }}
        </div>
      </template>
      <template slot="body">
        <el-form size="mini" inline :model="form" label-width="80px">
          <el-form-item>
            <el-input
              v-model="form.name"
              placeholder="请输入量测量名称或标签"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              @click="initData"
              v-hasPermi="['*:*:*']"
            >
              搜索</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="openMeasureModal"
              v-hasPermi="['*:*:*']"
            >
              新增</el-button
            >
          </el-form-item>
        </el-form>
        <el-table ref="table" :data="tableData" style="width: 100%">
          <el-table-column
            align="center"
            type="index"
            width="50"
            label="序号"
          ></el-table-column>
          <el-table-column align="center" prop="name" label="量测量名称">
          </el-table-column>
          <el-table-column align="center" prop="label" label="标签">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                plain
                @click.prevent.once="deleterow(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="foot">
        <el-button @click="closed">关闭</el-button>
      </template>
    </modal>
    <add-measure
      v-if="measureModal.active"
      title="新增量测量"
      @cpslabels="cpslabels"
      :visible.sync="measureModal.active"
      :codes="cpsCode"
    ></add-measure>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import addMeasure from "./batchAndnewMeasure";
import {
  GET_IEMC_DEV_MEASURE,
  DELETE_DEV_MEASURE,
  SET_CPS_DEV_MEASURE,
} from "@/common/api/system/cps";
export default {
  props: {
    visible: Boolean,
    title: String,
    cpsCode: Number,
  },
  components: {
    modal,
    addMeasure,
  },
  mounted() {
    this.initData();
  },
  data() {
    return {
      tableData: [],
      form: {
        name: "",
      },
      measureModal: {
        active: false,
      },
    };
  },
  methods: {
    initData() {
      this.tableData = [];
      var params = Object.assign(
        { cpsIemcDevCpsCode: this.cpsCode },
        this.form
      );
      GET_IEMC_DEV_MEASURE(params).then((e) => {
        this.tableData = e.data;
      });
    },
    openMeasureModal() {
      this.measureModal.active = true;
    },
    deleterow(e) {
      var params = {
        cpsIemcDevCpsCode: e.cpsIemcDevCpsCode,
        cpsIemcSightCpsLabel: e.cpsIemcSightCpsLabel,
      };
      DELETE_DEV_MEASURE(params).then((e) => {
        if (e.code == 200) {
          this.$message.success("删除成功");
          this.initData();
        }
      });
    },
    cpslabels(e) {
      var params = [];
      e.forEach((i) => {
        var obj = {
          cpsIemcDevCpsCode: this.cpsCode,
          cpsIemcSightCpsLabel: i,
        };
        params.push(obj);
      });
      SET_CPS_DEV_MEASURE(params).then((e) => {
        if (e.code == 200) {
          this.form.name = "";
          this.initData();
        }
      });
    },
    closed() {
      this.$parent.inittabData(1);
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__body {
  max-height: 500px;
}
</style>
