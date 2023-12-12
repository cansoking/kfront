<template>
  <body class="detailBody">
    <!-- 头部的盒子 -->
    <header class="detailHeader">
      <h1>边缘服务器异构网络传输详情</h1>
      <div class="showTime"></div>
    </header>
    <!-- 页面主题部分 -->
    <section class="mainbox1">
      <div class="column">
        <Select1></Select1>
        <HighOrbitSatellite>
          <div id="HighOrbitSatellite" class="panel bar">
            <div class="panel-footer"></div>
          </div>
        </HighOrbitSatellite>
        <LeoSatellite>
          <div id="LeoSatellite" class="panel line">
            <div class="panel-footer"></div>
          </div>
        </LeoSatellite>
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
              <li>100</li>
              <li>3</li>
            </ul>
          </div>
          <div class="no-bd">
            <ul>
              <li>接入终端数量</li>
              <li>当前网络连接</li>
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
        <Select2></Select2>

        <CurrentMissionStatus>
          <div class="panel bar2">
            <div id="CurrentMissionStatus"></div>
            <div class="more" @click="goToList">More></div>
            <div class="panel-footer"></div>
          </div>
        </CurrentMissionStatus>
        <TransmissionStrategyAnalysis>
          <div id="TransmissionStrategyAnalysis" class="panel line">
            <div class="panel-footer"></div>
          </div>
        </TransmissionStrategyAnalysis>

        <DataTrafficStatistics>
          <div id="DataTrafficStatistics" class="panel pie">
            <div class="panel-footer"></div>
          </div>
        </DataTrafficStatistics>
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

// import { useRouter } from 'vue-router';
import router from "@/router";

// const router = useRouter();
const goToList = () => {
  router.push("/messionList");
};
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