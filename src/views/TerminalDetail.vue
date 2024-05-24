<template>
  <body class="detailBody">
    <header class="detailHeader">
      <h1>边缘服务器异构网络传输详情:{{cpeName}}</h1>
      <h2>当前策略：{{ currentPriority }}</h2>
      <div class="showTime"></div>
    </header>
    <!-- 页面主题部分 -->
    <section class="mainbox1">
      <div class="column">
        <Select1 :getCurrentPriority="getCurrentPriority"></Select1>
        <LeoSatellite>
          <div id="LeoSatellite" class="panel line">
            <div class="panel-footer"></div>
          </div>
        </LeoSatellite>
        <HighOrbitSatellite>
          <div id="HighOrbitSatellite" class="panel bar">
            <div class="panel-footer"></div>
          </div>
        </HighOrbitSatellite>
        <MobileCommunicationNetwork>
          <div id="MobileCommunicationNetwork" class="panel pie">
            <div class="panel-footer"></div>
          </div>
        </MobileCommunicationNetwork>
      </div>
      <div class="column">
        <!-- no模块制作 -->
        <div class="no">
          <div class="no-hd">
            <ul>
              <li>{{ cpeNum }}</li>
              <li>{{ netNum }}</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>接入点数量</li>
              <li>异构网络数量</li>
            </ul>
          </div>
        </div>
        <!-- 地图模块 -->
        <div class="map">
          <div class="map1"></div>
          <div class="map2"></div>
          <div class="map3"></div>
          <div class="chart"></div>
        </div>
      </div>
      <div class="column">
        <Button @custom-click="goToPage"></Button>

        <CurrentMissionStatus>
          <div class="panel bar2">
            <div id="CurrentMissionStatus"></div>
            <div class="more" @click="goToList">More></div>
            <div class="panel-footer"></div>
          </div>
        </CurrentMissionStatus>
        <DataTrafficStatistics>
          <div id="DataTrafficStatistics" class="panel pie">
            <div class="panel-footer"></div>
          </div>
        </DataTrafficStatistics>
        <TransmissionStrategyAnalysis>
          <div id="TransmissionStrategyAnalysis" class="panel line">
            <div class="panel-footer"></div>
          </div>
        </TransmissionStrategyAnalysis>
      </div>
    </section>
  </body>
</template>





<script setup>
import HighOrbitSatellite from "../components/TerminalDetail/HighOrbitSatellite.vue";
import LeoSatellite from "../components/TerminalDetail/LeoSatellite.vue";
import MobileCommunicationNetwork from "../components/TerminalDetail/MobileCommunicationNetwork.vue";
import CurrentMissionStatus from "../components/TerminalDetail/CurrentMissionStatus.vue";
import TransmissionStrategyAnalysis from "../components/TerminalDetail/TransmissionStrategyAnalysis.vue";
import DataTrafficStatistics from "../components/TerminalDetail/DataTrafficStatistics.vue";
import Select1 from "../components/TerminalDetail/Select1.vue";
import Select2 from "../components/TerminalDetail/Select2.vue";
import Button  from "../components/TerminalDetail/Button.vue";
import store from '../store/index'

// import { useRouter } from 'vue-router';
import router from "@/router";
import axios from 'axios';
import {onMounted, ref,onBeforeUnmount,computed} from 'vue';





const url = process.env.VUE_APP_API_URI_ROUTE;//统一的url
var netNum = ref(0);//当前网络连接数
var cpeNum = ref(0);//当前在线接入点数量

var cpeName = ref(null);
var ipandport1 = ref(null);
const selectedTerminal = computed(() => store.getters.getSelectedTerminal);
cpeName = selectedTerminal.value.name;
console.log(cpeName);
ipandport1 = selectedTerminal.value.ipandport1;
var ip = ipandport1.split(':')[0]+":"+ipandport1.split(':')[1];//获取当前在线cpe数量时传递的参数
console.log(ipandport1);

var currentPriority = ref(null);//当前优先级

const socket = new WebSocket("ws://59.110.238.62:8887/websocket");
socket.onopen = function(event){
    console.log("WebSocket连接已建立");
    const messageForNetNum = {
      function:'countConnectNum',
      parameters:{
      ipAndPort:ipandport1
      }
    }
    sendMessage(JSON.stringify(messageForNetNum));
    const messageForPriority = {
    function:'countPriority',
    parameters:{
      ipAndPort:ipandport1
    }
    }
    sendMessage(JSON.stringify(messageForPriority));
    const messageForCPENum = {
    function:'countAccessPointNum',
    parameters:{
      ip:ip
    }
    }
    sendMessage(JSON.stringify(messageForCPENum));
}

