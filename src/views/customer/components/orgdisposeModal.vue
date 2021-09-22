// 查看与修改企业电费配置
<template>
  <div class="orgdisposeModal">
    <common-modal customClass="Maxform" :visible="show" @on-closed="close">
      <template slot="head">
        <span>修改电费配置</span>
      </template>
      <template slot="body">
        <el-form
          label-width="69px"
          :model="orgInfo"
          :rules="rules"
          :inline="true"
          size="mini"
          ref="ruleForm"
        >
          <el-form-item label="用电单位:">
            <span class="font">{{ orgInfo.orgName }}</span>
          </el-form-item>
          <el-form-item label="用电类型:" prop="electricityType">
            <el-select
              multiple
              v-if="showFlag"
              v-model="orgInfo.electricityType"
              @change="electricityTypeChange"
            >
              <el-option
                v-for="item in dict.electricity_type"
                :key="item.dictValue"
                :value="item.dictValue"
                :label="item.dictLabel"
              >
              </el-option>
            </el-select>
            <template v-else>
              <span class="font">
                {{
                  dictArrFilter("electricity_type", orgInfo.electricityType)
                }}</span
              >
            </template>
          </el-form-item>
          <el-form-item label="抄表日:">
            <span class="font">{{ orgInfo.readingTime }}</span>
          </el-form-item>
          <el-form-item
            class="morefont"
            label="基本电费计价方式:"
            prop="basicElectricitPricingMode"
          >
            <el-select
              v-if="showFlag"
              v-model="orgInfo.basicElectricitPricingMode"
            >
              <el-option
                v-for="item in basicmode"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              >
              </el-option>
            </el-select>
            <template v-else>
              <span class="font">
                {{
                  dictStrFilter(
                    "basic_electricit_pricing_mode",
                    orgInfo.basicElectricitPricingMode
                  )
                }}</span
              >
            </template>
          </el-form-item>
          <el-form-item label="电价模板:" prop="electrovaleneTemplateCode">
            <el-select
              v-if="showFlag"
              @change="templateCodeChange"
              v-model="orgInfo.electrovaleneTemplateCode"
            >
              <el-option
                v-for="item in templateList"
                :key="item.tempCode"
                :label="item.tempName"
                :value="item.tempCode"
              >
                <span style="float: left; margin-right: 5px">{{
                  item.tempName
                }}</span>
                <span style="float: right; font-size: 13px">{{
                  item.tempTypeName
                }}</span></el-option
              >
            </el-select>
            <template v-else>
              <span class="font"> {{ orgInfo.templateCodeName }}</span>
            </template>
          </el-form-item>
          <el-form-item label="生效日期:" prop="effectiveDate">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-if="showFlag"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              v-model="orgInfo.effectiveDate"
            >
            </el-date-picker>
            <template v-else>
              <span class="font">{{ orgInfo.effectiveDate }}</span>
            </template>
          </el-form-item>
          <div class="body_item" v-if="orgInfo.electrovaleneTemplateCode">
            <p class="item_title">
              <span>基本电价</span>
            </p>
            <ul class="item_content">
              <li>
                按实际需量：{{ orgInfo.electrovalenceDemand }}元/kW（每月）
              </li>
              <li>
                按运行容量：{{ orgInfo.electrovalenceCapacity }}元/kW（每月）
              </li>
            </ul>
          </div>
          <div class="body_item" v-if="orgInfo.electrovaleneTemplateCode">
            <p class="item_title">
              <span>力调电价</span>
            </p>
            <ul class="item_content">
              <li>功率因数标准：{{ orgInfo.ecElectrovalenceForceType }}</li>
            </ul>
          </div>
          <template v-if="orgInfo.electrovaleneTemplateCode">
            <div
              class="body_item"
              v-for="(item, index) in orgInfo.electrovalenceTempDegrees"
              :key="index"
            >
              <p class="item_title">
                <span>电度电价</span>
              </p>
              <ul class="item_content">
                <li>
                  电度电价类型：{{
                    dictStrFilter(
                      "electrical_degree_purchase_way",
                      item.electrovalenceDegreeType
                    )
                  }}
                </li>
                <li>
                  用电类型：{{
                    dictStrFilter("electricity_type", item.electricityType)
                  }}
                </li>
                <li>是否分时：{{ item.isTimeShare == 0 ? "否" : "是" }}</li>
                <li>含代收基金：{{ item.priceFund }} 元/kWh</li>
              </ul>
              <el-form-item
                :rules="{
                  required: true,
                  message: '请选择对应间隔',
                  trigger: 'blur',
                }"
                :prop="'electrovalenceTempDegrees.' + index + '.caculator'"
              >
                <el-button
                  type="primary"
                  v-if="showFlag"
                  plain
                  @click="selectInterval(item)"
                  >选择对应间隔</el-button
                >
                <el-button type="primary" :disabled="!showFlag" v-else plain
                  >选择的对应间隔</el-button
                >
                <span class="font">{{ renderInterval(item.caculator) }}</span>
              </el-form-item>
              <div class="electric_select">
                <ul class="select_left">
                  <li class="active">
                    <p>年度</p>
                    <i class="icon-dayuhao"></i>
                  </li>
                </ul>
                <div class="select_right">
                  <template v-if="item.isTimeShare == 1">
                    <p>分时电价:</p>
                    <ul>
                      <li v-for="(dictitem, index) in item.sub" :key="index">
                        <span class="font">{{
                          dictStrFilter("sp_work_type", dictitem.spWorkType)
                        }}</span>

                        <span class="font"
                          >{{ dictitem.workTypePrice }}元/kWh</span
                        >
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <p>单一电价:</p>
                    <div class="only">
                      <span class="dictvalue">{{ item.priceProtocol }}</span>
                      <span class="font">元/kWh</span>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </template>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </common-modal>
    <interval-modal
      @intervalSub="interSub"
      v-if="interval.active"
      :orgid="orgInfo.orgId"
      :caculatorList="intervalRow.caculator"
      :show.sync="interval.active"
    ></interval-modal>
  </div>
