<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          持久卷列表
        </p></el-col
      >
      <el-col :span="2" :offset="12">
        <el-button
          @click="openCreateVirStore"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >创建持久卷</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="
        vsdata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.metadata.name.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无持久卷"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
    <el-table-column
        label="序号"
        type="index"
      >
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="持久卷名"
        prop="metadata.name"
      >
      </el-table-column>
      <el-table-column
        width="100"
        sortable
        label="容量"
        prop="spec.capacity.storage"
      >
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="访问模式"
        prop="spec.accessModes"
      >
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="回收策略"
        prop="spec.persistentVolumeReclaimPolicy"
      >
      </el-table-column>
      <el-table-column width="200" sortable label="状态" prop="status.phase">
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="声明"
        prop="spec.claimRef.name"
      >
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="主机路径"
        prop="spec.hostPath.path"
      >
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <!-- 修改界面 -->
          <el-popover
            :ref="'popover' + scope.$index"
            placement="right"
            width="300"
            trigger="click"
          >
            <el-form
              label-position="top"
              label-width="80px"
              :model="editform"
              :status-icon="true"
              :rules="edit_rules"
              ref="editform"
            >
              <el-form-item label="容量大小" prop="vol">
                <el-input
                  v-model="editform.vol"
                  placeholder="请输入要修改的容量大小"
                  size="normal"
                  clearable
                >
                  <template slot="append">GiB</template>
                </el-input>
              </el-form-item>
              <el-form-item size="large">
                <div style="text-align: right">
                  <el-button
                    type="primary"
                    @click="edit_submit(scope.$index, scope.row, 'editform')"
                    >确定修改</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-popover>
          <div style="text-align: center">
            <el-button-group>
              <el-button v-popover="'popover' + scope.$index" plain type="info">修改</el-button>
              <el-button
                plain
                type="danger"
                @click="deletePerV(scope.$index, scope.row)"
                >删除</el-button
              >
            </el-button-group>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="vsdata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalvs"
        background
      >
      </el-pagination>
    </div>
    <!-- 上传创建持久卷对话框 -->
    <el-dialog title="创建持久卷" :visible.sync="createVirstoreVisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="vs_form"
        :status-icon="true"
        :rules="vs_rules"
        ref="vs_form"
      >
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷名称" prop="pvInfo.pvName">
              <el-input
                v-model="vs_form.pvInfo.pvName"
                placeholder="请输入持久卷名称"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷声明名称" prop="pvcInfo.pvcName">
              <el-input
                v-model="vs_form.pvcInfo.pvcName"
                placeholder="请输入持久卷声明名称"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷主机地址" prop="pvInfo.pvPath">
              <el-input
                v-model="vs_form.pvInfo.pvPath"
                placeholder="请输入持久卷主机地址"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0"
            ><el-form-item
              label="持久卷声明命名空间"
              prop="pvcInfo.pvcNamespace"
            >
              <el-input
                v-model="vs_form.pvcInfo.pvcNamespace"
                placeholder="请输入持久卷声明命名空间"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷容量" prop="pvInfo.pvQuantity">
              <el-input
                v-model="vs_form.pvInfo.pvQuantity"
                placeholder="请输入持久卷容量"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷声明容量" prop="pvcInfo.pvcQuantity">
              <el-input
                v-model="vs_form.pvcInfo.pvcQuantity"
                placeholder="请输入持久卷声明容量"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="持久卷访问模式" prop="pvInfo.pvAccessMode">
          <el-input
            v-model="vs_form.pvInfo.pvAccessMode"
            placeholder="请输入持久卷访问模式"
          ></el-input>
        </el-form-item>
        <el-form-item size="large">
          <div style="text-align: right; padding-top: 30px">
            <el-button round @click="resetForm('vs_form')">清空输入</el-button>
            <el-button round type="primary" @click="vs_sumbit('vs_form')"
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
  name: "ImageList",
  mounted() {
    this.getPerVList();
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      vsdata: [],
      psearch: "",
      curpage: 1,
      totalvs: 0,
      pagesize: 10,
      createVirstoreVisible: false,
      editform: {
        vol: "",
      },
      vs_form: {
        vmInfo: {
          virtualMachineIp: "39.98.124.97",
          userName: "root",
          userPassword: "Upc123456@",
        },
        pvInfo: {
          pvName: "example-pv1",
          pvPath: "/opt/disks/vol2",
          pvQuantity: "10Gi",
          pvAccessMode: "ReadWriteOnce",
        },
        pvcInfo: {
          pvcName: "example-pv1-claim",
          pvcNamespace: "default",
          pvcQuantity: "8Gi",
        },
      },
      edit_rules: {
        vol: {
          required: true,
          message: "请输入要修改的容量大小",
          trigger: "blur",
        },
      },
      vs_rules: {
        pvInfo: {
          pvName: {
            required: true,
            message: "请输入持久卷名称",
            trigger: "blur",
          },
          pvPath: {
            required: true,
            message: "请输入持久卷主机地址",
            trigger: "blur",
          },
          pvQuantity: {
            required: true,
            message: "请输入持久卷容量",
            trigger: "blur",
          },
          pvAccessMode: {
            required: true,
            message: "请输入持久卷访问模式",
            trigger: "blur",
          },
        },
        pvcInfo: {
          pvcName: {
            required: true,
            message: "请输入持久卷声明名称",
            trigger: "blur",
          },
          pvcNamespace: {
            required: true,
            message: "请输入持久卷声明命名空间",
            trigger: "blur",
          },
          pvcQuantity: {
            required: true,
            message: "请输入持久卷声明容量",
            trigger: "blur",
          },
        },
      },
    };
  },
  methods: {
    // 修改持久卷容量
    edit_submit(idx, row, formName) {
      console.log(formName);
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/virtuleStorage/updateVs",
            data: {
              pvName: this.vsdata[idx].metadata.name,
              pvPath: this.vsdata[idx].spec.hostPath.path,
              pvQuantity: this.editform.vol + "Gi",
              pvAccessMode: this.vsdata[idx].spec.accessModes[0],
            },
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              console.log(res);
              if (res.data[0] === "F") {
                this.$notify.error({
                  title: "修改失败",
                  message: res.data,
                  position: "bottom-right",
                });
              } else {
                this.$notify.success({
                  title: "操作通知",
                  message:
                    "持久卷 " +
                    this.vsdata[idx].metadata.name +
                    " 修改容量成功",
                  position: "bottom-right",
                });
                this.editform.vol = "";
              }
              this.getPerVList()
            },
            (err) => {
              console.log(err);
              this.$notify.error({
                title: "修改失败",
                message: "请检查网络连接设置",
                position: "bottom-right",
              });
              this.getPerVList()
            }
          );
          this.createVirstoreVisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 创建持久卷
    vs_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/virtuleStorage/createVs",
            data: this.vs_form,
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
            (res) => {
              console.log(res);
              if (res.data[0] === "F") {
                this.$notify.error({
                  title: "创建失败",
                  message: res.data,
                  position: "bottom-right",
                });
              } else {
                this.$notify.success({
                  title: "完成通知",
                  message: "持久卷 " + this.vs_form.pvInfo.pvName + " 创建成功",
                  position: "bottom-right",
                });
              }
              this.getPerVList()
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
          this.createVirstoreVisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 获取虚拟机列表数据
    getPerVList() {
      this.$axios
        .get(this.baseurl + "/virtuleStorage/vs/list")
        .then((res) => {
          console.log(JSON.parse(res.data.result).items);
          this.vsdata = JSON.parse(res.data.result).items;
          this.totalvs = JSON.parse(res.data.result).items.length;
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 打开创建界面
    openCreateVirStore() {
      this.createVirstoreVisible = true;
    },
    // 删除持久卷
    deletePerV(idx, row) {
      this.$axios({
        method: "post",
        url: this.baseurl + "/virtuleStorage/deleteVs",
        data: {
          pvName: this.vsdata[idx].metadata.name,
          pvPath: this.vsdata[idx].spec.hostPath.path,
          pvQuantity: this.vsdata[idx].spec.capacity.storage,
          pvAccessMode: this.vsdata[idx].spec.accessModes[0],
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
        (res) => {
          if (res.data[0] === "F") {
            this.$notify.error({
              title: "删除失败",
              message: res.data,
              position: "bottom-right",
            });
          } else {
            this.$notify.success({
              title: "操作通知",
              message: "持久卷 " + this.vs_form.pvInfo.pvName + " 删除成功",
              position: "bottom-right",
            });
          }
          this.getPerVList()
        },
        (err) => {
          console.log(err);
          this.$notify.error({
            title: "删除失败",
            message: "请检查网络连接设置",
            position: "bottom-right",
          });
          this.getPerVList()
        }
      );
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
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