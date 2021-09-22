<!--公共的modal modal-->

<!--
element-ui dialog slot
title, Dialog 标题区的内容
footer, Dialog 按钮操作区的内容
—, Dialog 的内容
-->

<!--
modal slot
head, modal 标题区的内容&ndash;&gt;
body, modal 的内容
foot, modal 按钮操作区的内容
customClass mesfont:文字的弹框
            <template slot="body">
              <div class="mes">
                <p>尚未保存，确认关闭么？</p>
              </div>
            </template>
------------------------------------------------------------------------
            iconmes:带图标的弹框 
              <template slot="body">
               <div class="Icon">
                <div class="iconbk error">
                  <i class="icon-huishou"></i>
                  <i class="icon-chenggong"></i>
                </div>
                <p>添加客户成功</p>
                <span>请在客户管理下进行客户管理账号添加</span>
               </div>
              </template>
-----------------------------------------------------------------------
             Miniform/Maxform:较小的表单弹框/宽度为800带表单的弹窗
               <template slot="head">
                <span>修改密码</span>
              </template>
              <template slot="body">
                <el-form :rules="rules" :model="form" label-width="120px">
                  <el-form-item label="原密码:" prop="name">
                    <el-input type="password" v-model="form.name"> </el-input>
                    <i class="icon-yanjing iconfont"></i>
                  </el-form-item>
                  <el-form-item label="上级部门:">
                    <el-select v-model="form.region" placeholder="请选择活动区域">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="状态:">
                    <el-radio-group v-model="form.resource">
                      <el-radio label="启用"></el-radio>
                      <el-radio label="禁用"></el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </template>
              <template slot="foot">
                <el-button>确认</el-button>
                <el-button type="primary">取消</el-button>
                <el-button type="danger">删除</el-button>
              </template>
-->
<template>
  <el-dialog
    :custom-class="customClass"
    :visible="isShown"
    :close-on-click-modal="false"
    :append-to-body="false"
    :close-on-press-escape="closeOnPressEscape"
    :size="size"
    :modal="needModal"
    :show-close="showClose"
    :destroy-on-close="destroyOnClose"
    :width="width"
    :class="{
      'el-dialog--xxlarge': size === 'xxlarge',
      'el-dialog--xlarge': size === 'xlarge',
      'el-dialog--large': size === 'large',
      'el-dialog--xsmall': size === 'xsmall',
    }"
    @close="close"
    @open="open"
  >
    <template slot="title">
      <slot name="head"></slot>
    </template>

    <slot name="body"></slot>

    <template slot="footer">
      <slot name="foot"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "customModal",
  props: {
    visible: Boolean,
    title: String,
    onClosed: Function,
    onOpen: Function,
    size: {
      default: "small",
      type: String,
    },
    width: {
      default: "30%",
      type: String,
    },
    closeOnPressEscape: {
      default: true,
      type: Boolean,
    },
    customClass: {
      default: "custom-dialog",
      type: String,
    },
    showClose: {
      default: true,
      type: Boolean,
    },
    destroyOnClose: {
      default: true,
      type: Boolean,
    },
    needModal: { default: true },
  },

  data() {
    return {
      // isShown: this.visible
    };
  },

  computed: {
    isShown() {
      return this.visible;
    },
  },

  mounted() {},

  methods: {
    close() {
      this.$emit("on-closed");
    },
    open() {
      this.$emit("onOpen");
    },
  },
};
</script>

<style lang="scss">
.el-dialog {
  bottom: 0;
  /*margin: auto !important;*/
  /*margin-top: 15vh;*/
  i {
    font-family: "iconfont";
  }
  .el-dialog__headerbtn {
    i {
      font-size: 13px;
    }
  }
  .el-dialog__body {
    // text-align: center;
    padding: 0;
    .el-form-item__label {
      &::before {
        color: #d81e06 !important ;
      }
    }
  }
  .el-dialog__footer {
    text-align: center;
    padding: 0;
    .el-button {
      width: 70px;
      height: 30px;
      vertical-align: top;
      padding: 0;
      border-radius: 0;
      &.el-button--danger {
        background-color: #d81e06;
        border-color: #d81e06;
      }
      span {
        font-size: 10px;
      }
    }
  }
}
//带icon的弹框
.iconmes {
  width: 380px;
  height: 270px;
  .el-dialog__body {
    padding-top: 10px;
    .Icon {
      margin-bottom: 50px;
      .iconbk {
        width: 50px;
        height: 50px;
        margin: 0 auto;
        margin-bottom: 25px;
        border-radius: 50%;
        text-align: center;
        line-height: 50px;
        i {
          display: inline-block;
          font-size: 35px;
          line-height: 36px;
        }
      }

      p {
        font-size: 20px;
        margin-bottom: 12px;
        text-align: center;
      }
      span {
        display: block;
        font-size: 14px;
        text-align: center;
      }
    }
  }
}
.el-dialog {
  .el-button--default {
    /*margin-left: 10px !important;*/
  }
}
//只有信息的icon弹框
.mesfont {
  width: 380px;
  height: 170px;
  .el-dialog__body {
    padding-top: 10px;
    text-align: center;
    .mes {
      padding: 0 10px;
      margin-bottom: 30px;
      p {
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 1.4;
        overflow: hidden;
        font-size: 20px;
      }
    }
  }
}

