<template>
  <div>
    <div class="addRecordBackground"></div>
    <div class="addRecordTitle">新建测试任务</div>
    <div>
      <el-form
        class="addRecordForm"
        :label-position="labelPosition"
        label-width="110px"
        :model="record"
        style="max-width: 460px"
      >


        <el-form-item label="源节点">
          <el-select size="mini" v-model="record.snode" class="select" popper-class="child">
            <el-option label="云服务器" value="aliyun" />
            <el-option label="北京终端" value="beijing" />
            <el-option label="海南终端" value="hainan" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="源节点" class="input">
          <el-input size="mini" v-model="record.snode" type="text" />
        </el-form-item> -->
        <!-- <el-form-item label="选取文件">
          <el-input size="mini" v-model="record.file" placeholder="请选择文件">
            
          </el-input>
        </el-form-item> -->
        <el-form-item label="目的节点">
          <el-select size="mini" v-model="record.enode" class="select" popper-class="child">
            
            <el-option label="云服务器" value="aliyun" />
            <el-option label="北京终端" value="beijing" />
            <el-option label="海南终端" value="hainan" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="目的节点" class="input">
          <el-input size="mini" v-model="record.enode" />
        </el-form-item> -->
        <!-- <el-form-item label="传输策略">
          <el-select size="mini" v-model="record.transmitStrategy" class="select" popper-class="child">
            <el-option label="高轨优先" value="highOrbit" />
            <el-option label="低轨优先" value="lowOrbit" />
            <el-option label="运营商优先" value="operator" />
            <el-option label="智能多路径传输" value="multiPath" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="编码策略">
          <el-select size="mini" v-model="record.encodeStrategy" class="select" popper-class="child">
            <el-option label="智能自适应编码传输" value="zhineng" />
            <el-option label="固定编码包传输（包大小128B）" value="128B" />
            <el-option label="固定编码包传输（包大小256B）" value="256B" />
            <el-option label="固定编码包传输（包大小512B）" value="512B" />
            <el-option label="固定编码包传输（包大小1KB）" value="1KB" />
            <el-option label="固定编码包传输（包大小2KB）" value="2KB" />
            <el-option label="固定编码包传输（包大小4KB）" value="4KB" />
            <el-option label="固定编码包传输（包大小8KB）" value="8KB" />
            <el-option label="固定编码包传输（包大小16KB）" value="16KB" />
            <el-option label="固定编码包传输（包大小32KB）" value="32KB" />
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="上传文件">
          <el-upload
            class="upload-demo"
            action
            :http-request="httpRequest"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"

            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">单次只能上传一个文件</div>
          </el-upload>
        </el-form-item> -->

        <!-- <el-form-item label="文件路径" class="input">
          <el-input size="mini" v-model="record.filePath" type="text" placeholder="请输入文件地址"/>
        </el-form-item> -->

        <el-form-item label="传输流量上限">
          <el-select size="mini" v-model="record.rateLimit" class="select" popper-class="child">
            <el-option label="50KB/s" value=51200 />
            <el-option label="100KB/s" value="102400" />
            <el-option label="200KB/s" value="204800" />
            <el-option label="500KB/s" value="512000" />
            <el-option label="1MB/s" value="1048576" />
            <el-option label="2MB/s" value="2097152" />
          </el-select>
        </el-form-item>


        <el-form-item label="选择发送文件">
          <el-select size="mini" v-model="record.filePath" class="select" popper-class="child">
            <el-option label="1.pdf" value="F:\\1test\\1.pdf" />
            <el-option label="2.rar" value="F:\\1test\\2.rar" />
            <el-option label="3.flac" value="F:\\1test\\3.flac" />
            <el-option label="4.rar" value="F:\\1test\\4.rar" />
            <el-option label="5.mp4" value="F:\\1test\\5.mp4" />
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
        snode: "beijing",
        enode: "aliyun",
        transmitStrategy: "",
        encodeStrategy: "zhineng",
        rateLimit:"1048576",
        filePath:"",
      }),

      //上传文件
      fileList:[],

      // 默认编码大小
      encodeSize:30000,

      url : process.env.VUE_APP_API_URI_NOPORT,//服务器地址
      url_send:process.env.VUE_APP_API_URI_SEND,//发送接口地址
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


    //将选择得到的value字符串转为数字
    getEncodeSize(){
      switch (this.record.encodeStrategy) {
        case "zhineng":
          this.encodeSize = 24576;
          break;
        case "128B":
          this.encodeSize = 128;
          break;
        case "256B":
          this.encodeSize = 256;
          break;
        case "512B":
          this.encodeSize = 512;
          break;
        case "1KB":
          this.encodeSize = 1024;
          break;
        case "2KB":
          this.encodeSize = 2048;
          break;
        case "4KB":
          this.encodeSize = 4096;
          break;
        case "8KB":
          this.encodeSize = 8192;
          break;
        case "16KB":
          this.encodeSize = 16384;
          break;
        case "32KB":
         this.encodeSize = 30000;
          break;
        
      }
    },

    //提交表单
    commit(){ 
      //获取输入的文件名和文件路径并加到表单
      var path = this.record.filePath;
      var pos = path.lastIndexOf('\\');//windows上文件用这条
      // var pos = path.lastIndexOf('/');//linux上文件用这条
      var fileName = path.substr(pos+1);
      var filePath = path.substr(0,pos+1);
      var rateLimit = Number(this.record.rateLimit);
      this.getEncodeSize();//获取编码策略
      
      //调用本地发送接口时的参数
      let data = {
        encodePackageSize:this.encodeSize,
        clientFilePath:filePath,
        fileName:[fileName],
        ipAndPortInfoSend:[
            {
                // ip:"127.0.0.1",
                ip:"192.168.192.182",//阿里云虚拟IP
                port:9000,
                probability:1.0
            }
        ],
        maxRate:rateLimit
      }

      // //调用服务器上发送接口时的参数
      // let data = {
      //   encodePackageSize:30000,
      //   clientFilePath:filePath,
      //   fileName:[fileName],
      //   ipAndPortInfoSend:[
      //       {
      //           ip:"127.0.0.1",
      //           // ip:"59.110.238.62",
      //           port:9000,
      //           probability:1.0
      //       }
      //   ],
      //   maxRate:2097152
      // }

      console.log(filePath);
      console.log(fileName);
      console.log(this.encodeSize);
      

      const _this = this;
      this.$axios({
        method:"post",
        headers:{
          'Content-Type':'application/json;'
        },
        data:JSON.stringify(data),

        url:_this.url_send+"/file/send",
        // url:"http://59.110.238.62:8080/file/send"
        // url:"http://192.168.192.243:9000/file/send",//本地ZeroTire虚拟IP
        // url:"http://localhost:9000/file/send",
        // url:_this.url+":9000/file/send",//暂时使用本地的发送接口
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
      this.record.snode = "beijing";
      this.record.enode = "aliyun";
      this.record.transmitStrategy = "";
      this.record.encodeStrategy = "zhineng";
      this.record.rateLimit = "1048576",
      this.record.filePath = "";
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
  width:1000px;
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
