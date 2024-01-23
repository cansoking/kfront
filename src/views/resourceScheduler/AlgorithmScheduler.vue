<template>
  <div style="display: flex; justify-content: space-around; padding: 12px">
    <div style="width: 45%">
      <div style="font-size: 16px;display: inline-block;margin-left: 12px">
        选择任务类型：
      </div>
      <el-select
          v-model="taskId"
          style="width: 180px"
          @change="fetchTaskDataByConditions"
          optionFilterProp="label"
          clearable
      >
        <el-option
            v-for="item in taskTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div style="font-size: 16px;display: inline-block;margin-left: 12px">
        选择任务状态：
      </div>
      <el-select
          v-model="taskStatus"
          style="width: 180px"
          @change="fetchTaskDataByConditions"
          clearable
      >
        <el-option
            v-for="item in taskStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-table
          :data="taskData"
          v-loading="tableLoading"
          style="margin-top: 12px"
      >
        <el-table-column
            prop="id"
            label="任务ID"
            width="50"></el-table-column>
        <el-table-column
            prop="name"
            label="任务名称"
            width="100"
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
            <el-popover
              placement="right"
              width="400"
              trigger="click"
              >
              <div style="max-height: 400px; overflow-y: auto;">
                <el-table :data="scope.row.attributes_values_arr" >
                  <el-table-column
                      prop="key"
                      label="属性"
                  ></el-table-column>
                  <el-table-column
                      prop="value"
                      label="值"
                  ></el-table-column>
                </el-table>
              </div>
               
              <el-button slot="reference">查看详情</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
            prop="status"
            label="任务状态"
        >
          <template slot-scope="scope">
         
            <div v-if="scope.row.status === 2">
              <el-tag>正在执行</el-tag> 
            </div>
            <div v-else-if="scope.row.status === 3">
              <el-tag type="warning">任务停止</el-tag> 
            </div>
            <div v-else-if="scope.row.status === 4">
              <el-tag type="success">任务结束</el-tag>
            </div>
            <div v-else-if="scope.row.status === 5">
              <el-tag type="danger">任务失败</el-tag> 
            </div>
            <div v-else>
              <el-tag type="info">任务发起</el-tag>
            </div>
          </template>

        </el-table-column>
        <el-table-column
            prop="action"
            label="操作"
        >
          <template slot-scope="scope">
            <el-button @click="() => connectResource(scope.row)">关联资源</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button :loading="runLoading" @click="handleRun" style="height: 36px" type="primary">调度运行</el-button>
    
    <div style="width: 45%">
      <div style="font-size: 16px;display: inline-block;margin-left: 12px">
        选择资源类型：
      </div>
      <el-select
          v-model="resourceId"
          style="width: 180px"
          @change="fetchResourceData"
          clearable
          filterable
          optionFilterProp="label"
      >
        <el-option
            v-for="item in resourceTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <div style="font-size: 16px;display: inline-block;margin-left: 12px">
        选择算法：
      </div>
      <el-select
          v-model="algorithm"
          style="width: 180px"
          @change="fetchAlgorithm"
          clearable
          filterable
          optionFilterProp="label"
      >
        <el-option
            v-for="item in algorithmData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
      </el-select>
      <el-table
          :data="resourceData"
          v-loading="resourceTableLoading"
          style="margin-top: 12px"
      >
        <el-table-column
            prop="id"
            label="资源ID"
            width="180"></el-table-column>
        <el-table-column
            prop="name"
            label="资源名称"
        ></el-table-column>
        <el-table-column
            prop="description"
            label="资源描述"
        ></el-table-column>
        <el-table-column
            prop="attributes_values"
            label="资源属性"
        >
          <template slot-scope="scope">
            <div v-for="(value,key) in scope.row.attributes_values">
              <span>{{ key }}：</span>
              <span>{{ value }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
            prop="action"
            label="操作"
        >
          <template slot-scope="scope">
            <el-button @click="() => modifyConnectTask(scope.row)" type="link">任务列表</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="open" title="关联资源">
      <div style="font-size: 16px;display: inline-block;margin-left: 12px">
        选择资源：
      </div>
      <el-select
          v-model="selectedResourceId"
          style="width: 180px"
          clearable
          filterable
          optionFilterProp="label"
      >
        <el-option
            v-for="item in resourceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="connectOpen" title="关联的任务">
      <el-table
          :data="connectTaskData"
          v-loading="connectTaskLoading"
          style="margin-top: 12px"
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
            prop="action"
            label="操作"
        >
          <template slot-scope="scope">
            <el-popconfirm
                title="是否确认该任务的关联？"
                @confirm="()=> unConnect(scope.row)"
            >
              <el-button slot="reference" type="danger" plain>解除关联</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>

import {addTaskToResource, fetchAllTasks, fetchAllTaskType, fetchTask,  fetchTaskByConditions} from "@/api/task";
import {isSuccess} from "@/utils";
import {cloneDeep, isEmpty} from 'lodash'
import {
  deleteTaskFromResource,
  fetchAllResources,
  fetchAllResourceType,
  fetchResource,
  fetchTasksByResource
} from "@/api/resource";
import {runAlgorithm,fetchAllAlgorithms,reloadAlgorithm} from "@/api/algorithm";

export default {
  name: "AlgorithmScheduler",
  data() {
    return {
      tableLoading: false,
      resourceTableLoading: false,
      resourceData: [],
      taskData: [],
      connectTaskData: [],
      connectTaskLoading: false,
      runLoading: false,
      initResourceData: [],
      taskId: undefined,
      taskStatus: undefined,
      resourceId: undefined,
      algorithm: undefined,
      algorithmData: [],
      selectedResourceId: undefined,
      selectedTaskId: undefined,
      open: false,
      connectOpen: false,
      modifyConnectTaskId: undefined,
      taskTypeOptions: [],
      taskStatusOptions: [
        {"value":1, "label":"任务发起"},
        {"value":2, "label":"正在执行"},
        {"value":3, "label":"任务停止"},
        {"value":4, "label":"任务结束"},
        {"value":5, "label":"任务失败"}
      ],
      resourceTypeOptions: []
    }
  },
  computed: {
    resourceOptions() {
      return this.initResourceData.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
    }
  },
  mounted() {
    // this.fetchTaskData();
    this.getTaskTypeData()
    // this.getAllResourceData();
    this.getResourceTypeData();
    fetchAllAlgorithms().then(res => {
      if(res.code === 200){
        this.algorithmData = res.data;
      }else{
        return this.$message.error(res.message || '请求失败')
      }
    })
  },
  methods: {
    async handleRun() {
      if(this.algorithm === undefined || !this.algorithm){
        return this.$message.error('请选择算法')
      }
      const param = {
        task_list: this.taskData,
        resource_list: this.resourceData
      }
      this.runLoading = true;
      const result = await runAlgorithm(param).catch(e => e)
      this.runLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败')
      }
      if (result.data) {
        this.$alert(result.data, '调度结果', {
          confirmButtonText: '确定',
          callback: () => {
          }
        });
      }
    },
    async getTaskTypeData() {
      this.tableLoading = true;
      const result = await fetchAllTaskType().catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.taskTypeOptions = result.data?.map(item => {
        const {task_type} = item
        return {
          label: task_type.name,
          value: task_type.id
        }
      })
    },
    async getResourceTypeData() {
      this.tableLoading = true;
      const result = await fetchAllResourceType().catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.resourceTypeOptions = result.data?.map(item => {
        const {resource_type} = item
        return {
          label: resource_type.name,
          value: resource_type.id
        }
      })
    },
    async getAllTaskData() {
      this.tableLoading = true;
      const result = await fetchAllTasks().catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      result.data.forEach(item => {
        if(item.attributes_values && Object.keys(item.attributes_values).length > 0){
          // 遍历这个对象key value 生成新数组
          item.attributes_values_arr = Object.keys(item.attributes_values).map(key => {
            return {
              key,
              value: item.attributes_values[key]
            }
          })
        }
      })
      this.taskData = result.data
    },
    async fetchTaskData() {
      // if (!this.taskId) return this.getAllTaskData()
      this.tableLoading = true;
      const result = await fetchTask(this.taskId).catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }      
      result.data.forEach(item => {
        if(item.attributes_values && Object.keys(item.attributes_values).length > 0){
          // 遍历这个对象key value 生成新数组
          item.attributes_values_arr = Object.keys(item.attributes_values).map(key => {
            return {
              key,
              value: item.attributes_values[key]
            }
          })
        }
      })
      this.taskData = result.data
    },
    async fetchTaskDataByConditions() {
      if (!this.taskId) {
        this.taskData = [];
        return;
      }
      this.tableLoading = true;
      const result = await fetchTaskByConditions(this.taskId, this.taskStatus).catch(e => e);
      this.tableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }      
      result.data.forEach(item => {
        if(item.attributes_values && Object.keys(item.attributes_values).length > 0){
          // 遍历这个对象key value 生成新数组
          item.attributes_values_arr = Object.keys(item.attributes_values).map(key => {
            return {
              key,
              value: item.attributes_values[key]
            }
          })
        }
      })
      this.taskData = result.data
    },
    async getAllResourceData() {
      this.resourceTableLoading = true;
      const result = await fetchAllResources().catch(e => e);
      this.resourceTableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.resourceData = result.data
      this.initResourceData = cloneDeep(result.data)
    },
    async fetchResourceData() {
      if (!this.resourceId) return this.getAllResourceData()
      this.resourceTableLoading = true;
      const result = await fetchResource(this.resourceId).catch(e => e);
      this.resourceTableLoading = false;
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败');
      }
      this.resourceData = result.data
    },
    async fetchAlgorithm() {
      if(!this.algorithm){
        this.algorithm = undefined;
        console.log(this.algorithm,'algorithm')
        return
      }
      reloadAlgorithm({
        id: this.algorithm,
      }).then(res => {
        if(res.code === 200){
          this.$message.success('加载成功')
        }else{
          this.$message.error(res.message || '请求失败');
        }
      })
    },
    getResourceData(data) {
      if (isEmpty(data)) {
        this.resourceData = this.initResourceData.value
        return
      }
      this.resourceData = this.initResourceData.filter(item => data.includes(item.id))
    },
    async handleOk() {
      if (!this.selectedResourceId) return this.$message.error('请选择资源')
      const result = await addTaskToResource({
        resource_id: this.selectedResourceId,
        task_id: this.selectedTaskId
      }).catch(e => e)
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败')
      }
      this.$message.success('关联成功')
      this.open = false
      this.getAllResourceData()
    },
    connectResource({id}) {
      this.open = true
      this.selectedTaskId = id
    },
    async modifyConnectTask({id}) {
      this.modifyConnectTaskId = id
      this.connectOpen = true
      this.connectTaskLoading = true
      const result = await fetchTasksByResource(id).catch(e => e)
      this.connectTaskLoading = false
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败')
      }
      this.connectTaskData = result.data
    },
    async unConnect({id}) {
      const result = await deleteTaskFromResource({
        resource_id: this.modifyConnectTaskId,
        task_id: id
      }).catch(e => e)
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败')
      }
      this.$message.success('解除关联成功')
      this.connectOpen = false
    }
  }
}
</script>


<style>
.el-message-box__message {
  white-space: pre-line;
  height: 400px; 
  overflow-y: auto;
}
</style>
