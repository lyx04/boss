<template>
  <div class="container main-content">
    <div class="table-template">
      <!--四角-->
      <div class="angle angle-left-top"></div>
      <div class="angle angle-left-bottom"></div>
      <div class="angle angle-right-top"></div>
      <div class="angle angle-right-bottom"></div>
      <div class="content-top">
        <span> 提示：右击可操作，双击可修改文字内容 </span>
        <el-button
          @click="saveTable"
          type="success"
          plain
          icon="iconfont icon-baocun"
          size="mini"
          v-hasPermi="['maintain:template:insert']"
          >保存</el-button
        >
      </div>
      <table>
        <thead>
          <tr>
            <th>目录</th>
            <th>巡检内容</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(item, index) in tableData">
            <tr v-for="(m, i) in item.childTemplate" :key="i">
              <td
                v-if="i == 0"
                :rowspan="item.childTemplate.length"
                @contextmenu.prevent="rihgtClick($event, 10, index)"
              >
                <div class="td-form" v-if="cIndex == index && dialog">
                  <el-input
                    v-model="item.content"
                    type="textarea"
                    maxlength="10"
                    v-focus
                  ></el-input>
                </div>
                <div class="td-text" @dblclick="toggle(index)" v-else>
                  <span>{{ item.content }}</span>
                </div>
              </td>
              <td class="td-content">
                <div class="td-form" v-if="cIndex == index + '-' + i && dialog">
                  <el-input
                    v-model="m.content"
                    type="textarea"
                    maxlength="50"
                    v-focus
                  ></el-input>
                </div>
                <div
                  class="td-text"
                  @dblclick="toggle(index + '-' + i)"
                  @contextmenu.prevent="rihgtClick($event, 20, i, index)"
                  v-else
                >
                  {{ m.content }}
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
      <!-- 右键内容 -->
      <ul
        ref="right_box"
        class="right_box btn-none"
        v-hasPermi="['maintain:template:insert']"
      >
        <li @click="addChild">新增</li>
        <li @click="removeChild">删除</li>
        <li @click="moveUpChild" :class="tableTdIndex == 0 ? 'disabled' : ''">
          上移
        </li>
        <li
          @click="moveDownChild"
          :class="tableTdIndex == this.tableData.length - 1 ? 'disabled' : ''"
          v-if="tableTdType == 10"
        >
          下移
        </li>
        <li
          @click="moveDownChild"
          v-if="tableTdType == 20"
          :class="
            tableTdIndex ==
            this.tableData[this.parentIndex].childTemplate.length - 1
              ? 'disabled'
              : ''
          "
        >
          下移
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {
  GET_MAINTAIN_TEMPLATE,
  ADD_MAINTAIN_TEMPLATE,
} from "@/common/api/config/template";
export default {
  name: "templateManagement",
  data() {
    return {
      // 模板数据
      tableData: [],
      dialog: false,
      cIndex: -1,
      tableTdType: 0, // 点击当前 td类型  10 目录  20 内容
      tableTdIndex: -1, // 点击当前位置
      parentIndex: -1, // 父节点位置
    };
  },
  methods: {
    // 编辑模板
    toggle(index) {
      this.cIndex = index;
      this.dialog = !this.dialog;
    },
    // 右键弹框
    rihgtClick(e, type, index, parentIndex) {
      e.stopPropagation();
      e.preventDefault();
      var clientX = e.clientX,
        clientY = e.clientY;
      var right_box = this.$refs.right_box;
      right_box.style.display = "block";
      right_box.style.top = clientY + "px";
      right_box.style.left = clientX + "px";
      // type  10 目录， 20是内容
      this.tableTdType = type;
      this.tableTdIndex = index;
      this.parentIndex = parentIndex;
    },
    // 新增节点
    addChild() {
      // tableTdType// 点击当前 td类型  10 目录  20 内容
      //   tableTdIndex// 点击当前位置
      if (this.tableTdType === 10) {
        this.tableData.splice(this.tableTdIndex + 1, 0, {
          content: "请填写目录名称",
          childTemplate: [
            {
              content: "请填写巡检内容",
              type: 0,
            },
          ],
        });
      } else if (this.tableTdType === 20) {
        this.tableData[this.parentIndex].childTemplate.splice(
          this.tableTdIndex + 1,
          0,
          {
            content: "请填写巡检内容",
            type: 0,
          }
        );
      }
    },
    // 删除节点
    removeChild() {
      if (this.tableTdType === 10) {
        if (this.tableTdType == 10) {
          this.$msgbox({
            title: "",
            customClass: "iconmes",
            message: "将删除当前目录下所有巡检内容",
            showCancelButton: true,
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: "error",
            iconClass: "iconfont icon-huishou",
            closeOnClickModal: false,
            closeOnPressEscape: false,
          })
            .then(() => {
              if (this.tableData.length > 1) {
                this.tableData.splice(this.tableTdIndex, 1);
              } else {
                this.tableData.splice(this.tableTdIndex, 1, {
                  content: "请填写项目名称",
                  childTemplate: [
                    {
                      content: "请填写巡检内容",
                      type: 0,
                    },
                  ],
                });
              }
            })
            .catch(() => {});
        }
      } else if (this.tableTdType === 20) {
        if (this.tableData[this.parentIndex].childTemplate.length > 1) {
          this.tableData[this.parentIndex].childTemplate.splice(
            this.tableTdIndex,
            1
          );
        } else {
          this.tableData[this.parentIndex].childTemplate.splice(
            this.tableTdIndex,
            1,
            {
              content: "请填写巡检内容",
              type: 0,
            }
          );
        }
      }
    },
    // 上移节点
    moveUpChild() {
      // 顶点不让移动
      if (this.tableTdType === 10) {
        if (this.tableTdIndex === 0) {
          return false;
        }
        this.swapItems(
          this.tableData,
          this.tableTdIndex,
          this.tableTdIndex - 1
        );
      } else if (this.tableTdType === 20) {
        if (this.tableTdIndex === 0) {
          return false;
        }
        this.swapItems(
          this.tableData[this.parentIndex].childTemplate,
          this.tableTdIndex,
          this.tableTdIndex - 1
        );
      }
    },
    // 下移节点
    moveDownChild() {
      // 置底不让移动
      if (this.tableTdType === 10) {
        if (this.tableTdIndex === this.tableData.length - 1) {
          return false;
        }
        this.swapItems(
          this.tableData,
          this.tableTdIndex,
          this.tableTdIndex + 1
        );
      } else if (this.tableTdType === 20) {
        if (
          this.tableTdIndex ===
          this.tableData[this.parentIndex].childTemplate.length - 1
        ) {
          return false;
        }
        this.swapItems(
          this.tableData[this.parentIndex].childTemplate,
          this.tableTdIndex,
          this.tableTdIndex + 1
        );
      }
    },
    // 移动
    swapItems(arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    // 保存
    saveTable() {
      this.tableData.forEach((item) => {
        item.parentId = 0;
        item.childTemplate.forEach((val) => {
          val.type = 0;
        });
      });
      ADD_MAINTAIN_TEMPLATE(this.tableData).then(() => {
        this.$message({
          message: "保存成功",
          type: "success",
        });
        this.getTemplate();
      });
    },
    //  查询
    getTemplate() {
      GET_MAINTAIN_TEMPLATE().then((res) => {
        this.tableData = res.data;
      });
    },
  },
  created() {
    this.getTemplate();
  },
  mounted() {
    document.addEventListener("click", (e) => {
      if (e.target.className != "el-textarea__inner") {
        this.dialog = false;
      }
    });
    window.onclick = () => {
      var doc = document.getElementsByClassName("right_box");
      if (doc.length) {
        document.getElementsByClassName("right_box")[0].style.display = "none";
      }
    };
    window.onscroll = () => {
      var doc = document.getElementsByClassName("right_box");
      if (doc.length) {
        document.getElementsByClassName("right_box")[0].style.display = "none";
      }
    };
  },
};
</script>

<style scoped lang="scss">
::v-deep.main-content {
  .table-template {
    width: 1200px;
    margin: 18px auto;
    color: #606266;
    padding: 0 26px 39px;
    font-size: 14px;
    /*border: 2px solid #ebeef5;*/
    position: relative;
    .content-top {
      display: flex;
      padding: 15px 0;
      justify-content: space-between;
      color: #ef2606;
      span {
        margin-top: 8px;
      }
      i {
        font-size: 13px;
        margin-right: 6px;
      }
    }
    table {
      th {
        text-align: center;
        background: #ecf5ff;
        color: #515a6e;
      }
      td {
        width: 210px;
        text-align: center;
      }
      td.td-content {
        width: 990px;
        text-align: left;
      }
      th,
      td {
        border-top-width: 0;
        border-left-width: 0;
        border-right: 1px solid #b3d8ff;
        border-bottom: 1px solid #b3d8ff;
        line-height: 26px;
        position: relative;
      }
      tr:first-child th,
      tr:first-child td {
        border-top: 1px solid #b3d8ff;
      }
      th:first-child,
      th:nth-child(2),
      td:first-of-type {
        border-left: 1px solid #b3d8ff;
      }
      .td-form {
        font-size: 14px;
        width: 100%;
        height: 100%;
        overflow-y: hidden;
        textarea {
          resize: none;
        }
        select {
          &.el-textarea__inner {
            border-radius: 0;
            padding: 5px 0;
          }
        }
      }
      .td-text {
        padding: 0 30px;
      }
      .td-icon {
        /*display: none;*/
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        i {
          display: inline-block;
          margin-right: 4px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
        i.el-icon-circle-plus {
          color: #77da6d;
        }
        i.el-icon-error {
          color: #e97e62;
        }
      }
    }
    .right_box {
      position: fixed;
      width: 100px;
      background-color: white;
      display: none;
      box-shadow: 0 0 5px #f3f3f3;
      text-align: center;
      li {
        width: 100%;
        height: 40px;
        font-size: 12px;
        color: #606266;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          background-color: #f3f3f3;
        }
        &[disabled] {
          color: #606266;
          pointer-events: none;
        }
        &.disabled {
          cursor: no-drop;
          color: #cccccc;
        }
      }
    }
  }
}
</style>