</template>
<script>
import commonModal from "@/common/components/Modal";
import intervalModal from "./intervalcaculator";

import {
  GET_ELEPRICES_DETAILS,
  UPDATE_ELEPRICES,
  QUERY_TEMP_BY_ORG,
  QUERY_BY_TEMPCODE,
} from "@/common/api/customerCore/customer";
import { mapState } from "vuex";
export default {
  components: { commonModal, intervalModal },
  computed: {
    ...mapState(["dict"]),
    showFlag() {
      return true;
    },
    basicShow() {
      if (this.orgInfo.electricityType) {
        return !(
          this.orgInfo.electricityType[0] == 2 &&
          this.orgInfo.electricityType.length == 1
        );
      }
      return "";
    },
    basicmode() {
      var item;
      if ("basic_electricit_pricing_mode" in this.dict) {
        if (this.basicShow) {
          item = this.dict.basic_electricit_pricing_mode.filter((i) => {
            return i.dictLabel != "单一制";
          });
        } else {
          item = this.dict.basic_electricit_pricing_mode.filter((i) => {
            return i.dictLabel == "单一制";
          });
        }
      }

      return item;
    },
  },
  props: {
    show: Boolean,
    option: Object,
  },
  mounted() {
    this.init();
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 86400000;
        },
      },
      interval: {
        active: false,
      },
      orgInfo: {
        electricityType: "",
        basicElectricitPricingMode: "",
        electrovaleneTemplateCode: "",
        effectiveDate: "",
      },
      //当前点击对应间隔的这一条数据
      intervalRow: {},
      //电价模板的列表
      templateList: [],
      rules: {
        electricityType: [
          { required: true, message: "请选择用电类型", trigger: "blur" },
        ],
        basicElectricitPricingMode: [
          { required: true, message: "请选择计费方式", trigger: "blur" },
        ],
        electrovaleneTemplateCode: [
          { required: true, message: "请选择电价模板", trigger: "blur" },
        ],
        effectiveDate: [
          { required: true, message: "请选择生效时间", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    interSub(e) {
      var res = JSON.stringify(e);
      this.intervalRow.caculator = res;
    },
    init() {
      // 不管是修改还是查看都需要查询信息,id为null相当于企业没有配置过
      GET_ELEPRICES_DETAILS(this.option).then((e) => {
        if (e.data.electricityType) {
          e.data.electricityType = e.data.electricityType.split(",");
          var params = {
            electricityType: e.data.electricityType.sort().join(","),
          };
          QUERY_TEMP_BY_ORG(params).then((e) => {
            this.templateList = e.data;
          });
        }
        this.orgInfo = e.data;
      });
    },
    //通过电价类型获取电价模板
    electricityTypeChange(e) {
      var params = {
        electricityType: e.sort().join(","),
      };
      QUERY_TEMP_BY_ORG(params).then((e) => {
        this.orgInfo.electrovaleneTemplateCode = "";
        this.templateList = e.data;
      });
    },
    //电价模板的选择
    templateCodeChange(e) {
      QUERY_BY_TEMPCODE(e).then((res) => {
        this.orgInfo["electrovalenceTempDegrees"] =
          res.data["electrovalenceTempDegrees"];
        this.orgInfo.electrovalenceCapacity = res.data.electrovalenceCapacity;
        this.orgInfo.electrovalenceDemand = res.data.electrovalenceDemand;
        this.orgInfo.ecElectrovalenceForceType =
          res.data.ecElectrovalenceForceType;
      });
    },
    //保存
    save() {
      if (this.orgInfo.effectiveDate) {
        var resdate = new Date(this.orgInfo.effectiveDate);
        if (resdate.getTime() < Date.now() - 86400000) {
          this.orgInfo.effectiveDate = "";
          this.$message.error("生效日期要设置在当天或以后");
        }
      }

      this.$refs.ruleForm.validate((e) => {
        if (e) {
          var arr = [];
          this.orgInfo.electrovalenceTempDegrees.forEach((i) => {
            var obj = {
              electricityType: i.electricityType,
              caculator: i.caculator,
            };
            arr.push(obj);
          });
          var params = {
            electricityType: this.orgInfo.electricityType.sort().join(","),
            basicElectricitPricingMode: this.orgInfo.basicElectricitPricingMode,
            effectiveDate: this.orgInfo.effectiveDate,
            electrovaleneTemplateCode: this.orgInfo.electrovaleneTemplateCode,
            caculators: arr,
            orgId: this.orgInfo.orgId,
            confirm: 1,
          };
          UPDATE_ELEPRICES(params)
            .then((e) => {
              if (e.code == 200) {
                this.$emit("refresh");
                this.close();
              }
            })
            .catch((e) => {
              if (
                e.response.data.code == 7003 &&
                e.response.data.message == "总进线间隔"
              ) {
                this.$msgbox({
                  title: "",
                  customClass: "iconmes",
                  message:
                    "部分总进线间隔未选中，则不会计入电费，是否继续提交？",
                  showCancelButton: true,
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                  type: "error",
                  iconClass: "iconfont icon-gaojing1",
                  closeOnClickModal: false,
                  closeOnPressEscape: false,
                })
                  .then(() => {
                    params["confirm"] = 0;
                    UPDATE_ELEPRICES(params).then((e) => {
                      if (e.code == 200) {
                        this.$emit("refresh");
                        this.close();
                      }
                    });
                  })
                  .catch(() => {});
              }
            });
        }
      });
    },
    //只有一个字符，字段过滤
    dictStrFilter(dict, value) {
      if (value == null || value == "") return "--";
      var returnStr = "";
      var row = this.dict[dict].filter((i) => {
        return i.dictValue == value;
      });
      returnStr = row[0].dictLabel;
      return returnStr;
    },
    //多字符，字段过滤
    dictArrFilter(dict, value) {
      if (value == "" || value == null) return "--";
      var returnStr = "";
      value.forEach((commai) => {
        var row = this.dict[dict].filter((i) => {
          return i.dictValue == commai;
        });
        returnStr = returnStr.length
          ? returnStr + "," + row[0].dictLabel
          : row[0].dictLabel;
      });
      return returnStr;
    },
    //格式化对应间隔
    renderInterval(val) {
      if (!val) return "";
      var returnstr = "";
      JSON.parse(val).forEach((i) => {
        returnstr += i.symbol + i.intervalName;
      });
      return returnstr;
    },
    //选择对应间隔
    selectInterval(item) {
      this.interval.active = true;
      this.intervalRow = item;
    },
    close() {
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.el-dialog__wrapper {
  ::v-deep .el-dialog__body {
    padding-top: 10px;
    padding-left: 20px;
    .el-form {
      .el-form-item {
        width: 50%;
        margin-right: 0;
        margin-bottom: 20px;
        &:nth-type-child(even) {
          text-align: right;
        }
        .el-form-item__content {
          .font {
            display: inline-block;
            line-height: 30px;
          }
          .el-select__tags-text {
            color: #909399;
          }
        }
        .el-form-item__label {
          padding-left: 0;
          line-height: 30px;
          text-align: left;
          padding-right: 0;
        }
        &.morefont {
          .el-form-item__label {
            line-height: 1;
            margin-top: 3px;
          }
        }
      }
    }
    .body_item {
      .el-form-item {
        margin-bottom: 0;
        padding-left: 30px !important;
        .el-form-item__content {
          .el-button.is-disabled {
            span {
              color: #c0c4cc;
            }
          }
        }
      }
      p {
        padding-right: 25px;
        span {
          width: 100%;
          display: inline-block;
          font-size: 12px;
          // color: #0ceaf3;
          border-bottom: 1px solid #e6e6e6;
          line-height: 22px;

          font-weight: bold;
        }
      }
      .item_content {
        font-size: 0;
        li {
          display: inline-block;
          line-height: 40px;
          width: 50%;
          // ;
          font-size: 12px;
          &:nth-of-type(odd) {
            padding-left: 30px;
          }
        }
      }
      .el-button {
        margin-left: 0 !important;
      }
      .font {
        // ;
        margin-left: 10px;
      }
      .electric_select {
        width: 100%;
        margin-top: 20px;
        height: auto;
        padding-left: 30px;
        font-size: 0;
        .select_left {
          width: 73px;
          height: 100%;
          display: inline-block;
          margin-right: 7px;
          vertical-align: top;
          background-color: #409eff;
          // background-color: rgba(255, 255, 255, 0.1);
          li {
            width: 100%;
            height: 38px;
            border-left: 1px solid transparent;
            padding-left: 15px;
            padding-right: 10px;
            line-height: 38px;
            p {
              font-size: 10px;
              display: inline-block;
              padding: 0;
            }
            i {
              font-size: 7px;
              float: right;
              font-family: iconfont;
            }
            &.active {
              color: white;
              // border-color: #0ceaf3;
              // background-color: rgba(26, 66, 98, 0.3);
            }
          }
        }
        .select_right {
          display: inline-block;
          width: 578px;
          height: 100%;
          padding: 10px 0 20px 17px;
          background-color: #fafafa;
          p {
            font-size: 10px;
            margin-bottom: 15px;
          }
          .only {
            padding-left: 60px;
            .dictvalue {
              display: inline-block;
              width: 146px;
              height: 30px;
              padding-left: 20px;
              font-size: 10px;
              line-height: 30px;
              margin-left: 10px;
              border: 1px solid rgba(26, 66, 98, 1);
            }
          }
          ul {
            li {
              margin-bottom: 20px;
              padding-left: 45px;
              .dictvalue {
                display: inline-block;
                width: 146px;
                height: 30px;
                padding-left: 20px;
                font-size: 10px;
                line-height: 30px;
                margin-left: 10px;
                background: rgba(26, 66, 98, 0.3);
              }
            }
          }
          .font {
            margin-left: 20px;
            font-size: 10px;
          }
        }
      }
    }
  }
}
</style>
