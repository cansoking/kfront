<template>
  <div>
    <div class="headarea">
      <el-row>
        <el-col :offset="0" :span="10">
          <!-- <el-input
            suffix-icon="el-icon-search"
            v-model="search"
            placeholder="请输入搜索内容..."
          ></el-input> -->
          <span style="font-size: 30px; font-weight: 600; color: #ffffff"
            >基于虚拟化的资源管理演示验证原型系统</span
          >
        </el-col>
        <el-col :offset="10" :span="4">
          <div style="color: #ffffff; font-size: 20px; line-height: 40px">
            {{ nodename }}—{{ nodeip }}
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "SiteHead",
  data() {
    return {
      search: "",
    };
  },
  computed: {
    nodename() {
      return this.$store.nodename;
    },
    nodeip() {
      return this.$store.nodeip;
    },
  },
  created() {},
  methods: {},
  mounted() {
    this.$store.nodename = window.sessionStorage.getItem("nodename");
    this.$store.nodeip = window.sessionStorage.getItem("ip");
  },
};
</script>

<style>
.headarea {
  padding: 15px 15px;
  border-bottom: 1px solid #d8e3e7;
  background-color: #303641;
  height: 40px;
}
</style>