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
        <el-form-item label="源节点" class="input">
          <el-input size="mini" v-model="record.snode" type="text" />
        </el-form-item>
        <el-form-item label="传输文件" class="input">
          <el-input size="mini" v-model="record.file" />
        </el-form-item>
        <el-form-item label="目的节点" class="input">
          <el-input size="mini" v-model="record.enode" />
        </el-form-item>
        <el-form-item label="传输策略">
          <el-select size="mini" v-model="record.transmitStrategy" class="select">
            <el-option label="高轨优先" value="shanghai" />
            <el-option label="低轨优先" value="shanghai" />
            <el-option label="运营商优先" value="shanghai" />
            <el-option label="智能多路径传输" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="编码策略">
          <el-select size="mini" v-model="record.encodeStrategy" class="select">
            <el-option label="正常传输（不编码）" value="shanghai" />
            <el-option label="智能自适应编码传输" value="shanghai" />
            <el-option label="固定编码包传输（包大小128B）" value="shanghai" />
            <el-option label="固定编码包传输（包大小256B）" value="shanghai" />
            <el-option label="固定编码包传输（包大小512B）" value="shanghai" />
            <el-option label="固定编码包传输（包大小1KB）" value="shanghai" />
            <el-option label="固定编码包传输（包大小2KB）" value="shanghai" />
            <el-option label="固定编码包传输（包大小4KB）" value="shanghai" />
          </el-select>
        </el-form-item>
        <el-form-item class="button">
          <el-button class="button1" @click="close(false)"> 创建 </el-button>
          <el-button class="button2" @click="close(false)">取消</el-button>
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
        snode: "",
        file: "",
        enode: "",
        transmitStrategy: "",
        encodeStrategy: "",
      }),
    };
  },
  props: {
    close: Function,
  },

  methods: {},
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

.addRecordForm .el-form-item {
  position: absolute;
  left: 50px;
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

.addRecordForm .button {
  position: absolute;
  left: 0px;
  top: 400px;
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
</style>
