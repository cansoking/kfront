<template>
  <div class="vmarea" v-loading="proloading">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          Docker镜像列表
        </p></el-col
      >
      <el-col :span="4" :offset="6">
        <el-select
          v-model="endip"
          placeholder="请选择端IP"
          :loading="isloading"
          loading-text="正在拉取数据"
          @visible-change="searchend"
          clearable
        >
          <el-option
            v-for="item in end_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.value
            }}</span>
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="2" :offset="0">
        <el-button
          @click="fenfa_img"
          icon="el-icon-s-promotion"
          size="large"
          round
          plain
          >分发镜像</el-button
        >
      </el-col>

      <el-col :span="2" :offset="0">
        <el-button
          @click="openUploadImage"
          icon="el-icon-circle-plus-outline"
          size="large"
          round
          plain
          :disabled="$store.state.nodename != 'master1'"
          >上传镜像</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="
        cidata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.name.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无Docker镜像"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column width="80" type="index" label="序号"> </el-table-column>
      <el-table-column width="500" sortable label="镜像名称" prop="name">
      </el-table-column>
      <el-table-column width="200" label="分发目标地址" prop="des_ip">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.des_ip != ''" type="default" size="normal">{{
            scope.row.des_ip
          }}</el-tag>
          <el-tag v-else type="info" size="normal">未进行分发</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="600" label="分发进度" prop="percentage">
        <template slot-scope="scope">
          <el-progress
            v-if="scope.row.percentage != -1"
            :percentage="scope.row.percentage"
            :status="scope.row.percentage === 100 ? 'success' : ''"
          ></el-progress>
          <el-tag v-else type="info" size="normal">未进行分发</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <div style="text-align: center">
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
    <!-- 分页栏 -->
    <div v-if="cidata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalci"
        background
      >
      </el-pagination>
    </div>
    <!-- 上传镜像对话框 -->
    <el-dialog title="上传Docker镜像" :visible.sync="uploadimagevisible">
      <div style="text-align: center">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          :action="baseurl + '/api/ssh/uploadImg'"
          :multiple="false"
          accept=".tar"
          :auto-upload="true"
          :limit="1"
          name="imgfile"
          :before-upload="handleBeforeUpload"
          :on-success="sucupload"
          :on-error="errupload"
          style="width: 100%"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">*只能上传.tar文件</div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
    
    <script>
