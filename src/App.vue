<template>
  <div>
    <el-container>
      <el-aside style="background-color: #303641" width="270px"
        ><site-aside></site-aside
      ></el-aside>
      <el-container>
        <el-header><site-head-vue></site-head-vue></el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SiteAside from "./components/sitepart/SiteAside.vue";
import SiteHeadVue from "./components/sitepart/SiteHead.vue";
export default {
  components: { SiteAside, SiteHeadVue },
  name: "App",
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

.el-header {
  position: relative;
  width: 87%;
  left: 250px;
  height: 90px;
}

.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
}

.el-main {
  position: absolute;
  left: 270px;
  right: 0;
  top: 72px;
  bottom: 0;
  overflow-y: scroll;
  background-color: rgba(244, 251, 253, 0.884)}

.el-aside::-webkit-scrollbar {
  display: none;
}
</style>