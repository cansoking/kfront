<template>
  <div>
    <el-card class="vmcard" shadow="hover">
      <div slot="header" class="vmhead">
        <span>创建虚拟机</span>
      </div>
      <el-form
        label-position="top"
        label-width="80px"
        :model="formData"
        :status-icon="true"
        :rules="vm_rules"
        ref="formData"
      >
        <el-row :gutter="30">
          <el-col :span="12" :offset="0">
            <el-form-item label="虚拟机名称" prop="name">
              <el-input
                style="width: 60%"
                v-model="formData.name"
                placeholder="请输入虚拟机名称"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="内存" prop="memory">
              <el-select
                style="width: 60%"
                v-model="formData.memory"
                clearable
                placeholder="请选择内存大小(GiB)"
              >
                <el-option
                  v-for="item in memory_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="30">
          <el-col :span="12" :offset="0">
            <el-form-item label="CPU个数" prop="cpuNum">
              <el-select
                style="width: 60%"
                v-model="formData.cpuNum"
                clearable
                placeholder="请选择CPU个数"
              >
                <el-option
                  v-for="item in cpunum_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="系统类型" prop="OStype">
              <el-select
                style="width: 60%"
                v-model="formData.OStype"
                clearable
                placeholder="请选择系统类型"
              >
                <el-option
                  v-for="item in ostype_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="虚拟机映像文件" prop="vm_iso">
          <el-upload
            class="upload-demo"
            drag
            ref="upload"
            :action="baseurl + '/addVirtual'"
            :multiple="false"
            :data="formData"
            accept=".iso"
            :auto-upload="false"
            :limit="1"
            :before-upload="handleBeforeUpload"
            :on-success="sucupload"
            :on-error="errupload"
            style="width: 30%"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">*只能上传.iso文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item size="large">
          <div class="vmc-sbm-area">
            <el-button round @click="resetForm('formData')">清空输入</el-button>
            <el-button round type="primary" @click="vmc_sumbit('formData')"
              >立即创建</el-button
            >
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "VMCreate",
  data() {
    return {
      baseurl: "http://39.98.124.97:8080",
      // 系统类型选项
      ostype_options: [
        {
          label: "x86",
          value: "X86",
        },
        {
          label: "arm",
          value: "arm",
        },
      ],
      cpunum_options: [
        {
          label: '1 个',
          value: '1',
        },
        {
          label: '2 个',
          value: '2',
        },
        {
          label: '4 个',
          value: '4',
        },
        {
          label: '6 个',
          value: '6',
        },
        {
          label: '8 个',
          value: '8',
        },
        {
          label: '10 个',
          value: '10',
        }
      ],
      memory_options: [
      {
          label: '1 GiB',
          value: '1'
        },{
          label: '2 GiB',
          value: '2'
        },{
          label: '4 GiB',
          value: '4'
        },{
          label: '6 GiB',
          value: '6'
        },{
          label: '8 GiB',
          value: '8'
        },{
          label: '16 GiB',
          value: '16'
        },{
          label: '24 GiB',
          value: '24'
        },{
          label: '32 GiB',
          value: '32'
        }
      ],
      // 虚拟机信息
      formData: {
        name: "",
        memory: "",
        cpuNum: "",
        OStype: "",
      },
      // 校验规则
      vm_rules: {
        name: [
          { required: true, message: "请输入虚拟机名称", trigger: "blur" },
        ],
        memory: [
          { required: true, message: "请选择内存大小", trigger: "change" },
        ],
        cpuNum: [{ required: true, message: "请选择CPU个数", trigger: "change" }],
        OStype: [
          { required: true, message: "请选择系统类型", trigger: "change" },
        ],
      },
    };
  },
  methods: {
    // 上传失败
    errupload(err, file, fileList) {
      this.$notify.error({
        title: "创建失败",
        message: JSON.parse(err.message).message,
        position: "bottom-right",
        duration: 6000,
      });
    },
    // 成功上传文件
    sucupload(response, file, fileList) {
      if (response === "yes") {
        this.$notify.success({
          title: "创建成功",
          message: "虚拟机 " + this.formData.name + " 创建成功！",
          position: "bottom-right",
          duration: 6000,
        });
        this.$router.push('/vmlist');
      } else {
        this.$notify.error({
          title: "创建失败",
          message: response,
          position: "bottom-right",
          duration: 6000,
        });
      }
    },
    // 控制文件格式
    handleBeforeUpload(file) {
      console.log(file);
      var iso = file.name.substring(file.name.lastIndexOf(".") + 1);
      const suffix = iso === "iso";
      if (!suffix) {
        this.$message.error("只能上传ISO文件！");
        return false;
      }
      return suffix;
    },
    // 添加虚拟机
    vmc_sumbit(formName) {
      // 校验表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 提交表单，创建虚拟机
          this.$refs.upload.submit();
        } else {
          console.log("表单验证不通过");
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
.vmhead {
  font-size: 30px;
  font-weight: 600;
}
/* 卡片head */
.vmcard .el-card__header {
  background-color: #08c0b9;
  color: #fff;
}
/* 卡片content */
.el-card ::v-deep .el-card__body {
  padding: 0px;
  background-color: powderblue;
}

.vmc-sbm-area {
  padding-top: 70px;
  text-align: right;
}
</style>