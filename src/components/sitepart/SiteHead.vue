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
          <span style="font-size: 30px; font-weight: 600; color: #ffffff;">基于虚拟化的资源管理演示验证原型系统</span>
        </el-col>
        <!-- <el-col :offset="18" :span="1">
          <i style="font-size: 40px; color: #303641" class="el-icon-info"></i>
        </el-col> -->
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
  created() {
  },
  methods: {
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