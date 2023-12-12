<template>
  <!-- element的暗黑模式,需要设置html标签类型为dark-->
  <html class="dark">
    <div class="wrap">
      <div class="dark-select">
        <el-select
          class="m-2"
          v-model="value"
          placeholder="传输策略选择"
          popper-class="blueBack"
        >
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
import { ref } from "vue";

const value = ref("");

const options = [
  {
    value: "Option1",
    label: "高轨优先",
  },
  {
    value: "Option2",
    label: "低轨优先",
  },
  {
    value: "Option3",
    label: "运营商网络优先",
  },
  {
    value: "Option4",
    label: "智能多路径传输",
  },
];
</script>
  
<style lang="less">
//注意！！！
//注意！！！
//注意！！！
//Select1和Select2使用的是同一个类名，所以样式的改变是互通的

// .el-select-dropdown {
//   background: #000;
// }

.dark {
  //设置Select下边距
  margin: 0 0 10px;

  //select选择器宽度
  .el-select {
    width: 500px;
  }
}

.blueBack {
  .el-select-dropdown__list {
    border: none !important; //不起作用
    background: rgb(13, 13, 100) !important;
    z-index: 9999;
  }
  .el-select-dropdown__item {
    font-size: 17px; /* 设置字体大小 */
    font-weight: 500;
    font-family: sans-serif;
    color: rgba(255, 255, 255, 0.7) !important;
    z-index: 9999;
  }
}

//blueBack是我设置的select下拉框的类名，这样可以不用样式穿透也能防止样式污染
.blueBack .el-select-dropdown {
  border: none !important; //不起作用
  background: rgb(13, 13, 100) !important;
  z-index: 9999;
}

.blueBack .el-select-dropdown .el-select-dropdown__item {
  font-size: 17px; /* 设置字体大小 */
  font-weight: 500;
  font-family: sans-serif;
  color: rgba(255, 255, 255, 0.7) !important;
  z-index: 9999;
}

// ok
// // option选项 文字样式
// .el-select-dropdown__item {
//   color: rgba(255, 255, 255,0.7 ) !important;
//   z-index: 9999;
// }

.dark-select {
  // 修改input默认值颜色 兼容其它主流浏览器
  input::-webkit-input-placeholder {
    color: rgba(255, 255, 255);
  }
  input::-moz-input-placeholder {
    color: rgba(255, 255, 255);
  }
  input::-ms-input-placeholder {
    color: rgba(255, 255, 255);
  }

  //   // 鼠标悬浮时 input框颜色
  //   .el-input__inner:hover{
  //     background-color: rgba(207, 27, 27, 0.12);
  //   }
  //   // input框 右侧的箭头
  //   .el-select .el-input .el-select__caret {
  //         color: rgba(255, 255, 255, 0.50);
  //   }

  // 	// 下拉框垂直滚动条宽度
  //   .el-scrollbar__bar.is-vertical {
  //          width: 10px;
  //          top: 2px;
  //      }
  //     // 下拉框最大高度
  //   .el-select-dropdown__wrap {
  //          max-height: 200px;
  //   }
}

// option选项 上面的箭头
// .el-popper[x-placement^="bottom"] .popper__arrow::after {
//       border-bottom-color: rgba(43, 45, 55, 0.80);
//       z-index: 9999;
// }

// .popper__arrow {
//     border: none !important;//不起作用
// }

//被选择后颜色
.el-select-dropdown__item.selected span {
  color: rgba(51, 176, 188) !important;
  z-index: 9999;
}

// 移入option选项 样式调整
.blueBack .el-select-dropdown__item.hover {
  background-color: rgba(72, 43, 218, 0.8) !important; //加了!important才起作用
  color: rgb(66, 184, 238) !important;
  z-index: 9999;
}

.m-2 {
  .el-input__inner {
    //输入框样式调整
    font-size: 23px;
    height: 40px;
    font-weight: 700;
    font-family: sans-serif;
    color: white; //被选择后的文字颜色
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>