<template>
    <el-button class="Button1" @click = "$emit('custom-click')">接入点配置</el-button>
</template>

<style lang="less">
    .Button1{
        background-color: transparent;
        width: 500px;
        color: white;
        font-weight: 700;
        font-size: 23px;
        font-family: sans-serif;
        height: 40px;
        align-items: center;
        padding:0;//内边距
        margin: 0 0 10px;//下边距
    }
</style>