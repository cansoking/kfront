<template>
    <div><slot></slot></div>
    
</template>

<script>
    import * as echarts from 'echarts/core';
    import { GridComponent } from 'echarts/components';
    import { BarChart } from 'echarts/charts';
    import { CanvasRenderer } from 'echarts/renderers';
    echarts.use([GridComponent, BarChart, CanvasRenderer]);
    import {onBeforeMount, onMounted} from 'vue'
    export default{ 
        setup(){
            
            onMounted(()=>{
                let container = document.getElementById("CurrentMissionStatus");//获取容器
                
                var myChart = echarts.init(container);//运用了插槽，从父组件传来的模板

                let data = [11, 22, 7];//初始数据
                
                
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
                            
                            data: data,
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

                

                //让图表随浏览器大小变换而变换
                let resizeObserver = new ResizeObserver(()=>myChart?.resize());
                resizeObserver.observe(container);



                setInterval(function () {
                    for(var i=0;i<3;i++){
                        if(data[i]<100){
                            data[i] = data[i]+1;
                        }
                    }
                    //date的push在randomData()中
                    myChart.setOption({//貌似其他设置不会改变
                        series: [
                        {
                            data: data
                        }
                        ]
                    });
                }, 1000);
            })
        }
    }
</script>