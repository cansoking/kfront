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
        <el-col :offset="8" :span="6">
          <div style="color: #ffffff; font-size: 20px; line-height: 40px">
            当前节点：
            <el-select
              v-model="value"
              placeholder="请选择"
              :loading="isloading"
              loading-text="正在拉取数据"
              @visible-change="noderemote"
              @change="nodechange"
            >
              <el-option
                v-for="item in nodeoption"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
                <span style="float: left">{{ item.label }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.value
                }}</span>
              </el-option>
            </el-select>
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
      baseurl: "http://39.98.124.97:8080",
      search: "",
      isloading: false,
      nodeoption: [],
      value: [],
      nodeinfo: [],
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
  methods: {
    nodechange(item) {
      this.$store.nodename = item;
      for (let i = 0; i < this.nodeinfo.length; i++) {
        if (this.nodeinfo[i].nodeName === item) {
          this.$store.nodeip = this.nodeinfo[i].nodeIp;
          i = this.nodeinfo.length;
        }
      }
    },
    noderemote() {
      this.nodeoption = [];
      this.isloading = true;
      this.$axios
        .get(this.baseurl + "/node/getNodeList1")
        .then((res) => {
          let nodeinfo = res.data.content;
          for (let i = 0; i < nodeinfo.length; i++) {
            this.nodeoption.push({
              label:
                nodeinfo[i].nodeType +
                "节点" +
                nodeinfo[i].nodeName[nodeinfo[i].nodeName.length - 1],
              value: nodeinfo[i].nodeName,
            });
          }
          this.nodeinfo = nodeinfo;
        })
        .catch((err) => {
          console.log("errors", err);
        });
      this.isloading = false;
    },
  },
  mounted() {
    this.noderemote();
    this.$store.nodename = window.sessionStorage.getItem("nodename");
    this.$store.nodeip = window.sessionStorage.getItem("ip");
    this.value = this.$store.nodename;
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