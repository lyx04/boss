<!--参数管理-->
<template>
  <div class="container">
    <paramTree @nodeClick="main"></paramTree>
    <div class="parameManage">
      <template v-if="request.euqiptreeId">
        <div class="table_option">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="addData"
            v-hasPermi="['ema:qType:add']"
            >新增</el-button
          >
        </div>
        <div class="parame_table">
          <el-table class="system" :data="tableData" stripe style="width: 100%">
            <el-table-column
              type="index"
              align="center"
              width="50"
              label="序号"
            >
            </el-table-column>
            <el-table-column prop="paramName" align="center" label="参数名称">
            </el-table-column>
            <el-table-column
              prop="paramType"
              :formatter="paramTypeFormatter"
              align="center"
              label="数据类型"
            >
            </el-table-column>
            <el-table-column prop="unit" align="center" label="单位">
              <template slot-scope="scope">
                {{ scope.row.unit || "--" }}
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否必填">
              <template slot-scope="scope">
                {{ scope.row.isMust == 1 ? "是" : "否" }}
              </template>
            </el-table-column>
            <el-table-column prop="paramLevel" align="center" label="层级">
              <template #default="{ row }">
                {{ paramLevelFilter(row.paramLevel) }}
              </template>
            </el-table-column>
            <el-table-column prop="defaultVal" align="center" label="默认值">
              <template slot-scope="scope">
                {{ scope.row.defaultVal || "--" }}
              </template>
            </el-table-column>
            <el-table-column prop="state" align="center" label="状态">
              <template slot-scope="scope">
                <el-switch
                  size="mini` "
                  v-model.trim="scope.row.state"
                  active-value="1"
                  inactive-value="0"
                  active-color="#2689EE"
                  inactive-color="#E97E62"
                  :disabled="scope.row.isInitialize == 1"
                  @click.native.prevent="
                    changeListType(scope.row, scope.$index)
                  "
                >
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="sort" align="center" label="排序">
            </el-table-column>
            <el-table-column align="center" label="操作" width="240">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  v-hasPermi="['ema:qType:update']"
                  @click="dataEdit(scope.row)"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  v-if="scope.row.isInitialize == 0"
                  v-hasPermi="['ema:qType:del']"
                  @click="datamodelOption(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <pagination
            :pageSize="request.pageSize"
            :total="totalNum"
            @handleCurrent="current"
            @size-change="listSizeChange"
          ></pagination>
        </div>
        <!-- 分割线 -->
        <commonModal
          @on-closed="modalDataClosed"
          :visible="modalData"
          customClass="Miniform"
        >
          <template slot="head">
            <span>{{ modalDataTitle }}参数</span>
          </template>
          <template slot="body">
            <span
              style="
                display: inline-block;
                width: 100%;
                font-size: 12px;
                padding-left: 75px;
                color: red;
                margin-bottom: 10px;
                margin-top: 10px;
              "
              >提示：修改参数字典也会同步修改相关关联的设备</span
            >
            <el-form
              :rules="rules"
              :model="form"
              ref="form"
              label-width="100px"
              size="mini"
            >
              <el-form-item label="参数名称:" prop="paramName">
                <el-input
                  maxlength="20"
                  v-model.trim="form.paramName"
                  :disabled="form.isInitialize == 1"
                ></el-input>
              </el-form-item>
              <el-form-item label="数据类型:" prop="paramType">
                <el-select
                  :disabled="form.isInitialize == 1"
                  v-model.trim="form.paramType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in dictnameFilter"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                  <el-option
                    value="5"
                    label="系统勾选"
                    v-if="form.paramType == 5"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="form.paramType == '4'"
                label=""
                prop="dataLimitVal"
              >
                <el-input
                  v-model.trim="form.dataLimitVal"
                  placeholder="限制值请用','隔开"
                ></el-input>
              </el-form-item>
              <el-form-item label="单位:" prop="unit">
                <el-input v-model.trim="form.unit"></el-input>
              </el-form-item>
              <el-form-item label="是否必填:" prop="isMust">
                <el-radio-group
                  v-model.trim="form.isMust"
                  :disabled="form.isInitialize == 1"
                >
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="层级:"
                prop="paramLevel"
                placeholder="请选择"
              >
                <el-select
                  v-model.trim="form.paramLevel"
                  :disabled="form.isInitialize == 1"
                >
                  <el-option
                    v-for="(item, index) in dict.param_level"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="默认值:" prop="defaultVal">
                <el-input
                  v-model.trim="form.defaultVal"
                  maxlength="50"
                ></el-input>
              </el-form-item>
              <el-form-item label="排序:" prop="sort">
                <el-input-number
                  v-model.trim="form.sort"
                  controls-position="right"
                  :min="0"
                  :max="99"
                />
              </el-form-item>
            </el-form>
          </template>
          <template slot="foot">
            <el-button @click="modalDataClosed">取消</el-button>
            <el-button type="primary" @click="submitData">确定</el-button>
          </template>
        </commonModal>
      </template>
      <template v-else>
        <div class="el__empty-block">
          <span>请选中有参数的设备节点哦！</span>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import paramTree from "./tree";
import commonModal from "@/common/components/Modal";
import pagination from "@/common/components/Pagination";
import qs from "querystring";
import {
  GET_EMA_EQUIPTYPE_LIST,
  ADD_EMA_EQUIPTYPE,
  UPDATE_EMA_EQUIPTYPE,
  DELETE_EMA_EQUIPTYPE,
} from "@/common/api/config/parameter";
import { mapState } from "vuex";

