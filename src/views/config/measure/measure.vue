<!--量测量集-->
<template>
  <div class="measure-table">
    <div class="measure_head option_head">
      <el-input size="mini" v-model.trim="euqiptreeName" disabled></el-input>
      <el-input
        size="mini"
        v-model.trim="request.queryName"
        placeholder="输入量测量名称或标识以检索"
      ></el-input>
      <el-button
        size="mini"
        type="primary"
        @click="search"
        v-hasPermi="['ema:mparam:list']"
        >查询</el-button
      >
      <el-button @click="resetQuery" size="mini">重置</el-button>
      <div class="table_option">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="addBatch"
          v-hasPermi="['ema:mparam:add']"
          >批量新增量测量</el-button
        >
        <div class="table_right">
          <!--<el-button type="primary">导出模板</el-button>-->
          <!--<el-button type="success">导入</el-button>-->
          <!--<el-button type="primary">导出</el-button>-->
        </div>
      </div>
    </div>
    <div class="table">
      <el-table class="system" :data="tableData" stripe style="width: 100%">
        <el-table-column type="index" align="center" width="50" label="序号">
        </el-table-column>
        <el-table-column prop="name" align="center" label="量测量名称">
        </el-table-column>
        <el-table-column prop="identify" align="center" label="量测量标识">
        </el-table-column>
        <el-table-column
          prop="type"
          :formatter="typeFormatter"
          align="center"
          label="量测量分类"
        >
        </el-table-column>
        <el-table-column
          prop="euqiptreeId"
          :formatter="euqiptreeIdFormatter"
          align="center"
          label="所属量测集"
        >
        </el-table-column>
        <el-table-column prop="labels" align="center" label="标签">
        </el-table-column>
        <el-table-column prop="unit" align="center" label="单位">
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              v-hasPermi="['ema:mparam:update']"
              @click="editorMparam(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['ema:mparam:del']"
              @click="deleteMparam(scope.row)"
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
    <!--批量新增-->
    <div v-if="dialogVisibleparam">
      <modal
        :visible="dialogVisibleparam"
        customClass="customer-modal Maxform"
        @on-closed="dialogVisibleparamClosed"
      >
        <template slot="head">
          <span>批量新增量测量</span>
        </template>
        <template slot="body">
          <div class="table-modal">
            <hot-table
              :root="test"
              ref="textHot"
              :settings="hotSettings"
            ></hot-table>
          </div>
        </template>
        <template slot="foot">
          <el-button @click="dialogVisibleparamClosed" size="mini"
            >取消</el-button
          >
          <el-button type="primary" size="mini" @click="submit">导入</el-button>
        </template>
      </modal>
    </div>
    <!--修改弹框-->
    <modal
      :visible="dialogVisibleMparam"
      customClass="customer-modal  Miniform form-menu"
      @on-closed="dialogVisibleMparamClosed"
    >
      <template slot="head">
        <span>修改量测量</span>
      </template>
      <template slot="body">
        <el-form
          size="mini"
          ref="form"
          :model="form"
          :rules="rules"
          label-width="128px"
        >
          <el-form-item label="量测量名称：" prop="name">
            <el-input
              v-model.trim="form.name"
              placeholder="请输入量测量名称"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="量测量标识：" prop="identify">
            <el-input
              v-model.trim="form.identify"
              disabled
              placeholder="请输入量测量标识"
            />
          </el-form-item>
          <el-form-item label="量测量分类：" prop="type">
            <el-select v-model.trim="form.type" placeholder="请选择量测量分类">
              <el-option
                v-for="item in dict.measurement_type"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签：" prop="labels">
            <el-input
              v-model.trim="form.labels"
              placeholder="请输入量测量标签"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item label="单位：" prop="unit">
            <el-input
              v-model.trim="form.unit"
              placeholder="请输入量测量单位"
              maxlength="8"
            />
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleMparamClosed" size="mini"
          >取消</el-button
        >
        <el-button type="primary" @click="editorMparamSubmit" size="mini"
          >提交</el-button
        >
      </template>
    </modal>
  </div>
