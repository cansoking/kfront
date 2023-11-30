<template>
  <div class="podarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col span="3" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          操作日志列表
        </p></el-col
      >
      <el-col span="3" >
        <el-select
          v-model="searchmodule"
          placeholder="请选择操作模块"
          style="margin-bottom: 5px"
          clearable
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col span="3" offset="">
        <el-select
          v-model="searchstate"
          placeholder="请求状态"
          style="margin-bottom: 5px"
          clearable
        >
          <el-option
            v-for="item in stateoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col span="4" offset="">
        <el-date-picker
          v-model="starttime"
          type="datetime"
          placeholder="请选择开始时间"
        >
        </el-date-picker>
      </el-col>
      <el-col span="3" offset="">
        <el-date-picker
          v-model="endtime"
          type="datetime"
          placeholder="请选择结束时间"
        >
        </el-date-picker>
      </el-col>
      <el-col span="2" offset="1">
        <el-button round plain type="primary" @click="getLogList"
          >查询</el-button
        >
      </el-col>
      <el-col span="3.5"><p style="font-size:20px; color: #08c0b9;font-weight: 600;margin-top: 5px; margin-bottom: 40px">
        日志保存时间:{{savedays}}天
      </p></el-col
      >
    </el-row>
    <!-- 表格区域 -->
    <el-table
      :data="logdata.slice((curpage - 1) * pagesize, curpage * pagesize)"
      style="width: 100%"
      empty-text="暂无操作日志"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <!--      <el-table-column  sortable label="ID" prop="id">-->
      <!--      </el-table-column>-->
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column sortable label="操作模块" prop="operationModule">
      </el-table-column>
      <el-table-column sortable label="操作事件" prop="operationEvents">
      </el-table-column>
      <el-table-column sortable label="请求URL" prop="operationUrl">
      </el-table-column>
      <el-table-column sortable label="请求数据" prop="operationData">
      </el-table-column>
      <el-table-column sortable label="异常输出" prop="operationResult">
      </el-table-column>
      <el-table-column sortable label="操作时间" prop="AddTime">
      </el-table-column>
      <el-table-column sortable label="请求状态" prop="OperationStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.operationStatus === false" type="warning"
            >失败</el-tag
          >
          <el-tag v-else-if="scope.row.operationStatus === true" type="success"
            >成功</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <div v-if="logdata.length != 0" style="margin-top: 30px">
      <el-pagination
        :current-page.sync="curpage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size.sync="pagesize"
        layout="sizes, total, prev, pager, next, jumper"
        :total="totallog"
        background
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "LogList",
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      logdata: [],
      pageNum: 1, //当前页
      curpage: 1,
      totallog: 0,
      savedays:'',
      pagesize: 10,
      starttime: "",
      endtime: "",
      searchmodule: "",
      searchstate: "",
      options: [
        {
          value: "容器管理",
          label: "容器管理",
        },
        {
          value: "虚拟机管理",
          label: "虚拟机管理",
        },
        {
          value: "日志管理",
          label: "日志管理",
        },
        {
          value: "镜像管理",
          label: "镜像管理",
        },
        {
          value: "存储管理",
          label: "存储管理",
        },
        {
          value: "指标管理",
          label: "指标管理",
        },
        {
          value: "物理机管理",
          label: "物理机管理",
        },
      ],
      stateoptions: [
        {
          value: 1,
          label: "成功",
        },
        {
          value: 0,
          label: "失败",
        },
      ],
    };
  },
  mounted() {
    this.getLogList();
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
    getLogList() {
      this.starttime = moment(this.starttime).format("YYYY-MM-DD HH:mm:ss");
      this.endtime = moment(this.endtime).format("YYYY-MM-DD HH:mm:ss");
      if(this.starttime === "Invalid date")
        this.starttime = "";
      if(this.endtime === "Invalid date")
        this.endtime = "";
      console.log(this.starttime);
      this.$axios
        .get(this.baseurl + "/log/getLogList", {
          params: {
            operationModule: this.searchmodule,
            operationStatus: this.searchstate,
            starttime: this.starttime,
            endtime: this.endtime,
          },
        })
        .then((res) => {
          this.logdata = res.data.content;
          console.log(res.data.content);
          this.totallog = res.data.content.length;
        })
        .catch((err) => {
          console.log("errors", err);
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
            .delete(this.baseurl + "/log/deleteLog/" + row.id)
            .then((response) => {
              const data = response.data;
              if (data.success) {
                this.$message.success("删除成功！");
                this.getLogList();
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