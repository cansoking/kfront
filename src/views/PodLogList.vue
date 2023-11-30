<template>
  <div class="podarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col span="4" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          容器日志列表
        </p></el-col
      >
      <el-col span="4" >
        <el-cascader
          v-model="searchpod"
          :options="casoption"
          :props="props"
          clearable
          placeholder="请选择容器"
        ></el-cascader>
      </el-col>
      <el-col span="4" >
        <el-date-picker
          v-model="starttime"
          type="datetime"
          placeholder="请选择开始时间"
        >
        </el-date-picker>
      </el-col>
      <el-col span="4" >
        <el-date-picker
          v-model="endtime"
          type="datetime"
          placeholder="请选择结束时间"
        >
        </el-date-picker>
      </el-col>
      <el-col span="1" offset="">
        <el-button round plain type="primary" @click="getPodLog"
          >查询</el-button
        >
      </el-col>
      <el-col span="4" :offset="3"
      ><p style="font-size: 20px; color: #08c0b9;font-weight: 600;margin-top: 5px; margin-bottom: 40px">
        日志保存时间:{{savedays}}天
      </p></el-col
      >
    </el-row>
    <el-table
      :data="podlogdata.slice((curpage - 1) * pagesize, curpage * pagesize)"
      style="width: 100%"
      empty-text="暂无容器日志"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column label="序号" type="index"> </el-table-column>
      <el-table-column sortable label="容器名" prop="podName">
      </el-table-column>
      <el-table-column sortable label="命令空间" prop="spaces">
      </el-table-column>
      <el-table-column sortable label="日志内容" prop="displayContent">
      </el-table-column>
      <el-table-column sortable label="生成时间" prop="AddTime">
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="lookLog(scope.$index, scope.row)"
            >查看详细日志</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="podlogdata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totalpodlog"
        background
      ></el-pagination>
    </div>
    <el-dialog title="详细日志" :visible.sync="logvisible">
      <el-card shadow="never">
        {{ logcontent }}
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "PodLogList",
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      curpage: 1,
      totalpodlog: 0,
      savedays:"",
      pagesize: 10,
      podlogdata: [],
      starttime: "",
      endtime: "",
      searchpod: "",
      logvisible: false,
      logcontent: "",
      options: [],
      casoption: [],
      props: {
        value: "value",
        label: "label", //展示的lable名字
        children: "children", //展示子级
      },
    };
  },
  mounted() {
    this.getPodLog();
    this.getCas();
    this.getSaveDays();
  },
  methods: {
    getCas() {
      this.$axios
        .get(this.baseurl + "/log/getCas")
        .then((res) => {
          console.log("res.cas:"+res.data.content);
          this.casoption = this.transformData(res.data.content);
        })
        .catch((err) => {});
    },
    getSaveDays() {
      this.$axios
          .get(this.baseurl + "/log/getSaveDays")
          .then((res) => {
            this.savedays = res.data.content
          })
          .catch((err) => {});
    },
    lookLog(index, row) {
      this.logvisible = true;
      this.logcontent = row.podContent;
    },
    transformData(data) {
      for (var i = 0; i < data.length; i++) {
        if (data[i].children === null) {
          // children若为空数组，则将children设为undefined
          data[i].children = undefined;
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.transformData(data[i].children);
        }
      }
      return data;
    },
    getPodLog() {
      this.starttime = moment(this.starttime).format("YYYY-MM-DD HH:mm:ss");
      this.endtime = moment(this.endtime).format("YYYY-MM-DD HH:mm:ss");
      if(this.starttime === "Invalid date")
        this.starttime = "";
      if(this.endtime === "Invalid date")
        this.endtime = "";
      let podn = "";
      if (this.searchpod.length == 2)
        podn = this.searchpod[0] + "/" + this.searchpod[1];
      this.$axios
        .get(this.baseurl + "/log/getPodLog", {
          params: {
            podNamespace: podn,
            starttime: this.starttime,
            endtime: this.endtime,
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.podlogdata = res.data.content;
            this.totalpodlog = res.data.content.length;
          } else {
            alert(res.data.msg);
          }
        })
        .catch((err) => {
          // alert(err);
          console.log("err::::" + err);
        });
    },
    handleDelete(index, row) {
      this.$confirm(`您确定删除吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$axios
            .delete(this.baseurl + "/log/deletePodLog/" + row.id)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                this.$message.success("删除成功！");
                this.getPodLog();
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
  },
};
</script>

<style>
.podarea {
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
/*不带背景的分页按钮背景色end*/
</style>