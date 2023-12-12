<template>
    <!-- element的暗黑模式,需要设置html标签类型为dark-->
      <html class="dark">
        <div class="wrap">
          <div class="dark-select">
            <el-select class="m-2" v-model="value"   placeholder="编码策略选择"  popper-class="blueBack">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                />
            </el-select>
          </div>
        </div>
      </html>
      
        
  </template>
    
  <script lang="ts" setup>
    import { ref } from 'vue'
    
    const value = ref('')
    
    const options = [
      {
        value: 'Option1',
        label: '正常传输(不编码)',
      },
      {
        value: 'Option2',
        label: '智能自适应编码传输',
      },
      {
        value: 'Option3',
        label: '固定编码包传输(包大小128B)',
      },
      {
        value: 'Option4',
        label: '固定编码包传输(包大小256B)',
      },
      {
        value: 'Option5',
        label: '固定编码包传输(包大小512B)',
      },
      {
        value: 'Option6',
        label: '固定编码包传输(包大小1KB)',
      },
      {
        value: 'Option7',
        label: '固定编码包传输(包大小2KB)',
      },
      {
        value: 'Option8',
        label: '固定编码包传输(包大小4KB)',
      },
      {
        value: 'Option9',
        label: '固定编码包传输(包大小8KB)',
      },
      {
        value: 'Option10',
        label: '固定编码包传输(包大小16KB)',
      },
      {
        value: 'Option11',
        label: '固定编码包传输(包大小32KB)',
      },
    ]
  </script>
    
  <style lang="less" >
  
  // .el-select-dropdown {
  //   background: #000;
  // }
  
  
  
  // .dark-select{
  //   // 修改input默认值颜色 兼容其它主流浏览器
  //   input::-webkit-input-placeholder {
  //       color: rgba(255, 255, 255, );
  //   }
  //   input::-moz-input-placeholder {
  //       color: rgba(255, 255, 255, );
  //   }
  //   input::-ms-input-placeholder {
  //       color: rgba(255, 255, 255,);
  //   }
  
  
  //   // // 鼠标悬浮时 input框颜色
  //   // .el-input__inner:hover{
  //   //   background-color: rgba(207, 27, 27, 0.12);
  //   // }
  //   // // input框 右侧的箭头
  //   // .el-select .el-input .el-select__caret {
  //   //       color: rgba(255, 255, 255, 0.50);
  //   // }
    
  //     // // 下拉框垂直滚动条宽度
  //   // .el-scrollbar__bar.is-vertical {
  //   //        width: 10px;
  //   //        top: 2px;
  //   //    }
  //   //   // 下拉框最大高度
  //   // .el-select-dropdown__wrap {
  //   //        max-height: 200px;
  //   // }
  
  // }
  
  // .el-select{
  //   width: 500px;
  
  // }
  
  // // option选项 最外层
  // .el-select-dropdown {
  //       border: none !important;//不起作用
  //       background: rgb(13, 13, 100) !important;
  //       z-index: 9999;
  // }
  // // // option选项 文字样式
  // // .el-select-dropdown__item {
  // //         color: rgba(255, 255, 255, 0.7) !important;
  // //         z-index: 9999;
  // // }
  
  // // option选项 上面的箭头
  // .el-popper[x-placement^="bottom"] .popper__arrow::after {
  //       border-bottom-color: rgba(43, 45, 55, 0.80);
  //       z-index: 9999;
  // }
  // // .popper__arrow {
  // //     border: none !important;//不起作用
  // // }
  
  
  
  
  // //被选择后颜色
  // .el-select-dropdown__item.selected span{
  //         color: rgba(51,176,188) !important;
  //         z-index: 9999;
  // }
  
  
  //   // 移入option选项 样式调整
  // .el-select-dropdown__item.hover{
  //     background-color: rgba(72, 43, 218, 0.8)!important;//加了!important才起作用
  //     color: rgb(66, 184, 238) !important;
  //     z-index: 9999;
  // }
  
  
  </style>