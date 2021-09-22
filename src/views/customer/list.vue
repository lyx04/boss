<template>
  <div class="container customer">
    <el-form
      ref="form"
      size="mini"
      :model="form"
      :inline="true"
      label-position="left"
      label-width="80px"
    >
      <el-form-item label="企业名称:" prop="orgId">
        <el-select filterable v-model="form.orgId">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in formData.org.list"
            :key="item.orgId"
            :label="item.name"
            :value="item.orgId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区:">
        <el-cascader
          v-model="formData.area.value"
          :options="formData.area.list"
          :props="formData.area.props"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="企业性质:" prop="enterpriseProperty">
        <el-select v-model="form.enterpriseProperty">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in dictFilter('enterprise_property')"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型:" prop="businessEventsType">
        <el-select v-model="form.businessEventsType" multiple>
          <el-option
            v-for="item in dictFilter('business_events_type')"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户类型:" prop="orgType">
        <el-select v-model="form.orgType">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in dictFilter('org_type')"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select v-model="form.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="启用" value="0"></el-option>
          <el-option label="停用" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="技术支持:" prop="technicalSupport">
        <el-input v-model="form.technicalSupport"></el-input>
      </el-form-item>
      <el-form-item label="拓展人:" prop="developPeople">
        <el-input v-model="form.developPeople"></el-input>
      </el-form-item>
      <el-form-item label="抄表日:" prop="meterReading">
        <el-input v-model="form.meterReading"></el-input>
      </el-form-item>
      <el-form-item label="电价模板:" prop="electricityTemplate">
        <el-input v-model="form.electricityTemplate"></el-input>
      </el-form-item>
      <el-form-item label="基本电价计价方式:" prop="electricitPricingMode">
        <el-select v-model="form.electricitPricingMode">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in dictFilter('basic_electricit_pricing_mode')"
            :key="item.dictCode"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="initList()">查询</el-button>
        <el-button @click="resetform">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="buttons">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="addOrg"
        v-hasPermi="['system:org:add']"
      >
        新增客户</el-button
      >
      <el-button
        @click="batchEditSupport"
        type="success"
        plain
        icon="el-icon-edit"
        size="mini"
        v-hasPermi="['sys:boss:edit']"
      >
        批量修改技术支持</el-button
      >
      <el-button
        plain
        size="mini"
        icon="el-icon-download"
        type="warning"
        style="float: right"
        @click="exportlist"
        >导出</el-button
      >
    </div>
    <el-table
      ref="table"
      :data="listData"
      @selection-change="tableSelectChange"
      @select-all="tableSelectAll"
      style="width: 100%"
    >
      <el-table-column
        header-align="center"
        align="center"
        type="selection"
        width="55"
      >
      </el-table-column>
      <el-table-column
        width="100"
        fixed="left"
        header-align="center"
        align="center"
        prop="name"
        label="企业名称"
      >
      </el-table-column>
      <el-table-column
        width="130"
        header-align="center"
        align="center"
        label="地区"
      >
        <template slot-scope="scope">
          {{ scope.row.area }}
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="enterprisePropertyName"
        label="企业性质"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="businessEventsTypeName"
        label="项目类型"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="orgTypeName"
        label="客户类型"
      >
      </el-table-column>
      <el-table-column header-align="center" align="center" label="状态">
        <template slot-scope="scope">
          <el-switch
            size="mini"
            v-model.trim="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchChange($event, scope.row)"
            :disabled="orgIdSwitch == scope.row.orgid"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        width="90"
        header-align="center"
        align="center"
        prop="createTime"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="technicalSupport"
        label="技术支持"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="developPeople"
        label="拓展人"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="readingTime"
        label="抄表日"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="tempName"
        label="电价模板"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        prop="electricitPricingModeName"
        label="基本电价计价方式"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="是否参与辅助服务"
        prop="isLoadName"
      >
      </el-table-column>
      <el-table-column
        width="300"
        fixed="right"
        header-align="center"
        align="center"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="lookRow(scope.row.orgid)"
            v-hasPermi="['sys:boss:query']"
            >查看</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editOrg(scope.row)"
            v-hasPermi="['system:org:edit']"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status == 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-hasPermi="['system:org:remove']"
            @click="deleteOrg(scope.row)"
            >删除</el-button
          >
          <el-button
            v-if="scope.row.enterpriseProperty == 1"
            @click="editdispose(scope.row)"
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['system:org:edit']"
            >电费配置</el-button
          >
          <el-button
            @click="editread(scope.row)"
            size="mini"
            v-if="scope.row.enterpriseProperty == 1"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['system:org:edit']"
            >抄表日配置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 电费配置 -->
    <edit-modal
      :show.sync="editModal"
      :option="editParams"
      v-if="editModal"
      @refresh="initList"
    ></edit-modal>
    <!-- 抄表日配置 -->
    <readingModal
      :orgid="readingOrgId"
      :active.sync="readingactive"
      v-if="readingactive"
      @refresh="initList"
    ></readingModal>
    <!-- 批量修改技术支持 -->
    <edit-support
      @refresh="initList"
      :active.sync="supportModal"
      v-if="supportModal"
      :data="tableSelectList"
    ></edit-support>
    <pagination
      :pageSize="page.pageSize"
      :total="page.total"
      :currentPage.sync="page.pageNum"
      @handleCurrent="listcurrent"
      @size-change="listSizeChange"
    ></pagination>
    <!--新增客户-->
    <new-and-editor-organization
      :dialogVisibleOrganization="dialogVisibleOrganization"
      v-if="dialogVisibleOrganization"
      :orgTypeList="dict.org_type"
      @on-closed="dialogVisibleOrganizationClosed"
      @submit-org-form="submitOrgForm"
    ></new-and-editor-organization>
    <!--修改客户信息-->
    <editor-organization
      v-if="dialogVisibleEditorOrganization"
      :dialogVisibleEditorOrganization="dialogVisibleEditorOrganization"
      :orgId="this.orgId"
      @on-closed="dialogVisibleEditorOrganizationClosed"
      @submit-org-form="submitOrgForm"
    ></editor-organization>
  </div>
