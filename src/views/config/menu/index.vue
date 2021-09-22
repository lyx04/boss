<template>
  <div class="container main-content">
    <!--role筛选-->
    <div class="role-screening">
      <el-form
        :model="requestMenu"
        ref="requestMenu"
        label-width="80px"
        :inline="true"
        size="small"
      >
        <el-form-item label="菜单名称:" prop="menuName">
          <el-input
            v-model.trim="requestMenu.menuName"
            clearable
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select
            v-model.trim="requestMenu.status"
            clearable
            placeholder="请选择菜单状态"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getMenuList" size="mini"
            >查询</el-button
          ><el-button @click="resetQuery" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-form">
      <el-button
        type="primary"
        plain
        icon="el-icon-plus"
        size="mini"
        @click="handleAdd"
        v-hasPermi="['system:menu:add']"
        >新增</el-button
      >
    </div>
    <div class="h-table-content">
      <el-table :data="tableData" row-key="menuId" style="width: 100%">
        <el-table-column
          prop="menuName"
          label="菜单名称"
          :show-overflow-tooltip="true"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          width="60"
        ></el-table-column>
        <el-table-column
          align="center"
          prop="businessType"
          label="项目类型"
          width="150"
          :show-overflow-tooltip="true"
          :formatter="businessTypeFormatter"
        >
        </el-table-column>
        <el-table-column
          prop="perms"
          label="权限标识"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="path"
          label="路由地址"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="菜单类型" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.menuType == 'M'">目录</span>
            <span v-if="scope.row.menuType == 'C'">菜单</span>
            <span v-if="scope.row.menuType == 'F'">按钮</span>
          </template>
        </el-table-column>
        <el-table-column label="显示状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.visible === "0" ? "显示" : "隐藏" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status === "0" ? "正常" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          width="160"
          prop="createTime"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="170"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['system:menu:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:menu:add']"
              >新增</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:menu:remove']"
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
              <el-form-item label="上级菜单：">
                <treeselect
                  :clearable="false"
                  :editable="false"
                  noOptionsText="暂无菜单"
                  noResultsText="暂无菜单"
                  v-model.trim="form.parentId"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择上级菜单"
                  :style="title == '修改菜单' ? 'cursor: no-drop;' : ''"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="菜单类型：" prop="menuType">
                <el-radio-group v-model.trim="form.menuType">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">菜单</el-radio>
                  <el-radio label="F">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="项目类型：" prop="businessType">
                <el-select
                  v-model.trim="form.businessType"
                  placeholder="请选择项目类型"
                  multiple
                  collapse-tags
                  @change="change"
                >
                  <el-option
                    v-for="item in dict.business_events_type"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="菜单名称：" prop="menuName">
                <el-input
                  v-model.trim="form.menuName"
                  placeholder="请输入菜单名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="显示排序：" prop="orderNum">
                <el-input-number
                  v-model.trim="form.orderNum"
                  controls-position="right"
                  :min="1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="form.menuType != 'F'">
              <el-form-item label="是否外链：">
                <el-radio-group v-model.trim="form.isFrame">
                  <el-radio label="0">是</el-radio>
                  <el-radio label="1">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="form.menuType == 'C'">
              <el-form-item label="路由地址：" prop="path">
                <el-input
                  v-model.trim="form.path"
                  placeholder="请输入路由地址"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="form.menuType == 'C'">
              <el-form-item label="组件路径：" prop="component">
                <el-input
                  v-model.trim="form.component"
                  placeholder="请输入组件路径"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item v-if="form.menuType != 'M'" label="权限标识：">
                <el-input
                  v-model.trim="form.perms"
                  placeholder="请权限标识"
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item v-if="form.menuType != 'F'" label="显示状态：">
                <el-radio-group v-model.trim="form.visible">
                  <el-radio
                    v-for="dict in visibleOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                    >{{ dict.dictLabel }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item v-if="form.menuType != 'F'" label="菜单状态：">
                <el-radio-group v-model.trim="form.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                    >{{ dict.dictLabel }}</el-radio
                  >
                </el-radio-group>
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
import {
  GET_MENU_LIST,
  ADD_EDITOR_SYSTEM_MENU,
  GET_SYSTEM_MENU,
  DELETE_SYSTEM_MENU,
} from "@/common/api/config/menu";
import { mapState } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import modal from "@/common/components/Modal";
export default {
  name: "menu",
  data() {
    return {
      requestMenu: {
        menuName: "",
        status: "",
      },
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      menuOptions: [], //菜单树选项
      // 显示状态数据字典
      visibleOptions: [
        {
          dictLabel: "显示",
          dictValue: "0",
        },
        {
          dictLabel: "隐藏",
          dictValue: "1",
        },
      ],
      // 菜单状态数据字典
      statusOptions: [
        {
          dictLabel: "正常",
          dictValue: "0",
        },
        {
          dictLabel: "停用",
          dictValue: "1",
        },
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        businessType: [
          { required: true, message: "请选择项目类型", trigger: "change" },
        ],
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapState(["dict"]),
  },
  components: { Treeselect, modal },
  methods: {
    //  获取菜单下拉列表
    getMenuList() {
      GET_MENU_LIST(this.requestMenu).then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].parentId) {
            res.data[i].parentId = 0;
          }
        }
        let datalist = this.handleTree(res.data, "menuId");
        datalist.sort(this.compare).forEach((a) => {
          a.children.sort(this.compare).forEach((b) => {
            b.children.sort(this.compare);
          });
        });
        this.tableData = datalist;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("requestMenu");
      this.getMenuList();
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children,
      };
    },
    change() {
      this.$forceUpdate();
    },
    businessTypeFormatter(row) {
      if (row.businessType) {
        let dictLabel = "";
        let array = [];
        row.businessType.split(",").forEach((val) => {
          this.dict.business_events_type.forEach((item) => {
            if (item.dictValue == val) {
              array.push(item.dictLabel);
              dictLabel = array.toString();
            }
          });
        });
        return dictLabel;
      } else {
        return "--";
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.businessType = this.form.businessType.toString();
          if (this.form.menuId != undefined) {
            ADD_EDITOR_SYSTEM_MENU("put", this.form).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.open = false;
              this.getMenuList();
            });
          } else {
            ADD_EDITOR_SYSTEM_MENU("post", this.form).then(() => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.open = false;
              this.getMenuList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        businessType: [],
        menuType: "M",
        orderNum: 1,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0",
      };
      this.resetForm("form");
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      GET_MENU_LIST().then((res) => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: "主类目", children: [] };
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].parentId) {
            res.data[i].parentId = 0;
          }
        }
        menu.children = this.handleTree(res.data, "menuId");
        this.menuOptions.push(menu);
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      GET_SYSTEM_MENU(row.menuId).then((response) => {
        this.form = response.data;
        this.form.businessType =
          response.data.businessType &&
          response.data.businessType.split(",").length > 0
            ? response.data.businessType.split(",")
            : "";
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除该菜单吗？",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_SYSTEM_MENU(row.menuId).then(() => {
            this.getMenuList();
            this.$message({
              message: "删除成功",
              type: "success",
            });
          });
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.getMenuList();
    this.getTreeselect();
  },
};
</script>

<style scoped lang="scss">
.main-content {
  .add-form {
    margin-left: 8px;
    margin-bottom: 12px;
  }
  .h-table-content {
    margin-left: 8px;
  }
}
</style>
