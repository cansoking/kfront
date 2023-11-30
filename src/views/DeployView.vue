<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          部署列表
        </p></el-col
      >
      <el-col :span="2" :offset="10">
        <el-button
          @click="openUploadDeployment"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >上传部署</el-button
        >
      </el-col>
      <el-col :span="2">
        <el-button
          @click="openCreateDeployment"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >添加部署</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="
        dpdata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.metadata.name.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无部署"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column width="250" sortable label="名称" prop="metadata.name">
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="命名空间"
        prop="metadata.namespace"
      >
      </el-table-column>
      <el-table-column width="500" sortable label="标签" prop="metadata.labels">
        <template slot-scope="scope">
          {{
            JSON.stringify(scope.row.metadata.labels)
              .replaceAll("{", "")
              .replaceAll("}", "")
              .replaceAll('"', "")
          }}
        </template>
      </el-table-column>
      <el-table-column width="80" sortable label="Pod" prop="pod">
        <template slot-scope="scope">
          {{
            scope.row.status.readyReplicas ? scope.row.status.readyReplicas : 0
          }}/{{ scope.row.status.replicas }}
        </template>
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="创建时间"
        prop="metadata.creationTimestamp"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ formatDate(scope.row.metadata.creationTimestamp, 'YYYY-MM-DD') }}</span><br>
            <span>{{ formatDate(scope.row.metadata.creationTimestamp, 'HH:mm:ss') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <div style="text-align: center">
            <el-button-group>
              <el-button
                plain
                type="success"
                @click="startDeployment(scope.row.metadata.name)"
                >启动</el-button
              >
              <el-button
                plain
                type="warning"
                @click="stopDeployment(scope.row.metadata.name)"
                >暂停</el-button
              >
              <el-button
                plain
                type="danger"
                @click="delDeployment(scope.row.metadata.name)"
                >删除</el-button
              >
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="dpdata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totaldp"
        background
      >
      </el-pagination>
    </div>
    <!-- 上传部署对话框 -->
    <el-dialog title="上传部署" :visible.sync="uploaddeploymentvisible">
      <div style="text-align: center">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :auto-upload="false"
          accept=".yaml"
          :limit="1"
          :on-change="handleChange"
          :http-request="uploadFile"
          :file-list="fileList"
          :on-exceed="handleExceed"
          :before-upload="handleBeforeUpload"
          :on-success="sucupload"
          :on-error="errupload"
          style="width: 100%"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">*只能上传.yaml文件</div>
        </el-upload>
        <div style="padding-top: 50px">
          <el-button
            class="ml-3"
            round
            plain
            type="primary"
            @click="submitUpload"
          >
            上传到服务器
          </el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 添加应用对话框 -->
    <el-dialog title="添加应用" :visible.sync="createDeploymentvisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="deployment_form"
        :status-icon="true"
        :rules="deployment_rules"
        ref="deployment_form"
      >
        <el-form-item label="应用名称" prop="deploymentName">
          <el-input
            v-model="deployment_form.deploymentName"
            placeholder="请输入应用名称（首字母需为小写字母）"
          ></el-input>
        </el-form-item>
        <el-form-item label="镜像名称" prop="image">
          <el-input
            v-model="deployment_form.image"
            placeholder="请输入镜像名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="容器端口号" prop="containerPort">
          <el-input
            v-model="deployment_form.containerPort"
            placeholder="请输入容器端口号"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务端口号" prop="servicePort">
          <el-input
            v-model="deployment_form.servicePort"
            placeholder="请输入服务端口号"
          ></el-input>
        </el-form-item>
        <el-form-item label="节点端口号" prop="nodePort">
          <el-input
            v-model="deployment_form.nodePort"
            placeholder="请输入节点端口号（端口号>30000）"
          ></el-input>
        </el-form-item>
        <el-form-item size="large">
          <div class="cp-sbm-area">
            <el-button round @click="resetForm('deployment_form')"
              >清空输入</el-button
            >
            <el-button
              round
              type="primary"
              @click="deployment_sumbit('deployment_form')"
              >立即创建</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script >
import { del } from "vue";

export default {
  name: "DeployView",
  mounted() {
    this.getDeploymentList();
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      dpdata: [],
      psearch: "",
      curpage: 1,
      totaldp: 0,
      pagesize: 10,
      fileList: [],
      fileType: ["yaml"],
      createDeploymentvisible: false,
      uploaddeploymentvisible: false,
      deployment_form: {
        deploymentName: "",
        image: "",
        containerPort: "",
        servicePort: "",
        nodePort: "",
      },
      deployment_rules: {
        deploymentName: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
        ],
        image: [{ required: true, message: "请输入镜像名称", trigger: "blur" }],
        containerPort: [
          { required: true, message: "请输入容器端口", trigger: "blur" },
        ],
        servicePort: [
          { required: true, message: "请输入服务端口", trigger: "blur" },
        ],
        nodePort: [
          { required: true, message: "请输入节点端口", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    formatDate(timestamp, format) {
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
      } else if (format === 'HH:mm:ss') {
        return `${hours}:${minutes}:${seconds}`;
      } else {
        return ''; // 可以根据需要添加其他格式
      }
    },
    del,
    // 打开部署上传
    openUploadDeployment() {
      this.uploaddeploymentvisible = true;
    },
    openCreateDeployment() {
      this.createDeploymentvisible = true;
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加容器
    deployment_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/deployment/deployByParam",
            data: {
              deploymentName: this.deployment_form.deploymentName,
              image: this.deployment_form.image,
              containerPort: this.deployment_form.containerPort,
              servicePort: this.deployment_form.servicePort,
              nodePort: this.deployment_form.nodePort,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              console.log(res);
              if (res.data.success !== true) {
                this.$notify.error({
                  title: "创建失败",
                  message: res.data,
                  position: "bottom-right",
                });
              } else {
                this.$notify.success({
                  title: "完成通知",
                  message:
                    "应用 " + this.deployment_form.deploymentName + " 创建成功",
                  position: "bottom-right",
                });
                this.createDeploymentvisible = false;
                setTimeout(() => {
                  this.getDeploymentList();
                }, 1000);
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
          this.createpodvisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 获取Deployment列表数据
    getDeploymentList() {
      this.$axios
        .get(this.baseurl + "/deployment/list")
        .then((res) => {
          console.log(JSON.parse(res.data.result))
          this.dpdata = JSON.parse(res.data.result).items;
          this.totaldp = JSON.parse(res.data.result).items.length;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    delDeployment(name) {
      console.log(name);
      this.$axios({
        method: "post",
        url:
          this.baseurl + "/deployment/deleteDeployment?deploymentName=" + name,
        data: {
          deploymentName: name,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (res) => {
          this.$notify.success({
            title: "操作通知",
            message: "应用 " + name + "删除成功",
            position: "bottom-right",
          });
          this.getDeploymentList();
        },
        (err) => {
          console.log(err);
          this.$notify.error({
            title: "删除失败",
            message: "请检查网络连接设置",
            position: "bottom-right",
          });
        }
      );
    },
    stopDeployment(name) {
      console.log(name);
      this.$axios({
        method: "get",
        url: this.baseurl + "/deployment/stopDeployment?deploymentName=" + name,
        data: {
          deploymentName: name,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (res) => {
          this.$notify.success({
            title: "操作通知",
            message: "应用 " + name + "暂停成功",
            position: "bottom-right",
          });
          setTimeout(() => {
            this.getDeploymentList();
          }, 1000);
        },
        (err) => {
          console.log(err);
          this.$notify.error({
            title: "暂停失败",
            message: "请检查网络连接设置",
            position: "bottom-right",
          });
        }
      );
    },
    startDeployment(name) {
      console.log(name);
      this.$axios({
        method: "get",
        url:
          this.baseurl + "/deployment/startDeployment?deploymentName=" + name,
        data: {
          deploymentName: name,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (res) => {
          this.$notify.success({
            title: "操作通知",
            message: "应用 " + name + "启动成功",
            position: "bottom-right",
          });
          setTimeout(() => {
            this.getDeploymentList();
          }, 1000);
        },
        (err) => {
          console.log(err);
          this.$notify.error({
            title: "暂停失败",
            message: "请检查网络连接设置",
            position: "bottom-right",
          });
        }
      );
    },
    handleChange(file, fileList) {
      this.fileList = fileList;
      // console.log(this.fileList, "sb");
    },
    //自定义上传文件
    uploadFile(file) {
      this.formData.append("file", file.file);
      // console.log(file.file, "sb2");
    },
    handleExceed() {
      this.$message({
        type: "warning",
        message: "超出最大上传文件数量的限制！",
      });
      return;
    },
    submitUpload() {
      //上传文件的需要formdata类型;所以要转
      let formData = new FormData();
      formData.append("yamlFile", this.fileList[0].raw); //拿到存在fileList的文件存放到formData中
      console.log(formData);
      console.log(this.fileList[0]);

      this.$axios({
        method: "post",
        url: this.baseurl + "/deployment/createDeployment",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(
        (res) => {
          this.$notify.success({
            title: "操作通知",
            message: "应用 xxx" + name + "创建成功",
            position: "bottom-right",
          });
          setTimeout(() => {
            this.getDeploymentList();
          }, 2000);
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