<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          镜像列表
        </p></el-col
      >
      <el-col :span="2" :offset="12">
        <el-button
          @click="openUploadImage"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >上传镜像</el-button
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
      empty-text="暂无镜像"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column width="80" sortable label="ID" prop="id">
      </el-table-column>
      <el-table-column width="200" sortable label="镜像名称" prop="name">
      </el-table-column>
      <el-table-column width="100" sortable label="标签" prop="state">
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
      <el-table-column width="200" sortable label="镜像ID" prop="imageid">
      </el-table-column>
      <el-table-column width="200" sortable label="体积" prop="imagevolume">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input
            style="width: 30%"
            v-model="psearch"
            size="mini"
            placeholder="输入名称搜索"
          />
        </template>
        <template slot-scope="scope">
          <el-button plain type="danger">删除</el-button>
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
    <!-- 上传镜像对话框 -->
    <el-dialog title="上传镜像" :visible.sync="uploadimagevisible">
      <div style="text-align: center">
        <el-upload
          class="upload-demo"
          drag
          ref="upload"
          :action="baseurl + '#'"
          :multiple="false"
          accept=".tar"
          :auto-upload="false"
          :limit="1"
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
  name: "ImageList",
  mounted() {
    this.getVMList();
  },
  data() {
    return {
      baseurl: "http://127.0.0.1:8080",
      vmdata: [],
      psearch: "",
      curpage: 1,
      totalvm: 0,
      pagesize: 10,
      uploadimagevisible: false,
    };
  },
  methods: {
    // 上传失败
    errupload(err, file, fileList) {
      this.$notify.error({
        title: "上传失败",
        message: JSON.parse(err.message).message,
        position: "bottom-right",
        duration: 6000,
      });
    },
    // 成功上传文件
    sucupload(response, file, fileList) {
      if (response === "yes") {
        this.$notify.success({
          title: "上传成功",
          message: "镜像上传成功",
          position: "bottom-right",
          duration: 6000,
        });
        this.$router.push("/vmlist");
      } else {
        this.$notify.error({
          title: "上传失败",
          message: response,
          position: "bottom-right",
          duration: 6000,
        });
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