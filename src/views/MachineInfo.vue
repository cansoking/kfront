<template>
  <transition name="fade">
    <div class="machinearea">
      <div style="font-size: 30px; font-weight: 600; margin-bottom: 20px">
        节点信息
      </div>
      <el-table
        :data="
          nodeinfo.filter(
            (data) =>
              !psearch ||
              data.nodeName.toLowerCase().includes(psearch.toLowerCase())
          )
        "
        style="width: 100%"
        empty-text="暂无节点信息"
        :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
      >
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column sortable prop="nodeName" label="节点名称" width="180">
        </el-table-column>
        <el-table-column sortable prop="nodeIp" label="节点IP" width="180">
        </el-table-column>
        <el-table-column
          sortable
          prop="nodeStatus"
          label="节点状态"
          width="180"
        >
        </el-table-column>
        <el-table-column
          sortable
          prop="nodeLocation"
          label="节点位置"
          width="180"
        >
        </el-table-column>
        <el-table-column sortable prop="nodeType" label="节点类型" width="180">
        </el-table-column>
        <el-table-column sortable prop="nodeConnectivity" label="是否连接">
        </el-table-column>
        <!-- <el-table-column
          width="100"
          sortable
          label="是否可用"
          prop="metadata.annotations.status"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.metadata.annotations.status === 'Yes'"
              type="success"
              >可用</el-tag
            >
            <el-tag v-else type="danger">不可用</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column width="210" align="center">
          <template slot="header">
            <el-input
              v-model="psearch"
              size="mini"
              placeholder="输入名称搜索"
            />
          </template>
          <template slot-scope="scope">
            <el-button
              plain
              type="info"
              size="mini"
              @click="checkinfo(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-card class="info-card" v-show="showInfo">
        <h2>CPU信息：</h2>
        <el-table :data="[cpuInfo]">
          <el-table-column prop="cpuNum" label="核心数"></el-table-column>
          <el-table-column prop="sys" label="CPU系统使用率">{{
            cpuInfo.sys | decimalFilter
          }}</el-table-column>
          <el-table-column prop="used" label="CPU用户使用率">{{
            cpuInfo.used | decimalFilter
          }}</el-table-column>
          <el-table-column prop="wait" label="CPU当前等待率">{{
            cpuInfo.wait | decimalFilter
          }}</el-table-column>
          <el-table-column prop="free" label="CPU当前空闲率">{{
            cpuInfo.free | decimalFilter
          }}</el-table-column>
        </el-table>
      </el-card>

      <el-card class="info-card" v-show="showInfo">
        <h2>JVM信息：</h2>
        <el-table :data="[jvmInfo]">
          <el-table-column
            prop="total"
            label="JVM已分配内存(MB)"
          ></el-table-column>
          <el-table-column prop="max" label="JVM最大内存(MB)"></el-table-column>
          <el-table-column
            prop="free"
            label="JVM空闲内存(MB)"
          ></el-table-column>
          <el-table-column prop="version" label="JDK版本"></el-table-column>
          <el-table-column prop="home" label="JDK路径"></el-table-column>
        </el-table>
      </el-card>

      <el-card class="info-card" v-show="showInfo">
        <h2>内存信息：</h2>
        <el-table :data="[memoryInfo]">
          <el-table-column prop="total" label="内存总量(GB)"></el-table-column>
          <el-table-column prop="used" label="已用内存(GB)"></el-table-column>
          <el-table-column prop="free" label="剩余内存(GB)"></el-table-column>
        </el-table>
      </el-card>
      <el-card class="info-card">
        <el-row>
          <el-col :span="12">
            <div class="chart-container" ref="cpuChart"></div>
          </el-col>
          <el-col :span="12">
            <div class="chart-container" ref="memoryChart"></div>
          </el-col>
        </el-row>
      </el-card>

      <el-card class="info-card" v-show="showInfo">
        <h2>系统信息：</h2>
        <el-table :data="[systeminfo]">
          <el-table-column
            prop="computerName"
            label="服务器名称"
          ></el-table-column>
          <el-table-column prop="computerIp" label="服务器Ip"></el-table-column>
          <el-table-column prop="userDir" label="项目路径"></el-table-column>
          <el-table-column prop="osName" label="操作系统"></el-table-column>
          <el-table-column prop="osArch" label="处理器架构"></el-table-column>
          <el-table-column prop="osVersion" label="系统版本"></el-table-column>
          <el-table-column prop="osBuild" label="处理器型号"></el-table-column>
        </el-table>
      </el-card>

      <el-card class="info-card" v-show="showInfo">
        <h2>文件系统信息：</h2>
        <el-table :data="sysFiles">
          <el-table-column prop="dirName" label="挂载地址"></el-table-column>
          <el-table-column
            prop="sysTypeName"
            label="文件系统类型"
          ></el-table-column>
          <el-table-column prop="typeName" label="类型名称"></el-table-column>
          <el-table-column prop="total" label="总量"></el-table-column>
          <el-table-column prop="free" label="空闲量"></el-table-column>
          <el-table-column prop="used" label="已使用量"></el-table-column>
          <el-table-column prop="usage" label="使用百分比"></el-table-column>
        </el-table>
      </el-card>
    </div>
  </transition>
