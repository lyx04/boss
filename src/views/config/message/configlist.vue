<template>
  <div class="configlist">
    <el-button
      type="primary"
      @click="initModal"
      plain
      icon="el-icon-plus"
      size="mini"
      >新增</el-button
    >
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column
        prop="name"
        align="center"
        :show-overflow-tooltip="true"
        label="消息分类"
      >
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
          <template v-if="scope.row.isInitialize == 0">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="editrow(scope.row.id)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleterow(scope.row.id)"
              >删除</el-button
            >
          </template>
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
        <span>{{ form.id ? "修改" : "新增" }}消息分类</span>
      </template>
      <template slot="body">
        <el-form
          size="mini"
          :rules="rules"
          :model="form"
          ref="form"
          label-width="120px"
        >
          <el-form-item label="消息分类:" prop="name">
            <el-input type="text" maxlength="8" v-model.trim="form.name">
            </el-input>
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
  },
  data() {
    var checkname = (rule, value, callback) => {
      var val = value.trim();
      if (val) {
        callback();
      } else {
        callback(new Error("请输入消息分类"));
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
        name: [{ validator: checkname, trigger: "blur", required: true }],
      },
      form: {
        id: "",
        name: "",
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
    init(pageNum = 1) {
      this.page.pageNum = pageNum;
      messageService.GET_MESSAGE_TYPE(this.page).then((e) => {
        this.tableData = e.rows;
        this.page.total = e.total;
      });
    },
    pageChange(e) {
      this.init(e);
    },
    initModal() {
      this.modal.show = true;
      this.form.id = "";
      this.form.name = "";
    },
    editrow(id) {
      this.initModal();
      messageService.GET_MESSAGE_TYPE_INFO(id).then((e) => {
        this.form.id = e.data.id;
        this.form.name = e.data.name;
      });
    },
    deleterow(id) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "将删除当前消息分类!",
        showCancelButton: true,
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          messageService.DELETE_MESSAGE_TYPE(id).then((e) => {
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
            messageService.UPDATE_MESSAGE_TYPE(this.form).then((e) => {
              if (e.code == 200) {
                this.$message.success("修改成功");
                this.init();
                this.modal.show = false;
              }
            });
          } else {
            var params = {
              name: this.form.name,
            };
            messageService.ADD_MESSAGE_TYPE(params).then((e) => {
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
.configlist {
  margin-top: 10px;
}
</style>