</template>

<script>
import pagination from "@/common/components/Pagination";
import * as customerService from "@/common/api/customerCore/customer";
import { GET_AREA_TREE } from "@/common/api/system/area";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/web/organization";
import { DELETE_ORG } from "@/common/api/web/organization";
import editModal from "./components/orgdisposeModal";
import readingModal from "./components/readingTimeModa";
import editSupport from "./components/editsupport";
import { mapState } from "vuex";
import hlcxjstool from "hlcx-jstool";
import NewAndEditorOrganization from "./components/NewAndOrganization";
import EditorOrganization from "./components/EditorOrganization";
//用于复选框选择多次出现提示
var t = "";

export default {
  components: {
    pagination,
    editModal,
    readingModal,
    editSupport,
    NewAndEditorOrganization,
    EditorOrganization,
  },
  computed: {
    ...mapState(["dict"]),
    dictFilter() {
      return (type) => {
        return this.dict[type];
      };
    },
  },
  data() {
    return {
      //用作多选框的开关
      selectFlag: false,
      editModal: false,
      readingactive: false,
      supportModal: false,
      readingOrgId: "",
      tableSelectList: [],
      editParams: {
        orgId: "",
        status: 20,
      },
      formData: {
        area: {
          list: [],
          props: {
            checkStrictly: true,
            value: "areaId",
            label: "areaName",
            children: "childs",
          },
          value: [],
        },
        org: {
          list: [],
        },
      },
      form: {
        orgId: "",
        enterpriseProperty: "",
        businessEventsType: [],
        orgType: "",
        status: "",
        technicalSupport: "",
        developPeople: "",
        meterReading: "",
        electricityTemplate: "",
        electricitPricingMode: "",
      },
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      listData: [],
      dialogVisibleOrganization: false, // 新增客户、编辑客户弹框
      orgId: "", // 修改orgId
      dialogVisibleEditorOrganization: false, // 修改客户
      orgIdSwitch: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      dialogVisibleCoefficient: false, // 系数弹框
    };
  },
  mounted() {
    this.initarea();
    this.initOrgList();
  },
  methods: {
    initList(pageNum = 1) {
      this.selectFlag = false;
      this.page.pageNum = pageNum;
      this.tableSelectList = [];
      this.form["provincial"] = this.formData.area.value[0];
      this.form["city"] = this.formData.area.value[1];
      this.form["district"] = this.formData.area.value[2];
      var business_events_type = [].concat(this.form.businessEventsType);
      var params = Object.assign({}, this.form, this.page, {
        businessEventsType: business_events_type.join(","),
      });
      console.log(params);
      customerService.GET_CUSTOMER_LIST(params).then((e) => {
        this.listData = e.rows;
        this.page.total = e.total;
      });
    },
    initarea() {
      GET_AREA_TREE().then((res) => {
        res.data.forEach((item) => {
          if (item.childs.length > 0) {
            item.childs.forEach((val) => {
              if (val.childs.length > 0) {
                val.childs.forEach((child) => {
                  delete child.childs;
                });
              } else {
                delete val.childs;
              }
            });
          } else {
            delete item.childs;
          }
        });
        if (res.data.length > 0) {
          this.formData.area.value = [res.data[0].areaId];
        }
        this.formData.area.list = res.data;
        this.initList();
      });
    },
    initOrgList() {
      GET_SYSTEM_ORG_LIST().then((e) => {
        this.formData.org.list = hlcxjstool.jshandle.getFilterOrgList(e.data);
      });
    },
    exportlist() {
      var str = "";
      for (var i in this.form) {
        var value =
          this.form[i] == undefined || this.form[i] == null ? "" : this.form[i];
        str += i + "=" + value + "&";
      }
      window.open(
        `${
          process.env.VUE_APP_BASE_URL
        }/iemc-system/boss/clientManagement/export?${str}accessToken=${JSON.parse(
          sessionStorage.getItem("access_token")
        )}`
      );
    },
    editdispose(item) {
      this.editParams.orgId = item.orgid;
      this.editModal = true;
    },
    editread(item) {
      this.readingactive = true;
      this.readingOrgId = item.orgid;
    },
    lookRow(e) {
      this.$router.push({
        path: "/customer/view/" + e,
      });
    },
    // 删除
    deleteOrg(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message:
          "确定要删除该客户吗？删除后该客户下的所有数据将被删除，且不可恢复",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_ORG(row.orgid).then(() => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.initList();
          });
        })
        .catch(() => {});
    },
    switchChange(e, row) {
      var num = 0;
      if (this.orgIdSwitch != row.orgid) {
        let perm = "sys:boss:edit";
        JSON.parse(sessionStorage.getItem("permissions")).forEach((item) => {
          if (item === perm || item === "*:*:*") {
            num += 1;
            if (num == 1) {
              customerService
                .UPDATE_STATUS(row.orgid, e)
                .then((res) => {
                  if (res.code == 200) {
                    this.initList(this.page.pageNum);
                    if (e == "1") {
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
                    num = 0;
                  }
                })
                .catch(() => {
                  this.initList(this.page.pageNum);
                });
            }
          }
        });
      }
    },
    //批量修改技术支持
    batchEditSupport() {
      if (this.tableSelectList.length) {
        this.supportModal = true;
      } else {
        this.$message.warning("请选择企业");
      }
    },
    resetform() {
      this.resetForm("form");
      if (this.formData.area.list.length > 0) {
        this.formData.area.value = [this.formData.area.list[0].areaId];
      }
      this.initList();
    },
    listcurrent(e) {
      this.initList(e);
    },
    listSizeChange(e) {
      this.page.pageSize = e;
      this.initList();
    },
    //每一个复选框的操作
    tableSelectChange(e) {
      var cacheArr = [];
      if (e.length) {
        cacheArr.push(e[0].parentId);
        for (var i = 0; i < e.length; i++) {
          if (cacheArr.indexOf(e[i].parentId) < 0) {
            clearTimeout(t);
            t = setTimeout(() => {
              this.$message.error("勾选企业的上级企业不同，不可被选中");
            }, 500);
            this.$refs.table.toggleRowSelection(e[i], false);
            return false;
          }
        }
        this.tableSelectList = e;
      } else {
        clearTimeout(t);
      }
    },
    tableSelectAll() {
      if (this.selectFlag) {
        this.$refs.table.clearSelection();
        this.tableSelectList = [];
      }
      this.selectFlag = !this.selectFlag;
    },
    //  新增客户
    addOrg() {
      this.dialogVisibleOrganization = true;
    },
    //  关闭新增客户修改客户弹框
    dialogVisibleOrganizationClosed() {
      this.dialogVisibleOrganization = false;
    },
    //  新增客户成功
    submitOrgForm() {
      this.initList();
    },
    // 修改客户
    editOrg(row) {
      this.dialogVisibleEditorOrganization = true;
      this.orgId = row.orgid;
    },
    // 关闭修改客户信息
    dialogVisibleEditorOrganizationClosed() {
      this.dialogVisibleEditorOrganization = false;
    },
    //  点击修改系数
    coefficient() {
      this.dialogVisibleCoefficient = true;
    },
    // 关闭弹框
    dialogVisibleCoefficientClosed() {
      this.dialogVisibleCoefficient = false;
    },
  },
};
</script>

<style scoped lang="scss">
.buttons {
  margin-bottom: 8px;
}
.el-table {
  font-size: 10px;
}
</style>
