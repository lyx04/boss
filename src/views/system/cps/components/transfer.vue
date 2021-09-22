<template>
  <div class="modal">
    <!--选择量测量-->
    <modal
      customClass="Maxform"
      :visible="visible"
      @on-closed="dialogVisibleMeasureClosed"
    >
      <template slot="head">
        <template>选择量测量</template>
      </template>
      <template slot="body">
        <el-transfer
          :titles="['选择量测量', '选择量测量']"
          :props="transfer.props"
          filterable
          :filter-placeholder="输入量测量搜索"
          v-model="transfer.value"
          :data="transfer.data"
        >
        </el-transfer>
      </template>
      <template slot="foot">
        <el-button @click="dialogVisibleMeasureClosed">取消</el-button>
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
import { GET_EMA_MPARAM_LIST } from "@/common/api/config/measure";
// import { GET_SYSTEM_ORG_LIST } from "@/common/api/system/organization";
export default {
  components: { modal },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      transfer: {
        data: [],
        value: [],
        props: {
          key: "id",
          label: "name",
        },
      },
    };
  },
  methods: {
    initData() {
      this.transfer.props.key = "id";
      GET_EMA_MPARAM_LIST().then((e) => {
        this.transfer.data = e.rows;
      });
    },
    //关闭选择框
    dialogVisibleMeasureClosed() {
      this.$emit("on-closed");
    },
    //穿梭框的确认
    measureSubmit() {
      var dataArray = this.transfer.data.filter((i) => {
        return this.transfer.value.indexOf(i.id) >= 0;
      });
      var arr = [];
      dataArray.forEach((item) => {
        var o = {};
        o.name = item.name;
        o.label = item.labels;
        arr.push(o);
      });
      this.$emit("submit-measure", arr);
      this.dialogVisibleMeasureClosed();
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
