<template>
  <div class="content">
    <!-- 设置容器ID，宽度1920PX，高度1080PX -->
    <div id="myEchart" style="width:1920px; height:1080px;"></div>
  </div>
</template>

<script>
// import $ from "jquery";/* 引入JQUERY，此处不赘述，用于调用$.get函数。 */
var echarts = require("echarts");/* 引入echarts模块，此处不赘述 */
import geoJson from '../assets/world.json'
export default {
  data() {
    return {
      myChart: undefined,/* 定义变量 */
      regions: [

        {
          name: '山东省',
          itemStyle: {
            areaColor: '#fe9b45',
            opacity: 1,
          },
        },
        {
          name: '北京市',
          itemStyle: {
            areaColor: '#fd691b',
            opacity: 1,
          },
        },
        {
          name: '上海市',
          itemStyle: {
            areaColor: '#fd691b',
            opacity: 1,
          },
        },
        {
          name: '海南省',
          itemStyle: {
            areaColor: '#ffc556',
            opacity: 1,
          },
        },
      ],
      scatter:
          [
            { name: '北京(云节点 1)', value: [116.46122, 39.97886, 9] },
            { name: '海南(边节点 1)', value: [109.12, 19.12, 9] },
            { name: '青岛(边节点 1)', value: [120.30, 36.40, 9] },
            { name: '上海(边节点 2)', value: [121.47, 31.23, 9] },
          ]
    };
  },
  mounted() {
    this.drawChina()
    // $.get('../assets/world.json', function (geoJson) {/* 请求世界地图的本地json数据 */
      /*this.myChart = echarts.init(document.getElementById('myEchart'));/!* 初始画布 *!/
      echarts.registerMap('world', geoJson);/!* 注册world地图 *!/
      this.myChart.setOption({/!* 设置myChart配置项 *!/
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },

        geo: {
          map: 'world',
          roam: true, //是否允许缩放，拖拽
          zoom: 1.2, //初始化大小
          //缩放大小限制
          scaleLimit: {
            min: 1, //最小
            max: 2, //最大
          },
          //设置中心点
          center: [115.97, 29.71],
          //省份地图添加背景
          regions: this.regions,
          itemStyle: {
            areaColor: '#DCDCDC',
            color: 'red',
            borderColor: '#232652',
            borderWidth: 1.5,
          },
          //高亮状态
          emphasis: {
            itemStyle: {
              areaColor: '#1af9e5',
              color: '#fff',
            },
          },
        },

        series: {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: this.scatter,
          showEffectOn: 'render',
          rippleEffect: {
            //涟漪特效相关配置
            brushType: 'stroke', //波纹的绘制方式，可选 'stroke' 和 'fill'
          },
          hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
          label: {
            //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等，
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true,
            },
          },
          itemStyle: {
            //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时
            normal: {
              color: '#ffffff', //散点的颜色
              shadowBlur: 10,
              shadowColor: 20,
              fontSize: '12px',
            },
          },
          zlevel: 1,
        },
      })
    this.myChart.on('click', (params) => {
      if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
        const city = params.data.name;
        if(city === "北京(云节点 1)"){
          sessionStorage.setItem("nodename", "master1");
          sessionStorage.setItem("ip", "39.98.124.97");
        }
        if(city === "青岛(边节点 1)"){
          sessionStorage.setItem("nodename", "worker1");
          sessionStorage.setItem("ip", "39.101.136.242");
        }
        if(city === "海南(边节点 2)"){
          sessionStorage.setItem("nodename", "worker2");
          sessionStorage.setItem("ip", "39.98.109.31");
        }
        if(city === "上海(边节点 3)"){
          sessionStorage.setItem("nodename", "worker3");
          sessionStorage.setItem("ip", "39.99.252.93");
        }
        router.push("/podlist")
      }
    });*/

    // })
  },
  methods:{
    drawChina(){
      // $.get('../assets/world.json', function (geoJson) {/* 请求世界地图的本地json数据 */
      this.myChart = echarts.init(document.getElementById('myEchart'));/* 初始画布 */
      echarts.registerMap('world', geoJson);/* 注册world地图 */
      this.myChart.setOption({/* 设置myChart配置项 */
        tooltip: {
          trigger: 'item',
          formatter: '{b}'
        },

        geo: {
          map: 'world',
          roam: true, //是否允许缩放，拖拽
          zoom: 1.2, //初始化大小
          //缩放大小限制
          scaleLimit: {
            min: 1, //最小
            max: 2, //最大
          },
          //设置中心点
          center: [115.97, 29.71],
          //省份地图添加背景
          regions: this.regions,
          itemStyle: {
            areaColor: '#DCDCDC',
            color: 'red',
            borderColor: '#232652',
            borderWidth: 1.5,
          },
          //高亮状态
          emphasis: {
            itemStyle: {
              areaColor: '#1af9e5',
              color: '#fff',
            },
          },
        },

        series: {
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: this.scatter,
          showEffectOn: 'render',
          rippleEffect: {
            //涟漪特效相关配置
            brushType: 'stroke', //波纹的绘制方式，可选 'stroke' 和 'fill'
          },
          hoverAnimation: true, //是否开启鼠标 hover 的提示动画效果
          label: {
            //图形上的文本标签，可用于说明图形的一些数据信息，比如值，名称等，
            normal: {
              formatter: '{b}',
              position: 'right',
              show: true,
            },
          },
          itemStyle: {
            //图形样式，normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时
            normal: {
              color: '#ffffff', //散点的颜色
              shadowBlur: 10,
              shadowColor: 20,
              fontSize: '12px',
            },
          },
          zlevel: 1,
        },
      })
      this.myChart.on('click', (params) => {
        if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
          const city = params.data.name;
          if(city === "北京(云节点 1)"){
            sessionStorage.setItem("nodename", "master1");
            sessionStorage.setItem("ip", "39.98.124.97");
            sessionStorage.setItem("nodetype", "云");
          }
          if(city === "青岛(边节点 1)"){
            sessionStorage.setItem("nodename", "worker1");
            sessionStorage.setItem("ip", "39.101.136.242");
            sessionStorage.setItem("nodetype", "边");
          }
          if(city === "海南(边节点 2)"){
            sessionStorage.setItem("nodename", "worker2");
            sessionStorage.setItem("ip", "39.98.109.31");
            sessionStorage.setItem("nodetype", "边");
          }
          if(city === "上海(边节点 3)"){
            sessionStorage.setItem("nodename", "worker3");
            sessionStorage.setItem("ip", "39.99.252.93");
            sessionStorage.setItem("nodetype", "边");
          }
          this.$router.push("/machineinfo")
          // router.push("/podlist")
        }
      });
    }
  }
};
</script>