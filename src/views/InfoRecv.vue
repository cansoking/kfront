<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          收到的破译后列表
        </p></el-col
      >
      <el-col :span="3" :offset="11">
        <el-input
          v-model="psearch"
          placeholder="输入破译后情报搜索"
        />
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="
        infodata
          .slice((curpage - 1) * pagesize, curpage * pagesize)
          .filter(
            (data) =>
              !psearch ||
              data.plaintext.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无情报信息"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column width="100" type="index" label="序号"> </el-table-column>
      <el-table-column width="600" sortable label="情报原文" prop="ciphertext">
      </el-table-column>
      <el-table-column width="600" sortable label="破译的情报" prop="plaintext">
        <template slot-scope="scope">
          <span v-if="scope.row.plaintext == null">未破译</span>
          <span v-else>{{ scope.row.plaintext }}</span>
        </template>
      </el-table-column>
      <el-table-column sortable label="收到时间" prop="createTime">
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="infodata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalinfo"
        background
      >
      </el-pagination>
    </div>
  </div>
</template>
      
      <script >
export default {
  name: "InfoRecv",
  created() {
    // setInterval不会清除定时器队列，每重复执行1次都会导致定时器叠加 \
    window.setInterval(() => {
      // setTimeout是自带清除定时器
      setTimeout(this.getInfos, 600);
    }, 5000);
  },
  mounted() {
    this.getInfos();
  },
  data() {
    return {
      baseurl: "http://172.26.82.161:9003",
      infodata: [],
      psearch: "",
      curpage: 1,
      totalinfo: 0,
      pagesize: 10,
    };
  },
  methods: {
    // 获取数据
    getInfos() {
      this.$axios
        .get(this.baseurl + "/websocket/query")
        .then((res) => {
          console.log(res);
          this.infodata = res.data;
          this.totalinfo = res.data.length;
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