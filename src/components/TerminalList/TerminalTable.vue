<template>
  <div  class="page-table">


    <el-table :data="tableData" style="width: 100%" height="600" class="table">
    <el-table-column prop="sid" label="端侧服务器ID" width="180" />
    <el-table-column prop="mid" label="任务ID" width="180" />
    <el-table-column prop="sendingEnd" label="发送端IP" width="180" />
    <el-table-column prop="receiveEnd" label="接收端IP" />
    <el-table-column prop="curState" label="当前状态" />
    <el-table-column prop="totalPackageNum" label="总数据包数量" />
    <el-table-column prop="finishPackageNum" label="已传输数据包数量" />
    <el-table-column prop="startTime" label="任务开始时间" />
    <el-table-column prop="finishTime" label="任务结束时间" />


    <!-- 暂时不需要操作按钮 -->
    <!-- <el-table-column label="操作">
      <template #default>
        <el-button link type="primary" size="normal" @click="goToDetail">详情</el-button>
      </template>
    </el-table-column> -->
   </el-table>
  </div>
    
  
    
</template>



<script setup>
// import { useRouter } from 'vue-router';
import router from '@/router'

// const router = useRouter();

const tableData = [
  {
    sid:'00000001',
    mid:'00000001',
    sendingEnd:'192.168.1.5',
    receiveEnd:'192.168.2.5',
    curState:"传输中",
    totalPackageNum:'100',
    finishPackageNum:'55',
    startTime:'15:00',
    finishTime:'-'
  },
  {
    sid:'00000001',
    mid:'00000002',
    sendingEnd:'192.168.20.4',
    receiveEnd:'192.168.23.5',
    curState:"已完成",
    totalPackageNum:'100',
    finishPackageNum:'100',
    startTime:'14:59',
    finishTime:'15:10',
  },
  {
    sid:'00000001',
    mid:'00000003',
    sendingEnd:'192.168.1.5',
    receiveEnd:'192.168.2.5',
    curState:"已取消",
    totalPackageNum:'200',
    finishPackageNum:'33',
    startTime:'13:00',
    finishTime:'-'
  },
  {
    sid:'00000001',
    mid:'00000004',
    sendingEnd:'192.168.100.5',
    receiveEnd:'192.168.200.6',
    curState:"暂停中",
    totalPackageNum:'60',
    finishPackageNum:'33',
    startTime:'11:00',
    finishTime:'-'
  },
  
]

const goToDetail = ()=>{
  router.push('/detail');
}

</script>

<style lang="less" scoped>
.page-table {
  width: inherit;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(2px);//模糊程度
  // &.no-data {
  //   height: 450px;
  // }
}



::v-deep(.el-table),
::v-deep(.el-table__expanded-cell){
  background-color: transparent !important;
}

.el-table{
  --el-table-border:none;//除去表头底下的白线
}

::v-deep(.el-table tr),
::v-deep(.el-table td) {
  color: rgba(255, 255, 255, 0.7);//表项文本颜色
  font-size: 15px;
  background-color: transparent !important;
}
::v-deep(.el-table th) {
  // background: #0968c6;
  background-color: rgba(29, 29, 207, 0.686);//表头背景
  font-size: 16px;
  color:white;//表头文本颜色
  &:first-child {
    border-radius: 10px 0 0 10px;
  }
  &:last-child {
    border-radius: 0 10px 10px 0;
  }
  
}

//控制单元格之间的分割线
::v-deep(.el-table td.el-table__cell) {
  border-bottom: none;
}
::v-deep(.el-table__inner-wrapper::before) {
  display: none;
}


// 修改分页样式
.pagination {
  display: flex;
  justify-content: flex-end;
  width: 100%;
}
::v-deep(.el-pager li.number),
::v-deep(.el-pager li.more),
::v-deep(.btn-prev.is-first),
::v-deep(.btn-next.is-last) {
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 12px 20px 6px rgb(104 112 118 / 0.2);
  border-radius: 50%;
  color: #2d3d50;
}
::v-deep(.el-pager li.number.is-active) {
  box-shadow: 0 4px 14px #5ea2ef;
  background: #0072f5;
  color: #fff;
}


</style>