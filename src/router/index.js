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
  },
  {
    path: '/podlog',
    name: 'podlog',
    component: () => import('../views/PodLogList.vue')
  },
  {
    path: '/loglist',
    name: 'loglist',
    component: () => import('../views/LogList.vue')
  },
  {
    path: '/vmimalist',
    name: 'vmimalist',
    component: () => import('../views/VMImageView.vue')
  },
  {
    path: '/vmtemlist',
    name: 'vmtemlist',
    component: () => import('../views/VMTemplateView.vue')
  },{
    path: '/loglist',
    name: 'loglist',
    component: () => import('../views/LogList.vue')
  },
  {
    path: '/imagelist',
    name: 'imagelist',
    component: () => import('../views/ImageList.vue')
  },
  {
    path: '/pervolume',
    name: 'pervolume',
    component: () => import('../views/PerVolumeView.vue')
  },
  {
    path: '/vmlog',
    name: 'vmlog',
    component: () => import('../views/VMLogList.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
