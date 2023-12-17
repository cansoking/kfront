<template>
  <div>
    <div>
      <div style="padding: 10px">
        <el-button @click="addTaskType" type="primary" icon="el-icon-plus">新增任务类型</el-button>
        <el-button @click="addTaskDataType" type="primary" icon="el-icon-plus">新增数据类型</el-button>
      </div>
      <el-table
          :data="taskTypeData"
          v-loading="tableLoading"
      >
        <el-table-column
            prop="id"
            label="任务类型ID"
            width="180"></el-table-column>
        <el-table-column
            prop="name"
            label="任务类型名称"
        ></el-table-column>
        <el-table-column
            prop="description"
            label="任务类型描述"
        ></el-table-column>
        <el-table-column
            prop="attributes"
            label="关联的任务属性"
        >
          <template slot-scope="scope">
            <span v-for="(item, itemIndex) in scope.row.attributes">{{ itemIndex }}：{{ item.info }} <br/></span>
          </template>
        </el-table-column>
        <el-table-column
            prop="action"
            label="操作"
        >
          <template slot-scope="scope">
            <el-popconfirm
                title="是否确认删除该任务类型？确认后会删除任务类型关联下的所有任务"
                @confirm="()=> confirmDelete(scope.row)"
            >
              <el-button slot="reference" type="danger" plain>删除</el-button>
            </el-popconfirm>
            <el-divider direction="vertical"></el-divider>
            <el-button @click="()=> gotoTask(scope.row)" type="primary" plain>查看绑定的任务</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-drawer
          :visible.sync="open"
          title="新增任务类型"
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
            label-width="120px"
        >
          <el-form-item
              :rules="{required: true,message: '缺少任务类型名称',}"
              label="任务类型名称" prop="name">
            <el-input
                v-model="dynamicValidateForm.name"
            />
          </el-form-item>
          <el-form-item
              :rules="{required: true,message: '缺少任务类型描述',}"
              label="任务类型描述" prop="description">
            <el-input
                v-model="dynamicValidateForm.description"
            />
          </el-form-item>
          <div
              v-for="(attribute, index) in dynamicValidateForm.attributes"
              :key="attribute.id"
              style="display: flex; margin-bottom: 8px"
          >
            <el-form-item
                label-width="12px"
                :prop="['attributes', index, 'info'].join('.')"
                :rules="{required: true,message: '缺少任务属性中文名称' }"
            >
              <el-input
                  v-model="attribute.info" placeholder="任务属性中文名称"/>
            </el-form-item>
            <el-form-item
                label-width="12px"
                :prop="['attributes', index, 'name'].join('.')"
                :rules="{required: true, validator: checkEnglishName }"
            >
              <el-input
                  v-model="attribute.name" placeholder="任务属性英文名称"/>
            </el-form-item>
            <el-form-item
                label-width="12px"
                :prop="['attributes', index, 'data_type'].join('.')"
                :rules="{required: true,message: '缺少任务属性类型',}"
            >
              <el-select
                  v-model="attribute.data_type"
                  style="min-width: 120px"
                  placeholder="任务属性类型"
              >
                <el-option
                    v-for="item in taskTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-button style="height: 40px;margin-left: 12px" @click="removeAttribute(attribute)" type="danger"
                       icon="el-icon-delete" circle></el-button>
          </div>
          <el-button style="width: 100%" icon="el-icon-plus" @click="addAttribute">
            新增任务类型属性
          </el-button>
        </el-form>
      </el-drawer>
      <el-drawer
          :visible.sync="dataTypeOpen"
          title="新增数据类型"
          size="40%"
          :show-close="false"
      >
        <div style="position: absolute;top: 10px;right:10px;">
          <el-button style="margin-right: 8px" @click="onDataTypeClose">取消</el-button>
          <el-button :loading="dataTypeLoading" @click="submitAddDataType" type="primary">新增</el-button>
        </div>
        <el-form
            ref="dataTypeForm"
            :model="dataTypeForm"
            style="padding:10px"
            label-width="120px"
        >
          <el-form-item
              :rules="{required: true,message: '缺少数据类型中文名',}"
              label="数据类型中文名" prop="info">
            <el-input
                v-model="dataTypeForm.info"
            />
          </el-form-item>
          <el-form-item
              :rules="{required: true,message: '缺少数据类型英文名',}"
              label="数据类型英文名" prop="name">
            <el-input
                placeholder="现在仅支持string, int, float, boolean"
                v-model="dataTypeForm.name"
            />
          </el-form-item>
        </el-form>
        <el-table
            :data="taskDataTypeData"
            v-loading="tableDataLoading"
        >
          <el-table-column
              prop="info"
              label="数据类型中文名"
          ></el-table-column>
          <el-table-column
              prop="name"
              label="数据类型英文名"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-popconfirm
                  title="是否确认删除该数据类型？"
                  @confirm="()=> confirmDeleteDataType(scope.row)"
              >
                <el-button slot="reference" type="danger" plain>删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import {taskDataTypeColumns, taskTypeColumns} from "@/constants/constant";
