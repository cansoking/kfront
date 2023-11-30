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
    path: '/podindex',
    name: 'podindex',
    component: () => import('../views/PodIndexView.vue')
  },
  {
    path: '/nodeindex',
    name: 'nodeindex',
    component: () => import('../views/NodeIndexView.vue')
  },
  {
    path: '/minfo',
    name: 'minfo',
    component: () => import('../views/MachineInfo.vue')
  },
  {
    path: '/deploy',
    name: 'deploy',
    component: () => import('../views/DeployView.vue')
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
    path: '/vmlist1',
    name: 'vmlist1',
    component: () => import('../views/VMListRemote1.vue')
  },
  {
    path: '/vmlist2',
    name: 'vmlist2',
    component: () => import('../views/VMListRemote2.vue')
  },
  {
    path: '/vmcreate',
    name: 'vmcreate',
    component: () => import('../views/VMCreate.vue')
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
    path: '/appimage',
    name: 'appimage',
    component: () => import('../views/AppImage.vue')
  },
  {
    path: '/applist',
    name: 'applist',
    component: () => import('../views/AppList.vue')
  },
  {
    path: '/infointer',
    name: 'infointer',
    component: () => import('../views/InfoInter.vue')
  },
  {
    path: '/infodec',
    name: 'infodec',
    component: () => import('../views/InfoDec.vue')
  },
  {
    path: '/inforecv',
    name: 'inforecv',
    component: () => import('../views/InfoRecv.vue')
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
  {
    path: '/webssh',
    name: 'webssh',
    component: () => import('../views/WebSSH.vue')
  },
  {
    path: '/machineinfo',
    name: 'machineinfo',
    component: () => import('../views/MachineInfo.vue')
  },
  {
    path: '/vminfo',
    name: 'vminfo',
    component: () => import('../views/VMIndexView.vue')
  },

]

const router = new VueRouter({
  routes
})

export default router
