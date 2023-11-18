<template>
  <div class="podarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">

      <el-col>
        <el-cascader
            v-model="searchpod"
            :options="casoption"
        :props="props" clearable placeholder="请选择容器"></el-cascader>
        <el-date-picker
            v-model="starttime"
            type="datetime" placeholder="请选择开始时间">
        </el-date-picker>
        <el-date-picker
            v-model="endtime"
            type="datetime" placeholder="请选择结束时间">
        </el-date-picker>
        <el-button type="primary" @click="getPodLog">查询</el-button>
      </el-col>
    </el-row>
    <el-col>
      <el-table
          :data="podlogdata.slice((curpage - 1) * pagesize, curpage * pagesize)"
          style="width: 100%"
          empty-text="暂无容器日志"
          :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
      >
        <!--      <el-table-column  sortable label="ID" prop="id">-->
        <!--      </el-table-column>-->
        <el-table-column  sortable label="容器名" width="300" prop="podName">
        </el-table-column>
        <el-table-column sortable label="命令空间" width="150"  prop="spaces">
        </el-table-column>
        <el-table-column sortable label="日志内容" prop="podContent">
        </el-table-column>
        <el-table-column sortable label="生成时间" prop="AddTime" width="200">
        </el-table-column>
        <el-table-column
            fixed="right"
            label="操作" width="150">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
    <!-- 分页栏 -->
    <el-col>
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
    </el-col>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  name: "PodLogList",
  data() {
    return {
      baseurl: "http://localhost:8080",
      curpage: 1,
      totalpodlog: 0,
      pagesize: 10,
      podlogdata:[],
      starttime: '',
      endtime:"",
      searchpod:'',
      options: [],
      casoption:[],
      props: {
        value: "value",
        label: "label",      //展示的lable名字
        children:"children"    //展示子级
      },
    };
  },
  mounted() {
    this.getPodLog();
    this.getCas()
  },
  methods: {
    getCas() {
      this.$axios
          .get(this.baseurl+"/log/getCas")
          .then((res) => {
            console.log(res.data.content)
            this.casoption = this.transformData(res.data.content);
          })
          .catch((err) => {
          });
    },
    transformData(data) {
        for(var i=0;i<data.length;i++){
          if(data[i].children === null){
            // children若为空数组，则将children设为undefined
            data[i].children=undefined;
          }else {
            // children若不为空数组，则继续 递归调用 本方法
            this.transformData(data[i].children);
          }
        }
        return data;
      },
    getPodLog() {
      this.starttime = moment(this.starttime).format('YYYY-MM-DD HH:mm:ss')
      this.endtime = moment(this.endtime).format('YYYY-MM-DD HH:mm:ss')
      let podn = "";
      if(this.searchpod.length==2)
         podn = this.searchpod[0]+"/"+this.searchpod[1];
      this.$axios
          .get(this.baseurl+"/log/getPodLog", {
            params: {
              podNamespace: podn,
              starttime: this.starttime,
              endtime: this.endtime
            }
          })
          .then((res) => {
            console.log(res);
            if(res.data.success) {
              this.podlogdata = res.data.content
              this.totalpodlog = res.data.content.length
            }else{
              alert(res.data.msg);
            }
          })
          .catch((err) => {
            alert(err);
            console.log("err::::"+err)
          });
    },
    handleDelete(index, row) {
      this.$confirm(`您确定删除吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios
            .delete(this.baseurl+"/log/deletePodLog/" + row.id).then((response) => {
          const data = response.data;
          if (data.success) {
            this.$message.success("删除成功！");
            this.getPodLog();
          } else {
            this.$message.success("删除失败！");
          }
        })
      }).catch(() => {
        // 取消操作
        this.$message({
          type: 'info',
          message: '已取消'
        })
      });
    },
  }
}
</script>

<style>
.podarea {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-top: 15px;
}
.v_html{
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