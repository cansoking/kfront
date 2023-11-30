<template>
  <div class="vmarea">
    <el-col :span="10" :offset="0"
      ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
        模版列表
      </p></el-col
    >
    <el-col :span="2" :offset="12">
      <el-button
        @click="openCreateVMtem"
        icon="el-icon-circle-plus-outline"
        size="medium"
        round
        plain
        >新增模版
      </el-button>
    </el-col>

    <el-table
      :data="vmtemdata.slice((curpage - 1) * pagesize, curpage * pagesize)"
      style="width: 100%"
      empty-text="暂无日志"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column width="100" type="index" label="序号"> </el-table-column>
      <!--      <el-table-column  sortable label="ID" prop="id">-->
      <!--      </el-table-column>-->
      <el-table-column sortable label="模版名称" prop="name"> </el-table-column>
      <el-table-column sortable label="内存大小(G)" prop="memory">
      </el-table-column>
      <el-table-column sortable label="处理器个数" prop="cpuNum">
      </el-table-column>
      <el-table-column sortable label="操作系统类型" prop="OStype">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
          <el-button size="mini" type="warning" @click="edit(scope.row)"
            >修改</el-button
          >
          <el-tooltip content="以该模版创建虚拟机" placement="top">
            <el-button size="mini" type="success" @click="build(scope.row)"
              >创建</el-button
            >
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="vmtemdata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalvmtem"
        background
      ></el-pagination>
    </div>
    <el-dialog title="添加模版" :visible.sync="createvmtemvisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="vmtem_form"
        :status-icon="true"
        :rules="vmtem_rules"
        ref="vmtem_form"
      >
        <el-form-item label="模版名称" prop="name">
          <el-input
            v-model="vmtem_form.name"
            placeholder="请输入模版名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="内存大小" prop="memory">
          <el-input
            v-model="vmtem_form.memory"
            placeholder="请输入内存大小(单位G)"
            clearables
            @blur="validMemory('vmtem_form')"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理器个数" prop="cpuNum">
          <el-select
            style="width: 100%"
            v-model="vmtem_form.cpuNum"
            clearable
            placeholder="请选择处理器个数"
          >
            <el-option
              v-for="item in cpuNum_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统类型" prop="OStype">
          <el-select
            style="width: 100%"
            v-model="vmtem_form.OStype"
            clearable
            placeholder="请选择操作系统类型"
          >
            <el-option
              v-for="item in OStype_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="cp-sbm-area" style="margin-left: 450px; margin-top: 20px">
          <el-button round @click="resetForm('vmtem_form')">重置</el-button>
          <el-button round type="primary" @click="vmtem_sumbit('vmtem_form')"
            >确认
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="修改模版" :visible.sync="editvmtemvisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="editvmtem_form"
        :status-icon="true"
        :rules="vmtem_rules"
        ref="editvmtem_form"
      >
        <el-form-item label="模版名称" prop="name">
          <el-input
            v-model="editvmtem_form.name"
            placeholder="请输入模版名称"
            @blur="validName('editvmtem_form')"
          ></el-input>
        </el-form-item>
        <el-form-item label="内存大小" prop="memory">
          <el-input
            v-model="editvmtem_form.memory"
            placeholder="请输入内存大小(单位G)"
            clearables
            @blur="validMemory('editvmtem_form')"
          ></el-input>
        </el-form-item>
        <el-form-item label="处理器个数" prop="cpuNum">
          <el-select
            style="width: 100%"
            v-model="editvmtem_form.cpuNum"
            clearable
            placeholder="请选择处理器个数"
          >
            <el-option
              v-for="item in cpuNum_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统类型" prop="OStype">
          <el-select
            style="width: 100%"
            v-model="editvmtem_form.OStype"
            clearable
            placeholder="请选择操作系统类型"
          >
            <el-option
              v-for="item in OStype_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <div class="cp-sbm-area" style="margin-left: 450px; margin-top: 20px">
          <el-button round @click="resetForm('editvmtem_form')">重置</el-button>
          <el-button
            round
            type="primary"
            @click="editvmtem_sumbit('editvmtem_form')"
            >确认
          </el-button>
        </div>
      </el-form>
    </el-dialog>

    <el-dialog title="创建虚拟机" :visible.sync="buildvmtemvisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="buildvmtem_form"
        :status-icon="true"
        ref="buildvmtem_form"
      >
        <el-form-item label="请输入虚拟机名称" prop="vmname">
          <el-input
            v-model="buildvmtem_form.vmname"
            placeholder="请输入虚拟机名称"
            @blur="validName('buildvmtem_form')"
          ></el-input>
        </el-form-item>

        <el-form-item label="模版名称" prop="name">
          <el-input
            v-model="buildvmtem_form.name"
            placeholder="请输入模版名称"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="内存大小" prop="memory">
          <el-input
            v-model="buildvmtem_form.memory"
            placeholder="请输入内存大小(单位G)"
            clearables
            @blur="validMemory('editvmtem_form')"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="处理器个数" prop="cpuNum">
          <el-select
            style="width: 100%"
            v-model="buildvmtem_form.cpuNum"
            clearable
            placeholder="请选择处理器个数"
            disabled
          >
            <el-option
              v-for="item in cpuNum_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统类型" prop="OStype">
          <el-select
            style="width: 100%"
            v-model="buildvmtem_form.OStype"
            clearable
            placeholder="请选择操作系统类型"
            disabled
          >
            <el-option
              v-for="item in OStype_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              disabled
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="虚拟机映像文件" prop="vm_iso">
          <el-upload
            class="upload-demo"
            drag
            ref="upload"
            :action="baseurl + '/Template/addVirtual'"
            :multiple="false"
            :data="buildvmtem_form"
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
            <div class="el-upload__tip" slot="tip">
              *只能上传.iso/ .qemu2/ .img文件
            </div>
          </el-upload>
        </el-form-item>

        <div class="cp-sbm-area" style="margin-left: 450px; margin-top: 20px">
          <el-button
            round
            type="primary"
            @click="buildvmtem_sumbit('buildvmtem_form')"
            >立即创建
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "VMLogList",
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      curpage: 1,
      totalvmtem: 0,
      pagesize: 10,
      createvmtemvisible: false,
      editvmtemvisible: false,
      buildvmtemvisible: false,
      vmtemdata: [],
      cpuNum_options: [
        {
          value: "2",
          label: "2",
        },
        {
          value: "4",
          label: "4",
        },
        {
          value: "6",
          label: "6",
        },
        {
          value: "8",
          label: "8",
        },
        {
          value: "10",
          label: "10",
        },
        {
          value: "12",
          label: "12",
        },
      ],
      OStype_options: [
        {
          value: "X86",
          label: "X86",
        },
        {
          value: "ARM",
          label: "ARM",
        },
      ],
      vmtem_form: {
        name: "",
        memory: "",
        cpuNum: "",
        OStype: "",
      },
      editvmtem_form: {
        id: "",
        name: "",
        memory: "",
        cpuNum: "",
        OStype: "",
      },
      buildvmtem_form: {
        vmname: "",
        name: "",
        memory: "",
        cpuNum: "",
        OStype: "",
      },
      // 添加容器校验规则
      vmtem_rules: {
        vmname: [
          { required: true, message: "请输入虚拟机名称", trigger: "blur" },
        ],
        OStype: [
          { required: true, message: "请选择操作系统类型", trigger: "change" },
        ],
        cpuNum: [
          { required: true, message: "请选择处理器个数", trigger: "change" },
        ],
        memory: [
          { required: true, message: "请输入内存大小", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getVMTem();
  },
  methods: {
    getVMTem() {
      this.$axios
        .get(this.baseurl + "/Template/selectAll")
        .then((res) => {
          if (res.data.success) {
            this.vmtemdata = res.data.content;
            this.totalvmtem = res.data.content.length;
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          alert(err);
          console.log("err::::" + err);
        });
    },
    validName(formname) {
      if (
        formname === "buildvmtem_form" &&
        this.buildvmtem_form.name.includes(".")
      ) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: "虚拟机名字不能包括特殊字符",
        });
      }
    },
    buildvmtem_sumbit(formName) {
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
    validMemory(formname) {
      const regex = /^[1-9]\d*(\.\d+)?$/;
      if (formname === "vmtem_form" && !regex.test(this.vmtem_form.memory)) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: "请输入正数",
        });
      }
      if (
        formname === "editvmtem_form" &&
        !regex.test(this.editvmtem_form.memory)
      ) {
        // 输入值不是正数，可以进行相应的处理，例如清空输入框、显示错误提示等。
        this.$notify.error({
          message: "请输入正数",
        });
      }
    },
    vmtem_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/Template/insert", //换成实际地址
            data: this.vmtem_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              if (res.data.success === false) {
                //增加失败
                this.$notify.error({
                  title: "创建失败",
                  message: res.data.msg,
                  position: "bottom-right",
                });
              } else {
                this.$notify.success({
                  title: "完成通知",
                  message: "模版" + this.vmtem_form.name + " 创建成功",
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
          this.createvmtemvisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    editvmtem_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/Template/update", //换成实际地址
            data: this.editvmtem_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              if (res.data.success === false) {
                //增加失败
                this.$notify.error({
                  title: "修改失败",
                  message: res.data.msg,
                  position: "bottom-right",
                });
              } else {
                this.$notify.success({
                  title: "修改通知",
                  message: "模版" + this.editvmtem_form.name + " 修改成功",
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
          this.editvmtemvisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    openCreateVMtem() {
      this.createvmtemvisible = true;
    },

    handleDelete(index, row) {
      this.$confirm(`您确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.baseurl + "/Template/delete/" + row.id)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                this.$message.success("删除成功！");
                this.getVMTem();
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
    edit(row) {
      this.editvmtem_form.id = row.id;
      this.editvmtem_form.name = row.name;
      this.editvmtem_form.memory = row.memory;
      this.editvmtem_form.cpuNum = row.cpuNum;
      this.editvmtem_form.OStype = row.OStype;
      this.editvmtemvisible = true;
    },
    build(row) {
      this.buildvmtem_form.name = row.name;
      this.buildvmtem_form.memory = row.memory;
      this.buildvmtem_form.cpuNum = row.cpuNum;
      this.buildvmtem_form.OStype = row.OStype;
      this.buildvmtemvisible = true;
    },
    create(index, row) {
      this.$confirm(`您确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.baseurl + "/workload/deleteVMLog/" + row.id)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                this.$message.success("删除成功！");
                this.getVMLog();
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleBeforeUpload(file) {
      console.log(file);
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
          title: "创建成功",
          message: "虚拟机 " + this.buildvmtem_form.name + " 创建成功！",
          position: "bottom-right",
          duration: 6000,
        });
        this.$router.push("/vmlist");
      } else {
        this.$notify.error({
          title: "创建失败",
          message: response,
          position: "bottom-right",
          duration: 6000,
        });
      }
    },
    errupload(err, file, fileList) {
      this.$notify.error({
        title: "创建失败",
        message: JSON.parse(err.message).message,
        position: "bottom-right",
        duration: 6000,
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
.v_html {
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