//小表单的弹框
.Miniform {
  width: 450px !important;
  min-height: 233px;
  .el-dialog__header {
    width: 100%;
    position: relative;
    padding: 11px 20px 9px;
    background-color: #fafafa;
    /*border-bottom: 1px solid #dcdfe6;*/
    font-size: 12px;
    color: #606266;
    .el-dialog__headerbtn {
      top: 50%;
      right: 7px;
      margin-top: -10px;
    }
  }
  .el-dialog__body {
    text-align: left;
    padding: 20px 25px;
    max-height: 420px;
    overflow-y: auto;
    .el-form {
      .el-form-item {
        margin-bottom: 16px;
      }
    }
  }
  .el-dialog__footer {
    padding: 10px 0;
  }
}
//大表单的弹框
.Maxform {
  width: 800px !important;
  min-height: 500px;
  .el-dialog__header {
    width: 100%;
    position: relative;
    padding: 11px 20px 9px;
    background-color: #fafafa;
    font-size: 12px;
    color: #606266;
    .el-dialog__headerbtn {
      top: 50%;
      right: 7px;
      margin-top: -10px;
    }
  }
  .el-dialog__body {
    text-align: left;
    margin-bottom: 18px;
    min-height: 370px;
    overflow-y: auto;
    .center {
      width: 55%;
      margin: 0 auto;
      &.nocenter {
        width: 100%;
        .el-steps {
          padding: 0;
        }
      }
    }
    table {
      .cell {
        padding: 0;
      }
      .table_input {
        input {
          padding: 0;
          height: 20px;
          line-height: 20px;
          width: 70%;
        }
      }
    }
    .el-steps {
      margin-bottom: 10px;
    }
    .el-form {
      &.paddingTop {
        padding-top: 17px;
      }
      &.tableform {
        padding: 0 10px;
        .cell {
          padding: 0 10px;
        }
      }
      .el-form-item {
        margin-bottom: 16px;
        &.font {
          margin-bottom: 0;
        }
        &:last-child {
          margin-bottom: 0;
        }
        .el-form-item__label {
          font-size: 12px;
          line-height: 21px;
        }
        .el-form-item__content {
          line-height: 21px;
          span {
            font-size: 12px;
          }
          p {
            color: red;
            font-size: 10px;
          }
          .el-input {
            width: 220px;
            .el-input__inner {
              height: 30px;
              line-height: 30px;
              font-size: 10px;
              &[disabled="disabled"] {
                height: 30px !important;
              }
            }
          }
          .el-textarea {
            width: 220px;
            .el-textarea__inner {
              height: 60px;
              font-size: 10px;
            }
          }
          .el-radio-group {
            padding-left: 10px;
            .el-radio {
              font-size: 10px;
            }
          }
          .el-select {
          }
          .avatar-uploader {
            margin-right: 10px;
            .el-upload {
              width: 100%;
              height: 100%;
              span {
                display: inline-block;
                text-align: center;
                line-height: 15px;
                margin: 0 auto;
                width: 47px;
                height: 15px;
                font-size: 10px;
              }
              img {
                width: 100%;
                height: 100%;
                vertical-align: top;
              }
            }
          }
          img {
            width: 126px;
            height: 82px;
          }
        }
        .el-input__icon {
          line-height: 30px;
        }
      }
    }
    .el-table__header-wrapper {
      table {
        tr {
          .cell {
            padding-left: 10px;
          }
        }
      }
    }
  }
  .el-dialog__footer {
    padding: 10px 0;
  }
}

//穿梭框类型的弹框
.transfer {
  width: 650px;
  min-height: 450px;
  .el-dialog__header {
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0;
    position: relative;
    font-size: 12px;
    padding: 0 10px;
    .el-dialog__headerbtn {
      top: 50%;
      right: 7px;
      margin-top: -10px;
    }
  }
  .el-dialog__body {
    padding: 35px 39px 0 40px;
    font-size: 0;
  }

  .el-dialog__footer {
    margin-top: 5px;
    padding-bottom: 20px;
    text-align: right;
    padding-right: 20px;
  }
}
</style>
