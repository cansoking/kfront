<template>
  <div class="vmarea">

    <el-col :span="10" :offset="0"
    ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
      虚拟机镜像列表
    </p></el-col
    >
    <el-col :span="2" :offset="12">
      <el-button
          @click="openCreateVMima"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
      >添加镜像
      </el-button
      >
    </el-col>

<el-col>
      <el-table
          :data="vmimadata.slice((curpage - 1) * pagesize, curpage * pagesize)"
          style="width: 100%"
          empty-text="暂无镜像"
          :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
      >

        <el-table-column  sortable label="镜像名称" prop="name">
        </el-table-column>
        <el-table-column sortable label="镜像大小(MiB)" prop="size" >
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button
                size="mini"
                type="success"
                @click="download(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- 分页栏 -->
    <el-col>
      <div v-if="vmimadata.length != 0" style="margin-top: 30px">
        <el-pagination
            :current-page.sync="curpage"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size.sync="pagesize"
            layout="sizes, total, prev, pager, next, jumper"
            :total="totalvmima"
            background
        ></el-pagination>
      </div>
    </el-col
    >

    <el-dialog title="添加镜像"
               :visible.sync="createvmimavisible">
      <el-form
          label-position="top"
          label-width="80px"
          :model="vmima_form"
          :status-icon="true"
          ref="vmima_form"
      >
        <el-form-item label="虚拟机映像文件" prop="vm_iso">
          <el-upload
              class="upload-demo"
              drag
              ref="upload"
              :action="baseurl + '/Images/addImg'"
              :multiple="false"
              :data="vmima_form"
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
            <div class="el-upload__tip" slot="tip">*只能上传.iso文件</div>
          </el-upload>
        </el-form-item>
          <div class="cp-sbm-area" style="margin-left:450px;margin-top: 20px">
            <el-button round type="primary" @click="addvmima_sumbit('vmima_form')"
            >确认
            </el-button>
          </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: "VMImaList",
  data() {
    return {
      baseurl: "http://localhost:8080",
      curpage: 1,
      totalvmima: 0,
      pagesize: 10,
      createvmimavisible: false,
      editvmimavisible:false,
      buildvmimavisible: false,
      vmimadata:[
        {
          name:'texlive2022.iso',
          size:2048
        },{
        name: 'Tiny.iso',
          size:20
        }
      ],
      vmima_form:[
      ]
    };
  },
  mounted() {
    // this.getVMIma();
  },
  methods: {
    getVMIma(){
      this.$axios
          .get(this.baseurl+"/Images/imgList")
          .then((res) => {
            if(res.data.success) {
              this.vmimadata = res.data.content
              this.totalvmima = res.data.content.length
            }else{
              alert(res.data.msg);
            }
          })
          .catch((err) => {
            alert(err);
            console.log("err::::"+err)
          });
   },
    openCreateVMima(){
      this.createvmimavisible = true;
    },

    handleDelete(index, row) {
      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
            .delete(this.baseurl+"/Images/deleteImg/" + row.name).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("删除成功！");
            this.getVMIma();
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

    handleBeforeUpload(file) {
      var iso = file.name.substring(file.name.lastIndexOf(".") + 1);
      const suffix = iso === "iso";
      if (!suffix) {
        this.$message.error("只能上传ISO文件！");
        return false;
      }
      return suffix;
    },
    sucupload(response, file, fileList) {
      if (response === "ok") {
        this.$notify.success({
          title: "添加成功",
          message: "镜像添加成功！",
          position: "bottom-right",
          duration: 6000,
        });
      } else {
        this.$notify.error({
          title: "添加失败",
          message: response,
          position: "bottom-right",
          duration: 6000,
        });
      }
    },
      errupload(err, file, fileList) {
      this.$notify.error({
        title: "添加失败",
        message: "镜像添加失败",
        position: "bottom-right",
        duration: 6000,
      });
    },
    addvmima_sumbit(formName) {
      // 校验表单
        if (this.$refs.upload.uploadFiles.length === 0) {
          this.$message.error("请上传一个文件！");
          return false;
        } else {
          this.$refs.upload.submit();
      }
    },
    download(row) {
      window.open("http://localhost:8080/img/"+row.name,'_self');  //  修改IP  前端修改
      // console.log(row.name)
      // fetch(fileUrl)
      //     .then(response => response.blob())
      //     .then(blob => {
      //       // 创建一个 <a> 标签
      //       const link = document.createElement('a');
      //       link.href = URL.createObjectURL(blob);
      //       link.download = fileName;
      //       link.click();
      //       // 释放 URL 对象
      //       URL.revokeObjectURL(link.href);
      //     })
      //     .catch(error => {
      //       console.error('下载文件时出错：', error);
      //     });
    },
/*
    validMemory(formname) {
      const regex = /^[1-9]\d*(\.\d+)?$/;
      if (formname === 'vmima_form' && !regex.test(this.vmima_form.memory)) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: '请输入正数',
        });
      }
      if (formname === 'editvmima_form' && !regex.test(this.editvmima_form.memory)) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: '请输入正数',
        });
      }
    },
    vmima_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: "http://192.168.243.143:8080/Template/insert",  //换成实际地址
            data: this.vmima_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
              (res) => {
                if (res.data.success === false) {  //增加失败
                  this.$notify.error({
                    title: "创建失败",
                    message: res.data.msg,
                    position: "bottom-right",
                  });
                } else {
                  this.$notify.success({
                    title: "完成通知",
                    message: "模版" + this.vmima_form.name + " 创建成功",
                    position: "bottom-right",
                  });
                  this.getVMTem();
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
          this.createvmimavisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    editvmima_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: "http://192.168.243.143:8080/Template/update",  //换成实际地址
            data: this.editvmima_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
              (res) => {
                if (res.data.success === false) {  //增加失败
                  this.$notify.error({
                    title: "修改失败",
                    message: res.data.msg,
                    position: "bottom-right",
                  });
                } else {
                  this.$notify.success({
                    title: "修改通知",
                    message: "模版" + this.editvmima_form.name + " 修改成功",
                    position: "bottom-right",
                  });
                   this.getVMTem();
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
          this.editvmimavisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },

    edit(row) {
      this.editvmima_form.id = row.id;
      this.editvmima_form.name = row.name;
      this.editvmima_form.memory = row.memory;
      this.editvmima_form.cpuNum = row.cpuNum;
      this.editvmima_form.OStype = row.OStype;
      this.editvmimavisible = true;
    },

    create(index, row) {
      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
            .delete("http://192.168.243.143:8080/workload/deleteVMLog/" + row.id).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("删除成功！");
            this.getVMLog();
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    */
  }
}
</script>

<style>
.vmarea {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-top: 15px;
}
.v_html{
  font-size: 20px;
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
.cp-sbm-area {
  padding-top: 70px;
  text-align: right;
}

/*不带背景的分页按钮背景色end*/
</style>
