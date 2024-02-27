<template>
  <div>
    <div class="addRecordBackground"></div>
    <div class="addRecordTitle">新建测试任务</div>
    <div>
      <el-form
        class="addRecordForm"
        :label-position="labelPosition"
        label-width="100px"
        :model="record"
        style="max-width: 460px"
      >


        
        <el-form-item label="节点名称" class="input">
          <el-input size="mini" v-model="record.node_name" type="text" />
        </el-form-item>
        <el-form-item label="节点位置">
          <el-input size="mini" v-model="record.node_location">
          </el-input>
        </el-form-item>
        <el-form-item label="部署状态">
          <el-select size="mini" v-model="record.deploy_state" class="select" popper-class="child">
            <el-option label="已部署" value="highOrbit" />
            <el-option label="未部署" value="lowOrbit" />
          </el-select>
        </el-form-item>
        

        <el-form-item class="button">
          <el-button class="button1" @click="commit()"> 创建 </el-button>
          <el-button class="button2" @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>



    


  </div>
</template>


<script>
import { reactive, ref } from "vue";

export default {
  data() {
    return {
      record: reactive({
        node_name:"",
        node_location:"",
        deploy_state:"",       
      }),

      //上传文件
      fileList:[],

      url : "http://59.110.238.62",//服务器地址
    };
  },
  props: {
    close: Function,
    uploadSucceed:Function,
    uploadFail:Function,
  },

  methods: {
    // //覆盖默认的上传行为，自定义上传的实现，将上传的文件依次添加到fileList数组中
    // httpRequest(param){
    //   //将上传的文件加到fileList中
    //   this.fileList.push(param.file);
    // },

    // handleRemove(file, fileList) {
    //     console.log(file, fileList);

    //     //用删除文件后的列表代替旧列表，做到实际上删除文件，否则旧文件依旧存储在fileList中
    //     this.fileList = fileList;
    // },
    // handlePreview(file) {
    //   console.log(file);
    // },
    // handleExceed(files, fileList) {
    //   this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    // },
    // beforeRemove(file, fileList) {
    //   return this.$confirm(`确定移除 ${ file.name }？`);
    // },

    //提交表单
    commit(){ 
      //获取输入的文件名和文件路径并加到表单
      var path = this.record.filename;
      var pos = path.lastIndexOf('/');
      var fileName = path.substr(pos+1);
      var filePath = path.substr(0,pos+1);
      
      let data = {
        encodePackageSize:30000,
        clientFilePath:filePath,
        fileName:[fileName],
        ipAndPortInfoSend:[
            {
                ip:"127.0.0.1",
                // ip:"59.110.238.62",
                port:9000,
                probability:1.0
            }
        ],
        maxRate:2097152
      }

      console.log(filePath);
      console.log(fileName);
      

      const _this = this;
      this.$axios({
        method:"post",
        headers:{
          'Content-Type':'application/json;'
        },
        data:JSON.stringify(data),

        // url:"http://localhost:9000/file/send",
        url:_this.url+":9000/file/send",
      })
      .then((response)=>{
        console.log("发送成功");
        console.log(response);
        //需要成功对话框
        _this.uploadSucceed();
        //提交成功需要关闭表单,并清空表单数据
        _this.close(false);
        _this.clearForm();

      })
      .catch((error)=>{
        console.log(error);
        console.log("失败");
        //需要失败对话框
        _this.uploadFail();
      })
    },

    //取消提交
    cancel(){
      this.close();
      this.clearForm();
    },

    //清空表单
    clearForm(){
      this.record.node_name = "";
      this.record.node_location = "";
      this.record.deploy_state = "";
    },

    
  },
};
</script>


<style lang="less">
//表单标题
.addRecordTitle {
  width: 150px;
  text-align: center;
  position: absolute;
  top: 7%;
  left: 50%;
  margin-left: -75px;
  color: white;
  font-size: 24px;
  z-index: 1; //让标题显示在表单上
}

//element组件
.addRecordForm {
  background: url(../../assets/images/formBg.png) center top;
  background-size: 100% 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50px;
  width: 800px;
  height: 500px;
  padding: 0;
  left: 0px;
}

//表单label颜色
.addRecordForm .el-form-item__label {
  position: absolute;
  color: white;
  font-size: 15px;
  display: block;
  left: -30px;
}

//表单元素位置
.addRecordForm .el-form-item {
  position: absolute;
  left: 40px;
}
.addRecordForm .el-form-item:nth-child(1) {
  top: 100px;
}
.addRecordForm .el-form-item:nth-child(2) {
  top: 150px;
}
.addRecordForm .el-form-item:nth-child(3) {
  top: 200px;
}
.addRecordForm .el-form-item:nth-child(4) {
  top: 250px;
}
.addRecordForm .el-form-item:nth-child(5) {
  top: 300px;
}

// .addRecordForm .input{
//   left:0px;
//   width: 320px;

// }

.addRecordForm .el-input {
  position: absolute;
  width: 300px;
  top: 0px;
  left: -20px;
}

.addRecordForm .el-input__inner {
  color: white;
}

//输入框的背景颜色
.addRecordForm .el-input__wrapper {
  background-color: rgba(0, 0, 0, 0.5);
}

.addRecordForm {
  .el-input__inner {
    background-color: rgba(0, 0, 0, 0.5);
  }
}


.addRecordForm .select {
  // width: 335px;
  top: -23px;
}

.child .el-select-dropdown__item.hover {
  background-color: rgba(72, 43, 218, 0.8) !important; //加了!important才起作用
  color: rgb(66, 184, 238) !important;
  z-index: 9999;
}

.child{
  width: 300px;
}



.addRecordForm .button {
  position: absolute;
  left: 0px;
  top: 410px;
  width: auto;
}

.addRecordForm .button1 {
  position: absolute;
  background-color: transparent;
  border-color: #00ccff;
  color: #00ccff;
  width: 100px;
  left: 10px;
}

.addRecordForm .button2 {
  position: absolute;
  background-color: transparent;
  border-color: white;
  color: white;
  width: 100px;
  left: 140px;
}


.addRecordForm .upload-demo{
  position: absolute;
  width: 300px;
  left: -20px;
}

.addRecordForm .el-upload__tip{
  position: absolute;
  margin-top: 0px;
}

.addRecordForm .el-upload-list{
  position: absolute;
  margin-top: 25px;
}
</style>
