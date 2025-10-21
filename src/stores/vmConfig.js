import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVMConfigStore = defineStore('vmConfig', () => {
  // 表单数据状态
  const formData = ref({
    // 基础配置
    basicConfig: {
      billingMode: '1', // 计费模式：1-包年/包月，2-按需计费
      region: '1',      // 区域
      availabilityZone: '1' // 可用区
    },

    // 硬件配置
    hardwareConfig: {
      cpuArchitecture: '1',    // CPU架构：1-x86计算，2-鲲鹏计算
      vcpuCount: '1',          // vCPU数量
      memorySize: '1',         // 内存大小
      instanceType: '1',       // 实例规格类型
      selectedInstance: null   // 选中的具体实例规格
    },

    // 系统配置
    systemConfig: {
      imageType: '1',          // 镜像类型：1-公共镜像，2-私有镜像，3-共享镜像
      imageId: '',             // 镜像ID
      systemDisk: {
        type: '1',             // 系统盘类型
        size: 40               // 系统盘大小(GB)
      },
      dataDisks: []            // 数据盘配置数组
    },

    // 网络配置（后续扩展）
    networkConfig: {
      vpcId: '',
      subnetId: '',
      securityGroupId: '',
      publicIp: false
    }
  })

  // 当前步骤
  const currentStep = ref(1)
  const totalSteps = 4

  // 加载状态
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isStepComplete = computed(() => {
    switch (currentStep.value) {
      case 1:
        return formData.value.basicConfig.billingMode &&
               formData.value.basicConfig.region &&
               formData.value.basicConfig.availabilityZone
      case 2:
        return formData.value.hardwareConfig.cpuArchitecture &&
               formData.value.hardwareConfig.vcpuCount &&
               formData.value.hardwareConfig.memorySize &&
               formData.value.hardwareConfig.selectedInstance
      case 3:
        return formData.value.systemConfig.imageId &&
               formData.value.systemConfig.systemDisk.type
      default:
        return false
    }
  })

  const canGoNext = computed(() => {
    return currentStep.value < totalSteps && isStepComplete.value
  })

  const canGoPrev = computed(() => {
    return currentStep.value > 1
  })

  // Actions
  const updateBasicConfig = (config) => {
    formData.value.basicConfig = { ...formData.value.basicConfig, ...config }
  }

  const updateHardwareConfig = (config) => {
    formData.value.hardwareConfig = { ...formData.value.hardwareConfig, ...config }
  }

  const updateSystemConfig = (config) => {
    formData.value.systemConfig = { ...formData.value.systemConfig, ...config }
  }

  const updateNetworkConfig = (config) => {
    formData.value.networkConfig = { ...formData.value.networkConfig, ...config }
  }

  const nextStep = () => {
    if (canGoNext.value) {
      currentStep.value++
    }
  }

  const prevStep = () => {
    if (canGoPrev.value) {
      currentStep.value--
    }
  }

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      currentStep.value = step
    }
  }

  // 重置表单
  const resetForm = () => {
    formData.value = {
      basicConfig: {
        billingMode: '1',
        region: '1',
        availabilityZone: '1'
      },
      hardwareConfig: {
        cpuArchitecture: '1',
        vcpuCount: '1',
        memorySize: '1',
        instanceType: '1',
        selectedInstance: null
      },
      systemConfig: {
        imageType: '1',
        imageId: '',
        systemDisk: {
          type: '1',
          size: 40
        },
        dataDisks: []
      },
      networkConfig: {
        vpcId: '',
        subnetId: '',
        securityGroupId: '',
        publicIp: false
      }
    }
    currentStep.value = 1
    error.value = null
  }

  // 验证表单
  const validateForm = () => {
    const errors = []

    // 验证基础配置
    if (!formData.value.basicConfig.billingMode) {
      errors.push('请选择计费模式')
    }
    if (!formData.value.basicConfig.region) {
      errors.push('请选择区域')
    }
    if (!formData.value.basicConfig.availabilityZone) {
      errors.push('请选择可用区')
    }

    // 验证硬件配置
    if (!formData.value.hardwareConfig.selectedInstance) {
      errors.push('请选择实例规格')
    }

    // 验证系统配置
    if (!formData.value.systemConfig.imageId) {
      errors.push('请选择镜像')
    }

    if (errors.length > 0) {
      error.value = errors.join(', ')
      return false
    }

    error.value = null
    return true
  }

  // 提交表单
  const submitForm = async () => {
    if (!validateForm()) {
      return false
    }

    loading.value = true
    error.value = null

    try {
      // 这里将调用API提交数据
      const response = await submitVMConfiguration(formData.value)
      return response
    } catch (err) {
      error.value = err.message || '提交失败，请重试'
      return false
    } finally {
      loading.value = false
    }
  }

  // 保存草稿
  const saveDraft = async () => {
    loading.value = true
    error.value = null

    try {
      // 保存到本地存储或后端
      localStorage.setItem('vmConfigDraft', JSON.stringify(formData.value))
      return true
    } catch (err) {
      error.value = err.message || '保存失败，请重试'
      return false
    } finally {
      loading.value = false
    }
  }

  // 加载草稿
  const loadDraft = () => {
    try {
      const draft = localStorage.getItem('vmConfigDraft')
      if (draft) {
        formData.value = JSON.parse(draft)
        return true
      }
      return false
    } catch (err) {
      console.error('加载草稿失败:', err)
      return false
    }
  }

  return {
    // 状态
    formData,
    currentStep,
    totalSteps,
    loading,
    error,

    // 计算属性
    isStepComplete,
    canGoNext,
    canGoPrev,

    // Actions
    updateBasicConfig,
    updateHardwareConfig,
    updateSystemConfig,
    updateNetworkConfig,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    validateForm,
    submitForm,
    saveDraft,
    loadDraft
  }
})

// API调用函数（示例）
async function submitVMConfiguration(config) {
  // 这里将调用真实的API
  // const response = await fetch('/api/vm/create', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(config)
  // })
  // return response.json()

  // 模拟API调用
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟成功响应
      resolve({
        success: true,
        data: {
          vmId: 'vm-' + Date.now(),
          status: 'creating',
          config: config
        }
      })

      // 模拟失败（测试用）
      // reject(new Error('服务器错误'))
    }, 2000)
  })
}