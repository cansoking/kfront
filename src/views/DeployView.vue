<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          部署列表
        </p></el-col
      >
      <el-col :span="6" :offset="8">
        <template>
          <el-upload
              ref="upload"
              class="upload-demo"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :limit="1"
              :on-change="handleChange"
              :http-request="uploadFile"
              accept=".yaml"
              :file-list="fileList"
              :on-exceed="handleExceed"
              :auto-upload="false"
          >
            <template #trigger>
              <el-button type="primary">select file</el-button>
            </template>
            <el-button class="ml-3" type="success" @click="submitUpload">
              upload to server
            </el-button>

          </el-upload>
        </template>
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
      <el-table-column width="250" sortable label="名称" prop="metadata.name">
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="命名空间"
        prop="metadata.namespace"
      >
      </el-table-column>
      <el-table-column width="600" sortable label="标签" prop="metadata.labels">
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
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <el-button-group>
          <div style="text-align: center;">
            <el-button plain type="danger" @click="delDeployment(scope.row.metadata.name)">删除</el-button>
          </div>
          <div style="text-align: center;">
            <el-button plain type="warning" @click="stopDeployment(scope.row.metadata.name)">暂停</el-button>
          </div>
            <div style="text-align: center;">
              <el-button plain type="success" @click="startDeployment(scope.row.metadata.name)">启动</el-button>
            </div>
          </el-button-group>
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
  </div>
</template>
  
  <script >
import {del} from "vue";


export default {
  name: "DeployView",
  mounted() {
    this.getVMList();
  },
  data() {
    return {
      baseurl: "http://127.0.0.1:8080",
      dpdata: [],
      psearch: "",
      curpage: 1,
      totaldp: 0,
      pagesize: 10,
      fileList: [],
      fileType: [ "yaml"],
    };
  },
  methods: {

    del,
    // 获取Deployment列表数据
    getVMList() {
      this.$axios
        .get(this.baseurl + "/deployment/list")
        .then((res) => {
          this.dpdata = JSON.parse(res.data.result).items;
          this.totaldp = JSON.parse(res.data.result).items.length;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    delDeployment(name) {
      console.log(name)
      this.$axios({
        method: "post",
        url: this.baseurl + "/deployment/deleteDeployment?deploymentName="+name,
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
            this.getVMList();
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
      console.log(name)
      this.$axios({
        method: "get",
        url: this.baseurl + "/deployment/stopDeployment?deploymentName="+name,
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
              this.getVMList();
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
      console.log(name)
      this.$axios({
        method: "get",
        url: this.baseurl + "/deployment/startDeployment?deploymentName="+name,
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
              this.getVMList();
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
    handleChange (file, fileList) {
      this.fileList = fileList;
      // console.log(this.fileList, "sb");
    },
    //自定义上传文件
    uploadFile (file) {
      this.formData.append("file", file.file);
      // console.log(file.file, "sb2");
    },
    handleExceed(){
      this.$message({
        type:'warning',
        message:'超出最大上传文件数量的限制！'
      });return
    },
    submitUpload(){
      //上传文件的需要formdata类型;所以要转
      let formData = new FormData();
      formData.append("yamlFile", this.fileList[0]);//拿到存在fileList的文件存放到formData中
      console.log(formData)
      console.log(this.fileList[0])
      this.$axios({
        method: "post",
        url: this.baseurl + "/deployment/createDeployment?yamlFile="+formData,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data;charset=utf-8"
        },
      }).then(
          (res) => {
            this.$notify.success({
              title: "操作通知",
              message: "应用 " + name + "暂停成功",
              position: "bottom-right",
            });
            setTimeout(() => {
              this.getVMList();
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