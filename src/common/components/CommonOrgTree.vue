<template>
  <div class="orgTree tree-aside" @contextmenu.prevent :class="customClass">
    <span style="display:none">{{ updataOrg }}</span>
    <slot name="treehead"></slot>
    <div class="option" v-if="display.screen">
      <el-select
        :disabled="!optionFlag"
        @change="businessChange"
        v-model="orgParams.busType"
        placeholder="请选择项目类型"
        multiple
        collapse-tags
      >
        <!--<el-option value="" label="全部项目类型"></el-option>-->
        <el-option
          v-for="item in dict.business_events_type"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        >
        </el-option>
      </el-select>
      <el-select
        :disabled="!optionFlag"
        @change="orgTypeChange"
        v-model="orgParams.orgType"
        placeholder="请选择企业类型"
      >
        <el-option value="" label="全部企业类型"></el-option>
        <el-option
          v-for="item in dict.org_type"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        >
        </el-option>
      </el-select>
      <el-cascader
        ref="cascader"
        @change="areaChange"
        :props="area.props"
        :options="area.list"
        v-model="area.active"
        clearable
        placeholder="请选择区域"
      >
      </el-cascader>
      <el-input
        :placeholder="
          enterprise == '01' ? '请搜索用电企业' : '请搜索代理商/集团'
        "
        v-model="treeFind"
      >
        <template slot="suffix">
          <i
            @click="treesearch"
            style="cursor: pointer;"
            class="el-icon-search"
          ></i>
        </template>
        <template slot="append" v-if="display.button">
          <i
            style="cursor: pointer;"
            @click="treeSwitch"
            class="iconfont"
            :class="{
              'icon-danwei3': enterprise == '01',
              'icon-dailishang': enterprise == '02'
            }"
            :title="enterprise == '01' ? '切换代理商和集团' : '返回用电单位'"
          ></i>
        </template>
      </el-input>
    </div>
    <el-tree
      ref="tree"
      accordion
      :node-key="tree.nodeKey"
      :data="tree.data"
      :props="tree.props"
      highlight-current
      :filter-node-method="filterNode"
      @node-click="nodeClick"
      @node-expand="nodeClick"
      @node-contextmenu="rihgtClick"
    >
      <template name="default" slot-scope="{ node, data }">
        <div class="custom-tree-node">
          <template v-if="'enterpriseProperty' in data">
            <i
              class="iconfont square"
              :class="{
                'icon-danwei3': data.enterpriseProperty == '01',
                'icon-jituan':
                  data.enterpriseProperty == '02' ||
                  data.parentProperty == '02',
                'icon-dailishang':
                  data.enterpriseProperty == '03' || data.parentProperty == '03'
              }"
            ></i>
            <span :title="data.name">{{ data.name }}</span>
          </template>
          <template v-else>
            <slot name="treecustom" :data="data" :node="node">
              <i
                class="iconfont customicon"
                :class="[
                  {
                    typeColor:
                      data.category == 8 ||
                      data.category == 11 ||
                      data.category == 32 ||
                      data.category == 9
                  },
                  data.icon
                ]"
              ></i>
              <span :title="data.name">{{ data.name }}</span>
            </slot>
          </template>
        </div>
      </template>
    </el-tree>
  </div>
