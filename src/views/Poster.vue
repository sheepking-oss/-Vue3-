<template>
  <div class="poster">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title gradient-text">🖼️ 生成运势海报</h1>
        <p class="page-desc">选择风格，生成专属星座运势海报</p>
      </div>
      
      <div v-if="constellation" class="poster-content">
        <div class="poster-preview card">
          <h3 class="preview-title">海报预览</h3>
          <div class="poster-container">
            <div 
              ref="posterRef" 
              class="poster-card"
              :class="`poster-style-${selectedStyle}`"
            >
              <div class="poster-header">
                <div class="poster-date">{{ today }}</div>
                <div class="poster-title">{{ constellation.name }}今日运势</div>
              </div>
              
              <div class="poster-main">
                <div class="poster-symbol">{{ constellation.symbol }}</div>
                <div class="poster-info">
                  <div class="poster-name">{{ constellation.name }}</div>
                  <div class="poster-date-range">{{ constellation.date }}</div>
                </div>
              </div>
              
              <div class="poster-scores">
                <div class="score-item">
                  <span class="score-label">综合</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: dailyFortune.scores.overall + '%' }"></div>
                  </div>
                  <span class="score-value">{{ dailyFortune.scores.overall }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-label">爱情</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: dailyFortune.scores.love + '%' }"></div>
                  </div>
                  <span class="score-value">{{ dailyFortune.scores.love }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-label">事业</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: dailyFortune.scores.career + '%' }"></div>
                  </div>
                  <span class="score-value">{{ dailyFortune.scores.career }}%</span>
                </div>
                <div class="score-item">
                  <span class="score-label">财运</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: dailyFortune.scores.wealth + '%' }"></div>
                  </div>
                  <span class="score-value">{{ dailyFortune.scores.wealth }}%</span>
                </div>
              </div>
              
              <div class="poster-lucky">
                <div class="lucky-item">
                  <span class="lucky-icon">🎨</span>
                  <span class="lucky-text">幸运色：{{ constellation.luckyColor[0] }}</span>
                </div>
                <div class="lucky-item">
                  <span class="lucky-icon">🔢</span>
                  <span class="lucky-text">幸运数字：{{ constellation.luckyNumber[0] }}</span>
                </div>
              </div>
              
              <div class="poster-footer">
                <div class="footer-qr">
                  <div class="qr-placeholder">
                    <span class="qr-icon">📱</span>
                  </div>
                  <span class="qr-text">扫码查看更多</span>
                </div>
                <div class="footer-brand">
                  <span class="brand-icon">✨</span>
                  <span class="brand-name">星座运势</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="poster-settings card">
          <h3 class="settings-title">海报设置</h3>
          
          <div class="setting-section">
            <h4 class="setting-label">选择风格</h4>
            <div class="style-options">
              <div 
                v-for="style in styles" 
                :key="style.value"
                class="style-option"
                :class="{ selected: selectedStyle === style.value }"
                @click="selectedStyle = style.value"
              >
                <div class="style-preview" :class="`style-${style.value}`">
                  <div class="preview-swatch"></div>
                </div>
                <span class="style-name">{{ style.label }}</span>
              </div>
            </div>
          </div>
          
          <div class="setting-section">
            <h4 class="setting-label">包含内容</h4>
            <div class="content-options">
              <label class="checkbox-item">
                <input type="checkbox" v-model="includeScores" class="checkbox-input">
                <span class="checkbox-label">运势指数</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="includeLucky" class="checkbox-input">
                <span class="checkbox-label">幸运元素</span>
              </label>
              <label class="checkbox-item">
                <input type="checkbox" v-model="includeQR" class="checkbox-input">
                <span class="checkbox-label">二维码区域</span>
              </label>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="action-btn primary" @click="generatePoster">
              <span class="btn-icon">📥</span>
              <span>生成并下载海报</span>
            </button>
            <button class="action-btn secondary" @click="sharePoster">
              <span class="btn-icon">📤</span>
              <span>分享海报</span>
            </button>
          </div>
          
          <div class="tips-section">
            <h4 class="tips-title">💡 小提示</h4>
            <ul class="tips-list">
              <li>点击"生成并下载海报"可将海报保存到本地</li>
              <li>选择不同风格可以获得不同视觉效果</li>
              <li>可以截图分享给好友哦！</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { constellations, getDailyFortune } from '@/data/constellations'
import { useToastStore } from '@/stores'

const route = useRoute()
const toastStore = useToastStore()

const posterRef = ref(null)
const selectedStyle = ref('purple')
const includeScores = ref(true)
const includeLucky = ref(true)
const includeQR = ref(true)

const constellation = ref(null)
const dailyFortune = ref(null)

const today = computed(() => {
  const date = new Date()
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
})

const styles = [
  { label: '梦幻紫', value: 'purple' },
  { label: '星空蓝', value: 'blue' },
  { label: '樱花粉', value: 'pink' },
  { label: '温暖橙', value: 'orange' }
]

function generatePoster() {
  toastStore.info('海报生成功能需要 html2canvas 库支持，当前为模拟版本')
  
  setTimeout(() => {
    toastStore.success('海报已生成！您可以截图保存或分享给好友')
  }, 1000)
}

function sharePoster() {
  const shareData = {
    title: `${constellation.value.name}今日运势海报`,
    text: `${constellation.value.name}今日综合运势 ${dailyFortune.value.scores.overall}%，快来看看！`,
    url: window.location.href
  }
  
  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
  } else {
    navigator.clipboard.writeText(shareData.text + ' ' + shareData.url).then(() => {
      toastStore.success('分享内容已复制到剪贴板')
    }).catch(() => {
      toastStore.info(shareData.text)
    })
  }
}

