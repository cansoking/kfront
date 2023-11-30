<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          应用镜像列表
        </p></el-col
      >
      <el-col :span="2" :offset="12">
        <el-button
          @click="openUploadImage"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >上传应用镜像</el-button
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
              data.image.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无应用镜像"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column width="80" type="index" label="序号"> </el-table-column>
      <el-table-column width="300" sortable label="镜像名称" prop="imageName">
      </el-table-column>
      <el-table-column width="300" sortable label="标签" prop="imageTag">
      </el-table-column>
      <el-table-column width="200" sortable label="镜像ID" prop="imageId">
      </el-table-column>
      <el-table-column width="200" sortable label="镜像大小" prop="imageSize">
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
    <el-dialog title="上传应用镜像" :visible.sync="uploadimagevisible">
      <div style="text-align: center">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          :action="baseurl + '/containerd/uploadImage'"
          :data="formData"
          :multiple="false"
          accept=".tar"
          :auto-upload="true"
          :limit="1"
          name="tarFile"
          :before-upload="handleBeforeUpload"
          :on-success="sucupload"
          :on-error="errupload"
          style="width: 100%"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            <div>*只能上传.tar文件</div>
            <el-link type="primary">打包应用镜像指南</el-link>
          </div>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>
    
    <script>
import { del } from "vue";

export default {
  name: "AppImage",
  mounted() {
    this.getVMList();
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      cidata: [],
      psearch: "",
      curpage: 1,
      totalci: 0,
      pagesize: 10,
      uploadimagevisible: false,
      formData: {
        virtualMachineIp: "39.98.124.97",
        userName: "root",
        userPassword: "Upc123456@",
      },
    };
  },
  methods: {
    // 删除镜像
    deleteimage(idx, row) {
      this.$axios
        .post(this.baseurl + "/containerd/deleteImage", {
          vmInfo: this.formData,
          imageInfo: row,
        })
        .then((res) => {
          if (res.data[0] === "I") {
            this.$notify.success({
              title: "删除成功",
              message: "镜像删除成功",
              position: "bottom-right",
              duration: 6000,
            });
            this.getVMList();
          } else {
            this.$notify.error({
              title: "删除失败",
              message: response,
              position: "bottom-right",
              duration: 6000,
            });
            this.getVMList();
          }
        })
        .catch((err) => {
          console.log("errors", err);
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
      if (response[0] === "I") {
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
        .post(this.baseurl + "/containerd/images/list", {
          virtualMachineIp: "39.98.124.97",
          userName: "root",
          userPassword: "Upc123456@",
        })
        .then((res) => {
          let s_data = this.data_resolver(res.data.result);
          this.cidata = s_data;
          this.totalci = s_data.length;
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