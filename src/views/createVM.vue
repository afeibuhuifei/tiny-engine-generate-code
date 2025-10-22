<template>
  <div>
    <!-- 错误提示 -->
    <div v-if="errorMessage" style="margin-bottom: 10px; padding: 10px; background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 4px; color: #dc2626;">
      {{ errorMessage }}
      <button @click="clearError" style="float: right; background: none; border: none; cursor: pointer;">✕</button>
    </div>

    <!-- 成功提示 -->
    <div v-if="successMessage" style="margin-bottom: 10px; padding: 10px; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 4px; color: #16a34a;">
      {{ successMessage }}
      <button @click="clearSuccess" style="float: right; background: none; border: none; cursor: pointer;">✕</button>
    </div>

    <div style="padding-bottom: 10px; padding-top: 10px">
      <tiny-time-line
        :active="currentStep.toString()"
        :horizontal="true"
        style="border-radius: 0px"
        :data="[{ name: '基础配置' }, { name: '网络配置' }, { name: '高级配置' }, { name: '确认配置' }]"
      ></tiny-time-line>
    </div>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        border-color: #fff;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        background-color: #fff;
        margin-bottom: 10px;
      "
    >
      <tiny-form
        labelWidth="80px"
        labelPosition="top"
        :inline="false"
        label-position="left "
        label-width="150px"
        style="border-radius: 0px"
      >
        <tiny-form-item label="计费模式">
          <tiny-button-group
            v-model="formData.billingMode"
            :data="[
              { text: '包年/包月', value: '1' },
              { text: '按需计费', value: '2' }
            ]"
            @change="onBillingModeChange"
          ></tiny-button-group
        ></tiny-form-item>
        <tiny-form-item label="区域">
          <tiny-button-group
            v-model="formData.region"
            style="border-radius: 0px; margin-right: 10px"
            :data="regionOptions"
            @change="onRegionChange"
          ></tiny-button-group>
          <span style="background-color: [object Event]; color: #8a8e99; font-size: 12px"
            >温馨提示：页面左上角切换区域</span
          >
          <span style="display: block; color: #8a8e99; border-radius: 0px; font-size: 12px"
            >不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络时延，提高访问速度</span
          ></tiny-form-item
        >
        <tiny-form-item label="可用区" style="border-radius: 0px">
          <tiny-button-group
            v-model="formData.availabilityZone"
            :data="availabilityZoneOptions"
            @change="onAvailabilityZoneChange"
          ></tiny-button-group></tiny-form-item
      >
      ></tiny-form>
    </div>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        border-color: #fff;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        background-color: #fff;
        margin-bottom: 10px;
      "
    >
      <tiny-form
        labelWidth="80px"
        labelPosition="top"
        :inline="false"
        label-position="left "
        label-width="150px"
        style="border-radius: 0px"
      >
        <tiny-form-item label="CPU架构">
          <tiny-button-group
            v-model="formData.cpuArchitecture"
            :data="[
              { text: 'x86计算', value: '1' },
              { text: '鲲鹏计算', value: '2' }
            ]"
            @change="onCpuArchitectureChange"
          ></tiny-button-group
        ></tiny-form-item>
        <tiny-form-item label="区域">
          <div style="display: flex; justify-content: flex-start; align-items: center">
            <div style="display: flex; align-items: center; margin-right: 10px">
              <span style="width: 80px">vCPUs</span>
              <tiny-select
                v-model="formData.vcpuCount"
                placeholder="请选择"
                :options="vcpuOptions"
                @change="onVcpuChange"
              ></tiny-select>
            </div>
            <div style="display: flex; align-items: center; margin-right: 10px">
              <span style="width: 80px; border-radius: 0px">内存</span>
              <tiny-select
                v-model="formData.memorySize"
                placeholder="请选择"
                :options="memoryOptions"
                @change="onMemoryChange"
              ></tiny-select>
            </div>
            <div style="display: flex; align-items: center">
              <span style="width: 80px">规格名称</span>
              <tiny-search modelValue="" placeholder="输入关键词"></tiny-search>
            </div>
          </div>
          <div style="border-radius: 0px">
            <tiny-button-group
              v-model="formData.instanceType"
              style="border-radius: 0px; margin-top: 12px"
              :data="[
                { text: '通用计算型', value: '1' },
                { text: '通用计算增强型', value: '2' },
                { text: '内存优化型', value: '3' },
                { text: '磁盘增强型', value: '5' },
                { text: '超高I/O型', value: '6' },
                { text: 'GPU加速型', value: '7' }
              ]"
              @change="onInstanceTypeChange"
            ></tiny-button-group>
            <tiny-grid
              style="margin-top: 12px; border-radius: 0px"
              :auto-resize="true"
              :editConfig="{ trigger: 'click', mode: 'cell', showStatus: true }"
              :columns="[
                { type: 'radio', width: 60 },
                { field: 'employees', title: '规格名称' },
                { field: 'created_date', title: 'vCPUs | 内存(GiB)', sortable: true },
                { field: 'city', title: 'CPU', sortable: true },
                { title: '基准 / 最大带宽	', sortable: true },
                { title: '内网收发包', sortable: true }
              ]"
              :data="instanceData"
              @radio-change="onInstanceSelect"
            ></tiny-grid>
            <div style="margin-top: 12px; border-radius: 0px">
              <span style="width: 150px; display: inline-block">当前规格</span>
              <span style="font-weight: 700">通用计算型 | Si2.large.2 | 2vCPUs | 4 GiB</span>
            </div>
          </div></tiny-form-item
        ></tiny-form
      >
    </div>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        border-color: #fff;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        background-color: #fff;
        margin-bottom: 10px;
      "
    >
      <tiny-form
        labelWidth="80px"
        labelPosition="top"
        :inline="false"
        label-position="left "
        label-width="150px"
        style="border-radius: 0px"
      >
        <tiny-form-item label="镜像" style="border-radius: 0px">
          <tiny-button-group
            v-model="formData.imageType"
            :data="imageTypeOptions"
            @change="onImageTypeChange"
          ></tiny-button-group>
          <div style="display: flex; margin-top: 12px; border-radius: 0px">
            <tiny-select
              v-model="formData.imageId"
              placeholder="请选择操作系统"
              style="width: 170px; margin-right: 10px"
              :options="[
                { value: 'centos7', label: 'CentOS' },
                { value: 'ubuntu20', label: 'Ubuntu' },
                { value: 'windows2019', label: 'Windows' }
              ]"
              @change="onImageChange"
            ></tiny-select>
            <tiny-select
              modelValue=""
              placeholder="请选择版本"
              style="width: 340px"
              :options="[
                { value: '1', label: '7.9 64位' },
                { value: '2', label: '20.04 64位' }
              ]"
            ></tiny-select>
          </div>
          <div style="margin-top: 12px">
            <span style="color: #e37d29">请注意操作系统的语言类型。</span>
          </div></tiny-form-item
        ></tiny-form
      >
    </div>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-radius: 4px;
        border-color: #fff;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        background-color: #fff;
        margin-bottom: 10px;
      "
    >
      <tiny-form
        labelWidth="80px"
        labelPosition="top"
        :inline="false"
        label-position="left "
        label-width="150px"
        style="border-radius: 0px"
      >
        <tiny-form-item label="系统盘" style="border-radius: 0px">
          <div style="display: flex">
            <tiny-select
              v-model="formData.systemDiskType"
              placeholder="请选择"
              style="width: 200px; margin-right: 10px"
              :options="systemDiskOptions"
              @change="onSystemDiskChange"
            ></tiny-select>
            <tiny-input
              v-model="formData.systemDiskSize"
              placeholder="40"
              style="width: 120px; margin-right: 10px"
              @input="onSystemDiskSizeChange"
            ></tiny-input>
            <span style="color: #575d6c; font-size: 12px">GiB IOPS上限240，IOPS突发上限5,000</span>
          </div></tiny-form-item
        ></tiny-form
      >
      <tiny-form
        labelWidth="80px"
        labelPosition="top"
        :inline="false"
        label-position="left "
        label-width="150px"
        style="border-radius: 0px"
      >
        <tiny-form-item label="数据盘" style="border-radius: 0px">
          <div v-for="() in 3" style="margin-top: 12px; display: flex">
            <tiny-icon-panel-mini
              style="margin-right: 10px; width: 16px; height: 16px"
              fill="currentColor"
            ></tiny-icon-panel-mini>
            <tiny-select
              modelValue=""
              placeholder="请选择"
              style="width: 200px; margin-right: 10px"
              :options="[
                { value: '1', label: '黄金糕' },
                { value: '2', label: '双皮奶' }
              ]"
            ></tiny-select>
            <tiny-input placeholder="请输入" modelValue="" style="width: 120px; margin-right: 10px"></tiny-input>
            <span style="color: #575d6c; font-size: 12px; margin-right: 10px">GiB IOPS上限600，IOPS突发上限5,000</span>
            <tiny-input placeholder="请输入" modelValue="" style="width: 120px"></tiny-input>
          </div>
          <div style="display: flex; margin-top: 12px; border-radius: 0px">
            <tiny-icon-plus style="width: 16px; height: 16px; margin-right: 10px" fill="currentColor"></tiny-icon-plus>
            <span style="font-size: 12px; border-radius: 0px; margin-right: 10px">增加一块数据盘</span>
            <span style="color: #8a8e99; font-size: 12px">您还可以挂载 21 块磁盘（云硬盘）</span>
          </div></tiny-form-item
        ></tiny-form
      >
    </div>
    <div
      style="
        border-width: 1px;
        border-style: solid;
        border-color: #ffffff;
        padding-top: 10px;
        padding-left: 10px;
        padding-right: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
        background-color: #fff;
        position: fixed;
        inset: auto 0% 0% 0%;
        height: 80px;
        line-height: 80px;
        border-radius: 0px;
      "
    >
      <tiny-form
        labelWidth="80px"
        labelPosition="top"
        :inline="false"
        label-position="left "
        label-width="150px"
        style="border-radius: 0px"
      ></tiny-form>
      <tiny-row style="border-radius: 0px; height: 100%">
        <tiny-col span="8">
          <tiny-row style="border-radius: 0px">
            <tiny-col span="5" style="display: flex">
              <span style="margin-right: 10px">购买量</span>
              <tiny-input
                v-model="formData.quantity"
                placeholder="1"
                style="width: 120px; margin-right: 10px"
                @input="onQuantityChange"
              ></tiny-input>
              <span>台</span></tiny-col
            >
            <tiny-col span="7">
              <div>
                <span style="font-size: 12px">配置费用</span>
                <span style="padding-left: 10px; padding-right: 10px; color: #de504e">¥{{ formData.price.toFixed(4) }}</span>
                <span style="font-size: 12px">/小时</span>
              </div>
              <div>
                <span style="font-size: 12px; border-radius: 0px">参考价格，具体扣费请以账单为准。</span>
                <span style="font-size: 12px; color: #344899">了解计费详情</span>
              </div></tiny-col
            ></tiny-row
          ></tiny-col
        >
        <tiny-col
          span="4"
          style="
            display: flex;
            flex-direction: row-reverse;
            border-radius: 0px;
            height: 100%;
            justify-content: flex-start;
            align-items: center;
          "
        >
          <tiny-button
            text="下一步: 网络配置"
            type="danger"
            style="max-width: unset"
            @click="nextStep"
          ></tiny-button></tiny-col
      ></tiny-row>
    </div>
  </div>
