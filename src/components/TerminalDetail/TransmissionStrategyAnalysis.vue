<template>
  <div><slot></slot></div>

  <!-- <div id="main" style="height: 500px;"></div> -->
</template>

<script>
import * as echarts from "echarts";
import { onBeforeMount, onMounted, reactive ,onUnmounted} from "vue";
import axios from 'axios';
export default {
  
  setup() {
    onMounted(() => {
      let container = document.getElementById("TransmissionStrategyAnalysis"); //获取容器
      // var myChart = echarts.init(document.getElementById('main'));
      var myChart = echarts.init(container); //运用了插槽，从父组件传来的模板

      const url = process.env.VUE_APP_API_URI_NOPORT;//服务器地址

      const data = reactive({
        delayOfStart:0,
        delayOfTrans:0,
        delayOfDecode:0,
      })
      

      //获取数据方法
      function getData(){
        axios({
          method:"post",
          // url:"http://localhost:8887/file/inquireReceiveTotalInfo",//调用本地接口
          url:url+":8887/file/inquireReceiveState",//调用服务器接口
        })
        .then((response)=>{
          data.delayOfStart = response.data[0].delayOfStart.toFixed(1);
          data.delayOfTrans = response.data[0].delayOfTrans.toFixed(1);
          data.delayOfDecode = response.data[0].delayOfDecode.toFixed(1);
        })
        .catch((error)=>{
          console.log(error);
          console.log("延迟数据失败");
        })
      }
      
      

      myChart.setOption({
        grid:{
            top:"20%",
            left:"13%",
            right:"3%",
            bottom:"10%"
        },
        tooltip: {
          trigger: 'axis',
        },
        xAxis: {
          type: 'category',
          data: ['平均任务启动时延', '单包数据传输时延', '平均文件解码时延'],
          axisLabel: {
            textStyle: {
              color: "#FFF",
            },
          },
          axisLine:{
            lineStyle:{
                color:'#FFF'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: "#FFF",
            },
          },
          name: "单位:ms",
          nameTextStyle: {
            padding: [0, 20, 0, 0],
            color: "#FFF",
          },
        },
        series: [
          {
            type: 'bar',
            data: [0, 0, 0],
            itemStyle: {
               // 使用回调函数设置柱子颜色
               color: params => {
                const colors = ['#5F85DB', '#67C23A', '#E6A23C'];
                return colors[params.dataIndex];
              },
            },
          },
        ],
        title: {
          text: "时延统计分析",
          textStyle: {
            color: "#FFF",
          },
          left: "center",
        },
        // grid: [
        //   { left: "13%", top: "23%", bottom: "10%", width: "35%" },
        //   { right: "13%", top: "23%", bottom: "10%", width: "35%" },
        // ],
          
        // legend: [
        //   {
        //     // orient: 'vertical',
        //     // right: '1%',
        //     top: "8%",
        //     textStyle: {
        //       color: "#FFF",
        //       fontSize: "10",
        //     },
        //     icon: "circle",
        //     itemHeight: "6",
        //     show: "true",
        //     data: ["原始编码包", "固定编码包", "自定义编码包"],
        //   },
        //   {
        //     // orient: 'vertical',
        //     // right: '1%',
        //     top: "14%",
        //     textStyle: {
        //       color: "#FFF",
        //       fontSize: "10",
        //     },
        //     icon: "circle",
        //     itemHeight: "6",
        //     show: "true",
        //     data: ["单路径传输", "多路径传输", "智能切换传输"],
        //   },
        //   ],
        
        // tooltip: {},
        // title: {
        //   text: "时延统计分析",
        //   textStyle: {
        //     color: "#FFF",
        //   },
        //   left: "center",
        // },

        // xAxis: [
        //   {
        //     name: "编码文件大小",
        //     nameLocation: "center",
        //     nameGap: 8,
        //     nameTextStyle: {
        //       color: "#FFF",
        //     },
        //     type: "category",
        //     gridIndex: 0,
        //     axisLabel: {
        //       textStyle: {
        //         color: "#FFF",
        //       },
        //       show: false,
        //     },
        //   },
        //   {
        //     name: "平均传输时延",
        //     nameLocation: "center",
        //     nameGap: 8,
        //     nameTextStyle: {
        //       color: "#FFF",
        //     },
        //     type: "category",
        //     gridIndex: 1,
        //     axisLabel: {
        //       textStyle: {
        //         color: "#FFF",
        //       },
        //       show: false,
        //     },
        //   },
        // ],
        // yAxis: [
        //   {
        //     gridIndex: 0,
        //     axisLabel: {
        //       textStyle: {
        //         color: "#FFF",
        //       },
        //     },
        //     name: "单位:B",
        //     nameTextStyle: {
        //       padding: [0, 20, 0, 0],
        //       color: "#FFF",
        //     },
        //   },
        //   {
        //     gridIndex: 1,
        //     axisLabel: {
        //       textStyle: {
        //         color: "#FFF",
        //       },
        //     },
        //     position: "right",
        //     name: "单位:ms/Mb",
        //     nameTextStyle: {
        //       padding: [0, 0, 0, 20],
        //       color: "#FFF",
        //     },
        //   },
        // ],
        // // Declare several bar series, each will be mapped
        // // to a column of dataset.source by default.
        // series: [
        //   {
        //     type: "bar",
        //     name: "原始编码包",
        //     data: [0],
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //   },
        //   {
        //     type: "bar",
        //     name: "固定编码包",
        //     data: [data.fixedStrategy],
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //   },
        //   {
        //     type: "bar",
        //     name: "自定义编码包",
        //     data: [0],
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //   },
        //   {
        //     type: "bar",
        //     name: "单路径传输",
        //     data: [0],
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //   },
        //   {
        //     type: "bar",
        //     name: "多路径传输",
        //     data: [0],
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //   },
        //   {
        //     type: "bar",
        //     name: "智能切换传输",
        //     data: [0],
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //   },
        // ],
      });

      //每秒对图表数据进行一次更新
      const intervalId = setInterval(()=>{
        getData();
        myChart.setOption({
          series:{
            data: [data.delayOfStart,data.delayOfTrans,data.delayOfDecode],
          }
        //   series: [
        //   {
        //     type: "bar",
        //     name: "原始编码包",
        //     data: [0],
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //   },
        //   {
        //     type: "bar",
        //     name: "固定编码包",
        //     data: [data.fixedStrategy],
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //   },
        //   {
        //     type: "bar",
        //     name: "自定义编码包",
        //     data: [0],
        //     xAxisIndex: 0,
        //     yAxisIndex: 0,
        //   },
        //   {
        //     type: "bar",
        //     name: "单路径传输",
        //     data: [0],
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //   },
        //   {
        //     type: "bar",
        //     name: "多路径传输",
        //     data: [0],
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //   },
        //   {
        //     type: "bar",
        //     name: "智能切换传输",
        //     data: [0],
        //     xAxisIndex: 1,
        //     yAxisIndex: 1,
        //   },
        // ],
        })
      },1000)

      // 组件卸载时清除定时器
      onUnmounted(() => {
        clearInterval(intervalId);
      });

      //让图表随浏览器大小变换而变换
      let resizeObserver = new ResizeObserver(() => myChart?.resize());
      resizeObserver.observe(container);



    });
  },
 
  
};
</script>