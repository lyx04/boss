<template>
  <div class="main-content">
    <!--筛选-->
    <div class="form-screening">
      <el-form
        :model="request"
        ref="request"
        label-width="86px"
        :inline="true"
        size="small"
      >
        <el-form-item label="告警策略:" prop="alarmStrategy">
          <el-input
            v-model="request.alarmStrategy"
            placeholder="请输入告警策略"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="所属客户:" prop="orgId">
          <el-select v-model.trim="request.orgId" placeholder="请选择所属客户">
            <el-option label="全部" value=""></el-option>
            <template v-for="item in orgList">
              <el-option
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="电压等级:" prop="voltageGrade">
          <el-select
            v-model.trim="request.voltageGrade"
            placeholder="请选择电压等级"
          >
            <el-option label="全部" value=""></el-option>
            <template v-for="item in voltageGradeList">
              <el-option
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="告警类型:" prop="alarmType">
          <el-select
            v-model.trim="request.alarmType"
            placeholder="请选择告警类型"
          >
            <el-option label="全部" value=""></el-option>
            <template v-for="item in alarmTypeList">
              <el-option
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="告警等级:" prop="alarmGrade">
          <el-select
            v-model.trim="request.alarmGrade"
            placeholder="请选择告警等级"
          >
            <el-option label="全部" value=""></el-option>
            <template v-for="item in alarmGradeList">
              <el-option
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" size="mini">查询</el-button
          ><el-button @click="resetQuery" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-form">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="addAlarmStrategy"
        >新增</el-button
      >
    </div>
    <!--table-->
    <div class="h-table-content">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="策略名称"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="所属客户"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="电压等级"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="策略类型"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="规则"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="告警类型"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="告警等级"
          width="100"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template>
            <el-button size="mini" type="text" icon="el-icon-document-copy"
              >复制</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-edit"
              >修改</el-button
            >
            <el-button size="mini" type="text" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
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
    <add-user-alarm
      v-if="dialogVisibleUserAlarm"
      :dialogVisibleUserAlarm="dialogVisibleUserAlarm"
      @dialogVisibleUserAlarmClosed="dialogVisibleUserAlarmClosed"
    ></add-user-alarm>
  </div>
</template>

<script>
import page from "@/common/components/Pagination";
import AddUserAlarm from "./AddUserAlarm";
export default {
  name: "userAlarm",
  components: {
    page,
    AddUserAlarm,
  },
  data() {
    return {
      request: {
        // 告警策略
        alarmStrategy: "",
        //  所属客户
        orgId: "",
        //  电压等级
        voltageGrade: "",
        //  告警类型
        alarmType: "",
        //  告警等级，
        alarmGrade: "",
        pageNum: 1,
        pageSize: 10,
      },
      // 客户列表
      orgList: [],
      //  电压等级
      voltageGradeList: [],
      //  告警类型
      alarmTypeList: [],
      //  告警等级
      alarmGradeList: [],
      tableData: [{ name: "萨达了宽度就按睡了多久萨达萨达啊首都萨达" }],
      totalNum: 110,
      // 新增告警策略
      dialogVisibleUserAlarm: false,
    };
  },
  methods: {
    //  搜索
    search() {
      this.request.pageNum = 1;
    },
    // 重置
    resetQuery() {
      this.resetForm("request");
      this.request.pageNum = 1;
    },
    //  新增
    addAlarmStrategy() {
      this.dialogVisibleUserAlarm = true;
    },
    // 取消新增
    dialogVisibleUserAlarmClosed() {
      this.dialogVisibleUserAlarm = false;
    },
    //  翻页
    handleCurrent(val) {
      this.request.pageNum = val;
    },
    //修改一页条数
    handleSizeChange(val) {
      this.request.pageNum = 1;
      this.request.pageSize = val;
    },
  },
};
</script>

<style scoped lang="scss">
.main-content {
  .add-form {
    margin-left: 8px;
    margin-bottom: 12px;
  }
  .h-table-content {
    margin-left: 8px;
  }
}
</style>
