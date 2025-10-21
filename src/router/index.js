import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/createVm'
  },
  {
    name: 'createVm',
    path: '/createVm',
    component: () => import('@/views/createVM.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
