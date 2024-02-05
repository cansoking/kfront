<template>
  <div style="padding: 12px">
    <el-button @click="showUploadDrawer" type="primary" icon="el-icon-plus">上传算法</el-button>
    <div v-if="currentAlgorithmValue" style="padding: 12px; display: flex; align-items: center">
      <div style="font-size: 18px">
        加载算法信息：当前算法是{{ currentAlgorithmValue }}
      </div>
      <el-popconfirm
          title="是否确认卸载该算法?"
          @confirm="confirmRemove"
      >
        <el-button style="margin-left: 16px" :loading="removeLoading" slot="reference" type="danger" plain>卸载算法</el-button>
      </el-popconfirm>
    </div>
    <el-table
        :data="algorithmsData"
        v-loading="tableLoading"
    >
      <el-table-column
          prop="id"
          label="算法ID"
          width="180"></el-table-column>
      <el-table-column
          prop="name"
          label="算法名"
      ></el-table-column>
      <el-table-column
          prop="info"
          label="算法描述"
      ></el-table-column>
      <!-- <el-table-column
          prop="class_name"
          label="算法类名"
      >
      </el-table-column> -->
      <el-table-column
          prop="action"
          label="操作"
      >
        <template slot-scope="scope">
          <el-button :loading="reloadLoading" @click="()=> reload(scope.row)" type="primary" plain>加载</el-button>
          <el-divider direction="vertical"></el-divider>
          <el-popconfirm
              title="是否确认删除?"
              @confirm="()=> confirmDelete(scope.row)"
          >
            <el-button :loading="deleteLoading" slot="reference" type="danger" plain>删除</el-button>
          </el-popconfirm>
          <!-- <el-divider direction="vertical"></el-divider> -->
          <!-- <el-button @click="()=> download(scope.row)" type="primary" plain>下载</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-drawer
        :visible.sync="visible"
        title="上传算法文件"
        size="40%"
        :show-close="false"
    >
      <el-form
          ref="dynamicValidateForm"
          :model="dynamicValidateForm"
          style="padding:10px"
          label-width="120px"
      >
        <el-form-item
            :rules="{required: true,message: '缺少算法名',}"
            label="算法名" prop="filename">
          <el-input
              v-model="dynamicValidateForm.filename"
          />
        </el-form-item>
        <el-form-item
            :rules="{required: true,message: '缺少算法描述',}"
            label="算法描述" prop="info">
          <el-input
              v-model="dynamicValidateForm.info"
          />
        </el-form-item>
        <el-form-item
            :rules="{required: true,message: '缺少算法类名',}"
            label="算法类名" prop="classname">
          <el-input
              v-model="dynamicValidateForm.classname"
          />
        </el-form-item>
      </el-form>
      <el-upload
          style="width: 100%"
          action="//81.70.164.10:8750/algorithmFile/uploadAlgorithm"
          :before-upload="beforeUpload"
          :on-error="onError"
          :on-success="onSuccess"
          :show-file-list="false"
          :data="{
            ...dynamicValidateForm
          }"
      >
        <el-button style="width: 100%" type="primary">选择文件（jar格式）</el-button>
      </el-upload>
    </el-drawer>
  </div>
</template>
<script>
import {isSuccess} from "@/utils";
import {currentAlgorithm, deleteAlgorithm, fetchAllAlgorithms, reloadAlgorithm, removeAlgorithm} from "@/api/algorithm";

export default {
  name: "AlgorithmFile",
  data() {
    return {
      visible: false,
      tableLoading: false,
      reloadLoading: false,
      deleteLoading: false,
      removeLoading: false,
      dynamicValidateForm: {
        filename: '',
        info: '',
        classname: ''
      },
      algorithmsData: [],
      currentAlgorithmValue: ''
    }
  },
  mounted() {
    this.fetchAllAlgorithms()
    this.getCurrentAlgorithm()
  },
  methods: {
    async fetchAllAlgorithms() {
      const result = await fetchAllAlgorithms().catch(e => e);
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.algorithmsData = result.data
    },
    showUploadDrawer() {
      this.visible = true
    },
    onClose() {
      this.visible = false
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        this.$refs.dynamicValidateForm.validate((valid) => {
          if (!valid) {
            this.$message.error('请先填写表单信息')
            reject()
            return
          }
          console.log(file)
          const isJAR = file.name.endsWith('.jar')
          if (!isJAR) {
            this.$message.error('只能上传jar格式文件!');
            reject()
            return
          }
          resolve()
        })
      })
    },
    onSuccess(file) {
      this.$message.success('文件上传成功')
      this.visible = false
      this.fetchAllAlgorithms()
    },
    onError(err) {
      this.$message.error(err)
    },
    async confirmDelete({id}) {
      this.deleteLoading = true
      const result = await deleteAlgorithm({id}).catch(e => e);
      this.deleteLoading = false
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.$message.success('算法删除成功')
      this.fetchAllAlgorithms()
    },
    async reload({id}) {
      this.reloadLoading = true
      const result = await reloadAlgorithm({id}).catch(e => e);
      this.reloadLoading = false
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.$message.success('算法加载成功')
      this.getCurrentAlgorithm()
    },
    async getCurrentAlgorithm() {
      const result = await currentAlgorithm().catch(e => e)
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.currentAlgorithmValue = result.data?.name
    },
    async confirmRemove() {
      this.removeLoading = true
      const result = await removeAlgorithm().catch(e => e);
      this.removeLoading = false
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.$message.success('算法卸载成功')
      this.getCurrentAlgorithm()
    },
    download() {
    }
  }
}
</script>


<style scoped>

</style>
<style>
.el-drawer__header {
  font-size: 20px !important;
}

.el-upload {
  width: 100%;
  padding: 10px;
}
</style>