socket.onmessage = function(event){
  var message = event.data;
  message = JSON.parse(message);
  // console.log(event);
  if(message[0]==="countConnectNum"){
    var messageofNetNum = message[1];
    netNum.value = messageofNetNum;
    console.log("网络连接数：",netNum.value);
  }
  if(message[0]==="countPriority"){
    // console.log(message[1]);
    var messageofPriority = message[1];
    currentPriority.value = messageofPriority;
  }
  if(message[0]==="countAccessPointNum"){
    // console.log(message[1]);
    var messageofCPENum = message[1];
    cpeNum.value = messageofCPENum;
    console.log("接入点数量：",cpeNum.value);
  }
    
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
    console.log('网络连接数组件已发送消息：', message);
}

// 关闭WebSocket连接
function closeWebSocket() {
    socket.close();
}

// const router = useRouter();
const goToList = () => {
  router.push("/messionList");
};



const goToPage = () =>{
  window.open(ipandport1, '_blank');
  console.log("点击按钮");
};



//获取session
function getSession(){
  return new Promise((resolve, reject) => {
  let data = {
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params: [
          "00000000000000000000000000000000",
          "session",
          "login",
          {
              username: "root",
              password: "password",
              timeout:7200
          }
      ]
  }   
  axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(data),
  url:url,
  responseType:"json"
  })
  .then((response)=>{
  const sessionValue = response.data.result[1].ubus_rpc_session;
  resolve(sessionValue);
  })
  .catch((error)=>{
  console.log(error);
  console.log("fail");
  reject(error);
  })
  });
}


//获取当前网络连接数
async function countNetNum(){
  const sessionValue = await getSession();
  let data = {
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params: [
          sessionValue,
          "mwan3",
          "status",
          {
          }
      ]
  }
  axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(data),
  url:url,
  })
  .then((response)=>{
        // netNum.value = response.data.result[1].statistics.rx_bytes+response.data.result[1].statistics.tx_bytes;
        // console.log(response.data.result[1].interfaces);
        var interfaces = response.data.result[1].interfaces;
        var count = 0 ;
        var keys = Object.keys(interfaces);
        for(var i=0;i<keys.length;i++){
          var interfaceName = keys[i];
          var status = interfaces[interfaceName].status;
          if(status === "online"){
            count++;
          }
        }
        netNum.value = count;
        console.log(netNum.value);

  })
  .catch((error)=>{
  console.log(error);
  console.log("fail2");
  })
}


//获取当前优先级
async function getCurrentPriority(){
  const sessionValue = await getSession();
  var array = [];
  let wanMetric = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "get",
        { 
          config: "mwan3", 
          section:"wan_m1_w1"
        }
    ]
  }
  let wan2Metric = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "get",
        { 
          config: "mwan3", 
          section:"wan2_m1_w1"
        }
    ]
  }
  
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(wanMetric),
  url:url,
  })
  .then((response)=>{
    console.log("低轨跃点数：",response.data.result[1].values.metric);
    array.push(response.data.result[1].values.metric);
  })
  .catch((error)=>{
    console.log(error);
    console.log("获取低轨跃点数失败");
  })
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(wan2Metric),
  url:url,
  })
  .then((response)=>{
    console.log("高轨跃点数：",response.data.result[1].values.metric);
    let metric = response.data.result[1].values.metric;
    array.push(metric);
    console.log(array[0],array[1]);
    if(array[0]==='2'&&array[1]==='2'){
      currentPriority.value="智能多路径传输";
    }
    else if(array[0]==='2'){
      currentPriority.value="低轨优先";
    }
    else if(array[1]==='2'){
      currentPriority.value="高轨优先";
    }
    else{
      currentPriority.value="移动通信网络优先";
    }
  })
  .catch((error)=>{
    console.log(error);
    console.log("获取高轨跃点数失败");
  })
}

// getCurrentPriority();//初始获取一次优先级

// countNetNum();//设置初始网络连接数

var timerID;//定时器
var timerPriority;//获取优先级的计时器

// 在组件挂载时启动定时器
onMounted(() => {
  // // 设置定时器，每隔一秒执行一次
  // timerID = setInterval(countNetNum, 3000);
  // // //获取优先级，3秒一次
  // timerPriority = setInterval(getCurrentPriority,3000);
});

// 在组件卸载前清除定时器
onBeforeUnmount(() => {
  // 在此处清除定时器
  // clearInterval(timerID);
  // clearInterval(timerPriority);
  closeWebSocket();
});

</script>








