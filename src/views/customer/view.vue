<template>
  <div class="container" v-if="viewFlag">
    <ul class="box_ul">
      <li class="box_li">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>基本信息</span>
        </p>
        <div class="li_content">
          <el-row>
            <el-col :span="12">企业名称：{{ customInfo.name }}</el-col>
            <el-col :span="12"
              >所在地区：{{
                customInfo.cityName + customInfo.districtName
              }}</el-col
            >
            <el-col :span="12">定位信息： {{ customInfo.address }}</el-col>
            <el-col :span="12"
              >企业性质：{{ customInfo.enterprisePropertyName }}</el-col
            >
            <el-col :span="12"
              >项目类型：{{ customInfo.businessEventsTypeName }}</el-col
            >
            <el-col :span="12">客户类型：{{ customInfo.orgTypeName }}</el-col>
            <el-col :span="12">负责人： {{ customInfo.manager }}</el-col>
            <el-col :span="12">电话：{{ customInfo.phone }}</el-col>
            <el-col :span="12">负责人邮箱：{{ customInfo.email }}</el-col>
            <el-col :span="12"> 创建时间：{{ customInfo.createTime }}</el-col>
            <el-col :span="12">简介：{{ customInfo.introduction }}</el-col>
          </el-row>
        </div>
      </li>
      <li class="box_li">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>企业资质</span>
        </p>
        <div class="li_content">
          <el-row>
            <el-col :span="12"
              >营业执照：<img
                style="width: 200px; height: 200px; vertical-align: top"
                :src="orgimg.attrVale"
                alt=""
            /></el-col>
          </el-row>
        </div>
      </li>
      <li class="box_li">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>技术支持</span>
        </p>
        <div class="li_content">
          <el-row>
            <el-col :span="12">技术支持：{{ orgskill.nikeName }}</el-col>
            <el-col :span="12">电话：{{ orgskill.attrVale }}</el-col>
            <el-col :span="12">拓展人：{{ orgexpand.attrVale }}</el-col>
          </el-row>
        </div>
      </li>
      <li class="box_li" v-if="customInfo.isLoad == 1">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>辅助服务</span>
        </p>
        <div class="li_content">
          <el-row v-if="customInfo.loadType == 0">
            <template v-if="customInfo.cons">
              <el-col :span="12">户号：{{ customInfo.cons.consNo }}</el-col>
              <el-col :span="12"
                >户号名称：{{ customInfo.cons.consName }}</el-col
              >
              <el-col :span="12"
                >可控负荷类型：{{ customInfo.cons.consType }}</el-col
              >
              <el-col :span="12"
                >是否市场化用户：{{
                  customInfo.cons.consCycleType ? "是" : "否"
                }}</el-col
              >
              <el-col :span="12"
                >是否季节性用户：{{
                  customInfo.cons.consSeasonType ? "是" : "否"
                }}</el-col
              >
              <el-col :span="12"
                >定位信息：{{ customInfo.cons.address }}</el-col
              >
              <el-col :span="12"
                >供电电压：{{ customInfo.cons.voltCode }}</el-col
              >
              <el-col :span="12">额定容量：{{ customInfo.cons.pe }}</el-col>
              <el-col :span="12">联系方式：{{ customInfo.cons.tel }}</el-col>
              <el-col :span="12"
                >所属运营商：{{ customInfo.cons.operId }}</el-col
              >
            </template>
          </el-row>
          <el-row v-else>
            <template v-if="customInfo.oper">
              <el-col :span="12"
                >运营商名称：{{ customInfo.oper.operName }}</el-col
              >
              <el-col :span="12">地址：{{ customInfo.oper.address }}</el-col>
              <el-col :span="12">联系方式：{{ customInfo.oper.tel }}</el-col>
            </template>
          </el-row>
        </div>
      </li>
      <li class="box_li" v-if="customInfo.enterpriseProperty == 1">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>企业配置</span>
        </p>
        <div class="li_content">
          <el-row>
            <el-col :span="24" v-for="item in getwayList" :key="item.id">
              <el-col :span="12">网关名称：{{ item.name }}</el-col>
              <el-col :span="12"
                >最后通讯时间：{{
                  item.connectTime ? item.connectTime : "--"
                }}</el-col
              >
            </el-col>
            <el-col :span="24"
              >设备数量：
              <el-table
                border
                :data="devList"
                style="width: 80%; display: inline-block; vertical-align: top"
              >
                <el-table-column align="center" prop="roomName" label="配电室">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="transformerNum"
                  label="变压器"
                >
                </el-table-column>
                <el-table-column align="center" prop="gatewayNum" label="网关">
                </el-table-column>
                <el-table-column align="center" prop="meterNum" label="表计">
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="dynamicEnvironmentNum"
                  label="动环"
                >
                </el-table-column>
                <el-table-column align="center" prop="videoNum" label="视频">
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="12">接线图数量：{{ diagramNum }}</el-col>
            <el-col :span="12">抄表日：{{ customInfo.readingTime }}</el-col>
            <el-col :span="12">分时方案：{{ customInfo.scheme }}</el-col>
            <el-col :span="12"
              >用电类型：{{ customInfo.electricityTypeName }}</el-col
            >
            <el-col :span="12">电价模板：{{ customInfo.tempName }}</el-col>
            <el-col :span="12"
              >基本电费计价方式：{{
                customInfo.electricitPricingModeName
              }}</el-col
            >
          </el-row>
        </div>
      </li>
      <li class="box_li">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>使用情况</span>
        </p>
        <div class="li_content">
          <el-row>
            <el-col :span="12">用户数：{{ customInfo.userNum }}</el-col>
            <el-col :span="12"
              >最后一次登录时间：{{ customInfo.loginTime }}</el-col
            >
          </el-row>
        </div>
      </li>
      <!-- <li class="box_li">
        <p class="title">
          <i class="icon-weibiaoti--"></i><span>修改记录</span>
        </p>
        <div class="li_content">
          <el-row>
            <el-col :span="24">2020-5-6 15：00 王宇 修改了 客户信息。</el-col>
          </el-row>
        </div>
      </li> -->
    </ul>
  </div>
