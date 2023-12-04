import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)

Vue.prototype.$axios = axios

Vue.config.productionTip = true

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) { // 验证是否需要选择节点
    var nodename = window.sessionStorage.getItem('nodename');
    console.log(nodename)
    if (nodename) { // 查询本地存储信息
      next();
    } else {
      next('/index');
    }
  } else {
    next();
  }
})
