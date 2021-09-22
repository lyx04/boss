<template>
  <div class="container">
    <div class="measure">
      <mouseTree
        v-if="tabsActiveId == '10'"
        :treeData="treeData"
        :treeActive.sync="treeActive"
        @NodeBlur="NodeBlur"
        @clickNode="clickNode"
        @treeChange="treeChange"
      >
      </mouseTree>
      <div class="log-content" :class="{ active: tabsActiveId != '10' }">
        <tabs
          :tabsData="tabsData"
          :tabsActiveId="tabsActiveId"
          @tabs-change="tabsChange"
        ></tabs>
        <template v-if="tabsActiveId == '10'">
          <measure
            v-if="measureShow"
            :measureObj="measureObj"
            :euqiptreeName="euqiptreeName"
            :euqiptreeId="euqiptreeId"
          ></measure>
          <div v-else class="el__empty-block">
            <span>请选中有量测量的节点哦！</span>
          </div>
        </template>
        <template v-if="tabsActiveId == '20'">
          <mapping></mapping>
        </template>
        <template v-if="tabsActiveId == '30'">
          <factory></factory>
        </template>
      </div>
      <div style="clear: both"></div>
      <!-- ----------------------------------分割线
    --------------------------------------------- -->
      <common-modal :visible="delectModal" customClass="mesfont">
        <template slot="body">
          <div class="mes">
            <p>{{ delectmes }}</p>
          </div>
        </template>
        <template slot="foot">
          <el-button>取消</el-button>
          <el-button type="primary">确认</el-button>
        </template>
      </common-modal>
    </div>
  </div>
</template>

<script>
import commonModal from "@/common/components/Modal";
import mouseTree from "@/common/components/MouseTree";
import tabs from "@/common/components/Tabs";
import measure from "./measure";
import mapping from "./mapping";
import factory from "./factory";
import { GET_EMA_TREE_LIST } from "@/common/api/config/measure";
export default {
  name: "TreeAside",
  components: {
    mouseTree,
    commonModal,
    tabs,
    measure,
    mapping,
    factory,
  },
  data() {
    return {
      //模态框的文字
      delectmes: "",
      //模态框的显示
      delectModal: false,
      //当前修改的树节点名称
      treeActiveLabel: "",
      //右键显示
      rightflag: false,
      //点击的节点
      treeActive: {},
      treeData: [], // 树结构
      defaultProps: {
        children: "children",
        label: "label",
      },
      defaultExpandedKeys: [], //
      defaultCheckedKeys: [],
      currentNodeKey: "",
      tabsData: [
        {
          label: "量测量集",
          value: "10",
          perms: "ema:mparam:add",
        },
        {
          label: "映射厂家",
          value: "30",
          perms: "ema:factory:list",
        },
        {
          label: "映射关系",
          value: "20",
          perms: "ema:pf:list",
        },
      ], // tabs数据
      tabsActiveId: "10", // tabs选中结果
      measureShow: false, // 量测量内容是否显示
      measureObj: {}, // 量测量叶子节点
      euqiptreeId: "", // 量测量叶子id
      euqiptreeName: "", // 量测量叶子name
    };
  },
  methods: {
    initTab() {
      var permissions = sessionStorage.getItem("permissions");
      if (permissions.indexOf("*:*:*") < 0) {
        var items = this.tabsData.filter((i) => {
          return permissions.indexOf(i.perms) >= 0;
        });
        if (items.length) {
          if (items.length > 1) {
            items = items.sort((a, b) => {
              return Number(a.value) - Number(b.value);
            });
          }
          this.tabsChange(items[0].value);
        }
      } else {
        this.tabsChange(this.tabsData[0].value);
      }
    },
    //  tabs切换
    tabsChange(val) {
      console.log(val);
      this.tabsActiveId = val;
      this.measureShow = false;
      if (val == 10) {
        if (!this.$route.params.euqiptreeId) {
          this.getEmaTreeList(1);
        }
      }
    },
    // 新增客户
    newCustomer() {
      this.$emit("new-customer");
    },
    // 查询参数管理、量测量树结构
    getEmaTreeList(treeId) {
      GET_EMA_TREE_LIST(treeId, { affiliation: treeId }).then((res) => {
        this.treeData = res.data;
      });
    },
    NodeBlur() {
      this.getEmaTreeList(1);
    },
    clickNode(val) {
      if ((val.childs.length === 0 || val.nodeType == 1) && !val.isEdit) {
        this.measureObj = val;
        this.measureShow = true;
        this.euqiptreeName = val.name;
        this.euqiptreeId = val.id;
      } else {
        this.measureShow = false;
        this.measureObj = {};
      }
    },
    //  操作树结构
    treeChange(val, name, id) {
      if (val == "add") {
        this.measureObj = {
          id: id,
          name: name,
        };
        this.measureShow = true;
        this.euqiptreeName = name;
        this.euqiptreeId = id;
      } else if (val == "edit") {
        this.measureObj = {
          id: id,
          name: name,
        };
        this.measureShow = true;
        this.euqiptreeName = name;
        this.euqiptreeId = id;
      } else {
        this.measureShow = false;
        this.measureObj = {};
      }
    },
  },
  mounted() {
    this.initTab();
  },
};
</script>

<style scoped lang="scss">
.measure {
  font-size: 0;
  position: relative;
  max-height: 100%;
}
.log-content {
  height: 100%;
  margin-left: 266px;
  padding: 25px 27px 0 25px;
  &.active {
    margin: 0;
  }
  .h-tabs {
    margin-bottom: 20px;
  }
  .operation-log,
  .login-log {
    margin-top: 25px;
  }
  ::v-deep .option_head {
    margin-bottom: 10px;
    .el-input {
      width: 216px;
      margin-right: 20px;
    }
  }
  ::v-deep .table_option {
    margin-top: 20px;
    .table_right {
      float: right;
      .el-input {
        .el-input__inner {
          // height: auto;
          // padding: 8px 20px;
          // line-height: 1;
        }
      }
      .el-button--primary {
        margin-right: 10px;
      }
    }
  }
}
</style>