</template>

<script setup>
import {
  ButtonGroup as TinyButtonGroup,
  Row as TinyRow,
  Form as TinyForm,
  FormItem as TinyFormItem,
  Col as TinyCol,
  Button as TinyButton,
  Input as TinyInput,
  Select as TinySelect,
  Search as TinySearch,
  Grid as TinyGrid,
  TimeLine as TinyTimeLine
} from '@opentiny/vue'
import { IconPanelMini, IconPlus } from '@opentiny/vue-icon'
import * as vue from 'vue'
import { defineProps, defineEmits } from 'vue'
import { I18nInjectionKey } from 'vue-i18n'

const TinyIconPanelMini = IconPanelMini()
const TinyIconPlus = IconPlus()
const props = defineProps({})

const emit = defineEmits([])
const { t, lowcodeWrap, stores } = vue.inject(I18nInjectionKey).lowcode()
const wrap = lowcodeWrap(props, { emit })
wrap({ stores })

// 业务逻辑状态
const currentStep = vue.ref(1)
const errorMessage = vue.ref('')
const successMessage = vue.ref('')

// 表单数据
const formData = vue.reactive({
  billingMode: '1',
  region: '1',
  availabilityZone: '1',
  cpuArchitecture: '1',
  vcpuCount: '',
  memorySize: '',
  instanceType: '1',
  imageType: '1',
  imageId: '',
  systemDiskType: '',
  systemDiskSize: '',
  dataDisks: [],
  quantity: 1,
  price: 1.5776
})

