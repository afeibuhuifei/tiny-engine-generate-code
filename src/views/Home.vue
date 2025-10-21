<template>
  <div class="home-container">
    <div class="header">
      <h1>云服务虚拟机管理平台</h1>
      <p class="subtitle">基于TinyEngine低代码引擎构建的现代化云服务管理界面</p>
    </div>

    <div class="content">
      <div class="feature-cards">
        <div class="card" @click="goToOriginal">
          <div class="card-header">
            <div class="card-icon">🔧</div>
            <h3>原始低代码页面</h3>
          </div>
          <div class="card-content">
            <p>查看由TinyEngine低代码平台生成的原始静态页面，了解基础界面结构。</p>
            <ul class="feature-list">
              <li>低代码原生界面</li>
              <li>基础UI组件展示</li>
              <li>静态表单布局</li>
            </ul>
          </div>
          <div class="card-footer">
            <tiny-button type="info">查看原始页面</tiny-button>
          </div>
        </div>

        <div class="card featured" @click="goToEnhanced">
          <div class="featured-badge">推荐</div>
          <div class="card-header">
            <div class="card-icon">🚀</div>
            <h3>增强功能版</h3>
          </div>
          <div class="card-content">
            <p>完整功能的虚拟机创建管理界面，包含数据绑定、状态管理、API调用等。</p>
            <ul class="feature-list">
              <li>✅ 完整的数据绑定和验证</li>
              <li>✅ 状态管理(Pinia)</li>
              <li>✅ API集成和错误处理</li>
              <li>✅ 表单步骤导航</li>
              <li>✅ 草稿保存功能</li>
              <li>✅ 价格估算</li>
              <li>✅ 响应式设计</li>
            </ul>
          </div>
          <div class="card-footer">
            <tiny-button type="primary">开始创建虚拟机</tiny-button>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h3>🔥 技术特性对比</h3>
        <div class="comparison-table">
          <div class="table-header">
            <div class="column">功能特性</div>
            <div class="column">原始页面</div>
            <div class="column">增强版本</div>
          </div>
          <div class="table-row">
            <div class="column">数据绑定</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ 双向绑定</div>
          </div>
          <div class="table-row">
            <div class="column">状态管理</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ Pinia Store</div>
          </div>
          <div class="table-row">
            <div class="column">表单验证</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ 完整验证</div>
          </div>
          <div class="table-row">
            <div class="column">API集成</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ HTTP请求</div>
          </div>
          <div class="table-row">
            <div class="column">错误处理</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ 完整处理</div>
          </div>
          <div class="table-row">
            <div class="column">草稿保存</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ 本地存储</div>
          </div>
          <div class="table-row">
            <div class="column">交互反馈</div>
            <div class="column">❌ 无</div>
            <div class="column">✅ 用户提示</div>
          </div>
        </div>
      </div>

      <div class="architecture-section">
        <h3>🏗️ 系统架构</h3>
        <div class="architecture-diagram">
          <div class="layer">
            <h4>前端层 (Vue 3)</h4>
            <div class="components">
              <span class="component">UI组件</span>
              <span class="component">状态管理</span>
              <span class="component">路由管理</span>
              <span class="component">HTTP请求</span>
            </div>
          </div>
          <div class="layer">
            <h4>业务逻辑层</h4>
            <div class="components">
              <span class="component">表单验证</span>
              <span class="component">数据转换</span>
              <span class="component">错误处理</span>
              <span class="component">缓存管理</span>
            </div>
          </div>
          <div class="layer">
            <h4>数据服务层</h4>
            <div class="components">
              <span class="component">API调用</span>
              <span class="component">Mock数据</span>
              <span class="component">本地存储</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>💡 提示：增强版本展示了如何将低代码静态页面转换为功能齐全的应用</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToOriginal = () => {
  router.push('/createVm')
}

const goToEnhanced = () => {
  router.push('/createVmEnhanced')
}
</script>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 60px;
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.content {
  margin-bottom: 60px;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.card.featured {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.featured-badge {
  position: absolute;
  top: -12px;
  right: 24px;
  background: #ef4444;
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 2rem;
  margin-right: 16px;
}

.card-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-content {
  margin-bottom: 24px;
}

.card-content p {
  color: #6b7280;
  margin-bottom: 16px;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 4px 0;
  color: #374151;
  font-size: 0.9rem;
}

.card-footer {
  text-align: center;
}

.info-section {
  background: #f9fafb;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
}

.info-section h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 24px;
  text-align: center;
}

.comparison-table {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  background: #1f2937;
  color: white;
  font-weight: 600;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  border-bottom: 1px solid #e5e7eb;
}

.table-row:last-child {
  border-bottom: none;
}

.column {
  padding: 16px;
  display: flex;
  align-items: center;
}

.table-header .column {
  justify-content: center;
}

.architecture-section {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.architecture-section h3 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 32px;
  text-align: center;
}

.architecture-diagram {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.layer {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border-left: 4px solid #3b82f6;
}

.layer h4 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.components {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.component {
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.footer {
  text-align: center;
  padding: 40px 0;
  border-top: 1px solid #e5e7eb;
}

.footer p {
  color: #6b7280;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }

  .feature-cards {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .comparison-table {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 500px;
  }

  .architecture-diagram {
    gap: 16px;
  }

  .components {
    justify-content: center;
  }
}
</style>