</template>

<script>
import * as echarts from "echarts";
import "animate.css";

export default {
  name: "machineinfo",
  mounted() {
    this.getMachineInfo();
    this.getnodeinfo();
  },
  data() {
    return {
      psearch: "",
      nodeinfo: [],
      dialogTableVisible: false,
      baseurl: "http://39.98.124.97:8080",
      // baseurl: "http://127.0.0.1:8080",

      cpuInfo: {
        cpuNum: "",
        total: "",
        sys: "",
        used: "",
        wait: "",
        free: "",
      },
      jvmInfo: {
        total: "",
        max: "",
        free: "",
        version: "",
        home: "",
      },
      memoryInfo: {
        total: "",
        used: "",
        free: "",
      },
      systeminfo: {
        computerName: "",
        computerIp: "",
        userDir: "",
        osName: "",
        osArch: "",
        osVersion: "",
        osBuild: "",
      },
      sysFiles: [],

      file: {
        dirName: "",
        sysTypeName: "",
        typeName: "",
        total: "",
        free: "",
        used: "",
        usage: "",
      },
      showInfo: false,
    };
  },
  filters: {
    decimalFilter(value) {
      if (typeof value === "string") {
        value = parseFloat(value);
      }
      if (typeof value === "number") {
        return value.toFixed(2);
      }
      return value;
    },
  },

  methods: {
    // 切换节点
    checkinfo(row) {
      sessionStorage.setItem("nodename", row.nodeName);
      sessionStorage.setItem("ip", row.nodeIp);
      this.$store.nodename = row.nodeName;
      this.$store.nodeip = row.nodeIp;
      this.getMachineInfoByIp(row.nodeIp);
      this.$message({
        message: "已切换" + row.nodeName + "详情信息",
        type: "success",
      });
    },
    // 获取节点信息
    getnodeinfo() {
      this.$axios
        .get(this.baseurl + "/node/getNodeList1")
        .then((res) => {
          this.nodeinfo = res.data.content;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 获取指定物理机数据
    getMachineInfoByIp(ip) {
      this.$axios
        .get(this.baseurl + "/Machine/getMachineInfoByIP?ip=" + ip)
        .then((res) => {
          if (res.data.success) {
            this.cpuInfo = res.data.content.cpuInfo;
            this.jvmInfo = res.data.content.jvmInfo;
            this.memoryInfo = res.data.content.memoryInfo;
            this.systeminfo = res.data.content.systeminfo;

            this.drawMemoryChart();
            this.drawCpuChart();

            res.data.content.sysFiles.forEach((item) => {
              this.sysFiles.push(item);
            });
            this.showInfo = true;
          }
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 获取物理机数据
    getMachineInfo() {
      this.$axios
        .get(this.baseurl + "/Machine/getMachineInfo")
        .then((res) => {
          if (res.data.success) {
            this.cpuInfo = res.data.content.cpuInfo;
            this.jvmInfo = res.data.content.jvmInfo;
            this.memoryInfo = res.data.content.memoryInfo;
            this.systeminfo = res.data.content.systeminfo;

            this.drawMemoryChart();
            this.drawCpuChart();

            res.data.content.sysFiles.forEach((item) => {
              this.sysFiles.push(item);
            });
            this.showInfo = true;
          }
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },

    decimalFilter(value) {
      if (typeof value === "string") {
        value = parseFloat(value);
      }
      if (typeof value === "number") {
        return value.toFixed(2);
      }
      return value;
    },

    drawMemoryChart() {
      const memoryChart = echarts.init(this.$refs.memoryChart);

      const memoryData = [
        {
          value: this.decimalFilter(this.memoryInfo.used),
          name: "已用内存" + this.decimalFilter(this.memoryInfo.used) + "GB",
        },
        {
          value: this.decimalFilter(this.memoryInfo.free),
          name: "剩余内存" + this.decimalFilter(this.memoryInfo.free) + "GB",
        },
      ];

      const option = {
        title: {
          text: "内存利用率",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} GB ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "已用内存" + this.decimalFilter(this.memoryInfo.used) + "GB",
            "剩余内存" + this.decimalFilter(this.memoryInfo.free) + "GB",
          ],
        },
        series: [
          {
            name: "内存利用率",
            type: "pie",
            radius: "50%",
            center: ["50%", "60%"],
            data: memoryData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      memoryChart.setOption(option);
    },

    drawCpuChart() {
      const cpuChart = echarts.init(this.$refs.cpuChart);

      const cpuData = [
        {
          value: this.decimalFilter(this.cpuInfo.used),
          name: "用户使用CPU" + this.decimalFilter(this.cpuInfo.used) + "%",
        },
        {
          value: this.decimalFilter(this.cpuInfo.sys),
          name: "系统使用CPU" + this.decimalFilter(this.cpuInfo.sys) + "%",
        },
        {
          value: this.decimalFilter(this.cpuInfo.free),
          name: "剩余CPU" + this.decimalFilter(this.cpuInfo.free) + "%",
        },
      ];

      const option = {
        title: {
          text: "CPU利用率",
          x: "center",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c}% ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: [
            "用户使用CPU" + this.decimalFilter(this.cpuInfo.used) + "%",
            "剩余CPU" + this.decimalFilter(this.cpuInfo.free) + "%",
            "系统使用CPU" + this.decimalFilter(this.cpuInfo.sys) + "%",
          ],
        },
        series: [
          {
            name: "CPU利用率",
            type: "pie",
            radius: "50%",
            center: ["50%", "60%"],
            data: cpuData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      cpuChart.setOption(option);
    },
  },
};
</script>

<style>
.machinearea {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-top: 15px;
}
.info-card {
  animation: fadeInUp 0.5s ease-in-out;
}
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.chart-container {
  width: 50%;
  height: 300px;
  margin-top: 20px;
}

.el-pagination.is-background .el-pager li {
  color: #fff;
  cursor: default;
}
.el-pagination.is-background .el-pager li:hover {
  color: #08c0b9;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #08c0b9;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  background-color: #08c0b9;
  color: #fff;
}
/*带背景的分页按钮背景色end*/

/*不带背景的分页按钮背景色begin*/
.el-pager li {
  color: #08c0b9;
  cursor: default;
}
.el-pagination .el-pager li:hover {
  color: #08c0b9;
}
.el-pagination .el-pager li:not(.disabled):hover {
  color: #08c0b9;
}
/*不带背景的分页按钮背景色end*/
</style>
