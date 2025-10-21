import { defineStore } from 'pinia'
export const test4 = defineStore({
  id: 'test4',
  state: () => ({
    region: '',
    scenario: 'all',
    productId: '',
    planId: '',
    addEvs: false,
    addHss: false,
    addCbr: false,
    period: { value: 1, unit: 'month' },
    amount: 1
  }),
  getters: {},
  actions: {}
})
