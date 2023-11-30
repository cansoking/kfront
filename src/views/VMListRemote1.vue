<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          虚拟机列表
        </p></el-col
      >
      <el-col :span="2" :offset="12">
      <el-button
          @click="openCreateVM"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
      >新增虚拟机
      </el-button
      >
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
    <el-table-column
        type="index"
        label="序号"
        width="100"
      >
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="名称"
        prop="name"
      >
      </el-table-column>
      <el-table-column width="200" sortable label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 'VIR_DOMAIN_PAUSED'" type="warning"
            >挂起</el-tag
          >
          <el-tag v-else-if="scope.row.state === 'VIR_DOMAIN_RUNNING'">运行</el-tag>
          <el-tag v-else type="danger">关机</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        sortable
        label="cpu个数"
        prop="cpuNum"
      >
      </el-table-column>
      <!-- <el-table-column
        width="120"
        sortable
        label="cpu利用率"
        prop="usecpu"
      >
      </el-table-column> -->
      <el-table-column
        width="120"
        sortable
        label="分配内存(GiB)"
        prop="maxMem"
      >
      </el-table-column>
      <!-- <el-table-column
        width="120"
        sortable
        label="内存利用率"
        prop="useMem"
      >
      </el-table-column> -->
      
      <el-table-column align="right">
        <template slot="header">
          <el-input style="width: 30%;" v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button plain type="success" @click="vmstart(scope.row)">启动</el-button>
            <el-button plain type="warning" @click="vmsuspend(scope.row)">挂起</el-button>
            <el-button plain type="success" @click="vmresume(scope.row)">还原</el-button>
            <el-button plain type="primary" @click="vmreboot(scope.row)">重启</el-button>
            <el-button plain type="info" @click="vmshutdown(scope.row)">关闭</el-button>
            <el-button plain type="danger" @click="vmshutdownMust(scope.row)">强制关闭</el-button>
            <el-button plain type="danger" @click="vmdelete(scope.row)">删除</el-button>
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

    <el-dialog title="创建虚拟机"
               :visible.sync="buildvmvisible">
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
                @blur="validName()"></el-input>
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

        <el-form-item label="虚拟机映像文件" prop="vm_iso">
          <el-upload
            class="upload-demo"
            drag
            ref="upload"
            :action="baseurl + '/addVirtual'"
            :multiple="false"
            :data="formData"
            accept=".iso"
            :auto-upload="false"
            :limit="1"
            :before-upload="handleBeforeUpload"
            :on-success="sucupload"
            :on-error="errupload"
            style="width: 30%"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">*只能上传.iso/ .qemu2/ .img文件</div> 
          </el-upload>
        </el-form-item>
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


  </div>
</template>