</template>
<script>
import pagination from "@/common/components/Pagination";
import {
  GET_EMA_MPARAM_LIST,
  ADD_EMA_MPARAM,
  EDITOR_EMA_MPARAM,
  DELETE_EMA_MPARAM,
} from "@/common/api/config/measure";
import { mapState } from "vuex";
import qs from "querystring";
import modal from "@/common/components/Modal";
import HotTable from "vue-handsontable-official";
import "handsontable/languages/zh-CN";
export default {
  components: { pagination, modal, HotTable },
  props: {
    measureObj: {
      // 叶子节点信息
      type: Object,
    },
    euqiptreeName: {
      type: String,
    },
    euqiptreeId: {
      type: Number,
    },
  },
  computed: {
    ...mapState(["dict"]),
  },
  name: "measure",
  data() {
    return {
      request: {
        queryName: "", // 角色类型
        pageNum: 1,
        pageSize: 10,
        euqiptreeId: "", // 叶子节点Id
      },
      //table数据
      tableData: [],
      totalNum: 0,
      dialogVisibleparam: false, // 批量新增弹框
      test: "test-hot",
      hotSettings: {
        width: 760,
        height: 300,
        colWidths: "177px",
        licenseKey: "non-commercial-and-evaluation", // 去除商业许可证密钥
        data: [], // 数据在这个里面,由数据填充表
        startRows: 10, //初始行数
        startCols: 4, // 初始列数
        minRows: 10, //最小行
        maxRows: 500, // 最大行
        rowHeaders: true, //行表头 //自定义列表头or 布尔值
        minSpareCols: 1, //列留白
        className: "htCenter", //容器元素的类名称
        currentRowClassName: "currentRow", //为选中行添加类名，可以更改样式
        currentColClassName: "currentCol", //为选中列添加类名
        autoWrapRow: true, //自动换行
        language: "zh-CN",
        contextMenu: [
          "row_above",
          "row_below",
          "---------",
          "remove_row",
          "---------",
          "alignment",
          "make_read_only",
          "copy",
          "cut",
        ], // 右键效果
        fillHandle: true, //选中拖拽复制 possible values: true, false, "horizontal", "vertical"
        fixedColumnsLeft: 0, //固定左边列数
        fixedRowsTop: 1, //固定上边行数
        columns: [
          //添加每一列的数据类型和一些配置
          { data: "name", title: "*量测量名称" }, // data后面跟的这个字段是上传对应的字段
          {
            data: "typeName",
            title: "*量测量分类",
            type: "dropdown",
            source: ["遥测", "遥信", "遥控"],
            strict: true,
            allowInvalid: false,
          },
          {
            data: "labels",
            title: "*标签",
          },
          {
            data: "unit",
            title: "单位",
          },
        ],
        afterChange: function () {
          //更改一个或多个单元格后触发
          this.updatePlayerList = this.getSourceData();
          // if (changes) {
          // changes.forEach(([, prop]) => {
          // if (prop === "name") {
          //   let namelist = this.updatePlayerList.filter(item => {
          //     return item.name;
          //   });
          //   for (let i = 0; i < namelist.length; i++) {
          //     for (let j = i + 1; j < namelist.length; j++) {
          //       if (namelist[i].name == namelist[j].name) {
          //         alert(`第1列量测量名称有重复，请修改！`);
          //         return false;
          //       }
          //     }
          //   }
          // }
          // });
          // }
        },
        updatePlayerList: null,
      },
      form: {}, // 导入按钮
      rules: {
        name: [
          { required: true, message: "量测量名称不能为空", trigger: "blur" },
        ],
        identify: [
          { required: true, message: "量测量标识不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "量测量分类不能为空", trigger: "change" },
        ],
        labels: [
          { required: true, message: "量测量标签不能为空", trigger: "blur" },
        ],
      },
      dialogVisibleMparam: false, // 量测量编辑弹框
    };
  },
  methods: {
    listSizeChange(e) {
      this.request.pageSize = e;
      this.getemaMparamList();
    },
    // 量测量列表
    getemaMparamList() {
      this.tableData = [];
      this.totalNum = 0;
      this.request.euqiptreeId = this.measureObj.id;
      GET_EMA_MPARAM_LIST(qs.stringify(this.request)).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    },
    // 量测量分类转字符串
    typeFormatter(row) {
      let dictLabel = "";
      this.dict.measurement_type.forEach((item) => {
        if (item.dictValue == row.type) {
          dictLabel = item.dictLabel;
        }
      });
      return dictLabel;
    },
    // 所属量测量级名字
    euqiptreeIdFormatter() {
      return this.measureObj.name;
    },
    // 翻页
    current(val) {
      this.request.pageNum = val;
      this.getemaMparamList();
    },
    /** 搜索按钮*/
    search() {
      this.request.pageNum = 1;
      this.getemaMparamList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.request.pageNum = 1;
      this.request.queryName = "";
      this.getemaMparamList();
    },
    /** 批量新增**/
    addBatch() {
      this.dialogVisibleparam = true;
      // this.swapHotData();
    },
    /** 批量新增关闭弹框 **/
    dialogVisibleparamClosed() {
      this.dialogVisibleparam = false;
      this.$refs.textHot.table.clear();
      this.hotSettings.data = [];
    },
    getSourceData: function () {
      return this.$refs.textHot.table.getSourceData();
    },
    submit: function () {
      const hotRef = this.$refs.textHot.table;
      this.arr = [];
      hotRef.validateCells((valid) => {
        if (valid) {
          try {
            this.getSourceData().forEach((item, index) => {
              if (item.name || item.typeName || item.labels) {
                if (item.name && item.typeName && item.labels) {
                  this.arr.push(item);
                  if (item.name.length > 20) {
                    throw new Error(
                      `第${index + 1}行量测量名称超过20个字符，请修改`
                    );
                  }
                  if (item.labels.length > 20) {
                    throw new Error(`第${index + 1}行标签超过20个字符，请修改`);
                  }
                  if (item.unit) {
                    if (item.unit.length > 8) {
                      throw new Error(
                        `第${index + 1}行单位超过8个字符，请修改`
                      );
                    }
                  }
                } else {
                  throw new Error(`请将第${index + 1}行,填写完整！`);
                }
              } else {
                this.arr.push({});
              }
            });
          } catch (e) {
            alert(e);
            return false;
          }
          if (this.arr.length > 0) {
            var nameFind = false;
            for (let v = 0; v < this.arr.length; v++) {
              for (let d = v + 1; d < this.arr.length; d++) {
                if (this.arr[v].labels && this.arr[d].labels) {
                  if (this.arr[v].labels == this.arr[d].labels) {
                    nameFind = true;
                    break;
                  }
                }
              }
              if (nameFind) break;
            }
            if (nameFind) {
              alert(`标签有重复，请修改！`);
              return false;
            }
            var dataArray = [];
            this.arr.forEach((item) => {
              if (item.name && item.typeName && item.labels) {
                item.euqiptreeId = this.measureObj.id;
                item.euqiptreeName = this.measureObj.name;
                item.tenantId = JSON.parse(
                  sessionStorage.getItem("userInfo")
                ).tenantId;
              } else {
                dataArray.push(item);
              }
              if (item.typeName === "遥测") {
                item.type = "2";
                delete item.typeName;
              } else if (item.typeName === "遥信") {
                item.type = "1";
                delete item.typeName;
              } else if (item.typeName === "遥控") {
                item.type = "3";
                delete item.typeName;
              }
            });
            if (dataArray.length == this.arr.length) {
              this.$message.error("请填写内容");
              return false;
            }
            ADD_EMA_MPARAM(this.arr).then((res) => {
              this.$message({
                message: `导入成功${res.data}条`,
                type: "success",
              });
              this.dialogVisibleparamClosed();
              this.getemaMparamList();
            });
          }
        } else {
          alert("请修改错误格式！");
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        euqiptreeId: "",
        name: "",
        identify: "",
        type: "",
        unit: "",
        labels: "",
        id: undefined,
      };
      this.resetForm("form");
    },
    // 修改当前值
    editorMparam(row) {
      this.reset();
      this.form = {
        id: row.id,
        euqiptreeId: row.euqiptreeId,
        name: row.name,
        identify: row.identify,
        type: row.type,
        unit: row.unit,
        labels: row.labels,
      };
      this.dialogVisibleMparam = true;
    },
    //  关闭弹框
    dialogVisibleMparamClosed() {
      this.dialogVisibleMparam = false;
      this.reset();
    },
    //  提交编辑
    editorMparamSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          EDITOR_EMA_MPARAM(qs.stringify(this.form)).then(() => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.dialogVisibleMparam = false;
            this.getemaMparamList();
          });
        }
      });
    },
    //  删除当前量测量
    deleteMparam(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前量测量",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_EMA_MPARAM(qs.stringify({ id: row.id })).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getemaMparamList();
          });
        })
        .catch(() => {});
    },
  },
  watch: {
    measureObj: function () {
      this.getemaMparamList(this.measureObj.id);
    },
  },
  mounted() {
    this.getemaMparamList();
  },
};
</script>
<style lang="scss" scoped>
.measure_head {
  margin-bottom: 10px;
  ::v-deep .el-input {
    width: 216px;
    margin-right: 20px;
  }
}
</style>
