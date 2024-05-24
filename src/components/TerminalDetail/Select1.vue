<template>
  <!-- element的暗黑模式,需要设置html标签类型为dark-->
  <html class="dark">
    <div class="wrap">
      <div class="dark-select">
        <el-select
          class="m-2"
          v-model="selectedOption"
          placeholder="传输策略选择"
          popper-class="blueBack"
        >
          <el-option
            v-for="item in options"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
  </html>
</template>
  
<script lang="ts" setup>
import Vue, { onMounted, ref, watch ,defineProps,computed,onBeforeUnmount} from "vue";
import axios from 'axios';
import store from '../../store/index'

var ipandport2 = ref(null);
const selectedTerminal = computed(() => store.getters.getSelectedTerminal);
ipandport2 = selectedTerminal.value.ipandport2;
console.log(ipandport2);

const  props = defineProps({
  getCurrentPriority:{
    type:Function,
    required:true,
  }
});






const priority = ref([2,3,4,0]);//分别对应WAN6,WAN2和4G,最后一位代表要关闭和重新开启的路由器接口组组号

const selectedOption = ref(null);

const options = [
{
    value: [2,3,4,0],
    label: "低轨优先",
  },
  {
    value: [3,2,4,1],
    label: "高轨优先",
  },
  {
    value: [3,4,2,2],
    label: "移动通信网络优先",
  },
  {
    value: [2,3,4,3],
    label: "智能多路径传输",
  },
];


const websocketAddress = process.env.VUE_APP_ACCESSPOINT_WEBSOCKET;//webSocket连接来获取接入点信息的路径，通常是服务器的地址

const socket = new WebSocket(websocketAddress+":8887/websocket");
socket.onopen = function(event){
    console.log("WebSocket连接已建立");
    // const messageForNetNum = {
    // function:'countConnectNum',
    // parameters:{
    //   ipAndPort:ipandport1
    // }
    // }
    // sendMessage(JSON.stringify(messageForNetNum));
    // const messageForPriority = {
    // function:'countPriority',
    // parameters:{
    //   ipAndPort:ipandport1
    // }
    // }
    // sendMessage(JSON.stringify(messageForPriority));
}

socket.onmessage = function(event){
  // var message = event.data;
  // message = JSON.parse(message);
  
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
    console.log('切换优先级组件已发送消息：', message);
}

// 关闭WebSocket连接
function closeWebSocket() {
    socket.close();
}

const updatePriority = () =>{
  if(selectedOption.value){
    priority.value = selectedOption.value;
  }
}

watch(selectedOption,()=>{
  updatePriority();
  // sendRequest();//利用12条post指令设置网络优先级
  setPriorityBySSH();//利用脚本设置网络优先级 
  // test();
});

// function test(){
//   let data = {
//     name:"Alice"
//   }
//   axios({
//   method:"post",
//   headers:{
//   'Content-Type':'application/json'
//   },
//   data:JSON.stringify(data),
//   url:"http://59.110.238.62:8080/test",
//   responseType:"json"
//   })
//   .then((response)=>{
//     console.log("调用脚本设置低轨优先成功");
//   })
//   .catch((error)=>{
//   console.log(error);
//   console.log("调用脚本设置低轨优先失败");
//   })
// }

function setPriorityBySSH(){
  var message = {
    function:'',
    parameters:{
      ipAndPort:ipandport2
    }
    }
  switch(priority.value[3]){
      case 0:
        // setLowOrbitPriority();
        message.function = 'transLow';
        
        break;
      case 1:
        message.function = 'transHigh';
        // setHighOrbitPriority();
        break;
      case 2:
        message.function = 'transMobile';
        // setMobilePriority();
        break;
      case 3:
        message.function = 'transMulti';
        // setIntelligentPriority();
        break;
    }
    sendMessage(JSON.stringify(message));//webSocket调用方法
}



const url_ssh = process.env.VUE_APP_API_URI_SSH;//使用ssh设置网络优先级的url

//调用脚本设置低轨优先
function setLowOrbitPriority(){
  let data = {
    command: './low_orbit_priority.sh',
    host: '59.110.238.62',
    port:'1011',
    username: 'root',
    password: 'password' 
  }
  axios({
  method:"post",
  headers:{
  'Content-Type':'application/json'
  },
  data:JSON.stringify(data),
  url:url_ssh,
  // url:"http://59.110.238.62:8080/execute_ssh",
  responseType:"json"
  })
  .then((response)=>{
    console.log("调用脚本设置低轨优先成功");
    // props.getCurrentPriority();
  })
  .catch((error)=>{
  console.log(error);
  console.log("调用脚本设置低轨优先失败");
  })
}

