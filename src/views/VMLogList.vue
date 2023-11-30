<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col span="4" :offset="0"
      ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
        虚拟机日志列表
      </p></el-col
      >
      <el-col span="4" offset="">
        <el-select v-model="searchvm" placeholder="请选择虚拟机">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
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
      <el-col span="1">
        <el-button round plain type="primary" @click="getVMLog">查询</el-button>
      </el-col>
      <el-col span="4" :offset="3"
      ><p style="font-size: 20px; color: #08c0b9;font-weight: 600;margin-top: 5px; margin-bottom: 40px">
        日志保存时间:{{savedays}}天
      </p></el-col
      >
    </el-row>
    <el-table
        :data="vmlogdata.slice((curpage - 1) * pagesize, curpage * pagesize)"
        style="width: 100%"
        empty-text="暂无日志"
        :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <!--      <el-table-column  sortable label="ID" prop="id">-->
      <!--      </el-table-column>-->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column sortable label="虚拟机名" prop="vmName">
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
    <div v-if="vmlogdata.length != 0" style="margin-top: 30px">
      <el-pagination
          :current-page.sync="curpage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size.sync="pagesize"
          layout="sizes, total, prev, pager, next, jumper"
          :total="totalvmlog"
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
  name: "VMLogList",
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      curpage: 1,
      totalvmlog: 0,
      pagesize: 10,
      vmlogdata: [],
      savedays:"",
      starttime: "",
      endtime: "",
      searchvm: "",
      logvisible: false,
      logcontent: "",
      options: [],
      props: {
        value: "value",
        label: "label", //展示的lable名字
        children: "children", //展示子级
      },
    };
  },
  mounted() {
    this.getVMLog();
    this.getVMName();
    this.getSaveDays();
  },
  methods: {
    getSaveDays() {
      this.$axios
          .get(this.baseurl + "/log/getSaveDays")
          .then((res) => {
            this.savedays = res.data.content
          })
          .catch((err) => {});
    },
    getVMName() {
      this.$axios
          .get(this.baseurl + "/log/getVMName")
          .then((res) => {
            console.log(res.data.content);
            this.options = res.data.content;
          })
          .catch((err) => {});
    },
    lookLog(index, row) {
      this.logvisible = true;
      this.logcontent = row.vmContent;
    },
    getVMLog() {
      this.starttime = moment(this.starttime).format("YYYY-MM-DD HH:mm:ss");
      this.endtime = moment(this.endtime).format("YYYY-MM-DD HH:mm:ss");
      if(this.starttime === "Invalid date")
        this.starttime = "";
      if(this.endtime === "Invalid date")
        this.endtime = "";
      this.$axios
          .get(this.baseurl + "/log/getVMLog", {
            params: {
              VMName: this.searchvm,
              starttime: this.starttime,
              endtime: this.endtime,
            },
          })
          .then((res) => {
            console.log(res.data);
            if (res.data.success) {
              this.vmlogdata = res.data.content;
              this.totalvmlog = res.data.content.length;
            } else {
              alert(res.data.msg);
            }
          })
          .catch((err) => {
            alert(err);
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
                .delete(this.baseurl + "/log/deleteVMLog/" + row.id)
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
/*不带背景的分页按钮背景色end*/
</style>