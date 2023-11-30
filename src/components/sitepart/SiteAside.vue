<template>
  <div>
    <div class="side-head">
      <a href="/">
        <el-image
          style="width: 200px"
          :src="require('../../images/xw.png')"
          fit="fill"
        ></el-image>
      </a>
    </div>
    <el-menu
      :default-active="$route.path"
      background-color="#393e46"
      text-color="#8d97ad"
      router
      active-text-color="#ffffff"
    >
      <el-submenu index="machine">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>物理机管理</span>
        </template>
        <el-menu-item index="/machineinfo" route="machineinfo">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">物理机信息</span>
        </el-menu-item>
        <el-menu-item index="/webssh" route="webssh">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">远程ssh</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="vm">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>虚拟机管理</span>
        </template>
        <el-menu-item index="/vmlist" route="vmlist">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">虚拟机列表</span>
        </el-menu-item>
        <el-menu-item index="vmtemp" route="vmtemlist">
          <i class="el-icon-copy-document"></i>
          <span slot="title">虚拟机模版管理</span>
        </el-menu-item>

      </el-submenu>

      <el-submenu index="vm1">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>计算节点虚拟机1</span>
        </template>
        <el-menu-item index="/vmlist1" route="vmlist1">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">计算节点虚拟机1列表</span>
        </el-menu-item>
        <!-- <el-menu-item index="/vmimalist2" route="vmimalist2">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">计算节点虚拟机1镜像</span>
        </el-menu-item> -->
      </el-submenu>

      <el-submenu index="vm2">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>计算节点虚拟机2</span>
        </template>
        <el-menu-item index="/vmlist2" route="vmlist2">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">计算节点虚拟机2列表</span>
        </el-menu-item>
        <!-- <el-menu-item index="/vmimalist2" route="vmimalist2">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">计算节点虚拟机2镜像</span>
        </el-menu-item> -->
      </el-submenu>

      <el-submenu index="pod">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>容器管理</span>
        </template>
        <el-menu-item index="/podlist" route="podlist">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">容器列表</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="image">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>镜像管理</span>
        </template>
        <el-menu-item index="/imagelist" route="imagelist">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">容器镜像</span>
        </el-menu-item>
        <el-menu-item index="/vmimalist" route="vmimalist">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">虚拟机镜像</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="virstorage">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>虚拟存储</span>
        </template>
        <el-menu-item index="/pervolume" route="pervolume">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">持久卷</span>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">日志管理</span>
        </template>
        <el-menu-item index="1-3" route="podlog">容器日志</el-menu-item>
        <el-menu-item index="1-4-1" route="vmlog">虚拟机日志</el-menu-item>
        <el-menu-item index="1-3-1" route="loglist">操作日志</el-menu-item>
      </el-submenu>

      <el-submenu index="indexm">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>指标管理</span>
        </template>
        <el-menu-item index="/podindex" route="podindex">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">容器指标</span>
        </el-menu-item>
        <el-menu-item index="/nodeindex" route="nodeindex">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">Node指标</span>
        </el-menu-item>
        <el-menu-item index="/minfo" route="minfo">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">物理机指标</span>
        </el-menu-item>
        <el-menu-item index="/vminfo" route="vminfo">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">虚拟机指标</span>
        </el-menu-item>
      </el-submenu>

      <!-- <el-submenu index="infor">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>情报管理</span>
        </template>
        <el-menu-item index="/infointer" route="infointer">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">情报截取</span>
        </el-menu-item>
        <el-menu-item index="/infodec" route="infodec">
          <i class="el-icon-copy-document"></i>
          <span slot="title">情报破译</span>
        </el-menu-item>
        <el-menu-item index="/inforecv" route="inforecv">
          <i class="el-icon-copy-document"></i>
          <span slot="title">情报接收</span>
        </el-menu-item>
      </el-submenu> -->

      <el-submenu index="application">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>场景演示</span>
        </template>
        <!-- <el-menu-item index="/appimage" route="appimage">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">应用镜像</span>
        </el-menu-item> -->
        <el-menu-item index="/deploy" route="deploy">
          <i class="el-icon-set-up"></i>
          <span slot="title">部署管理</span>
        </el-menu-item>
        <el-menu-item index="/applist" route="applist">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">应用列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
  
  <script>
export default {
  name: "SiteAside",

  data() {
    return {};
  },

  created() {},

  methods: {},
};
</script>
  
<style>
.side-head {
  padding: 0px 0px;
  background-color: #393e46;
  color: #fff;
  border-bottom: 1px solid #343e50;
}
</style>
