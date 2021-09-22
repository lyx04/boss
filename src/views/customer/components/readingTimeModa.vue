<template>
  <!-- 设置抄表日 -->
  <modal customClass="Miniform" :visible="active" @on-closed="close">
    <template slot="head">
      <span>企业配置</span>
    </template>
    <template slot="body">
      <el-form
        ref="enterpriseform"
        size="mini"
        :rules="rules"
        label-position="left"
        :model="form"
      >
        <el-form-item label-width="145px" label="企业名称:">
          <span>{{ form.name }}</span>
        </el-form-item>
        <el-form-item
          class="morefont"
          label-width="145px"
          label="抄表日:"
          prop="readingTime"
        >
          每月
          <el-input-number
            :controls="false"
            :min="2"
            :max="28"
            v-model.number="form.readingTime"
            type="number"
          ></el-input-number>
          日 请输入2-28之间的数字
        </el-form-item>
        <el-form-item label-width="145px" prop="scheme" label="分时计量方案:">
          <el-select v-model="form.timeShareId">
            <el-option
              v-for="item in planList"
              :label="item.scheme"
              :value="item.id"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label-width="145px" prop="exeTime" label="生效时间:">
          <el-date-picker
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            v-model="form.exeTime"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
          <i
            style="margin-left: 5px"
            title="生效时间不可选择当月抄表日。若所改抄表日小于原抄表日，生效时间应该为下月。"
            class="el-icon-question"
          ></i>
        </el-form-item>
      </el-form>
    </template>
    <template slot="foot">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="saveEnterprise">保存</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";
import {
  GET_PLAN_LIST,
  GET_ORG_SHARE,
  UPDATE_COMPANY,
} from "@/common/api/customerCore/customer";

export default {
  components: { modal },
  props: {
    orgid: Number,
    active: Boolean,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime();
        },
      },
      form: {
        //企业配置的弹框
      },
      rules: {
        readingTime: [
          {
            required: true,
            message: "请输入抄表日",
            trigger: "blur",
          },
          {
            type: "number",
            message: "请输入正确的时间段",
            trigger: "blur",
            min: 1,
            max: 28,
          },
        ],
        scheme: [
          {
            required: true,
            message: "请选择分时计量方案",
            trigger: "blur",
          },
        ],
        exeTime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "blur",
          },
        ],
      },
      planList: [],
    };
  },
  mounted() {
    this.init();

    this.getplanlist();
  },
  methods: {
    init() {
      GET_ORG_SHARE(this.orgid).then((e) => {
        this.form = e.data;
      });
    },
    getplanlist() {
      GET_PLAN_LIST().then((e) => {
        this.planList = e.rows;
      });
    },
    close() {
      this.$emit("update:active", false);
    },
    //企业配置的提交
    saveEnterprise() {
      this.$refs.enterpriseform.validate((e) => {
        if (e) {
          this.form.startTime = this.form.exeTime + " 00:00:00";
          UPDATE_COMPANY(this.form).then((e) => {
            if (e.code == 200) {
              this.$message.success("修改成功");
              this.close();
              this.$emit("refresh");
            }
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__body {
  .checkedBoxs {
    padding: 0 40px;
    .el-checkbox {
      margin-right: 45px;
      margin-bottom: 5px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }

  .el-form-item {
    .el-form-item__label {
      padding-left: 20px;
    }
    &.morefont {
      .el-form-item__content {
        .el-input-number {
          width: 50px;
          input {
            padding: 0;
            padding-left: 5px;
          }
        }
      }
    }
  }
}
</style>
