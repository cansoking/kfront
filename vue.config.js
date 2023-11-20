const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 7000,
  },
  lintOnSave: false,
  publicPath: '/static/pages/', // 这个指向的地址就是打包后,html文件引用js文件的路径地址.
})