export default {
  name: "DockerImage",
  mounted() {
    this.getVMList();
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8081",
      cidata: [],
      psearch: "",
      curpage: 1,
      totalci: 0,
      pagesize: 10,
      uploadimagevisible: false,
      reqData: {
        virtualMachineIp: "",
        userName: "",
        userPassword: "",
        imageId: "",
      },
      formData: {
        virtualMachineIp: "39.98.124.97",
        userName: "root",
        userPassword: "Upc123456@",
      },
      fenfa_list: [],
      end_options: [],
      endip: "",
      isloading: false,
      proloading: false,
    };
  },
  methods: {
    // 分发镜像
    fenfa_img() {
      if (this.fenfa_list.length == 0) {
        this.$message({
          message: "请选择一个要分发镜像",
          type: "error",
        });
      } else if (this.endip === "") {
        this.$message({
          message: "请选择要分发的端节点",
          type: "error",
        });
      } else {
        let tmp_docker = this.fenfa_list[0];
        this.proloading = true;
        this.$axios
          .get(
            this.baseurl +
              "/api/ssh/dispenseImgByIP?sourceip=" +
              this.$store.state.nodeip +
              "&fileName=" +
              tmp_docker.name +
              "&endip=" +
              this.endip
          )
          .then((res) => {
            this.proloading = false;
            tmp_docker.des_ip = this.endip;
            tmp_docker.percentage = 0;
            this.$message({
              message: "已启动分发任务",
              type: "success",
            });
            // 设置定时器获取进度
            this.interval = window.setInterval(() => {
              // setTimeout是自带清除定时器
              setTimeout(this.getProcess(tmp_docker), 500);
            }, 1000);
          })
          .catch((err) => {
            console.log("errors", err);
            this.$message({
              message: "启动分发失败，请检查网络",
              type: "error",
            });
          });
      }
    },
    // 获取分发进度
    getProcess(tmp_docker) {
      this.$axios
        .get(
          this.baseurl +
            "/api/ssh/getProgress?sourceip=" +
            this.$store.state.nodeip +
            "&fileName=" +
            tmp_docker.name +
            "&endip=" +
            this.endip
        )
        .then((res) => {
          if (res.data.exitStatus === 0) {
            let per = parseInt(parseFloat(res.data.output) * 100);
            if (per >= 100) {
              tmp_docker.percentage = 100;
              window.clearInterval(this.interval);
              this.$message({
                message: tmp_docker.name + "分发完成",
                type: "success",
              });
            } else {
              tmp_docker.percentage = per;
            }
          }
        })
        .catch((err) => {
          console.log("errors", err);
          window.clearInterval(this.interval);
          this.$message({
            message: "获取进度失败，请检查网络",
            type: "error",
          });
        });
    },
    // 搜索端节点
    searchend() {
      this.end_options = [];
      this.loading = true;
      this.$axios
        .get("http://39.98.124.97:8080" + "/node/getNodeList1")
        .then((res) => {
          let nodeinfo = res.data.content;
          for (let i = 0; i < nodeinfo.length; i++) {
            // if (nodeinfo[i].nodeType === "边") {
            //   this.end_options.push({
            //     label:
            //       "端节点" +
            //       nodeinfo[i].nodeName[nodeinfo[i].nodeName.length - 1],
            //     value: nodeinfo[i].nodeIp,
            //   });
            // }
            this.end_options.push({
              label:
                nodeinfo[i].nodeType +
                "节点" +
                nodeinfo[i].nodeName[nodeinfo[i].nodeName.length - 1],
              value: nodeinfo[i].nodeIp,
            });
          }
        })
        .catch((err) => {
          console.log("errors", err);
        });
      this.isloading = false;
    },
    // 多选
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$message({
          message: "目前只支持单镜像分发",
          type: "error",
        });
        this.$refs.multipleTable.toggleRowSelection(val[val.length - 1]);
      } else {
        this.fenfa_list = val;
      }
    },
    // 删除镜像
    deleteimage(idx, row) {
      //   this.reqData.virtualMachineIp = this.formData.virtualMachineIp;
      //   this.reqData.userName = this.formData.userName;
      //   this.reqData.userPassword = this.formData.userPassword;
      //   this.reqData.imageId = row.imageid;
      //   console.log("row:" + row);
      this.$axios
        .get(
          this.baseurl +
            "/api/ssh//deleteImgByIP?ip=" +
            this.$store.state.nodeip +
            "&fileName=" +
            row.name
        )
        .then((res) => {
          console.log(res);
          if (res.data.exitStatus === 0) {
            this.$notify.success({
              title: "删除成功",
              message: "docker镜像删除成功",
              position: "bottom-right",
              duration: 6000,
            });
            this.getVMList();
          } else {
            this.$notify.error({
              title: "删除失败",
              message: res.data.errorOutput,
              position: "bottom-right",
              duration: 6000,
            });
            this.getVMList();
          }
        })
        .catch((err) => {
          console.log("errors", err);
          this.$notify.error({
            title: "删除失败",
            message: "请检查网络设置",
            position: "bottom-right",
            duration: 6000,
          });
        });
    },
    // 上传失败
    errupload(err, file, fileList) {
      this.$notify.error({
        title: "上传失败",
        message: JSON.parse(err.message).message,
        position: "bottom-right",
        duration: 6000,
      });
      this.uploadimagevisible = false;
      this.getVMList();
    },
    // 成功上传文件
    sucupload(response, file, fileList) {
      console.log(response);
      if (response.exitStatus === 0) {
        this.$notify.success({
          title: "上传成功",
          message: "镜像上传成功",
          position: "bottom-right",
          duration: 6000,
        });
        this.uploadimagevisible = false;
        this.getVMList();
      } else {
        this.$notify.error({
          title: "上传失败",
          message: response,
          position: "bottom-right",
          duration: 6000,
        });
        this.uploadimagevisible = false;
        this.getVMList();
      }
    },
    // 控制文件格式
    handleBeforeUpload(file) {
      console.log(file);
      var iso = file.name.substring(file.name.lastIndexOf(".") + 1);
      const suffix = iso === "tar";
      if (!suffix) {
        this.$message.error("只能上传TAR文件！");
        return false;
      }
      return suffix;
    },
    // 解析数据
    data_resolver(sdata) {
      let res = [];
      let rows = sdata.split("\n");
      let i = 1;
      for (; i < rows.length - 1; i++) {
        let cols = rows[i].split(" ");
        let j = 0;
        cols = cols.filter(function (item) {
          return item !== "";
        });
        res.push({
          imageName: cols[0],
          imageTag: cols[1],
          imageId: cols[2],
          imageSize: cols[3],
        });
      }
      return res;
    },
    // 获取容器镜像列表数据
    getVMList() {
      this.$axios
        .get(
          this.baseurl + "/api/ssh/imgListByIP?ip=" + this.$store.state.nodeip
        )
        .then((res) => {
          let res_data = res.data;
          let docker_img_list = res_data.output.split("\n");
          docker_img_list.pop();
          // 构建表格数据
          this.cidata = [];
          for (let i = 0; i < docker_img_list.length; i++) {
            this.cidata.push({
              name: docker_img_list[i],
              des_ip: "",
              percentage: -1,
            });
          }
          this.totalci = this.cidata.length;
          // let s_data = this.data_resolver(res.data.result);
          // this.cidata = s_data;
          // this.totalci = s_data.length;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 打开上传镜像dialog
    openUploadImage() {
      this.uploadimagevisible = true;
    },
  },
  computed: {
    tmp_nodename_w() {
      return this.$store.state.nodename;
    },
  },
  watch: {
    tmp_nodename_w(nv, ov) {
      this.getVMList();
    },
  },
};
</script>
    
    <style>
.el-upload {
  width: 100%;
  height: 400px;
}
.el-upload .el-upload-dragger {
  width: 100%;
  height: 400px;
  padding-top: 120px;
}

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