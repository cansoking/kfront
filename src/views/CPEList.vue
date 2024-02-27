<template>
  <body class="listBody">
    <!-- 头部的盒子 -->
    <header class="listHeader">
      <h1>CPE管理分系统</h1>
    </header>
    <!-- 页面主题部分 -->
    <section class="mainbox2">
      <div class="column">
        <!-- 第二列 -->

        <!-- 列表标题 -->
        <BaseTitle data="CPE列表" class="listTitle" />

        <!-- 添加任务按钮 -->
        <BaseButton data="添加节点" class="addButton" :click="addMession" />

        <!-- 表单 -->
        <div class="addForm" v-show="showForm">
          <AddRecord :close="closeForm" :uploadSucceed="uploadSucceed" :uploadFail="uploadFail"/>
        </div>

        <!-- 列表 -->
        <div class="tb">
          <CPETable></CPETable>
        </div>
      </div>
    </section>


    <!-- 上传文件成功对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleSuccess"
      width="30%"
      :before-close="handleClose">
      <span>上传成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisibleSuccess = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 上传文件失败对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisibleFail"
      width="30%"
      :before-close="handleClose">
      <span>上传失败</span>
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
    };
  },
  methods: {
    //点击按钮显示表单
    addMession() {
      this.showForm = true;
    },

    //关闭表单
    closeForm(data) {
      this.showForm = data;
    },
    
    //上传文件成功
    uploadSucceed(){
      this.dialogVisibleSuccess = true;
    },


    //上传文件失败
    uploadFail(){
      this.dialogVisibleFail = true;
    }
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