</template>

<script>
import {
  GET_CUSTOMER_VIEW,
  GET_CUSTOMER_DEVICE,
  GET_CUSTOMER_DIAGRAM,
  GET_ORGGATEWAY,
} from "@/common/api/customerCore/customer";
export default {
  data() {
    return {
      viewFlag: false,
      customInfo: {},
      devList: [],
      getwayList: [],
      diagramNum: "",
    };
  },
  computed: {
    //企业资质
    orgimg() {
      if (this.customInfo.additionInfoEntities.length) {
        var img = this.customInfo.additionInfoEntities.filter((i) => {
          return i.attrType == 1;
        });
        return img[0];
      } else {
        return "";
      }
    },
    //技术支持
    orgskill() {
      if (this.customInfo.additionInfoEntities.length) {
        var skill = this.customInfo.additionInfoEntities.filter((i) => {
          return i.attrType == 2;
        });
        return skill[0];
      } else {
        return "";
      }
    },
    //拓展人
    orgexpand() {
      if (this.customInfo.additionInfoEntities.length) {
        var expand = this.customInfo.additionInfoEntities.filter((i) => {
          return i.attrType == 3;
        });
        return expand[0];
      } else {
        return "";
      }
    },
  },
  created() {
    this.initinfo();
    this.initDiagram();
    this.initDevice();
    this.initGetWay();
  },
  methods: {
    initinfo() {
      var orgId = this.$route.params.orgid;
      GET_CUSTOMER_VIEW(orgId).then((e) => {
        this.viewFlag = true;
        this.customInfo = e.data;
      });
    },
    initDevice() {
      var orgId = this.$route.params.orgid;
      GET_CUSTOMER_DEVICE(orgId).then((e) => {
        this.devList = e.data;
      });
    },
    initDiagram() {
      var orgId = this.$route.params.orgid;
      GET_CUSTOMER_DIAGRAM(orgId).then((e) => {
        this.diagramNum = e.data;
      });
    },
    initGetWay() {
      var params = {
        orgIds: this.$route.params.orgid,
      };
      GET_ORGGATEWAY(params).then((e) => {
        this.getwayList = e.rows;
      });
    },
  },
};
</script>

<style scoped lang="scss">
.container {
  background-color: #e9ecf1 !important;
}
.box_ul {
  .box_li {
    background: white;
    margin-bottom: 10px;
    border-radius: 10px;
    padding: 20px;
    .title {
      margin-bottom: 20px;
      i {
        font-size: 20px;
        color: #0b8ee9;
        font-family: iconfont;
        vertical-align: sub;
        margin-right: 10px;
      }
    }
    .li_content {
      padding-left: 30px;
      .el-row {
        .el-col {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
