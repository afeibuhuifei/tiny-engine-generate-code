import axios from '../http/axios'

/**
 * 虚拟机管理API服务
 */
class VMService {
  /**
   * 获取可用区域列表
   */
  async getRegions() {
    try {
      const response = await axios.get('/api/regions')
      return response.data
    } catch (error) {
      console.error('获取区域列表失败:', error)
      throw error
    }
  }

  /**
   * 根据区域获取可用区列表
   */
  async getAvailabilityZones(regionId) {
    try {
      const response = await axios.get(`/api/regions/${regionId}/zones`)
      return response.data
    } catch (error) {
      console.error('获取可用区列表失败:', error)
      throw error
    }
  }

  /**
   * 获取实例规格列表
   */
  async getInstanceTypes(filters = {}) {
    try {
      const response = await axios.get('/api/instance-types', { params: filters })
      return response.data
    } catch (error) {
      console.error('获取实例规格失败:', error)
      throw error
    }
  }

  /**
   * 获取镜像列表
   */
  async getImages(imageType = '1', regionId = '1') {
    try {
      const response = await axios.get('/api/images', {
        params: {
          type: imageType,
          region: regionId
        }
      })
      return response.data
    } catch (error) {
      console.error('获取镜像列表失败:', error)
      throw error
    }
  }

  /**
   * 获取磁盘类型列表
   */
  async getDiskTypes() {
    try {
      const response = await axios.get('/api/disk-types')
      return response.data
    } catch (error) {
      console.error('获取磁盘类型失败:', error)
      throw error
    }
  }

  /**
   * 创建虚拟机
   */
  async createVM(vmConfig) {
    try {
      const response = await axios.post('/api/vms', vmConfig)
      return response.data
    } catch (error) {
      console.error('创建虚拟机失败:', error)
      throw error
    }
  }

  /**
   * 获取虚拟机列表
   */
  async getVMList(params = {}) {
    try {
      const response = await axios.get('/api/vms', { params })
      return response.data
    } catch (error) {
      console.error('获取虚拟机列表失败:', error)
      throw error
    }
  }

  /**
   * 获取虚拟机详情
   */
  async getVMDetails(vmId) {
    try {
      const response = await axios.get(`/api/vms/${vmId}`)
      return response.data
    } catch (error) {
      console.error('获取虚拟机详情失败:', error)
      throw error
    }
  }

  /**
   * 启动虚拟机
   */
  async startVM(vmId) {
    try {
      const response = await axios.post(`/api/vms/${vmId}/start`)
      return response.data
    } catch (error) {
      console.error('启动虚拟机失败:', error)
      throw error
    }
  }

  /**
   * 停止虚拟机
   */
  async stopVM(vmId) {
    try {
      const response = await axios.post(`/api/vms/${vmId}/stop`)
      return response.data
    } catch (error) {
      console.error('停止虚拟机失败:', error)
      throw error
    }
  }

  /**
   * 重启虚拟机
   */
  async restartVM(vmId) {
    try {
      const response = await axios.post(`/api/vms/${vmId}/restart`)
      return response.data
    } catch (error) {
      console.error('重启虚拟机失败:', error)
      throw error
    }
  }

  /**
   * 删除虚拟机
   */
  async deleteVM(vmId) {
    try {
      const response = await axios.delete(`/api/vms/${vmId}`)
      return response.data
    } catch (error) {
      console.error('删除虚拟机失败:', error)
      throw error
    }
  }

  /**
   * 保存配置草稿
   */
  async saveDraft(draftData) {
    try {
      const response = await axios.post('/api/vms/draft', draftData)
      return response.data
    } catch (error) {
      console.error('保存草稿失败:', error)
      throw error
    }
  }

  /**
   * 获取配置草稿
   */
  async getDraft(draftId) {
    try {
      const response = await axios.get(`/api/vms/draft/${draftId}`)
      return response.data
    } catch (error) {
      console.error('获取草稿失败:', error)
      throw error
    }
  }

  /**
   * 获取价格估算
   */
  async getPriceEstimate(config) {
    try {
      const response = await axios.post('/api/vms/price-estimate', config)
      return response.data
    } catch (error) {
      console.error('获取价格估算失败:', error)
      throw error
    }
  }

  /**
   * 验证配置有效性
   */
  async validateConfig(config) {
    try {
      const response = await axios.post('/api/vms/validate', config)
      return response.data
    } catch (error) {
      console.error('配置验证失败:', error)
      throw error
    }
  }
}

// 创建服务实例
const vmService = new VMService()

export default vmService

