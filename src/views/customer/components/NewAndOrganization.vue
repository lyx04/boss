<template>
  <div>
    <modal
      :visible="dialogVisibleOrganization"
      customClass="new-editor-custom Miniform"
      @on-closed="dialogVisibleOrganizationClosed"
    >
      <template slot="head">
        <span>新增客户</span>
      </template>
      <template slot="body">
        <el-steps :active="stepsActive" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="企业资质"></el-step>
          <el-step title="技术支持"></el-step>
          <el-step
            title="辅助服务信息"
            v-if="isTop == 1 && ruleFormInfo.isLoad == 1"
          ></el-step>
        </el-steps>
        <!--基本信息-->
        <div v-if="stepsActive == 1">
          <el-form
            :model="ruleFormInfo"
            :rules="rules"
            ref="ruleFormInfo"
            label-width="120px"
            class="cusomer-ruleForm"
            size="mini"
          >
            <el-form-item label="客户名称：" prop="name">
              <el-input
                v-model.trim="ruleFormInfo.name"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="" prop="isLoad" v-if="isTop == 1">
              <el-checkbox
                v-model="ruleFormInfo.isLoad"
                true-label="1"
                false-label="0"
                label="1"
                >参与辅助服务</el-checkbox
              >
            </el-form-item>
            <el-form-item label="所在地区：" prop="areas">
              <el-cascader
                v-model="ruleFormInfo.areas"
                :options="areaListOptions"
                :props="{
                  children: 'childs',
                  label: 'areaName',
                  value: 'areaId',
                }"
                @change="areahandleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="定位信息：" prop="address">
              <el-input
                v-model="ruleFormInfo.address"
                disabled
                style="width: 180px; margin-right: 8px"
              ></el-input
              ><el-button plain @click="dialogVisibleMap = true"
                >选择定位</el-button
              >
            </el-form-item>
            <el-form-item label="企业性质：" prop="enterpriseProperty">
              <template v-for="item in dict.enterprise_property">
                <el-radio
                  v-if="isTop == 1 ? item.dictValue : item.dictValue == '01'"
                  :key="item.dictValue"
                  v-model="ruleFormInfo.enterpriseProperty"
                  :label="item.dictValue"
                  @change="radioChange"
                  >{{ item.dictLabel }}</el-radio
                >
              </template>
            </el-form-item>
            <template v-if="ruleFormInfo.enterpriseProperty == '01'">
              <el-form-item label="项目类型：" prop="businessEventsType">
                <el-select
                  v-model="ruleFormInfo.businessEventsType"
                  placeholder=""
                  multiple
                  collapse-tags
                  @change="businessEventsTypeChange"
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
            </template>
            <template v-if="ruleFormInfo.enterpriseProperty == '01'">
              <el-form-item label="客户类型：" prop="orgType">
                <el-select v-model="ruleFormInfo.orgType" placeholder="">
                  <template v-for="item in orgTypeList">
                    <el-option
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    ></el-option>
                  </template>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="是否启用：" prop="status">
              <el-select v-model="ruleFormInfo.status" placeholder="">
                <el-option label="启用" value="0"></el-option>
                <el-option label="禁用" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="负责人：" prop="manager">
              <el-input
                v-model.trim="ruleFormInfo.manager"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="负责人电话：" prop="phone">
              <el-input
                onkeyup="value=value.replace(/[^\d]/g,'')"
                v-model.trim="ruleFormInfo.phone"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item label="负责人邮箱：">
              <el-input v-model="ruleFormInfo.email"></el-input>
            </el-form-item>
            <el-form-item label="简介：">
              <el-input
                v-model="ruleFormInfo.introduction"
                type="textarea"
                :rows="3"
                maxlength="50"
                show-word-limit
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 营业执照-->
        <div v-if="stepsActive == 2">
          <el-form
            :model="ruleFormQualification"
            :rules="rules"
            ref="ruleFormQualification"
            label-width="100px"
            class="cusomer-ruleForm qualification-ruleForm"
            size="small"
          >
            <el-form-item label="营业执照：" prop="url">
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
                  style="width: 124px; height: 80px"
                  v-if="ruleFormQualification.url"
                  :src="ruleFormQualification.url"
                  fit="cover"
                ></el-image>
                <el-button v-else>上传按钮</el-button>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
        <!--技术支持-->
        <div v-if="stepsActive == 3">
          <el-form
            :model="ruleFormSupport"
            :rules="rules"
            ref="ruleFormSupport"
            label-width="120px"
            class="cusomer-ruleForm support-ruleForm"
            size="small"
          >
            <el-form-item label="拓展人员：" prop="developStaff">
              <el-input
                v-model="ruleFormSupport.developStaff"
                maxlength="20"
              ></el-input>
            </el-form-item>
            <el-form-item label="技术服务人员：" prop="userId">
              <el-select
                v-model="ruleFormSupport.userId"
                filterable
                placeholder="请搜索选择服务人员"
                @change="userChange"
              >
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :label="item.nickName"
                  :value="item.userId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系电话：" prop="supportPhone">
              <el-input v-model="ruleFormSupport.supportPhone"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!--辅助服务信息-->
        <div v-if="isTop == 1 && stepsActive == 4">
          <el-form
            :model="auxiliaryForm"
            :rules="auxiliaryRules"
            ref="auxiliaryForm"
            label-width="150px"
            class="cusomer-ruleForm"
            size="small"
          >
            <el-form-item label="辅助服务客户类型：" prop="loadType">
              <el-radio-group v-model="auxiliaryForm.loadType">
                <el-radio label="0">用电单位</el-radio>
                <el-radio label="1">运营商</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="户号："
              prop="consNo"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-input v-model.trim="auxiliaryForm.consNo"></el-input>
            </el-form-item>
            <el-form-item
              label="户号名称："
              prop="consName"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-input v-model.trim="auxiliaryForm.consName"></el-input>
            </el-form-item>
            <el-form-item
              label="可控负荷类型："
              prop="consType"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-select v-model="auxiliaryForm.consType" placeholder="">
                <el-option label="工业负荷" value="工业负荷"> </el-option>
                <el-option label="充电站" value="充电站"> </el-option>
                <el-option label="电采暖" value="电采暖"> </el-option>
                <el-option label="虚拟电厂" value="虚拟电厂"> </el-option>
                <el-option label="储能电站" value="储能电站"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="是否市场化用户："
              prop="consCycleType"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-radio-group v-model="auxiliaryForm.consCycleType">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="是否季节性用户："
              prop="consSeasonType"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-radio-group v-model="auxiliaryForm.consSeasonType">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="供电电压："
              prop="voltCode"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-select v-model="auxiliaryForm.voltCode" placeholder="">
                <el-option label="220V" value="220V"></el-option>
                <el-option label="380V" value="380V"></el-option>
                <el-option label="220kV" value="220kV"></el-option>
                <el-option label="35kV" value="35kV"></el-option>
                <el-option label="10kV" value="10kV"></el-option>
                <el-option label="6kV" value="6kV"></el-option>
                <el-option label="110kV" value="110kV"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="额定容量："
              prop="pe"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-input
                v-model.trim="auxiliaryForm.pe"
                style="width: 200px"
              ></el-input
              ><span style="margin-left: 8px">MW</span>
            </el-form-item>
            <el-form-item
              label="运营商名称："
              prop="operName"
              v-if="auxiliaryForm.loadType == 1"
            >
              <el-input v-model.trim="auxiliaryForm.operName"></el-input>
            </el-form-item>
            <el-form-item
              label="地址："
              prop="address"
              v-if="auxiliaryForm.loadType == 1"
            >
              <el-input v-model.trim="auxiliaryForm.address"></el-input>
            </el-form-item>
            <el-form-item
              label="定位信息："
              prop="address"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-input
                v-model="auxiliaryForm.positioning"
                disabled
                style="width: 150px; margin-right: 8px"
              ></el-input
              ><el-button plain @click="dialogVisibleConsMap = true"
                >选择定位</el-button
              >
            </el-form-item>
            <el-form-item label="联系方式：" prop="tel">
              <el-input
                v-model="auxiliaryForm.tel"
                onkeyup="value=value.replace(/[^\d]/g,'')"
                maxlength="11"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="所属运营商："
              prop="operId"
              v-if="auxiliaryForm.loadType == 0"
            >
              <el-select
                v-model="auxiliaryForm.operId"
                placeholder=""
                filterable
              >
                <el-option
                  v-for="(item, index) in operList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template slot="foot">
        <el-button
          @click="dialogVisibleOrganizationClosed"
          v-if="
            stepsActive == 1 ||
            (stepsActive == 3 && ruleFormInfo.isLoad == 0) ||
            stepsActive == 4
          "
          >取消</el-button
        >
        <el-button
          v-if="
            stepsActive == 2 ||
            stepsActive == 3 ||
            (stepsActive == 4 && ruleFormInfo.isLoad == 1)
          "
          @click="ona"
          >上一步</el-button
        >
        <el-button
          type="primary"
          @click="next('ruleFormInfo')"
          v-if="stepsActive == 1"
          >下一步</el-button
        >
        <el-button
          type="primary"
          @click="next('ruleFormQualification')"
          v-if="stepsActive == 2"
          >下一步</el-button
        >
        <el-button
          type="primary"
          @click="next('ruleFormSupport')"
          v-if="stepsActive == 3 && ruleFormInfo.isLoad == 1"
          >下一步</el-button
        >
        <el-button
          type="primary"
          v-if="
            (stepsActive == 3 && ruleFormInfo.isLoad == 0) ||
            (stepsActive == 4 && ruleFormInfo.isLoad == 1)
          "
          @click="
            fromSubmit(stepsActive == 3 ? 'ruleFormSupport' : 'auxiliaryForm')
          "
          >提交</el-button
        >
      </template>
    </modal>
    <!--选择地图1-->
    <add-map-modal
      v-if="dialogVisibleMap"
      :dialogVisibleMap="dialogVisibleMap"
      :searchKey.sync="ruleFormInfo.address"
      :longitude="ruleFormInfo.longitude"
      :latitude="ruleFormInfo.latitude"
      @on-closed="dialogVisibleMapClosed"
      @submit-address="submitAddress"
    ></add-map-modal>
    <!--选择地图2-->
    <add-map-cons-modal
      v-if="dialogVisibleConsMap"
      :dialogVisibleConsMap="dialogVisibleConsMap"
      :searchKey.sync="auxiliaryForm.positioning"
      :longitude="auxiliaryForm.longitude"
      :latitude="auxiliaryForm.latitude"
      @on-cons-closed="dialogVisibleConsMapClosed"
      @submit-consArea="submitConsArea"
    ></add-map-cons-modal>
  </div>
