<template>
  <div class="vm-creation-container">
    <!-- 进度条 -->
    <div class="step-indicator">
      <tiny-time-line
        :active="currentStep.toString()"
        :horizontal="true"
        :data="stepData"
      ></tiny-time-line>
    </div>

    <!-- 错误提示 -->
    <tiny-alert
      v-if="error"
      type="error"
      :description="error"
      closable
      @close="clearError"
      style="margin-bottom: 16px"
    ></tiny-alert>

    <!-- 成功提示 -->
    <tiny-alert
      v-if="successMessage"
      type="success"
      :description="successMessage"
      closable
      @close="clearSuccess"
      style="margin-bottom: 16px"
    ></tiny-alert>

    <!-- 步骤1：基础配置 -->
    <div v-show="currentStep === 1" class="step-content">
      <div class="form-section">
        <h3>基础配置</h3>
        <tiny-form :model="formData.basicConfig" label-width="150px">
          <tiny-form-item label="计费模式" required>
            <tiny-button-group
              v-model="formData.basicConfig.billingMode"
              :data="billingModeOptions"
              @change="onBillingModeChange"
            ></tiny-button-group>
          </tiny-form-item>

          <tiny-form-item label="区域" required>
            <tiny-button-group
              v-model="formData.basicConfig.region"
              :data="regionOptions"
              @change="onRegionChange"
            ></tiny-button-group>
            <div class="help-text">
              温馨提示：页面左上角切换区域<br>
              不同区域的云服务产品之间内网互不相通；请就近选择靠近您业务的区域，可减少网络时延，提高访问速度
            </div>
          </tiny-form-item>

          <tiny-form-item label="可用区" required>
            <tiny-button-group
              v-model="formData.basicConfig.availabilityZone"
              :data="availabilityZoneOptions"
              @change="onAvailabilityZoneChange"
            ></tiny-button-group>
          </tiny-form-item>
        </tiny-form>
      </div>
    </div>

    <!-- 步骤2：硬件配置 -->
    <div v-show="currentStep === 2" class="step-content">
      <div class="form-section">
        <h3>硬件配置</h3>
        <tiny-form :model="formData.hardwareConfig" label-width="150px">
          <tiny-form-item label="CPU架构" required>
            <tiny-button-group
              v-model="formData.hardwareConfig.cpuArchitecture"
              :data="cpuArchitectureOptions"
              @change="onCpuArchitectureChange"
            ></tiny-button-group>
          </tiny-form-item>

          <tiny-form-item label="规格选择" required>
            <div class="spec-selection">
              <div class="spec-controls">
                <div class="spec-control">
                  <span>vCPUs</span>
                  <tiny-select
                    v-model="formData.hardwareConfig.vcpuCount"
                    placeholder="请选择vCPU数量"
                    :options="vcpuOptions"
                    @change="onVcpuChange"
                  ></tiny-select>
                </div>
                <div class="spec-control">
                  <span>内存</span>
                  <tiny-select
                    v-model="formData.hardwareConfig.memorySize"
                    placeholder="请选择内存大小"
                    :options="memoryOptions"
                    @change="onMemoryChange"
                  ></tiny-select>
                </div>
                <div class="spec-control">
                  <span>规格名称</span>
                  <tiny-search
                    v-model="instanceSearch"
                    placeholder="输入关键词搜索"
                    @input="onInstanceSearch"
                  ></tiny-search>
                </div>
              </div>

              <tiny-button-group
                v-model="formData.hardwareConfig.instanceType"
                :data="instanceTypeOptions"
                @change="onInstanceTypeChange"
                class="instance-type-buttons"
              ></tiny-button-group>

              <tiny-grid
                :auto-resize="true"
                :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
                :columns="instanceColumns"
                :data="filteredInstanceData"
                @radio-change="onInstanceSelect"
                class="instance-grid"
              ></tiny-grid>

              <div class="current-selection" v-if="formData.hardwareConfig.selectedInstance">
                <span class="label">当前规格：</span>
                <span class="value">
                  {{ getInstanceTypeLabel(formData.hardwareConfig.instanceType) }} |
                  {{ formData.hardwareConfig.selectedInstance.name }} |
                  {{ formData.hardwareConfig.selectedInstance.vcpus }}vCPUs |
                  {{ formData.hardwareConfig.selectedInstance.memory }} GiB
                </span>
              </div>
            </div>
          </tiny-form-item>
        </tiny-form>
      </div>
    </div>

    <!-- 步骤3：高级配置 -->
    <div v-show="currentStep === 3" class="step-content">
      <div class="form-section">
        <h3>高级配置</h3>
        <tiny-form :model="formData.systemConfig" label-width="150px">
          <tiny-form-item label="镜像" required>
            <tiny-button-group
              v-model="formData.systemConfig.imageType"
              :data="imageTypeOptions"
              @change="onImageTypeChange"
            ></tiny-button-group>

            <div class="image-selection">
              <tiny-select
                v-model="formData.systemConfig.imageId"
                placeholder="请选择镜像"
                :options="imageOptions"
                @change="onImageChange"
                style="margin-top: 12px; width: 100%"
              ></tiny-select>
            </div>
          </tiny-form-item>

          <tiny-form-item label="系统盘" required>
            <div class="disk-config">
              <tiny-select
                v-model="formData.systemConfig.systemDisk.type"
                placeholder="请选择系统盘类型"
                :options="systemDiskTypeOptions"
                @change="onSystemDiskTypeChange"
                style="margin-bottom: 12px"
              ></tiny-select>

              <div class="disk-size">
                <tiny-slider
                  v-model="formData.systemConfig.systemDisk.size"
                  :min="20"
                  :max="500"
                  :step="10"
                  :marks="{ 20: '20GB', 100: '100GB', 500: '500GB' }"
                  @change="onSystemDiskSizeChange"
                ></tiny-slider>
                <span class="size-value">{{ formData.systemConfig.systemDisk.size }} GB</span>
              </div>
            </div>
          </tiny-form-item>

          <tiny-form-item label="数据盘">
            <div class="data-disks">
              <div v-for="(disk, index) in formData.systemConfig.dataDisks" :key="index" class="data-disk-item">
                <tiny-select
                  v-model="disk.type"
                  placeholder="磁盘类型"
                  :options="dataDiskTypeOptions"
                  style="margin-right: 12px"
                ></tiny-select>
                <tiny-slider
                  v-model="disk.size"
                  :min="20"
                  :max="32000"
                  :step="10"
                  style="margin-right: 12px; width: 200px"
                ></tiny-slider>
                <span style="margin-right: 12px">{{ disk.size }} GB</span>
                <tiny-button @click="removeDataDisk(index)" type="danger">删除</tiny-button>
              </div>
              <tiny-button @click="addDataDisk" type="primary">添加数据盘</tiny-button>
            </div>
          </tiny-form-item>
        </tiny-form>
      </div>
    </div>

    <!-- 步骤4：确认配置 -->
    <div v-show="currentStep === 4" class="step-content">
      <div class="form-section">
        <h3>确认配置</h3>
        <div class="config-summary">
          <div class="summary-section">
            <h4>基础配置</h4>
            <div class="summary-item">
              <span class="label">计费模式：</span>
              <span class="value">{{ getBillingModeLabel(formData.basicConfig.billingMode) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">区域：</span>
              <span class="value">{{ getRegionLabel(formData.basicConfig.region) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">可用区：</span>
              <span class="value">{{ getAvailabilityZoneLabel(formData.basicConfig.availabilityZone) }}</span>
            </div>
          </div>

          <div class="summary-section">
            <h4>硬件配置</h4>
            <div class="summary-item">
              <span class="label">CPU架构：</span>
              <span class="value">{{ getCpuArchitectureLabel(formData.hardwareConfig.cpuArchitecture) }}</span>
            </div>
            <div class="summary-item" v-if="formData.hardwareConfig.selectedInstance">
              <span class="label">实例规格：</span>
              <span class="value">{{ formData.hardwareConfig.selectedInstance.name }}</span>
            </div>
            <div class="summary-item" v-if="formData.hardwareConfig.selectedInstance">
              <span class="label">vCPUs/内存：</span>
              <span class="value">{{ formData.hardwareConfig.selectedInstance.vcpus }}vCPUs / {{ formData.hardwareConfig.selectedInstance.memory }}GiB</span>
            </div>
          </div>

          <div class="summary-section">
            <h4>系统配置</h4>
            <div class="summary-item">
              <span class="label">镜像：</span>
              <span class="value">{{ getImageLabel(formData.systemConfig.imageId) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">系统盘：</span>
              <span class="value">{{ getSystemDiskTypeLabel(formData.systemConfig.systemDisk.type) }} {{ formData.systemConfig.systemDisk.size }}GB</span>
            </div>
            <div class="summary-item" v-if="formData.systemConfig.dataDisks.length > 0">
              <span class="label">数据盘：</span>
              <span class="value">
                {{ formData.systemConfig.dataDisks.length }}块，总计 {{ getTotalDataDiskSize() }}GB
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <tiny-row>
        <tiny-col :span="8">
          <tiny-button
            v-if="currentStep > 1"
            @click="prevStep"
            :disabled="loading"
          >
            上一步
          </tiny-button>
        </tiny-col>
        <tiny-col :span="8" style="text-align: center">
          <tiny-button
            @click="saveDraft"
            :loading="loading"
            type="info"
          >
            保存草稿
          </tiny-button>
        </tiny-col>
        <tiny-col :span="8" style="text-align: right">
          <tiny-button
            v-if="currentStep < 4"
            @click="nextStep"
            :disabled="!canGoNext || loading"
            type="primary"
          >
            {{ getNextStepText() }}
          </tiny-button>
          <tiny-button
            v-if="currentStep === 4"
            @click="submitForm"
            :loading="loading"
            type="danger"
          >
            立即创建
          </tiny-button>
        </tiny-col>
      </tiny-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useVMConfigStore } from '../stores/vmConfig'
import { Message } from '@opentiny/vue'

// Store
const vmConfigStore = useVMConfigStore()

// 响应式数据
const instanceSearch = ref('')

// 计算属性
const formData = computed(() => vmConfigStore.formData)
const currentStep = computed(() => vmConfigStore.currentStep)
const canGoNext = computed(() => vmConfigStore.canGoNext)
const loading = computed(() => vmConfigStore.loading)
const error = computed(() => vmConfigStore.error)
const successMessage = ref('')

// 步骤数据
const stepData = [
  { name: '基础配置' },
  { name: '网络配置' },
  { name: '高级配置' },
  { name: '确认配置' }
]

// 选项数据
const billingModeOptions = [
  { text: '包年/包月', value: '1' },
  { text: '按需计费', value: '2' }
]

const regionOptions = [
  { text: '乌兰察布二零一', value: '1' },
  { text: '北京一', value: '2' },
  { text: '上海二', value: '3' }
]

const availabilityZoneOptions = [
  { text: '可用区1', value: '1' },
  { text: '可用区2', value: '2' },
  { text: '可用区3', value: '3' }
]

const cpuArchitectureOptions = [
  { text: 'x86计算', value: '1' },
  { text: '鲲鹏计算', value: '2' }
]

const vcpuOptions = [
  { value: '1', label: '1 vCPU' },
  { value: '2', label: '2 vCPUs' },
  { value: '4', label: '4 vCPUs' },
  { value: '8', label: '8 vCPUs' }
]

const memoryOptions = [
  { value: '1', label: '1 GiB' },
  { value: '2', label: '2 GiB' },
  { value: '4', label: '4 GiB' },
  { value: '8', label: '8 GiB' },
  { value: '16', label: '16 GiB' }
]

const instanceTypeOptions = [
  { text: '通用计算型', value: '1' },
  { text: '通用计算增强型', value: '2' },
  { text: '内存优化型', value: '3' },
  { text: '磁盘增强型', value: '4' },
  { text: '超高I/O型', value: '5' },
  { text: 'GPU加速型', value: '6' }
]

const instanceColumns = [
  { type: 'radio', width: 60 },
  { field: 'name', title: '规格名称' },
  { field: 'spec', title: 'vCPUs | 内存(GiB)', sortable: true },
  { field: 'cpu', title: 'CPU', sortable: true },
  { field: 'bandwidth', title: '基准/最大带宽', sortable: true },
  { field: 'pps', title: '内网收发包', sortable: true }
]

const instanceData = ref([
  {
    id: '1',
    name: 't6.large.2',
    spec: '2 | 4',
    cpu: 'Intel Xeon',
    bandwidth: '0.5/2 Gbps',
    pps: '50万',
    vcpus: 2,
    memory: 4,
    instanceType: '1'
  },
  {
    id: '2',
    name: 't6.xlarge.2',
    spec: '4 | 8',
    cpu: 'Intel Xeon',
    bandwidth: '1/4 Gbps',
    pps: '100万',
    vcpus: 4,
    memory: 8,
    instanceType: '1'
  },
  {
    id: '3',
    name: 'm6.large.8',
    spec: '2 | 16',
    cpu: 'Intel Xeon',
    bandwidth: '0.5/3 Gbps',
    pps: '50万',
    vcpus: 2,
    memory: 16,
    instanceType: '3'
  }
])

const imageTypeOptions = [
  { text: '公共镜像', value: '1' },
  { text: '私有镜像', value: '2' },
  { text: '共享镜像', value: '3' }
]

const imageOptions = ref([
  { value: 'centos7', label: 'CentOS 7.9 64位' },
  { value: 'ubuntu20', label: 'Ubuntu 20.04 64位' },
  { value: 'windows2019', label: 'Windows Server 2019 数据中心版 64位' }
])

const systemDiskTypeOptions = [
  { value: '1', label: '通用型SSD' },
  { value: '2', label: '高性能I/O型SSD' },
  { value: '3', label: '超高I/O型SSD' }
]

const dataDiskTypeOptions = [
  { value: '1', label: '通用型SSD' },
  { value: '2', label: '高性能I/O型SSD' },
  { value: '3', label: '超高I/O型SSD' }
]

// 计算属性
const filteredInstanceData = computed(() => {
  let data = instanceData.value

  // 按实例类型过滤
  if (formData.value.hardwareConfig.instanceType) {
    data = data.filter(item => item.instanceType === formData.value.hardwareConfig.instanceType)
  }

  // 按搜索关键词过滤
  if (instanceSearch.value) {
    const keyword = instanceSearch.value.toLowerCase()
    data = data.filter(item =>
      item.name.toLowerCase().includes(keyword)
    )
  }

  return data
})

// 方法
const onBillingModeChange = (value) => {
  vmConfigStore.updateBasicConfig({ billingMode: value })
}

const onRegionChange = (value) => {
  vmConfigStore.updateBasicConfig({ region: value })
  // 可以根据区域加载对应的可用区
}

const onAvailabilityZoneChange = (value) => {
  vmConfigStore.updateBasicConfig({ availabilityZone: value })
}

const onCpuArchitectureChange = (value) => {
  vmConfigStore.updateHardwareConfig({ cpuArchitecture: value })
}

const onVcpuChange = (value) => {
  vmConfigStore.updateHardwareConfig({ vcpuCount: value })
}

const onMemoryChange = (value) => {
  vmConfigStore.updateHardwareConfig({ memorySize: value })
}

const onInstanceTypeChange = (value) => {
  vmConfigStore.updateHardwareConfig({ instanceType: value })
}

const onInstanceSearch = (value) => {
  instanceSearch.value = value
}

const onInstanceSelect = (row) => {
  vmConfigStore.updateHardwareConfig({ selectedInstance: row })
}

const onImageTypeChange = (value) => {
  vmConfigStore.updateSystemConfig({ imageType: value, imageId: '' })
  // 根据镜像类型加载对应的镜像列表
  loadImagesByType(value)
}

const onImageChange = (value) => {
  vmConfigStore.updateSystemConfig({ imageId: value })
}

const onSystemDiskTypeChange = (value) => {
  vmConfigStore.updateSystemConfig({
    systemDisk: { ...formData.value.systemConfig.systemDisk, type: value }
  })
}

const onSystemDiskSizeChange = (value) => {
  vmConfigStore.updateSystemConfig({
    systemDisk: { ...formData.value.systemConfig.systemDisk, size: value }
  })
}

const addDataDisk = () => {
  const newDataDisk = {
    type: '1',
    size: 100
  }
  vmConfigStore.updateSystemConfig({
    dataDisks: [...formData.value.systemConfig.dataDisks, newDataDisk]
  })
}

const removeDataDisk = (index) => {
  const dataDisks = [...formData.value.systemConfig.dataDisks]
  dataDisks.splice(index, 1)
  vmConfigStore.updateSystemConfig({ dataDisks })
}

const getTotalDataDiskSize = () => {
  return formData.value.systemConfig.dataDisks.reduce((total, disk) => total + disk.size, 0)
}

const loadImagesByType = (type) => {
  // 根据镜像类型加载对应的镜像列表
  // 这里可以调用API获取真实的镜像数据
  const mockImages = {
    '1': [ // 公共镜像
      { value: 'centos7', label: 'CentOS 7.9 64位' },
      { value: 'ubuntu20', label: 'Ubuntu 20.04 64位' },
      { value: 'windows2019', label: 'Windows Server 2019 数据中心版 64位' }
    ],
    '2': [ // 私有镜像
      { value: 'custom1', label: '自定义镜像1' },
      { value: 'custom2', label: '自定义镜像2' }
    ],
    '3': [ // 共享镜像
      { value: 'shared1', label: '共享镜像1' }
    ]
  }

  imageOptions.value = mockImages[type] || []
}

const nextStep = () => {
  vmConfigStore.nextStep()
}

const prevStep = () => {
  vmConfigStore.prevStep()
}

const saveDraft = async () => {
  const success = await vmConfigStore.saveDraft()
  if (success) {
    successMessage.value = '草稿保存成功！'
    Message.success('草稿保存成功！')
  }
}

const submitForm = async () => {
  const result = await vmConfigStore.submitForm()
  if (result) {
    successMessage.value = '虚拟机创建成功！VM ID: ' + result.data.vmId
    Message.success('虚拟机创建成功！')
    // 可以跳转到详情页面或其他操作
  }
}

const clearError = () => {
  vmConfigStore.error = null
}

const clearSuccess = () => {
  successMessage.value = null
}

const getNextStepText = () => {
  const stepTexts = {
    1: '下一步: 网络配置',
    2: '下一步: 高级配置',
    3: '下一步: 确认配置'
  }
  return stepTexts[currentStep.value] || '下一步'
}

// 标签获取方法
const getBillingModeLabel = (value) => {
  const option = billingModeOptions.find(opt => opt.value === value)
  return option ? option.text : value
}

const getRegionLabel = (value) => {
  const option = regionOptions.find(opt => opt.value === value)
  return option ? option.text : value
}

const getAvailabilityZoneLabel = (value) => {
  const option = availabilityZoneOptions.find(opt => opt.value === value)
  return option ? option.text : value
}

const getCpuArchitectureLabel = (value) => {
  const option = cpuArchitectureOptions.find(opt => opt.value === value)
  return option ? option.text : value
}

const getInstanceTypeLabel = (value) => {
  const option = instanceTypeOptions.find(opt => opt.value === value)
  return option ? option.text : value
}

const getImageLabel = (value) => {
  const option = imageOptions.value.find(opt => opt.value === value)
  return option ? option.label : value
}

const getSystemDiskTypeLabel = (value) => {
  const option = systemDiskTypeOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

// 生命周期
onMounted(() => {
  // 尝试加载草稿
  vmConfigStore.loadDraft()
})

// 监听变化
watch(() => formData.value.hardwareConfig.instanceType, () => {
  // 实例类型变化时清空选中的实例
  vmConfigStore.updateHardwareConfig({ selectedInstance: null })
})
</script>

<style scoped>
.vm-creation-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.step-indicator {
  margin-bottom: 24px;
}

.step-content {
  margin-bottom: 24px;
}

.form-section {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.form-section h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.help-text {
  font-size: 12px;
  color: #8a8e99;
  margin-top: 8px;
  line-height: 1.5;
}

.spec-selection {
  width: 100%;
}

.spec-controls {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 16px;
}

.spec-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-control span {
  min-width: 80px;
  font-size: 14px;
}

.instance-type-buttons {
  margin: 12px 0;
}

.instance-grid {
  margin: 12px 0;
}

.current-selection {
  margin-top: 12px;
  padding: 12px;
  background-color: #f3f4f6;
  border-radius: 4px;
}

.current-selection .label {
  font-weight: 600;
  margin-right: 8px;
}

.current-selection .value {
  font-weight: 700;
  color: #1f2937;
}

.image-selection {
  margin-top: 12px;
}

.disk-config {
  width: 100%;
}

.disk-size {
  display: flex;
  align-items: center;
  gap: 16px;
}

.size-value {
  font-weight: 600;
  min-width: 80px;
}

.data-disks {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px;
  background-color: #f9fafb;
}

.data-disk-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
}

.data-disk-item:last-child {
  margin-bottom: 12px;
}

.config-summary {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 24px;
}

.summary-section {
  margin-bottom: 24px;
}

.summary-section:last-child {
  margin-bottom: 0;
}

.summary-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 8px;
}

.summary-item {
  display: flex;
  margin-bottom: 8px;
  line-height: 1.5;
}

.summary-item .label {
  min-width: 120px;
  font-weight: 500;
  color: #6b7280;
}

.summary-item .value {
  font-weight: 600;
  color: #1f2937;
}

.action-buttons {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-top: 24px;
}
</style>