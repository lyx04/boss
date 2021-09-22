<template>
  <div id="treeNav">
    <div class="tree-aside" @contextmenu.prevent :class="customClass">
      <slot name="search">
        <!--搜索框-->
        <div class="search">
          <el-input
            size="mini"
            :placeholder="inputdefaultText"
            v-model.trim="keyword"
            accordion
          >
          </el-input>
        </div>
        <div class="tooltip">
          <slot name="tooltip">
            <p>提示：右击树形菜单以管理</p>
          </slot>
        </div>
      </slot>
      <!--树结构-->
      <el-tree
        ref="tree"
        accordion
        :node-key="nodeKey"
        :data="treeData"
        :props="defaultProps"
        :default-expanded-keys="defaultExpandedKeys"
        :default-checked-keys="defaultCheckedKeys"
        highlight-current
        :filter-node-method="filterNode"
        :current-node-key="currentNodeKey"
        @node-click="handleNodeClick"
        @node-contextmenu="rihgtClick"
      >
        <template #default="{ node, data }">
          <slot name="treecustom" :data="data" :node="node">
            <span class="custom-tree-node">
              <span v-show="data.isEdit">
                <div class="custom-tree-node-input">
                  <el-input
                    size="mini"
                    v-model.trim="data.name"
                    :ref="'slotTreeInput' + data.name"
                    autofocus
                    maxlength="8"
                    placeholder="请输入内容"
                    @blur.stop="NodeBlur(node, data)"
                    @keyup.enter.native="NodeBlur(node, data)"
                  ></el-input>
                </div>
              </span>
              <span v-show="!data.isEdit">
                <span class="square"></span>
                <span>{{ data.name }}</span>
              </span>
            </span>
          </slot>
        </template>
      </el-tree>
    </div>
    <!-- 右键内容 -->
    <ul ref="right_box" class="right_box" v-show="menuVisible">
      <slot name="mouseBox">
        <li @click="handleAddTop" v-if="NODE && NODE.level == 1">
          新增顶级节点
        </li>
        <li
          style="cursor: no-drop; color: #999999"
          v-if="NODE && NODE.level != 1"
        >
          新增顶级节点
        </li>
        <li
          style="cursor: no-drop; color: #999999"
          v-if="(NODE && NODE.level == 3) || (NODE && ischilder > 0)"
        >
          新增子节点
        </li>
        <li @click="addChild" v-if="NODE && NODE.level != 3 && ischilder == 0">
          新增子节点
        </li>
        <li @click="rename">重命名</li>
        <li @click="delectndoe">删除节点</li>
      </slot>
    </ul>
  </div>
</template>
<script>
import qs from "querystring";
import {
  ADD_EMA_TREE,
  EDITOR_EMA_TREE,
  GET_EMA_MPARAM_LIST,
} from "@/common/api/config/measure";

