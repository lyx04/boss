<template>
  <modal
    :visible="dialogVisibleMap"
    customClass="Miniform"
    @on-closed="dialogVisibleMapClosed"
  >
    <template slot="head">
      <span>选择定位</span>
    </template>
    <template slot="body">
      <div class="map-body">
        <div class="map-keyword">
          <el-input v-model.trim="searchKey" id="search"></el-input>
          <el-button type="primary" @click="searchByHand">搜索</el-button>
        </div>
        <div
          style="
            width: 400px;
            height: 186px;
            margin-top: 9px;
            position: relative;
          "
        >
          <div class="tip-box" id="searchTip"></div>
          <el-amap
            class="amap-box"
            :amap-manager="amapManager"
            :vid="'amap-vue'"
            :zoom="zoom"
            :plugin="plugin"
            :center="center"
            :events="events"
            :mapStyle="mapStyle"
          >
            <!-- 标记 -->
            <el-amap-marker
              v-for="(marker, index) in markers"
              :position="marker"
              :key="index"
            ></el-amap-marker>
          </el-amap>
        </div>
      </div>
    </template>
    <template slot="foot">
      <el-button @click="dialogVisibleMapClosed">取消</el-button>
      <el-button type="primary" @click="submitAddress">确定</el-button>
    </template>
  </modal>
</template>

<script>
import modal from "@/common/components/Modal";
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
let amapManager = new AMapManager();

export default {
  name: "EditorMap",
  components: {
    modal,
  },
  props: {
    dialogVisibleMap: {
      type: Boolean,
    },
    searchKey: {
      type: String,
    },
    longitude: {
      type: Number,
      default: 112.54699,
    },
    latitude: {
      type: Number,
      default: 37.79451,
    },
  },
  computed: {
    isShown() {
      return this.visible;
    },
  },
  data() {
    let self = this;
    return {
      address: null,
      amapManager,
      markers: [],
      mapClick: false,
      searchOption: {
        city: "全国",
        citylimit: true,
      },
      center: [112.54699, 37.79451],
      zoom: 17,
      lng: 0,
      lat: 0,
      loaded: false,
      markerEvent: {
        click(e) {
          console.log(e);
        },
      },
      events: {
        init() {
          lazyAMapApiLoaderInstance.load().then(() => {
            self.initSearch();
          });
        },
        // 点击获取地址的数据
        click(e) {
          self.markers = [];
          let { lng, lat } = e.lnglat;
          self.lng = lng;
          self.lat = lat;
          self.center = [lng, lat];
          self.markers.push([lng, lat]);
          // 这里通过高德 SDK 完成。
          let geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all",
          });
          geocoder.getAddress([lng, lat], function (status, result) {
            if (status === "complete" && result.info === "OK") {
              if (result && result.regeocode) {
                self.address = result.regeocode.formattedAddress;
                self.searchKey = result.regeocode.formattedAddress;
                self.mapClick = true;
                self.$nextTick();
              }
            }
          });
        },
      },
      // 一些工具插件
      plugin: [
        {
          // 定位
          pName: "Geolocation",
          events: {
            init(o) {
              // o是高德地图定位插件实例
              o.getCurrentPosition((status, result) => {
                if (result && result.position) {
                  // 设置经度
                  self.lng = self.longitude;
                  // 设置维度
                  self.lat = self.latitude;
                  // 设置坐标
                  self.center = [self.lng, self.lat];
                  self.markers.push([self.lng, self.lat]);
                  // load
                  self.loaded = true;
                  // 页面渲染好后
                  self.$nextTick();
                }
              });
            },
            click(e) {
              console.log(e);
            },
          },
        },
        {
          // 工具栏
          pName: "ToolBar",
          events: {
            init(instance) {
              console.log(instance);
            },
          },
        },
      ],
    };
  },
  methods: {
    dialogVisibleMapClosed() {
      this.$emit("on-closed");
    },
    submitAddress() {
      if (
        this.center.length == 2 &&
        this.center[0] &&
        this.center[1] &&
        this.searchKey
      ) {
        // if (this.mapClick) {
        this.dialogVisibleMapClosed();
        let data = {
          address: this.searchKey,
          longitude: this.center[0], // 经度
          latitude: this.center[1], //纬度
        };
        this.$emit("submit-address", data);
        // } else {
        //   this.$message.error("请填写正确地址搜索并点击");
        // }
      } else {
        this.$message.error("请正确选择定位");
      }
    },
    initSearch() {
      let vm = this;
      let map = this.amapManager.getMap();
      AMapUI.loadUI(["misc/PoiPicker"], function (PoiPicker) {
        var poiPicker = new PoiPicker({
          input: "search",
          placeSearchOptions: {
            map: map,
            pageSize: 10,
          },
          suggestContainer: "searchTip",
          searchResultsContainer: "searchTip",
        });
        vm.poiPicker = poiPicker;
        // 监听poi选中信息
        poiPicker.on("poiPicked", function (poiResult) {
          // console.log(poiResult)
          let source = poiResult.source;
          let poi = poiResult.item;
          if (source !== "search") {
            poiPicker.searchByKeyword(poi.name);
          } else {
            poiPicker.clearSearchResults();
            vm.markers = [];
            let lng = poi.location.lng;
            let lat = poi.location.lat;
            let address = poi.cityname + poi.adname + poi.name;
            vm.center = [lng, lat];
            vm.mapClick = true;
            vm.markers.push([lng, lat]);
            vm.lng = lng;
            vm.lat = lat;
            vm.address = address;
            vm.searchKey = address;
          }
        });
      });
    },
    searchByHand() {
      this.mapClick = false;
      if (this.searchKey !== "") {
        this.poiPicker.searchByKeyword(this.searchKey);
      } else {
        this.$message.error("请填写地址搜索并点击");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.map-body {
  .map-keyword {
    height: 23px;
    display: flex;
    ::v-deep.el-input {
      width: 128px;
      .el-input__inner {
        height: 23px;
        line-height: 23px;
      }
    }
    ::v-deep.el-button {
      padding: 4px 12px;
      margin-left: 9px;
    }
  }
  .tip-box {
    width: 100%;
    max-height: 260px;
    position: absolute;
    top: 30px;
    overflow-y: auto;
    background-color: #fff;
    display: none;
  }
}
</style>
