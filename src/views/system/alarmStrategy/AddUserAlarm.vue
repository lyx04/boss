<template>
  <div>
    <modal
      :visible="dialogVisibleUserAlarm"
      customClass="user-alarm-modal Maxform"
      @on-closed="dialogVisibleUserAlarmClosed"
    >
      <template slot="head">
        <span>{{ title }}</span>
      </template>
      <template slot="body">
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="110px"
          class="cusomer-ruleForm"
          size="small"
        >
          <div class="user-alarm-title">基本信息</div>
          <el-form-item label="策略名称：" prop="ruleName">
            <el-input
              v-model.trim="ruleForm.ruleName"
              placeholder="请输入策略名称"
              style="width: 250px !important"
            ></el-input>
          </el-form-item>
          <el-form-item label="适用电压等级：" prop="volLevel">
            <el-select
              filterable
              v-model.trim="ruleForm.volLevel"
              placeholder="请选择适用电压等级"
              style="width: 250px !important"
            >
              <el-option
                v-for="item in volLevelList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="策略类型：" prop="ruleType">
            <el-select
              filterable
              v-model.trim="ruleForm.ruleType"
              placeholder="请选择策略类型"
              style="width: 250px"
            >
              <el-option
                v-for="item in ruleTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <div class="user-alarm-title">触发条件</div>
          <el-form-item label="量测量类型：" prop="meType">
            <el-select
              filterable
              v-model.trim="ruleForm.meType"
              placeholder="请选择量测量类型"
              style="width: 150px"
              @change="meTypeChange"
              :disabled="
                ruleForm.ruleGroupList[0].rules.length > 1 ||
                ruleForm.ruleGroupList.length > 1
              "
            >
              <el-option
                v-for="item in dict.measurement_type"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
            <el-button
              type="text"
              icon="el-icon-circle-plus"
              class="add-rule-group"
              @click="addruleGroup"
              >添加条件组</el-button
            >
          </el-form-item>
          <div class="index-id-13esr">
            <div class="index-rules-20auz">
              <div
                class="index__relation___39Oj7"
                v-if="ruleForm.ruleGroupList.length > 1"
              >
                <span
                  @click="
                    ruleForm.relation == 'or'
                      ? (ruleForm.relation = 'and')
                      : (ruleForm.relation = 'or')
                  "
                  >{{ ruleForm.relation == "or" ? "或" : "且" }}</span
                >
              </div>
              <ul class="index__list___3LLqj index__firstLevel___1LF0L">
                <li
                  v-for="(item, index) in ruleForm.ruleGroupList"
                  :key="index"
                >
                  <div
                    class="index__relation___39Oj7"
                    v-if="item.rules.length > 1"
                  >
                    <span
                      @click="
                        item.relation == 'or'
                          ? (item.relation = 'and')
                          : (item.relation = 'or')
                      "
                      >{{ item.relation == "or" ? "或" : "且" }}</span
                    >
                  </div>
                  <ul class="index__list___3LLqj index__secondLevel___3-iOK">
                    <li
                      data-serial="letter"
                      v-for="(val, ind) in item.rules"
                      :key="ind"
                    >
                      <span
                        class="index__num___3np-1"
                        v-if="
                          ruleForm.ruleGroupList[0].rules.length > 1 ||
                          ruleForm.ruleGroupList.length > 1
                        "
                        >{{ index + 1 + "-" + (ind + 1) }}</span
                      >
                      <div class="index__container___1Ge7n">
                        <div class="index__measureContainer___3jtMm">
                          <div class="index__eventContainer___XsfMc">
                            <el-select
                              v-model="val.meName"
                              placeholder="请选择量测量"
                              style="width: 140px; margin-right: 8px"
                              size="small"
                            >
                              <el-option
                                v-for="me in meList"
                                :key="me.labels"
                                :label="me.labels"
                                :value="me.labels"
                              >
                              </el-option>
                            </el-select>
                            <el-select
                              v-model="val.Label"
                              placeholder="请选择值"
                              style="width: 140px; margin-right: 8px"
                              size="small"
                              disabled
                            >
                              <el-option label="值" value="值"> </el-option>
                            </el-select>
                            <el-select
                              v-model="val.symbol"
                              style="width: 60px; margin-right: 8px"
                              placeholder=""
                              size="small"
                            >
                              <el-option
                                v-for="symbol in symbolList"
                                :key="symbol.value"
                                :label="symbol.label"
                                :value="symbol.value"
                              >
                              </el-option>
                            </el-select>
                            <el-form-item
                              label=""
                              label-width="0"
                              :prop="
                                'ruleGroupList.' +
                                index +
                                '.rules.' +
                                ind +
                                '.cnt'
                              "
                              :rules="{
                                required: true,
                                validator: validate,
                                trigger: 'blur',
                              }"
                            >
                              <el-input
                                v-model.trim="val.cnt"
                                placeholder=""
                                style="width: 140px !important"
                                size="small"
                              ></el-input>
                            </el-form-item>
                          </div>
                          <div class="index__operation___2jAI0">
                            <div>
                              <el-button
                                type="text"
                                icon="el-icon-circle-plus-outline"
                                class="index__addItemBtn___V_HEf"
                                v-if="ind + 1 == item.rules.length"
                                @click="addRules(index)"
                                >添加条件</el-button
                              >
                              <i
                                class="el-icon-close index__deleteBtn___3yhRT"
                                v-if="
                                  ruleForm.ruleGroupList[0].rules.length > 1 ||
                                  ruleForm.ruleGroupList.length > 1
                                "
                                @click="deleteRules(index, ind)"
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <div class="index-rules-time">
              <el-select
                v-model="ruleForm.ruleGroupDate.duration"
                placeholder=""
                style="width: 110px; margin-right: 8px"
                disabled
                size="small"
              >
                <el-option label="持续时间" value="持续时间"></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.ruleGroupDate.symbol"
                placeholder=""
                style="width: 110px; margin-right: 8px"
                disabled
                size="small"
              >
                <el-option label="等于" value="等于"></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.ruleGroupDate.time"
                placeholder=""
                style="width: 110px; margin-right: 8px"
                size="small"
              >
                <el-option
                  v-for="time in timeList"
                  :key="time.value"
                  :label="time.label"
                  :value="time.value"
                ></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.ruleGroupDate.triggerNumber"
                placeholder=""
                style="width: 110px; margin-right: 8px"
                size="small"
                disabled
              >
                <el-option label="触发次数" value="触发次数"></el-option>
              </el-select>
              <el-select
                v-model="ruleForm.ruleGroupDate.triggerSymbol"
                placeholder=""
                style="width: 110px; margin-right: 8px"
                size="small"
                disabled
              >
                <el-option label="大于等于" value="大于等于"></el-option>
              </el-select>
              <el-input-number
                v-model="ruleForm.ruleGroupDate.num"
                :min="1"
                style="width: 110px !important"
                size="small"
                :precision="0"
              ></el-input-number>
            </div>
          </div>
          <div class="user-alarm-title">触发结果</div>
          <el-form-item label="告警类型：" prop="alarmType">
            <el-select
              filterable
              v-model.trim="ruleForm.alarmType"
              placeholder="请选择告警类型"
              style="width: 250px"
            >
              <el-option
                v-for="item in dict.alarm_type"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="告警等级：" prop="alarmLevel">
            <el-select
              filterable
              v-model.trim="ruleForm.alarmLevel"
              placeholder="请选择告警等级"
              style="width: 250px"
            >
              <el-option
                v-for="item in dict.alert_level"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleUserAlarmClosed">取消</el-button>
        <el-button type="primary" @click="submit('ruleForm')">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import * as CONFIG from "./config/index";
