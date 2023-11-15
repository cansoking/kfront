<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          虚拟机列表
        </p></el-col
      >
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
      empty-text="暂无虚拟机"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column
        width="80"
        sortable
        label="ID"
        prop="id"
      >
      </el-table-column>
      <el-table-column
        width="200"
        sortable
        label="名称"
        prop="name"
      >
      </el-table-column>
      <el-table-column width="100" sortable label="状态" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 'VIR_DOMAIN_PAUSED'" type="warning"
            >挂起</el-tag
          >
          <el-tag v-else-if="scope.row.state === 'VIR_DOMAIN_RUNNING'">运行</el-tag>
          <el-tag v-else type="danger">关机</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input style="width: 30%;" v-model="psearch" size="mini" placeholder="输入名称搜索" />
        </template>
        <template slot-scope="scope">
          <el-button-group>
            <el-button plain type="success">启动</el-button>
            <el-button plain type="warning">挂起</el-button>
            <el-button plain type="primary">重启</el-button>
            <el-button plain type="info">还原</el-button>
            <el-button plain type="info">保存</el-button>
            <el-button plain type="info">恢复</el-button>
            <el-button plain type="info">关闭</el-button>
            <el-button plain type="danger">强制关闭</el-button>
            <el-button plain type="danger">删除</el-button>
          </el-button-group>
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
  </div>
</template>

<script>
export default {
  name: "VMList",
  mounted() {
    this.getVMList()
  },
  data() {
    return {
      baseurl: "http://192.168.91.129:8080",
      vmdata: [],
      psearch: "",
      curpage: 1,
      totalvm: 0,
      pagesize: 10
    };
  },
  methods: {
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