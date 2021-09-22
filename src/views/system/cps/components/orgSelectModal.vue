<template>
  <div class="modal">
    <!--选择企业-->
    <modal
      customClass="Maxform"
      :visible="dialogVisibleorgSelect"
      @on-closed="dialogVisibleorgSelectClosed"
    >
      <template slot="head">
        <template>选择企业</template>
      </template>
      <template slot="body">
        <el-transfer
          :titles="['选择企业', '选择企业']"
          :props="transfer.props"
          filterable
          :filter-placeholder="输入企业搜索"
          v-model="transfer.value"
          :data="transfer.data"
        >
        </el-transfer>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleorgSelectClosed">取消</el-button>
        <el-button
          type="primary"
          :disabled="!transfer.value.length"
          @click="measureSubmit"
          >确认</el-button
        >
      </template>
    </modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import { GET_SYSTEM_ORG_LIST } from "@/common/api/web/organization";
export default {
  components: { modal },
  props: {
    dialogVisibleorgSelect: Boolean,
  },
  data() {
    return {
      transfer: {
        data: [],
        value: [],
        props: {
          key: "orgId",
          label: "name",
        },
      },
    };
  },
  methods: {
    initData() {
      GET_SYSTEM_ORG_LIST({ queryFlag: 1 }).then((e) => {
        this.transfer.data = e.data;
      });
    },
    //关闭选择框
    dialogVisibleorgSelectClosed() {
      this.$emit("on-closed");
    },
    //穿梭框的确认
    measureSubmit() {
      var dataArray = this.transfer.data.filter((i) => {
        return this.transfer.value.indexOf(i.orgId) >= 0;
      });
      var arr = [];
      dataArray.forEach((item) => {
        var o = {};
        o.name = item.name;
        o.orgId = item.orgId;
        arr.push(o);
      });
      this.$emit("submit-orgSelect", arr);
      this.dialogVisibleorgSelectClosed();
    },
  },
  mounted() {
    this.initData();
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  min-height: 0;
}
::v-deep .el-dialog__body {
  height: auto;
  .el-transfer-panel {
    width: 280px;
    .el-transfer-panel__body {
      height: 300px;
      .el-transfer-panel__list.is-filterable {
        height: 250px;
      }
    }
  }
}
.el-transfer {
  text-align: center;
  ::v-deep .el-transfer-panel {
    text-align: left;
    background-color: transparent;
    .el-transfer-panel__header {
      // color: white;
      background-color: transparent;
    }
    .el-checkbox {
      .el-checkbox__label {
        // color: white;
        span {
          // color: white;
        }
      }
      &.is-checked {
        .el-checkbox__label {
          color: #409eff;
        }
      }
    }
  }
}
</style>
