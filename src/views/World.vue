<template>
  <div class="content" style="background-color: #f5f5f5">
    <div id="myEchart" style="width: 1920px; height: 1200px"></div>
  </div>
</template>

<script>
// import $ from "jquery";/* 引入JQUERY，此处不赘述，用于调用$.get函数。 */
var echarts = require("echarts"); /* 引入echarts模块，此处不赘述 */
import geoJson from "../assets/world.json?v=1";
export default {
  data() {
    return {
      myChart: undefined /* 定义变量 */,
      baseurl: "http://39.98.124.97:8080",
      nodeList: [],
      scatter: [],
    };
  },
  mounted() {
    const is_refresh = localStorage.getItem("refresh")
    if(is_refresh === "true") {
      location.reload()
      localStorage.setItem("refresh", "false")
    }
    // location.reload()
    this.getNodes();
  },
  methods: {
    drawChina() {
      /*      $.get('../assets/world.json', function (geoJson) {/!* 请求世界地图的本地json数据 *!/*/
      let fixPlaces = ["格陵兰", "Greenland"];
      // 欧洲视图 转为 中欧视图（中国在左，欧洲在右）
      let features = geoJson.features;
      for (let i = 0, length = features.length; i < length; ++i) {
        let feature = features[i];
        let geometry = feature.geometry;
        let coordinates = geometry.coordinates;
        if (fixPlaces.includes(feature.properties.name)) {
          continue;
        }
        /*  if (feature.properties.cp) {
          feature.properties.cp[0] = feature.properties.cp[0] >= -30 ? feature.properties.cp[0] - 180 : feature.properties.cp[0] + 180;
        }*/
        /*   if (feature.properties.center) {
          feature.properties.center[0] = feature.properties.center[0] >= -30 ? feature.properties.center[0] - 180 : feature.properties.center[0] + 180;
        }*/
        for (let j = 0, length = coordinates.length; j < length; ++j) {
          let coordinate = coordinates[j];
          for (let k = 0, length = coordinate.length; k < length; ++k) {
            if (coordinate[k].length > 2) {
              for (let m = 0, length = coordinate[k].length; m < length; ++m) {
                coordinate[k][m][0] =
                  coordinate[k][m][0] >= -30
                    ? coordinate[k][m][0] - 180
                    : coordinate[k][m][0] + 180;
                coordinate[k][m][0] += 50;
              }
            } else {
              coordinate[k][0] =
                coordinate[k][0] >= -30
                  ? coordinate[k][0] - 180
                  : coordinate[k][0] + 180;
              coordinate[k][0] += 50;
            }
          }
        }
      }
      this.myChart = echarts.init(
        document.getElementById("myEchart")
      ); /* 初始画布 */
      echarts.registerMap("world", geoJson); /* 注册world地图 */
      this.myChart.setOption({
        /* 设置myChart配置项 */
        tooltip: {
          trigger: "item",
          formatter: "{b}",
        },

        geo: {
          map: "world",
          roam: true, //是否允许缩放，拖拽
          zoom: 1.2, //初始化大小
          //缩放大小限制
          scaleLimit: {
            min: 1, //最小
            max: 2, //最大
          },
          //设置中心点
          center: [10.97, 20.71],
          //省份地图添加背景
          // regions: this.regions,
          itemStyle: {
            areaColor: "#3a535e",
            color: "red",
            borderColor: "#36e7ee",
            borderWidth: 1.5,
          },
          //高亮状态
          emphasis: {
            itemStyle: {
              areaColor: "#1af9e5",
              color: "#fff",
            },
          },
        },

        series: {
          type: "effectScatter",
          coordinateSystem: "geo",
          data: this.scatter,
          showEffectOn: "render",
          rippleEffect: {
            //涟漪特效相关配置
            brushType: "stroke", //波纹的绘制方式，可选 'stroke' 和 'fill'
          },
          hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
          label: {
            //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等，
            normal: {
              formatter: "{b}",
              position: "right",
              show: true,
              fontSize: "17px",
              color: "#100f0f",
              fontWeight: "bold",
            },
          },
          /*  itemStyle: {
            //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时
            normal: {
              color: '#ffffff', //散点的颜色
              shadowBlur: 10,
              shadowColor: 20,
              fontSize: '12px',
            },
          },*/
          zlevel: 1,
        },
      }),
        this.myChart.on("click", (params) => {
          if (
            params.componentType === "series" &&
            params.seriesType === "effectScatter"
          ) {
            let city = params.data.name;
            city = city.split("(")[0];
            for (let i = 0; i < this.nodeList.length; i++) {
              if (city === this.nodeList[i].nodeLocation) {
                sessionStorage.setItem("nodename", this.nodeList[i].nodeName);
                sessionStorage.setItem("ip", this.nodeList[i].nodeIp);
                sessionStorage.setItem("nodetype", this.nodeList[i].nodeType);
                sessionStorage.setItem(
                  "nodebody",
                  JSON.stringify(this.nodeList[i])
                );
                this.$store.state.nodename = this.nodeList[i].nodeName;
                this.$store.state.nodeip = this.nodeList[i].nodeIp;
                this.$store.state.nodetype = this.nodeList[i].nodeType;
                this.$store.state.nodebody = this.nodeList[i];
                break;
              }
            }
            this.$router.push("/machineinfo");
          }
        });
    },
    getNodes() {
      this.$axios
        .get(this.baseurl + "/log/getNodes")
        .then((res) => {
          this.nodeList = res.data.content;
          sessionStorage.setItem("nodename", this.nodeList[0].nodeName);
          sessionStorage.setItem("ip", this.nodeList[0].nodeIp);
          sessionStorage.setItem("nodetype", this.nodeList[0].nodeType);
          sessionStorage.setItem("nodebody", JSON.stringify(this.nodeList[0]));
          this.$store.state.nodename = this.nodeList[0].nodeName;
          this.$store.state.nodeip = this.nodeList[0].nodeIp;
          this.$store.state.nodetype = this.nodeList[0].nodeType;
          this.$store.state.nodebody = this.nodeList[0];
          console.log(res.data.content);
          for (let i = 0; i < this.nodeList.length; i++) {
            let t = {};
            let name = "";
            name = this.nodeList[i].nodeLocation;
            if (this.nodeList[i].nodeType === "云") name += "(云节点)";
            else if (this.nodeList[i].nodeType === "边") name += "(边节点)";
            else name += "(端节点)";
            t["name"] = name;
            let t1 = [];

            if (this.nodeList[i].nodeLon > -30) {
              t1.push(this.nodeList[i].nodeLon - 180 + 50);
            } else t1.push(this.nodeList[i].nodeLon + 180 + 50);
            /*    coordinate[k][0] = coordinate[k][0] >= -30 ? coordinate[k][0] - 180 : coordinate[k][0] + 180;

              */
            t1.push(this.nodeList[i].nodeLat);
            t1.push(9);
            t["value"] = t1;
            t["symbol"] = "diamond";
            t["symbolSize"] = 15;
            let t2 = {};
            t2["color"] = this.getNodeColor(this.nodeList[i].nodeType);
            t["itemStyle"] = t2;
            this.scatter.push(t);
          }
          this.drawChina();
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    getNodeColor(nodeType) {
      // 根据节点类型返回不同的颜色
      if (nodeType === "云") {
        return "#fd0000"; // 云节点颜色
      } else if (nodeType === "边") {
        return "#2607f1"; // 边节点颜色
      } else {
        return "#cbf806"; // 其他节点颜色
      }
    },
  },
};
</script>
