<!--
 * @Description: 页面按钮
-->
<template>
  <el-button
    type="primary"
    class="base-button-primary"
    :loading="loading"
    size="mini"
    v-if="props.type == 'primary'"
    @click="click"
    >{{ data }}
  </el-button>
  <el-button @click="click" :loading="loading" class="base-button-default" v-else>{{
    data
  }}</el-button>
</template>
<script setup>
const props = defineProps({
  data: {
    type: String,
    default: "按钮",
  },
  type: {
    type: String,
    default: "primary", //primary-蓝色主题  default:白色主题
  },
  loading: {
    type: Boolean,
    default: false, //是否处于加载中
  },
  click: {
    type: Function,
  },
});
</script>
<style lang="less" scoped>
.base-button-primary {
  // box-shadow: 0 4px 14px 0 #5ea2ef;
  // background: #0072f5;
  background: transparent;
  border-radius: 5px;
  // padding: 0 25px;
  border-color: #004080;
  border-width: 3px;
}
.base-button-default {
  border-radius: 16px;
  padding: 0 25px;
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.3);
}
</style>