<style  lang="less" >
//css初始化
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
li {
  list-style: none; //去掉小圆点
}

//设置背景
.detailBody {
  background: url(../assets/images/bg.jpg) no-repeat top center;
  background-size: 100% 100%;
  line-height: 1.15;
}
//头部的盒子
.detailHeader {
  position: relative;
  height: 100px;
  background: url(../assets/images/head_bg.png) no-repeat;
  background-size: 100% 100%;
  h1 {
    font-size: 38px;
    color: #fff;
    text-align: center;
    line-height: 80px;
  }
  h2 {
    font-size: 28px;
    color: #fff;
    text-align: center;
    line-height: 20px;
  }
}

// 页面主体的盒子
.mainbox1 {
  display: flex;

  min-width: 1024px;
  max-width: 1920px;
  margin: 0 auto;
  padding: 10px 10px 0;

  .column {
    flex: 3;
  }
  .column:nth-child(2) {
    flex: 5;
    margin: 10px 15px;
  }
  .panel {
    position: relative;
    height: 310px;
    border: 1px solid rgba(25, 186, 139, 0.17);
    background: url(../assets/images/line.png) rgba(255, 255, 255, 0.04);
    // padding: 15px 40px;
    margin-bottom: 15px;
    //上面两个角
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      border-left: 2px solid #02a6b5;
      border-top: 2px solid #02a6b5;
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      width: 10px;
      height: 10px;
      border-right: 2px solid #02a6b5;
      border-top: 2px solid #02a6b5;
    }
    //下面两个角
    .panel-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      &::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 10px;
        height: 10px;
        border-left: 2px solid #02a6b5;
        border-bottom: 2px solid #02a6b5;
      }
      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        width: 10px;
        height: 10px;
        border-right: 2px solid #02a6b5;
        border-bottom: 2px solid #02a6b5;
      }
    }
    h2 {
      height: 48px;
      color: #fff;
      line-height: 48px;
      font-size: 20px;
      text-align: center;
      font-weight: 400;
    }

    //设置图表高度
    #CurrentMissionStatus {
      height: 310px;
    }

    //设置more按钮位置
    .more {
      position: absolute;
      top: 25px;
      right: 20px;
      color: #00cccc;
      font-size: 16px;
    }
  }
}

// no数字模块
.no {
  background: rgba(101, 132, 226, 0.1);
  padding: 15px;
  .no-hd {
    border: 1px solid rgba(25, 186, 139, 0.17);
    position: relative;
    &::before {
      width: 30px;
      height: 10px;
      left: 0;
      top: 0;
      border-top: 2px solid #02a6b5;
      border-left: 2px solid #02a6b5;
      position: absolute;
      content: "";
    }
    &::after {
      width: 30px;
      height: 10px;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid #02a6b5;
      border-right: 2px solid #02a6b5;
      position: absolute;
      content: "";
    }
    ul {
      display: flex;
      li {
        position: relative;
        flex: 1;
        line-height: 80px;
        font-size: 70px;
        color: #ffeb7b;
        text-align: center;
        font-family: "electronicFont";
        &:nth-child(1)::after {
          width: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          height: 50%;
          top: 25%;
          position: absolute;
          content: "";
          right: 0;
        }
      }
    }
  }
  .no-bd {
    ul {
      display: flex;
      li {
        flex: 1;
        text-align: center;
        color: rgba(255, 255, 255, 0.7);
        font-size: 20.4px;
        height: 40px;
        line-height: 40px;
        padding-top: 10px;
      }
    }
  }
}

//中间转动图案的样式
.map {
  height: 810px;
  position: relative;
  .map1 {
    width: 518px;
    height: 518px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url(../assets/images/map.png);
    background-size: 100% 100%;
    opacity: 0.3;
  }
  .map2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 643px;
    height: 643px;
    background: url(../assets/images/lbx.png);
    background-size: 100%;
    animation: rotate1 15s linear infinite; //动画属性：播放动画rotate1，时常15s 匀速 无限循环
    opacity: 0.6;
  }

  @keyframes rotate1 {
    //与animation合用定义了两个关键帧
    form {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  .map3 {
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0.6;
    transform: translate(-50%, -50%);
    width: 566px;
    height: 566px;
    background: url(../assets/images/jt.png);
    background-size: 100%;
    animation: rotate2 15s linear infinite;
  }

  @keyframes rotate2 {
    //与animation合用定义了两个关键帧
    form {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(-360deg);
    }
  }

  .chart {
    position: absolute;
    top: 0;
    left: 0;
  }
}

.more {
  top: 0px;
  color: white;
  height: 30px;
}
</style>