<script>
export default {
  name: "VMList",
  mounted() {
    this.getIP();
    this.getVMList()
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8080/remoteVM",
      ipaddr:"39.98.124.97",
      vmdata: [],
      psearch: "",
      curpage: 1,
      totalvm: 0,
      pagesize: 10,
      buildvmvisible: false,
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
          label: '1 个',
          value: '1',
        },
        {
          label: '2 个',
          value: '2',
        },
        {
          label: '4 个',
          value: '4',
        },
        {
          label: '6 个',
          value: '6',
        },
        {
          label: '8 个',
          value: '8',
        },
        {
          label: '10 个',
          value: '10',
        }
      ],
      memory_options: [
      {
          label: '1 GiB',
          value: '1'
        },{
          label: '2 GiB',
          value: '2'
        },{
          label: '4 GiB',
          value: '4'
        },{
          label: '6 GiB',
          value: '6'
        },{
          label: '8 GiB',
          value: '8'
        },{
          label: '16 GiB',
          value: '16'
        },{
          label: '24 GiB',
          value: '24'
        },{
          label: '32 GiB',
          value: '32'
        }
      ],
      // 虚拟机信息
      formData: {
        name: "",
        memory: "",
        cpuNum: "",
        OStype: "",
      },
      // 校验规则
      vm_rules: {
        name: [
          { required: true, message: "请输入虚拟机名称", trigger: "blur" },
        ],
        memory: [
          { required: true, message: "请选择内存大小", trigger: "change" },
        ],
        cpuNum: [{ required: true, message: "请选择CPU个数", trigger: "change" }],
        OStype: [
          { required: true, message: "请选择系统类型", trigger: "change" },
        ],
      },
    };
  },

  methods: {
    getIP(){
    this.$axios
        .get(this.baseurl + "/getIP",{
          params: {
            ipaddr: this.ipaddr
          }
        })
  },
    // 获取虚拟机列表数据
    getVMList() {
      this.$axios
        .get(this.baseurl + "/getVMList")
        .then((res) => {
          this.vmdata = res.data;
          this.totalvm = res.data.length;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    openCreateVM(){
      this.buildvmvisible = true;
    },

    validName() {
      if (this.formData.name.includes('.')) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: '虚拟机名字不能包括特殊字符',
        });
      }
    },

    // 上传失败
    errupload(err, file, fileList) {
      this.$notify.error({
        title: "创建失败",
        message: JSON.parse(err.message).message,
        position: "bottom-right",
        duration: 6000,
      });
    },
    // 成功上传文件
    sucupload(response, file, fileList) {
      if (response.success===true) {
        this.$notify.success({
          title: "创建成功",
          message: "虚拟机 " + this.formData.name + " 创建成功！",
          position: "bottom-right",
          duration: 6000,
        });
        this.buildvmvisible=false;
      } else {
        this.$notify.error({
          title: "创建失败",
          message: response,
          position: "bottom-right",
          duration: 6000,
        });
      }
    },
    // 控制文件格式
    handleBeforeUpload(file) {
      console.log(file);
      var suffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (suffix!="iso"&&suffix!="img"&&suffix!="qcow2") {
        this.$message.error("只能上传iso、img或qcow2格式的文件！");
        return false;
      }
      return suffix;
    },
    // 添加虚拟机
    vmc_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建虚拟机
          this.$refs.upload.submit();
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
        this.$axios
            .get(this.baseurl+"/initiate/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("启动成功！");
            this.getVMList();
          } else {
            this.$message.success("启动失败！");
          }
        })
    },
    vmsuspend(row) {

        this.$axios
            .get(this.baseurl+"/suspended/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("挂起成功！");
            this.getVMList();
          } else {
            this.$message.success("挂起失败！");
          }
        })
      
    },
        vmresume(row) {
        this.$axios
            .get(this.baseurl+"/resume/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("还原成功！");
            this.getVMList();
          } else {
            this.$message.success("还原失败！");
          }
        })
      
    },
        vmreboot(row) {
        this.$axios
            .get(this.baseurl+"/reboot/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("重启中...");
            this.getVMList();
          } else {
            this.$message.success("重启失败！");
          }
        })
      
    },
        vmshutdown(row) {
        this.$axios
            .get(this.baseurl+"/shutdown/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("关机成功！");
            this.getVMList();
          } else {
            this.$message.success("关机失败！");
          }
        })
    },
    
    vmshutdownMust(row) {
      this.$confirm(`您确定强行关机吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
            .get(this.baseurl+"/shutdownMust/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("强行关机成功！");
            this.getVMList();
          } else {
            this.$message.success("强行关机失败！");
          }
        })
      }).catch(() => {
        // 取消操作
        this.$message({
          type: 'info',
          message: '已取消'
        })
      });
    },
    vmdelete(row) {
      this.$confirm(`您确定删除该虚拟机吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
            .delete(this.baseurl+"/delete/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("删除成功！");
            this.getVMList();
          } else {
            this.$message.success("删除失败！");
          }
        })
      }).catch(() => {
        // 取消操作
        this.$message({
          type: 'info',
          message: '已取消'
        })
      });
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
