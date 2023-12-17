import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import World from "@/views/World";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        redirect: '/world'
    },
    {
        path: '/manage',
        name: 'manage',
        meta: {
            requireAuth: true
        },
        component: () => import('../views/ManagementView.vue'),
        children: [
            {//中国地图
                path: '/chinaMap',
                name: 'chinaMap',
                component: () => import('../views/TerminalMap.vue')
            },
            {//北工大界面，服务器详情
                path: '/detail',
                name: 'detail',
                component: () => import('../views/TerminalDetail.vue')
            },
            {//北工大界面，任务列表
                path: '/messionList',
                name: 'messionList',
                component: () => import('../views/TerminalList.vue')
            },
            {
                path: '/dockerimage',
                name: 'dockerimage',
                component: () => import('../views/DockerImage.vue')
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
            // {
            //   path: '/vmlist1',
            //   name: 'vmlist1',
            //   component: () => import('../views/VMListRemote1.vue')
            // },
            // {
            //   path: '/vmlist2',
            //   name: 'vmlist2',
            //   component: () => import('../views/VMListRemote2.vue')
            // },
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
            }, {
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
            {
                path: '/world',
                name: 'world',
                component: World,
            },
            {
                path: '/taskTypeManage',
                name: 'taskTypeManage',
                component: () => import('@/views/resourceScheduler/TaskTypeManage.vue')
            },
            {
                path: '/taskManage',
                name: 'taskManage',
                component: () => import('@/views/resourceScheduler/TaskManage.vue')
            },
            {
                path: '/resourceTypeManage',
                name: 'resourceTypeManage',
                component: () => import('@/views/resourceScheduler/ResourceTypeManage.vue')
            },
            {
                path: '/resourceManage',
                name: 'resourceManage',
                component: () => import('@/views/resourceScheduler/ResourceManage.vue')
            },
            {
                path: '/taskLog',
                name: 'taskLog',
                component: () => import ('@/views/resourceScheduler/Log.vue')
            },
            {
                path: '/algorithmScheduler',
                name: 'algorithmScheduler',
                component: () => import ('@/views/resourceScheduler/AlgorithmScheduler.vue')
            },
            {
                path: '/algorithmFile',
                name: 'algorithmFile',
                component: () => import ('@/views/resourceScheduler/AlgorithmFile.vue')
            }
        ]
    },
    {
        path: '/index',
        name: 'index',
        component: () => import('../views/World.vue')
    },
    {
        path: '/map',
        name: 'map',
        component: () => import('../views/Map.vue')
    },
]

const router = new VueRouter({
    routes
})

export default router
