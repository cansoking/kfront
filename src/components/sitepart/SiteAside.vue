<template>
  <div>
    <div class="side-head">
      <a href="/">
        <el-image
          style="width: 100px"
          :src="require('../../images/logo.png')"
          fit="fill"
        ></el-image>
      </a>
    </div>
    <el-menu
      :default-active="$route.path"
      background-color="#303641"
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
      <el-submenu index="pod">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>Pod管理</span>
        </template>
        <el-menu-item index="/podlist" route="podlist">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">Pod列表</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/deploy" route="deploy">
        <i class="el-icon-set-up"></i>
        <span slot="title">部署管理</span>
      </el-menu-item>
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
      <el-menu-item index="vmima" route="vmimalist">
        <i class="el-icon-copy-document"></i>
        <span slot="title">虚拟机镜像管理</span>
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
      <el-submenu index="application">
        <template slot="title">
          <i class="el-icon-copy-document"></i>
          <span>应用管理</span>
        </template>
        <el-menu-item index="/appimage" route="appimage">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">应用镜像</span>
        </el-menu-item>
        <el-menu-item index="/applist" route="applist">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">应用列表</span>
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
  padding: 20px 80px;
  background-color: #303641;
  color: #fff;
  border-bottom: 1px solid #343e50;
}
</style>
