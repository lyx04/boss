<template>
  <modal
    :visible="dialogVisibleGetRole"
    customClass="customer-modal Miniform"
    @on-closed="dialogVisibleGetRoleClosed"
  >
    <template slot="head">
      <span>查看角色</span>
    </template>
    <template slot="body">
      <div class="customer-modal-body">
        <div class="customer-modal-body-list">
          <div class="customer-modal-body-label">角色名称：</div>
          <div class="customer-modal-body-content">
            {{ ruleForm.roleName }}
          </div>
        </div>
        <div class="customer-modal-body-list">
          <div class="customer-modal-body-label">所属客户：</div>
          <div class="customer-modal-body-content">
            {{ ruleForm.orgId | orgFilter(that) }}
          </div>
        </div>
        <div class="customer-modal-body-list">
          <div class="customer-modal-body-label">角色范围：</div>
          <div class="customer-modal-body-content">
            {{ ruleForm.dataScope | scopeFilter(that) }}
          </div>
        </div>
        <div class="customer-modal-body-list">
          <div class="customer-modal-body-label">角色排序：</div>
          <div class="customer-modal-body-content">
            {{ ruleForm.roleSort }}
          </div>
        </div>
        <div class="customer-modal-body-list">
          <div class="customer-modal-body-label">PC端角色权限：</div>
          <div class="customer-modal-body-content">
            <el-tree
              :data="treeData"
              :props="props"
              node-key="id"
              ref="dept"
              show-checkbox
              :default-checked-keys="ruleForm.menuIds"
              empty-text="加载中，请稍后"
            >
              <span
                class="custom-tree-node"
                :id="data.id"
                slot-scope="{ node, data }"
              >
                <span class="custom-tree-node-item-content" :title="data.label"
                  >{{ data.label
                  }}<i
                    style="font-size: 12px; margin-left: 4px"
                    v-if="data.type"
                    >({{ data.type | businessEventsTypeFilter(that) }})</i
                  ></span
                >
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </template>
    <template slot="foot">
      <el-button @click="dialogVisibleGetRoleClosed">取消</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";
import { GET_SYSTEM_ROLE_ID } from "@/common/api/system/role";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";
import {
  GET_MENU_ROLE_TREESELECT,
  GET_MENU_TREESELECT,
} from "@/common/api/system/menu";
import { mapState } from "vuex";

export default {
  name: "RoleModal",
  props: {
    dialogVisibleGetRole: {
      type: Boolean,
    },
    row: {
      type: Object,
    },
    scopeList: {
      type: Array,
    },
  },
  components: {
    modal,
  },
  data() {
    return {
      that: this,
      ruleForm: {},
      props: {
        label: "label",
        children: "children",
      },
      treeData: [], // 树结构
      orgList: [], // 所属客户列表
    };
  },
  filters: {
    orgFilter: function (val, that) {
      for (let i in that.orgList) {
        if (val == that.orgList[i].orgId) {
          return that.orgList[i].name;
        }
      }
    },
    roleTypeFilter: function (val, that) {
      for (let i in that.roleTypeList) {
        if (val == that.roleTypeList[i].value) {
          return that.roleTypeList[i].label;
        }
      }
    },
    scopeFilter: function (val, that) {
      for (let i in that.scopeList) {
        if (val == that.scopeList[i].dictValue) {
          return that.scopeList[i].dictLabel;
        }
      }
    },
    typeFilter: function (val, that) {
      if (
        that.dict.business_events_type &&
        that.dict.business_events_type.length > 0
      ) {
        for (let i in that.dict.business_events_type) {
          if (val == that.dict.business_events_type[i].dictValue) {
            return that.dict.business_events_type[i].dictLabel;
          }
        }
      }
    },
    businessEventsTypeFilter: function (val, that) {
      if (val && val.split(",").length > 0) {
        var array = [];
        val.split(",").forEach((item) => {
          that.dict.business_events_type.forEach((i) => {
            if (item == i.dictValue) {
              array.push(i.dictLabel);
            }
          });
        });
        return array.toString();
      } else {
        return "--";
      }
    },
  },
  computed: {
    ...mapState(["dict"]),
    roleId: function () {
      if (this.row.roleId) {
        this.getRoleId(this.row.roleId);
      }
      return 1;
    },
  },
  methods: {
    // 关闭弹框
    dialogVisibleGetRoleClosed() {
      this.$emit("on-closed");
    },
    dealTreeOnceChecked: function (arrMenus) {
      arrMenus === undefined ? (arrMenus = []) : "";
      if (arrMenus.length > 0) {
        arrMenus.forEach((item) => {
          if (item.children && item.children.length > 0) {
            this.dealTreeOnceChecked(item.children);
          }
          item.disabled = true;
        });
      }
      return arrMenus;
    },
    // 选择用电企业出权限
    orgChange(val) {
      var orgData = this.orgList.filter((item) => {
        return item.orgId == val;
      });
      var data = {
        businessType: "",
      };
      if (orgData.length > 0 && orgData[0].businessEventsType) {
        data = {
          businessType: orgData[0].businessEventsType,
        };
      }
      // pc查询端树
      GET_MENU_TREESELECT(data).then((res) => {
        this.treeData = this.R(res.data, true);
      });
    },
    // 查询角色id
    getRoleId(roleId) {
      GET_SYSTEM_ROLE_ID(roleId).then((res) => {
        this.ruleForm = res.data;
        this.orgChange(res.data.orgId);
        GET_MENU_ROLE_TREESELECT(roleId).then((res) => {
          this.ruleForm.menuIds = res.data.checkedKeys;
          // this.treeData = this.dealTreeOnceChecked(res.data.menus);
        });
      });
      GET_SYSTEM_ORG_LIST().then((res) => {
        this.orgList = res.data;
      });
    },
    G(i, bool) {
      // 第一级
      if (i._disabled === undefined) {
        i._disabled = i.disabled === undefined ? false : i.disabled;
      }
      i.disabled = bool;
      // 如果有子级
      if (i.children && i.children != undefined) {
        this.R(i.children, bool);
      }

      return i;
    },
    R(s, bool) {
      return s.map((i) => {
        return this.G(i, bool);
      });
    },
  },
  watch: {
    roleId: function (val) {
      if (val) {
        // this.getOneUserInfoByUseIdAndRoleId()
      }
    },
  },
  created() {},
};
</script>

<style scoped lang="scss">
.customer-modal {
  .customer-modal-body {
    padding: 0 11px;
    min-height: 380px;
    .customer-modal-body-list {
      padding: 0 19px;
      display: flex;
      font-size: 12px;
      line-height: 31px;
      .customer-modal-body-label {
        min-width: 54px;
      }
      .customer-modal-body-content {
        margin-left: 9px;
        .el-button {
          margin-left: 6px;
        }
      }
    }
  }
}
::v-deep.el-tree {
  background: transparent;
  width: max-content;
  .el-tree-node {
    position: relative;
  }
  .is-current,
  .is-checkedis-current {
    background: transparent;
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
    }
    .el-tree-node__expand-icon {
      color: #97b5cf;
      &.is-leaf {
        color: transparent;
      }
    }
  }
}
</style>
