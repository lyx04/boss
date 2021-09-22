<template>
  <div>
    <!-- 在线excel-->
    <modal
      customClass="Maxform"
      :visible="modalExcelMeasurevisible"
      @on-closed="dialogVisibleExcelMeasureClosed"
    >
      <template slot="head">
        <template>批量添加映射关系</template>
      </template>
      <template slot="body">
        <div class="table-modal">
          <hot-table
            root="test-hot"
            ref="textHot"
            :colWidths="hotSettings.colWidths"
            :startRows="hotSettings.startRows"
            :startCols="hotSettings.startCols"
            :addExcelSetting="addExcelSetting"
            :contextMenu="hotSettings.contextMenu"
            :columns="hotSettings.columns"
            :afterChange="hotSettings.afterChange"
          ></hot-table>
        </div>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleExcelMeasureClosed">取消</el-button>
        <el-button type="primary" @click="measureSubmit">确认</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import HotTable from "@/common/components/HotTable";
import { ADD_ALL_CPS_IEMC_SIGHT } from "@/common/api/system/cps.js";

export default {
  name: "AddExcelMeasure",
  components: { modal, HotTable },
  props: {
    modalExcelMeasurevisible: {
      type: Boolean,
    },
    addExcelSetting: {
      type: Array,
    },
  },
  data() {
    return {
      hotSettings: {
        colWidths: "177px",
        startRows: 1, //初始行数
        startCols: 4, // 初始列数
        contextMenu: ["remove_row", "---------", "alignment", "copy", "cut"], // 右键效果
        columns: [
          //添加每一列的数据类型和一些配置
          { data: "name", title: "*量测量名称", readOnly: true },
          { data: "label", title: "*标签", readOnly: true },
          {
            data: "cpsLabel",
            title: "*CPS量测量标识",
          },
          {
            data: "callTypeName",
            title: "*CPS量测量分类码",
            type: "dropdown",
            source: ["遥信", "SOE", "遥测"],
            strict: true,
            allowInvalid: false,
          },
        ],
        afterChange: function () {
          //更改一个或多个单元格后触发
          this.updatePlayerList = this.getSourceData();
        },
      },
    };
  },
  methods: {
    dialogVisibleExcelMeasureClosed() {
      this.$emit("on-excel-closed");
    },
    // excel修改
    getSourceData: function () {
      return this.$refs.textHot.$children[0].table.getSourceData();
    },
    measureSubmit() {
      const hotRef = this.$refs.textHot.$children[0].table;
      this.arr = [];
      hotRef.validateCells((valid) => {
        if (valid) {
          try {
            this.getSourceData().forEach((item, index) => {
              if (
                item.name ||
                item.label ||
                item.cpsLabel ||
                item.callTypeName
              ) {
                if (
                  item.name &&
                  item.label &&
                  item.cpsLabel &&
                  item.callTypeName
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
          this.arr.forEach((item) => {
            if (item.callTypeName === "遥信") {
              item.callType = "1";
            } else if (item.callTypeName === "SOE") {
              item.callType = "2";
            } else if (item.callTypeName === "遥测") {
              item.callType = "3";
            }
          });
          if (this.arr.length > 0) {
            var nameFind = false;
            var index;
            for (let v = 0; v < this.arr.length; v++) {
              for (let d = v + 1; d < this.arr.length; d++) {
                if (this.arr[v].cpsLabel && this.arr[d].cpsLabel) {
                  if (this.arr[v].cpsLabel == this.arr[d].cpsLabel) {
                    index = `第${v + 1}、${d + 1}行`;
                    nameFind = true;
                    break;
                  }
                }
              }
              if (nameFind) break;
            }
            if (nameFind) {
              alert(`${index}CPS量测量标识有重复，请修改！`);
              return false;
            }
            ADD_ALL_CPS_IEMC_SIGHT(this.arr).then(() => {
              this.$message({
                message: `导入成功${this.arr.length}条`,
                type: "success",
              });
              this.dialogVisibleExcelMeasureClosed();
              this.$emit("submit-excel-measure");
            });
          }
        } else {
          alert("请修改错误格式！");
        }
      });
    },
  },
};
</script>

<style scoped></style>
