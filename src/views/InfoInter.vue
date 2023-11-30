<template>
  <div class="vmarea">
    <!-- 头部标题操作 -->
    <el-row :gutter="0">
      <el-col :span="10" :offset="0"
        ><p style="font-size: 25px; font-weight: 600; margin-bottom: 20px">
          情报截取
        </p></el-col
      >
    </el-row>
    <!-- 内容区域 -->
    <el-form
      label-position="top"
      label-width="80px"
      :model="info_form"
      :status-icon="true"
      :rules="info_rules"
      ref="info_form"
    >
      <el-form-item label="情报信息" prop="message">
        <el-input
          style="width: 40%"
          :rows="15"
          placeholder="请输入截取的情报信息"
          type="textarea"
          v-model="info_form.message"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容类型" prop="option">
        <el-radio-group v-model="info_form.option">
          <el-radio label="明文"></el-radio>
          <el-radio label="密文"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item size="large">
        <div class="cp-sbm-area">
          <el-button round @click="resetForm('info_form')">清空</el-button>
          <el-button round type="primary" @click="sendmsg('info_form')"
            >发送给情报破译应用</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
    
<script >
export default {
  name: "InfoInter",
  mounted() {},
  data() {
    return {
      baseurl: "http://172.26.82.161:9001",
      info_form: {},
      info_rules: {
        message: [
          { required: true, message: "请输入截取的情报信息", trigger: "blur" },
        ],
        option: [
          { required: true, message: "请选择内容类型", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 添加容器
    sendmsg(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建容器
          this.$axios({
            method: "post",
            url:
              this.baseurl +
              (this.info_form.option === "明文"
                ? "/websocket/send2?message="
                : "/websocket/send1?message=") +
              this.info_form.message,
          }).then(
            (res) => {
              this.$notify.success({
                title: "操作通知",
                message: "发送成功",
                position: "bottom-right",
              });
            },
            (err) => {
              console.log(err);
              this.$notify.error({
                title: "发送失败",
                message: "请检查网络连接设置",
                position: "bottom-right",
              });
            }
          );
          this.createpodvisible = false;
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
  },
};
</script>
    
    <style>
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