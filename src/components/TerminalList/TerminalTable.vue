<template>
  <div  class="page-table">


    <el-table :data="tableData" style="width: 100%" height="600" class="table">
    <!-- <el-table-column prop="packetSize" label="端侧服务器ID" width="180" /> -->
    <el-table-column label="源节点" width="90" align="center">
      <template>
        <span>北京终端</span>
      </template>
    </el-table-column>
    <el-table-column label="源IP地址" width="140" align="center">
      <template>
        <span>192.168.192.243</span>
      </template>
    </el-table-column>
    <el-table-column label="目的节点" width="90" align="center">
      <template>
        <span>云服务器</span>
      </template>
    </el-table-column>
    <el-table-column label="目的IP地址" width="140" align="center">
      <template>
        <span>192.168.192.182</span>
      </template>
    </el-table-column>
    <el-table-column prop="fileId" label="任务ID" width="110" align="center"/>
    <el-table-column prop="fileName" label="传输文件名"  width="100" align="center"/>
    <el-table-column prop="startTime" label="任务开始时间" align="center"/>
    <el-table-column prop="totalPackageNum" label="原始数据包数量" width="140" align="center"/>
    <el-table-column prop="startTime" label="传输开始时间" align="center"/>
    <el-table-column prop="lossProbability" label="丢包率"  width="70" align="center"/>
    <el-table-column prop="transEndTime" label="传输完成时间" align="center"/>
    <el-table-column prop="currentPackageNum" label="已解码数据包数量" align="center"/>
    <!-- <el-table-column prop="ipAndPort" label="发送端IP" width="180" /> -->
    <!-- <el-table-column prop="receiveIp" label="接收端IP" /> -->
    <!-- <el-table-column prop="completed" label="当前状态" /> -->
    <!-- <el-table-column prop="totalPackageNum" label="总数据包数量" /> -->
    
    <!-- <el-table-column prop="transmissProgress" label="当前进度" /> -->
    
    <el-table-column prop="endTime" label="解码完成时间" align="center"/>
    


    <!-- 暂时不需要操作按钮 -->
    <!-- <el-table-column label="操作">
      <template #default>
        <el-button link type="primary" size="normal" @click="goToDetail">详情</el-button>
      </template>
    </el-table-column> -->
   </el-table>
  </div>
    
  
    
</template>



<script>
// import { useRouter } from 'vue-router';
import router from '@/router'
// const router = useRouter();


export default{
  data(){
    return {
      tableData:[],
      timer:null,//计时器
      url : process.env.VUE_APP_API_URI_NOPORT,//服务器地址
    }
  },

  methods:{
    //查询传输文件列表
    queryList(){
      var that = this;
      this.$axios({
        method:"post",
        // url:"http://localhost:8887/file/inquireReceiveState",
        url:that.url+":8887/file/inquireReceiveState",
      })
      .then((response)=>{
        // console.log(response);
        that.tableData = response.data;
        console.log(that.tableData[0].transmissProgress);
        this.tableData.forEach(element => {
          var massionId = element.fileId;
          massionId = Math.abs(massionId);//对任务ID取绝对值
          var ipandport = element.ipAndPort;
          var progress = element.transmissProgress;
          //加工进度数据，向下取整
          
          // progress = parseFloat(progress).toFixed(3)*100;
          progress = (progress*100).toFixed(1);
          element.transmissProgress = progress + "%";
          // element.transmissProgress = Math.floor(progress) + "%";
          Object.keys(ipandport).forEach(key=>{
            element.ipAndPort = key;
          })
          element.fileId = massionId;

          //为每一行数据计算丢包率
          const sendPacketNum = element.sendPacketNum;
          const receivePacketNum = element.receivePacketNum;
          const lossProbability = ((sendPacketNum-receivePacketNum)*100/sendPacketNum).toFixed(1);
          element.lossProbability = lossProbability+"%";
        });
      })
      .catch((error)=>{
        console.log(error);
      })
      
    },

    

    startPolling(){
      //在mounted生命周期钩子中调用此方法以开始查询
      this.timer = setInterval(this.queryList,1000);
    },

    stopPolling(){
      //在beforeDestroy生命周期钩子中调用此方法以停止轮询
      if(this.timer){
        clearInterval(this.timer);
      }
    },


    //打开接受文件接口
    receiveFile(){
      let data={
        port:[
            9000
        ],
        // receivepath:"F:\\2test\\"
        receivepath:"/usr/aispace/2test/"
      }
      var that = this;
      this.$axios({
        headers:{
          'Content-Type':'application/json;'
        },
        method:"post",
        // url:"http://localhost:8887/file/receive",
        url:that.url+":8887/file/receive",
        data:JSON.stringify(data),
      })
      .then((response)=>{
        console.log(response);
        console.log("接受文件接口已打开");
      })
      .catch((error)=>{
        console.log(error);
      })
    }
  },

  created(){
    // this.receiveFile();
  },

  mounted(){
      // this.queryList();
      this.startPolling();
  },

  beforeDestroy(){
    this.stopPolling();
  }
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