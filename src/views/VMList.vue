<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          虚拟机列表
        </p></el-col
      >
      <!-- <el-col :span="1" :offset="4">
        <div style="font-size: 16px; line-height: 36px">宿主机：</div>
      </el-col>

      <el-col :span="3" :offset="0">
        <el-select
          style="width: 80%"
          v-model="formInline.region"
          placeholder="请选择宿主机"
          @change="suzhuchange"
        >
          <el-option label="39.98.124.97" value="39.98.124.97"></el-option>
          <el-option
            label="192.168.194.164"
            value="192.168.194.164"
          ></el-option>
        </el-select>
      </el-col> -->
      <el-col :span="3" :offset="9">
        <el-button
          @click="refreshIP"
          icon="el-icon-refresh"
          size="medium"
          round
          plain
          >更新虚拟机ip地址
        </el-button>
      </el-col>
      <el-col :span="2" :offset="0">
        <el-button
          @click="openCreateVM"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >新增虚拟机
        </el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="
        vmdata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.name.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无虚拟机"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column type="index" label="序号" width="50"> </el-table-column>
      <el-table-column width="150" sortable label="名称" prop="name">
      </el-table-column>
      <el-table-column width="100" sortable label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 'VIR_DOMAIN_PAUSED'" type="warning"
            >挂起</el-tag
          >
          <el-tag v-else-if="scope.row.state === 'VIR_DOMAIN_RUNNING'"
            >运行</el-tag
          >
          <el-tag v-else type="danger">关机</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" sortable label="cpu个数" prop="cpuNum">
      </el-table-column>
      <el-table-column width="140" sortable label="分配内存(GiB)" prop="maxMem">
      </el-table-column>
      <el-table-column width="180" sortable label="IP地址" prop="ipaddr">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input
            style="width: 30%"
            v-model="psearch"
            placeholder="输入名称搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button plain type="success" @click="vmstart(scope.row)"
              >启动</el-button
            >
            <el-button plain type="warning" @click="vmsuspend(scope.row)"
              >挂起</el-button
            >
            <el-button plain type="success" @click="vmresume(scope.row)"
              >还原</el-button
            >
            <el-button plain type="primary" @click="vmreboot(scope.row)"
              >重启</el-button
            >
            <el-button plain type="info" @click="vmshutdown(scope.row)"
              >关闭</el-button
            >
            <el-button plain type="danger" @click="vmshutdownMust(scope.row)"
              >强制关闭</el-button
            >
            <el-button plain type="danger" @click="vmdelete(scope.row)"
              >删除</el-button
            >
            <el-button plain type="warning" @click="opencommand(scope.row)"
              >执行命令</el-button
            >
            <el-button plain type="primary" @click="openpod(scope.row)"
              >容器管理</el-button
            >
            <el-button plain type="primary" @click="openimage(scope.row)"
              >镜像管理</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="vmdata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalvm"
        background
      >
      </el-pagination>
    </div>

    <el-dialog title="创建虚拟机" :visible.sync="buildvmvisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="formData"
        :status-icon="true"
        :rules="vm_rules"
        ref="formData"
      >
        <el-row :gutter="30">
          <el-col :span="12" :offset="0">
            <el-form-item label="虚拟机名称" prop="name">
              <el-input
                style="width: 60%"
                v-model="formData.name"
                placeholder="请输入虚拟机名称"
                @blur="validName()"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="内存" prop="memory">
              <el-select
                style="width: 60%"
                v-model="formData.memory"
                clearable
                placeholder="请选择内存大小(GiB)"
              >
                <el-option
                  v-for="item in memory_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12" :offset="0">
            <el-form-item label="CPU个数" prop="cpuNum">
              <el-select
                style="width: 60%"
                v-model="formData.cpuNum"
                clearable
                placeholder="请选择CPU个数"
              >
                <el-option
                  v-for="item in cpunum_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="系统类型" prop="OStype">
              <el-select
                style="width: 60%"
                v-model="formData.OStype"
                clearable
                placeholder="请选择系统类型"
              >
                <el-option
                  v-for="item in ostype_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12" :offset="0">
            <el-form-item label="虚拟机镜像,#仅支持qcow2格式" prop="ImgName">
              <el-select
                style="width: 60%"
                v-model="formData.ImgName"
                clearable
                @visible-change="nsremote"
                placeholder="请选择虚拟机镜像"
              >
                <el-option
                  v-for="item in images"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="节点" prop="node">
              <el-select
                style="width: 60%"
                v-model="formData.node"
                clearable
                placeholder="请选择创建虚拟机所在宿主机节点"
              >
                <el-option
                  v-for="item in node_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12" :offset="0">
            <el-form-item label="网络类型" prop="nettype">
              <el-select
                style="width: 60%"
                v-model="formData.nettype"
                clearable
                placeholder="请选择创建虚拟机的网络类型"
              >
                <el-option
                  v-for="item in nettype_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item size="large">
          <div class="vmc-sbm-area">
            <el-button round @click="resetForm('formData')">清空输入</el-button>
            <el-button round type="primary" @click="vmc_sumbit('formData')"
              >立即创建</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="执行命令" :visible.sync="commandvisible">
      <el-descriptions title="虚拟机信息">
        <el-descriptions-item label="名称">{{
          this.command_tmp_data.name
        }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag
            v-if="this.command_tmp_data.state === 'VIR_DOMAIN_PAUSED'"
            type="warning"
            >挂起</el-tag
          >
          <el-tag
            v-else-if="this.command_tmp_data.state === 'VIR_DOMAIN_RUNNING'"
            >运行</el-tag
          >
          <el-tag v-else type="danger">关机</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="cpu个数">{{
          this.command_tmp_data.cpuNum
        }}</el-descriptions-item>
        <el-descriptions-item label="分配内存(GiB)">{{
          this.command_tmp_data.maxMem
        }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{
          this.command_tmp_data.ipaddr
        }}</el-descriptions-item>
      </el-descriptions>
      <el-form
        label-position="top"
        label-width="80px"
        :model="commandForm"
        :status-icon="true"
        :rules="command_rules"
        ref="commandForm"
      >
        <el-form-item label="命令" prop="command">
          <el-input
            v-model="commandForm.command"
            placeholder="请输入要执行的命令"
            type="textarea"
            :rows="4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="result">
          <template slot="label"> 执行结果 </template>
          <el-input
            v-model="commandForm.result"
            placeholder="命令执行的结果将会显示在这里"
            type="textarea"
            :rows="4"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="res_state">
          <div style="float: right">
            <span
              style="color: #67c23a; font-size: 15px"
              v-if="this.commandForm.res_state === 'yes'"
              ><i class="el-icon-success"></i>执行成功</span
            >
            <span
              style="color: #f56c6c; font-size: 15px"
              v-if="this.commandForm.res_state === 'no'"
              ><i class="el-icon-error"></i>执行出错</span
            >
          </div>
        </el-form-item>
        <!-- <el-form-item label="端服务器" prop="edgeserver">
          <el-select
            style="width: 60%"
            v-model="commandForm.edgeserver"
            clearable
            placeholder="请选择端服务器"
          >
            <el-option
              v-for="item in edgeserver_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="容器" prop="pod">
          <el-select
            style="width: 60%"
            v-model="commandForm.pod"
            clearable
            placeholder="请选择执行容器"
          >
            <el-option
              v-for="item in pod_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->

        <el-form-item size="large">
          <div style="text-align: right; margin-top: 50px" class="vmc-sbm-area">
            <el-button round @click="resetForm('commandForm')"
              >清空输入</el-button
            >
            <el-button
              round
              type="primary"
              @click="start_command('commandForm')"
              >立即执行</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 虚拟机镜像 -->
    <el-drawer
      :visible.sync="imagedrawer"
      direction="ttb"
      size="90%"
      @open="imgdopen"
      v-loading="fullloading"
    >
      <!-- 头部标题操作 -->
      <div slot="title">
        <el-row :gutter="0">
          <el-col :span="5" :offset="0"
            ><p style="font-size: 25px; font-weight: 600; margin-bottom: 0px">
              {{ vmimg_tmp_data.name }}-容器镜像列表
            </p></el-col
          >
          <el-col :span="3" :offset="0">
            <el-select
              style="width: 80%"
              v-model="iamgename"
              clearable
              @visible-change="getimg"
              placeholder="请选择要上传的镜像"
            >
              <el-option
                v-for="item in img_list"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="2" :offset="0">
            <el-button
              @click="uploadImgToVm"
              icon="el-icon-circle-plus-outline"
              size="medium"
              round
              plain
              >上传镜像到虚拟机</el-button
            >
          </el-col>
        </el-row>
      </div>
      <div style="margin-left: 20px; margin-right: 20px">
        <!-- 表格区域 -->
        <el-table
          :data="
            cidata.filter(
              (data) =>
                !pcisearch ||
                data.repository.toLowerCase().includes(pcisearch.toLowerCase())
            )
          "
          style="width: 100%"
          height="700"
          empty-text="暂无容器镜像"
          :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
        >
          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column width="80" type="index" label="序号">
          </el-table-column>
          <el-table-column
            width="500"
            sortable
            label="仓库/镜像名"
            prop="repository"
          >
          </el-table-column>
          <el-table-column width="300" sortable label="标签" prop="tag">
          </el-table-column>
          <el-table-column width="200" sortable label="镜像ID" prop="imageid">
          </el-table-column>
          <el-table-column width="200" sortable label="创建时间" prop="created">
          </el-table-column>
          <el-table-column width="200" sortable label="体积" prop="size">
          </el-table-column>
          <el-table-column align="right">
            <template slot="header">
              <el-input
                v-model="pcisearch"
                size="mini"
                placeholder="输入名称搜索"
              />
            </template>
            <template slot-scope="scope">
              <div style="text-align: center">
                <el-button
                  plain
                  type="success"
                  @click="startimage(scope.$index, scope.row)"
                  >启动镜像</el-button
                >
                <el-button
                  plain
                  type="danger"
                  @click="deleteimage(scope.$index, scope.row)"
                  >删除</el-button
                >
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
    <!-- 虚拟机容器 -->
    <el-drawer
      :visible.sync="poddrawer"
      direction="ttb"
      size="90%"
      @open="podopen"
      v-loading="fullloading"
    >
      <!-- 头部标题操作 -->
      <div slot="title">
        <el-row :gutter="0">
          <el-col :span="5" :offset="0"
            ><p style="font-size: 25px; font-weight: 600; margin-bottom: 0px">
              {{ vmpod_tmp_data.name }}-容器列表
            </p></el-col
          >
        </el-row>
      </div>
      <div style="margin-left: 20px; margin-right: 20px">
        <!-- 表格区域 -->
        <el-table
          :data="
            poddata.filter(
              (data) =>
                !ppodsearch ||
                data.image.toLowerCase().includes(ppodsearch.toLowerCase())
            )
          "
          style="width: 100%"
          height="700"
          empty-text="暂无容器"
          :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
        >
          <!-- <el-table-column type="selection" width="55"> </el-table-column> -->
          <el-table-column width="80" type="index" label="序号">
          </el-table-column>
          <el-table-column width="200" sortable label="容器ID" prop="conid">
          </el-table-column>
          <el-table-column width="300" sortable label="镜像" prop="image">
          </el-table-column>
          <el-table-column width="200" sortable label="命令" prop="command">
          </el-table-column>
          <el-table-column width="300" sortable label="创建时间" prop="created">
          </el-table-column>
          <el-table-column width="300" sortable label="状态" prop="status">
          </el-table-column>
          <!-- <el-table-column width="200" sortable label="端口" prop="ports">
          </el-table-column> -->
          <el-table-column width="200" sortable label="名字" prop="names">
          </el-table-column>
          <el-table-column align="right">
            <template slot="header">
              <el-input
                v-model="ppodsearch"
                size="mini"
                placeholder="输入名称搜索"
              />
            </template>
            <template slot-scope="scope">
              <div style="text-align: center">
                <el-button-group>
                  <el-button
                    plain
                    type="success"
                    @click="startpod(scope.$index, scope.row)"
                    >启动</el-button
                  >
                  <el-button
                    plain
                    type="warning"
                    @click="stoppod(scope.$index, scope.row)"
                    >停止</el-button
                  >
                  <el-button
                    plain
                    type="danger"
                    @click="deletepod(scope.$index, scope.row)"
                    >删除</el-button
                  >
                </el-button-group>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "VMList",
  mounted() {
    this.getVMList("http://" + this.$store.state.nodeip + ":8080");
    this.baseurl="http://" + this.$store.state.nodeip + ":8080";
  },
  data() {
    return {
      // 抽屉显示控制
      poddrawer: false,
      imagedrawer: false,
      // 命令执行结果flag
      res_state: "",
      baseurl: "http://" + this.$store.state.nodeip + ":8080",
      execurl: "http://" + this.$store.state.nodeip + ":8081",
      // baseurl: "http://127.0.0.1:8080",
      vmdata: [],
      psearch: "",
      serverip: "",
      images: [],
      curpage: 1,
      totalvm: 0,
      pagesize: 10,
      formInline: {},
      buildvmvisible: false,
      commandvisible: false,
      command_tmp_data: {
        name: "无",
        state: "无",
        cpuNum: "无",
        ipaddr: "无",
        maxMem: "无",
      },
      nettype_options: [
        {
          label: "bridge",
          value: "bridge",
        },
        {
          label: "nat",
          value: "nat",
        },
      ],
      node_options: [
        {
          label: "云节点:39.98.124.97",
          value: "192.168.194.178",
        },
        {
          label: "端节点1:192.168.194.45",
          value: "192.168.194.45",
        },
        {
          label: "端节点2:192.168.194.164",
          value: "192.168.194.164",
        },
      ],
      ostype_options: [
        {
          label: "x86",
          value: "X86",
        },
        {
          label: "arm",
          value: "arm",
        },
      ],
      cpunum_options: [
        {
          label: "1 个",
          value: "1",
        },
        {
          label: "2 个",
          value: "2",
        },
        {
          label: "4 个",
          value: "4",
        },
        {
          label: "6 个",
          value: "6",
        },
        {
          label: "8 个",
          value: "8",
        },
        {
          label: "10 个",
          value: "10",
        },
      ],
      memory_options: [
        {
          label: "1 GiB",
          value: "1",
        },
        {
          label: "2 GiB",
          value: "2",
        },
        {
          label: "4 GiB",
          value: "4",
        },
        {
          label: "6 GiB",
          value: "6",
        },
        {
          label: "8 GiB",
          value: "8",
        },
        {
          label: "16 GiB",
          value: "16",
        },
        {
          label: "24 GiB",
          value: "24",
        },
        {
          label: "32 GiB",
          value: "32",
        },
      ],
      edgeserver_options: [
        {
          label: "端1",
          value: "worker1",
        },
      ],
      pod_options: [
        {
          label: "容器1",
          value: "pod1",
        },
      ],
      // 虚拟机信息
      formData: {
        name: "",
        memory: "",
        cpuNum: "",
        OStype: "",
        node: "",
        nettype: "",
      },
      commandForm: {
        command: "",
        edgeserver: "",
        pod: "",
        res_state: "",
        result: "",
      },
      // 校验规则
      vm_rules: {
        name: [
          { required: true, message: "请输入虚拟机名称", trigger: "blur" },
        ],
        memory: [
          { required: true, message: "请选择内存大小", trigger: "change" },
        ],
        node: [
          {
            required: true,
            message: "请选择创建虚拟机所在的节点",
            trigger: "change",
          },
        ],
        nettype: [
          {
            required: true,
            message: "请选择创建虚拟机的网络类型",
            trigger: "change",
          },
        ],
        cpuNum: [
          { required: true, message: "请选择CPU个数", trigger: "change" },
        ],
        OStype: [
          { required: true, message: "请选择系统类型", trigger: "change" },
        ],
      },
      command_rules: {
        command: [{ required: true, message: "请输入命令", trigger: "blur" }],
        // edgeserver: [
        //   { required: true, message: "请选择端服务器", trigger: "change" },
        // ],
        // pod: [
        //   { required: true, message: "请选择要执行的容器", trigger: "change" },
        // ]
      },
      vmpod_tmp_data: {},
      vmimg_tmp_data: {},
      // 虚拟机镜像
      cidata: [],
      pcisearch: "",
      iamgename: "",
      img_list: [],
      fullloading: false,
      // 虚拟机容器
      poddata: [],
      ppodsearch: "",
    };
  },
  methods: {
    // 删除容器
    deletepod(idx, row) {
      this.$axios
        .delete(
          this.baseurl +
            "/docker/deleteContainer?vmName=" +
            this.vmpod_tmp_data.name +
            "&endIp=" +
            this.$store.state.nodeip +
            "&containerId=" +
            row.conid
        )
        .then((res) => {
          if (res.data.exitStatus == 0) {
            this.$message({
              message: "容器" + row.conid + "删除成功",
              type: "success",
            });
            this.get_vm_pod();
          } else {
            this.$message({
              message: res.data.errorOutput,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
          this.$message({
            message: "删除失败，请检查网络设置",
            type: "error",
          });
        });
    },
    // 停止容器
    stoppod(idx, row) {
      this.$axios
        .post(
          this.baseurl +
            "/docker/stopContainer?vmName=" +
            this.vmpod_tmp_data.name +
            "&endIp=" +
            this.$store.state.nodeip +
            "&containerId=" +
            row.conid
        )
        .then((res) => {
          if (res.data.exitStatus == 0) {
            this.$message({
              message: "容器" + row.conid + "停止成功",
              type: "success",
            });
            this.get_vm_pod();
          } else {
            this.$message({
              message: res.data.errorOutput,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
          this.$message({
            message: "停止失败，请检查网络设置",
            type: "error",
          });
        });
    },
    // 启动容器
    startpod(idx, row) {
      this.$axios
        .post(
          this.baseurl +
            "/docker/startContainer?vmName=" +
            this.vmpod_tmp_data.name +
            "&endIp=" +
            this.$store.state.nodeip +
            "&containerId=" +
            row.conid
        )
        .then((res) => {
          if (res.data.exitStatus == 0) {
            this.$message({
              message: "容器" + row.conid + "启动成功",
              type: "success",
            });
            this.get_vm_pod();
          } else {
            this.$message({
              message: res.data.errorOutput,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
          this.$message({
            message: "启动失败，请检查网络设置",
            type: "error",
          });
        });
    },
    // 删除镜像
    deleteimage(idx, row) {
      this.$axios
        .delete(
          this.baseurl +
            "/docker/deleteImage?vmName=" +
            this.vmimg_tmp_data.name +
            "&endIp=" +
            this.$store.state.nodeip +
            "&imageName=" +
            row.repository +
            ":" +
            row.tag
        )
        .then((res) => {
          if (res.data.exitStatus == 0) {
            this.$message({
              message: "镜像" + row.repository + "删除成功",
              type: "success",
            });
            this.get_vm_img();
          } else {
            this.$message({
              message: res.data.errorOutput,
              type: "error",
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
          this.$message({
            message: "删除失败，请检查网络设置",
            type: "error",
          });
        });
    },
    // 启动镜像
    startimage(idx, row) {
      this.$prompt("请输入启动命令", "启动提示", {
        confirmButtonText: "启动",
        cancelButtonText: "取消",
        inputPlaceholder: "请输入启动命令",
        inputValue: "docker run -d " + row.repository + ":" + row.tag
      }).then(({ value }) => {
        this.$axios
          .post(
            this.baseurl +
              "/docker/run?vmName=" +
              this.vmimg_tmp_data.name +
              "&endIp=" +
              this.$store.state.nodeip +
              "&command=" + value
          )
          .then((res) => {
            if (res.data.exitStatus == 0) {
              this.$message({
                message: "镜像" + row.repository + "启动成功",
                type: "success",
              });
              this.get_vm_img();
            } else {
              this.$message({
                message: res.data.errorOutput,
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log("errors", err);
            this.$message({
              message: "启动失败，请检查网络设置",
              type: "error",
            });
          });
      });
    },
    // 上传镜像到虚拟机
    uploadImgToVm() {
      if (this.iamgename === "") {
        this.$message({
          message: "请先选择要上传的镜像",
          type: "error",
        });
      } else {
        this.fullloading = true;
        // 防止没有文件夹，先创建
        this.$axios
          .post(
            this.baseurl +
              "/docker/mkdir?vmName=" +
              this.vmimg_tmp_data.name +
              "&endIp=" +
              this.$store.state.nodeip +
              "&targetPath=/testimg"
          )
          .then((res) => {
            if (res.data.exitStatus == 0) {
              // 上传镜像到文件夹
              this.$axios
                .post(
                  this.baseurl +
                    "/docker/upload?vmName=" +
                    this.vmimg_tmp_data.name +
                    "&endIp=" +
                    this.$store.state.nodeip +
                    "&fileName=" +
                    this.iamgename +
                    "&targetPath=/testimg&sourceIp=39.98.124.97"
                )
                .then((res) => {
                  if (res.data.exitStatus == 0) {
                    this.$message({
                      message: "上传成功，等待导入到Docker",
                      type: "success",
                    });
                    // 导入镜像到Docker
                    this.$axios
                      .post(
                        this.baseurl +
                          "/docker/import?vmName=" +
                          this.vmimg_tmp_data.name +
                          "&endIp=" +
                          this.$store.state.nodeip +
                          "&targetPath=/testimg/&imageFileName=" +
                          this.iamgename
                      )
                      .then((res) => {
                        if (res.data.exitStatus == 0) {
                          this.$message({
                            message: "导入镜像" + this.iamgename + "成功",
                            type: "success",
                          });
                          this.fullloading = false;
                          this.get_vm_img();
                        } else {
                          if (
                            res.data.errorOutput !=
                            "Command execution timed out or the file is still uploading."
                          ) {
                            this.$message({
                              message: res.data.errorOutput,
                              type: "error",
                            });
                          } else {
                            this.$message({
                              message:
                                "镜像" +
                                this.iamgename +
                                "导入进行中，请稍后查看",
                              type: "success",
                            });
                            this.fullloading = false;
                            this.get_vm_img();
                          }
                        }
                      })
                      .catch((err) => {
                        console.log("errors", err);
                        this.$message({
                          message: "导入失败，请检查网络设置",
                          type: "error",
                        });
                      });
                  } else {
                    this.$message({
                      message: res.data.errorOutput,
                      type: "error",
                    });
                  }
                })
                .catch((err) => {
                  console.log("errors", err);
                  this.$message({
                    message: "上传失败，请检查网络设置",
                    type: "error",
                  });
                });
            } else {
              this.$message({
                message: "创建文件夹失败，请检查虚拟机目录",
                type: "error",
              });
            }
          })
          .catch((err) => {
            console.log("errors", err);
            this.$message({
              message: "创建文件夹失败，请检查网络问题",
              type: "error",
            });
          });
      }
    },
    // 获取镜像
    getimg() {
      this.img_list = [];
      this.$axios
        .get("http://39.98.124.97:8081/api/ssh/imgListByIP?ip=39.98.124.97")
        .then((res) => {
          let imgdata = res.data.output.split("\n");
          imgdata.pop();
          for (let i = 0; i < imgdata.length; i++) {
            this.img_list.push({
              label: imgdata[i],
              value: imgdata[i],
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 镜像抽屉打开
    imgdopen() {
      this.cidata = [];
      this.iamgename = "";
      this.img_list = [];
      this.get_vm_img();
    },
    // 镜像抽屉打开
    podopen() {
      this.poddata = [];
      this.get_vm_pod();
    },
    // 获取虚拟机镜像数据
    get_vm_pod() {
      this.$axios
        .get(
          this.baseurl +
            "/docker/containerList?vmName=" +
            this.vmpod_tmp_data.name +
            "&endIp=" +
            this.$store.state.nodeip
        )
        .then((res) => {
          this.poddata = this.data_resolver_pod(JSON.parse(res.data[0]).output);
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 获取虚拟机镜像数据
    get_vm_img() {
      this.$axios
        .get(
          this.baseurl +
            "/docker/imageList?vmName=" +
            this.vmimg_tmp_data.name +
            "&endIp=" +
            this.$store.state.nodeip
        )
        .then((res) => {
          this.cidata = this.data_resolver_image(
            JSON.parse(res.data[0]).output
          );
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 解析pod数据
    data_resolver_pod(sdata) {
      let res = [];
      let rows = sdata.split("\n");
      let i = 1;
      for (; i < rows.length - 1; i++) {
        let cols = rows[i].split("   ");
        let j = 0;
        cols = cols.filter(function (item) {
          return item !== "";
        });
        res.push({
          conid: cols[0],
          image: cols[1],
          command: cols[2],
          created: cols[3],
          status: cols[4],
          ports: "",
          names: cols[5],
        });
      }
      return res;
    },
    // 解析数据
    data_resolver_image(sdata) {
      let res = [];
      let rows = sdata.split("\n");
      let i = 1;
      for (; i < rows.length - 1; i++) {
        let cols = rows[i].split("   ");
        let j = 0;
        cols = cols.filter(function (item) {
          return item !== "";
        });
        res.push({
          repository: cols[0],
          tag: cols[1],
          imageid: cols[2],
          created: cols[3],
          size: cols[4],
        });
      }
      return res;
    },
    // 打开pod
    openpod(row) {
      this.poddrawer = true;
      this.vmpod_tmp_data = row;
    },
    // 打开image
    openimage(row) {
      this.imagedrawer = true;
      this.vmimg_tmp_data = row;
    },
    // 发送执行命令
    start_command(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 处理命令
          this.$axios({
            method: "post",
            url: this.execurl + "/api/ssh/execute",
            data: {
              VMname: this.command_tmp_data.name,
              commands: this.commandForm.command.split("\n"),
            },
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              console.log(res);
              if (res.data.exitStatus === 0) {
                this.commandForm.res_state = "yes";
                this.commandForm.result = res.data.output;
              } else {
                this.commandForm.res_state = "no";
                this.commandForm.result = res.data.errorOutput;
              }
            },
            (err) => {
              console.log(err);
              this.commandForm.result = "网络错误，请检查网络";
              this.commandForm.res_state = "no";
            }
          );
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 选择宿主机ip来更改baseurl，根据ip获取虚拟机数据
    suzhuchange(item) {
      this.serverip = item;
      this.baseurl = "http://" + this.serverip + ":8080";
      this.execurl = "http://" + this.serverip + ":8081";
      this.getVMList(ip);
    },
    // 打开执行命令
    opencommand(row) {
      this.commandvisible = true;
      this.command_tmp_data = row;
    },
    // 获取虚拟机列表数据
    getVMList(ip) {
      this.$axios
        .get(ip + "/getVMList")
        .then((res) => {
          this.vmdata = res.data;
          this.totalvm = res.data.length;
        })
        .catch((err) => {
          console.log("errors", err);
        });
      // this.vmdata = [{
      //   name: 'vm1',
      //   state: 'VIR_DOMAIN_RUNNING',
      //   cpuNum: 1,
      //   maxMem: 1,
      //   ipaddr: "39.98.124.97:8080"
      // }];
      // this.totalvm = this.vmdata.length;
    },
    openCreateVM() {
      this.buildvmvisible = true;
    },

    refreshIP() {
      console.log(this.baseurl)
      this.$axios
        .get(this.baseurl + "/VMInfo/updateip/" + this.$store.state.nodeip)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("更新成功！");
            this.getVMList(this.baseurl);
          } else {
            this.$message.success("更新失败！");
          }
        });
    },

    validName() {
      if (this.formData.name.includes(".")) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: "虚拟机名字不能包括特殊字符",
        });
      }
    },

    //获取/root/images/下的虚拟机镜像
    nsremote() {
    console.log(this.baseurl)
      this.$axios
        .get(this.baseurl + "/Images/imgList")
        .then((res) => {
          let resop = [];
          for (let i = 0; i < res.data.content.length; i++) {
            let tmp = {};
            tmp["label"] = res.data.content[i].name;
            tmp["value"] = res.data.content[i].name;
            resop.push(tmp);
          }
          this.images = resop;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 添加虚拟机
    vmc_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建虚拟机
          // this.$refs.upload.submit();
          this.buildvmvisible = false;
          this.$axios
            .get(
              this.baseurl +
                "/addVirtual?ImgName=" +
                this.formData.ImgName +
                "&name=" +
                this.formData.name +
                "&memory=" +
                this.formData.memory +
                "&cpuNum=" +
                this.formData.cpuNum +
                "&OStype=" +
                this.formData.OStype +
                "&nettype=" +
                this.formData.nettype +
                "&serverip=" +
                this.formData.node
            )
            .then((res) => {
              if (res.data.success === false) {
                this.$notify.error({
                  title: "创建虚拟机失败",
                  message: res.data.msg,
                  position: "bottom-right",
                });
              } else {
                this.$notify.success({
                  title: "创建虚拟机成功",
                  message: "创建虚拟机" + this.formData.name + "成功",
                  position: "bottom-right",
                });
              }
              this.getVMList(this.baseurl);
            })
            .catch((err) => {
              this.$notify.error({
                title: "创建失败",
                message: err,
                position: "bottom-right",
                duration: 6000,
              });
            });
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    vmstart(row) {
      console.log(this.baseurl)
      this.$axios
        .get(this.baseurl + "/initiate/" + row.name)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("启动成功！");
            this.getVMList(this.baseurl);
          } else {
            this.$message.success("启动失败！");
          }
        });
    },
    vmsuspend(row) {
      console.log(this.baseurl)
      this.$axios
        .get(this.baseurl + "/suspended/" + row.name)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("挂起成功！");
            this.getVMList(this.baseurl);
          } else {
            this.$message.success("挂起失败！");
          }
        });
    },
    vmresume(row) {
      console.log(this.baseurl)
      this.$axios.get(this.baseurl + "/resume/" + row.name).then((response) => {
        const data = response.data;
        if (data.success) {
          this.$message.success("还原成功！");
          this.getVMList(this.baseurl);
        } else {
          this.$message.success("还原失败！");
        }
      });
    },
    vmreboot(row) {
      console.log(this.baseurl)
      this.$axios.get(this.baseurl + "/reboot/" + row.name).then((response) => {
        const data = response.data;
        if (data.success) {
          this.$message.success("重启中...");
          this.getVMList(this.baseurl);
        } else {
          this.$message.success("重启失败！");
        }
      });
    },
    vmshutdown(row) {
      this.$axios
        .get(this.baseurl + "/shutdown/" + row.name)
        .then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("关机成功！");
            this.getVMList(this.baseurl);
          } else {
            this.$message.success("关机失败！");
          }
        });
    },

    vmshutdownMust(row) {
      this.$confirm(`您确定强行关机吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .get(this.baseurl + "/shutdownMust/" + row.name)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                this.$message.success("强行关机成功！");
                this.getVMList(this.baseurl);
              } else {
                this.$message.success("强行关机失败！");
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
    vmdelete(row) {
      this.$confirm(`您确定删除该虚拟机吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.baseurl + "/delete/" + row.name)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                this.$message.success("删除成功！");
                this.getVMList(this.baseurl);
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
  },
  computed: {
    tmp_nodename_w() {
      return this.$store.state.nodename;
    },
  },
  watch: {
    tmp_nodename_w(nv, ov) {
      this.vmdata = [];
      this.totalvm = this.vmdata.length;
      this.baseurl = "http://" + this.$store.state.nodeip + ":8080"
      this.execurl = "http://" + this.$store.state.nodeip + ":8081"
      this.getVMList("http://" + this.$store.state.nodeip + ":8080");
    },
  },
};
</script>

<style>
.vmarea {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-top: 15px;
}

/*带背景的分页按钮背景色begin*/
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #08c0b9;
  color: #fff;
}
.el-pagination.is-background .el-pager li.active {
  color: #fff;
  cursor: default;
}
.el-pagination.is-background .el-pager li:hover {
  color: #08c0b9;
}
.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: #08c0b9;
}
.el-pagination.is-background .el-pager li:not(.disabled).active:hover {
  background-color: #08c0b9;
  color: #fff;
}
/*带背景的分页按钮背景色end*/

/*不带背景的分页按钮背景色begin*/
.el-pager li.active {
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
