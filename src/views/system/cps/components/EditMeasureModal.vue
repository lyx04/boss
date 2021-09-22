<template>
  <div>
    <modal
      :visible="dialogVisibleEditMeasure"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisibleEditMeasureClosed"
    >
      <template slot="head">
        <span>修改量测量映射</span>
      </template>
      <template slot="body">
        <el-form
          size="mini"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="160px"
          class="cusomer-ruleForm"
        >
          <el-form-item label="量测量名称：" prop="name">
            <el-input
              v-model.trim="ruleForm.name"
              placeholder="请输入量测量名称"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="标签：" prop="label">
            <el-input
              v-model.trim="ruleForm.label"
              placeholder="请输入标签"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="CPS量测量标识：" prop="cpsLabel">
            <el-input
              v-model.trim="ruleForm.cpsLabel"
              placeholder="请输入CPS量测量标识"
            ></el-input>
          </el-form-item>
          <el-form-item label="CPS量测量分类码：" prop="callType">
            <el-select
              v-model.trim="ruleForm.callType"
              placeholder="请输入CPS量测量分类码"
            >
              <el-option label="遥信" value="1"></el-option>
              <el-option label="SOE" value="2"></el-option>
              <el-option label="遥测" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleEditMeasureClosed">取消</el-button>
        <el-button type="primary" @click="measureEditSubmit">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import { PUT_CPS_IEMC_SIGHT } from "@/common/api/system/cps.js";
import qs from "querystring";

export default {
  name: "EditMeasureModal",
  props: {
    dialogVisibleEditMeasure: {
      type: Boolean,
    },
    measureIndex: {
      type: Object,
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      ruleForm: {},
      rules: {
        cpsLabel: [
          { required: true, message: "请输入CPS量测量标识", trigger: "blur" },
        ],
        callType: [
          {
            required: true,
            message: "请选择CPS量测量分类码",
            trigger: "change",
          },
        ],
      },
    };
  },
  methods: {
    // 表单重置
    reset() {
      this.ruleForm = {
        id: undefined,
        name: undefined,
        label: undefined,
        cpsLabel: undefined,
        callType: undefined,
      };
      this.resetForm("ruleForm");
    },
    //  关闭弹框
    dialogVisibleEditMeasureClosed() {
      this.$emit("dialogVisibleEditMeasureClosed");
      this.reset();
    },
    measureEditSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          PUT_CPS_IEMC_SIGHT(qs.stringify(this.ruleForm)).then(() => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.$emit("measureEditSubmit");
            this.dialogVisibleEditMeasureClosed();
          });
        }
      });
    },
  },
  created() {
    this.ruleForm = this.measureIndex;
  },
};
</script>

<style scoped></style>