//调用脚本设置高轨优先
function setHighOrbitPriority(){
  let data = {
    command: "./high1_orbit_priority.sh",
    host: "59.110.238.62",
    port:"1011",
    username: "root",
    password: "password" 
  }   
  axios({
  method:"post",
  headers:{
  'Content-Type':'application/json'
  },
  data:JSON.stringify(data),
  url:url_ssh,//本地用这条
  // url:"http://59.110.238.62:8080/execute_ssh",
  responseType:"json"
  })
  .then((response)=>{
    console.log("调用脚本设置高轨优先成功");
    // props.getCurrentPriority();
  })
  .catch((error)=>{
  console.log(error);
  console.log("调用脚本设置高轨优先失败");
  })
}

//调用脚本设置移动网络优先
function setMobilePriority(){
  let data = {
    command: "./mobile_network_orbit_priority.sh",
    host: "59.110.238.62",
    port:"1011",
    username: "root",
    password: "password" 
  }   
  axios({
  method:"post",
  headers:{
  'Content-Type':'application/json'
  },
  data:JSON.stringify(data),
  url:url_ssh,//本地用这条
  // url:"http://59.110.238.62:8080/execute_ssh",
  responseType:"json"
  })
  .then((response)=>{
    console.log("调用脚本设置移动网络优先成功");
    // props.getCurrentPriority();
  })
  .catch((error)=>{
  console.log(error);
  console.log("调用脚本设置移动网络优先失败");
  })
}

//调用脚本设置智能多路径
function setIntelligentPriority(){
  let data = {
    command: './multi_path.sh',
    host: '59.110.238.62',
    port:'1011',
    username: 'root',
    password: 'password' 
  }
  axios({
  method:"post",
  headers:{
  'Content-Type':'application/json'
  },
  data:JSON.stringify(data),
  url:url_ssh,
  // url:"http://59.110.238.62:8080/execute_ssh",
  responseType:"json"
  })
  .then((response)=>{
    console.log("调用脚本设置智能多路径优先成功");
    // props.getCurrentPriority();
  })
  .catch((error)=>{
  console.log(error);
  console.log("调用脚本设置智能多路径优先失败");
  })
}


const url = process.env.VUE_APP_API_URI_ROUTE;//统一的url(通过post请求改变网络优先级)


// sendRequest();//初次加载设置为默认优先级（现在初始时不设置优先级）

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
  url:url,//本地用这条
  // url:urlDeploy,//服务器上用这条
  responseType:"json"
  })
  .then((response)=>{
  const sessionValue = response.data.result[1].ubus_rpc_session;//返回sessionValue
  resolve(sessionValue);
  })
  .catch((error)=>{
  console.log(error);
  console.log("获取Session但fail");
  reject(error);
  })
  });
}


