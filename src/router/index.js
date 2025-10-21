import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    name: 'createVm',
    path: '/createVm',
    component: () => import('@/views/createVM.vue')
  },
  {
    name: 'createVmEnhanced',
    path: '/createVmEnhanced',
    component: () => import('@/views/createVMEnhanced.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
