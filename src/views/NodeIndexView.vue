<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          Node指标列表
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
      empty-text="暂无Node指标"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >

    <el-table-column
      label="序号"
      type="index"
    >
    </el-table-column>
    <el-table-column
      width="250"
      sortable
      label="Node名"
      prop="metadata.name"
    >
    </el-table-column>
      <el-table-column
          width="250"
          sortable
          label="创建时间"
          prop="metadata.creationTimestamp"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ formatDate(scope.row.metadata.creationTimestamp, 'YYYY-MM-DD') }}</span><br>
            <span>{{ formatDate(scope.row.metadata.creationTimestamp, 'HH:mm:ss') }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
          width="250"
          sortable
          label="时间窗口"
          prop="window"
      >
      </el-table-column>

      <el-table-column
          width="250"
          sortable
          label="指标采集时间"
          prop="timestamp"
      >
        <template slot-scope="scope">
          <div>
            <span>{{ formatDate(scope.row.timestamp, 'YYYY-MM-DD') }}</span><br>
            <span>{{ formatDate(scope.row.timestamp, 'HH:mm:ss') }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          width="250"
          sortable
          label="CPU"
          prop="usage.cpu"
      >
      </el-table-column>
      <el-table-column
          width="250"
          sortable
          label="内存"
          prop="usage.memory"
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
    this.getNodeIndexList();
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      pidata: [],
      psearch: "",
      curpage: 1,
      totalpi: 0,
      pagesize: 10,
      createVirstoreVisible: false,
      editform: {
        vol: "",
      },

    };
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

    // 获取Node指标列表数据
    getNodeIndexList() {
      this.$axios
        .post(this.baseurl + "/index/nodeIndex/list", {
          virtualMachineIp: "39.98.124.97",
          userName: "root",
          userPassword: "Upc123456@",
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