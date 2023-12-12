<template>
    <div id="content"></div>
</template>


<script setup>
    import * as echarts from "echarts";
    import china from '@/assets/china1.json'
    import { onMounted, reactive } from "vue";
    import { useRouter } from "vue-router";
    import $ from "jquery";
    import router from '@/router'

    var points = [ // 散点图数据
          { name: '新疆服务器',position:'新疆', value: [87.628579, 43.793301], itemStyle: { color: '#00EEFF' } }, // 新疆
          { name: '四川服务器', position:'四川',value: [104.076452, 30.651696], itemStyle: { color: '#00EEFF' } }, // 四川
          { name: '甘肃服务器', position:'甘肃',value: [103.826777, 36.060634], itemStyle: { color: '#00EEFF' } }, // 甘肃
          { name: '云南服务器', position:'云南',value: [102.709372, 25.046432], itemStyle: { color: '#00EEFF' } }, // 云南
          { name: '广西服务器', position:'广西',value: [108.327537, 22.816659], itemStyle: { color: '#00EEFF' } }, // 广西
          { name: '湖南服务器', position:'湖南',value: [112.982951, 28.116007], itemStyle: { color: '#00EEFF' } }, // 湖南
          { name: '山东服务器', position:'山东',value: [117.020725, 36.670201], itemStyle: { color: '#00EEFF' } }, // 山东
          { name: '河南服务器', position:'河南',value: [113.753094, 34.767052], itemStyle: { color: '#00EEFF' } }, // 河南
          { name: '山西服务器', position:'山西',value: [112.578781, 37.813948], itemStyle: { color: '#00EEFF' } }, // 山西
          { name: '福建服务器', position:'福建',value: [119.296194, 26.101082], itemStyle: { color: '#00EEFF' } }, // 福建
          { name: '浙江服务器', position:'浙江',value: [120.152575, 30.266619], itemStyle: { color: '#00EEFF' } }, // 浙江
          { name: '江苏服务器', position:'江苏',value: [118.763563, 32.061377], itemStyle: { color: '#00EEFF' } }, // 江苏
          { name: '北京服务器', position:'北京',value: [116.407387, 39.904179], itemStyle: { color: '#00EEFF' } }, // 北京
          { name: '陕西服务器', position:'陕西',value: [108.953939, 34.266611], itemStyle: { color: '#00EEFF' } }, // 陕西
          { name: '广东服务器', position:'广东',value: [113.266887, 23.133306], itemStyle: { color: '#00EEFF' } } // 广东
        ];


        onMounted(()=>{
            let container = document.getElementById("content");
            var myChart = echarts.init(container);
            var option = {
                tooltip:{
                    show:true,
                    trigger:'item',
                    triggerOn: "mousemove",
                    enterable:true,
                    alwaysShowContent: false,
                    backgroundColor: "#0C121C",
                    borderColor: "rgba(0, 0, 0, 0.16);",
                    formatter:function(params){
                        var str = "";
                        if(params.name){
                            str += '<div class = "point">'+params.name+'</div>'   
                        }
                        return str;
                    },
                    textStyle: {
                        color: "#DADADA",
                        fontSize: "12",
                        width: 20,
                        height: 30,
                        overflow: "break",
                    },
                },

                // legend:{
                //     orient:'vertical',
                //     left:'10%',
                //     data:['新疆服务器', '四川服务器','甘肃服务器','云南服务器','广西服务器','湖南服务器','山东服务器','河南服务器','山西服务器','福建服务器','浙江服务器','江苏服务器','北京服务器','陕西服务器','广东服务器',]
                    
                // },

                geo: {// 地图配置
                    map: 'china',
                    roam:false,//鼠标缩放
                    zoom:1.2,
                    label: { // 图形上的文本标签
                        normal: {// 通常状态下的样式
                            show: false,
                            textStyle: {
                            color: '#fff'
                            }
                        },
                        emphasis: {// 鼠标放上去高亮的样式
                            show:false,
                            textStyle: {
                            color: '#fff'
                            }
                        }
                    },
                     // 地图区域的样式设置
                    itemStyle: {
                        borderColor: "rgba(147, 235, 248, 1)",
                        borderWidth: 1,
                        areaColor: {
                            type: "radial",
                            x: 0.5,
                            y: 0.5,
                            r: 0.8,
                            colorStops: [
                            {
                                offset: 0,
                                color: "rgba(147, 235, 248, 0)", // 0% 处的颜色
                            },
                            {
                                offset: 1,
                                color: "rgba(147, 235, 248, .2)", // 100% 处的颜色
                            },
                            ],
                            globalCoord: false,
                        },
                        shadowColor: "rgba(128, 217, 248, 1)",
                        shadowOffsetX: -2,
                        shadowOffsetY: 2,
                        shadowBlur: 10,
                    },
                    emphasis: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                },
                
                series: [
                    { // 散点系列数据
                    type: 'effectScatter',// 带有涟漪特效动画的散点（气泡）图
                    coordinateSystem: 'geo', //该系列使用的坐标系:地理坐标系
                    // 特效类型,目前只支持涟漪特效'ripple'，意为“涟漪”
                    effectType: 'ripple',
                    // 配置何时显示特效。可选'render'和'emphasis' 。
                    showEffectOn: 'emphasis',
                    rippleEffect: { // 涟漪特效相关配置。
                        period: 3, // 动画的周期，秒数。
                        scale: 4,// 动画中波纹的最大缩放比例。
                        // 波纹的绘制方式，可选 'stroke' 和 'fill'。
                        brushType: 'fill'
                    },
                    zlevel: 1, // 所有图形的 zlevel 值。
                    data: points,
                    
                    },
                ],

                
                
                
            }

            echarts.registerMap('china',china);
            myChart.setOption(option);


            
            //点击跳转
            // const router = useRouter();
            myChart.on("click", function (params) {
                if(params.seriesType === "effectScatter"){
                    // router.push({
                    //     path: "/detail",
                    // }); 
                    router.push("/detail");
                }
                // console.log(params.data);
            })



            //让图表随浏览器大小变换而变换,比上面的方法好，上面的方法变小后就无法变大了
            let resizeObserver = new ResizeObserver(()=>myChart?.resize());
            resizeObserver.observe(container);
        })


</script>



<style lang="less">
 #content{
    width: 100%;
    height: 100%;
    margin:-20px auto;
  }


  //标记点提示框样式
  .point{
    color:#00cccc;
  }
</style>