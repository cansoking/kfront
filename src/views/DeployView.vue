<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          部署列表
        </p></el-col
      >
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
          <div style="text-align: center;">
            <el-button plain type="danger">删除</el-button>
          </div>
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
  
  <script>
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
    };
  },
  methods: {
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