onMounted(() => {
  const id = parseInt(route.params.id)
  constellation.value = constellations.find(c => c.id === id)
  
  if (constellation.value) {
    dailyFortune.value = getDailyFortune(id)
  }
})
</script>

<style scoped>
.poster {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 10px;
}

.page-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.poster-content {
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 20px;
}

.poster-preview {
  padding: 25px;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.poster-container {
  display: flex;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}

.poster-card {
  width: 320px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.poster-style-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  color: white;
}

.poster-style-blue {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
  color: white;
}

.poster-style-pink {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #feca57 100%);
  color: white;
}

.poster-style-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: white;
}

.poster-header {
  padding: 25px 25px 15px;
  text-align: center;
}

.poster-date {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.poster-title {
  font-size: 18px;
  font-weight: 700;
}

.poster-main {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
}

.poster-symbol {
  font-size: 48px;
}

.poster-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.poster-date-range {
  font-size: 12px;
  opacity: 0.9;
}

.poster-scores {
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.score-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.score-item:last-child {
  margin-bottom: 0;
}

.score-label {
  width: 40px;
  font-size: 12px;
  font-weight: 500;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.score-value {
  width: 40px;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
}

.poster-lucky {
  display: flex;
  justify-content: space-around;
  padding: 15px 25px;
}

.lucky-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.poster-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.footer-qr {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qr-placeholder {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-icon {
  font-size: 20px;
}

.qr-text {
  font-size: 10px;
  opacity: 0.9;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.brand-icon {
  font-size: 16px;
}

.brand-name {
  font-size: 12px;
  font-weight: 600;
}

.poster-settings {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.settings-title {
  font-size: 16px;
  font-weight: 600;
}

.setting-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.style-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.style-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.style-option * {
  color: var(--text-primary);
}

.style-option:hover {
  border-color: var(--accent-primary);
}

.style-option.selected {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.style-preview {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
}

.style-purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.style-blue {
  background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
}

.style-pink {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.style-orange {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.style-name {
  font-size: 13px;
  font-weight: 500;
}

.content-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--accent-primary);
}

.checkbox-label {
  font-size: 14px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.action-btn.primary {
  background: var(--gradient-1);
  color: white;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px var(--shadow-color);
}

.action-btn.secondary {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
}

.action-btn.secondary:hover {
  border-color: var(--accent-primary);
}

.tips-section {
  padding: 20px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 12px;
}

.tips-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 15px;
}

.tips-list li {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.6;
}

@media (max-width: 768px) {
  .poster {
    padding: 15px 0;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .poster-content {
    grid-template-columns: 1fr;
  }
  
  .style-options {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
