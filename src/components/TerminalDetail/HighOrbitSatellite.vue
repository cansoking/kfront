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
        TitleComponent,
        TooltipComponent,
        GridComponent
    } from 'echarts/components';
    import { LineChart } from 'echarts/charts';
    import { UniversalTransition } from 'echarts/features';
    import { CanvasRenderer } from 'echarts/renderers';
    import axios from 'axios';
    import {ref} from 'vue';
    echarts.use([
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LineChart,
        CanvasRenderer,
        UniversalTransition
    ]);
    import {onBeforeUnmount, onMounted,computed} from 'vue'
    import { get } from '@/utils/request';
    import { createResource } from '@/api/resource';
    import store from '../../store/index'
    export default{ 


        setup(){
            //根据列表选择的接入点获取相应的url
            const selectedTerminal = computed(() => store.getters.getSelectedTerminal);
            const terminalInfo = computed(() => store.getters.getTerminalInfo[selectedTerminal.value.name]);

            //定时器
            const timer = ref(null);


            onMounted(()=>{
                console.log("vuex", selectedTerminal.value);
                console.log("vuex", terminalInfo.value);
                

                let container = document.getElementById("HighOrbitSatellite");//获取容器
                // var myChart = echarts.init(document.getElementById('main'));
                var myChart = echarts.init(container);//运用了插槽，从父组件传来的模板

                var currentTime = 0;//记录当前秒数
                var Bytes = [];//记录各个时间点的的字节数
                var currentBytes = ref(0);//当前字节数
                // var lastBytes = ref(0);//前一秒的字节数
                var rate = 0;//速率
                const url = process.env.VUE_APP_API_URI_ROUTE;//统一的url

                function randomData() {
                    now = new Date(+now + oneSecond);//创建一个Date对象，可以用toString获取日期值，或者其他参数获取年月日
                    //这里时间是一天一天地增加的，如果要时间一秒一秒地增加，oneDay需要修改，oneDay数据是以毫秒为单位
                    value = value + Math.random() * 21 - 10;
                    let hour = now.getHours().toString().padStart(2, '0');
                    let minute = now.getMinutes().toString().padStart(2, '0');
                    let second = now.getSeconds().toString().padStart(2, '0');
                    let string = [hour,minute,second].join(':');
                    date.push(string);//每当执行data.push()时，也会执行date.push()
                    return {
                        name:now.toString(),
                        value: [
                        string,
                        //把数值暂时全都改为0
                        // Math.round(value)
                        0
                        ]
                    };
                }


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


                //获取速率
                async function getRate(){
                    const sessionValue = await getSession();
                    let data = {
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
                    axios({
                    method:"post",
                    headers:{
                    'Content-Type':'application/json;'
                    },
                    data:JSON.stringify(data),
                    url:url,
                    })
                    .then((response)=>{
                        currentBytes.value = response.data.result[1].statistics.rx_bytes+response.data.result[1].statistics.tx_bytes;
                        rate = 0;
                        Bytes.push(currentBytes.value);
                        if(currentTime>=10){
                            rate = (currentBytes.value-Bytes[0])/10485760;//1048576*10，10是秒数
                            Bytes.shift();
                        }
                        currentTime++;
                        rate = Math.abs(rate);
                        })
                        .catch((error)=>{
                        console.log(error);
                        console.log("fail2");
                        })
                }


                
                
                

                //初始化数据
                let data = [];//y轴数据
                let date = [];//x轴数据（时间）
                // let now = new Date(1997, 9, 3);
                let pointNum = 100;//时间轴的点的个数
                let now = new Date();//获取当前时间
                now = new Date(now - 1000*pointNum);//图表的时间从当前时间的前pointNum秒开始
                // let oneDay = 24 * 3600 * 1000;//1天
                let oneSecond = 1000;//1秒
                let value = Math.random() * 1000;
                for (var i = 0; i < pointNum; i++) {//先往data数组中加1000个数据                
                    data.push(randomData());
                }
                
                
                myChart.setOption( {
                    title: {
                        text: '高轨卫星网络数据流量',
                        textStyle:{
                            color:"rgba(255,255,255,1)"
                        },
                        left:"center"
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter: function (params) {
                            params = params[0];
                            var date = new Date(params.name);
                            return (
                                date.getHours() +
                                ':' +
                                date.getMinutes() +
                                ':' +
                                date.getSeconds() +
                                ' / ' +
                                params.value[1]
                            );
                        },
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: {
                        type: 'category',//从原本的time改成了category类型
                        splitLine: {
                        show: false
                        },
                        data:date,//数据来自date数组
                        axisLine:{
                            lineStyle:{
                                color:'#FFF'
                            }
                        },
                        axisTick:false,
                    },
                    yAxis: {
                        name:'单位:MB/s',
                        nameTextStyle:{
                            padding:[0,40,0,0],
                        },
                        max:3,
                        type: 'value',
                        boundaryGap: [0, '100%'],
                        splitLine: {
                        show: false
                        },
                        //y轴数据来自series
                        axisLine:{
                            lineStyle:{
                                color:'#FFF'
                            },
                            show:true
                        },
                    },
                    series: [
                        {
                        name: 'Fake Data',
                        type: 'line',
                        showSymbol: false,
                        data: data,
                        itemStyle:{
                            color:'#e6194B'
                        }
                        }
                    ],
                    grid:{
                        top:"16%",
                        left:"13%",
                        right:"3%",
                        bottom:"10%"
                    } 
                });


                function addData() {
                    now = new Date(+now + oneSecond);//创建一个Date对象，可以用toString获取日期值，或者其他参数获取年月日
                    //这里时间是一天一天地增加的，如果要时间一秒一秒地增加，oneDay需要修改，oneDay数据是以毫秒为单位
                    value = value + Math.random() * 21 - 10;
                    let hour = now.getHours().toString().padStart(2, '0');
                    let minute = now.getMinutes().toString().padStart(2, '0');
                    let second = now.getSeconds().toString().padStart(2, '0');
                    let string = [hour,minute,second].join(':');
                    date.push(string);//每当执行data.push()时，也会执行date.push()
                    
                    getRate();

                    // console.log("rate的值",rate);

                    // // 下面的代码是算速率的
                    // if(lastBytes.value !== 0){
                    //     rate = ((currentBytes.value - lastBytes.value)/1048576).toFixed(3);
                        
                    //     rate = Math.abs(rate);
                    // }  
                    // lastBytes.value = currentBytes.value;
                    return {
                        name:now.toString(),
                        value: [
                        string,
                        rate
                        ]
                    };
                }


                

                //每隔1000毫秒添加一次数据
                timer.value = setInterval(function () {
                    //1秒增加1次数据
                    data.shift();
                    date.shift();
                    data.push(addData());
                    //date的push在randomData()中
                    myChart.setOption({//貌似其他设置不会改变
                        
                        xAxis:{data:date},
                        series: [
                        {
                            data: data
                        }
                        ]
                    });
                }, 1000);
                



                //让图表随浏览器大小变换而变换
                let resizeObserver = new ResizeObserver(()=>myChart?.resize());
                resizeObserver.observe(container);
                

            })

            //在组件销毁之前停止定时器
            onBeforeUnmount(()=>{
                clearInterval(timer.value);
            })
        }
    }
</script>