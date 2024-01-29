
<template>
  <div class="container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <el-aside>
        <el-menu
            @select="handleMenuItemClick"
            background-color="#f0f0f0"
            text-color="#333"
            active-text-color="#000"
        >
          <el-menu-item-group v-for="(group, index) in menuGroups" :key="index" :title="group.groupTitle">
            <el-menu-item v-for="(item, i) in group.items" :key="i" :index="item.value">{{ item.label }}</el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
    </div>
    <!-- 右边的中国地图 -->
    <div class="map-container">
      <div ref="chinaMap" class="echarts-map"></div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import * as echarts from 'echarts'
import chinaJSON from '../assets/china.json'
import { onMounted, ref } from 'vue'
import {useRouter} from "vue-router/composables";
const chinaMap = ref()
const router = useRouter()
onMounted(() => {
  drawChina()
})
let regions = [

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
]
let scatter = [
  { name: '北京(云节点 1)', value: [116.46122, 39.97886, 9] },
  { name: '海南(边节点 1)', value: [109.12, 19.12, 9] },
  { name: '青岛(边节点 1)', value: [120.30, 36.40, 9] },
  { name: '上海(边节点 2)', value: [121.47, 31.23, 9] },
]
let menuGroups = [
  {
    groupTitle: 'master',
    items: [
      { label: '北京(云节点 1)', value: '北京(master 1)' },
      // 可以根据需求添加更多菜单项
    ]
  },
  {
    groupTitle: 'worker',
    items: [
      { label: '青岛(边节点 1)', value: '青岛(worker 1)' },
      { label: '上海(边节点 2)', value: '上海(worker 2)' },
      { label: '海南(边节点 3)', value: '海南(worker 3)' },
      // 可以根据需求添加更多菜单项
    ]
  },
  // 可以添加更多菜单组
]
function handleMenuItemClick(index){
  if(index === "北京(云节点 1)"){
    sessionStorage.setItem("nodename", "master1");
    sessionStorage.setItem("ip", "39.101.136.242");
  }
  if(index === "青岛(边节点 1)"){
    sessionStorage.setItem("nodename", "worker1");
    sessionStorage.setItem("ip", "39.101.136.242");
  }
  if(index === "海南(边节点 2)"){
    sessionStorage.setItem("nodename", "worker2");
    sessionStorage.setItem("ip", "39.98.109.31");
  }
  if(index === "上海(边节点 3)"){
    sessionStorage.setItem("nodename", "worker3");
    sessionStorage.setItem("ip", "39.99.252.93");
  }
  router.push("/podlist")
}
function drawChina() {
  var myChart = echarts.init(chinaMap.value)
  echarts.registerMap('china', chinaJSON) //注册可用的地图
  var option = {
    geo: {
      map: 'china',
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
      regions: regions,
      itemStyle: {
        areaColor: '#E0FFFF',
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
    //配置属性
    series: {
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: scatter,
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
  }
  myChart.setOption(option)
  myChart.on('click', (params) => {
    if (params.componentType === 'series' && params.seriesType === 'effectScatter') {
      const city = params.data.name;
      if(city === "北京(云节点 1)"){
        sessionStorage.setItem("nodename", "master1");
        sessionStorage.setItem("ip", "39.101.136.242");
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
  });
}
</script>
<style>
.container {
  display: flex;
  height: 100vh; /* 填充整个视口高度 */
}

.sidebar {
  width: 300px; /* 侧边栏宽度 */
  background-color: #f0f0f0;
  /* 可以根据需要设置更多样式 */
}

.map-container {
  flex: 1; /* 右边地图容器填充剩余空间 */
  height: 100%; /* 填充整个父容器高度 */
}

.echarts-map {
  width: 100%;
  height: 100%;
}
</style>