// Mock数据 - 在实际开发中，这些数据应该从后端API获取
export const mockData = {
  regions: [
    { id: '1', name: '乌兰察布二零一', code: 'cn-north-4' },
    { id: '2', name: '北京一', code: 'cn-north-1' },
    { id: '3', name: '上海二', code: 'cn-east-2' },
    { id: '4', name: '广州', code: 'cn-south-1' }
  ],

  availabilityZones: {
    '1': [
      { id: '1', name: '可用区1', code: 'cn-north-4a' },
      { id: '2', name: '可用区2', code: 'cn-north-4b' },
      { id: '3', name: '可用区3', code: 'cn-north-4c' }
    ],
    '2': [
      { id: '1', name: '可用区1', code: 'cn-north-1a' },
      { id: '2', name: '可用区2', code: 'cn-north-1b' }
    ]
  },

  instanceTypes: [
    {
      id: 't6.large.2',
      name: 't6.large.2',
      vcpus: 2,
      memory: 4,
      cpuArchitecture: '1',
      instanceType: '1',
      cpuModel: 'Intel Xeon',
      bandwidth: '0.5/2 Gbps',
      pps: '50万',
      price: { hourly: 0.15, monthly: 108 }
    },
    {
      id: 't6.xlarge.2',
      name: 't6.xlarge.2',
      vcpus: 4,
      memory: 8,
      cpuArchitecture: '1',
      instanceType: '1',
      cpuModel: 'Intel Xeon',
      bandwidth: '1/4 Gbps',
      pps: '100万',
      price: { hourly: 0.30, monthly: 216 }
    },
    {
      id: 'm6.large.8',
      name: 'm6.large.8',
      vcpus: 2,
      memory: 16,
      cpuArchitecture: '1',
      instanceType: '3',
      cpuModel: 'Intel Xeon',
      bandwidth: '0.5/3 Gbps',
      pps: '50万',
      price: { hourly: 0.35, monthly: 252 }
    }
  ],

  images: {
    '1': [ // 公共镜像
      { id: 'centos7', name: 'CentOS 7.9 64位', os: 'CentOS', version: '7.9' },
      { id: 'ubuntu20', name: 'Ubuntu 20.04 64位', os: 'Ubuntu', version: '20.04' },
      { id: 'windows2019', name: 'Windows Server 2019 数据中心版 64位', os: 'Windows', version: '2019' }
    ],
    '2': [ // 私有镜像
      { id: 'custom1', name: '自定义镜像1', os: 'CentOS', version: '7.6' },
      { id: 'custom2', name: '自定义镜像2', os: 'Ubuntu', version: '18.04' }
    ],
    '3': [ // 共享镜像
      { id: 'shared1', name: '共享镜像1', os: 'CentOS', version: '7.8' }
    ]
  },

  diskTypes: [
    { id: '1', name: '通用型SSD', minSize: 20, maxSize: 32000, description: '通用型SSD云硬盘' },
    { id: '2', name: '高性能I/O型SSD', minSize: 20, maxSize: 32000, description: '高性能I/O型SSD云硬盘' },
    { id: '3', name: '超高I/O型SSD', minSize: 20, maxSize: 32000, description: '超高I/O型SSD云硬盘' }
  ]
}

// Mock API函数 - 用于开发和测试
export const mockAPI = {
  async getRegions() {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: mockData.regions }), 300)
    })
  },

  async getAvailabilityZones(regionId) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: mockData.availabilityZones[regionId] || [] }), 300)
    })
  },

  async getInstanceTypes(filters) {
    return new Promise(resolve => {
      let instances = mockData.instanceTypes

      if (filters.cpuArchitecture) {
        instances = instances.filter(item => item.cpuArchitecture === filters.cpuArchitecture)
      }
      if (filters.instanceType) {
        instances = instances.filter(item => item.instanceType === filters.instanceType)
      }
      if (filters.vcpus) {
        instances = instances.filter(item => item.vcpus >= parseInt(filters.vcpus))
      }
      if (filters.memory) {
        instances = instances.filter(item => item.memory >= parseInt(filters.memory))
      }

      setTimeout(() => resolve({ data: instances }), 500)
    })
  },

  async getImages(imageType, regionId) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: mockData.images[imageType] || [] }), 400)
    })
  },

  async getDiskTypes() {
    return new Promise(resolve => {
      setTimeout(() => resolve({ data: mockData.diskTypes }), 300)
    })
  },

  async createVM(vmConfig) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟随机成功或失败
        if (Math.random() > 0.1) {
          resolve({
            data: {
              success: true,
              vmId: 'vm-' + Date.now(),
              status: 'creating',
              estimatedReadyTime: '2-3分钟',
              config: vmConfig
            }
          })
        } else {
          reject(new Error('服务器繁忙，请稍后重试'))
        }
      }, 2000)
    })
  },

  async saveDraft(draftData) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            draftId: 'draft-' + Date.now(),
            message: '草稿保存成功'
          }
        })
      }, 500)
    })
  },

  async getPriceEstimate(config) {
    return new Promise(resolve => {
      setTimeout(() => {
        const instance = mockData.instanceTypes.find(item => item.id === config.hardwareConfig.selectedInstance?.id)
        let hourlyPrice = instance ? instance.price.hourly : 0

        // 添加磁盘价格
        const systemDiskPrice = config.systemConfig.systemDisk.size * 0.0001
        const dataDisksPrice = config.systemConfig.dataDisks.reduce((total, disk) => total + disk.size * 0.0001, 0)

        hourlyPrice += systemDiskPrice + dataDisksPrice

        const monthlyPrice = hourlyPrice * 24 * 30

        resolve({
          data: {
            hourlyPrice: hourlyPrice.toFixed(4),
            monthlyPrice: monthlyPrice.toFixed(2),
            currency: 'CNY'
          }
        })
      }, 800)
    })
  }
}