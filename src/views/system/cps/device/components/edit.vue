// 设备的修改
<template>
  <modal customClass="Miniform" :visible="visible" @on-closed="closed">
    <template slot="head"> 修改设备 </template>
    <template slot="body">
      <el-form size="mini" :model="form" label-width="120px">
        <el-form-item label="设备编码:">
          <el-input v-model="form.cpsCode"></el-input>
        </el-form-item>
        <el-form-item label="设备类型编码:">
          <el-input v-model="form.devType"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="closed">取消</el-button>
      <el-button type="primary" @click="subinfo">确认</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";
import { UPDATE_DEV_INFO } from "@/common/api/system/cps";
export default {
  components: {
    modal,
  },
  props: {
    visible: Boolean,
    row: Object,
  },
  data() {
    return {
      form: {
        //设备编码
        // 设备类型编码
        cpsCode: this.row.cpsCode,
        devType: this.row.devType,
        id: this.row.id,
      },
    };
  },
  methods: {
    closed() {
      this.$emit("update:visible", false);
    },
    subinfo() {
      UPDATE_DEV_INFO(this.form).then((e) => {
        if (e.code == 200) {
          this.$message.success("修改成功");
          this.closed();
          this.$parent.inittabData(1);
        }
      });
    },
  },
};
</script>

<style></style>
