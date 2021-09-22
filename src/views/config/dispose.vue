<template>
  <div class="dispose container">
    <!-- 分时计量配置 -->
    <div class="metering input">
      <el-form label-position="left" size="mini" inline>
        <el-form-item label="方案名称:">
          <el-input
            placeholder="请输入字典名称"
            v-model="schemeName"
            @input="meterSearch"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="newMeter"
        v-hasPermi="['system:plan:add']"
      >
        新增</el-button
      >
      <el-table :data="meterTableData" style="width: 100%">
        <el-table-column prop="scheme" align="center" label="方案名称">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['system:plan:update']"
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="openmeter(scope.row)"
              >编辑</el-button
            >
            <el-button
              v-if="scope.row.fixed != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              v-hasPermi="['system:plan:delete']"
              @click="delectmeter(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :pageSize="meterPage.pageSize"
        :total="meterPage.total"
        :currentPage1.sync="meterPage.pageNum"
        @handleCurrent="metercurrent"
        @size-change="listSizeChange"
      ></pagination>
    </div>
    <!-- 分割线 -->
    <!-- 操作分时计量方案 -->
    <modal
      customClass="Miniform"
      :visible="meterModal.active"
      @on-closed="meterModal.active = false"
    >
      <template slot="head">
        <span>{{ meterModal.title }}分时计量方案</span>
      </template>
      <template slot="body">
        <el-form
          ref="meterform"
          :rules="meterModal.rules"
          :model="meterModal.form"
          size="mini"
        >
          <el-form-item label="方案名称" prop="scheme" label-width="100px">
            <el-input
              v-model.trim="meterModal.form.scheme"
              maxlength="20"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 分时方案的时间选择 -->
        <el-table :data="meterModal.tableData" style="width: 100%">
          <el-table-column
            prop="dictLabel"
            align="center"
            width="80px"
            label="时段名称"
          >
          </el-table-column>
          <el-table-column prop="timeArray" align="center" label="时段">
            <template slot-scope="scope">
              <div
                style="
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  cursor: pointer;
                "
                @click="openTimeModal(scope)"
              >
                <template v-if="scope.row.timeArray.length > 0">
                  <span
                    v-for="(time, index) in scope.row.timeArray"
                    :key="index"
                  >
                    {{ time }}
                  </span>
                </template>
                <template v-else>
                  <div>选择时间</div>
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template slot="foot">
        <el-button @click="meterModal.active = false">取消</el-button>
        <el-button type="primary" @click="saveMeter">保存</el-button>
      </template>
    </modal>
    <!-- 时间段弹框 -->
    <modal
      v-if="timesModal.active"
      customClass="Maxform"
      :visible="timesModal.active"
      @on-closed="timeSub"
    >
      <template slot="head">
        <span>时间段选择</span>
      </template>
      <template slot="body">
        <div class="checkedBoxs">
          <el-checkbox
            :checked="
              timesModal.activeCheckList.indexOf(item) >= 0 ||
              (timesModal.activeCheckList.indexOf(item) < 0 &&
                timesModal.checkBoxList.indexOf(item) < 0)
            "
            :true-label="1"
            :false-label="0"
            @change="checkChange(item, $event)"
            v-for="(item, index) in meterTimes"
            :key="index"
            :disabled="
              timesModal.activeCheckList.indexOf(item) < 0 &&
              timesModal.checkBoxList.indexOf(item) < 0
            "
            >{{ item }}</el-checkbox
          >
        </div>
      </template>
      <template slot="foot">
        <el-button @click="timeSub">确认</el-button>
      </template>
    </modal>
  </div>
