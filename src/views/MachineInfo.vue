<template>
  <transition name="fade">
    <div class="machinearea">
      <el-row :gutter="20">
        <el-col :span="12" :offset="0">
          <div style="font-size: 30px; font-weight: 600; margin-bottom: 20px">
            节点信息
          </div>
        </el-col>
        <el-col :span="5" :offset="16">
          <el-button @click="openAddNode" icon="el-icon-circle-plus-outline" size="medium" round plain>新增节点
          </el-button>
        </el-col>
      </el-row>

      <el-dialog title="添加节点" :visible.sync="addNodevisible">
        <el-form label-position="top" label-width="80px" :model="node_form" :status-icon="true" :rules="node_rules"
          ref="node_form">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点名称" prop="nodeName">
                <el-input v-model="node_form.nodeName" placeholder="请输入节点名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点标识" prop="alias">
                <el-input v-model="node_form.alias" placeholder="请输入节点标识"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点位置" prop="nodeLocation">
                <el-input v-model="node_form.nodeLocation" placeholder="请输入节点所在城市"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点类型" prop="nodeType">
                <el-select style="width: 100%" v-model="node_form.nodeType" clearable placeholder="请选择节点类型">
                  <el-option v-for="item in node_options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点主机用户名" prop="nodeUserName">
                <el-input v-model="node_form.nodeUserName" placeholder="请输入节点主机用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点主机密码" prop="nodeUserPasswd">
                <el-input v-model="node_form.nodeUserPasswd" placeholder="请输入节点主机用户名" show-password></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点位置经度" prop="nodeLon">
                <el-input v-model="node_form.nodeLon" placeholder="请输入节位置经度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点位纬度" prop="nodeLat">
                <el-input v-model="node_form.nodeLat" placeholder="请输入节点位置纬度"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点IP" prop="nodeIp">
                <el-input v-model="node_form.nodeIp" placeholder="请输入节点IP"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="cp-sbm-area" style="display: flex; justify-content: right; margin-top: 50px">
            <el-button round @click="resetForm('node_form')">重置</el-button>
            <el-button round type="primary" @click="node_sumbit('node_form')">确认
            </el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-dialog title="修改节点信息" :visible.sync="editnodevisible">
        <el-form label-position="top" label-width="80px" :model="editnode_form" :status-icon="true" :rules="node_rules"
          ref="editnode_form">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点名称" prop="nodeName">
                <el-input v-model="editnode_form.nodeName" placeholder="请输入节点名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点标识" prop="alias">
                <el-input v-model="editnode_form.alias" placeholder="请输入节点标识"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点位置" prop="nodeLocation">
                <el-input v-model="editnode_form.nodeLocation" placeholder="请输入节点所在城市"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点类型" prop="nodeType">
                <el-select style="width: 100%" v-model="editnode_form.nodeType" clearable placeholder="请选择节点类型">
                  <el-option v-for="item in node_options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点主机用户名" prop="nodeUserName">
                <el-input v-model="editnode_form.nodeUserName" placeholder="请输入节点主机用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点主机密码" prop="nodeUserPasswd">
                <el-input v-model="editnode_form.nodeUserPasswd" placeholder="请输入节点主机用户名"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点位置经度" prop="nodeLon">
                <el-input v-model="editnode_form.nodeLon" placeholder="请输入节位置经度"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="节点位纬度" prop="nodeLat">
                <el-input v-model="editnode_form.nodeLat" placeholder="请输入节点位置纬度"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="节点IP" prop="nodeIp">
                <el-input v-model="editnode_form.nodeIp" placeholder="请输入节点IP"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="cp-sbm-area" style="display: flex; justify-content: right; margin-top: 50px">
            <el-button round @click="resetForm('editnode_form')">重置</el-button>
            <el-button round type="primary" @click="editnode_sumbit('editnode_form')">确认
            </el-button>
          </div>
        </el-form>
      </el-dialog>

      <el-table :data="nodeinfo" style="width: 100%" empty-text="暂无节点信息"
        :header-cell-style="{ background: '#00b8a9', color: '#fff' }" :row-class-name="tableRowClassName">
        <el-table-column width="100" type="index" label="序号">
        </el-table-column>
        <el-table-column sortable prop="alias" label="节点名称" width="200">
        </el-table-column>
        <el-table-column sortable prop="nodeIp" label="节点IP" width="200">
        </el-table-column>
        <el-table-column sortable prop="nodeStatus" label="节点状态" width="200">
        </el-table-column>
        <el-table-column sortable prop="nodeLocation" label="节点位置" width="200">
        </el-table-column>
        <el-table-column sortable prop="nodeType" label="节点类型" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.nodeType === '云'" type="success" effect="dark">云节点</el-tag>
            <el-tag v-else-if="scope.row.nodeType === '边'" type="primary" effect="dark">边节点</el-tag>
            <el-tag v-else-if="scope.row.nodeType === '端'" type="warning" effect="dark">端节点</el-tag>
            <el-tag v-else type="info" effect="dark">{{ scope.row.nodeType }}节点</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="100" sortable prop="nodeConnectivity" label="是否连接">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.nodeConnectivity === 1" type="success">已连接</el-tag>
            <el-tag v-else type="danger">未连接</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" type="warning" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>

        <el-table-column label="内容" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-button size="mini" plain type="default" @click="topod(scope.row)">容器管理</el-button>
              <el-button size="mini" plain type="default" @click="tovm(scope.row)">虚拟机管理</el-button>
            </el-button-group>
          </template>
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
          <el-table-column prop="total" label="JVM已分配内存(MB)"></el-table-column>
          <el-table-column prop="max" label="JVM最大内存(MB)"></el-table-column>
          <el-table-column prop="free" label="JVM空闲内存(MB)"></el-table-column>
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
          <el-table-column prop="computerName" label="服务器名称"></el-table-column>
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
          <el-table-column prop="sysTypeName" label="文件系统类型"></el-table-column>
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
    this.curnode = this.$store.state.nodename;
    this.getMachineInfoByIp(this.$store.state.nodeip);
    this.getnodeinfo();
  },
  data() {
    return {
      psearch: "",
      nodeinfo: [],
      editnodevisible: false,
      node_form: {
        nodeName: "",
        nodeIp: "",
        nodeLocation: "",
        nodeType: "",
        nodeUserName: "",
        nodeUserPasswd: "",
        nodeLon: "",
        nodeLat: "",
        alias: ""
      },
      editnode_form: {
        id: "",
        nodeName: "",
        nodeIp: "",
        nodeLocation: "",
        nodeType: "",
        nodeUserName: "",
        nodeUserPasswd: "",
        nodeLon: "",
        nodeLat: "",
        alias: ""
      },
      node_options: [
        {
          label: "端",
          value: "端",
        },
        {
          label: "边",
          value: "边",
        },
        {
          label: "云",
          value: "云",
        },
      ],
      addNodevisible: false,
      dialogTableVisible: false,
      baseurl: "http://39.98.124.97:8080",
      // baseurl: "http://127.0.0.1:8080",
      node_rules: {
        nodeName: [
          { required: true, message: "请输入节点名", trigger: "blur" },
        ],
        alias: [
          { required: true, message: "请输入节点标识", trigger: "blur" },
        ],
        nodeIp: [{ required: true, message: "请输入节点IP", trigger: "blur" }],
        nodeLocation: [
          { required: true, message: "请输入节点所在城市", trigger: "blur" },
        ],
        nodeUserName: [
          { required: true, message: "请输入节点主机用户名", trigger: "blur" },
        ],
        nodeUserPasswd: [
          { required: true, message: "请输入节点主机密码", trigger: "blur" },
        ],
        nodeLon: [
          { required: true, message: "请输入节点位置经度", trigger: "blur" },
        ],
        nodeLat: [
          { required: true, message: "请输入节点位置纬度", trigger: "blur" },
        ],
        nodeType: [
          { required: true, message: "选择节点类型", trigger: "change" },
        ],
      },
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
      curnode: "",
      data_nodename_w: "",
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
    // 跳转容器页

    edit(row) {
      this.editnode_form.id = row.id;
      this.editnode_form.nodeName = row.nodeName;
      this.editnode_form.nodeIp = row.nodeIp;
      this.editnode_form.nodeLocation = row.nodeLocation;
      this.editnode_form.nodeType = row.nodeType;
      this.editnode_form.nodeUserName = row.nodeUserName;
      this.editnode_form.nodeUserPasswd = row.nodeUserPasswd;
      this.editnode_form.nodeLon = row.nodeLon;
      this.editnode_form.nodeLat = row.nodeLat;
      this.editnode_form.alias = row.alias;
      this.editnodevisible = true;
    },
    editnode_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/node/update", //换成实际地址
            data: this.editnode_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              if (res.status === 200) {
                this.$message.success("修改成功！");
                this.getnodeinfo();
              } else {
                this.$message.success("修改失败！");
              }
            },
            (err) => {
              console.log(err);
              this.$notify.error({
                title: "修改失败",
                message: "请检查网络连接设置",
                position: "bottom-right",
              });
            }
          );
          this.editnodevisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    topod(row) {
      this.$store.state.nodename = row.nodeName;
      this.$store.state.nodeip = row.nodeIp;
      this.$router.push("/podlist");
    },
    tovm(row) {
      this.$store.state.nodename = row.nodeName;
      this.$store.state.nodeip = row.nodeIp;
      this.$router.push("/vmlist");
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.nodeName.replace("云节点", "master").replace("边节点", "worker") === this.curnode) {
        return "success-row";
      }
      return "";
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    node_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/node/addNodeList1", //换成实际地址
            data: this.node_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              if (res.status === 200) {
                this.$message.success("添加成功！");
                this.getnodeinfo();
              } else {
                this.$message.success("添加失败！");
              }
            },
            (err) => {
              console.log(err);
              this.$notify.error({
                title: "创建失败",
                message: "请检查网络连接设置",
                position: "bottom-right",
              });
            }
          );
          this.addNodevisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    handleDelete(index, row) {
      this.$confirm(`您确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.baseurl + "/node/deleteNodeList1/" + row.id)
            .then((response) => {
              if (response.status === 200) {
                this.$message.success("删除成功！");
                this.getnodeinfo();
              } else {
                this.$message.success("删除失败！");
              }
            });
        })
        .catch(() => {
          // 取消操作
          this.$message({
            type: "info",
            message: "已取消",
          });
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
    openAddNode() {
      this.addNodevisible = true;
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
  computed: {
    tmp_nodename() {
      return this.$store.state.nodename;
    },
  },
  watch: {
    tmp_nodename(nv, ov) {
      this.curnode = nv;
      this.getMachineInfoByIp(this.$store.state.nodeip);
      this.$message({
        message: "已切换" + nv + "详情信息",
        type: "success",
      });
    },
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #dcedc2;
}
</style>

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
