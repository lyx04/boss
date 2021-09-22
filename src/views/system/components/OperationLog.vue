<template>
  <div class="operation-log-content">
    <!--筛选-->
    <!--role筛选-->
    <div class="log-screening">
      <el-form
        :model="request"
        ref="request"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item label="系统模块:" prop="title">
          <el-input
            v-model.trim="request.title"
            clearable
            placeholder="请输入系统模块"
          ></el-input>
        </el-form-item>
        <el-form-item label="操作用户:" prop="operName">
          <el-input
            v-model.trim="request.operName"
            clearable
            placeholder="请输入操作用户"
          ></el-input>
        </el-form-item>
        <el-form-item label="所属客户:">
          <el-select
            v-model="request.orgId"
            filterable
            placeholder="请选择所属客户"
          >
            <el-option
              v-for="item in orgList"
              :key="item.orgId"
              :label="item.name"
              :value="item.orgId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作时间:">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button
          ><el-button @click="resetQuery" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--table-->
    <div class="h-table-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          prop="operId"
          align="center"
          width="160"
          label="日志编号"
        >
        </el-table-column>
        <el-table-column
          prop="title"
          align="center"
          width="100"
          label="系统模块"
        >
        </el-table-column>
        <el-table-column align="center" label="操作内容">
          <template slot-scope="scope">
            {{ scope.row.businessType | businessTypeFilter(that)
            }}{{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="登录方式">
          <template slot-scope="scope">
            {{ scope.row.operLocation }}（{{ scope.row.operIp }}）
          </template>
        </el-table-column>
        <el-table-column
          prop="operName"
          align="center"
          width="160"
          label="操作用户"
        >
        </el-table-column>
        <el-table-column align="center" label="所属用户">
          <template slot-scope="scope">
            {{ scope.row.orgId | orgFilter(that) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="operTime"
          align="center"
          width="160"
          label="操作时间"
        >
        </el-table-column>
      </el-table>
      <page
        :pageSize="request.pageSize"
        :currentPage1.sync="request.pageNum"
        :total="totalNum"
        @size-change="handleSizeChange"
        @handleCurrent="handleCurrent"
      ></page>
    </div>
  </div>
</template>

<script>
import { GET_OPERLOG_LIST } from "@/common/api/system/log";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";
import page from "@/common/components/Pagination";
import { mapState } from "vuex";

export default {
  name: "OperationLog",
  components: {
    page,
  },
  computed: {
    ...mapState(["dict"]),
  },
  data() {
    return {
      that: this,
      request: {
        title: "",
        operName: "",
        orgId: Number(JSON.parse(sessionStorage.getItem("userInfo")).orgId),
        pageNum: 1,
        pageSize: 10,
      },
      dateRange: [],
      totalNum: 110,
      tableData: [],
      orgList: [], // 所属客户列表
    };
  },
  filters: {
    businessTypeFilter: function (val, that) {
      for (let i in that.dict.business_type) {
        if (val == that.dict.business_type[i].dictValue) {
          return that.dict.business_type[i].dictLabel;
        }
      }
    },
    orgFilter: function (val, that) {
      for (let i in that.orgList) {
        if (val == that.orgList[i].orgId) {
          return that.orgList[i].name;
        }
      }
    },
  },
  methods: {
    getOperList() {
      GET_OPERLOG_LIST(this.addDateRange(this.request, this.dateRange)).then(
        (res) => {
          this.tableData = res.rows;
          this.totalNum = res.total;
        }
      );
    },
    /** 搜索按钮*/
    search() {
      this.request.pageNum = 1;
      this.getOperList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.request.orgId = Number(
        JSON.parse(sessionStorage.getItem("userInfo")).orgId
      );
      this.resetForm("request");
      this.request.pageNum = 1;
      this.dateRange = [];
      this.getOperList();
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
      this.getOperList();
    },
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
      this.getOperList();
    },
    //  查询操作类型
    getbusinessTypeList() {
      GET_SYSTEM_ORG_LIST().then((res) => {
        this.orgList = res.data;
        this.request.orgId = Number(
          JSON.parse(sessionStorage.getItem("userInfo")).orgId
        );
      });
    },
  },
  mounted() {
    this.getOperList();
    this.getbusinessTypeList();
  },
};
</script>

<style scoped lang="scss">
.log-screening-inline {
  display: inline-block;
  &.log-screening-inline-btn {
    margin-left: 8px;
    position: relative;
    top: -1px;
    .el-button {
      padding: 9px 20px;
    }
  }
  .el-form-item__content {
    width: 217px;
  }
}
.h-table-content {
  margin-top: 3px;
}
</style>
