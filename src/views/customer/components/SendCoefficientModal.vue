<template>
  <div>
    <modal
      :visible="dialogVisibleCoefficient"
      customClass="new-editor-custom Miniform"
      @on-closed="dialogVisibleCoefficientClosed"
    >
      <template slot="head">
        <span>设置</span>
      </template>
      <template slot="body">
        <div style="margin: 30px 0">
          <span
            >当前聚合商上送数据系数为:<el-input
              v-model.trim="sendCoefficient"
              style="width: 100px; margin-left: 8px"
              @input="limitInput($event, 'sendCoefficient')"
              placeholder="请输入系数"
            ></el-input
          ></span>
        </div>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleCoefficientClosed">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import { UPDATE_COEFFICIENT } from "@/common/api/customerCore/customer";

export default {
  name: "SendCoefficientModal",
  props: {
    dialogVisibleCoefficient: {
      type: Boolean,
    },
    sendCoefficient: {
      type: Number,
    },
  },
  components: {
    modal,
  },
  computed: {
    isShown() {
      return this.dialogVisibleCoefficient;
    },
  },
  methods: {
    dialogVisibleCoefficientClosed() {
      this.$emit("dialogVisibleCoefficientClosed");
    },
    submit() {
      var data = {
        sendCoefficient: this.sendCoefficient,
      };
      UPDATE_COEFFICIENT(data).then(() => {
        this.$message({
          message: "修改系数成功",
          type: "success",
        });
        this.$emit("submitCoefficientClosed", this.sendCoefficient);
        this.dialogVisibleCoefficientClosed();
      });
    },
    limitInput(value, name) {
      let str = (value && value.split("")) || [];
      let val = (value && value.split("")) || [];
      let reg1 = /\d/;
      let reg2 = /\./;
      // 第一个字符不能为小数点
      if (val[0] == ".") {
        this.form[name] = "";
        return;
      }
      // 过滤掉除数字和小数点外的字符
      val = str.filter((e) => reg1.test(e) || reg2.test(e));
      // 匹配小数点后只能有两位小数
      // 解释一下这个match正则规格
      // ^\d* 是指以数字开头，后面允许输入0到多位数字
      // (\.?) 是指只允许一个小数点
      // \d{0,2} 是指只允许0到2位小数
      this[name] = val.join("").match(/^\d*(\.?\d{0,2})/g)[0] || null;
    },
  },
};
</script>

<style scoped></style>