// 选项数据
const regionOptions = vue.ref([
  { text: '乌兰察布二零一', value: '1' },
  { text: '北京一', value: '2' },
  { text: '上海二', value: '3' }
])

const availabilityZoneOptions = vue.ref([
  { text: '可用区1', value: '1' },
  { text: '可用区2', value: '2' },
  { text: '可用区3', value: '3' }
])

const vcpuOptions = vue.ref([
  { value: '1', label: '1 vCPU' },
  { value: '2', label: '2 vCPUs' },
  { value: '4', label: '4 vCPUs' },
  { value: '8', label: '8 vCPUs' }
])

const memoryOptions = vue.ref([
  { value: '1', label: '1 GiB' },
  { value: '2', label: '2 GiB' },
  { value: '4', label: '4 GiB' },
  { value: '8', label: '8 GiB' }
])

const imageTypeOptions = vue.ref([
  { text: '公共镜像', value: '1' },
  { text: '私有镜像', value: '2' },
  { text: '共享镜像', value: '3' }
])

const systemDiskOptions = vue.ref([
  { value: '1', label: '通用型SSD' },
  { value: '2', label: '高性能I/O型SSD' },
  { value: '3', label: '超高I/O型SSD' }
])

const dataDiskOptions = vue.ref([
  { value: '1', label: '通用型SSD' },
  { value: '2', label: '高性能I/O型SSD' },
  { value: '3', label: '超高I/O型SSD' }
])