</template>
<script>
var t;
import { mapState, mapMutations } from "vuex";
import { GET_AREA_TREE } from "@/common/api/system/area";
import {
  GET_SYSTEM_ORG_LIST,
  GET_SYSTEM_ORG
} from "@/common/api/system/organization";
export default {
  props: {
    customClass: {
      type: String,
      default: "treeCustom"
    },
    treeprops: {
      type: Object,
      default: function() {
        return {
          children: "childs"
        };
      }
    },
    // inputdefaultText: {
    //   type: String,
    //   default: "请输入内容"
    // },
    //关于企业是否禁用的标志
    orgDisable: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState(["dict", "orgSubmit"]),
    updataOrg() {
      switch (this.orgSubmit) {
        case "add":
          this.renderTreeName();
          break;
        case "newAdd":
          this.newAdd();
          break;
      }
      return this.orgSubmit;
    }
  },
  mounted() {
    this.initArea();
    this.$refs.tree.$el.oncontextmenu = function(e) {
      e.preventDefault();
    };
  },
  methods: {
    ...mapMutations(["orgSubmitStatus"]),
    // 数组递归删除childs
    arrRecurr(childs) {
      childs.forEach(i => {
        if (i.childs.length) {
          this.arrRecurr(i.childs);
        } else {
          delete i.childs;
        }
      });
    },
    initArea() {
      GET_AREA_TREE().then(e => {
        this.arrRecurr(e.data);
        this.area.list = e.data;
        this.initTree();
      });
    },
    //根据当前用户获取树
    /**
     * enterpriseProperty
     * parentProperty==03就是代理商下属企业
     * 合力创新（null）->有筛选条件、有代理商
     * 代理商->有筛选条件，没有代理商按钮
     * 集团->有筛选条件,没有代理商按钮
     * 用电企业->没有筛选条件，没有代理商按钮
     * 默认使用用电企业的判断类型
     */
    initTree() {
      switch (this.userInfo.enterpriseProperty) {
        case null:
          this.display.screen = true;
          this.display.button = true;
          this.orgParams.queryFlag = this.enterprise;
          break;
        case "01":
          this.orgParams.queryFlag = undefined;
          break;
        case "02":
          this.display.screen = true;
          this.orgParams.queryFlag = this.enterprise;
          break;
        case "03":
          this.orgParams.queryFlag = this.enterprise;
          this.display.screen = true;
          break;
      }
      this.orgParams.orgId = this.userInfo.orgId;
      this.renderTree();
    },
    //企业和代理商的切换
    treeSwitch() {
      this.treeFind = "";
      /**
       * 当切换到代理商时需要把项目类型、企业类型禁用,防止直接搜索代理商
       */
      this.orgParams.orgType = "";
      this.orgParams.busType = [];
      this.area.active = "";
      this.orgParams.provincial = "";
      this.orgParams.city = "";
      this.orgParams.district = "";
      if (this.enterprise == "01") {
        this.enterprise = "02";
        this.optionFlag = false;
      } else {
        this.optionFlag = true;
        this.enterprise = "01";
        this.orgParams.orgId = this.userInfo.orgId;
      }

      this.orgParams.queryFlag = this.enterprise;
      this.renderTree();
    },
    //搜索框的搜索按钮
    treesearch() {
      this.$refs.tree.filter(this.treeFind);
    },
    // 过滤
    filterNode(value, data, node) {
      if (node.level == 1) {
        this.parentnode = node;
      }
      if (!data.name) {
        return false;
      }
      //对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
      if (!value) return true;
      this.$nextTick(() => {
        node.expanded = false;
      });
      // this.parentnode.data.name = this.parentnode.data.name.toLowerCase();
      var parentNodeName = this.parentnode.data.name.toLowerCase();
      var inputValue = value.toLowerCase();
      if (this.parentnode && parentNodeName.indexOf(inputValue) >= 0) {
        return true;
      } else {
        return false;
      }
      // if (data.name.indexOf(value) >= 0) {
      //   return true;
      // }
    },
    //  树结构点击
    nodeClick(data, node) {
      /**
       * 当前是在代理商的树结构中，点击代理商出现代理商下属的企业，点击代理商不发出事件
       * 在用电企业树结构中直接发出事件
       */
      clearTimeout(t);
      t = setTimeout(() => {
        if (data.enterpriseProperty != "01" && "enterpriseProperty" in data) {
          this.orgParams.orgId = data.orgId;
          this.orgParams.queryFlag = "01";
          if (!("childs" in data)) {
            this.renderTree();
          }
        }
        this.$emit("clickNode", data, node);
      }, 200);
    },
    //筛选项目类型
    businessChange() {
      this.orgParams.queryFlag = "01";
      this.treeFind = "";
      this.renderTree();
    },
    //筛选企业类型
    orgTypeChange(e) {
      this.orgParams.queryFlag = "01";
      this.treeFind = "";
      this.orgParams.orgType = e;
      this.renderTree();
    },
    //地域筛选
    areaChange(e) {
      this.orgParams.queryFlag = this.enterprise;
      this.orgParams.orgId = this.userInfo.orgId;
      if (this.enterprise == "02") {
        this.optionFlag = false;
      }
      this.treeFind = "";
      this.orgParams.provincial = e[0];
      this.orgParams.city = e[1];
      this.orgParams.district = e[2];
      this.renderTree();
    },
    renderTree() {
      this.orgParams.businessEventsType = this.orgParams.busType.toString();
      var params = {
        businessEventsType: this.orgParams.businessEventsType,
        city: this.orgParams.city,
        disableFlag: this.orgParams.disableFlag,
        district: this.orgParams.district,
        orgId: this.orgParams.orgId,
        orgType: this.orgParams.orgType,
        provincial: this.orgParams.provincial,
        queryFlag: this.orgParams.queryFlag
      };
      GET_SYSTEM_ORG_LIST(params).then(e => {
        e.data.forEach(i => {
          //为了将树的Nodekey唯一
          i["treeTypeId"] = i.orgId;
        });
        if (this.userInfo.orgId != this.orgParams.orgId) {
          this.optionFlag = true;
          this.$refs.tree.updateKeyChildren(this.orgParams.orgId, e.data);
          this.$refs.tree.getNode(this.orgParams.orgId).expanded = true;
        } else {
          this.tree.data = e.data;
          this.$nextTick(() => {
            this.$emit("treeEnd");
          });
        }
      });
    },
    //请求更新树结构时，只更新当前选中的节点,根据层级判断，只要是第一层就直接请求树结构
    renderTreeName() {
      var activeTree = this.$refs.tree.getCurrentNode();
      GET_SYSTEM_ORG(activeTree.orgId).then(e => {
        if (e.data) {
          activeTree.name = e.data.name;
        } else {
          this.$refs.tree.remove(activeTree);
        }
        this.orgSubmitStatus("");
      });
    },
    //新增客户后请求更新树
    newAdd() {
      this.orgParams.orgId = this.userInfo.orgId;
      this.orgParams.queryFlag = this.enterprise;
      this.orgParams.businessEventsType = this.orgParams.busType.toString();
      this.orgParams.businessEventsType = this.orgParams.busType.toString();
      var params = {
        businessEventsType: this.orgParams.businessEventsType,
        city: this.orgParams.city,
        disableFlag: this.orgParams.disableFlag,
        district: this.orgParams.district,
        orgId: this.orgParams.orgId,
        orgType: this.orgParams.orgType,
        provincial: this.orgParams.provincial,
        queryFlag: this.orgParams.queryFlag
      };
      GET_SYSTEM_ORG_LIST(params).then(e => {
        e.data.forEach(i => {
          //为了将树的Nodekey唯一
          i["treeTypeId"] = i.orgId;
        });
        this.tree.data = e.data;
        this.orgSubmitStatus("");
      });
    },
    //树结构右键
    rihgtClick(event, object, value) {
      var data = {
        event,
        object,
        value
      };
      this.$emit("rihgtClick", data);
    }
  },
  data() {
    return {
      //筛选时保存一下根节点，
      parentnode: "",
      enterprise: "01", //企业性质
      //当前请求参数
      orgParams: {
        orgId: "",
        orgType: "", //企业类型
        queryFlag: this.enterprise,
        busType: "", //业务类型
        disableFlag: this.orgDisable,
        // 省
        provincial: "",
        // 市
        city: "",
        // 区
        district: ""
      },
      //显示条件
      display: {
        // 筛选
        screen: false,
        button: false
      },
      //区域列表
      area: {
        list: [],
        active: "",
        props: {
          label: "areaName",
          value: "areaId",
          children: "childs",
          checkStrictly: true
        }
      },
      //在代理商树中，不能筛选代理商的项目类型
      optionFlag: true,
      userInfo: JSON.parse(sessionStorage.getItem("userInfo")),
      treeFind: "",
      //树结构
      tree: {
        data: [],
        nodeKey: "treeTypeId",
        props: this.treeprops
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.orgTree {
  padding: 0 7px;
}
::v-deep .el-input__inner {
  height: 30px;
  line-height: 30px;
}
.option {
  ::v-deep .el-input {
    .el-input__suffix {
      line-height: 30px;
      .el-input__icon {
        line-height: 30px;
      }
    }
    .el-input-group__append {
      background-color: transparent;
      padding: 0 7px;
      border: none;
      i {
        color: #00ffff;
      }
    }
  }
}
.el-select,
.el-cascader,
.el-input {
  width: 100%;
  line-height: 30px;
  margin-top: 6px;
}
::v-deep.tree-aside.treeCustom {
  // position: fixed;
  /*overflow: auto;*/
  /*background-image: url("~@/common/assets/img/common/nav_back.png");*/
  /*background-repeat: no-repeat;*/
  /*background-size: 100% 100%;*/
  /*border-top-left-radius: 10px;*/
  /*border-bottom-left-radius: 10px;*/
  /*width: 266px;*/
  /*float: left;*/
  /*height: 100%;*/
  // &:hover {
  //   overflow: auto;
  // }
  .h-aside {
    height: 500px;
  }
  .add-user {
    margin: 17px 23px 0 25px;
    .el-button {
      width: 100%;
    }
  }
  .search {
    margin: 21px 8px 16px 7px;
    .el-input__inner {
      background-color: rgba(235, 235, 235, 0.15);
      height: 31px;
      border-radius: 16px;
      border: none;
      line-height: 31px;
      color: #ffff;
      padding: 0 30px 0 23px;
    }
    .el-input__icon {
      line-height: 31px;
    }
  }
  .tooltip {
    margin-bottom: 14px;
    padding: 0 0 0 20px;
    p {
      margin-bottom: 5px;
      color: #ff0000;
      font-size: 10px;
    }
  }
  .el-tree {
    margin-top: 12px;
    font-size: 12px;
    background: transparent;
    color: #ffffff;
    padding: 0 10px 0 20px;
    .customicon {
      color: #0ceaf3;
    }
    .typeColor {
      color: #3cc166;
    }
    .el-tree-node {
      position: relative;
    }
    .is-current,
    .is-checkedis-current {
      background: transparent;
      background-image: url("~@/common/assets/img/common/three_active.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .is-expanded {
      background: transparent;
    }
    .el-tree-node__content {
      background: transparent;
      height: 36px;
      line-height: 36px;
      &:hover {
        background: transparent;
        background-image: url("~@/common/assets/img/common/three_active.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .el-tree-node__expand-icon {
        position: absolute;
        right: 0;
        color: #79caf1;
        &.is-leaf {
          color: transparent;
        }
      }
      .custom-tree-node {
        width: 80%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        i {
          vertical-align: bottom;
          /*margin-left: 10px;*/
          margin-right: 10px;
          font-size: 16px;
          font-family: iconfont;
        }
        .square {
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-image: -webkit-linear-gradient(
            -90deg,
            #ececec 20%,
            #60afea 60%
          );
        }
        .custom-tree-node-input {
          position: relative;
          z-index: 9;
          background-color: rgb(20, 35, 122);
          .el-input {
            width: 160px;
            background-color: rgba(235, 235, 235, 0.15);
          }
          i {
            vertical-align: inherit;
            cursor: pointer;
            color: #67c23a;
          }
          i:last-child {
            color: #f56c6c;
          }
        }
      }
    }
  }
}
</style>
