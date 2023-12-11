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
        <el-col :offset="7" :span="6">
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
        <el-col :span="1" :offset="0">
          <el-tooltip
            class="item"
            effect="dark"
            content="回到主页"
            placement="bottom"
          >
<!--            <a href="/static/pages/index.html#/world">
              <i
                style="color: white; font-size: 35px; line-height: 50px"
                class="el-icon-switch-button"
              ></i>
            </a>-->

            <button @click="ret" class="el-icon-switch-button" style="border: none;background-color: #303641;color: white; font-size: 35px; line-height: 50px">
<!--              <i
                  style="color: white; font-size: 35px; line-height: 50px"
                  class="el-icon-switch-button"
              ></i>-->
            </button>

          </el-tooltip>
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
  methods: {
    nodechange(item) {
      this.$store.state.nodename = item;
      if (this.$store.state.nodename === "master1") {
        this.$store.state.nodetype = "云";
      } else {
        this.$store.state.nodetype = "边";
      }
      for (let i = 0; i < this.nodeinfo.length; i++) {
        if (this.nodeinfo[i].nodeName === item) {
          this.$store.state.nodeip = this.nodeinfo[i].nodeIp;
          i = this.nodeinfo.length;
        }
      }
    },
    ret(){
      this.$router.push('/world')
      location.reload();
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
    this.$store.state.nodename = window.sessionStorage.getItem("nodename");
    this.$store.state.nodeip = window.sessionStorage.getItem("ip");
    this.$store.state.nodetype = window.sessionStorage.getItem("nodetype");
    this.value = this.$store.state.nodename;
  },
  computed: {
    tmp_nodename_w() {
      return this.$store.state.nodename
    }
  },
  watch: {
    tmp_nodename_w(nv, ov) {
      this.value = nv
    }
  }
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