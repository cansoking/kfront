<template>
    <div><slot></slot></div>
    
</template>

<script>
    import * as echarts from 'echarts/core';
    import { GridComponent } from 'echarts/components';
    import { BarChart } from 'echarts/charts';
    import { CanvasRenderer } from 'echarts/renderers';
    echarts.use([GridComponent, BarChart, CanvasRenderer]);
    import {onBeforeMount, onMounted, ref,onUnmounted} from 'vue';
    import axios from 'axios';
    export default{ 
        setup(){
            

            onMounted(()=>{
                let container = document.getElementById("CurrentMissionStatus");//获取容器
            
                var myChart = echarts.init(container);//运用了插槽，从父组件传来的模板

                var data = ref([0,0,0]);//初始数据

                const url = process.env.VUE_APP_API_URI_NOPORT;//服务器地址

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
                    var length = message.length;
                    for(let i = 1;i<=length;i++){
                        let progress = message[length-i].transmissProgress;
                        // progress = parseFloat(progress.toFixed(3))*100; 
                        progress = (progress*100).toFixed(1);
                        data.value[3-i] = progress;              
                    }
                    myChart.setOption({
                        series: [
                            {  
                                data: data.value,
                            }
                        ],
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
                    console.log('进度条组件已发送消息：', message);
                }

                // 关闭WebSocket连接
                function closeWebSocket() {
                    socket.close();
                }

                //获取数据方法
                function getData(){
                    axios({
                        method:"post",
                        // url:"http://localhost:8887/file/inquireReceiveState",
                        url:url+":8887/file/inquireReceiveState",
                    })
                    .then((response)=>{
                        var length = response.data.length;
                        for(let i = 1;i<=length;i++){
                            let progress = response.data[length-i].transmissProgress;
                            // progress = parseFloat(progress.toFixed(3))*100; 
                            progress = (progress*100).toFixed(1);
                            data.value[3-i] = progress;              
                        }
                        // var progress0 = response.data[length-3].transmissProgress;
                        // var progress1 = response.data[length-2].transmissProgress;
                        // var progress2 = response.data[length-1].transmissProgress;
                        // //将数据截取到小数点后3位，再乘100，向下取整，得到当前百分比
                        // progress2 = parseFloat(progress2.toFixed(3))*100;  
                        // data.value[2] = progress2;
                        
                        // progress1 = parseFloat(progress1.toFixed(3))*100;  
                        // data.value[1] = progress1;

                        // progress0 = parseFloat(progress0.toFixed(3))*100;  
                        // data.value[0] = progress0;
                    })
                    .catch((error)=>{
                        console.log(error);
                    })
                }

                
                myChart.setOption( {
                    title:{
                        text:"当前任务状态",
                        textStyle:{
                            color:'#FFF'
                        },
                        left:'center'
                    },
                    xAxis: {
                        type: 'value',
                        min:0,
                        max:100,
                        splitLine: {
                        show: false //去掉辅助线
                        },
                        axisLine: {
                        show: false
                        },
                        axisLabel: {
                        show: false
                        }
                    },
                    yAxis: {
                        data: ['任务3', '任务2', '任务1'],
                        type: 'category',
                        splitLine: {
                        show: false //去掉辅助线
                        },
                        axisLine: {
                        show: false
                        },
                        axisTick: {
                        show: false
                        },
                        axisLabel: {
                        inside: true,
                        margin: 0,
                        textStyle: {
                            color: '#fff', //值的颜色
                            fontSize: 13,
                            verticalAlign: 'bottom',
                            align: 'left',
                            padding: [0, 0, 10, 0]
                        }
                        }
                    },
                    series: [
                        {               
                            data: data.value,
                            type: 'bar',
                            showBackground: true,
                            backgroundStyle: {
                                color: '#253E7D',
                                borderRadius: 5
                            },
                            barWidth: 10,
                            itemStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(
                                        0,
                                        0,
                                        1,
                                        0,
                                        [
                                        {
                                            offset: 0,
                                            color: '#39ACE2'
                                        },
                                        {
                                            offset: 1,
                                            color: '#14FCFC'
                                        }
                                        ],
                                        false
                                    ),
                                    
                            barBorderRadius: [5, 5, 5, 5]
                            }
                        },
                        label: {
                            normal: {
                            show: true,
                            position: [370,-20], //value的位置   
                            right:'10%',
                            color: '#fff', //值的颜色
                            fontSize: 10,
                            formatter:'{c}%',
                            },
                            
                            
                        }
                        }
                    ],
                    grid:{
                        top:"20%",
                        left:"5%",
                        right:"3%",
                        bottom:"5%"
                    } 
                });

                //每秒对图表数据进行一次更新
                // const intervalId = setInterval(()=>{
                //     getData();
                //     myChart.setOption({
                //         series: [
                //             {  
                //                 data: data.value,
                //             }
                //         ],
                //     })
                // },1000)


                // 组件卸载时清除定时器
                onUnmounted(() => {
                    // clearInterval(intervalId);

                    closeWebSocket();
                });

                //让图表随浏览器大小变换而变换
                let resizeObserver = new ResizeObserver(()=>myChart?.resize());
                resizeObserver.observe(container);

                
            })
            
        }
    }
</script>