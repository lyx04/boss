// 测点选择
<template>
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
          <el-button type="primary" @click="initData" v-hasPermi="['*:*:*']">
            搜索</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        @selection-change="tablechange"
        ref="table"
        row-key="id"
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
          reserve-selection
        ></el-table-column>
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
      </el-table>
    </template>
    <template slot="foot">
      <el-button @click="closed">取消</el-button>
      <el-button type="primary" @click="subok">确认</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";
import {
  GET_IEMC_SIGHT,
  GET_IEMCDEVSIGHT_MEASURELIST,
} from "@/common/api/system/cps";
export default {
  components: { modal },
  props: {
    visible: Boolean,
    title: String,
    codes: Number,
  },
  data() {
    return {
      tableData: [],
      tableChangeArray: [],
      form: {
        name: "",
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.table.clearSelection();
    });
    this.initData();
  },
  methods: {
    initData() {
      if (this.codes) {
        //获取当前设备的所有量测量列表
        var params = {
          cpsIemcDevCpsCode: this.codes,
          name: this.form.name,
        };
        GET_IEMCDEVSIGHT_MEASURELIST(params).then((e) => {
          this.tableData = e.data;
        });
      } else {
        //获取所有的量测量列表
        GET_IEMC_SIGHT(this.form).then((e) => {
          this.tableData = e.rows;
        });
      }
    },
    subok() {
      console.log(this.tableChangeArray);
      var subarr = [];
      if (this.tableChangeArray.length) {
        this.tableChangeArray.forEach((i) => {
          if (this.codes) {
            subarr.push(i.cpsIemcSightCpsLabel);
          } else {
            subarr.push(i.cpsLabel);
          }
        });
        this.$emit("cpslabels", subarr);
      }
      this.closed();
    },
    tablechange(e) {
      this.tableChangeArray = e;
    },
    closed() {
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
