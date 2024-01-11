import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import '../node_modules/lib-flexible'
import 'element-ui/lib/theme-chalk/index.css'
import * as echarts from "echarts"
import chinaJSON from './assets/china.json'
Vue.use(ElementUI)

Vue.prototype.$axios = axios
Vue.prototype.$ecahrt = echarts
Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
axios.defaults.baseURL = "http://localhost:8080"

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 验证是否需要选择节点
    console.log(to.name);
    let islogin = window.sessionStorage.getItem('islogin');
    console.log(islogin);
    if (islogin) {
      if (to.name === 'world') {
        next()
      } else {
        let nodename = window.sessionStorage.getItem('nodename');
        console.log(nodename);
        if (nodename) { // 查询本地存储信息
          console.log('node ac');
          next();
        } else {
          console.log('node no ac');
          next('/world');
        }
      }
    } else {
      console.log('login no ac');
      next('/login');
    }
  } else {
    console.log("no ac");
    next();
  }
})
