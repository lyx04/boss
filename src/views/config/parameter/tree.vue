<template>
  <mouseTree
    ref="tree"
    @clickNode="nodeClick"
    :treeData="treeData"
    :treeActive.sync="treeActive"
    :continueBollean="true"
    :menuVisible="menuVisible"
    @rihgtClick="rihgtClick"
  >
    <template slot="tooltip">
      <p>提示：右键可编辑设备类型</p>
      <p>系统内置节点不可编辑</p>
    </template>
    <template slot="treecustom" slot-scope="{ node, data }">
      <span class="custom-tree-node">
        <template v-if="data.isEdit">
          <div class="custom-tree-node-input">
            <el-input
              maxlength="20"
              v-model.trim="data.name"
              :ref="'slotTreeInput' + data.name"
              autofocus
              placeholder="请输入内容"
              @blur.stop="NodeBlur(node, data)"
              @keyup.enter.native="NodeBlur(node, data)"
            ></el-input>
          </div>
        </template>
        <template v-else>
          <template v-if="data.icon">
            <i :class="data.icon"></i>
          </template>
          <template v-else>
            <i class="icon-shebei2"></i>
          </template>
          <span>{{ data.name }}</span>
        </template>
      </span>
    </template>
    <template slot="mouseBox">
      <li
        @click="addChild"
        v-if="
          NODE &&
          NODE.level != 3 &&
          NODE.level == 2 &&
          NODE.childNodes.length > 0
        "
      >
        新增子节点
      </li>
      <li
        style="cursor: no-drop; color: #999999"
        v-else
        v-hasPermi="['ema:qType:add']"
      >
        新增子节点
      </li>
      <li
        @click="rename"
        v-if="DATA && DATA.isRead == 0"
        v-hasPermi="['ema:qType:update']"
      >
        重命名
      </li>
      <li
        style="cursor: no-drop; color: #999999"
        v-else
        v-hasPermi="['ema:qType:update']"
      >
        重命名
      </li>
      <li
        @click="delectndoe"
        v-if="DATA && DATA.isRead == 0"
        v-hasPermi="['ema:qType:del']"
      >
        删除节点
      </li>
      <li
        style="cursor: no-drop; color: #999999"
        v-else
        v-hasPermi="['ema:qType:del']"
      >
        删除节点
      </li>
    </template>
  </mouseTree>
</template>
<script>
import mouseTree from "@/common/components/MouseTree";
import qs from "querystring";
import {
  GET_EMA_TREE_LIST,
  EDITOR_EMA_TREE,
  ADD_EMA_TREE,
} from "@/common/api/config/measure";
export default {
  components: { mouseTree },
  data() {
    return {
      treeData: [],
      treeActive: {},
      treeActiveLabel: "",
      DATA: null,
      NODE: null,
      objectID: null,
      menuVisible: false,
    };
  },
  mounted() {},

  methods: {
    // 查询参数管理树结构
    getEmaTreeList(treeId) {
      GET_EMA_TREE_LIST(treeId, { affiliation: treeId }).then((res) => {
        this.treeData = res.data;
      });
    },
    // 右键
    rihgtClick(val) {
      if (this.objectID !== val.object.id) {
        this.objectID = val.object.id;
        this.menuVisible = true;
        this.DATA = val.object;
        this.NODE = val.value;
        this.$emit("update:treeActive", val.object);
      } else {
        this.menuVisible = !this.menuVisidble;
      }
      document.addEventListener("click", () => {
        this.menuVisible = false;
      });
      let menu = this.$refs.tree.$refs.right_box;
      /* 菜单定位基于鼠标点击位置 */
      menu.style.left = event.clientX + "px";
      menu.style.top = event.clientY + "px";
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
            })
            .catch(() => {
              this.$set(d, "isEdit", true);
            });
        } else {
          if (d.name) {
            let parms = {
              id: d.id,
              name: d.name,
              parentId: d.parentId,
              affiliation: 2,
              isRead: d.isRead,
            };
            EDITOR_EMA_TREE(qs.stringify(parms))
              .then(() => {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
              })
              .catch(() => {
                this.$set(d, "isEdit", true);
              });
          } else {
            this.$message({
              message: "名称不能为空",
              type: "warning",
            });
            this.$set(d, "isEdit", true);
          }
        }
      }
    },
    //添加子节点
    addChild() {
      this.NodeAdd(this.NODE, this.DATA);
      this.menuVisible = false;
    },
    //点击重命名
    rename() {
      if (!this.DATA.isEdit) {
        //检测isEdit是否存在or是否为false
        this.$set(this.DATA, "isEdit", true);
      }
      this.menuVisible = false;
    },
    //删除节点
    delectndoe() {
      this.NodeDel(this.NODE, this.DATA);
      this.menuVisible = false;
    },
    //新增、修改节点
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
        affiliation: 2,
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
          this.$emit("nodeClick");
        };
        //二次确认
        let ConfirmFun = () => {
          this.$msgbox({
            title: "",
            customClass: "iconmes",
            message: "是否删除当前此节点",
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
                affiliation: 2,
              };
              EDITOR_EMA_TREE(qs.stringify(parms)).then(() => {
                this.$message({
                  message: "删除成功",
                  type: "success",
                });
                this.$emit("nodeClick");

                this.$set(d, "isEdit", false);
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
    //  点击右键
    nodeClick(val) {
      if (val.childs.length === 0 && "id" in val) {
        this.$emit("nodeClick", val.id);
        // this.$router.replace({
        //   path: `/config/parameter/${val.id}`,
        // });
      }
    },
  },
  created() {
    this.getEmaTreeList(2);
  },
};
</script>
<style lang="scss" scoped>
.tree-aside {
  height: 100%;
}
#treeNav {
  height: 100%;
}
</style>
