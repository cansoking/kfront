<template>
    <body class = "mapBody" >
          <!-- 头部的盒子 -->
          <header class = "mapHeader">
              <h1>异构网络资源管理分系统</h1>
          </header>
          <!-- 页面主题部分 -->
          <section class="mainbox3">
              <div class="column">
                   <!-- 第一列 -->
              </div>
              <div class="column">
                <!-- 第二列 -->
                 
                <Map/>

                 
                 

              </div>
              <div class="column">
                  <!-- 第三列 -->
              </div>
          </section>
      </body>
    


</template>

<script>
import Map from '../components/TerminalMap/Map.vue'
export default{
    components:{
        Map,
    },

    data (){
        return {
            
        }
    },

    methods:{
        
    },

    

}


</script>


<style  lang="less">
  //css初始化
  * {
        margin:0;
        padding: 0;
        box-sizing: border-box;
    }
    li{
        list-style: none;//去掉小圆点
    }


    //设置背景
    .mapBody{
        background:url(../assets/images/bg.jpg) no-repeat top center;
        background-size: cover;
        line-height: 1.15;
    }
    //头部的盒子
    .mapHeader{
        position: relative;
        height: 100px;
        background: url(../assets/images/head_bg.png)no-repeat;
        background-size: 100% 100%;
        h1{
            font-size: 38px;
            color: #fff;
            text-align: center;
            line-height: 80px;
        }
    }

    //主体
.mainbox3{
        display:flex;
        min-width: 1024px;
        max-width: 1920px;
        margin: 0 auto;
        padding: 10px 10px 0;

        
        .column{
            flex:0;
        }
        .column:nth-child(2){
            flex: 1;
            margin:10px 15px;
            height: 900px;
            width: 87%;
        }
        
}


</style>