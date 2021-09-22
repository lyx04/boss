<template>
  <div class="container main-content">
    <div class="add-form">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        v-hasPermi="['system:area:add']"
        >新增</el-button
      >
    </div>
    <div class="h-table-content">
      <el-table
        :data="tableData"
        row-key="areaId"
        :tree-props="{ children: 'childs' }"
        style="width: 100%"
      >
        <el-table-column type="index" align="center" width="100" label="序号">
        </el-table-column>
        <el-table-column
          prop="areaName"
          label="区域名称"
          :show-overflow-tooltip="true"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="areaCode"
          label="区域Code"
          :show-overflow-tooltip="true"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          :show-overflow-tooltip="true"
          min-width="200"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          :show-overflow-tooltip="true"
          min-width="200"
        ></el-table-column>
        <el-table-column label="操作" align="center" min-width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:area:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:area:add']"
              v-if="scope.row.isChildren != 1"
              >新增</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:area:delete']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改菜单对话框 -->
    <modal
      :visible="open"
      customClass="customer-modal Miniform form-menu"
      @on-closed="cancel"
      width="600px"
    >
      <template slot="head">
        <span>{{ title }}</span>
      </template>
      <template slot="body">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="116px"
          size="small"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="上级区域：">
                <treeselect
                  :disabled="title == '修改区域'"
                  :clearable="false"
                  :editable="false"
                  noOptionsText="暂无区域"
                  noResultsText="暂无区域"
                  v-model="form.parentId"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择上级区域"
                  :style="title == '修改区域' ? 'cursor: no-drop;' : ''"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="区域名称：" prop="areaName">
                <el-input
                  v-model="form.areaName"
                  maxlength="20"
                  placeholder="请输入区域名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="区域Code：" prop="areaCode">
                <el-input
                  v-model="form.areaCode"
                  maxlength="6"
                  placeholder="请输入区域Code"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="显示排序：" prop="sort">
                <el-input-number
                  v-model="form.sort"
                  controls-position="right"
                  :min="1"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template slot="foot">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  NEW_AREA,
  GET_AREA_TREE,
  PUT_AREA,
  DELETE_AREA,
  GET_AREA_INFO,
} from "@/common/api/system/area";

export default {
  name: "area",
  data() {
    return {
      form: {},
      // 表单校验
      rules: {
        areaName: [
          { required: true, message: "区域名称不能为空", trigger: "blur" },
        ],
        areaCode: [
          { required: true, message: "区域Code不能为空", trigger: "blur" },
          { min: 6, max: 6, message: "长度必须6位", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "区域顺序不能为空", trigger: "blur" },
        ],
      },
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      menuOptions: [], //区域树选项
    };
  },
  components: { Treeselect, modal },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        areaId: undefined,
        parentId: 0,
        areaName: undefined,
        areaCode: undefined,
        sort: 1,
      };
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.areaId) {
        this.form.parentId = row.areaId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加区域";
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.areaId,
        label: node.areaName,
        children: node.children,
      };
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.areaId != undefined) {
            PUT_AREA(this.form).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.cancel();
              this.getAreaTree();
            });
          } else {
            NEW_AREA(this.form).then(() => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.cancel();
              this.getAreaTree();
            });
          }
        }
      });
    },
    treeListToList(treeList) {
      // 将树结构的列表转换为普通列表
      let list = [];
      this.handleTreeList(treeList, list);
      return list;
    },
    handleTreeList(treeList, list) {
      if (!treeList || !treeList.length) {
        return;
      }
      for (let i = 0; i < treeList.length; i++) {
        let currentRow = treeList[i];
        let newRow = JSON.parse(JSON.stringify(currentRow));
        newRow.childs = undefined;
        list.push(newRow);
        this.handleTreeList(currentRow.childs, list);
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      GET_AREA_TREE().then((res) => {
        this.menuOptions = [];
        res.data.forEach((item) => {
          item.childs.forEach((val) => {
            val.childs.forEach((child) => {
              child.isDisabled = true;
            });
          });
        });
        const menu = { areaId: 0, areaName: "全国", children: [] };
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].parentId) {
            res.data[i].parentId = 0;
          }
        }
        menu.children = this.handleTree(
          this.treeListToList(res.data),
          "areaId"
        );
        this.menuOptions.push(menu);
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      GET_AREA_INFO(row.areaId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改区域";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除该区域吗？",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_AREA(row.areaId).then(() => {
            this.getAreaTree();
            this.$message({
              message: "删除成功",
              type: "success",
            });
          });
        })
        .catch(() => {});
    },
    //  查询列表
    getAreaTree() {
      this.tableData = [];
      GET_AREA_TREE().then((res) => {
        res.data.forEach((item) => {
          item.childs.forEach((val) => {
            val.childs.forEach((child) => {
              child.isChildren = 1;
            });
          });
        });
        this.tableData = res.data;
      });
    },
  },
  created() {
    this.getAreaTree();
  },
};
</script>

<style scoped lang="scss">
.add-form {
  margin-bottom: 12px;
}
</style>
