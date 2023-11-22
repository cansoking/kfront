<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          Pod指标列表
        </p></el-col
      >

    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="
        pidata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.metadata.name.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无Pod指标"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">


          <el-form-item label="容器列表"> </el-form-item>
          <el-table
              size="small"
              :data="props.row.containers"
              style="width: 90%"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="name" label="容器名称" width="200"></el-table-column>
            <el-table-column prop="usage.cpu" label="cpu" width="400"></el-table-column>
            <el-table-column prop="usage.memory" label="memory"></el-table-column>
          </el-table>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="序号"
      type="index"
    >
    </el-table-column>
    <el-table-column
      width="200"
      sortable
      label="Pod名"
      prop="metadata.name"
    >
    </el-table-column>
    <el-table-column
        width="200"
        sortable
        label="命名空间"
        prop="metadata.namespace"
    >
    </el-table-column>
      <el-table-column
          width="200"
          sortable
          label="创建时间"
          prop="metadata.creationTimestamp"
      >
      </el-table-column>

      <el-table-column
          width="200"
          sortable
          label="时间窗口"
          prop="window"
      >
      </el-table-column>

      <el-table-column
          width="200"
          sortable
          label="指标采集时间"
          prop="timestamp"
      >
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>

      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="pidata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalpi"
        background
      >
      </el-pagination>
    </div>

  </div>
</template>
    
    <script>
export default {
  name: "IndexList",
  mounted() {
    this.getPodIndexList();
  },
  data() {
    return {
      baseurl: "http://127.0.0.1:8080",
      pidata: [],
      psearch: "",
      curpage: 1,
      totalpi: 0,
      pagesize: 10,
      createVirstoreVisible: false,
      editform: {
        vol: "",
      },
      vs_form: {
        vmInfo: {
          virtualMachineIp: "192.168.91.129",
          userName: "root",
          userPassword: "Noi3674.",
        },
        pvInfo: {
          pvName: "example-pv1",
          pvPath: "/mnt/disks/vol2",
          pvQuantity: "10Gi",
          pvAccessMode: "ReadWriteOnce",
        },
        pvcInfo: {
          pvcName: "example-pv7-claim",
          pvcNamespace: "default",
          pvcQuantity: "1Gi",
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


    // 获取Pod指标列表数据
    getPodIndexList() {
      this.$axios
        .post(this.baseurl + "/index/podIndex/list", {
          virtualMachineIp: "192.168.174.133",
          userName: "root",
          userPassword: "@wsad1234",
      })
        .then((res) => {
          this.pidata = JSON.parse(res.data.result).items;
          this.totalpi = JSON.parse(res.data.result).items.length;
          console.log(JSON.parse(res.data.result));
        })
        .catch((err) => {
          console.log("errors", err);
        });
    },
    // 打开创建界面
    openCreateVirStore() {
      this.createVirstoreVisible = true;
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