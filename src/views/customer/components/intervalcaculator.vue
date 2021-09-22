// 对应计算间隔
<template>
  <common-modal :visible="show" @on-closed="close" customClass="Miniform">
    <template slot="head">
      <p>选择对应间隔</p>
    </template>
    <template slot="body">
      <ul>
        <li v-for="(item, index) in caculator" :key="index">
          <el-select
            size="mini"
            placeholder=""
            class="symbol"
            :disabled="item.disabled"
            v-model="item.symbol"
            v-if="index != 0"
          >
            <el-option value="-" label="-"></el-option>
            <el-option value="+" label="+"></el-option>
          </el-select>
          <el-select
            size="mini"
            class="power"
            :disabled="item.disabled"
            @change="powerChange($event, item)"
            v-model="item.roomId"
          >
            <el-option
              v-for="powerItem in powerList"
              :key="powerItem.id"
              :value="powerItem.id"
              :label="powerItem.name"
            ></el-option>
          </el-select>
          <el-select
            size="mini"
            class="interval"
            :disabled="item.disabled"
            @change="intervalChange(index)"
            v-model="item.intervalId"
          >
            <el-option
              v-for="intervalItem in powerCache[item.roomId]"
              :disabled="intervalItem.disabled"
              :key="intervalItem.id"
              :value="intervalItem.id"
              :label="intervalItem.name"
            >
              <span style="float: left">{{ intervalItem.name }}</span>
              <span style="float: right" v-if="intervalItem.line == 1"
                >总进线</span
              >
            </el-option>
          </el-select>
          <div class="option">
            <template v-if="index == caculator.length - 1">
              <p @click="addItem(item)"><i class="icon-xinzeng"></i></p>
              <p v-if="index != 0" @click="delectItem(item)">
                <i class="icon-quxiao"></i>
              </p>
            </template>
          </div>
        </li>
      </ul>
    </template>
    <template slot="foot">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">确认</el-button>
    </template>
  </common-modal>