</template>
<script>
import pagination from "@/common/components/Pagination";
import modal from "@/common/components/Modal";
import { mapState } from "vuex";
import { meterTime } from "../../common/config/meterTime";
import * as disposeServe from "@/common/api/config/dispose";
var t;
export default {
  components: { pagination, modal },
  computed: {
    ...mapState(["dict"]),
  },
  data() {
    return {
      meterTimes: meterTime,
      meterTableData: [],
      //分时方案搜索
      schemeName: "",
      //分时方案分页
      meterPage: {
        total: "",
        pageNum: 1,
        pageSize: 10,
      },
      meterModal: {
        title: "新增",
        form: {
          scheme: "",
        },
        active: false,
        rules: {
          scheme: [
            { required: true, message: "请输入方案名称", trigger: "blur" },
          ],
        },
        tableData: [],
      },
      //时间段弹框信息
      timesModal: {
        active: false,
        checkBoxList: [].concat(meterTime),
        //用于当前时段操作的数组
        activeCheckList: [],
        //用于存储当前时段的数组
        cacheCheckList: [],
        //当前选择的数据
        activeRow: "",
      },
    };
  },
  mounted() {
    this.meterModal.tableData = [];
    this.initPlan();
  },
  methods: {
    listSizeChange(e) {
      this.meterPage.pageSize = e;
      this.meterPage.pageNum = 1;
      this.initPlan();
    },
    //分时计量配置
    initPlan(scheme = this.schemeName) {
      scheme ? (this.meterPage.pageNum = 1) : scheme;
      var params = {
        pageSize: this.meterPage.pageSize,
        pageNum: this.meterPage.pageNum,
        scheme: scheme,
      };
      disposeServe.GET_PLAN_LIST(params).then((e) => {
        this.meterTableData = e.rows;
        this.meterPage.total = e.total;
      });
    },
    //分时方案的搜索
    meterSearch(e) {
      clearTimeout(t);
      t = setTimeout(() => {
        this.initPlan(e);
      }, 500);
    },
    metercurrent(e) {
      this.meterPage.pageNum = e;
      this.initPlan();
    },
    //编辑分时方案
    openmeter(data) {
      this.meterModal.tableData = [];
      this.timesModal.checkBoxList = [].concat(meterTime);
      disposeServe.GET_PLAN_QUERY(data.id).then((e) => {
        for (var i = 0; i < this.dict.sp_work_type.length; i++) {
          var isexist = e.data.timeShareSubEntityList.filter((j) => {
            return j.dictValue == this.dict.sp_work_type[i].dictValue;
          });
          if (!isexist.length) {
            var obj = this.dict.sp_work_type[i];
            obj["timeArray"] = [];
            e.data.timeShareSubEntityList.push(obj);
          }
        }
        this.meterModal.form = e.data;
        this.meterModal.tableData = e.data.timeShareSubEntityList;
        e.data.timeShareSubEntityList.forEach((i) => {
          if (i.timeArray.length) {
            i.timeArray.forEach((j) => {
              var index = this.timesModal.checkBoxList.indexOf(j);
              if (index >= 0) {
                this.timesModal.checkBoxList.splice(index, 1);
              }
            });
          }
        });
      });
      this.meterModal.title = "编辑";
      this.meterModal.active = true;
    },
    //删除分时方案
    delectmeter(data) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前分时方案",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          disposeServe.DELECT_PLAN(data.id).then((e) => {
            if (e.code == 200) {
              this.$message.success("删除成功");
              this.initPlan();
            }
          });
        })
        .catch(() => {});
    },
    //新增分时弹框
    newMeter() {
      this.meterModal.form = {};
      this.meterModal.tableData = [];
      this.timesModal.checkBoxList = [].concat(meterTime);
      for (var i = 0; i < this.dict.sp_work_type.length; i++) {
        this.meterModal.tableData.push(
          Object.assign({ timeArray: [] }, this.dict.sp_work_type[i])
        );
      }
      this.meterModal.title = "新增";
      this.meterModal.active = true;
    },
    //保存分时计量方案
    saveMeter() {
      this.$refs.meterform.validate((e) => {
        if (e) {
          if (this.timesModal.checkBoxList.length > 0) {
            this.$message.error("请选择所有的时间段");
            return false;
          }
          var params = {
            scheme: this.meterModal.form.scheme,
            timeShareSubEntityList: this.meterModal.tableData,
          };
          if ("id" in this.meterModal.form) {
            params["id"] = this.meterModal.form.id;
            disposeServe.UPDATE_PLAN(params).then((e) => {
              if (e.code == 200) {
                this.$message.success("修改成功");
                this.initPlan();
                this.meterModal.active = false;
              }
            });
          } else {
            disposeServe.ADD_PLAN(params).then((e) => {
              if (e.code == 200) {
                this.$message.success("添加成功");
                this.initPlan();
                this.meterModal.active = false;
              }
            });
          }
        }
      });
    },
    //打开选择时间段
    openTimeModal(scope) {
      this.timesModal.activeCheckList = scope.row.timeArray;
      this.timesModal.cacheCheckList = [].concat(scope.row.timeArray);
      this.timesModal.activeRow = Object.assign({}, scope.row);
      this.timesModal.cacheCheckList.forEach((i) => {
        var index = meterTime.indexOf(i);
        this.timesModal.checkBoxList.splice(index, 0, i);
      });
      this.timesModal.active = true;
    },
    checkChange(value, e) {
      if (e) {
        this.timesModal.activeCheckList.push(value);
      } else {
        this.timesModal.activeCheckList.splice(
          this.timesModal.activeCheckList.indexOf(value),
          1
        );
      }
    },
    //选择时间段后的确认
    timeSub() {
      var active = this.meterModal.tableData.filter((i) => {
        return i.dictValue == this.timesModal.activeRow.dictValue;
      });
      active[0].timeArray = this.timesModal.activeCheckList;
      this.timesModal.activeCheckList.forEach((i) => {
        this.timesModal.checkBoxList.splice(
          this.timesModal.checkBoxList.indexOf(i),
          1
        );
      });
      this.timesModal.active = false;
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-dialog__body {
  .checkedBoxs {
    padding: 0 40px;
  }

  .el-form-item {
    .el-form-item__label {
      padding-left: 20px;
    }
    &.morefont {
      .el-form-item__content {
        .el-input-number {
          width: 50px;
          input {
            padding: 0;
            padding-left: 5px;
          }
        }
      }
    }
    .el-form-item__content {
      color: white;
    }
  }
}
</style>
