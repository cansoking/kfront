<template>
  <div>
    <div class="addRecordBackground"></div>
    <div class="addRecordTitle">添加CPE列表</div>
    <div>
      <el-form
        class="addRecordForm"
        :label-position="labelPosition"
        label-width="100px"
        :model="record"
        style="max-width: 460px"
        :rules="rules"
        ref = "record"
      >


        
        <el-form-item label="接入点名称" class="input" prop="node_name">
          <el-input size="mini" v-model="record.node_name" type="text" placeholder="请输入接入点名称"/>
        </el-form-item>
        <el-form-item label="接入点位置" prop="node_location">
          <el-input size="mini" v-model="record.node_location" placeholder="请输入接入点位置">
          </el-input>
        </el-form-item>
        <el-form-item label="GPS" prop="node_gps">
          <el-input size="mini" v-model="record.node_gps" placeholder="格式为：39°54′24″N 116°23′51″E">
          </el-input>
        </el-form-item>
        <el-form-item label="部署状态">
          <el-select size="mini" v-model="record.deploy_state" class="select" popper-class="child">
            <el-option label="已部署" value="已部署" />
            <el-option label="未部署" value="未部署" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP和端口号">
          <el-input size="mini" v-model="record.node_ip_and_port" readonly>
          </el-input>
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

    //表单GPS项的验证
    var validateGPS=(rule, value, cb) =>{
      const reg = /^[0-9]{1,2}°[0-9]{1,2}′[0-9]{1,2}″[NS]\s[0-9]{1,3}°[0-9]{1,2}′[0-9]{1,2}″[EW]$/;
      if (reg.test(value)) {
        cb();
      } else {
        cb(new Error('请输入正确的GPS格式'));
      }
    };

    

    return {
      // record: reactive({
      //   node_name:"",
      //   node_location:"",
      //   node_gps:"",
      //   deploy_state:"",  
      //   node_ip_and_port:"",     
      // }),

      record: {
        node_name:"",
        node_location:"",
        node_gps:"",
        deploy_state:"已部署",  
        node_ip_and_port:"",     
      },
      

      
      //表单规则
      rules:{
        node_name:[
          { required: true, message: '请输入接入点名称', trigger: 'blur' },
        ],
        node_location:[
          { required: true, message: '请输入接入点位置', trigger: 'blur' },
        ],
        node_gps: [
          { required: true, message: '请输入坐标', trigger: 'blur' },
          { 
            validator: validateGPS, 
            trigger: 'blur' 
          }
        ]
      },

      

      

      //上传文件
      fileList:[],

      url : process.env.VUE_APP_API_URI_NOPORT,//服务器地址
    };
  },
  props: {
    close: Function,
    uploadSucceed:Function,
    uploadFail:Function,
    ipandport:String,
    eventBus:Object,
  },
  

  watch:{
    ipandport(newVal){
      this.record.node_ip_and_port = newVal;//监听父组件传来的新的ipandPort，并赋值给node_ip_and_port
    }
  },

  methods: {
    
    
    //提交表单
    commit(){ 
      this.$refs["record"].validate((valid) => {
          if (valid) {
            console.log('submit!!');
            let data = {
              "name":this.record.node_name,
              "position":this.record.node_location,
              "deploy":this.record.deploy_state,
              "GPS":this.record.node_gps,
              "ipAndPort":this.record.node_ip_and_port
            }
            const _this = this;
            this.$axios({
              method:"post",
              headers:{
                'Content-Type':'application/json;'
              },
              data:JSON.stringify(data),
              url:_this.url+":8887/file/insertCPE",
            })
            .then((response)=>{
              console.log("发送成功");
              console.log(response);
              //需要成功对话框
              _this.uploadSucceed();
              //提交成功需要关闭表单,并清空表单数据
              _this.close(false);
              _this.clearForm();
              _this.eventBus.$emit('addCPE',1);
            })
            .catch((error)=>{
              console.log(error);
              console.log("失败");
              //需要失败对话框
              _this.uploadFail();
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      
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
      this.record.node_gps = "";
      this.record.deploy_state = "已部署";
      // this.record.node_ip_and_port= "";
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


.addRecordForm .el-form-item__error{
  width:max-content;
  top:35px;
  left: -15px;
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
