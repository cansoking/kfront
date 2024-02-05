<template>
  <div>
    <el-date-picker
      style="margin: 16px 0; margin-left: 16px"
      v-model="date"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      :picker-options="pickerOptions"
      end-placeholder="结束日期">
    
    </el-date-picker>
    <el-button :disabled="!date" @click="onClickQuery" style="margin-left: 16px;" type="primary">搜索</el-button>
    <el-table
        :data="logData"
        v-loading="loading"
    >
    <el-table-column
          prop="event_ID"
          label="日志号"
      ></el-table-column>
      <el-table-column
          prop="operationtime"
          label="时间"
      ></el-table-column>
      <el-table-column
          prop="loglevel"
          label="日志级别"
      ></el-table-column>
      <el-table-column
          class-name="resource_log_msg"
          prop="msg"
          label="日志信息"
      >
      <template slot-scope="scope">
            <el-popover placement="right" width="400" trigger="click">
              <div style="max-height: 400px; overflow-y: auto;white-space: pre-wrap;">
                {{ scope.row.msg }}
                <!-- <el-table :data="scope.row.attributes_values_arr">
                  <el-table-column prop="key" label="属性"></el-table-column>
                  <el-table-column prop="value" label="值"></el-table-column>
                </el-table> -->
              </div>

              <el-button slot="reference">查看详情</el-button>
            </el-popover>
          </template>
    </el-table-column>
      <!-- <el-table-column
          prop="method"
          label="method"
      ></el-table-column>
      <el-table-column
          prop="class"
          label="class"
      ></el-table-column> -->
    </el-table>
  </div>
</template>
<script>
import {getLog} from "@/api/log";
import {isSuccess} from "@/utils";
import moment from "moment";
export default {
  name: "Log",
  data() {
    return {
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      loading: false,
      logData: [],
      date: '',
    }
  },
  mounted() {
    let currentDate = new Date(); 
    let nextDay = new Date();
    nextDay.setDate(currentDate.getDate() + 1);
    this.getLogInfo(moment(currentDate).format('YYYY-MM-DD'), moment(nextDay).format('YYYY-MM-DD'));
  },
  methods: {
    onClickQuery(){
      console.log(this.date,'date');
      if(this.date){
        let startTime = moment(this.date[0]).format('YYYY-MM-DD');
        let endTime = moment(this.date[1]).format('YYYY-MM-DD');
        console.log(startTime,'startTime');
        console.log(endTime,'endTime');
        this.getLogInfo(startTime, endTime)
      }
    },
    async getLogInfo(startTime, endTime) {
      this.loading = true
      const result = await getLog({
        startTime,
        endTime
      }).catch(e => e)
      this.loading = false
      if (!isSuccess(result)) {
        return this.$message.error(result.message || '请求失败')
      }
      this.logData = result.data
    }
  }
}
</script>


<style scoped>
</style>
