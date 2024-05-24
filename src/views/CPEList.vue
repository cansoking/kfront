<template>
  <body class="listBody">
    <!-- 头部的盒子 -->
    <header class="listHeader">
      <h1>接入点列表</h1>
    </header>
    <!-- 页面主题部分 -->
    <section class="mainbox2">
      <div class="column">
        <!-- 第二列 -->

        <!-- 列表标题 -->
        <BaseTitle data="接入点列表" class="listTitle" />

        <!-- 添加任务按钮 -->
        <BaseButton data="添加节点" class="addButton" :click="addMession" />

        <!-- 表单 -->
        <div class="addForm" v-show="showForm">
          <AddRecord :close="closeForm" :uploadSucceed="uploadSucceed" :uploadFail="uploadFail" :ipandport="ipandport" :eventBus="eventBus"/>
        </div>

        <!-- 列表 -->
        <div class="tb">
          <CPETable :eventBus="eventBus"></CPETable>
        </div>
      </div>
    </section>


    <!-- 新建cpe记录成功对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleSuccess"
      width="30%"
      >
      <span>添加节点成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleSuccess = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 新建cpe记录失败对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleFail"
      width="30%"
      >
      <span>添加节点失败</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleFail = false">确 定</el-button>
      </span>
    </el-dialog>
  </body>
</template>
  
  
  
  
  
  <script>
import BaseTitle from "../components/CPEList/BaseTitle.vue";
import CPETable from "../components/CPEList/CPETable.vue";
import BaseButton from "../components/CPEList/BaseButton.vue";
import AddRecord from "../components/CPEList/AddRecord.vue";
import Vue from 'vue';

export default {
  components: {
    BaseTitle,
    CPETable,
    BaseButton,
    AddRecord,
  },
  data() {
    return {
      //表单是否展示
      showForm: false,


      //上传文件成功对话框显示与否
      dialogVisibleSuccess: false,

      //上传文件失败对话框显示与否
      dialogVisibleFail:false,

      //服务端url
      url : process.env.VUE_APP_API_URI_NOPORT,//服务器地址

      //查询到的未被占用的端口号
      ipandport:"",

      //局部总线
      eventBus:new Vue(),

    };
  },
  methods: {
    //查询最小的可用端口号
    queryPort(){
      var that = this;
      this.$axios({
        method:"post",
        url:that.url+":8887/file/inquireAllCityInfo",
      })
      .then((response)=>{
        var listData = response.data;
        var portList = [];
        var protoAndHost;//存储协议和主机部分，http://...
        listData.forEach(element => {
          var ipandport1 = element.ipandport1;//获取每个cpe节点的ipandport字段
          var portStr = ipandport1.split(':')[2];//将ipandport中的端口号提取出来
          protoAndHost = ipandport1.split(':')[0]+":"+ipandport1.split(':')[1]+":";//把端口号前面的部分保留下来，后面拼接用
          var portNum = parseInt(portStr, 10);//将端口号从字符串类型转为数字类型
          portList.push(portNum);
          
        });

        const occupiedPorts = new Set(portList);//通过Set数据结构存储被占用的端口号
      
        var minPort=1010//用于记录最小端口号
        for(let i=1010;i<=2090;i+=10){//从小到大遍历端口号，知道找到未被占用的最小的端口号
          if(!occupiedPorts.has(i)){
            minPort = i;
            break;
          }
        }

        that.ipandport = protoAndHost + minPort;//字符串拼接
        // console.log(that.ipandport);
      })
      .catch((error)=>{
        console.log(error);
      }) 
    },

    //点击按钮显示表单
    addMession() {
      this.showForm = true;
      this.queryPort();//每次点击创建按钮的时候就会给表单传一个ipandport
    },

    //关闭表单
    closeForm(data) {
      this.showForm = data;
    },
    
    //新建cpe记录成功
    uploadSucceed(){
      this.dialogVisibleSuccess = true;
    },


    //新建cpe记录失败
    uploadFail(){
      this.dialogVisibleFail = true;
    },

  },
};
</script>
  
  
  
  
  
  
  
  
  <style  lang="less">
//css初始化
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

//设置背景
.listBody {
  background: url(../assets/images/bg.jpg) no-repeat top center;
  background-size: cover;
  line-height: 1.15;
}
//头部的盒子
.listHeader {
  // position: relative;
  height: 100px;
  background: url(../assets/images/head_bg.png) no-repeat;
  background-size: 100% 100%;
  h1 {
    font-size: 38px;
    color: #fff;
    text-align: center;
    line-height: 80px;
  }
}
// 页面主体的盒子
.mainbox2 {
  .column {
    position: relative;
    height: 970px;
    width: 87%px;
    //列表标题的位置
    .listTitle {
      position: absolute;
      top: 30px;
      left: 50px;
    }

    .addButton {
      position: absolute;
      top: 30px;
      right: 50px;
    }

    .tb {
      position: absolute;
      top: 70px;
      left: 50px;
      right: 50px;
      border: none;
    }
  }
}

//表单
.addForm {
  position: absolute;
  top: 25%;
  left: 35%;
  border-radius: 15px;
  z-index: 1; //让表单显示在上面
}
</style>