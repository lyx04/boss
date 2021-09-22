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
        <el-form-item label="字典类型：" prop="dictType">
          <el-input
            v-model="ruleForm.dictType"
            placeholder="请输入字典类型"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="数据标签：" prop="dictLabel">
          <el-input
            v-model="ruleForm.dictLabel"
            placeholder="请输入数据标签"
          ></el-input>
        </el-form-item>
        <el-form-item label="数据键值：" prop="dictValue">
          <el-input
            v-model="ruleForm.dictValue"
            placeholder="请输入数据键值"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示排序：" prop="dictSort">
          <el-input-number
            v-model="ruleForm.dictSort"
            controls-position="right"
            :min="1"
            :max="1000"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio label="0">正常</el-radio>
            <!--<el-radio label="1">停用</el-radio>-->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
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
import { ADD_EDITOR_DICT_DATA_TYPE } from "@/common/api/system/dictionary";
export default {
  // name: "AddEditorDictDataModal",
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
  watch: {
    dialogVisibleDict() {
      this.reset();
    },
  },
  data() {
    return {
      ruleForm: {
        dictType: this.decode(this.$route.params.dictType), // 字典类型
        dictLabel: "", // 数据标签
        dictValue: "", // 数据键值
        remark: "", // 备注
        status: "0", // 状态
        dictSort: 1,
      },
      rules: {
        dictLabel: [
          { required: true, message: "请输入字典名称", trigger: "blur" },
        ],
        dictValue: [
          { required: true, message: "请输入字典类型", trigger: "blur" },
        ],
        dictSort: [
          { required: true, message: "请输入显示排序", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 重置
    reset() {
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
          if (this.title === "修改字典数据") {
            ADD_EDITOR_DICT_DATA_TYPE("put", this.ruleForm).then(() => {
              this.dialogVisibleDictClosed();
              this.$emit("submit-modal");
              this.$message({
                message: "修改字典数据成功",
                type: "success",
              });
            });
          } else {
            ADD_EDITOR_DICT_DATA_TYPE("post", this.ruleForm).then(() => {
              this.dialogVisibleDictClosed();
              this.$emit("submit-modal");
              this.$message({
                message: "新增字典数据成功",
                type: "success",
              });
            });
          }
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    if (this.title == "修改字典数据") {
      this.ruleForm = {
        dictType: this.decode(this.$route.params.dictType), // 字典类型
        dictLabel: this.row.dictLabel,
        dictValue: this.row.dictValue,
        remark: this.row.remark, // 备注
        dictSort: this.row.dictSort || 1,
        status: this.row.status || "0", // 状态
        dictCode: this.row.dictCode,
      };
    }
  },
};
</script>

<style scoped lang="scss"></style>
