<template>
  <div>
    <modal
      :visible="dialogVisiblecpsorg"
      customClass="customer-modal Miniform"
      @on-closed="dialogVisiblecpsorgClosed"
    >
      <template slot="head">
        <span>修改企业编码</span>
      </template>
      <template slot="body">
        <el-form
          size="mini"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="120px"
          class="cusomer-ruleForm"
        >
          <el-form-item label="企业名称：" prop="name">
            <el-input
              v-model="ruleForm.name"
              placeholder="请输入企业名称"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="企业编码：" prop="cpsCode">
            <el-input
              v-model="ruleForm.cpsCode"
              placeholder="请输入企业编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="地区编码：" prop="areaNo">
            <el-input
              v-model="ruleForm.areaNo"
              placeholder="请输入地区编码"
            ></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisiblecpsorgClosed">取消</el-button>
        <el-button type="primary" @click="orgClosedEditSubmit">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import { PUT_CPS_IEMC_ORG } from "@/common/api/system/cps.js";
import qs from "querystring";

export default {
  name: "EditCpsorgModal",
  props: {
    dialogVisiblecpsorg: {
      type: Boolean,
    },
    cpsorgIndex: {
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
        cpsCode: [
          { required: true, message: "请输入企业编码", trigger: "blur" },
        ],
        areaNo: [
          { required: true, message: "请输入地区编码", trigger: "blur" },
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
        cpsCode: undefined,
        areaNo: undefined,
      };
      this.resetForm("ruleForm");
    },
    //  关闭弹框
    dialogVisiblecpsorgClosed() {
      this.$emit("dialogVisiblecpsorgClosed");
      this.reset();
    },
    orgClosedEditSubmit() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          delete this.ruleForm.createTime;
          PUT_CPS_IEMC_ORG(qs.stringify(this.ruleForm)).then(() => {
            this.$message({
              message: "修改提交成功",
              type: "success",
            });
            this.$emit("orgClosedEditSubmit");
            this.dialogVisiblecpsorgClosed();
          });
        }
      });
    },
  },
  created() {
    this.ruleForm = this.cpsorgIndex;
  },
};
</script>

<style scoped></style>
