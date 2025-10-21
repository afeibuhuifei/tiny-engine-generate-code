import { defineStore } from 'pinia'
export const test3 = defineStore({
  id: 'test3',
  state: () => ({ name1: 'xxx' }),
  getters: { count: function count() {} },
  actions: { actions: function actions() {} }
})
