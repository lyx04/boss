<template>
  <div class="container main-content">
    <!--role筛选-->
    <div class="giving-screening">
      <el-form
        :model="request"
        ref="request"
        :rules="rules"
        label-width="200px"
        :inline="true"
        size="small"
      >
        <el-form-item label="当前聚合商上送数据系数为:" prop="sendCoefficient ">
          <el-input
            v-model.trim="request.sendCoefficient"
            style="width: 150px"
            @input="limitInput($event, 'sendCoefficient ')"
            placeholder="请输入"
            :disabled="!isupdate"
          ></el-input>
        </el-form-item>
        <el-form-item label="非调整系数户号:" prop="orgNos">
          <el-input
            v-model.trim="request.orgNos"
            style="width: 150px"
            @keyup="request.orgNos.replace(/，/g, ',')"
            placeholder="请输入"
            :disabled="!isupdate"
          ></el-input>
          <div style="font-size: 12px; color: #e6a23c">英文逗号分隔</div>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="mini"
            plain
            icon="el-icon-edit"
            @click="isupdate = true"
            v-if="!isupdate"
            >修改</el-button
          ><el-button
            type="primary"
            v-if="isupdate"
            size="mini"
            @click="saveUpdate()"
            >保存</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { GET_COEFFICIENT, UPDATE_COEFFICIENT } from "@/common/api/aggregators/index";

  export default {
  name: "giving",
  data() {
    return {
      request: {
        sendCoefficient: null,
        orgNos: "",
      },
      isupdate: false,
      rules: {
        sendCoefficient: [
          { required: true, message: "请输入", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    limitInput(value, name) {
      let str = (value && value.split("")) || [];
      let val = (value && value.split("")) || [];
      let reg1 = /\d/;
      let reg2 = /\./;
      // 第一个字符不能为小数点
      if (val[0] == ".") {
        this.request[name] = null;
        return;
      }
      // 过滤掉除数字和小数点外的字符
      val = str.filter((e) => reg1.test(e) || reg2.test(e));
      // 匹配小数点后只能有两位小数
      // 解释一下这个match正则规格
      // ^\d* 是指以数字开头，后面允许输入0到多位数字
      // (\.?) 是指只允许一个小数点
      // \d{0,2} 是指只允许0到2位小数
      this.request[name] = val.join("").match(/^\d*(\.?\d{0,2})/g)[0] || null;
    },
    // 查询系数
    initCoefficient() {
      GET_COEFFICIENT().then((e) => {
        this.request.sendCoefficient = e.data.coefficient;
        this.request.orgNos = e.data.exceptOrg;
      });
    },
    //  保存
    saveUpdate() {
      UPDATE_COEFFICIENT(this.request).then(() => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.isupdate = false;
      });
    },
  },
  mounted() {
    this.initCoefficient();
  },
};
</script>

<style scoped lang="scss"></style>
