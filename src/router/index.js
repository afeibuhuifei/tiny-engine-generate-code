import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/',
    children: [
      {
        name: '1',
        path: 'createVm',
        component: () => import('@/views/createVM.vue'),
        children: []
      }
    ]
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
