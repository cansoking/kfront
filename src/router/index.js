import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/podlist'
  },
  {
    path: '/podlist',
    name: 'podlist',
    component: () => import('../views/PodList.vue')
  },
  {
    path: '/deploy',
    name: 'deploy',
    component: () => import('../views/DeployView.vue')
  },
  {
    path: '/vmlist',
    name: 'vmlist',
    component: () => import('../views/VMList.vue')
  },
  {
    path: '/vmcreate',
    name: 'vmcreate',
    component: () => import('../views/VMCreate.vue')
  },
  {
    path: '/template1',
    name: 'template1',
    component: () => import('../views/TemplateView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