</template>

<script>
import modal from "@/common/components/Modal";
import AddMapModal from "./AddMapModal";
import AddMapConsModal from "./AddMapConsModal";
import { uploadFile } from "@/common/api/file";
import { ADD_ORG, GET_USER_LIST } from "@/common/api/web/organization";
import { GET_OPER_LIST } from "@/common/api/web/swichIn";
import { GET_AREA_TREE } from "@/common/api/system/area";
import { mapState } from "vuex";
export default {
  name: "NewAndOrganization",
  props: {
    dialogVisibleOrganization: {
      type: Boolean,
    },
    orgTypeList: {
      type: Array,
    },
  },
  components: {
    modal,
    AddMapModal,
    AddMapConsModal,
  },
  computed: {
    ...mapState(["dict"]),
  },
  data() {
    return {
      stepsActive: 1, // 步骤条当前页
      areaListOptions: [], // 城市
      ruleFormInfo: {},
      orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
      isTop: JSON.parse(sessionStorage.getItem("userInfo")).isTop,
      ruleFormQualification: {
        file: "",
        url: "", // 营业执照
      },
      ruleFormSupport: {
        developStaff: "", // 拓展人员
        supportName: "", // 技术服务人员
        supportPhone: "", // 联系电话
        userId: "", // 用户id
      }, // 技术支持
      auxiliaryForm: {}, // 辅助服务信息
      rules: {
        name: [
          { required: true, message: "请输入客户名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        address: [
          { required: true, message: "请选择定位信息", trigger: "blur" },
        ],
        areas: [
          { required: true, message: "请选择所属地区", trigger: "change" },
        ],
        businessEventsType: [
          { required: true, message: "请选择项目类型", trigger: "change" },
        ],
        enterpriseProperty: [
          { required: true, message: "请选择企业性质", trigger: "change" },
        ],
        orgType: [
          { required: true, message: "请选择客户类型", trigger: "change" },
        ],
        status: [
          { required: true, message: "请选择是否启用", trigger: "change" },
        ],
        manager: [
          { required: true, message: "请输入负责人", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
        phone: [
          { required: true, message: "请输入负责人电话", trigger: "blur" },
        ],
        url: [{ required: true, message: "请上传营业执照", trigger: "blur" }],
        developStaff: [
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
      auxiliaryRules: {
        loadType: [
          {
            required: true,
            message: "请选择辅助服务客户类型",
            trigger: "change",
          },
        ],
        consNo: [{ required: true, message: "请输入户号", trigger: "blur" }],
        consName: [
          { required: true, message: "请输入户号名称", trigger: "blur" },
        ],
        consType: [
          { required: true, message: "请选择可控负荷类型", trigger: "change" },
        ],
        consCycleType: [
          {
            required: true,
            message: "请选择是否市场化用户",
            trigger: "change",
          },
        ],
        consSeasonType: [
          {
            required: true,
            message: "请选择是否季节性用户",
            trigger: "change",
          },
        ],
        voltCode: [
          { required: true, message: "请选择供电电压", trigger: "change" },
        ],
        pe: [{ required: true, message: "请输入额定容量", trigger: "blur" }],
        positioning: [
          { required: true, message: "请选择定位信息", trigger: "blur" },
        ],
        tel: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
        operName: [
          { required: true, message: "请输入运营商名称", trigger: "blur" },
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      customize: "", // 上传地址，自定义上传为空1
      dialogVisibleMap: false, // 选择地图,
      dialogVisibleConsMap: false, // 选择地图2
      userList: [], // 用户列表
      operList: [], // 所属运营商
    };
  },
  watch: {
    dialogVisibleOrganization(val) {
      if (val) {
        this.reset();
        this.getAreaTree();
      }
    },
  },
  methods: {
    // 选择技术服务人员带出联系电话
    userChange(val) {
      this.userList.forEach((item) => {
        if (val == item.userId) {
          this.ruleFormSupport.supportPhone = item.phonenumber;
        }
      });
    },
    // 查询区域树
    getAreaTree() {
      GET_AREA_TREE().then((res) => {
        res.data.forEach((item) => {
          if (item.childs.length > 0) {
            item.childs.forEach((val) => {
              if (val.childs.length > 0) {
                val.childs.forEach((child) => {
                  delete child.childs;
                });
              } else {
                delete val.childs;
              }
            });
          } else {
            delete item.childs;
          }
        });
        this.areaListOptions = res.data;
      });
    },
    // 所属运营商
    getoperlist() {
      GET_OPER_LIST().then((res) => {
        this.operList = res.data;
      });
    },
    // 关闭弹框
    dialogVisibleOrganizationClosed() {
      this.$emit("on-closed");
      // this.$store.dispatch("setorgSubmit", "");
      this.reset();
    },
    // 区域选择
    areahandleChange(value) {
      if (value[0]) {
        this.ruleFormInfo.provincial = value[0];
      }
      if (value[1]) {
        this.ruleFormInfo.city = value[1];
      }
      if (value[2]) {
        this.ruleFormInfo.district = value[2];
      }
    },
    handleChange(file) {
      this.ruleFormQualification.file = file;
    },
    // 企业性质
    radioChange() {
      this.ruleFormInfo.businessEventsType = [];
      this.ruleFormInfo.orgType = null;
    },
    // 项目类型选中聚合商勾选参与辅助服务（合力）
    businessEventsTypeChange(val) {
      if (this.isTop == 1 && val.indexOf("04") != -1) {
        this.ruleFormInfo.isLoad = "1";
      } else {
        this.ruleFormInfo.isLoad = "0";
      }
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
        this.ruleFormQualification.url = res.data;
      });
    },
    ona() {
      if (this.stepsActive > 1) {
        this.stepsActive -= 1;
      }
    },
    next(formName) {
      if (this.stepsActive) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.stepsActive += 1;
            if (this.stepsActive == 4) {
              this.getoperlist();
              this.auxiliaryForm.consName = this.ruleFormInfo.name; // 联系方式
              this.auxiliaryForm.tel = this.ruleFormInfo.phone; // 联系方式
              this.auxiliaryForm.operName = this.ruleFormInfo.name; //运营商名称
              // this.auxiliaryForm.address = this.ruleFormInfo.address; // 地址
              // this.auxiliaryForm.longitude = this.ruleFormInfo.longitude; // 经度
              // this.auxiliaryForm.latitude = this.ruleFormInfo.latitude; // 纬度
              // this.auxiliaryForm.positioning = this.ruleFormInfo.address; // 所属地区
              if (!this.auxiliaryForm.address) {
                this.auxiliaryForm.address = this.ruleFormInfo.address; // 地址
              }
              if (!this.auxiliaryForm.positioning) {
                this.auxiliaryForm.longitude = this.ruleFormInfo.longitude; // 经度
                this.auxiliaryForm.latitude = this.ruleFormInfo.latitude; // 纬度
                this.auxiliaryForm.positioning = this.ruleFormInfo.address; // 所属地区
              }
            }
          } else {
            return false;
          }
        });
      }
    },
    // 表单重置
    reset() {
      this.ruleFormInfo = {
        name: "", // 客户名称
        isLoad: "0", // 是否参与辅助服务  1是  0否
        areas: [], // 所属地区
        provincial: "", // 省
        city: "", // 市
        district: "", // 县
        address: "", // 定位信息
        longitude: "112.54699", // 经度
        latitude: "37.79451", //纬度
        enterpriseProperty: "01", // 企业性质
        businessEventsType: [], // 业务类型
        orgType: "", // 客户类型
        status: "", // 是否启用
        manager: "", // 负责人
        phone: "", // 负责人电话
        email: "", // 负责人邮箱
        introduction: "", // 简介
        accounts: 20, //默认允许的账户数
      };
      this.ruleFormQualification = {
        file: "",
        url: "", // 营业执照
      };
      this.ruleFormSupport = {
        developStaff: "", // 拓展人员
        supportName: "", // 技术服务人员
        supportPhone: "", // 联系电话
        userId: "", // 用户id
      };
      this.auxiliaryForm = {
        loadType: "0", // 辅助服务客户类型   1用电单位   2营运商
        consNo: "", // 户号
        consName: "", // 户号名称
        consType: "", // 可控负荷类型
        consCycleType: "1", // 是否市场化用户
        consSeasonType: "1", // 是否季节性用户
        voltCode: "", // 供电电压
        pe: "", //额定容量
        tel: "", // 联系方式
        operId: "", // 所属运营商
        operName: "", //运营商名称
        address: "", // 地址
        longitude: "", // 经度
        latitude: "", // 纬度
        positioning: "", // 定位地址
      };
      this.stepsActive = 1;
      this.resetForm("ruleFormInfo");
      this.resetForm("ruleFormQualification");
      this.resetForm("ruleFormSupport");
      this.resetForm("auxiliaryForm");
    },
    fromSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            name: this.ruleFormInfo.name,
            isLoad: this.ruleFormInfo.isLoad, // 是否参与辅助服务  1是  0否
            provincial: this.ruleFormInfo.provincial,
            city: this.ruleFormInfo.city,
            district: this.ruleFormInfo.district,
            lat: this.ruleFormInfo.latitude,
            lng: this.ruleFormInfo.longitude,
            address: this.ruleFormInfo.address,
            enterpriseProperty: this.ruleFormInfo.enterpriseProperty,
            businessEventsType:
              this.ruleFormInfo.businessEventsType &&
              this.ruleFormInfo.businessEventsType.length > 0
                ? this.ruleFormInfo.businessEventsType.toString()
                : "",
            orgType: this.ruleFormInfo.orgType,
            status: this.ruleFormInfo.status,
            manager: this.ruleFormInfo.manager,
            phone: this.ruleFormInfo.phone,
            email: this.ruleFormInfo.email,
            introduction: this.ruleFormInfo.introduction,
            parentId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
            additionInfoEntities: [
              {
                attrType: "1",
                attrVale: this.ruleFormQualification.url,
              },
              {
                attrType: "2",
                userId: this.ruleFormSupport.userId,
                attrVale: this.ruleFormSupport.supportPhone,
              },
              {
                attrType: "3",
                attrVale: this.ruleFormSupport.developStaff,
              },
            ],
          };
          if (this.ruleFormInfo.isLoad == 1) {
            params.loadType = this.auxiliaryForm.loadType;
            if (this.auxiliaryForm.loadType == 0) {
              params.cons = {
                consNo: this.auxiliaryForm.consNo, // 户号
                consName: this.auxiliaryForm.consName, // 户号名称
                consType: this.auxiliaryForm.consType, // 可控负荷类型
                consCycleType: this.auxiliaryForm.consCycleType, // 是否市场化用户
                consSeasonType: this.auxiliaryForm.consSeasonType, // 是否季节性用户
                voltCode: this.auxiliaryForm.voltCode, // 供电电压
                pe: this.auxiliaryForm.pe, //额定容量
                tel: this.auxiliaryForm.tel, // 联系方式
                operId: this.auxiliaryForm.operId, // 所属运营商
                longitude: this.auxiliaryForm.longitude, // 经度
                latitude: this.auxiliaryForm.latitude, // 纬度
                address: this.auxiliaryForm.positioning, // 所属地区
              };
            } else {
              params.oper = {
                operName: this.auxiliaryForm.operName, //运营商名称
                address: this.auxiliaryForm.address, // 地址
                tel: this.auxiliaryForm.tel, // 联系方式
              };
            }
          }
          ADD_ORG("post", params).then(() => {
            this.$message({
              message: "新增客户成功",
              type: "success",
            });
            this.dialogVisibleOrganizationClosed();
            this.reset();
            this.$emit("submit-org-form");
          });
        } else {
          return false;
        }
      });
    },
    //  关闭地图弹框
    dialogVisibleMapClosed() {
      this.dialogVisibleMap = false;
    },
    //  地图确定选中
    submitAddress(val) {
      this.ruleFormInfo.address = val.address;
      this.ruleFormInfo.longitude = val.longitude;
      this.ruleFormInfo.latitude = val.latitude;
    },
    dialogVisibleConsMapClosed() {
      this.dialogVisibleConsMap = false;
    },
    submitConsArea(val) {
      this.auxiliaryForm.positioning = val.address;
      this.auxiliaryForm.longitude = val.longitude;
      this.auxiliaryForm.latitude = val.latitude;
    },
    // 查询用户列表
    remoteMethod() {
      let data = {
        orgId: JSON.parse(sessionStorage.getItem("userInfo")).orgId,
        // nickName: query
      };
      GET_USER_LIST(data).then((res) => {
        this.userList = res.rows;
      });
    },
  },
  created() {
    this.reset();
    this.getAreaTree();
    this.remoteMethod();
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-steps {
  .el-step__title {
    font-size: 14px;
  }
}
.qualification-ruleForm {
  .el-button {
    background: transparent;
    padding: 4px 13px;
    font-size: 12px;
    margin-left: 0 !important;
  }
  // 上传
  .avatar-uploader {
    width: 126px;
    height: 82px;
    border: 1px solid #dcdfe6;
    line-height: 82px;
    text-align: center;
  }
}
</style>