export default {
  components: { commonModal, pagination, paramTree },
  computed: {
    ...mapState(["dict"]),
    dictnameFilter() {
      if (this.dict.prama_type.length) {
        var paramaType = this.dict.prama_type.filter((i) => {
          return i.dictLabel != "系统数据勾选";
        });
        return paramaType;
      }
      return [];
    },
  },
  data() {
    var data_limit_val = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入限制值"));
      } else {
        if (value.length > 2 && value.indexOf(",") >= 1) {
          callback();
        } else {
          callback(new Error("限制值请用英文半角的','隔开"));
        }
      }
    };
    return {
      modalDataTitle: "新增",
      rules: {
        paramName: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
        paramType: [
          { required: true, message: "请选择数据类型", trigger: "blur" },
        ],
        isMust: [
          { required: true, message: "请选择是否必填", trigger: "blur" },
        ],
        paramLevel: [
          { required: true, message: "请选择层级", trigger: "blur" },
        ],
        dataLimitVal: [{ validator: data_limit_val, trigger: "blur" }],
      },
      form: {},
      tableData: [],
      totalNum: 0,
      request: {
        pageNum: 1,
        pageSize: 10,
        euqiptreeId: "",
      },
      modalData: false, // 新增、编辑弹框
    };
  },
  methods: {
    listSizeChange(e) {
      this.request.pageSize = e;
      this.main(this.request.euqiptreeId);
    },
    //过滤层级成文字
    // eslint-disable-next-line no-unused-vars
    paramLevelFilter(val) {
      var name = this.dict.param_level.filter((i) => {
        return i.dictValue == val;
      });
      return name[0].dictLabel;
    },
    //新增表单
    addData() {
      this.reset();
      this.modalData = true;
      this.modalDataTitle = "新增";
    },
    // 关闭新增、修改表单
    modalDataClosed() {
      this.modalData = false;
      this.reset();
    },
    main(id) {
      this.request.pageNum = 1;
      this.request.euqiptreeId = id;
      this.getEmaEquipTypeList();
    },
    //数据修改
    dataEdit(data) {
      this.reset();
      this.form = {
        id: data.id,
        euqiptreeId: this.request.euqiptreeId,
        paramName: data.paramName,
        paramType: data.paramType,
        dataLimitVal: data.dataLimitVal,
        unit: data.unit,
        paramLevel: data.paramLevel,
        defaultVal: data.defaultVal,
        sort: data.sort,
        isMust: data.isMust,
        state: data.state,
        isInitialize: data.isInitialize,
      };
      console.log(this.form);
      this.modalData = true;
      this.modalDataTitle = "修改";
    },
    //表格删除操作
    datamodelOption(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前参数",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_EMA_EQUIPTYPE(row.id).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getEmaEquipTypeList();
          });
        })
        .catch(() => {});
    },
    // 新增、修改表单提交
    submitData() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != undefined) {
            if (this.form.paramType != 4) {
              this.form.dataLimitVal = "";
            }
            UPDATE_EMA_EQUIPTYPE(qs.stringify(this.form)).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.modalData = false;
              this.getEmaEquipTypeList();
            });
          } else {
            ADD_EMA_EQUIPTYPE(this.form).then(() => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.modalData = false;
              this.getEmaEquipTypeList();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 查询参数列表
    getEmaEquipTypeList() {
      GET_EMA_EQUIPTYPE_LIST(this.request).then((res) => {
        this.tableData = res.rows;
        this.totalNum = res.total;
      });
    },
    //  翻页器
    current(val) {
      this.request.pageNum = val;
      this.getEmaEquipTypeList();
    },
    // 数据类型
    // eslint-disable-next-line no-unused-vars
    paramTypeFormatter(row) {
      let paramTypeName = "";
      this.dict.prama_type.forEach((item) => {
        if (item.dictValue == row.paramType) {
          paramTypeName = item.dictLabel;
        }
      });
      return paramTypeName;
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        euqiptreeId: this.request.euqiptreeId,
        paramName: "",
        paramType: "",
        dataLimitVal: "",
        unit: "",
        paramLevel: "",
        defaultVal: "",
        sort: 0,
        isMust: "1",
        state: "1",
        isInitialize: 0,
      };
      this.resetForm("form");
    },
    // 参数状态修改
    changeListType(row) {
      if (row.isInitialize == 0) {
        let data = {
          state: row.state == 0 ? "0" : "1",
          id: row.id,
          euqiptreeId: row.euqiptreeId,
          isInitialize: row.isInitialize,
          paramName: row.paramName,
        };
        UPDATE_EMA_EQUIPTYPE(qs.stringify(data))
          .then(() => {
            if (data.state === "0") {
              this.$message({
                type: "success",
                message: "禁用成功",
              });
            } else {
              this.$message({
                type: "success",
                message: "启用成功",
              });
            }
            this.getEmaEquipTypeList();
          })
          .catch(() => {
            this.getEmaEquipTypeList();
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  position: relative;
}
::v-deep .el-dialog__header {
  margin-bottom: 0;
}
.parameManage {
  margin-left: 260px;
  .table_option {
    margin-bottom: 10px;
  }
}
</style>
