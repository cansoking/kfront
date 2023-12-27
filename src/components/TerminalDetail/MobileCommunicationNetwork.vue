<template>
  <div><slot></slot></div>

  <!-- <div id="main" style="height: 500px;"></div> -->
</template>

<script>
//全部引入
// import * as echarts from 'echarts';
//按需引入
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);
import { onBeforeMount, onMounted } from "vue";
export default {
  setup() {
    //让图标随浏览器大小变化而变化，貌似没用，所以注释了
    // onBeforeMount(()=>{
    //     window.addEventListener('resize',resizeChart)
    // })

    // function resizeChart(){
    //     myChart?.resize();
    // }

    onMounted(() => {
      let container = document.getElementById("MobileCommunicationNetwork"); //获取容器
      // var myChart = echarts.init(document.getElementById('main'));
      var myChart = echarts.init(container); //运用了插槽，从父组件传来的模板
      function randomData() {
        now = new Date(+now + oneSecond); //创建一个Date对象，可以用toString获取日期值，或者其他参数获取年月日
        //这里时间是一天一天地增加的，如果要时间一秒一秒地增加，oneDay需要修改，oneDay数据是以毫秒为单位
        value = value + Math.random() * 21 - 10;
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        let string = [hour, minute, second].join(":");
        date.push(string); //每当执行data.push()时，也会执行date.push()
        return {
          name: now.toString(),
          value: [string, 
          //把数值暂时全都改为0
          // Math.round(value)
          0],
        };
      }

      //初始化数据
      let data = []; //y轴数据
      let date = []; //x轴数据（时间）
      let now = new Date(1997, 9, 3);
      // let oneDay = 24 * 3600 * 1000;//1天
      let oneSecond = 1000; //1秒
      let value = Math.random() * 1000;
      for (var i = 0; i < 1000; i++) {
        //先往data数组中加1000个数据
        data.push(randomData());
      }

      myChart.setOption({
        title: {
          text: "移动通信网络流量",
          textStyle: {
            color: "rgba(255,255,255,1)",
          },
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          formatter: function (params) {
            params = params[0];
            var date = new Date(params.name);
            return (
              date.getHours() +
              ":" +
              date.getMinutes() +
              ":" +
              date.getSeconds() +
              " / " +
              params.value[1]
            );
          },
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "category", //从原本的time改成了category类型
          splitLine: {
            show: false,
          },
          data: date, //数据来自date数组
          axisLine: {
            lineStyle: {
              color: "#FFF",
            },
          },
          axisTick: false,
        },
        yAxis: {
          name: "单位:KB/s",
          nameTextStyle: {
            padding: [0, 40, 0, 0],
          },
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false,
          },
          //y轴数据来自series
          axisLine: {
            lineStyle: {
              color: "#FFF",
            },
            show: true,
          },
        },
        series: [
          {
            name: "Fake Data",
            type: "line",
            showSymbol: false,
            data: data,
            itemStyle: {
              color: "#ffe119",
            },
          },
        ],
        grid: {
          top: "16%",
          left: "13%",
          right: "3%",
          bottom: "10%",
        },
      });

      // window.addEventListener('resize',function(){
      //         myChart.resize()
      // });

      //每隔1000毫秒添加一次数据
      setInterval(function () {
        //1秒执行5次操作
        // for (var i = 0; i < 5; i++) {
        //     data.shift();//从数组中移除数据
        //     data.push(randomData());
        // }

        //1秒增加1次数据
        data.shift();
        date.shift();
        data.push(randomData());
        //date的push在randomData()中
        myChart.setOption({
          //貌似其他设置不会改变
          xAxis: { data: date },
          series: [
            {
              data: data,
            },
          ],
        });
      }, 1000);

      //当option不空时setOpion
      // option && myChart.setOption(option);

      //让图表随浏览器大小变换而变换
      let resizeObserver = new ResizeObserver(() => myChart?.resize());
      resizeObserver.observe(container);
    });
  },
};
</script>