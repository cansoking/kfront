<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          情报破译
        </p></el-col
      >
      <el-col :span="4" :offset="10">
        <el-button
          @click="sendselectedinfo"
          size="medium"
          round
          plain
          type="info"
          >发送选择的破译结果到接收端</el-button
        >
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
              data.ciphertext.toLowerCase().includes(psearch.toLowerCase())
          )
      "
      style="width: 100%"
      empty-text="暂无情报信息"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column
        width="400"
        sortable
        label="获取的情报"
        prop="ciphertext"
      >
      </el-table-column>
      <el-table-column width="400" sortable label="破译的情报" prop="plaintext">
        <template slot-scope="scope">
          <span v-if="scope.row.plaintext == null">未破译</span>
          <span v-else>{{ scope.row.plaintext }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" sortable label="状态" prop="decode">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.decode === '1'" type="success">已破译</el-tag>
          <el-tag v-else type="danger">未破译</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200" sortable label="创建时间" prop="createTime">
      </el-table-column>
      <el-table-column width="200" sortable label="更新时间" prop="updateTime">
        <template slot-scope="scope">
          <span v-if="scope.row.updateTime == null">无</span>
          <span v-else>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input
            v-model="psearch"
            size="mini"
            placeholder="输入获取的情报搜索"
          />
        </template>
        <template slot-scope="scope">
          <div style="text-align: center">
            <el-button plain type="primary" @click="senddec(scope.row.id)"
              >破译</el-button
            >
          </div>
        </template>
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
  name: "InfoDec",
  created() {
    // setInterval不会清除定时器队列，每重复执行1次都会导致定时器叠加 \
    window.setInterval(() => {
      // setTimeout是自带清除定时器
      setTimeout(this.getInfos, 600);
    }, 10000);
  },
  mounted() {
    this.getInfos();
  },
  data() {
    return {
      baseurl: "http://127.0.0.1:9002",
      infodata: [],
      psearch: "",
      curpage: 1,
      totalinfo: 0,
      pagesize: 10,
      multipleSelection: [],
    };
  },
  methods: {
    // 发送被选
    sendselectedinfo() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          message: "未选择情报",
          type: "warning",
        });
      } else {
        // 构建数据
        let sdata = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          sdata.push(this.multipleSelection[i].id);
        }
        this.$axios({
          method: "post",
          url: this.baseurl + "/websocket/send?list=" + sdata,
          
        }).then(
          (res) => {
            this.$notify.success({
              title: "成功通知",
              message: "发送到接收端成功",
              position: "bottom-right",
            });
            this.getInfos();
          },
          (err) => {
            console.log(err);
            this.$notify.error({
              title: "发送失败",
              message: "请检查网络连接设置",
              position: "bottom-right",
            });
          }
        );
      }
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 发送单个破译
    senddec(id) {
      this.$axios({
        method: "put",
        url: this.baseurl + "/websocket/decode?id=" + id,
      }).then(
        (res) => {
          this.$notify.success({
            title: "完成通知",
            message: "破译成功",
            position: "bottom-right",
          });
          this.getInfos();
        },
        (err) => {
          console.log(err);
          this.$notify.error({
            title: "破译失败",
            message: "请检查网络连接设置",
            position: "bottom-right",
          });
        }
      );
    },
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
    handleSelectionChange(val) {
      this.multipleSelection = val;
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