//准备、发送请求
async function sendRequest(){
  const sessionValue = await getSession();
  //现在每次设置优先级需要发送8调指令

  //1、设置低轨通信优先级
  let setWAN_first = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "set",
        {
            config: "network",
            section: "wan",
            values: {
              metric:priority.value[0]
            } 
            
        }
    ]
  }

  //1、设置高轨通信优先级
  let setWAN2_first = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "set",
        {
            config: "network",
            section: "wan2",
            values: {
              metric:priority.value[1]
            } 
        }
    ]
  }

  //1、设置4G通信优先级
  let set4G_first = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "set",
        {
            config: "network",
            section: "4G",
            values: {
              metric:priority.value[2]
            } 
        }
    ]
  }

  //2、设置低轨通信优先级
  let setWAN_second = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "set",
        {
            config: "mwan3",
            section: "wan_m1_w1",
            values: {
              metric:priority.value[0]
            } 
            
        }
    ]
  }

  //当传输策略为智能多路径传输的情况，第二次设置高轨优先级要设置为和低轨优先级相同，都是2
  if(priority.value[3]===3){
    priority.value[1] = 2;
  }

  //2、设置高轨通信优先级
  let setWAN2_second = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "set",
        {
            config: "mwan3",
            section: "wan2_m1_w1",
            values: {
              metric:priority.value[1]
            } 
        }
    ]
  }

  //2、设置4G通信优先级
  let set4G_second = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "set",
        {
            config: "mwan3",
            section: "4G_m1_w1",
            values: {
              metric:priority.value[2]
            } 
        }
    ]
  }

  //1、用于调用“发送请求”的接口的数据
  let dataforRequest_first = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "commit",
        {
            config: "network"
        }
    ]
  }

  //2、用于调用“发送请求”的接口的数据
  let dataforRequest_second = {
    jsonrpc: "2.0",
    id: 1,
    method: "call",
    params: [
        sessionValue,
        "uci",
        "commit",
        {
            config: "mwan3"
        }
    ]
  }


  //第一次低轨请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(setWAN_first),
  url:url,
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("第一次设置低轨优先级成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第一次低轨优先级设置失败");
  })

  //第一次高轨请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(setWAN2_first),
  url:url,
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("第一次设置高轨优先级成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第一次高轨优先级设置失败");
  })

  //第一次运营商请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(set4G_first),
  url:url,
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("第一次设置运营商优先级成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第一次运营商优先级设置失败");
  })

  //第二次低轨请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(setWAN_second),
  url:url,
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("第二次设置低轨优先级成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第二次低轨优先级设置失败");
  })

  //第二次高轨请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(setWAN2_second),
  url:url,
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("第二次设置高轨优先级成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第二次高轨优先级设置失败");
  })

  //第二次运营商请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(set4G_second),
  url:url,
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("第二次设置运营商优先级成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第二次运营商优先级设置失败");
  })

  //第一次发送请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(dataforRequest_first),
  url:url,
  })
  .then((response)=>{
    console.log(response.data.result[0]);
    if(response.data.result[0]===0){
      console.log("第一次发送请求成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第一次发送请求但是fail");
  })

  //第二次发送请求
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(dataforRequest_second),
  url:url,
  })
  .then((response)=>{
    console.log(response.data.result[0]);
    if(response.data.result[0]===0){
      console.log("第二次发送请求成功");
    }
  })
  .catch((error)=>{
  console.log(error);
  console.log("第二次发送请求但是fail");
  })


  

  //智能路径的情况不执行接下啦的语句
  if(priority.value[3]!==3){
    
    //等待1秒后继续之后的操作
    await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
    // 在1秒后继续执行其他语句
    console.log("1秒后继续执行其他语句");

    var interfaces = [];//需要关闭和重新打开的接口组
    switch(priority.value[3]){
      case 0:
        interfaces.push("network.interface.wan2");
        interfaces.push("network.interface.4G");
        break;
      case 1:
        interfaces.push("network.interface.wan");
        interfaces.push("network.interface.4G");
        break;
      case 2:
        interfaces.push("network.interface.wan");
        interfaces.push("network.interface.wan2");
        break;
    }
    //调用关闭接口函数
    await shutInterface(interfaces,sessionValue);

    //等待10秒后继续之后的操作
    await new Promise(resolve => {
      setTimeout(resolve, 10000);
    });
    // 在10秒后继续执行其他语句
    console.log("10秒后继续执行其他语句");

    //调用开启接口函数
    await openInterface(interfaces,sessionValue);

  }

  
  
}

//关闭路由器接口
async function shutInterface(arr,sessionValue){
  //要关闭的第一个口的data
  let shut1 = {
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params: [
          sessionValue,
          arr[0],
          "down",
          {}
      ]
  }  
  //要关闭的第二个口的data
  let shut2 = {
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params: [
          sessionValue,
          arr[1],
          "down",
          {}
      ]
  }  

  console.log("arr[0]",arr[0]);
  console.log("arr[1]",arr[1]);
  console.log("sessionValue",sessionValue);

  var flag = false;//请求是否能发送除去
  //一直执行得到请求发送成功之后，才停止发送这条请求，发送下一条
  while(!flag){
    await axios({
      method:"post",
      headers:{
      'Content-Type':'application/json;'
      },
      data:JSON.stringify(shut1),
      url:url,//本地用这条
      responseType:"json"
    })
    .then((response)=>{
      if(response.data.result[0]===0){
        console.log("关闭接口1成功");
        flag = true;
      }
    })
    .catch((error)=>{
      console.log(error);
      console.log("关闭接口1失败");
    });
  }
  
  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(shut2),
  url:url,//本地用这条
  responseType:"json"
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("关闭接口2成功");
    }
  })
  .catch((error)=>{
    console.log(error);
    console.log("关闭接口2失败");
  });
}

