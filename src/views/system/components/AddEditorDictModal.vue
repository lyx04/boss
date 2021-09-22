<template>
  <modal
    :visible="dialogVisibleDict"
    customClass="customer-modal Miniform"
    @on-closed="dialogVisibleDictClosed"
  >
    <template slot="head">
      <span>{{ title }}</span>
    </template>
    <template slot="body">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="cusomer-ruleForm"
        size="small"
      >
        <el-form-item label="字典名称：" prop="dictName">
          <el-input
            v-model="ruleForm.dictName"
            placeholder="请输入字典名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典类型：" prop="dictType">
          <el-input
            v-model="ruleForm.dictType"
            placeholder="请输入字典类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="字典状态：">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">正常</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="dialogVisibleDictClosed">取消</el-button>
      <el-button type="primary" @click="submit('ruleForm')">确定</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";
import { ADD_DICT_TYPE } from "@/common/api/system/dictionary";
export default {
  name: "AddEditorDictModal",
  props: {
    dialogVisibleDict: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "添加字典类型",
    },
    row: {
      type: Object,
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      ruleForm: {
        dictName: "", // 字典名称
        dictType: "", // 字典类型
        remark: "", // 备注
        status: "0", // 状态
        dictId: "",
      },
      rules: {
        dictName: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        dictType: [
          { required: true, message: "请输入字典类型", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 表单重置
    reset() {
      this.ruleForm = {
        dictName: "", // 字典名称
        dictType: "", // 字典类型
        remark: "", // 备注
        status: "0", // 状态
        dictId: "",
      };
      this.resetForm("ruleForm");
    },
    // 关闭弹框
    dialogVisibleDictClosed() {
      this.$emit("on-closed");
      this.reset();
    },
    //  表单提交
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.title === "修改字典类型") {
            ADD_DICT_TYPE("put", this.ruleForm).then(() => {
              this.dialogVisibleDictClosed();
              this.$emit("submit-modal");
              this.$message({
                message: "修改字典类型成功",
                type: "success",
              });
            });
          } else {
            ADD_DICT_TYPE("post", this.ruleForm).then(() => {
              this.dialogVisibleDictClosed();
              this.$emit("submit-modal");
              this.$message({
                message: "新增字典类型成功",
                type: "success",
              });
            });
          }
          this.reset();
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    if (this.title == "修改字典类型") {
      this.ruleForm = {
        dictName: this.row.dictName, // 字典名称
        dictType: this.row.dictType, // 字典类型
        remark: this.row.remark, // 备注
        status: this.row.status || "0", // 状态
        dictId: this.row.dictId,
      };
    }
  },
};
</script>

<style scoped lang="scss"></style>
