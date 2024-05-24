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

      const websocketAddress = process.env.VUE_APP_ACCESSPOINT_WEBSOCKET;//webSocket连接来获取接入点信息的路径，通常是服务器的地址

      const socket = new WebSocket(websocketAddress+":8887/websocket");
      socket.onopen = function(event){
        console.log("WebSocket连接已建立");
        const message = {
          function:'inquireReceiveState',
          parameters:''
        }
        sendMessage(JSON.stringify(message));
      }

      socket.onmessage = function(event){
        var message = event.data;
        message = JSON.parse(message);
        data.delayOfStart = message[0].delayOfStart.toFixed(1);
        data.delayOfTrans = message[0].delayOfTrans.toFixed(1);
        data.delayOfDecode = message[0].delayOfDecode.toFixed(1);
        myChart.setOption({
          series:{
            data: [data.delayOfStart,data.delayOfTrans,data.delayOfDecode],
          }
        })
      }
      
      socket.onclose = function(event){
        console.error("WebSocket连接已关闭");
      }

      socket.onerror = function(error){
        console.log('WebSocket连接发生错误:', error);
      }

      // 可以通过发送数据来与后端进行通信
      function sendMessage(message) {
          socket.send(message);
          console.log('时延统计分析组件已发送消息：', message);
      }

      // 关闭WebSocket连接
      function closeWebSocket() {
          socket.close();
      }

      //获取数据方法
      function getData(){
        用axios调用接口的方法
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
        
      });

      // //每秒对图表数据进行一次更新
      // const intervalId = setInterval(()=>{
      //   getData();
      //   myChart.setOption({
      //     series:{
      //       data: [data.delayOfStart,data.delayOfTrans,data.delayOfDecode],
      //     }
        
      //   })
      // },1000)
      

      // 组件卸载时清除定时器
      onUnmounted(() => {
        // clearInterval(intervalId);
        closeWebSocket();
      });

      //让图表随浏览器大小变换而变换
      let resizeObserver = new ResizeObserver(() => myChart?.resize());
      resizeObserver.observe(container);



    });
  },
 
  
};
</script>