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

    echarts.use([
        DatasetComponent,
        TitleComponent,
        TooltipComponent,
        GridComponent,
        LegendComponent,
        BarChart,
        CanvasRenderer
    ]);
    import {onBeforeMount, onMounted} from 'vue'
    export default{ 
        setup(){
            
            onMounted(()=>{
                let container = document.getElementById("DataTrafficStatistics");//获取容器
                // var myChart = echarts.init(document.getElementById('main'));
                var myChart = echarts.init(container);//运用了插槽，从父组件传来的模板


                
                
                myChart.setOption( {
                    title:{
                        text:'数据流量统计',
                        textStyle:{
                            color:'#FFF'
                        },
                        left:'center'
                     },
                    legend: {
                        // orient:'vertical',
                        icon:'circle',
                        itemHeight:'6',
                        show:'true',
                        
                        // right:'10%' ,
                        top:'12%',
                        padding:[0,50,0,0],   //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
                        textStyle:{
                            color:'#FFF',
                            fontSize:'10'
                        }
                    },
                    tooltip: {},
                    color :['#E53A40','#EFDC05','#30A9DE'],
                    dataset: {
                        source: [
                        
                        ['11/21', 43.3, 85.8, 93.7],
                        ['11/22', 83.1, 73.4, 55.1],
                        ['11/23', 86.4, 65.2, 82.5],
                        ]
                    },
                    xAxis: { 
                        type: 'category' ,
                        axisLine:{
                            lineStyle:{
                                color:'#FFF'
                            }
                        }
                    },
                    yAxis: {
                        name:'单位:MB',
                        nameTextStyle:{
                            padding:[0,10,0,0],
                        },
                        // name:'单\n位\n:\nMB',
                        // nameGap:,
                        // nameTextStyle:{
                        //     padding:[0,90,0,0],
                        // },
                        // nameGap:-30,
                        axisLine:{
                            lineStyle:{
                                color:'#FFF'
                            }
                        },
                        
                    },
                    // Declare several bar series, each will be mapped
                    // to a column of dataset.source by default.
                    series: [{ type: 'bar',name:"亚太星通"}, { type: 'bar',name:"银河航天" }, { type: 'bar' ,name:"移动通信"}],
                    grid:{
                        top:"20%",
                        left:"13%",
                        right:"3%",
                        bottom:"10%"
                    } 
                });

                

                //让图表随浏览器大小变换而变换
                let resizeObserver = new ResizeObserver(()=>myChart?.resize());
                resizeObserver.observe(container);
            })
        }
    }
</script>