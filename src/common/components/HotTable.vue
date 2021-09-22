<template>
  <div class="table-modal">
    <hot-table :settings="hotSettings"></hot-table>
  </div>
</template>

<script>
import HotTable from "vue-handsontable-official";
import "handsontable/languages/zh-CN";

export default {
  components: { HotTable },
  props: {
    width: {
      // 宽
      type: Number,
      default: 760,
    },
    height: {
      //高
      type: Number,
      default: 300,
    },
    colWidths: {
      // 每列宽度
      type: String,
      default: "224px",
    },
    addExcelSetting: {
      type: Array,
    },
    startRows: {
      //初始行数
      type: Number,
      default: 1,
    },
    startCols: {
      // 初始列数
      type: Number,
      default: 3,
    },
    minRows: {
      //最小行
      type: Number,
      default: 1,
    },
    maxRows: {
      // 最大行
      type: Number,
      default: 500,
    },
    contextMenu: {
      //  右键效果
      type: Array,
      // default: ["remove_row", "---------", "alignment", "copy", "cut"]
    },
    hiddenColumns: {
      // 隐藏列
      type: Array,
      //  [0]
    },
    columns: {
      //添加每一列的数据类型和一些配置
      type: Array,
      //  { data: "orgId", title: "*id", readOnly: true },
    },
    afterChange: Function,
  },
  data() {
    return {
      hotSettings: {
        width: this.width,
        height: this.height,
        // stretchH: "all",
        colWidths: this.colWidths,
        licenseKey: "non-commercial-and-evaluation", // 去除商业许可证密钥
        data: this.addExcelSetting, // 数据在这个里面,由数据填充表
        startRows: this.startRows, //初始行数
        startCols: this.startCols, // 初始列数
        minRows: this.minRows, //最小行
        maxRows: this.maxRows, // 最大行
        rowHeaders: true, //行表头 //自定义列表头or 布尔值
        minSpareCols: 1, //列留白
        className: "htCenter", //容器元素的类名称
        currentRowClassName: "currentRow", //为选中行添加类名，可以更改样式
        currentColClassName: "currentCol", //为选中列添加类名
        autoWrapRow: true, //自动换行
        language: "zh-CN",
        contextMenu: this.contextMenu, // 右键效果
        fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
        fixedColumnsLeft: 0, //固定左边列数
        fixedRowsTop: 1, //固定上边行数
        hiddenColumns: {
          // 隐藏列
          columns: this.hiddenColumns,
          indicators: true,
        },
        columns: this.columns,
        afterChange: this.afterChange,
        updatePlayerList: null,
      },
    };
  },
  methods: {},
};
</script>

<style scoped></style>
