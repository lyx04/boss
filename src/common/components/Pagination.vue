<!--
   <common-page
      :pageSize="1"
      :total="100"
      @handleCurrent="current"
    ></common-page>

-->
<template>
  <div class="pagination-container">
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :current-page.sync="currentPage1"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      :hide-on-single-page="hidePage"
      :background="true"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  props: {
    pageSize: Number,
    total: Number,
    currentPage1: {
      default: 1,
      type: Number,
    },
    hidePage: {
      default: true,
      type: Boolean,
    },
    pageNum: {
      default: 1,
      type: Number,
    },
    layout: {
      type: String,
      default: "->,total,sizes,prev,pager,next",
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit("handleCurrent", val);
    },
    handleSizeChange(val) {
      this.$emit("size-change", val);
    },
  },
};
</script>
<style scoped lang="scss"></style>
