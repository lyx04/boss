<template>
  <section class="page__404" :style="{ height: height + 'px' }">
    <div class="error-container">
      <div class="page__error">
        <div id="pacman"></div>
      </div>
      <div class="page__container">
        <div class="page__title">
          <h1>对不起, 你访问的页面不存在!</h1>
        </div>
        <div class="page__content clearfix">
          <div class="left">
            <p>可能是如下原因引起了这个错误:</p>
            <ol type="I">
              <li>URL输入错误</li>
              <li>链接已失效</li>
              <li>其他原因...</li>
            </ol>
          </div>
          <div class="right">
            <p>推荐您通过以下链接继续访问本网站:</p>
            <ol class="links" type="I">
              <li>
                <router-link to="/index">» 电力能源综合数字平台</router-link>
              </li>
            </ol>
          </div>
        </div>
        <div class="page__footer">
          Copyright © 电力能源综合数字平台 All Rights Reserved
          晋ICP备16004397号-4
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data: () => {
    return {
      height: ""
    };
  },
  mounted() {
    this.icon();
    let ele = document.getElementById("pacman");
    this.toggleClass(ele, "pacman_eats");
  },
  methods: {
    icon() {
      let _this = this;
      _this.height = window.innerHeight;
      window.onresize = function() {
        // 屏幕变化时，高度自适应
        _this.height = window.innerHeight;
      };
      setInterval(function() {
        let ele = document.getElementById("pacman");
        _this.toggleClass(ele, "pacman_eats");
      }, 300);
      let current = 0;
      let errAll = document.getElementsByClassName("page__404")[0];
      setInterval(function() {
        current -= 1;
        errAll.style.backgroundPosition = current + "px";
      }, 50);
    },
    hasClass(ele, cls) {
      return ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
    },
    addClass(ele, cls) {
      let _this = this;
      if (!_this.hasClass(ele, cls)) ele.className += " " + cls;
    },
    removeClass(ele, cls) {
      let _this = this;
      if (_this.hasClass(ele, cls)) {
        let reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
      }
    },
    toggleClass(ele, cls) {
      let _this = this;
      if (_this.hasClass(ele, cls)) {
        _this.removeClass(ele, cls);
      } else {
        _this.addClass(ele, cls);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page__404 {
  width: 100%;
  height: 100%;
  text-shadow: 0 1px 0 #ffffff;
  filter: dropshadow(color=#ffffff, offx=0, offy=1);
  text-align: center;
  background-color: #aaa;
  background-image: url("../common/assets/img/common/404-back.png");
  overflow: hidden;
}
.page__error {
  background: transparent url("../common/assets/img/common/404.png") right 35px
    no-repeat;
}
.page__error #pacman {
  background: transparent url("../common/assets/img/common/404-bask.png") 0 0
    no-repeat;
}
.pacman_eats {
  background: transparent url("../common/assets/img/common/404-bask.png") 0 -207px
    no-repeat !important;
}
.page__container {
  width: 760px;
  margin: 0 auto;
  border: 1px solid #e0e0e0;
  border-top: 1px solid #fff;
  border-bottom: 1px solid #ccc;
  background-color: #e5e5e5;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2) inset,
    0 2px 4px rgba(0, 0, 0, 0.7);
  color: #2976b2;
}
.page__container .page__title {
  border-bottom: 1px solid #aaa;
  overflow: hidden;
  background-color: #e7e7e7;
  text-align: center;
  line-height: 50px;
}
.page__container .page__content {
  border-top: 1px solid #fff;
  border-bottom: 1px solid #aaa;
  display: flex;
}
.page__container .page__content ol {
  margin-top: 10px;
  li {
    font-size: 26px;
    margin: 8px 0;
    a {
      color: #2976b2;
      font-weight: bold;
      transition: all 0.1s linear;
      &:hover {
        color: #0791fd;
      }
    }
  }
}
.page__container .page__footer {
  padding: 10px 20px 10px 20px;
  border-top: 1px solid #f5f5f5;
  font-size: 14px;
  color: #555;
  background-color: #d5d5d5;
}
.page__container .left {
  padding: 30px 10px 20px 50px;
  width: 350px;
}
.page__container .right {
  padding: 30px 20px 20px 10px;
  width: 320px;
}

.error-container {
  display: block;
  text-align: left;
  width: 960px;
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 40px;
}
.page__error {
  background: transparent url("../common/assets/img/common/404.png") right 35px
    no-repeat;
  width: 680px;
  height: 280px;
  position: relative;
  margin: 0 auto;
}
.page__error #pacman {
  width: 207px;
  height: 207px;
  position: absolute;
  left: 0px;
  top: 16px;
  background: transparent url("../common/assets/img/common/404-bask.png") 0 0
    no-repeat;
  animation: eats 2s linear 0s infinite alternate;
}
.pacman_eats {
  background: transparent url("../common/assets/img/common/404-bask.png") 0 -207px
    no-repeat !important;
}
@keyframes eats {
  from {
    left: 0px;
    top: 16px;
  }
  to {
    left: 200px;
    top: 16px;
  }
}
</style>