//开启路由器接口
async function openInterface(arr,sessionValue){
  //要关闭的第一个口的data
  let open1 = {
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params: [
          sessionValue,
          arr[0],
          "up",
          {}
      ]
  }  
  //要关闭的第二个口的data
  let open2 = {
      jsonrpc: "2.0",
      id: 1,
      method: "call",
      params: [
          sessionValue,
          arr[1],
          "up",
          {}
      ]
  }  

  console.log("arr[0]",arr[0]);
  console.log("arr[1]",arr[1]);
  console.log("sessionValue",sessionValue);

  var flag = false;//请求是否能发送除去
//一直执行等到请求发送成功之后，才停止发送这条请求，发送下一条
  while(!flag){
    await axios({
      method:"post",
      headers:{
      'Content-Type':'application/json;'
      },
      data:JSON.stringify(open1),
      url:url,//本地用这条
      responseType:"json"
    })
    .then((response)=>{
      if(response.data.result[0]===0){
        console.log("开启接口1成功");
        flag = true;
      }
    })
    .catch((error)=>{
      console.log(error);
      console.log("开启接口1失败");
    });
  }
  

  await axios({
  method:"post",
  headers:{
  'Content-Type':'application/json;'
  },
  data:JSON.stringify(open2),
  url:url,//本地用这条
  responseType:"json"
  })
  .then((response)=>{
    if(response.data.result[0]===0){
      console.log("开启接口2成功");
    }
  })
  .catch((error)=>{
    console.log(error);
    console.log("开启接口2失败");
  });
}


onBeforeUnmount(() => {

  closeWebSocket();
});





</script>
  
<style lang="less">
//注意！！！
//注意！！！
//注意！！！
//Select1和Select2使用的是同一个类名，所以样式的改变是互通的

// .el-select-dropdown {
//   background: #000;
// }

.dark {
  //设置Select下边距
  margin: 0 0 10px;

  //select选择器宽度
  .el-select {
    width: 500px;
  }
}

.blueBack {
  .el-select-dropdown__list {
    border: none !important; //不起作用
    background: rgb(13, 13, 100) !important;
    z-index: 9999;
  }
  .el-select-dropdown__item {
    font-size: 17px; /* 设置字体大小 */
    font-weight: 500;
    font-family: sans-serif;
    color: rgba(255, 255, 255, 0.7) !important;
    z-index: 9999;
  }
}

//blueBack是我设置的select下拉框的类名，这样可以不用样式穿透也能防止样式污染
.blueBack .el-select-dropdown {
  border: none !important; //不起作用
  background: rgb(13, 13, 100) !important;
  z-index: 9999;
}

.blueBack .el-select-dropdown .el-select-dropdown__item {
  font-size: 17px; /* 设置字体大小 */
  font-weight: 500;
  font-family: sans-serif;
  color: rgba(255, 255, 255, 0.7) !important;
  z-index: 9999;
}

// ok
// // option选项 文字样式
// .el-select-dropdown__item {
//   color: rgba(255, 255, 255,0.7 ) !important;
//   z-index: 9999;
// }

.dark-select {
  // 修改input默认值颜色 兼容其它主流浏览器
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255);
  }
  input::-moz-input-placeholder {
    color: rgba(255, 255, 255);
  }
  input::-ms-input-placeholder {
    color: rgba(255, 255, 255);
  }

  //   // 鼠标悬浮时 input框颜色
  //   .el-input__inner:hover{
  //     background-color: rgba(207, 27, 27, 0.12);
  //   }
  //   // input框 右侧的箭头
  //   .el-select .el-input .el-select__caret {
  //         color: rgba(255, 255, 255, 0.50);
  //   }

  // 	// 下拉框垂直滚动条宽度
  //   .el-scrollbar__bar.is-vertical {
  //          width: 10px;
  //          top: 2px;
  //      }
  //     // 下拉框最大高度
  //   .el-select-dropdown__wrap {
  //          max-height: 200px;
  //   }
}

// option选项 上面的箭头
// .el-popper[x-placement^="bottom"] .popper__arrow::after {
//       border-bottom-color: rgba(43, 45, 55, 0.80);
//       z-index: 9999;
// }

// .popper__arrow {
//     border: none !important;//不起作用
// }

//被选择后颜色
.el-select-dropdown__item.selected span {
  color: rgba(51, 176, 188) !important;
  z-index: 9999;
}

// 移入option选项 样式调整
.blueBack .el-select-dropdown__item.hover {
  background-color: rgba(72, 43, 218, 0.8) !important; //加了!important才起作用
  color: rgb(66, 184, 238) !important;
  z-index: 9999;
}

.m-2 {
  .el-input__inner {
    //输入框样式调整
    font-size: 23px;
    height: 40px;
    font-weight: 700;
    font-family: sans-serif;
    color: white; //被选择后的文字颜色
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>