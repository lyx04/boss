<template>
  <div>
    <!-- 在线excel-->
    <modal
      customClass="Maxform"
      :visible="modalExcelorgvisible"
      @on-closed="dialogVisibleExcelorgClosed"
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
            :hiddenColumns="hotSettings.hiddenColumns"
          ></hot-table>
        </div>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleExcelorgClosed">取消</el-button>
        <el-button type="primary" @click="measureSubmit">确认</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import HotTable from "@/common/components/HotTable";
import { ADD_ALL_CPS_IEMC_ORG } from "@/common/api/system/cps.js";

export default {
  name: "AddExcelOrg",
  components: { modal, HotTable },
  props: {
    modalExcelorgvisible: {
      type: Boolean,
    },
    addExcelSetting: {
      type: Array,
    },
  },
  data() {
    return {
      hotSettings: {
        colWidths: "230px",
        startRows: 1, //初始行数
        startCols: 3, // 初始列数
        contextMenu: ["remove_row", "---------", "alignment", "copy", "cut"], // 右键效果
        hiddenColumns: [0],
        columns: [
          //添加每一列的数据类型和一些配置
          { data: "orgId", title: "*id", readOnly: true },
          { data: "name", title: "*企业名称", readOnly: true },
          {
            data: "cpsCode",
            title: "*企业编码",
          },
          {
            data: "areaNo",
            title: "*地区编码",
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
    dialogVisibleExcelorgClosed() {
      this.$emit("on-org-closed");
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
              if (item.name || item.cpsCode || item.areaNo) {
                if (item.name && item.cpsCode && item.areaNo) {
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
              alert(`${index}企业编码有重复，请修改！`);
              return false;
            }
            ADD_ALL_CPS_IEMC_ORG(this.arr).then(() => {
              this.$message({
                message: `导入成功${this.arr.length}条`,
                type: "success",
              });
              this.dialogVisibleExcelorgClosed();
              this.$emit("submit-excel-org");
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