import { mapState } from "vuex";
import { GET_EMA_MPARAM_TYPE_LIST } from "@/common/api/config/measure";

export default {
  name: "AddUserAlarm",
  props: {
    dialogVisibleUserAlarm: {
      type: Boolean,
    },
    title: {
      type: String,
      default: "新增告警策略",
    },
  },
  components: {
    modal,
  },
  computed: {
    ...mapState(["dict"]),
  },
  data() {
    var validateNum = (rule, value, callback) => {
      var patt1 =
        /(^([-]?)[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^([-]?)(0){1}$)|(^([-]?)[0-9]\.[0-9]([0-9])?$)/;
      if (value === "") {
        callback(new Error("请输入"));
      } else if (!patt1.test(value)) {
        callback(new Error("最多支持小数点后2位"));
      } else {
        callback();
      }
    };
    return {
      validate: validateNum,
      ruleForm: {
        // 策略名称
        ruleName: "",
        //适用电压等级
        volLevel: "",
        //策略类型
        ruleType: "",
        // 量测量类型
        meType: "",
        // 告警类型
        alarmType: "",
        // 告警等级
        alarmLevel: "",
        // 条件
        ruleGroupList: [
          {
            rules: [
              {
                meName: "",
                Label: "值",
                cnt: 1,
                symbol: CONFIG.SYMBOL_LIST[0].value,
              },
            ],
            // 条件或且
            relation: "and",
          },
        ],
        // 条件组的或且
        relation: "and",
        //  时间
        ruleGroupDate: {
          duration: "持续时间",
          symbol: "等于",
          time: 1,
          triggerNumber: "触发次数",
          triggerSymbol: "大于等于",
          num: 1,
        },
      },
      rules: {
        // 策略名称
        ruleName: [
          { required: true, message: "请输入策略名称", trigger: "blur" },
        ],
        // 适用电压等级
        volLevel: [
          { required: true, message: "请选择适用电压等级", trigger: "change" },
        ],
        // 策略类型
        ruleType: [
          { required: true, message: "请选择策略类型", trigger: "change" },
        ],
        // 量测量类型
        meType: [
          { required: true, message: "请选择量测量类型", trigger: "change" },
        ],
        // 告警类型
        alarmType: [
          { required: true, message: "请选择告警类型", trigger: "change" },
        ],
        // 告警等级
        alarmLevel: [
          { required: true, message: "请选择告警等级", trigger: "change" },
        ],
      },
      //  电压等级
      volLevelList: CONFIG.VOL_LEVEL_LIST,
      //  策略类型
      ruleTypeList: CONFIG.RULE_TYPE_LIST,
      //  量测量
      meList: [],
      //  条件大小
      symbolList: CONFIG.SYMBOL_LIST,
      // 持续时间
      timeList: CONFIG.TIME_LIST,
    };
  },
  methods: {
    dialogVisibleUserAlarmClosed() {
      this.$emit("dialogVisibleUserAlarmClosed");
    },
    // 切换量测量类型
    meTypeChange(val) {
      this.meList = [];
      this.ruleForm.ruleGroupList[0].rules[0].meName = "";
      this.ruleForm.ruleGroupList[0].rules[0].cnt = 1;
      this.ruleForm.ruleGroupList[0].rules[0].symbol =
        CONFIG.SYMBOL_LIST[0].value;
      this.ruleForm.ruleGroupList[0];
      this.ruleForm.relation = "and";
      GET_EMA_MPARAM_TYPE_LIST(val).then((res) => {
        this.meList = res.rows;
        if (
          res.rows.length > 0 &&
          this.ruleForm.ruleGroupList.length > 0 &&
          this.ruleForm.ruleGroupList[0].rules.length > 0
        ) {
          this.ruleForm.ruleGroupList[0].rules[0].meName = res.rows[0].labels;
        }
      });
    },
    //  添加条件组
    addruleGroup() {
      var data = {
        rules: [
          {
            meName: this.meList[0].labels,
            Label: "值",
            cnt: 1,
            symbol: this.symbolList[0].value,
          },
        ],
        // 条件或且
        relation: "and",
      };
      this.ruleForm.ruleGroupList.push(data);
    },
    // 添加条件
    addRules(index) {
      var data = {
        meName: this.meList[0].labels,
        Label: "值",
        cnt: 1,
        symbol: this.symbolList[0].value,
      };
      this.ruleForm.ruleGroupList[index].rules.push(data);
    },
    //  删除条件
    deleteRules(index, ind) {
      if (
        this.ruleForm.ruleGroupList.length == 1 &&
        this.ruleForm.ruleGroupList[0].rules.length > 1
      ) {
        this.ruleForm.ruleGroupList[0].rules.splice(ind, 1);
      } else if (
        this.ruleForm.ruleGroupList.length > 1 &&
        this.ruleForm.ruleGroupList[index].rules.length == 1
      ) {
        this.ruleForm.ruleGroupList.splice(index, 1);
      } else if (
        this.ruleForm.ruleGroupList.length > 1 &&
        this.ruleForm.ruleGroupList[index].rules.length > 1
      ) {
        this.ruleForm.ruleGroupList[index].rules.splice(ind, 1);
      }
    },
    //  提交
    submit(formName) {
      console.log(this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm);
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.ruleForm.meType = this.dict.measurement_type.length
      ? this.dict.measurement_type[0].dictValue
      : null;
    this.ruleForm.alarmType = this.dict.alarm_type.length
      ? this.dict.alarm_type[0].dictValue
      : null;
    this.ruleForm.alarmLevel = this.dict.alert_level.length
      ? this.dict.alert_level[0].dictValue
      : null;
    this.meTypeChange(this.ruleForm.meType);
  },
};
</script>

<style scoped lang="scss">
::v-deep .user-alarm-modal {
  .user-alarm-title {
    font-size: 16px;
    color: #333333;
    margin-bottom: 20px;
  }
  .el-dialog__body {
    padding: 30px 20px 0;
    max-height: 500px;
    .el-input {
      width: 100% !important;
    }
    .el-form-item__label {
      line-height: 30px !important;
    }
    .add-rule-group {
      display: inline-block;
      color: #606266;
      position: absolute;
      top: 0;
      right: 0;
      font-size: 14px;
      span {
        font-size: 14px !important;
      }
      i {
        color: #04cb94;
      }
    }
    .index-id-13esr {
      width: 100%;
      overflow: hidden;
      transition: all 0.25s linear;
      height: auto;
      margin-bottom: 16px;
      .index-rules-20auz {
        position: relative;
        display: flex;
        .index__firstLevel___1LF0L {
          flex: 1;
          li {
            margin-bottom: 16px;
            display: flex;
            padding-left: 0;
            &:last-child {
              margin-bottom: 0;
            }
            .index__relation___39Oj7 {
              margin-top: 0;
              margin-right: 5px;
              > span {
                font-size: 12px;
              }
            }
          }
        }
        .index__list___3LLqj {
          margin: 0;
          padding: 0;
          list-style: none;
          & > li {
            position: relative;
          }
          & > li[data-serial="letter"] {
            display: flex;
            & > .index__num___3np-1 {
              display: inline-block;
              background: #2dca93;
              color: #fff;
              height: 20px;
              border-radius: 2px;
              font-size: 14px;
              line-height: 20px;
              text-align: center;
              position: relative;
              top: 6px;
              margin-right: 14px;
              padding: 0 2px;
            }
            & > div {
              flex: 1;
            }
          }
        }
        .index__secondLevel___3-iOK {
          flex: 1;
          & > li {
            padding: 0 0 8px 8px;
          }
        }
        & > .index__relation___39Oj7 {
          left: 0;
          bottom: 0;
          top: 8px;
          margin-right: 8px;
          > span {
            font-size: 14px;
          }
        }
      }
      .index-rules-time {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        margin: 28px 0 10px;
      }
    }
  }
}
::v-deep .index__container___1Ge7n {
  font-size: 14px;
  .index__measureContainer___3jtMm {
    display: flex;
    justify-content: space-between;
    .index__eventContainer___XsfMc {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .index__operation___2jAI0 {
      display: flex;
      align-items: flex-start;
      > div {
        display: flex;
        height: 32px;
        align-items: center;
      }
      .index__addItemBtn___V_HEf {
        display: inline-block;
        cursor: pointer;
        font-size: 14px;
        color: #5e6d82;
        height: 32px;
        line-height: 32px;
        padding: 0;
        i.el-icon-circle-plus-outline {
          color: #04cb94;
        }
      }
      i:first-of-type {
        position: relative;
      }
      .index__deleteBtn___3yhRT {
        margin-left: 12px;
        font-size: 14px;
        color: #778ca2;
        cursor: pointer;
      }
    }
  }
}
.index__relation___39Oj7 {
  left: 0;
  top: 0;
  bottom: 0;
  position: relative;
  > span {
    position: relative;
    display: block;
    top: 50%;
    left: 0;
    right: 0;
    width: auto;
    min-width: 25px;
    height: 25px;
    transform: translateY(-50%);
    border-radius: 3px;
    background: #d6efe8;
    color: #00d166;
    font-size: 14px;
    font-weight: 700;
    line-height: 25px;
    text-align: center;
    cursor: pointer;
    user-select: none;
  }
  &:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 100%;
    overflow: hidden;
    background: #d6efe8;
  }
}
</style>
