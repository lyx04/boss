<template>
  <div class="version">
    <el-form ref="queryform" size="mini" inline :model="queryForm">
      <el-form-item label="系统类型:" prop="systemType">
        <el-select v-model="queryForm.systemType">
          <el-option
            v-for="item in sysType"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="版本名称:" prop="versionName">
        <el-input v-model="queryForm.versionName"></el-input>
      </el-form-item>
      <el-form-item label="版本创建时间：" prop="createTime">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="queryForm.createTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="getVersionlist(1)" size="mini"
        >查询</el-button
      >
      <el-button type="primary" @click="resetquery" size="mini">重置</el-button>
    </el-form>
    <el-button
      @click="addButton"
      type="primary"
      plain
      icon="el-icon-plus"
      size="mini"
      >新增</el-button
    >
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="label" label="APP名称" align="center">
      </el-table-column>
      <el-table-column prop="systemType" label="系统类型" align="center">
        <template slot-scope="scope">
          {{ dictFilter(scope.row.systemType) }}
        </template>
      </el-table-column>
      <el-table-column prop="versionCode" label="版本号" align="center">
      </el-table-column>
      <el-table-column prop="versionName" label="版本名称" align="center">
      </el-table-column>
      <el-table-column prop="appSize" label="版本大小" align="center">
      </el-table-column>

      <el-table-column prop="downloadLink" label="下载链接" align="center">
      </el-table-column>
      <el-table-column prop="createTime" label="版本创建时间" align="center">
      </el-table-column>
      <el-table-column prop="isForceUpdate" label="是否强制更新" align="center">
        <template slot-scope="scope">
          {{ scope.row.isForceUpdate == 1 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editRow(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="delect(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <page
      :pageSize="pageSize"
      :currentPage1.sync="pageNum"
      :total="total"
      @handleCurrent="pageCurrent"
      @size-change="listSizeChange"
    ></page>
    <common-modal
      :visible="versionModal"
      customClass="Miniform"
      @on-closed="cancelModal"
    >
      <template slot="head">
        <span>{{ "id" in form ? "修改" : "新增" }}版本信息</span>
      </template>
      <template slot="body">
        <el-form
          size="mini"
          :rules="rules"
          :model="form"
          ref="form"
          label-width="130px"
        >
          <el-form-item label="系统类型:" prop="systemType">
            <el-select
              @change="systemTypeChange"
              v-model.trim="form.systemType"
              :disabled="'id' in form"
            >
              <el-option
                v-for="item in dict.app_system"
                :label="item.dictLabel"
                :value="item.dictValue"
                :key="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上传APK:" v-show="form.systemType == '02'">
            <el-upload
              class="avatar-uploader"
              action=""
              :http-request="uploadFile"
              :show-file-list="false"
            >
              <el-button>上传</el-button>
            </el-upload>
            <el-progress
              :stroke-width="16"
              :text-inside="true"
              :percentage="percentage"
              v-show="(percentage < 100 && percentage != 0) || percenFlag"
            ></el-progress>
          </el-form-item>
          <el-form-item
            label="APP名称:"
            prop="label"
            v-show="form.systemType == '02'"
          >
            <el-input
              type="text"
              v-model.trim="form.label"
              :disabled="form.systemType == '02'"
            >
            </el-input>
          </el-form-item>
          <el-form-item
            label="包名:"
            prop="packageName"
            v-show="form.systemType == '02'"
          >
            <el-input
              type="text"
              v-model.trim="form.packageName"
              :disabled="form.systemType == '02'"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="版本号:" prop="versionCode">
            <el-input
              type="text"
              v-model.trim="form.versionCode"
              :disabled="form.systemType == '02'"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="版本名称:" prop="versionName">
            <el-input
              type="text"
              v-model.trim="form.versionName"
              :disabled="form.systemType == '02'"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="版本大小:" prop="appSize">
            <el-input
              type="text"
              v-model.trim="form.appSize"
              :disabled="form.systemType == '02'"
            >
              <template slot="append">M</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="下载链接:"
            prop="downloadLink"
            v-show="form.systemType == '02'"
          >
            <el-input type="text" v-model.trim="form.downloadLink" disabled>
            </el-input>
          </el-form-item>
          <el-form-item label="版本信息:" prop="versionInfo">
            <el-input
              type="textarea"
              v-model.trim="form.versionInfo"
              :rows="2"
              placeholder="请输入内容"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="是否强制更新:" prop="isForceUpdate">
            <el-radio v-model="form.isForceUpdate" label="1">是</el-radio>
            <el-radio v-model="form.isForceUpdate" label="0">否</el-radio>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="cancelModal">取消</el-button>
        <el-button type="primary" @click="addVersion">确认</el-button>
      </template>
    </common-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";
import commonModal from "@/common/components/Modal";
import page from "@/common/components/Pagination";
import { VersionUpload } from "@/common/api/file";
import * as versionServeice from "@/common/api/config/version";
export default {
  components: { commonModal, page },
  computed: {
    ...mapState(["dict"]),
    sysType() {
      if (this.dict.app_system) {
        return this.dict.app_system;
      } else {
        return [];
      }
    },
  },
  mounted() {
    this.getVersionlist();
  },
  methods: {
    listSizeChange(e) {
      this.pageSize = e;
      this.getVersionlist();
    },
    //系统类型的选择
    systemTypeChange(e) {
      this.resetForm("form");
      this.form.systemType = e;
    },
    // 自定义上传
    uploadFile(params) {
      var file = params.file;
      var filename = file.name.toLowerCase();
      if (!filename.match(/[0-9]\.[0-9]\.[0-9]/g)) {
        this.$message.error("上传文件格式错误,请重新上传");
      }
      let fd = new FormData();
      fd.append("file", file);
      fd.append("bucket", "mobile");
      // var xhr = new XMLHttpRequest();
      // xhr.open(
      //   "POST",
      //   "http://test-gateway.hlcxies.com/iemc-oss/minio/uploadFile"
      // );
      // xhr.setRequestHeader(
      //   "Authorization",
      //   "Bearer 18aef0fd-d71c-48ae-9318-cbcddb3b9b8e"
      // );
      // xhr.send(fd);
      VersionUpload(
        fd,
        (size) => {
          this.percenFlag = true;
          var percen = (size.loaded / size.total) * 100;
          this.percentage = Math.round(percen) - 1;
        },
        (e) => {
          this.fileCancel = e;
        }
      )
        .then((res) => {
          this.percentage = 100;
          setTimeout(() => {
            this.percenFlag = false;
          }, 500);
          this.form.downloadLink = res.data.downloadLink;
          this.form.versionName = res.data.versionName;
          this.form.versionCode = res.data.versionCode;
          this.form.label = res.data.label;
          this.form.appSize = res.data.appSize;
          this.form.packageName = res.data.packageName;
          this.$message.success("上传成功");
        })
        .catch(() => {
          this.percenFlag = false;
          this.percentage = 0;
          //     this.$message.error("上传失败");
        });
    },
    resetquery() {
      this.resetForm("queryform");
      this.getVersionlist(1);
    },
    addButton() {
      this.versionModal = true;
      this.resetForm("form");
      delete this.form.id;
    },
    delect(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "是否删除当前版本",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          versionServeice.DELECT_VERSION(row.id).then((e) => {
            if (e.code == 200) {
              this.$message.success("删除成功");
              this.getVersionlist();
            }
          });
        })
        .catch(() => {});
    },
    editRow(row) {
      versionServeice
        .GET_VERSION_DETAILE(row.versionCode, row.systemType)
        .then((e) => {
          this.versionModal = true;
          this.$nextTick(() => {
            this.form = e.data;
          });
        });
    },
    dictFilter(val) {
      var data = this.dict.app_system.filter((i) => {
        return i.dictValue == val;
      });
      if (data.length) {
        return data[0].dictLabel;
      }
    },
    pageCurrent(e) {
      this.getVersionlist(e);
    },
    getVersionlist(pageNum) {
      var params = {
        beginTime: this.queryForm.createTime
          ? this.queryForm.createTime[0]
          : "",
        endTime: this.queryForm.createTime ? this.queryForm.createTime[1] : "",
        pageNum: pageNum ? pageNum : 1,
        pageSize: 10,
        systemType: this.queryForm.systemType,
        versionName: this.queryForm.versionName,
      };
      this.tableData = [];
      this.total = 0;
      versionServeice.GET_VERSION_LIST(params).then((e) => {
        this.tableData = e.rows;
        this.total = e.total;
      });
    },
    addVersion() {
      this.$refs.form.validate((e) => {
        if (e) {
          if ("id" in this.form) {
            //修改
            versionServeice.EDIT_VERSION(this.form).then((e) => {
              if (e.code == 200) {
                this.$message.success("添加成功");
                this.versionModal = false;
                this.getVersionlist();
              }
            });
          } else {
            versionServeice.ADD_VERSION(this.form).then((e) => {
              if (e.code == 200) {
                this.$message.success("添加成功");
                this.versionModal = false;
                this.getVersionlist();
              }
            });
          }
        }
      });
    },
    cancelModal() {
      this.resetForm("form");
      if (this.fileCancel) {
        this.fileCancel();
      }
      this.versionModal = false;
    },
  },
  data() {
    return {
      percentage: 0,
      percenFlag: false,
      versionModal: false,
      pageNum: 1,
      pageSize: 10,
      total: "",
      tableData: [],
      fileCancel: "",
      rules: {
        versionCode: [
          {
            required: true,
            message: "请输入版本号",
            trigger: "blur",
          },
        ],
        versionName: [
          {
            required: true,
            message: "请输入版本名称",
            trigger: "blur",
          },
        ],
        versionInfo: [
          {
            required: true,
            message: "请输入版本信息",
            trigger: "blur",
          },
        ],
        appSize: [
          {
            required: true,
            message: "请输入版本大小",
            trigger: "blur",
          },
        ],
        systemType: [
          {
            required: true,
            message: "请选择系统类型",
            trigger: "blur",
          },
        ],
        isForceUpdate: [
          {
            required: true,
            message: "请选择更新模式",
            trigger: "blur",
          },
        ],
      },
      form: {
        versionCode: "",
        versionName: "",
        versionInfo: "",
        appSize: "",
        systemType: "02",
        downloadLink: "",
        isForceUpdate: "0",
      },
      queryForm: {
        systemType: "02",
        versionName: "",
        createTime: "",
      },
    };
  },
};
</script>

<style lang="scss" scoped>
.version {
  padding: 25px 27px 0 25px;
}
.avatar-uploader {
  width: 100px;
  height: 50px;
  line-height: 0;
  text-align: left;
  border: none;
  background-color: transparent;
}
::v-deep .el-progress {
  width: 80%;
}
::v-deep .el-progress__text {
  color: white;
  font-size: 12px !important;
}
</style>
