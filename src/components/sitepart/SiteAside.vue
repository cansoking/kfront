<template>
  <div>
    <div class="side-head">
      <div style="font-size: 35px; text-align: center; line-height: 80px">
        云网融合
      </div>
      <!-- <a href="/static/pages/index.html#/world">
        <el-image
          style="width: 200px; margin-left: 30px;"
          :src="require('../../images/xw.png')"
          fit="fill"
        ></el-image>
      </a> -->
    </div>
    <el-menu
      :default-active="$route.path"
      background-color="#393e46"
      text-color="#8d97ad"
      router
      active-text-color="#ffffff"
    >
      <!-- 分布式资源管理 -->
      <el-submenu index="fenbu">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>分布式资源管理</span>
        </template>

        <el-menu-item index="/respool" route="respool">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">资源汇聚</span>
        </el-menu-item>

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
          <el-menu-item index="/vmtemlist" route="vmtemlist">
            <i class="el-icon-copy-document"></i>
            <span slot="title">虚拟机模版管理</span>
          </el-menu-item>
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
          <el-menu-item index="/dockerimage" route="dockerimage">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">Docker镜像</span>
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
          <el-menu-item index="/podlog" route="podlog">容器日志</el-menu-item>
          <el-menu-item index="/vmlog" route="vmlog">虚拟机日志</el-menu-item>
          <el-menu-item index="/loglist" route="loglist">操作日志</el-menu-item>
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
          <!-- <el-menu-item index="/minfo" route="minfo">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">物理机指标</span>
          </el-menu-item> -->
          <el-menu-item index="/vminfo" route="vminfo">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">虚拟机指标</span>
          </el-menu-item>
        </el-submenu>

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
      </el-submenu>
      <!-- 异构卫星网络 -->
      <el-submenu index="yigou">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>异构卫星网络</span>
        </template>
        <!-- <el-menu-item index="/worldMap" route="worldMap">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">世界地图</span>
        </el-menu-item> -->
        <el-menu-item index="/worldMap" route="worldMap">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">接入点分布</span>
        </el-menu-item>
        <el-menu-item index="/cpeList" route="cpeList">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">接入点列表</span>
        </el-menu-item>
        <el-menu-item index="/messionList" route="messionList">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">数传任务列表</span>
        </el-menu-item> 
      </el-submenu>

      <!-- <el-menu-item index="">
        <i class="el-icon-copy-document"></i>
        <a
          style="text-decoration: none; color: #8d97ad"
          slot="title"
          href="/"
          target="_self"
          >异构卫星网络</a
        >
      </el-menu-item> -->
      <!-- 云网融合资源编排调度 -->
      <el-submenu index="scheduler">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span>云网融合资源编排调度</span>
        </template>
        <el-submenu index="task">
          <template slot="title">
            <i class="el-icon-copy-document"></i>
            <span>任务管理</span>
          </template>
          <el-menu-item index="/taskTypeManage" route="taskTypeManage">
            <i class="el-icon-set-up"></i>
            <span slot="title">任务类型</span>
          </el-menu-item>
          <el-menu-item index="/taskManage" route="taskManage">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">任务</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="resource">
          <template slot="title">
            <i class="el-icon-copy-document"></i>
            <span>资源管理</span>
          </template>
          <el-menu-item index="/resourceTypeManage" route="resourceTypeManage">
            <i class="el-icon-set-up"></i>
            <span slot="title">资源类型</span>
          </el-menu-item>
          <el-menu-item index="/resourceManage" route="resourceManage">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">资源</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="algorithm">
          <template slot="title">
            <i class="el-icon-copy-document"></i>
            <span>算法管理</span>
          </template>
          <el-menu-item index="/algorithmFile" route="algorithmFile">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">算法文件管理</span>
          </el-menu-item>
          <el-menu-item index="/algorithmScheduler" route="algorithmScheduler">
            <i class="el-icon-set-up"></i>
            <span slot="title">调度运行</span>
          </el-menu-item>
        </el-submenu>
        <el-submenu index="log">
          <template slot="title">
            <i class="el-icon-copy-document"></i>
            <span>日志管理</span>
          </template>
          <el-menu-item index="/taskLog" route="taskLog">
            <i class="el-icon-c-scale-to-original"></i>
            <span slot="title">任务日志</span>
          </el-menu-item>
        </el-submenu>
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
.el-menu {
  border-right: solid 0px #e6e6e6;
}
</style>
