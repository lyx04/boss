<template>
  <div class="tree-aside">
    <!--按钮-->
    <div class="add-user">
      <el-button type="primary" @click="newCustomer">新增客户</el-button>
    </div>
    <!--搜索框-->
    <div class="search">
      <el-input
        placeholder="输入关键字检索"
        suffix-icon="el-icon-search"
        v-model.trim="keyword"
        @change="keywordChange"
        accordion
      >
      </el-input>
    </div>
    <!--树结构-->
    <el-tree
      ref="tree"
      accordion
      node-key="value"
      :data="treeData"
      :props="defaultProps"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      highlight-current
      :filter-node-method="filterNode"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick"
      @node-expand="handleNodeClick"
    >
      <span
        class="custom-tree-node"
        :id="data.value"
        slot-scope="{ node, data }"
      >
        <span class="custom-tree-node-item-content" :title="node.label"
          ><i :class="data.icon"></i>{{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
import { mapState } from "vuex";
import filterTree from "@/common/mixins/filterTree";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";
import { GET_DICT_DATA_TYPE } from "@/common/api/system/dictionary";
export default {
  name: "TreeAside",
  mixins: [filterTree],
  computed: {
    ...mapState(["orgSubmit"])
  },
  data() {
    return {
      keyword: "", // 搜索框内容
      orgTypeList: [],
      treeData: [], // 树结构
      defaultProps: {
        children: "children",
        label: "label"
      },
      defaultExpandedKeys: [], //
      defaultCheckedKeys: [],
      currentNodeKey: ""
    };
  },
  methods: {
    //  搜索框
    keywordChange(val) {
      console.log(val);
    },
    //  树结构点击
    handleNodeClick(data) {
      this.$router.push({
        path: `../../../system/customer/${data.type}/${data.value}`
      });
    },
    // 过滤
    filterNode(value, data) {
      //对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 树结构选中
    treeActive() {
      if (this.rescursion(this.treeData, this.$route.params.id)) {
        this.defaultExpandedKeys = [
          this.rescursion(this.treeData, this.$route.params.id).parentId == 0
            ? ""
            : String(
                this.rescursion(this.treeData, this.$route.params.id).parentId
              )
        ];
      }
      this.defaultCheckedKeys = [this.$route.params.id];
      this.currentNodeKey = this.$route.params.id;
      this.$nextTick(() => {
        setTimeout(() => {
          let customTreeNode = document.getElementById(this.$route.params.id);
          customTreeNode.parentNode.parentNode.className +=
            " is-checkedis-current";
        }, 500);
      });
    },
    // 新增客户
    newCustomer() {
      this.$emit("new-customer");
    },
    //
    getOrgList() {
      this.treeData = [];
      const orgTypeData = this.orgTypeList.map(item => {
        return {
          label: item.dictLabel,
          value: item.dictValue,
          type: 0,
          parentId: 0,
          icon: "el-icon-s-shop",
          children: []
        };
      });
      GET_SYSTEM_ORG_LIST().then(res => {
        let filterData = [];
        if (res.data.length > 0) {
          let ord = JSON.parse(sessionStorage.getItem("userInfo")).orgId;
          if (ord) {
            filterData = res.data.filter(item => {
              return item.orgId != ord;
            });
          }
        }
        let newData = filterData.map(item => {
          return {
            label: item.name,
            value: String(item.orgId),
            type: 10,
            parentId: item.orgType,
            icon: "el-icon-eleme",
            children: []
          };
        });
        let dataFilter = newData.filter(item => {
          return item.type == 10 && item.value != 0;
        });
        let obj = newData.filter(item => {
          return item.value == 0;
        });
        let concatData = this.handleTree(
          orgTypeData.concat(dataFilter),
          "value"
        );
        concatData.forEach(item => {
          if (obj.length > 0) {
            if (item.value == obj[0].parentId) {
              item.children.unshift(obj[0]);
            }
          }
        });
        this.treeData = concatData;
        this.treeActive();
      });
    },
    removeEmptyChildren(node) {
      node.forEach(item => {
        if ("children" in item && item.children.length === 0) {
          item.children = [];
        } else if ("children" in item && item.children.length) {
          this.removeEmptyChildren(item.children);
        }
      });
    },
    getDictList() {
      GET_DICT_DATA_TYPE("org_type").then(res => {
        this.orgTypeList = res.data;
        this.getOrgList();
      });
    }
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val);
    },
    orgSubmit(val) {
      if (val) {
        this.treeData = [];
        this.$store.dispatch("setorgSubmit", "");
        this.getOrgList();
      }
    }
  },
  created() {
    this.getDictList();
  }
};
</script>

<style scoped lang="scss">
::v-deep.tree-aside {
  .add-user {
    margin: 17px 23px 0 25px;
    .el-button {
      width: 100%;
    }
  }
  .search {
    margin: 17px 7px 0 8px;
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
  .el-tree {
    background: transparent;
    color: #ffffff;
    padding: 10px 20px 0 15px;
    width: max-content;
    .el-tree-node {
      position: relative;
    }
    .is-current,
    .is-checkedis-current {
      background: transparent;
      background-image: url("../assets/img/common/three_active.png");
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
      padding-right: 30px;
      &:hover {
        background: transparent;
        background-image: url("../assets/img/common/three_active.png");
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
      .custom-tree-node-item-content {
        i {
          display: inline-block;
          margin-right: 6px;
          background: -webkit-linear-gradient(-90deg, #ececec 20%, #60afea 60%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
  }
}
</style>