import {
  createDataType,
  createTaskType,
  deleteDataType,
  deleteTaskType,
  fetchAllDataType,
  fetchAllTaskType
} from "@/api/task";
import {isSuccess} from "@/utils";

export default {
  name: "TaskTypeManage",
  data() {
    return {
      taskTypeColumns,
      open: false,
      taskTypeData: [],
      taskDataTypeData: [],
      tableLoading: false,
      tableDataLoading: false,
      submitLoading: false,
      dataTypeLoading: false,
      dataTypeOpen: false,
      dataTypeForm: {
        name: '',
        info: ''
      },
      dynamicValidateForm: {
        name: '',
        description: '',
        attributes: [],
      },
    }
  },
  computed: {
    taskTypeOptions() {
      return this.taskDataTypeData.map(item => {
        return {
          label: item.info,
          value: item.id
        }
      })
    }
  },
  watch: {
    open(value) {
      if (value) {
        this.$refs.dynamicValidateForm?.resetFields();
        this.dynamicValidateForm.attributes = []
      }
    },
    dataTypeOpen(value) {
      if (value) {
        this.$refs.dataTypeForm?.resetFields();
        this.dataTypeForm.info = ''
        this.dataTypeForm.name = ''
      }
    }
  },
  methods: {
    addTaskType() {
      this.open = true;
      this.getTaskDataType()
    },
    addTaskDataType() {
      this.dataTypeOpen = true;
      this.getTaskDataType()
    },
    async getTaskDataType() {
      const result = await fetchAllDataType().catch(e => e);
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.taskDataTypeData = result.data
    },
    async getTaskTypeData() {
      this.tableLoading = true;
      const result = await fetchAllTaskType().catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      const data = result.data.map(item => {
        const {id, name, description} = item.task_type
        return {
          ...item,
          id,
          name,
          description
        }
      })
      this.taskTypeData = data
    },
    onClose() {
      this.open = false
    },
    onDataTypeClose() {
      this.dataTypeOpen = false
    },
    async submit() {
      this.submitLoading = true;
      this.$refs.dynamicValidateForm.validate(async (valid) => {
        if (!valid) return this.submitLoading = false;
        const {attributes, info, name, description} = this.dynamicValidateForm
        const data = {
          task_type: {
            name,
            info,
            description
          },
          attributes
        }
        const submitResult = await createTaskType(data).catch(e => e);
        if (!isSuccess(submitResult)) {
          this.submitLoading = false;
          return this.$message.error(submitResult.message || '请求失败');
        }
        this.submitLoading = false;
        this.open = false;
        this.$message.success('新增成功')
        this.getTaskTypeData()
      })
    },
    addAttribute() {
      this.dynamicValidateForm.attributes.push({
        name: '',
        data_type: undefined,
        info: '',
      });
    },
    checkEnglishName(rule, value, callback) {
      // 可以是英文数字和下划线
      const reg = /^[a-zA-Z0-9_]+$/;
      if (!value) return callback(new Error('任务属性英文名称不能为空'));
      if (!reg.test(value)) {
        return callback(new Error('只能是英文数字和下划线'));
      }
      return callback();
    },
    removeAttribute(item) {
      const index = this.dynamicValidateForm.attributes.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.attributes.splice(index, 1);
      }
    },
    async confirmDelete({task_type}) {
      const result = await deleteTaskType(task_type.id).catch(e => e);
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.$message.success('删除成功')
      this.getTaskTypeData()
    },
    async submitAddDataType() {
      this.dataTypeLoading = true;
      this.$refs.dataTypeForm.validate(async (valid) => {
        if (!valid) return this.dataTypeLoading = false;
        const {name, info} = this.dataTypeForm
        const data = {
          name,
          info
        }
        const submitResult = await createDataType(data).catch(e => e);
        if (!isSuccess(submitResult)) {
          this.dataTypeLoading = false;
          return this.$message.error(submitResult.message || '请求失败');
        }
        this.dataTypeLoading = false;
        this.$message.success('新增成功')
        this.dataTypeForm.name = ''
        this.dataTypeForm.info = ''
        this.$refs.dataTypeForm.resetFields()
        this.getTaskDataType()
      });
    },
    async confirmDeleteDataType({id}) {
      const result = await deleteDataType(id).catch(e => e);
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.$message.success('删除成功')
      this.getTaskDataType()
    },
    gotoTask({task_type}) {
      this.$router.push({
        name: 'taskManage',
        query: {
          task_type_id: task_type.id
        }
      })
    }
  },
  mounted() {
    this.getTaskTypeData()
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
