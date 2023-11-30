<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          虚拟机指标列表
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
      empty-text="暂无虚拟机指标，请检查是否有虚拟机正在运行"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
    <el-table-column type="expand">
      <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">


          <el-form-item label="虚拟机指标"> </el-form-item>
          <el-table
              size="small"
              :data="vmdata"
              style="width: 90%"
          >
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="name" label="虚拟机名称" width="200"></el-table-column>
            <el-table-column prop="cpuNum" label="cpu个数" ></el-table-column>
            <el-table-column prop="usecpu" label="cpu占用率(%)" ></el-table-column>
            <el-table-column prop="maxMem" label="最大内存(GiB)"></el-table-column>
            <el-table-column prop="usemem" label="内存占用率(%)"></el-table-column>
          </el-table>
        </el-form>
      </template>
    </el-table-column>
    <el-table-column
      label="序号"
      type="index"
    >
    </el-table-column>
    <el-table-column
      width="200"
      sortable
      label="虚拟机名称"
      prop="name"
    >
    </el-table-column>
    <el-table-column width="200" sortable label="状态" prop="state">
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
          <el-input v-model="psearch" size="mini" placeholder="输入名称搜索" />
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
  name: "IndexList",
  mounted() {
    this.getPodIndexList();
  },
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      vmdata: [],
      psearch: "",
      curpage: 1,
      totalvm: 0,
      pagesize: 10,
      createVirstoreVisible: false,
      editform: {
        vol: "",
      },
      edit_rules: {
        vol: {
          required: true,
          message: "请输入要修改的容量大小",
          trigger: "blur",
        },
      },
      
    };
  },
  methods: {


    // 获取虚拟机指标列表数据
    getPodIndexList() {
      this.$axios
        .get(this.baseurl + "/getVMIndexList")
        .then((res) => {
        console.log(res);
          this.vmdata = res.data;
          this.totalvm = res.data.length;
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