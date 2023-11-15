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
      :default-openeds="['vm', 'template']"
      :default-active="$route.path"
      background-color="#303641"
      text-color="#8d97ad"
      router
      active-text-color="#ffffff"
    >
      <el-menu-item index="/podlist" route="podlist">
        <i class="el-icon-coin"></i>
        <span slot="title">容器管理</span>
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
        <el-menu-item index="/vmcreate" route="vmcreate">
          <i class="el-icon-folder-add"></i>
          <span slot="title">创建虚拟机</span>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="template">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>模板管理</span>
        </template>
        <el-menu-item index="/template1" route="template1">
          <i class="el-icon-c-scale-to-original"></i>
          <span slot="title">模板管理1</span>
        </el-menu-item>
        <el-menu-item index="/template2" route="template2">
          <i class="el-icon-folder-add"></i>
          <span slot="title">模板管理2</span>
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
  padding: 20px 80px;
  background-color: #303641;
  color: #fff;
  border-bottom: 1px solid #343e50;
}
</style>