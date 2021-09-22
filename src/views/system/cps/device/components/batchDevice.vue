// 批量添加设备
<template>
  <modal customClass="Maxform" :visible="visible" @on-closed="closed">
    <template slot="head">
      <div class="title_left">
        <span>批量添加设备</span>
        <!-- <el-button>批量删除</el-button> -->
      </div>
      <div class="title_right">
        <el-select size="mini" v-model="orgNum" @change="orgChange" filterable>
          <el-option
            v-for="item in orgList"
            :key="item.id"
            :label="item.name"
            :value="item.orgId"
          >
          </el-option>
        </el-select>
        <el-select
          size="mini"
          v-model="powerNum"
          @change="powerChange"
          filterable
        >
          <el-option
            v-for="item in powerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div style="clear: both"></div>
    </template>
    <template slot="body">
      <div class="table-modal">
        <hot-table
          v-if="addExcelSetting.length"
          root="test-hot"
          ref="textHot"
          :colWidths="hotSettings.colWidths"
          :startRows="hotSettings.startRows"
          :startCols="hotSettings.startCols"
          :addExcelSetting="addExcelSetting"
          :contextMenu="hotSettings.contextMenu"
          :columns="hotSettings.columns"
          :hiddenColumns="hotSettings.hiddenColumns"
          :afterChange="hotSettings.afterChange"
        ></hot-table>
      </div>
    </template>
    <template slot="foot">
      <el-button @click="closed">取消</el-button>
      <el-button type="primary" @click="Submit">导入</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";

import HotTable from "@/common/components/HotTable";
import {
  GET_CPS_IEMC_ORG,
  ADD_DEV_CPS,
  GET_ORG_DEV,
} from "@/common/api/system/cps";
import { GET_METER_SELECT } from "@/common/api/customerCore/customer";
export default {
  props: {
    visible: Boolean,
  },
  components: { modal, HotTable },
  data() {
    return {
      orgList: [],
      orgNum: "",
      powerList: [],
      powerNum: "",
      addExcelSetting: [],
      hotSettings: {
        colWidths: "172px",
        startRows: 1, //初始行数
        startCols: 4, // 初始列数
        contextMenu: ["remove_row", "---------", "alignment", "copy", "cut"], // 右键效果
        hiddenColumns: [0, 1, 2],
        columns: [
          //添加每一列的数据类型和一些配置
          { data: "dev", title: "dev", readOnly: true },

          { data: "sn", title: "sn", readOnly: true },
          { data: "cpsOrgCode", title: "cpsOrgCode", readOnly: true },

          { data: "devName", title: "设备名称", readOnly: true },
          { data: "typeName", title: "设备类型", readOnly: true },
          {
            data: "cpsCode",
            title: "*设备编码",
          },
          {
            data: "devType",
            title: "*设备类型编码",
          },
        ],
        afterChange: function () {
          //更改一个或多个单元格后触发
          this.updatePlayerList = this.getSourceData();
        },
      },
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    // excel修改
    getSourceData: function () {
      return this.$refs.textHot.$children[0].table.getSourceData();
    },
    Submit() {
      console.log(11);
      const hotRef = this.$refs.textHot.$children[0].table;
      this.arr = [];
      hotRef.validateCells((valid) => {
        if (valid) {
          try {
            this.getSourceData().forEach((item, index) => {
              if (
                item.dev ||
                item.sn ||
                item.cpsOrgCode ||
                item.devName ||
                item.typeName ||
                item.cpsCode ||
                item.devType
              ) {
                if (
                  item.dev &&
                  item.sn &&
                  item.cpsOrgCode &&
                  item.devName &&
                  item.typeName &&
                  item.cpsCode &&
                  item.devType
                ) {
                  this.arr.push(item);
                } else {
                  throw new Error(`请将第${index + 1}行,填写完整！`);
                }
              } else {
                throw new Error(`请最少提交一条！`);
              }
            });
          } catch (e) {
            alert(e);
            return false;
          }
          if (this.arr.length > 0) {
            var nameFind = false;
            var index;
            for (let v = 0; v < this.arr.length; v++) {
              for (let d = v + 1; d < this.arr.length; d++) {
                if (this.arr[v].cpsCode && this.arr[d].cpsCode) {
                  if (this.arr[v].cpsCode == this.arr[d].cpsCode) {
                    index = `第${v + 1}、${d + 1}行`;
                    nameFind = true;
                    break;
                  }
                }
              }
              if (nameFind) break;
            }
            if (nameFind) {
              alert(`${index}设备编码有重复，请修改！`);
              return false;
            }
            var params = {
              cpsOrgCode: this.arr[0].cpsOrgCode,
              roomName: this.arr[0].roomname,
              devs: this.arr,
            };
            ADD_DEV_CPS(params).then((e) => {
              if (e.code == 200) {
                this.$message.success("添加成功");
                this.closed();
                this.$parent.inittabData(1);
              }
            });
          }
        } else {
          alert("请修改错误格式！");
        }
      });
    },
    initData() {
      GET_CPS_IEMC_ORG().then((e) => {
        this.orgList = e.rows;
      });
    },
    orgChange(e) {
      this.powerNum = "";
      GET_METER_SELECT(e, 13).then((list) => {
        this.powerList = list.data;

        this.addExcelSetting = [];

        if (this.powerList.length) {
          this.powerNum = list.data[0].id;

          this.powerChange(list.data[0].id);
        }
      });
    },
    powerChange(e) {
      this.addExcelSetting = [];
      var org = this.orgList.filter((i) => {
        return this.orgNum == i.orgId;
      });
      var power = this.powerList.filter((i) => {
        return this.powerNum == i.id;
      });
      var params = {
        categorys: "4,9,14",
        eleId: e,
        measures: "alldevs",
      };
      GET_ORG_DEV(params).then((list) => {
        list.data.forEach((i) => {
          i.devName = i.name;
          i.cpsOrgCode = org[0].cpsCode;
          i.roomname = power[0].name;
          delete i.capacity;
          delete i.releInterval;
          delete i.name;
          delete i.id;
        });
        this.addExcelSetting = list.data;
      });
    },
    closed() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header {
  .el-cascader,
  .el-select {
    display: inline-block;
  }
  .el-select {
    .el-input {
      .el-input__inner {
        height: 30px;
        line-height: 30px;
      }
      .el-input__icon {
        line-height: 30px;
      }
    }
  }
}
.title_right {
  float: right;
  margin-right: 30px;
}
.title_left {
  float: left;
}
</style>
