<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          持久卷列表
        </p></el-col
      >
      <el-col :span="2" :offset="12">
        <el-button
          @click="openCreateVirStore"
          icon="el-icon-circle-plus-outline"
          size="medium"
          round
          plain
          >创建持久卷</el-button
        >
      </el-col>
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
      empty-text="暂无持久卷"
      :header-cell-style="{ background: '#00b8a9', color: '#fff' }"
    >
      <el-table-column width="80" sortable label="持久卷名" prop="id">
      </el-table-column>
      <el-table-column width="200" sortable label="容量" prop="name">
      </el-table-column>
      <el-table-column width="100" sortable label="访问模式" prop="state">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 'VIR_DOMAIN_PAUSED'" type="warning"
            >挂起</el-tag
          >
          <el-tag v-else-if="scope.row.state === 'VIR_DOMAIN_RUNNING'"
            >运行</el-tag
          >
          <el-tag v-else type="danger">关机</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="200" sortable label="回收策略" prop="imageid">
      </el-table-column>
      <el-table-column width="200" sortable label="状态" prop="imagevolume">
      </el-table-column>
      <el-table-column width="200" sortable label="声明" prop="imagevolume">
      </el-table-column>
      <el-table-column width="200" sortable label="主机路径" prop="imagevolume">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header">
          <el-input
            style="width: 30%"
            v-model="psearch"
            size="mini"
            placeholder="输入名称搜索"
          />
        </template>
        <template slot-scope="scope">
          <!-- 修改界面 -->
          <el-popover
            ref="popover"
            placement="right"
            width="300"
            trigger="click"
          >
            <el-form
              label-position="top"
              label-width="80px"
              :model="migrate_form"
              :status-icon="true"
              :rules="migrate_rules"
              ref="migrate_form"
            >
              <el-form-item label="容量大小" prop="nodename">
                <el-input
                  v-model="tmpvo"
                  placeholder="请输入要修改的容量大小"
                  size="normal"
                  clearable
                >
                  <template slot="append">GiB</template>
                </el-input>
              </el-form-item>
              <el-form-item size="large">
                <div style="text-align: right">
                  <el-button
                    type="primary"
                    @click="migrate_sumbit('migrate_form')"
                    >确定修改</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </el-popover>
          <el-button-group>
            <el-button v-popover:popover plain type="info">修改</el-button>
            <el-button plain type="danger">删除</el-button>
          </el-button-group>
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
    <!-- 上传创建持久卷对话框 -->
    <el-dialog title="创建持久卷" :visible.sync="createVirstoreVisible">
      <el-form
        label-position="top"
        label-width="80px"
        :model="vs_form"
        :status-icon="true"
        :rules="vs_rules"
        ref="vs_form"
      >
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷名称" prop="podName">
              <el-input
                v-model="vs_form.podName"
                placeholder="请输入持久卷名称"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷声明名称" prop="podName">
              <el-input
                v-model="vs_form.podName"
                placeholder="请输入持久卷声明名称"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷主机地址" prop="podName">
              <el-input
                v-model="vs_form.podName"
                placeholder="请输入持久卷主机地址"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷声明命名空间" prop="podName">
              <el-input
                v-model="vs_form.podName"
                placeholder="请输入持久卷声明命名空间"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷容量" prop="podName">
              <el-input
                v-model="vs_form.podName"
                placeholder="请输入持久卷容量"
              ></el-input> </el-form-item
          ></el-col>
          <el-col :span="12" :offset="0"
            ><el-form-item label="持久卷声明容量" prop="podName">
              <el-input
                v-model="vs_form.podName"
                placeholder="请输入持久卷声明容量"
              ></el-input> </el-form-item
          ></el-col>
        </el-row>
        <el-form-item label="主节点名称" prop="podName">
          <el-input
            v-model="vs_form.podName"
            placeholder="请输入持久卷主节点名称"
          ></el-input>
        </el-form-item>
        <el-form-item size="large">
          <div style="text-align: right; padding-top: 30px;">
            <el-button round @click="resetForm('cp_form')">清空输入</el-button>
            <el-button round type="primary" @click="cp_sumbit('cp_form')"
              >立即创建</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
    
    <script>
export default {
  name: "ImageList",
  mounted() {
    this.getVMList();
  },
  data() {
    return {
      baseurl: "http://127.0.0.1:8080",
      vmdata: [],
      psearch: "",
      curpage: 1,
      totalvm: 0,
      pagesize: 10,
      createVirstoreVisible: false,
      vs_form: {},
    };
  },
  methods: {
    // 获取虚拟机列表数据
    getVMList() {
      this.$axios
        .get(this.baseurl + "/getVMList")
        .then((res) => {
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