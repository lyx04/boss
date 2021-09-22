<template>
  <div class="supportModal">
    <modal customClass="Miniform" :visible="active" @on-closed="close">
      <template slot="head">
        <span>批量修改技术支持</span>
      </template>
      <template slot="body">
        <el-form :rules="rules" :model="form" ref="form" label-width="120px">
          <el-form-item label="技术支持:" prop="technicalSupportId">
            <el-select filterable v-model="form.technicalSupportId">
              <el-option
                v-for="item in dataList"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确认</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import { GET_CLIENT_ORGID_USER_LIST } from "@/common/api/system/user";
import { UPDATE_TECHNICAL_SUPPORT } from "@/common/api/customerCore/customer";
export default {
  props: {
    active: Boolean,
    data: Array,
  },
  data() {
    return {
      rules: {
        technicalSupportId: [
          { required: true, message: "请选择技术支持", trigger: "blur" },
        ],
      },
      form: {
        technicalSupportId: "",
      },
      dataList: [],
    };
  },
  components: {
    modal,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      GET_CLIENT_ORGID_USER_LIST(this.data[0].parentId).then((e) => {
        this.dataList = e.data;
      });
    },
    close() {
      this.$emit("update:active", false);
    },
    submit() {
      this.$refs.form.validate((e) => {
        if (e) {
          var orgIds = [];
          this.data.forEach((i) => {
            orgIds.push(i.orgid);
          });
          UPDATE_TECHNICAL_SUPPORT(
            this.data[0].parentId,
            this.form.technicalSupportId,
            orgIds
          ).then(() => {
            this.$emit("refresh");
            this.close();
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
