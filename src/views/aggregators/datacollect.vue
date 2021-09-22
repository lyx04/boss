<template>
  <div class="container datacollect">
    <el-form
      size="mini"
      :model="request"
      ref="request"
      label-width="auto"
      inline
    >
      <el-form-item label="用电单位:" prop="orgId">
        <el-select
          v-model.trim="request.orgId"
          placeholder="请选择用电单位"
          filterable
          @change="orgChange"
        >
          <el-option
            v-for="item in orgList"
            :key="item.orgid"
            :label="item.name"
            :value="item.orgid"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期:">
        <el-date-picker
          @change="dateChange"
          v-model.trim="request.date"
          :picker-options="pickerOptions"
          :clearable="false"
          :editable="false"
          type="date"
          align="right"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" @click="search" size="mini">查询</el-button>
      <el-button type="primary" @click="reset" size="mini">重置</el-button>
      <el-form-item style="float: right" label="系统自动补录:">
        <el-switch
          @change="switchChange"
          v-model="switchValue"
          :active-value="0"
          :inactive-value="1"
          active-color="#13ce66"
          inactive-color="#ff4949"
          ref="switch"
        >
        </el-switch>
      </el-form-item>
    </el-form>
    <div class="datacollect_content">
      <div class="title_button" v-show="collectFlag">
        <span
          style="
            float: left;
            font-weight: normal;
            font-size: 12px;
            color: rgb(230, 162, 60);
          "
          >*表格中红色边框处可编辑</span
        >
        {{ orgName }}
        <span>5分钟负荷表(单位kW)</span>
        <el-button
          type="primary"
          @click="submit"
          size="mini"
          v-if="Object.keys(subInfo.collectList).length > 0"
          >确认提交</el-button
        >
        <div style="clear: both"></div>
      </div>
      <ul v-show="collectFlag" class="collect_ul">
        <li
          v-for="(value, key, index) in fiveTime"
          :key="index"
          class="collect_li"
        >
          <template v-if="key < 10">
            <p class="li_title">{{ "0" + key }}:00</p>
          </template>
          <template v-else>
            <p class="li_title">{{ key }}:00</p>
          </template>
          <ul class="li_ul">
            <template v-if="key == 0">
              <li class="li_content">
                <el-input
                  disabled
                  type="number"
                  :key="index"
                  placeholder="--"
                ></el-input>
              </li>
            </template>
            <li
              class="li_content"
              v-for="(childvalue, childkey, index) in fiveTime[key]"
              :key="index"
            >
              <!-- <input
                  type="number"
                  v-model="fiveTime[key][childkey]"
                  :placeholder="childkey"
                /> -->
              <!-- <el-form-item :key="index"> -->
              <template v-if="childvalue.isSys == 0 || childvalue.isSys == 2">
                <el-input
                  type="number"
                  :key="index"
                  v-model="childvalue.value"
                  :placeholder="childkey"
                  disabled
                  :class="{
                    inputactive: !childvalue.value,
                  }"
                ></el-input>
              </template>
              <template v-else>
                <el-input
                  @focus="inputfocus(childkey)"
                  type="number"
                  :key="index"
                  v-model="childvalue.value"
                  :placeholder="childkey"
                  :class="{
                    inputactive: !childvalue.value,
                  }"
                ></el-input>
              </template>

              <!-- </el-form-item> -->
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as service from "@/common/api/system/datacollect";
import { FiveMintes } from "@/common/config/fiveTime";
import jstool from "hlcx-jstool";
export default {
  data() {
    return {
      switchValue: 0,
      request: {
        orgId: "",
        date: "",
      },
      collectFlag: false,
      orgName: "",
      orgList: [],
      fiveTime: FiveMintes,
      subInfo: {
        id: "",
        collectList: {},
      },
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > Date.now() - 86400000;
        },
      },
    };
  },
  mounted() {
    this.initOrgList();
    this.initDate();
    this.initSwitch();
  },
  methods: {
    switchChange(e) {
      service.UPDATA_CLEARING({ clearing: e }).catch(() => {
        this.switchValue =
          this.switchValue == 1
            ? this.$refs.switch.activeValue
            : this.$refs.switch.inactiveValue;
      });
    },
    initSwitch() {
      service.GET_CLEARING().then((e) => {
        this.switchValue = e.data;
      });
    },
    submit() {
      var inputactive = document.querySelectorAll(".inputactive");
      if (inputactive.length) {
        this.$msgbox({
          title: "",
          customClass: "iconmes",
          message: "仍有时点数据为空，确定提交吗？",
          showCancelButton: true,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "error",
          iconClass: "iconfont icon-huishou",
          closeOnClickModal: false,
          closeOnPressEscape: false,
        })
          .then(() => {
            this.dataSubmit();
          })
          .catch(() => {});
      } else {
        this.dataSubmit();
      }
    },
    dataSubmit() {
      var params = {
        day: this.request.date,
        id: this.subInfo.id,
        orgId: this.request.orgId,
        replenishDateValues: [],
      };
      for (var i in this.subInfo.collectList) {
        var parentTime = i.split(":")[0];
        var obj = {
          time: i,
          value: this.fiveTime[Number(parentTime)][i].value,
        };
        params.replenishDateValues.push(obj);
      }
      service.SET_FIVE_MINUTE(params).then((e) => {
        if (e.code == 200) {
          this.subInfo = {
            id: "",
            collectList: {},
          };
          this.collectFlag = false;
          this.$message.success("提交成功");
        }
      });
    },
    search() {
      this.subInfo = {
        id: "",
        collectList: {},
      };
      service.GET_ORG_FIVEMINUTE(this.request).then((e) => {
        this.subInfo.id = e.data.id;
        this.dataHand(e.data);
      });
    },
    //针对数据进行处理
    dataHand(data) {
      for (var item in this.fiveTime) {
        for (var j in this.fiveTime[item]) {
          this.fiveTime[item][j] = { value: "", isSys: null };
        }
      }
      for (var i in this.fiveTime) {
        var num = i < 10 ? "0" + i : i;
        for (var dataitem in data[num]) {
          this.fiveTime[i][dataitem].value = data[num][dataitem].split(",")[0];
          this.fiveTime[i][dataitem].isSys = data[num][dataitem].split(",")[1];
        }
      }
      this.collectFlag = true;
    },
    inputfocus(timekey) {
      this.$set(this.subInfo.collectList, timekey, "");
    },
    reset() {
      this.resetForm("request");
      this.collectFlag = false;
    },
    initDate() {
      this.request.date = jstool.jshandle.dateFormat(
        new Date().getTime() - 86400000,
        "yyyy-MM-dd"
      );
    },
    initOrgList() {
      var params = {
        enterpriseProperty: "01",
        isLoad: 1,
      };
      service.GET_CUSTOMER_LIST(params).then((e) => {
        this.orgList = e.rows;
        if (e.rows.length) {
          this.request.orgId = e.rows[0].orgid;
          this.orgChange();
        }
      });
    },
    orgChange() {
      service.GET_TREE(this.request.orgId).then((e) => {
        this.roomList = e.data;
        var item = this.orgList.filter((i) => {
          return i.orgid == this.request.orgId;
        });
        this.orgName = item[0].name;
        this.collectFlag = false;
      });
    },
    dateChange() {
      this.collectFlag = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.datacollect {
  padding-top: 25px;
  .el-form-item {
    margin-bottom: 0;
  }
  .datacollect_content {
    margin-top: 30px;
    .title_button {
      padding: 0 30px;
      font-size: 16px;
      text-align: center;
      margin-bottom: 20px;
      span {
        font-weight: bold;
      }
      .el-button {
        float: right;
      }
    }
    width: 100%;
    .collect_ul {
      padding: 0 30px;

      width: 100%;
      font-size: 0;
      .collect_li {
        width: 19%;
        margin-bottom: 10px;
        margin-left: 10px;
        display: inline-block;
        vertical-align: top;
        &:nth-child(5n + 1) {
          margin-left: 0;
        }
        .li_title {
          width: 100%;
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          background-color: #2589ee;
          color: white;
          text-align: center;
        }
        .li_ul {
          margin-top: 5px;
          width: 100%;
          font-size: 0;
          border-left: 1px solid #333;
          border-top: 1px solid #333;
          .li_content {
            display: inline-block;
            width: 33.33%;
            border-right: 1px solid #333;
            border-bottom: 1px solid #333;
            .el-input {
              &.inputactive {
                ::v-deep .el-input__inner {
                  border-color: #f56c6c;
                }
              }
              ::v-deep .el-input__inner {
                background-color: transparent;
                // color: white;
                padding-right: 0;
                border: 1px solid white;
              }
            }
          }
        }
      }
    }
  }
}
</style>
