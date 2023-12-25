<template>
  <div style="padding: 12px">
    <el-button @click="addTask" type="primary" icon="el-icon-plus">
      新增任务
    </el-button>
    <el-button @click="addTaskByFile" type="primary">
      文件上传任务
    </el-button>
    <div style="font-size: 16px;display: inline-block;margin-left: 12px">
      选择任务类型：
    </div>
    <el-select
        v-model="taskId"
        style="width: 180px"
        @change="fetchTaskData"
        clearable
    >
      <el-option
          v-for="item in taskTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-table
        :data="taskData"
        v-loading="tableLoading"
    >
      <el-table-column
          prop="id"
          label="任务ID"
          width="180"></el-table-column>
      <el-table-column
          prop="name"
          label="任务名称"
      ></el-table-column>
      <el-table-column
          prop="description"
          label="任务描述"
      ></el-table-column>
      <el-table-column
          prop="attributes_values"
          label="任务属性"
      >
        <template slot-scope="scope">
          <div v-for="(value,key) in scope.row.attributes_values">
            <span>{{ key }}：</span>
            <span>{{ value }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
          prop="status"
          label="任务状态"
      >
        <template slot-scope="scope">
          <el-tag>标签一</el-tag>

        </template>
      </el-table-column>
      <el-table-column
          prop="action"
          label="操作"
      >
        <template slot-scope="scope">
          <el-popconfirm
              title="是否确认删除该任务？"
              @confirm="()=> confirmDelete(scope.row)"
          >
            <el-button slot="reference" type="danger" plain>删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-drawer
        :visible.sync="open"
        title="新增任务"
        size="40%"
        :show-close="false"
    >
      <div style="position: absolute;top: 10px;right:10px;">
        <el-button style="margin-right: 8px" @click="onClose">取消</el-button>
        <el-button :loading="submitLoading" @click="submit" type="primary">提交</el-button>
      </div>
      <el-form
          ref="dynamicValidateForm"
          :model="dynamicValidateForm"
          style="padding:10px"
          label-width="100px"
      >
        <el-form-item
            :rules="{required: true,message: '缺少任务名称',}"
            label="任务名称" prop="name">
          <el-input
              v-model="dynamicValidateForm.name"
          />
        </el-form-item>
        <el-form-item
            :rules="{required: true,message: '缺少任务描述',}"
            label="任务描述" prop="description">
          <el-input
              v-model="dynamicValidateForm.description"
          />
        </el-form-item>
        <el-form-item
            prop="type_id"
            :rules="{required: true,message: '缺少任务属性类型',}"
            label="任务类型"
        >
          <el-select
              style="width: 100%"
              v-model="dynamicValidateForm.type_id"
              placeholder="请选择任务属性类型"
          >
            <el-option
                v-for="item in taskTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
            v-for="(item, index) in taskTypeAttributes"
            :key="index"
            :label="item.info"
            :prop="['attributes_values', item.name].join('.')"
            :rules="[{ required: true, validator: (rule, value)=>checkAttribute(value, item.data_type_name), trigger: 'blur' }]"
        >
          <el-input
              v-if="item.data_type_name === 'string'"
              v-model="dynamicValidateForm.attributes_values[item.name]"
          />
          <el-input-number
              style="width: 100%"
              v-else-if="item.data_type_name === 'int'"
              v-model="dynamicValidateForm.attributes_values[item.name]"
          />
          <el-input-number
              style="width: 100%"
              v-else-if="item.data_type_name === 'float'"
              v-model="dynamicValidateForm.attributes_values[item.name]"
          />
          <el-input-number
              style="width: 100%"
              v-else-if="item.data_type_name === 'double'"
              v-model="dynamicValidateForm.attributes_values[item.name]"
          />
          <el-input-number
              style="width: 100%"
              v-else-if="item.data_type_name === 'long'"
              v-model="dynamicValidateForm.attributes_values[item.name]"
          />
          <el-input
              v-else-if="item.data_type_name === 'boolean'"
              v-model="dynamicValidateForm.attributes_values[item.name]"
          />
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import {
  createTask,
  deleteTask,
  fetchAllDataType,
  fetchAllTasks,
  fetchAllTaskType, fetchTask
} from "@/api/task";
import {isSuccess} from "@/utils";

export default {
  name: "TaskManage",
  data() {
    return {
      taskData: [],
      taskTypeData: [],
      dataType: [],
      tableLoading: false,
      submitLoading: false,
      open: false,
      taskFile: null,
      taskId: '',
      dynamicValidateForm: {
        name: '',
        description: '',
        type_id: undefined,
        attributes_values: {},
      }
    }
  },
  computed: {
    taskTypeOptions() {
      return this.taskTypeData.map(item => {
        return {
          label: item.task_type.name,
          value: item.task_type.id
        }
      })
    },
    taskTypeAttributes() {
      const taskType = this.taskTypeData.find(item => item.task_type.id === this.dynamicValidateForm.type_id)
      return taskType?.attributes || []
    }
  },
  watch: {
    open(value) {
      if (value) {
        this.$refs.dynamicValidateForm?.resetFields()
        this.dynamicValidateForm = {
          name: '',
          description: '',
          type_id: undefined,
          attributes_values: {}
        }
      }
    }
  },
  mounted() {
    const query = this.$route.query || {}
    this.getTaskTypeData();
    if (query.task_type_id) {
      this.taskId = Number(query.task_type_id)
      this.fetchTaskData()
    } else {
      this.getAllTaskData();
    }
  },
  methods: {
    onClose() {
      this.open = false
    },
    async fetchTaskData() {
      if (!this.taskId) return this.getAllTaskData()
      this.tableLoading = true;
      const result = await fetchTask(this.taskId).catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.taskData = result.data
    },
    async getAllTaskData() {
      this.tableLoading = true;
      const result = await fetchAllTasks().catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.taskData = result.data
    },
    addTask() {
      this.open = true;
      this.getTaskTypeData()
    },
    addTaskByFile() {
      this.taskFile = true;
      // this.getTaskTypeData()
    },
    async getTaskTypeData() {
      this.tableLoading = true;
      const result = await fetchAllTaskType().catch(e => e);
      await this.getTaskDataType().catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.taskTypeData = result.data?.map(item => {
        item.attributes = item.attributes.map(attribute => {
          const dataTypeItem = this.dataType.find(dataTypeItem => dataTypeItem.id === attribute.data_type)
          return {
            ...attribute,
            data_type_name: dataTypeItem?.name
          }
        })
        return item
      })
    },
    async getTaskDataType() {
      const result = await fetchAllDataType().catch(e => e);
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.dataType = result.data
    },
    async confirmDelete({id}) {
      const result = await deleteTask(id).catch(e => e);
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.$message.success('删除成功')
      this.getAllTaskData()
    },
    async checkAttribute(value, dataType) {
      if (!value) return Promise.reject('必填');
      if (dataType === 'int') {
        if (!Number.isInteger(value)) {
          return Promise.reject('只能是整数');
        }
      }
      if (dataType === 'float' || dataType === 'double') {
        if (typeof value !== 'number') {
          return Promise.reject('只能是数字');
        }
      }
      if (dataType === 'boolean') {
        if (value !== 'true' && value !== 'false') {
          return Promise.reject('只能是布尔值，true或者false');
        }
      }
      return Promise.resolve();
    },
    async submit() {
      this.submitLoading = true;
      this.$refs.dynamicValidateForm.validate(async (valid) => {
        if (!valid) return this.submitLoading = false;
        const {attributes_values, type_id, name, description} = this.dynamicValidateForm
        const data = {
          name,
          description,
          type_id,
          attributes_values
        }
        const submitResult = await createTask(data).catch(e => e);
        if (!isSuccess(submitResult)) {
          this.submitLoading = false;
          return this.$message.error(submitResult.message || '请求失败');
        }
        this.submitLoading = false;
        this.open = false;
        this.$message.success('新增成功')
        this.getAllTaskData()
      })
    },
  }
}
</script>


<style scoped>

</style>

<style>
.el-drawer__header {
  font-size: 20px !important;
}
</style>