</template>
<script>
// 变压器 4
// 屏柜 5
// 底层设备 6
// 表计 8
// 动环监控 9
// 通讯终端 11
// 配电室 13
// 间隔 14
// 视频 32
import commonModal from "@/common/components/Modal";
import {
  GET_METER_SELECT,
  GET_INTERVAL_ELE_ID,
} from "@/common/api/customerCore/customer";
export default {
  components: { commonModal },
  props: {
    show: Boolean,
    orgid: Number,
    caculatorList: String,
  },
  mounted() {
    this.initPower();
  },
  data() {
    return {
      //最后提交的列表
      caculator: [{ symbol: "", disabled: false }],
      //配电室列表
      powerList: [],
      //间隔列表，为了最后提交利用intervalId找到intervalName
      intervalList: [],
      powerCache: {
        /**
         * key：配电室id
         * value:间隔列表 */
      },
    };
  },
  methods: {
    initPower() {
      GET_METER_SELECT(this.orgid, 13).then((e) => {
        this.powerList = [].concat(e.data);
        e.data.forEach((i) => {
          this.$set(this.powerCache, i.id, []);
        });
        if (this.caculatorList) {
          //对于有原始数据的情况下初始化数据
          this.initData();
        } else if (e.data.length) {
          this.$set(this.caculator[0], "roomId", e.data[0].id);
          this.powerChange(e.data[0].id);
        }
      });
    },
    //配电室下拉获取间隔
    powerChange(e, item) {
      return new Promise((resolve) => {
        if (item) {
          delete item.intervalId;
          delete item.intervalName;
          this.powerCacheRender();
        }
        if (this.powerCache[e] && this.powerCache[e].length == 0) {
          //通过配电室Id获取间隔
          var params = {
            eleId: e,
            measures: "Eptp",
          };
          GET_INTERVAL_ELE_ID(params).then((res) => {
            res.data.forEach((i) => {
              i.disabled = false;
            });
            this.powerCache[e] = res.data;
            if (!this.caculatorList && res.data.length > 0) {
              this.$set(this.caculator[0], "intervalId", res.data[0].id);
            }
            if (res.data.length) {
              this.intervalList.length
                ? this.intervalList.push(res.data)
                : (this.intervalList = res.data);
            }
            resolve();
          });
        }
      });
    },
    initData() {
      var list = JSON.parse(this.caculatorList);
      var roomflag = [];
      list.forEach((i) => {
        if (i.roomId in this.powerCache) {
          roomflag.push(true);
        } else {
          roomflag.push(false);
        }
      });
      if (roomflag.indexOf(false) >= 0) {
        this.caculator = [{ symbol: "", disabled: false }];
        var data = Object.keys(this.powerCache);
        if (data.length) {
          this.$set(this.caculator[0], "roomId", Number(data[0]));
          this.powerChange(data[0]);
        }
      } else {
        this.caculator = list;
        list.forEach((i, v) => {
          this.powerChange(i.roomId).then(() => {
            this.intervalChange(v);
          });
        });
      }
    },
    //每次配电室重新选择时候需要把已有数据过一遍，将间隔状态重新修正
    powerCacheRender() {
      if (this.caculator.length == 1) {
        for (var i in this.powerCache) {
          this.powerCache[i].forEach((i) => {
            i.disabled = false;
          });
        }
      } else {
        var disabledTrue = [];
        var disabledRow = this.caculator.filter((i) => {
          if (i.disabled && disabledTrue.indexOf(i.roomId) != 0) {
            disabledTrue.push(i);
          }
          return i.disabled == true;
        });
        if (disabledRow.length) {
          disabledTrue.forEach((i) => {
            this.powerCache[i.roomId].forEach((j) => {
              j.disabled = false;
            });
          });
          disabledRow.forEach((i) => {
            this.powerCache[i.roomId].forEach((j) => {
              if (j.id == i.intervalId) {
                j.disabled = true;
              }
            });
          });
        }
      }
    },
    //间隔选择后需要在列表中禁用当前这一行
    intervalChange(index) {
      /**
       * 先从提交列表最后一行获取配电室id
       * 将当前配电是所有的间隔取消禁用
       * 通过配电室列表缓存找到间隔，将其禁用
       * 将提交列表中,将此配电室中已经选过的间隔禁用
       */
      var lastObj =
        this.caculator[index >= 0 ? index : this.caculator.length - 1];
      this.powerCache[lastObj.roomId].forEach((i) => {
        i.disabled = false;
      });
      var sublist = this.caculator.filter((i) => {
        return i.roomId == lastObj.roomId;
      });
      if (sublist.length) {
        sublist.forEach((i) => {
          var interval = this.powerCache[i.roomId].filter((inter) => {
            return inter.id == i.intervalId;
          });
          interval[0].disabled = true;
        });
      }
    },
    //添加下一行间隔
    addItem(item) {
      if ("roomId" in item && "symbol" in item && "intervalId" in item) {
        item.disabled = true;
        this.caculator.push({ disabled: false });
      } else {
        this.$message.error("请填写完成再添加");
      }
    },
    //删除一行间隔计算
    delectItem() {
      this.caculator.splice(this.caculator.length - 1, 1);
      this.caculator[this.caculator.length - 1].disabled = false;
      this.intervalChange();
    },
    //关闭
    close() {
      this.$emit("update:show", false);
      //最后提交的列表
      this.caculator = [{ symbol: "", disabled: false }];
      //配电室列表
      this.powerList = [];
      //间隔列表，为了最后提交利用intervalId找到intervalName
      this.intervalList = [];
      this.powerCache = {
        /**
         * key：配电室id
         * value:间隔列表 */
      };
    },
    //保存
    save() {
      var item = this.caculator[this.caculator.length - 1];
      if ("roomId" in item && "symbol" in item && "intervalId" in item) {
        this.caculator.forEach((i) => {
          var interItem = this.intervalList.filter((item) => {
            return item.id == i.intervalId;
          });
          if (interItem.length) {
            this.$set(i, "intervalName", interItem[0].name);
            this.$set(i, "sn", interItem[0].sn);
            this.$set(i, "dev", interItem[0].dev);
          }
        });
        this.$emit("update:show", false);
        this.$emit("intervalSub", this.caculator);
      } else {
        this.$message.error("请填写完成再提交");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.el-select-dropdown__item.is-disabled:hover {
  background-color: transparent;
}
.el-dialog__wrapper {
  ::v-deep .el-dialog__body {
    padding-left: 0 !important;
    padding-right: 0;
    ul {
      li {
        margin-bottom: 10px;
        text-align: right;
        .el-select {
          display: inline-block;
          .el-input {
            input {
              height: 30px;
            }
            .el-input__icon {
              line-height: 30px;
            }
          }
          &.symbol {
            width: 54px;
            height: 30px;
            margin-right: 10px;
          }
          &.power {
            width: 140px;
            height: 30px;
            margin-right: 10px;
          }
          &.interval {
            width: 175px;
            height: 30px;
          }
        }
        .option {
          margin-right: 10px;
          min-width: 37px;
          margin-left: 10px;
          display: inline-block;
          text-align: left;
          p {
            display: inline-block;
            cursor: pointer;
            i {
              font-size: 16px;
              // color: rgba(255, 255, 255, 0.6);
            }
            &:nth-of-type(1) {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