export default {
  props: {
    nodeKey: {
      type: String,
      default: "id",
    },
    verification: {
      type: Array,
      default: function () {
        return [];
      },
    },
    treeActive: {
      type: Object,
      required: true,
      default: function () {
        return {};
      },
    },
    treeData: {
      type: Array,
      required: true,
    },
    customClass: {
      type: String,
      default: "treeCustom",
    },
    contextBollean: {
      // 右键
      type: Boolean,
      default: true,
    },
    continueBollean: {
      type: Boolean,
      default: false,
    },
    menuVisible: {
      type: Boolean,
      default: false,
    },
    inputdefaultText: {
      type: String,
      default: "输入关键字检索",
    },
    contextmenu: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    document.getElementById("treeNav").oncontextmenu = function () {
      return false;
    };
  },
  data() {
    return {
      keyword: "", // 搜索框内容
      defaultProps: {
        children: "childs",
        label: "name",
      },
      rightflag: false,
      //当前修改的树节点名称
      treeActiveLabel: "",
      currentNodeKey: "",
      defaultExpandedKeys: [], //
      defaultCheckedKeys: [],
      DATA: null,
      NODE: null,
      objectID: null,
      ischilder: 0, // 是否有量测量
    };
  },
  watch: {
    keyword(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    //点击重命名
    rename() {
      if (!this.DATA.isEdit) {
        //检测isEdit是否存在or是否为false
        this.$set(this.DATA, "isEdit", true);
      }
      this.menuVisible = false;
    },
    //添加子节点
    addChild() {
      this.NodeAdd(this.NODE, this.DATA);
      this.menuVisible = false;
    },
    // 新增顶级节点
    handleAddTop() {
      this.treeData.push({
        nodeType: 0,
        name: "",
        parentId: 1,
        childs: [],
        isRead: 0,
        isEdit: true,
        isType: "add",
        affiliation: this.$route.name === "TreeAside" ? 1 : 0,
      });
      this.menuVisible = false;
    },
    //删除节点
    delectndoe() {
      this.NodeDel(this.NODE, this.DATA);
      this.menuVisible = false;
    },
    //  树结构点击
    handleNodeClick(data, node) {
      this.$emit("clickNode", data, node);
    },
    // 过滤
    filterNode(value, data, node) {
      if (!data.name) {
        return false;
      }
      //对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏
      if (!value) return true;
      if (data.name.indexOf(value) != -1) {
        node.expanded = false;
        return true;
      }
    },
    //输入框失焦
    NodeBlur(n, d) {
      if (d.isEdit) {
        this.$set(d, "isEdit", false);
        if (!d.name && d.isType === "add") {
          const parent = n.parent;
          const children = parent.data.childs || parent.data;
          const index = children.findIndex((d) => !d.name);
          children.splice(index, 1);
          return false;
        }
        if (d.isType === "add") {
          let parms = {
            name: d.name,
            parentId: d.parentId,
            nodeType: this.NODE.level + 1 === 3 ? 1 : 0,
            isRead: d.isRead,
            affiliation: d.affiliation,
          };
          ADD_EMA_TREE(qs.stringify(parms))
            .then((res) => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              d.id = res.data;
              this.$emit("treeChange", "add", d.name, d.id);
            })
            .catch(() => {
              this.$set(d, "isEdit", true);
            });
        } else {
          let parms = {
            id: d.id,
            name: d.name,
            parentId: d.parentId,
            affiliation: this.$route.name === "TreeAside" ? 1 : 0,
          };
          EDITOR_EMA_TREE(qs.stringify(parms))
            .then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$emit("treeChange", "edit", d.name, d.id);
              // this.$emit("NodeBlur");
            })
            .catch(() => {
              this.$set(d, "isEdit", true);
            });
        }
      }
      this.$nextTick(() => {
        console.log(this.$refs);
        this.$refs["slotTreeInput" + d.name].$refs.input.focus();
      });
    },
    //新增节点
    NodeAdd(n, d) {
      //判断层级
      if (n.level >= 3) {
        this.$message.error("最多只支持三级！");
        return false;
      }
      //新增数据
      d.childs.push({
        nodeType: 0,
        name: "",
        parentId: d.id,
        childs: [],
        isRead: 0,
        isEdit: true,
        isType: "add",
        affiliation: this.$route.name === "TreeAside" ? 1 : 0,
      });
      //同时展开节点
      if (!n.expanded) {
        n.expanded = true;
      }
    },
    //删除节点
    NodeDel(n, d) {
      if (d.childs && d.childs.length !== 0) {
        this.$message.error("此节点有子级，不可删除！");
        return false;
      } else {
        //新增节点可直接删除，已存在的节点要二次确认
        //删除操作
        let DelFun = () => {
          let _list = n.parent.data.children || n.parent.data; //节点同级数据
          let _index = _list.map((c) => c.id).indexOf(d.id);
          _list.splice(_index, 1);
          this.$message.success("删除成功！");
        };
        //二次确认
        let ConfirmFun = () => {
          this.$msgbox({
            title: "",
            customClass: "iconmes",
            message: "是否删除当前节点",
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "error",
            iconClass: "iconfont icon-huishou",
            closeOnClickModal: false,
            closeOnPressEscape: false,
          })
            .then(() => {
              let parms = {
                id: d.id,
                delFlag: 1,
                parentId: d.parentId,
                affiliation: this.$route.name === "TreeAside" ? 1 : 0,
              };
              EDITOR_EMA_TREE(qs.stringify(parms)).then(() => {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.$emit("treeChange", "delete", d.name, d.id);
                this.$set(d, "isEdit", false);
                this.$nextTick(() => {
                  this.$refs["slotTreeInput" + d.id].$refs.input.focus();
                });
                const parent = n.parent;
                const children = parent.data.childs || parent.data;
                const index = children.findIndex((item) => item.id === d.id);
                children.splice(index, 1);
              });
            })
            .catch(() => {});
        };
        //判断是否是新增节点
        d.id > this.non_maxexpandId ? DelFun() : ConfirmFun();
      }
    },
    rihgtClick(event, object, value) {
      if (this.contextmenu) {
        if (this.continueBollean) {
          var data = {
            event,
            object,
            value,
          };
          this.$emit("rihgtClick", data);
        } else {
          if (this.contextBollean) {
            if (this.objectID !== object.id) {
              this.objectID = object.id;
              this.menuVisible = true;
              this.DATA = object;
              this.NODE = value;
              this.$emit("update:treeActive", object);
            } else {
              this.menuVisible = !this.menuVisidble;
            }
            document.addEventListener("click", () => {
              this.menuVisible = false;
            });
            let menu = this.$refs.right_box;
            /* 菜单定位基于鼠标点击位置 */
            menu.style.left = event.clientX + "px";
            if (event.clientY + 160 > document.documentElement.clientHeight) {
              menu.style.top = event.clientY - 96 + "px";
            } else {
              menu.style.top = event.clientY + "px";
            }
            //  ischilder
            var request = {
              euqiptreeId: this.DATA.id,
              queryName: "", // 角色类型
              pageNum: 1,
              pageSize: 2,
            };
            GET_EMA_MPARAM_LIST(qs.stringify(request)).then((res) => {
              this.ischilder = res.total;
            });
          }
        }
      }
    },
  },
};
</script>
<style lang="scss">
.right_box {
  position: fixed;
  width: 150px;
  background-color: white;
  /*min-height: 160px;*/
  box-shadow: 0 0 5px #f3f3f3;
  z-index: 3;
  li {
    cursor: pointer;
    width: 100%;
    height: 40px;
    font-size: 12px;
    color: rgb(51, 60, 124);
    line-height: 40px;
    padding-left: 10px;
    &:hover {
      background-color: #f3f3f3;
    }
    &[disabled] {
      color: #b5b5b5;
      pointer-events: none;
    }
  }
}
</style>
<style lang="scss" scoped>
#treeNav {
  width: 227px;
  float: left;
  position: absolute;
  top: 0;
  overflow-y: scroll;
}
::v-deep.tree-aside.treeCustom {
  background-color: white;
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
      // background-color: rgba(235, 235, 235, 0.15);
      // height: 31px;
      border-radius: 16px;
      // border: none;
      // line-height: 31px;
      // padding: 0 30px 0 23px;
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
    font-size: 12px;
    // background: transparent;
    color: black;
    padding: 0 40px 0 34px;
    > :nth-child(2) {
      i {
        color: #4cd964;
      }
    }
    > :first-child {
      i {
        color: #0ceaf3;
      }
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
          display: inline-block;
          margin-top: -1px;
          width: 6px;
          height: 6px;
          margin-right: 6px;
          background: -webkit-linear-gradient(-90deg, #ececec 20%, #60afea 60%);
        }
        .custom-tree-node-input {
          position: relative;
          z-index: 9;
          // background-color: rgb(20, 35, 122);
          .el-input {
            width: 100%;
            // background-color: rgba(235, 235, 235, 0.15);
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
