<template>
  <div class="g-paging" v-if="total > pageSize">
    <div class="paging clearfix">
      <div class="page-size">共{{ total }}条</div>
      <ul class="page-list clearfix">
        <li
          @click="changePage(currentPage - 1)"
          :style="currentPage == 1 ? 'cursor:no-drop;' : 'cursor: pointer;'"
        >
          <i class="el-icon-arrow-left"></i>
        </li>
        <li
          :class="{ active: currentPage == item.val }"
          v-for="item in pagelist"
          :key="item.text"
          v-text="item.text"
          @click="changePage(item.val)"
        >
          1
        </li>
        <li
          @click="changePage(currentPage + 1)"
          :style="
            currentPage == Math.ceil(Number(total) / Number(pageSize))
              ? 'cursor:no-drop;'
              : 'cursor: pointer;'
          "
        >
          <i class="el-icon-arrow-right"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "Paging",
  props: {
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    layout: {
      type: String
    }
  },
  data() {
    return {
      isShowJumper: false,
      isShowTotal: false,
      toPage: "", //跳转到x页
      pageGroup: 10 //可见分页数量 默认10个分页数
    };
  },
  created: function() {
    this.isShowTotal = this.layout.indexOf("total") !== -1;
    this.isShowJumper = this.layout.indexOf("jumper") !== -1;
  },
  computed: {
    totalPage: function() {
      return Math.ceil(this.total / this.pageSize);
    },
    pagelist: function() {
      var list = [];
      var count = Math.floor(this.pageGroup / 2);
      var left = 1,
        right = this.totalPage;

      if (this.totalPage > this.pageGroup) {
        if (this.currentPage > count + 1) {
          if (this.currentPage < this.totalPage - count) {
            left = this.currentPage - count;
            right = this.currentPage + count - 1;
          } else {
            left = this.totalPage - this.pageGroup + 1;
          }
        } else {
          right = this.pageGroup;
        }
      }

      // 遍历添加到数组里
      while (left <= right) {
        list.push({
          text: left,
          val: left
        });
        left++;
      }
      return list;
    }
  },
  methods: {
    changePage: function(idx) {
      if (idx != this.currentPage && idx > 0 && idx <= this.totalPage) {
        // 触发父组件事件  pageChange会转换成小写pagechange
        this.$emit("change", idx);
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.g-paging {
  clear: both;
  .paging {
    float: right;
    padding-bottom: 20px;
    &:after {
      display: block;
      content: "";
      clear: both;
    }
    .page-size {
      display: inline-block;
      min-width: 35.5px;
      height: 28px;
      line-height: 28px;
      vertical-align: top;
      box-sizing: border-box;
      color: #0ce5ef;
      font-size: 16px;
      margin-right: 10px;
      font-weight: 400;
    }
    ul {
      display: inline-block;
    }
    ul li {
      min-width: 34px;
      min-height: 30px;
      border: 1px solid #0ceaf3;
      border-radius: 3px;
      background-color: transparent;
      color: #0ceaf3;
      margin: 0 5px;
      padding: 0 4px;
      font-size: 13px;
      height: 28px;
      line-height: 28px;
      box-sizing: border-box;
      text-align: center;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
    }
    ul > li.active {
      background-color: #0ceaf3;
      color: white;
    }
  }
}
</style>
