<template>
    <div class="vmarea">
      <!-- 头部标题操作 -->
      <el-row :gutter="0">
        <el-col :span="10" :offset="0"
          ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
            应用列表
          </p></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="
          cidata
            .slice((curpage - 1) * pagesize, curpage * pagesize)
            .filter(
              (data) =>
                !psearch ||
                data.image.toLowerCase().includes(psearch.toLowerCase())
            )
        "
        style="width: 100%"
        empty-text="暂无应用"
        :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
      >
        <el-table-column width="80" type="index" label="序号"> </el-table-column>
        <el-table-column width="300" sortable label="应用名称" prop="image">
        </el-table-column>
        <el-table-column width="300" sortable label="节点端口" prop="tag">
        </el-table-column>
        <el-table-column width="200" sortable label="标签" prop="imageid">
        </el-table-column>
        <el-table-column width="200" sortable label="生成时间" prop="size">
        </el-table-column>
        <el-table-column align="right">
          <template slot="header">
            <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
          </template>
          <template slot-scope="scope">
            <div style="text-align: center">
              <el-button
                plain
                type="info"
                @click="deleteimage(scope.$index, scope.row)"
                >查看</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <div v-if="cidata.length != 0" style="margin-top: 30px">
        <el-pagination
          :current-page.sync="curpage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size.sync="pagesize"
          layout="sizes, total, prev, pager, next, jumper"
          :total="totalci"
          background
        >
        </el-pagination>
      </div>
    </div>
  </template>
      
      <script>
  import { del } from "vue";
  
  export default {
    name: "AppList",
    mounted() {
      this.getVMList();
    },
    data() {
      return {
        baseurl: "http://127.0.0.1:8080",
        cidata: [{}],
        psearch: "",
        curpage: 1,
        totalci: 0,
        pagesize: 10,
        uploadimagevisible: false,
        formData: {
          virtualMachineIp: "192.168.91.129",
          userName: "root",
          userPassword: "Noi3674.",
        },
      };
    },
    methods: {
      // 获取容器镜像列表数据
      getVMList() {
        this.$axios
          .post(this.baseurl + "/containerd/images/list", {
            virtualMachineIp: "192.168.91.129",
            userName: "root",
            userPassword: "Noi3674.",
          })
          .then((res) => {
            let s_data = this.data_resolver(res.data.result);
            this.cidata = s_data;
            this.totalci = s_data.length;
          })
          .catch((err) => {
            console.log("errors", err);
          });
      }
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