// 实例规格数据
const instanceData = vue.ref([
  {
    id: '1',
    name: 'Si2.large.2',
    employees: 'Si2.large.2',
    city: 'Intel Xeon',
    created_date: '2vCPUs | 4 GiB',
    boole: false
  },
  {
    id: '2',
    name: 'Si2.xlarge.2',
    employees: 'Si2.xlarge.2',
    city: 'Intel Xeon',
    created_date: '4vCPUs | 8 GiB',
    boole: true
  }
])

const selectedInstance = vue.ref(null)

// 移除dataDiskCount避免冲突

// 业务逻辑方法
const onBillingModeChange = (value) => {
  formData.billingMode = value
  console.log('计费模式变更:', value)
  calculatePrice()
}

const onRegionChange = (value) => {
  formData.region = value
  console.log('区域变更:', value)
  // 可以根据区域加载对应的可用区
}

const onAvailabilityZoneChange = (value) => {
  formData.availabilityZone = value
  console.log('可用区变更:', value)
}

const onCpuArchitectureChange = (value) => {
  formData.cpuArchitecture = value
  console.log('CPU架构变更:', value)
}

const onVcpuChange = (value) => {
  formData.vcpuCount = value
  console.log('vCPU变更:', value)
  calculatePrice()
}

const onMemoryChange = (value) => {
  formData.memorySize = value
  console.log('内存变更:', value)
  calculatePrice()
}

const onInstanceTypeChange = (value) => {
  formData.instanceType = value
  console.log('实例类型变更:', value)
}

