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
        <el-form-item label="应用名称:" prop="menuName">
          <el-input
            v-model.trim="requestMenu.menuName"
            clearable
            placeholder="请输入应用名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="显示状态:" prop="visible">
          <el-select
            v-model="requestMenu.visible"
            clearable
            placeholder="请选择显示状态"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="显示" value="0"></el-option>
            <el-option label="隐藏" value="1"></el-option>
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
        >新增</el-button
      >
    </div>
    <div class="h-table-content">
      <el-table :data="tableData" row-key="menuId" style="width: 100%">
        <el-table-column
          prop="menuName"
          label="应用名称"
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
          prop="component"
          label="组件路径"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column label="状态" width="80">
          <template slot-scope="scope">
            {{ scope.row.status === "0" ? "正常" : "停用" }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              >新增</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加或修改应用对话框 -->
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
          label-width="150px"
          size="small"
        >
          <el-row>
            <el-col :span="20">
              <el-form-item label="上级应用：" prop="parentId">
                <treeselect
                  :clearable="false"
                  :editable="false"
                  noOptionsText="暂无应用"
                  noResultsText="暂无应用"
                  v-model="form.parentId"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  :show-count="true"
                  placeholder="选择上级应用"
                  :style="title == '修改应用' ? 'cursor: no-drop;' : ''"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="应用类型：" prop="menuType">
                <el-radio-group v-model="form.menuType">
                  <el-radio label="M">目录</el-radio>
                  <el-radio label="C">应用</el-radio>
                  <el-radio label="F">按钮</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="项目类型：" prop="businessType">
                <el-select
                  v-model="form.businessType"
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
              <el-form-item label="应用名称：" prop="menuName">
                <el-input
                  v-model.trim="form.menuName"
                  placeholder="请输入应用名称"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="显示排序：" prop="orderNum">
                <el-input-number
                  v-model="form.orderNum"
                  controls-position="right"
                  :min="1"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="form.menuType == 'M'">
              <el-form-item label="目录类型：" prop="mtype">
                <el-select v-model="form.mtype" placeholder="请选择目录类型">
                  <el-option label="首页" value="10"> </el-option>
                  <el-option label="非首页" value="20"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item label="H5是否有标题栏：" prop="h5Title">
                <el-radio-group v-model="form.h5Title">
                  <el-radio label="1">是</el-radio>
                  <el-radio label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="form.menuType != 'F'">
              <el-form-item label="是否外链：" prop="isFrame">
                <el-radio-group v-model="form.isFrame">
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
              <el-form-item
                v-if="form.menuType != 'M'"
                label="权限标识："
                prop="perms"
              >
                <el-input
                  v-model.trim="form.perms"
                  placeholder="请权限标识"
                  maxlength="50"
                />
              </el-form-item>
            </el-col>
            <el-col :span="20">
              <el-form-item
                v-if="form.menuType != 'F'"
                label="显示状态："
                prop="visible"
              >
                <el-radio-group v-model="form.visible">
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
              <el-form-item
                v-if="form.menuType != 'F'"
                label="应用状态："
                prop="status"
              >
                <el-radio-group v-model="form.status">
                  <el-radio
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictValue"
                    >{{ dict.dictLabel }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="20" v-if="form.menuType == 'C'">
              <el-form-item label="icon：" prop="icon">
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :action="customize"
                  :on-change="handleChange"
                  :http-request="uploadFile"
                  :show-file-list="false"
                  accept="image/*"
                >
                  <el-image
                    style="width: 80px; height: 80px"
                    v-if="form.icon"
                    :src="form.icon"
                    fit="cover"
                  ></el-image>
                  <el-button v-else>上传按钮</el-button>
                </el-upload>
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
  GET_APPINFO_MENU_LIST,
  ADD_APPINFO_EDITOR_SYSTEM_MENU,
  GET_APPINFO_SYSTEM_MENU,
  DELETE_APPINFO_SYSTEM_MENU,
  GET_APPINFO_MENU_TREESELECT,
} from "@/common/api/config/appMenu";
import { uploadFile } from "@/common/api/file";
import { mapState } from "vuex";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import modal from "@/common/components/Modal";
export default {
  name: "appMenu",
  data() {
    return {
      requestMenu: {
        menuName: "",
        visible: "",
      },
      tableData: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      menuOptions: [], //应用树选项
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
      // 应用状态数据字典
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
      customize: "", // 上传地址，自定义上传为空
      // 表单校验
      rules: {
        businessType: [
          { required: true, message: "请选择业务类型", trigger: "change" },
        ],
        menuName: [
          { required: true, message: "应用名称不能为空", trigger: "blur" },
        ],
        orderNum: [
          { required: true, message: "应用顺序不能为空", trigger: "blur" },
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
        ],
      },
      dialogVisibleDeleteMenu: false, // 删除应用弹框
    };
  },
  computed: {
    ...mapState(["dict"]),
  },
  components: { Treeselect, modal },
  methods: {
    //  获取应用下拉列表
    getMenuList() {
      this.tableData = [];
      GET_APPINFO_MENU_LIST(this.requestMenu).then((res) => {
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
    /** 转换应用数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    change() {
      this.$forceUpdate();
    },
    // 自定义上传
    uploadFile(params) {
      const isLt8M = params.file.size / 1024 / 1024 < 8;
      if (params.file.type.indexOf("image/") === -1) {
        this.$message.error("上传图片只能是gif,jpeg,jpg,png,bmp 格式!");
        return false;
      }
      if (!isLt8M) {
        this.$message.error("上传图片大小不能超过 8MB!");
        return false;
      }
      let fd = new FormData();
      fd.append("file", params.file);
      fd.append("bucket", "sysconfig");
      uploadFile(fd).then((res) => {
        this.form.icon = res.data;
      });
    },
    handleChange(file) {
      this.form.icon = file;
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
            ADD_APPINFO_EDITOR_SYSTEM_MENU("put", this.form).then(() => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.open = false;
              this.getMenuList();
            });
          } else {
            ADD_APPINFO_EDITOR_SYSTEM_MENU("post", this.form).then(() => {
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
        h5Title: "1",
        mtype: "10",
      };
      this.resetForm("form");
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
    /** 查询应用下拉树结构 */
    getTreeselect() {
      GET_APPINFO_MENU_TREESELECT().then((res) => {
        this.menuOptions = [];
        res.data.forEach((item) => {
          if (item.children && item.children.length > 0) {
            item.children.forEach((val) => {
              if (val.children && val.children.length > 0) {
                val.children.forEach((child) => {
                  child.isDisabled = true;
                });
              }
            });
          }
        });
        const menu = { id: 0, label: "主类目", children: [] };
        for (let i = 0; i < res.data.length; i++) {
          if (!res.data[i].parentId) {
            res.data[i].parentId = 0;
          }
        }
        menu.children = this.handleTree(this.treeListToList(res.data), "id");
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
      this.title = "添加应用";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      GET_APPINFO_SYSTEM_MENU(row.menuId).then((response) => {
        this.form = response.data;
        this.form.businessType =
          response.data.businessType &&
          response.data.businessType.split(",").length > 0
            ? response.data.businessType.split(",")
            : "";
        this.open = true;
        this.title = "修改应用";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$msgbox({
        title: "",
        customClass: "iconmes",
        message: "确定要删除该应用吗？",
        showCancelButton: true,
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "error",
        iconClass: "iconfont icon-huishou",
        closeOnClickModal: false,
        closeOnPressEscape: false,
      })
        .then(() => {
          DELETE_APPINFO_SYSTEM_MENU(row.menuId).then(() => {
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
