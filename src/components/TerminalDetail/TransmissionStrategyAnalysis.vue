<template>
  <div><slot></slot></div>

  <!-- <div id="main" style="height: 500px;"></div> -->
</template>

<script>
import * as echarts from "echarts";
import { onBeforeMount, onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      let container = document.getElementById("TransmissionStrategyAnalysis"); //获取容器
      // var myChart = echarts.init(document.getElementById('main'));
      var myChart = echarts.init(container); //运用了插槽，从父组件传来的模板

      myChart.setOption({
        grid: [
          { left: "13%", top: "23%", bottom: "10%", width: "35%" },
          { right: "13%", top: "23%", bottom: "10%", width: "35%" },
        ],
        legend: [
          {
            // orient: 'vertical',
            // right: '1%',
            top: "8%",
            textStyle: {
              color: "#FFF",
              fontSize: "10",
            },
            icon: "circle",
            itemHeight: "6",
            show: "true",
            data: ["原始编码包", "固定编码包", "自定义编码包"],
          },
          {
            // orient: 'vertical',
            // right: '1%',
            top: "14%",
            textStyle: {
              color: "#FFF",
              fontSize: "10",
            },
            icon: "circle",
            itemHeight: "6",
            show: "true",
            data: ["单路径传输", "多路径传输", "智能切换传输"],
          },
        ],
        tooltip: {},
        title: {
          text: "传输策略分析",
          textStyle: {
            color: "#FFF",
          },
          left: "center",
        },

        xAxis: [
          {
            name: "编码文件大小",
            nameLocation: "center",
            nameGap: 8,
            nameTextStyle: {
              color: "#FFF",
            },
            type: "category",
            gridIndex: 0,
            axisLabel: {
              textStyle: {
                color: "#FFF",
              },
              show: false,
            },
          },
          {
            name: "平均传输时延",
            nameLocation: "center",
            nameGap: 8,
            nameTextStyle: {
              color: "#FFF",
            },
            type: "category",
            gridIndex: 1,
            axisLabel: {
              textStyle: {
                color: "#FFF",
              },
              show: false,
            },
          },
        ],
        yAxis: [
          {
            gridIndex: 0,
            axisLabel: {
              textStyle: {
                color: "#FFF",
              },
            },
            name: "单位:MB",
            nameTextStyle: {
              padding: [0, 20, 0, 0],
              color: "#FFF",
            },
          },
          {
            gridIndex: 1,
            axisLabel: {
              textStyle: {
                color: "#FFF",
              },
            },
            position: "right",
            name: "单位:ms/Mb",
            nameTextStyle: {
              padding: [0, 0, 0, 20],
              color: "#FFF",
            },
          },
        ],
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: "bar",
            name: "原始编码包",
            data: [10],
            xAxisIndex: 0,
            yAxisIndex: 0,
          },
          {
            type: "bar",
            name: "固定编码包",
            data: [20],
            xAxisIndex: 0,
            yAxisIndex: 0,
          },
          {
            type: "bar",
            name: "自定义编码包",
            data: [10],
            xAxisIndex: 0,
            yAxisIndex: 0,
          },
          {
            type: "bar",
            name: "单路径传输",
            data: [22],
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
          {
            type: "bar",
            name: "多路径传输",
            data: [11],
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
          {
            type: "bar",
            name: "智能切换传输",
            data: [3],
            xAxisIndex: 1,
            yAxisIndex: 1,
          },
        ],
      });

      //让图表随浏览器大小变换而变换
      let resizeObserver = new ResizeObserver(() => myChart?.resize());
      resizeObserver.observe(container);
    });
  },
};
</script>