<template>
  <div>
    <el-table
        :data="logData"
        v-loading="loading"
    >
      <el-table-column
          prop="timestmp"
          label="时间"
          width="180">
        <template slot-scope="scope">
          <span>
              {{ new Date(scope.row.timestmp).toLocaleString() }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
          prop="formatted_message"
          label="动作"
      ></el-table-column>
      <el-table-column
          prop="level_string"
          label="状态"
      ></el-table-column>
    </el-table>
  </div>
</template>
<script>
import {getLog} from "@/api/log";
import {isSuccess} from "@/utils";

export default {
  name: "Log",
  data() {
    return {
      loading: false,
      logData: []
    }
  },
  methods: {
    async getLogInfo() {
      this.loading = true
      const result = await getLog().catch(e => e)
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