const onImageTypeChange = (value) => {
  formData.imageType = value
  formData.imageId = ''
  console.log('镜像类型变更:', value)
}

const onImageChange = (value) => {
  formData.imageId = value
  console.log('镜像变更:', value)
}

const onSystemDiskChange = (value) => {
  formData.systemDiskType = value
  console.log('系统盘类型变更:', value)
  calculatePrice()
}

const onSystemDiskSizeChange = (value) => {
  formData.systemDiskSize = value
  console.log('系统盘大小变更:', value)
  calculatePrice()
}

const onQuantityChange = (value) => {
  formData.quantity = value
  console.log('购买数量变更:', value)
  calculatePrice()
}

// 实例选择
const onInstanceSelect = (row) => {
  selectedInstance.value = row
  console.log('选择实例:', row)
  calculatePrice()
}

// 计算价格
const calculatePrice = () => {
  // 模拟价格计算逻辑
  let basePrice = 1.0

  if (formData.vcpuCount === '1') basePrice += 0.3
  if (formData.vcpuCount === '2') basePrice += 0.6
  if (formData.vcpuCount === '4') basePrice += 1.2
  if (formData.vcpuCount === '8') basePrice += 2.4

  if (formData.memorySize === '1') basePrice += 0.2
  if (formData.memorySize === '2') basePrice += 0.4
  if (formData.memorySize === '4') basePrice += 0.8
  if (formData.memorySize === '8') basePrice += 1.6

  if (formData.systemDiskSize) {
    basePrice += (parseInt(formData.systemDiskSize) - 40) * 0.01
  }

  formData.price = basePrice * formData.quantity
}

// 表单验证
const validateForm = () => {
  const errors = []

  if (!formData.billingMode) errors.push('请选择计费模式')
  if (!formData.region) errors.push('请选择区域')
  if (!formData.availabilityZone) errors.push('请选择可用区')
  if (!formData.imageType) errors.push('请选择镜像类型')
  if (!formData.systemDiskType) errors.push('请选择系统盘类型')
  if (!formData.systemDiskSize) errors.push('请输入系统盘大小')
  if (!formData.quantity || formData.quantity < 1) errors.push('请输入购买数量')

  return errors
}

// 提交表单
const submitForm = async () => {
  const errors = validateForm()

  if (errors.length > 0) {
    errorMessage.value = errors.join(', ')
    return false
  }

  try {
    // 模拟API调用
    console.log('提交表单数据:', formData)

    // 显示成功消息
    successMessage.value = '虚拟机创建成功！VM ID: vm-' + Date.now()

    // 可以在这里调用真实的API
    // const response = await fetch('/api/vm/create', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })

    return true
  } catch (error) {
    errorMessage.value = '提交失败: ' + error.message
    return false
  }
}

// 下一步
const nextStep = () => {
  const errors = validateForm()

  if (errors.length > 0) {
    errorMessage.value = errors.join(', ')
    return
  }

  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    submitForm()
  }
}

// 清除消息
const clearError = () => {
  errorMessage.value = ''
}

const clearSuccess = () => {
  successMessage.value = ''
}

wrap({
  currentStep,
  errorMessage,
  successMessage,
  formData,
  regionOptions,
  availabilityZoneOptions,
  vcpuOptions,
  memoryOptions,
  imageTypeOptions,
  systemDiskOptions,
  dataDiskOptions,
  instanceData,
  selectedInstance,
  onBillingModeChange,
  onRegionChange,
  onAvailabilityZoneChange,
  onCpuArchitectureChange,
  onVcpuChange,
  onMemoryChange,
  onInstanceTypeChange,
  onImageTypeChange,
  onImageChange,
  onSystemDiskChange,
  onSystemDiskSizeChange,
  onQuantityChange,
  onInstanceSelect,
  nextStep,
  submitForm,
  clearError,
  clearSuccess
})
</script>
<style scoped>
body {
  background-color: #eef0f5;
  margin-bottom: 80px;
}
</style>
