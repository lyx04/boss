<template>
  <div class="configtemp">
    <el-form label-position="left" size="mini" :model="selectform" inline>
      <el-form-item label="消息分类:">
        <el-select @change="typechange" v-model.trim="selectform.messageType">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in data.typeAll"
            :value="item.id"
            :label="item.name"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型:">
        <el-select v-model.trim="selectform.id">
          <el-option value="" label="全部"></el-option>
          <el-option
            v-for="item in data.tempAll"
            :value="item.id"
            :label="item.name"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model.trim="selectform.status">
          <el-option value="" label="全部"></el-option>
          <el-option value="0" label="启用"></el-option>
          <el-option value="1" label="未启用"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="init()">查询</el-button>
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="initModal"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="messageTypeName"
        align="center"
        :show-overflow-tooltip="true"
        label="消息分类"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
        label="业务类型"
      >
      </el-table-column>
      <el-table-column
        prop="isPushApp"
        align="center"
        :show-overflow-tooltip="true"
        label="推送选项"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.isPushApp == 1">极光推送</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        align="center"
        :show-overflow-tooltip="true"
        label="状态"
      >
        <template slot-scope="scope">
          <template v-if="scope.row.status == 1">禁用</template>
          <template v-else>启用</template>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        align="center"
        :show-overflow-tooltip="true"
        label="最后修改时间"
      >
        <template slot-scope="scope">
          {{
            scope.row.updateTime
              ? scope.row.updateTime.slice(0, 10)
              : scope.row.createTime.slice(0, 10)
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="editrow(scope.row.id)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.isInitialize == 0"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="deleterow(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pageSize="page.pageSize"
      :total="page.total"
      :currentPage1.sync="page.pageNum"
      @handleCurrent="pageChange"
      @size-change="listSizeChange"
    ></pagination>
    <modal
      customClass="Miniform"
      :visible.sync="modal.show"
      @on-closed="modal.show = false"
    >
      <template slot="head">
        <span>{{ form.id ? "修改" : "新增" }}消息模板</span>
      </template>
      <template slot="body">
        <el-form
          size="mini"
          :rules="rules"
          :model="form"
          ref="form"
          label-width="120px"
        >
          <el-form-item label="消息分类:" prop="messageType">
            <el-select v-model.trim="form.messageType">
              <el-option
                v-for="item in data.typeAll"
                :value="item.id"
                :label="item.name"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务类型:" prop="name">
            <el-input v-model.trim="form.name" maxlength="8"> </el-input>
          </el-form-item>
          <el-form-item label="推送选项:">
            <el-checkbox
              v-model.trim="form.isPushApp"
              true-label="1"
              false-label="0"
              >极光推送</el-checkbox
            >
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <el-select v-model.trim="form.status">
              <el-option value="0" label="启用"></el-option>
              <el-option value="1" label="禁用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="模板:" prop="template">
            <el-input
              type="textarea"
              maxlength="500"
              v-model.trim="form.template"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="modal.show = false">取消</el-button>
        <el-button type="primary" @click="formSub">确定</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import * as messageService from "@/common/api/config/message";
import pagination from "@/common/components/Pagination";
import modal from "@/common/components/Modal";
export default {
  components: { pagination, modal },
  mounted() {
    this.init();
    this.initData();
  },
  data() {
    var checkname = (rule, value, callback) => {
      var val = value.trim();
      if (val) {
        callback();
      } else {
        callback(new Error("请输入业务类型"));
      }
    };
    return {
      tableData: [],
      page: {
        pageSize: 10,
        pageNum: 1,
        total: 0,
      },
      rules: {
        messageType: [
          { required: true, message: "请选择消息分类", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择消息状态", trigger: "blur" },
        ],
        name: [{ validator: checkname, trigger: "blur", required: true }],
      },
      data: {
        typeAll: [],
        tempAll: [],
      },
      selectform: {
        messageType: "",
        id: "",
        status: "",
      },
      form: {
        messageType: "",
        name: "",
        status: "",
        isPushApp: "",
        template: "",
        id: "",
      },
      modal: {
        show: false,
      },
    };
  },
  methods: {
    listSizeChange(e) {
      this.page.pageSize = e;
      this.init();
    },
    //消息分类的筛选
    typechange() {
      this.selectform.id = "";
      messageService
        .GET_TEMPLATE_ALl({ messageType: this.selectform.messageType })
        .then((e) => {
          this.data.tempAll = e.data;
        });
    },
    //初始化消息数据
    initData() {
      messageService.GET_TYPE_ALl().then((e) => {
        this.data.typeAll = e.data;
      });
    },
    init(pageNum = 1) {
      this.page.pageNum = pageNum;
      var obj = Object.assign(this.page, this.selectform);
      console.log(obj);
      messageService.GET_TEMPLATE_TYPE(obj).then((e) => {
        this.tableData = e.rows;
        this.page.total = e.total;
      });
    },
    pageChange(e) {
      this.init(e);
    },
    initModal() {
      this.modal.show = true;
      this.form.messageType = "";
      this.form.name = "";
      this.form.status = "0";
      this.form.id = "";
      this.form.isPushApp = "";
      this.form.template = "";
    },
    editrow(id) {
      this.initModal();
      messageService.GET_TEMPLATE_TYPE_INFO(id).then((e) => {
        this.form.messageType = e.data.messageType;
        this.form.name = e.data.name;
        this.form.status = e.data.status;
        this.form.id = e.data.id;
        this.form.isPushApp = e.data.isPushApp;
        this.form.template = e.data.template;
      });
    },
    deleterow(id) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "删除将无法发送该类消息!",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          messageService.DELETE_TEMPLATE_TYPE(id).then((e) => {
            if (e.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
              this.init();
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    formSub() {
      this.$refs.form.validate((e) => {
        if (e) {
          if (this.form.id) {
            messageService.UPDATE_TEMPLATE_TYPE(this.form).then((e) => {
              if (e.code == 200) {
                this.$message.success("修改成功");
                this.init();
                this.modal.show = false;
              }
            });
          } else {
            messageService.ADD_TEMPLATE_TYPE(this.form).then((e) => {
              if (e.code == 200) {
                this.$message.success("新增成功");
                this.init();
                this.modal.show = false;
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.configtemp {
  margin-top: 10px;
  ::v-deep .el-form {
    .el-form-item {
      .el-form-item__label {
        padding-left: 0;
      }
    }
  }
}
</style>
