<template>
  <div class="podarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
      ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
        Pod列表
      </p></el-col
      >
      <el-col :span="2" :offset="12">
        <el-button
            @click="openCreatePod"
            icon="el-icon-circle-plus-outline"
            size="medium"
            round
            plain
        >添加容器</el-button
        >
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
        :data="
        poddata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.metadata.name.toLowerCase().includes(psearch.toLowerCase())
          )
      "
        style="width: 100%"
        empty-text="暂无Pod"
        :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Pod名称">
              <span>{{ props.row.metadata.name }}</span>
            </el-form-item>
            <el-form-item label="命名空间">
              <span>{{ props.row.metadata.namespace }}</span>
            </el-form-item>
            <el-form-item label="节点">
              <span>{{ props.row.spec.nodeName }}</span>
            </el-form-item>
            <el-form-item label="状态">
              <span
              ><el-tag
                  v-if="props.row.status.phase === 'Pending'"
                  type="warning"
              >挂起</el-tag
              >
                <el-tag v-else-if="props.row.status.phase === 'Running'"
                >运行</el-tag
                >
                <el-tag v-else type="success">成功</el-tag></span
              >
            </el-form-item>
            <el-form-item label="是否可用">
              <span
              ><el-tag
                  v-if="props.row.metadata.annotations.status === 'Yes'"
                  type="success"
              >可用</el-tag
              >
                <el-tag v-else type="danger">不可用</el-tag></span
              >
            </el-form-item>
            <el-form-item label="创建时间">
              <!--              <span>{{ props.row.metadata.creationTimestamp }}</span>-->
              <div>
                <span>{{ formatDate(props.row.metadata.creationTimestamp, 'YYYY-MM-DD') }}</span><br>
                <span>{{ formatDate(props.row.metadata.creationTimestamp, 'HH:mm:ss') }}</span>
              </div>
            </el-form-item>
            <el-form-item label="容器列表"> </el-form-item>
            <el-table
                size="small"
                :data="props.row.spec.containers"
                style="width: 90%"
            >
              <el-table-column type="index"> </el-table-column>
              <el-table-column prop="name" label="容器名称" width="200">
              </el-table-column>
              <el-table-column prop="image" label="容器镜像" width="400">
              </el-table-column>
              <el-table-column prop="ports" label="端口号">
                <template slot-scope="scope">
                  <el-tag
                      :key="port"
                      v-for="port in scope.row.ports"
                      type="info"
                  >{{
                      port.name + "/" + port.protocol + "/" + port.containerPort
                    }}</el-tag
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column
          width="280"
          sortable
          label="Pod名称"
          prop="metadata.name"
      >
      </el-table-column>
      <el-table-column
          width="350"
          sortable
          label="镜像"
          prop="spec.containers[0].image"
      >
      </el-table-column>
      <el-table-column
          width="150"
          sortable
          label="命名空间"
          prop="metadata.namespace"
      >
      </el-table-column>
      <el-table-column sortable label="节点" prop="spec.nodeName">
      </el-table-column>
      <el-table-column width="100" sortable label="状态" prop="status.phase">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status.phase === 'Pending'" type="warning"
          >挂起</el-tag
          >
          <el-tag v-else-if="scope.row.status.phase === 'Running'">运行</el-tag>
          <el-tag v-else type="success">成功</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          width="100"
          sortable
          label="是否可用"
          prop="metadata.annotations.status"
      >
        <template slot-scope="scope">
          <el-tag
              v-if="scope.row.metadata.annotations.status === 'Yes'"
              type="success"
          >可用</el-tag
          >
          <el-tag v-else type="danger">不可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column sortable label="创建时间" prop="metadata.creationTimestamp">
        <template slot-scope="scope">
          <div>
            <span>{{ formatDate(scope.row.metadata.creationTimestamp, 'YYYY-MM-DD') }}</span><br>
            <span>{{ formatDate(scope.row.metadata.creationTimestamp, 'HH:mm:ss') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="210" align="right">
        <template slot="header">
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <!-- 迁移界面 -->
          <el-popover
              :ref="'popover' + scope.$index"
              placement="left"
              width="300"
              trigger="click"
          >
            <el-form
                label-position="top"
                label-width="80px"
                :model="migrate_form"
                :status-icon="true"
                :rules="migrate_rules"
                :ref="'migrate_form' + scope.$index"
            >
              <el-form-item label="请选择要迁移的节点" prop="nodename">
                <el-select
                    style="width: 100%"
                    v-model="migrate_form.nodename"
                    clearable
                    @visible-change="noderemote"
                    placeholder="请选择要迁移的节点"
                >
                  <el-option
                      v-for="item in nodename_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="large">
                <div style="text-align: right">
                  <el-button
                      size="mini"
                      type="primary"
                      @click="
                      migrate_sumbit(scope.$index, scope.row, 'migrate_form' + scope.$index)
                    "
                  >确定迁移</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-popover>
          <el-button-group>
            <el-button
                v-popover="'popover' + scope.$index"
                plain
                type="info"
                size="mini"
            >迁移</el-button
            >
            <el-button
                @click="startPod(scope.$index, scope.row)"
                v-if="scope.row.metadata.annotations.status === 'No'"
                size="mini"
                type="success"
            >启动</el-button
            >
            <el-button
                @click="stopPod(scope.$index, scope.row)"
                v-else
                size="mini"
                type="warning"
            >停止</el-button
            >
            <el-button
                @click="deletePod(scope.$index, scope.row)"
                plain
                size="mini"
                type="danger"
            >删除</el-button
            >
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="poddata.length != 0" style="margin-top: 30px">
      <el-pagination
          :current-page.sync="curpage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size.sync="pagesize"
          layout="sizes, total, prev, pager, next, jumper"
          :total="totalpod"
          background
      >
      </el-pagination>
    </div>
    <!-- 添加Pod对话框 -->
    <el-dialog title="添加Pod" :visible.sync="createpodvisible">
      <el-form
          label-position="top"
          label-width="80px"
          :model="cp_form"
          :status-icon="true"
          :rules="cp_rules"
          ref="cp_form"
      >
        <el-form-item label="Pod名称" prop="podName">
          <el-input
              v-model="cp_form.podName"
              placeholder="请输入Pod名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="命名空间" prop="namespace">
          <!-- <el-input v-model="cp_form.namespace"></el-input> -->
          <el-select
              style="width: 100%"
              v-model="cp_form.namespace"
              clearable
              @visible-change="nsremote"
              placeholder="请选择命名空间"
          >
            <el-option
                v-for="item in namespace_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择节点" prop="nodename">
          <!-- <el-input v-model="cp_form.containerImage"></el-input> -->
          <el-select
              style="width: 100%"
              v-model="cp_form.nodename"
              clearable
              @visible-change="noderemote"
              placeholder="请选择节点"
          >
            <el-option
                v-for="item in nodename_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择持久卷声明" prop="pvcName">
          <!-- <el-input v-model="cp_form.containerImage"></el-input> -->
          <el-select
              style="width: 100%"
              v-model="cp_form.pvcName"
              clearable
              @visible-change="pvcremote"
              placeholder="请选择pvc"
          >
            <el-option
                v-for="item in pvcName_options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属容器" prop="containerInfoList">
          <el-popover
              style="margin-right: 10px"
              placement="top-start"
              :title="container.containerName"
              width="200"
              trigger="hover"
              :key="container.containerName"
              v-for="container in cp_form.containerInfoList"
          >
            <el-descriptions :column="1" size="mini">
              <el-descriptions-item label="镜像">{{
                  container.containerImage
                }}</el-descriptions-item>
              <el-descriptions-item label="端口号">{{
                  container.port
                }}</el-descriptions-item>
            </el-descriptions>
            <el-tag
                slot="reference"
                closable
                :disable-transitions="false"
                @close="handleClose(container)"
                type="info"
                effect="plain"
            >
              {{ container.containerName }}
            </el-tag>
          </el-popover>
          <el-card class="con-card" v-if="addvisible" shadow="hover">
            <div slot="header" class="clearfix">
              <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                  <span
                  >添加第
                    {{ cp_form.containerInfoList.length + 1 }}
                    个新容器</span
                  >
                </el-col>
                <el-col :span="3" :offset="3">
                  <el-button
                      @click="addcontainer('tmp_con_info')"
                      icon="el-icon-check"
                      size="mini"
                      circle
                      plain
                      type="success"
                  ></el-button>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-button
                      @click="resetForm('tmp_con_info')"
                      icon="el-icon-refresh-right"
                      size="mini"
                      circle
                  ></el-button>
                </el-col>
                <el-col :span="3" :offset="0">
                  <el-button
                      @click="closeadd"
                      icon="el-icon-close"
                      size="mini"
                      circle
                      plain
                      type="danger"
                  ></el-button>
                </el-col>
              </el-row>
            </div>
            <el-form
                label-position="top"
                :model="tmp_con_info"
                :status-icon="true"
                :rules="tmp_con_rules"
                ref="tmp_con_info"
            >
              <el-form-item label="容器名称" prop="containerName">
                <el-input
                    v-model="tmp_con_info.containerName"
                    placeholder="请输入容器名称"
                    clearable
                ></el-input>
              </el-form-item>
              <el-form-item label="容器镜像" prop="containerImage">
                <el-select
                    style="width: 100%"
                    v-model="tmp_con_info.containerImage"
                    clearable
                    @visible-change="imageremote"
                    placeholder="请选择容器镜像"
                >
                  <el-option
                      v-for="item in containerImage_options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="端口号" prop="port">
                <el-input
                    v-model="tmp_con_info.port"
                    placeholder="请输入端口号"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-card>
          <el-button
              class="button-new-tag"
              v-else
              size="small"
              @click="showInputCon"
          >添加容器</el-button
          >
        </el-form-item>
        <el-form-item size="large">
          <div class="cp-sbm-area">
            <el-button round @click="resetForm('cp_form')">清空输入</el-button>
            <el-button round type="primary" @click="cp_sumbit('cp_form')"
            >立即创建</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加Pod-抽屉 -->
    <!-- <el-drawer
      :visible.sync="createpodvisible1"
      direction="ltr"
      ref="drawer"
      custom-class="cp-drawer"
    >
      <div slot="title" class="cp-head">添加容器</div>
      <div class="cp-content">
        <el-form
          label-position="top"
          label-width="80px"
          :model="cp_form"
          :status-icon="true"
          :rules="cp_rules"
          ref="cp_form"
        >
          <el-form-item label="容器名称" prop="podName">
            <el-input v-model="cp_form.podName"></el-input>
          </el-form-item>
          <el-form-item label="命名空间" prop="namespace">
            <el-input v-model="cp_form.namespace"></el-input>
          </el-form-item>
          <el-form-item label="ContainerName" prop="containerName">
            <el-input v-model="cp_form.containerName"></el-input>
          </el-form-item>
          <el-form-item label="ContainerImage" prop="containerImage">
            <el-input v-model="cp_form.containerImage"></el-input>
          </el-form-item>
          <el-form-item size="large">
            <div class="cp-sbm-area">
              <el-button round @click="resetForm('cp_form')"
                >清空输入</el-button
              >
              <el-button round type="primary" @click="cp_sumbit('cp_form')"
                >立即创建</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer> -->
  </div>
</template>

<script>
export default {
  name: "PodList",
  data() {
    // 自定义验证规则
    var checkcmpimage = (rule, value, callback) => {
      console.log(value);
      if (value.length < 1) {
        // 不足，提示不足
        return callback(new Error("请添加至少一个容器"));
      }
      callback();
    };
    return {
      // 动态容器相关
      addvisible: false,
      tmp_con_info: {
        containerName: "",
        containerImage: "",
        port: "80",
      },
      tmp_con_rules: {
        containerName: [
          { required: true, message: "请输入容器名称", trigger: "blur" },
        ],
        containerImage: [
          { required: true, message: "请选择容器镜像", trigger: "change" },
        ],
        port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
      },
      // 命名空间选项
      namespace_options: [],
      // 容器镜像选项
      containerImage_options: [
        {
          value: "",
          label: "",
        },
      ],
      // 节点名称选项
      nodename_options: [],
      // pvc名称选项
      pvcName_options: [],
      baseurl: "http://39.98.124.97:8080",
      poddata: [],
      psearch: "",
      isstart: false,
      curpage: 1,
      totalpod: 0,
      pagesize: 10,
      createpodvisible: false,
      cp_form: {
        podName: "",
        namespace: "",
        nodename: "",
        pvcName: "",
        containerInfoList: [],
      },
      migrate_form: {
        nodename: "",
      },
      // 添加容器校验规则
      cp_rules: {
        podName: [
          { required: true, message: "请输入Pod名称", trigger: "blur" },
        ],
        namespace: [
          { required: true, message: "请选择命名空间", trigger: "change" },
        ],
        nodename: [
          { required: true, message: "请选择节点", trigger: "change" },
        ],
        pvcName: [
          { required: true, message: "请输入Pvc名称", trigger: "change" },
        ],
        containerInfoList: [{ validator: checkcmpimage, trigger: "change" }],
      },
      migrate_rules: {
        nodename: [
          {
            required: true,
            message: "请选择迁移的节点名称",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    this.getPodList();
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
    // 动态添加容器相关
    showInputCon() {
      this.addvisible = true;
    },
    closeadd() {
      this.addvisible = false;
    },
    addcontainer(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.cp_form.containerInfoList.push(
              JSON.parse(JSON.stringify(this.tmp_con_info))
          );
          this.addvisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    handleClose(tag) {
      this.cp_form.containerInfoList.splice(
          this.cp_form.containerInfoList.indexOf(tag),
          1
      );
    },
    // 打开添加容器抽屉
    openCreatePod() {
      this.createpodvisible = true;
    },
    // 获取容器列表数据
    getPodList() {
      this.$axios
          .get(this.baseurl + "/workload/getPodList")
          .then((res) => {
            // console.log(JSON.parse(res.data.result));
            console.log(res.data);
            this.poddata = JSON.parse(res.data.result).items;
            this.totalpod = JSON.parse(res.data.result).items.length;
          })
          .catch((err) => {
            console.log("errors", err);
          });
    },
    // 启动容器
    startPod(idx, row) {
      this.$axios({
        method: "post",
        url: this.baseurl + "/workload/startPod",
        data: {
          podName: row.metadata.name,
          podNamespace: row.metadata.namespace,
          podNodeName: row.spec.nodename,
          containerInfoList: [],
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
          (res) => {
            console.log(res);
            this.$notify.success({
              title: "操作通知",
              message: "容器 " + row.metadata.name + " 启动成功",
              position: "bottom-right",
            });
            row.metadata.annotations.status = "Yes";
          },
          (err) => {
            console.log(err);
            this.$notify.error({
              title: "操作失败",
              message: "请检查网络连接设置",
              position: "bottom-right",
            });
          }
      );
    },
    // 停止容器
    stopPod(idx, row) {
      this.$axios({
        method: "post",
        url: this.baseurl + "/workload/stopPod",
        data: {
          podName: row.metadata.name,
          podNamespace: row.metadata.namespace,
          podNodeName: row.spec.nodename,
          containerInfoList: [],
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
          (res) => {
            console.log(res);
            this.$notify.success({
              title: "操作通知",
              message: "容器 " + row.metadata.name + " 停止成功",
              position: "bottom-right",
            });
            row.metadata.annotations.status = "No";
          },
          (err) => {
            console.log(err);
            this.$notify.error({
              title: "操作失败",
              message: "请检查网络连接设置",
              position: "bottom-right",
            });
          }
      );
    },
    // 添加容器
    cp_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 将data数据分成两个对象
          const podInfo = {
            podName: this.cp_form.podName,
            podNamespace: this.cp_form.namespace,
            podNodeName: this.cp_form.nodename,
            containerInfoList: this.cp_form.containerInfoList,
          };

          const pvcInfo = {
            pvcName: this.cp_form.pvcName
          };
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url: this.baseurl + "/workload/createPod",
            data: {
              // podName: this.cp_form.podName,
              // podNamespace: this.cp_form.namespace,
              // podNodeName: this.cp_form.nodename,
              // containerInfoList: this.cp_form.containerInfoList,
              // pvcName: this.cp_form.pvcName,
              podInfo:podInfo,
              pvcInfo:pvcInfo
            },
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
              (res) => {
                console.log(res);
                if (res.data[0] === "E") {
                  this.$notify.error({
                    title: "创建失败",
                    message: res.data,
                    position: "bottom-right",
                  });
                } else {
                  this.$notify.success({
                    title: "完成通知",
                    message: "容器 " + this.cp_form.podName + " 创建成功",
                    position: "bottom-right",
                  });
                  this.getPodList();
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
    // 删除容器
    deletePod(idx, row) {
      this.$axios({
        method: "post",
        url: this.baseurl + "/workload/deletePod",
        data: {
          podName: row.metadata.name,
          podNamespace: row.metadata.namespace,
          podNodeName: row.spec.nodename,
          containerInfoList: [],
        },
        headers: {
          "Content-Type": "application/json",
        },
      }).then(
          (res) => {
            this.$notify.success({
              title: "操作通知",
              message: "容器 " + row.metadata.name + "删除成功",
              position: "bottom-right",
            });
            this.getPodList();
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
    migrate_sumbit(idx, row, formName) {
      console.log(formName)
      // 校验表单
      this.$refs[formName].validate((valid) => {
        console.log(row.metadata.name)
        console.log(this.migrate_form.nodename)
        if (valid) {
          this.$axios({
            method: "post",
            url: this.baseurl + "/workload/editPod",
            data: {
              podName: row.metadata.name,
              podNamespace: row.metadata.namespace,
              podNodeName: this.migrate_form.nodename,
            },
            headers: {
              "Content-Type": "application/json",
            },
          }).then(
              (res) => {
                if (res.data[0] === "E") {
                  this.$notify.error({
                    title: "迁移失败",
                    message: res.data,
                    position: "bottom-right",
                  });
                } else {
                  this.$notify.success({
                    title: "操作通知",
                    message:
                        "容器 " + row.metadata.name + "迁移成功",
                    position: "bottom-right",
                  });
                }
                this.getPodList();
              },
              (err) => {
                console.log(err);
                this.$notify.error({
                  title: "迁移失败",
                  message: "请检查网络连接设置",
                  position: "bottom-right",
                });
              }
          );
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
    // 远程搜索命名空间
    nsremote() {
      this.$axios
          .get(this.baseurl + "/workload/namespace/list")
          .then((res) => {
            // console.log(res);
            console.log(JSON.parse(res.data.result));
            let rdata = JSON.parse(res.data.result).items;
            let resop = [];
            for (let i = 0; i < rdata.length; i++) {
              let tmp = {};
              tmp["label"] = rdata[i].metadata.name;
              tmp["value"] = rdata[i].metadata.name;
              resop.push(tmp);
            }
            this.namespace_options = resop;
          })
          .catch((err) => {
            console.log("errors", err);
          });
    },
    // 远程搜索节点名
    noderemote() {
      this.$axios
          .get(this.baseurl + "/workload/node/list")
          .then((res) => {
            // console.log(res);
            console.log(JSON.parse(res.data.result));
            let rdata = JSON.parse(res.data.result).items;
            let resop = [];
            for (let i = 0; i < rdata.length; i++) {
              let tmp = {};
              tmp["label"] = rdata[i].metadata.name;
              tmp["value"] = rdata[i].metadata.name;
              resop.push(tmp);
            }
            this.nodename_options = resop;
          })
          .catch((err) => {
            console.log("errors", err);
          });
    },
    // 远程搜索pvc名
    pvcremote() {
      this.$axios
          .get(this.baseurl + "/virtuleStorage/vs/pvclist")
          .then((res) => {
            // console.log(res);
            console.log(JSON.parse(res.data.result));
            let rdata = JSON.parse(res.data.result).items;
            let resop = [];
            for (let i = 0; i < rdata.length; i++) {
              let tmp = {};
              tmp["label"] = rdata[i].metadata.name;
              tmp["value"] = rdata[i].metadata.name;
              resop.push(tmp);
            }
            this.pvcName_options = resop;
          })
          .catch((err) => {
            console.log("errors", err);
          });
    },
    // 远程搜索image名
    imageremote() {
      this.$axios
          .post(this.baseurl + "/containerd/images/list", {
            virtualMachineIp: "39.98.124.97",
            userName: "root",
            userPassword: "Upc123456@",
          })
          .then((res) => {
            let rdata = this.data_resolver(res.data.result);
            // this.cidata = rdata;
            // this.totalci = rdata.length;
            console.log(rdata);
            // let rdata = JSON.parse(res.data.result).items;
            let resop = [];
            for (let i = 0; i < rdata.length; i++) {
              let tmp = {};
              tmp["label"] = rdata[i].imageName+":"+rdata[i].imageTag;
              tmp["value"] = rdata[i].imageName+":"+rdata[i].imageTag;
              resop.push(tmp);
            }
            this.containerImage_options = resop;
          })
          .catch((err) => {
            console.log("errors", err);
          });
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

  },
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
  padding-left: 3%;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}

.con-card {
  width: 40%;
}

.podarea {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-top: 15px;
}

/* 动态容器名称 */
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 110px;
  margin-left: 10px;
  vertical-align: bottom;
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

.cp-head {
  font-size: 50px;
  font-weight: 500;
  color: #fff;
  background-color: #08c0b9;
}

.cp-content {
  padding: 40px;
  background-color: #fff;
  height: 100%;
}

.cp-sbm-area {
  padding-top: 70px;
  text-align: right;
}

.cp-drawer {
  background-color: #08c0b9;
}
</style>