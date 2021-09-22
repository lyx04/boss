<!--映射关系-->
<template>
  <div class="mapping">
    <div class="option_head">
      <el-select
        size="mini"
        v-model.trim="request.factoryId"
        placeholder="请选择厂家"
      >
        <el-option
          v-for="item in factoryList"
          :key="item.id"
          :value="item.id"
          :label="item.factoryName"
        ></el-option>
      </el-select>
      <el-input
        size="mini"
        v-model.trim="request.queryName"
        placeholder="输入量测量名称或标识以检索"
      ></el-input>
      <el-button
        type="primary"
        size="mini"
        @click="search"
        v-hasPermi="['ema:pf:list']"
        >查询</el-button
      >
      <el-button @click="resetQuery" size="mini">重置</el-button>
      <div class="table_option">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          v-hasPermi="['ema:pf:add']"
          @click="batchAdd"
          >批量添加映射</el-button
        >
        <!--<div class="table_right">-->
        <!--<el-button type="primary">导出模板</el-button>-->
        <!--<el-button type="success">导入</el-button>-->
        <!--<el-button type="primary">导出</el-button>-->
        <!--</div>-->
      </div>
    </div>
    <div class="mapping_table">
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
        <el-table-column prop="euqiptreeName" align="center" label="所属量测集">
        </el-table-column>
        <el-table-column prop="labels" align="center" label="标签">
        </el-table-column>
        <el-table-column align="center" label="单位">
          <template slot-scope="scope">
            {{ scope.row.unit || "--" }}
          </template>
        </el-table-column>
        <el-table-column
          width="200"
          prop="factoryMeasureId"
          align="center"
          label="厂家量测量ID"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.editflag">
              <el-input
                size="mini"
                v-model.trim="scope.row.factoryidInputNew"
                placeholder="请输入厂家量测量ID"
              ></el-input>
              <i
                slot="suffix"
                class="el-input__icon el-icon-circle-check"
                @click="updateFactoryMeasureId(scope.row)"
              ></i>
              <i
                slot="suffix"
                @click="
                  scope.row.editflag = false;
                  scope.row.factoryidInputNew = '';
                "
                class="el-input__icon el-icon-circle-close"
              ></i>
            </template>
            <template v-else>
              {{ scope.row.factoryMeasureId }}
            </template>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['ema:pf:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="scope.row.editflag = true"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['ema:pf:del']"
              @click="deletefactoryMeasureId(scope.row)"
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
    <!-- 分割线 -->

    <commonModal
      :visible="dialogVisible"
      customClass="customer-modal Maxform"
      @on-closed="dialogVisibleparamClosed"
    >
      <template slot="body">
        <div class="mes">
          <p>删除后平台将无法识别厂家该量测量!</p>
        </div>
      </template>
      <template slot="foot">
        <el-button size="mini">取消</el-button>
        <el-button type="primary" size="mini">确认</el-button>
      </template>
    </commonModal>
    <!--批量新增-->
    <!--batchAdd -->
    <div v-if="dialogVisibleFactoryBind">
      <modal
        :visible="dialogVisibleFactoryBind"
        customClass="customer-modal Maxform"
        @on-closed="dialogVisibleFactoryBindClosed"
      >
        <template slot="head">
          <span>批量添加映射</span>
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
          <el-button @click="dialogVisibleFactoryBindClosed" size="mini"
            >取消</el-button
          >
          <el-button type="primary" @click="submit" size="mini">导入</el-button>
        </template>
      </modal>
    </div>
  </div>
</template>
<script>
import commonModal from "@/common/components/Modal";
import pagination from "@/common/components/Pagination";
import HotTable from "vue-handsontable-official";
import "handsontable/languages/zh-CN";
import qs from "querystring";
import { mapState } from "vuex";
import {
  GET_EMA_FACTORY_BINDLIST,
  GET_EMA_FACTORY,
  GET_EMA_MPARAM_LIST,
  ADD_EMA_FACTORY_BATCHADD,
  DELETE_EMA_FACTORY_PFDEL,
  UPDATE_EMA_FACTORY_PFUPDATE,
} from "@/common/api/config/measure";
import modal from "@/common/components/Modal";
export default {
  components: { commonModal, pagination, modal, HotTable },
  data() {
    return {
      request: {
        queryName: "", // 搜索
        pageNum: 1,
        pageSize: 10,
        factoryId: "", // 厂家id
      },
      tableData: [],
      totalNum: 0, // 总数
      factoryList: [], // 厂家selet
      modalDelect: false,
      survey: "",
      indexes: "",
      dialogVisibleFactoryBind: false, // 批量导入弹框
      test: "test-hot",
      hotSettings: {
        width: 760,
        height: 300,
        colWidths: "101px",
        licenseKey: "non-commercial-and-evaluation", // 去除商业许可证密钥
        data: [], // 数据在这个里面,由数据填充表
        startRows: 10, //初始行数
        startCols: 7, // 初始列数
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
          {
            data: "identify",
            title: "*量测量标识",
          },
          { data: "name", title: "*量测量名称", readOnly: true }, // data后面跟的这个字段是上传对应的字段
          {
            data: "typeName",
            title: "*量测量分类",
            readOnly: true,
          },
          {
            data: "euqiptreeName",
            title: "*所属量测量集",
            readOnly: true,
          },
          {
            data: "labels",
            title: "*标签",
            readOnly: true,
          },
          {
            data: "unit",
            title: "单位",
            readOnly: true,
          },
          {
            data: "factoryMeasureId",
            title: "*厂家量测量ID",
          },
        ],
        afterChange: function (changes) {
          //更改一个或多个单元格后触发
          this.updatePlayerList = this.getSourceData();
          if (changes) {
            var data;
            changes.forEach(([rows, prop, , newvalue]) => {
              if (prop === "identify") {
                //if (prop === "name") {
                // data = {
                //   name: newvalue
                // };
                // } else
                if (prop === "identify") {
                  data = {
                    identify: newvalue,
                  };
                }
                GET_EMA_MPARAM_LIST(qs.stringify(data)).then((res) => {
                  if (res.rows.length > 0) {
                    if (res.rows[0].type == 2) {
                      res.rows[0].typeName = "遥测";
                    } else if (res.rows[0].type == 1) {
                      res.rows[0].typeName = "遥信";
                    }
                    this.updatePlayerList[rows] = res.rows[0];
                    this.loadData(this.updatePlayerList);
                  }
                });
              }
            });
          }
        },
        updatePlayerList: null,
      },
    };
  },
  computed: {
    ...mapState(["dict"]),
  },
  methods: {
    // 列表
    getFactoryBindList() {
      this.tableData = [];
      GET_EMA_FACTORY_BINDLIST(this.request).then((res) => {
        res.data.forEach((item) => {
          item.editflag = false;
        });
        this.tableData = res.data;
        // this.totalNum = res.total;
      });
    },
    // 翻页
    current(val) {
      this.request.pageNum = val;
      this.getFactoryBindList();
    },
    //  厂家列表
    getFactoryList() {
      GET_EMA_FACTORY().then((res) => {
        this.factoryList = res.rows;
        this.request.factoryId = res.rows[0].id;
        this.getFactoryBindList();
      });
    },
    // 量测量分类转字符串
    // eslint-disable-next-line no-unused-vars
    typeFormatter(row) {
      let dictLabel = "";
      this.dict.measurement_type.forEach((item) => {
        if (item.dictValue == row.type) {
          dictLabel = item.dictLabel;
        }
      });
      return dictLabel;
    },
    /** 搜索按钮*/
    search() {
      this.request.pageNum = 1;
      this.getFactoryBindList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.request.pageNum = 1;
      this.request.queryName = "";
      this.getFactoryBindList();
    },
    // 关闭导入
    batchAdd() {
      this.dialogVisibleFactoryBind = true;
    },
    // 批量导入关闭
    dialogVisibleFactoryBindClosed() {
      this.dialogVisibleFactoryBind = false;
      this.$refs.textHot.table.clear();
    },
    getSourceData: function () {
      return this.$refs.textHot.table.getSourceData();
    },
    // 批量导入
    submit() {
      this.arr = [];
      try {
        this.getSourceData().forEach((item, index) => {
          if (item.id || item.factoryMeasureId) {
            if (item.id && item.factoryMeasureId) {
              this.arr.push(item);
            } else {
              throw new Error(`请将第${index + 1}行,填写完整！`);
            }
          }
        });
      } catch (e) {
        alert(e);
        return false;
      }
      if (this.arr.length > 0) {
        var idFind = false;
        var factoryMeasureIdFind = false;
        for (let v = 0; v < this.arr.length; v++) {
          for (let d = v + 1; d < this.arr.length; d++) {
            if (this.arr[v].id == this.arr[d].id) {
              idFind = true;
              break;
            }
            if (this.arr[v].factoryMeasureId == this.arr[d].factoryMeasureId) {
              factoryMeasureIdFind = true;
              break;
            }
          }
          if (idFind) break;
          if (factoryMeasureIdFind) break;
        }
        if (idFind) {
          alert(`量测量数据有重复，请修改！`);
          return false;
        }
        if (factoryMeasureIdFind) {
          alert(`厂家量测量ID数据有重复，请修改！`);
          return false;
        }
      }
      var paramsArray = [];
      this.arr.forEach((item) => {
        paramsArray.push({
          factoryId: this.request.factoryId,
          factoryMeasureId: item.factoryMeasureId,
          measureParamId: item.id,
        });
      });
      ADD_EMA_FACTORY_BATCHADD(paramsArray).then(() => {
        this.$message({
          message: "新增成功",
          type: "success",
        });
        this.dialogVisibleFactoryBindClosed();
        this.getFactoryBindList();
      });
    },
    //  删除当前映射
    deletefactoryMeasureId(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前映射关系",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_EMA_FACTORY_PFDEL(qs.stringify({ id: row.id })).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getFactoryBindList();
          });
        })
        .catch(() => {});
    },
    //
    updateFactoryMeasureId(row) {
      var params = {
        id: row.id,
        factoryMeasureId: row.factoryidInputNew,
        factoryId: this.request.factoryId,
      };
      UPDATE_EMA_FACTORY_PFUPDATE(qs.stringify(params)).then(() => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.getFactoryBindList();
      });
    },
    listSizeChange(e) {
      this.request.pageSize = e;
      this.getFactoryList();
    },
  },
  created() {
    this.getFactoryList();
  },
};
</script>
<style lang="scss" scoped>
.factory {
  .table_option {
    margin-bottom: 10px;
  }
}
::v-deep .el-table {
  .el-input__icon {
    line-height: 24px;
    cursor: pointer;
  }
  .el-input {
    width: 70%;
  }

  .el-input__inner {
    // height: 24px;
  }
}
</style>
