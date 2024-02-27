<template>
    <div><slot></slot></div>
    
    <!-- <div id="main" style="height: 500px;"></div> -->
</template>

<script>
    //全部引入
    // import * as echarts from 'echarts';
    //按需引入
    import * as echarts from 'echarts/core';
    import {
        DatasetComponent,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent
    } from 'echarts/components';
    import { BarChart } from 'echarts/charts';
    import { CanvasRenderer } from 'echarts/renderers';
    import axios from 'axios';

    echarts.use([
        DatasetComponent,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        BarChart,
        CanvasRenderer
    ]);
    import {onBeforeMount, onMounted,onUnmounted,ref} from 'vue'
    export default{ 
        setup(){
            
            onMounted(()=>{
                let container = document.getElementById("DataTrafficStatistics");//获取容器
                // var myChart = echarts.init(document.getElementById('main'));
                var myChart = echarts.init(container);//运用了插槽，从父组件传来的模板
                const url = process.env.VUE_APP_API_URI_ROUTE;//统一的url
                var mount = ref([0,0,0]);//记录流量
                myChart.setOption( {
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
                        data: ['低轨流量', '高轨流量', '移动通信流量'],
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
                    name:'单位:MB',
                        nameTextStyle:{
                            padding:[0,10,0,0],
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
                            const colors = ['#F56C6C', '#FFC400', '#FFBBCC'];
                            return colors[params.dataIndex];
                        },
                        },
                    },
                    ],
                    title:{
                        text:'数据流量统计',
                        textStyle:{
                            color:'#FFF'
                        },
                        left:'center'
                     },

                    // title:{
                    //     text:'数据流量统计',
                    //     textStyle:{
                    //         color:'#FFF'
                    //     },
                    //     left:'center'
                    //  },
                    // legend: {
                    //     // orient:'vertical',
                    //     icon:'circle',
                    //     itemHeight:'6',
                    //     show:'true',
                        
                    //     // right:'10%' ,
                    //     top:'12%',
                    //     padding:[0,50,0,0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
                    //     textStyle:{
                    //         color:'#FFF',
                    //         fontSize:'10'
                    //     }
                    // },
                    // tooltip: {},
                    // color :['#E53A40','#EFDC05','#30A9DE'],
                    // dataset: {
                    //     source: [
                    //         //暂时隐藏数据
                    //     // ['11/21', 43.3, 85.8, 93.7],
                    //     // ['11/22', 83.1, 73.4, 55.1],
                    //     // ['11/23', 86.4, 65.2, 82.5],
                    //     ]
                    // },
                    // xAxis: { 
                    //     type: 'category' ,
                    //     axisLine:{
                    //         lineStyle:{
                    //             color:'#FFF'
                    //         }
                    //     }
                    // },
                    // yAxis: {
                    //     name:'单位:MB',
                    //     nameTextStyle:{
                    //         padding:[0,10,0,0],
                    //     },
                    //     // name:'单\n位\n:\nMB',
                    //     // nameGap:,
                    //     // nameTextStyle:{
                    //     //     padding:[0,90,0,0],
                    //     // },
                    //     // nameGap:-30,
                    //     axisLine:{
                    //         lineStyle:{
                    //             color:'#FFF'
                    //         }
                    //     },
                        
                    // },
                    // // Declare several bar series, each will be mapped
                    // // to a column of dataset.source by default.
                    // series: [{ type: 'bar',name:"亚太星通"}, { type: 'bar',name:"银河航天" }, { type: 'bar' ,name:"移动通信"}],
                    // grid:{
                    //     top:"20%",
                    //     left:"13%",
                    //     right:"3%",
                    //     bottom:"10%"
                    // } 
                });



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

                

                //获取流量总量
                async function getMount(){
                    const sessionValue = await getSession();
                    //低轨速率请求
                    let getWAN6 = {
                        jsonrpc: "2.0",
                        id: 1,
                        method: "call",
                        params: [
                            sessionValue,
                            "network.device",
                            "status",
                            {
                                name: "eth1"
                            }
                        ]
                    }
                    await axios({
                    method:"post",
                    headers:{
                    'Content-Type':'application/json;'
                    },
                    data:JSON.stringify(getWAN6),
                    url:url,
                    })
                    .then((response)=>{
                         mount.value[0] = ((response.data.result[1].statistics.rx_bytes+response.data.result[1].statistics.tx_bytes)/1048576).toFixed(1);
                    })
                    .catch((error)=>{
                    console.log(error);
                    console.log("低轨请求错误");
                    })

                    //高轨速率请求
                    let getWAN2 = {
                        jsonrpc: "2.0",
                        id: 1,
                        method: "call",
                        params: [
                            sessionValue,
                            "network.device",
                            "status",
                            {
                                name: "eth2"
                            }
                        ]
                    }
                    await axios({
                    method:"post",
                    headers:{
                    'Content-Type':'application/json;'
                    },
                    data:JSON.stringify(getWAN2),
                    url:url,
                    })
                    .then((response)=>{
                         mount.value[1] = ((response.data.result[1].statistics.rx_bytes+response.data.result[1].statistics.tx_bytes)/1048576).toFixed(1);
                    })
                    .catch((error)=>{
                    console.log(error);
                    console.log("高轨请求错误");
                    })
                    //移动网络速率请求
                    let get4G = {
                        jsonrpc: "2.0",
                        id: 1,
                        method: "call",
                        params: [
                            sessionValue,
                            "network.device",
                            "status",
                            {
                                name: "eth3"
                            }
                        ]
                    }
                    await axios({
                    method:"post",
                    headers:{
                    'Content-Type':'application/json;'
                    },
                    data:JSON.stringify(get4G),
                    url:url,
                    })
                    .then((response)=>{
                         mount.value[2] = ((response.data.result[1].statistics.rx_bytes+response.data.result[1].statistics.tx_bytes)/1048576).toFixed(1);
                    })
                    .catch((error)=>{
                    console.log(error);
                    console.log("移动请求错误");
                    })   
                }


                 //每秒对图表数据进行一次更新
                const intervalId = setInterval(()=>{
                    getMount();
                    myChart.setOption({
                    series:{
                        data: [mount.value[0], mount.value[1], mount.value[2]],
                    }
                    })
                },1000)

                // 组件卸载时清除定时器
                onUnmounted(() => {
                    clearInterval(intervalId);
                });

                

                //让图表随浏览器大小变换而变换
                let resizeObserver = new ResizeObserver(()=>myChart?.resize());
                resizeObserver.observe(container);
            })
        }
    }
</script>