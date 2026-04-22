<template>
  <div class="compatibility">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title gradient-text">💕 星座配对</h1>
        <p class="page-desc">选择两个星座，测试你们的默契程度</p>
      </div>
      
      <div class="selection-section card">
        <div class="selection-content">
          <div class="select-group">
            <label class="select-label">选择第一个星座</label>
            <div class="constellation-selector">
              <div 
                v-for="c in constellations" 
                :key="c.id"
                class="constellation-option"
                :class="{ selected: selected1 === c.id }"
                @click="selected1 = c.id"
              >
                <span class="option-symbol">{{ c.symbol }}</span>
                <span class="option-name">{{ c.name }}</span>
              </div>
            </div>
          </div>
          
          <div class="vs-divider">
            <span class="vs-text">VS</span>
          </div>
          
          <div class="select-group">
            <label class="select-label">选择第二个星座</label>
            <div class="constellation-selector">
              <div 
                v-for="c in constellations" 
                :key="c.id"
                class="constellation-option"
                :class="{ selected: selected2 === c.id }"
                @click="selected2 = c.id"
              >
                <span class="option-symbol">{{ c.symbol }}</span>
                <span class="option-name">{{ c.name }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          class="check-btn btn btn-primary"
          :disabled="!canCheck"
          @click="checkCompatibility"
        >
          <span class="btn-icon">✨</span>
          <span>查看配对结果</span>
        </button>
      </div>
      
      <div v-if="result" class="result-section">
        <div class="result-header card">
          <div class="result-constellations">
            <div class="result-constellation">
              <span class="result-symbol">{{ constellation1.symbol }}</span>
              <span class="result-name">{{ constellation1.name }}</span>
            </div>
            <div class="result-vs">
              <span class="result-heart">💕</span>
            </div>
            <div class="result-constellation">
              <span class="result-symbol">{{ constellation2.symbol }}</span>
              <span class="result-name">{{ constellation2.name }}</span>
            </div>
          </div>
          
          <div class="compatibility-score">
            <div class="score-circle">
              <svg class="score-svg" viewBox="0 0 100 100">
                <circle class="score-bg" cx="50" cy="50" r="45"></circle>
                <circle 
                  class="score-progress" 
                  cx="50" cy="50" r="45"
                  :style="{ strokeDasharray: `${scoreDasharray}, 283` }"
                ></circle>
              </svg>
              <div class="score-inner">
                <span class="score-value">{{ result.score }}</span>
                <span class="score-unit">%</span>
              </div>
            </div>
            <div class="score-level" :class="result.level.replace(' ', '-')">
              {{ result.level }}
            </div>
          </div>
        </div>
        
        <div class="result-details">
          <div class="detail-card card">
            <h3 class="detail-title">🌟 配对分析</h3>
            <p class="detail-text">{{ result.summary }}</p>
          </div>
          
          <div class="detail-card card">
            <h3 class="detail-title">🔄 元素契合</h3>
            <div class="element-info">
              <div class="element-item">
                <span class="element-label">{{ constellation1.name }}</span>
                <span class="element-value">{{ result.element1 }}象星座</span>
              </div>
              <div class="element-arrow">→</div>
              <div class="element-item">
                <span class="element-label">{{ constellation2.name }}</span>
                <span class="element-value">{{ result.element2 }}象星座</span>
              </div>
            </div>
            <p class="element-description">{{ result.elementDescription }}</p>
          </div>
          
          <div class="aspects-grid">
            <div class="aspect-card card">
              <div class="aspect-icon">💕</div>
              <h4 class="aspect-title">爱情配对</h4>
              <p class="aspect-text">{{ result.love }}</p>
            </div>
            
            <div class="aspect-card card">
              <div class="aspect-icon">👫</div>
              <h4 class="aspect-title">友情配对</h4>
              <p class="aspect-text">{{ result.friendship }}</p>
            </div>
            
            <div class="aspect-card card">
              <div class="aspect-icon">💼</div>
              <h4 class="aspect-title">事业合作</h4>
              <p class="aspect-text">{{ result.career }}</p>
            </div>
          </div>
          
          <div class="strengths-challenges">
            <div class="sc-card card">
              <h3 class="sc-title positive">✨ 配对优势</h3>
              <div class="sc-list">
                <div v-for="(item, index) in result.strengths" :key="index" class="sc-item positive">
                  <span class="sc-icon">✓</span>
                  <span class="sc-text">{{ item }}</span>
                </div>
              </div>
            </div>
            
            <div class="sc-card card">
              <h3 class="sc-title negative">⚠️ 需要注意</h3>
              <div class="sc-list">
                <div v-for="(item, index) in result.challenges" :key="index" class="sc-item negative">
                  <span class="sc-icon">!</span>
                  <span class="sc-text">{{ item }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="result-actions card">
          <button class="action-btn" @click="shareResult">
            <span class="action-icon">📤</span>
            <span>分享配对结果</span>
          </button>
          <button class="action-btn" @click="resetSelection">
            <span class="action-icon">🔄</span>
            <span>重新选择</span>
          </button>
        </div>
      </div>
      
      <div v-else class="placeholder-section card">
        <div class="placeholder-icon">🔮</div>
        <h3 class="placeholder-title">选择星座开始配对</h3>
        <p class="placeholder-desc">选择两个星座，我们将为您分析它们的默契程度</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { constellations, getCompatibility } from '@/data/constellations'
import { useToastStore } from '@/stores'

const toastStore = useToastStore()

const selected1 = ref(null)
const selected2 = ref(null)
const result = ref(null)

const canCheck = computed(() => selected1.value && selected2.value && selected1.value !== selected2.value)

const constellation1 = computed(() => constellations.find(c => c.id === selected1.value))
const constellation2 = computed(() => constellations.find(c => c.id === selected2.value))

const scoreDasharray = computed(() => {
  if (!result.value) return 0
  return (result.value.score / 100) * 283
})

function checkCompatibility() {
  if (!canCheck.value) return
  result.value = getCompatibility(selected1.value, selected2.value)
}

function resetSelection() {
  selected1.value = null
  selected2.value = null
  result.value = null
}

function shareResult() {
  const shareData = {
    title: '星座配对结果',
    text: `${constellation1.value.name} vs ${constellation2.value.name} 配对指数：${result.value.score}% - ${result.value.level}`,
    url: window.location.href
  }
  
  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
  } else {
    navigator.clipboard.writeText(shareData.text).then(() => {
      toastStore.success('配对结果已复制到剪贴板')
    }).catch(() => {
      toastStore.info(shareData.text)
    })
  }
}
</script>

<style scoped>
.compatibility {
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

.selection-section {
  margin-bottom: 30px;
  padding: 30px;
}

.selection-content {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 30px;
  align-items: start;
  margin-bottom: 30px;
}

.select-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.select-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.constellation-selector {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.constellation-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 15px 10px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.constellation-option:hover {
  border-color: var(--accent-primary);
  transform: translateY(-2px);
}

.constellation-option.selected {
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--accent-primary);
}

.option-symbol {
  font-size: 28px;
}

.option-name {
  font-size: 13px;
  font-weight: 500;
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-top: 40px;
}

.vs-text {
  font-size: 24px;
  font-weight: 700;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.check-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
}

.check-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.placeholder-section {
  text-align: center;
  padding: 60px 30px;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.placeholder-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.placeholder-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-header {
  padding: 30px;
}

.result-constellations {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 30px;
}

.result-constellation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.result-symbol {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-1);
  border-radius: 50%;
}

.result-name {
  font-size: 16px;
  font-weight: 600;
}

.result-vs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-heart {
  font-size: 32px;
  animation: pulse 1.5s ease-in-out infinite;
}

.compatibility-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.score-circle {
  position: relative;
  width: 150px;
  height: 150px;
}

.score-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-bg {
  fill: none;
  stroke: var(--bg-secondary);
  stroke-width: 8;
}

.score-progress {
  fill: none;
  stroke: url(#scoreGradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 0, 283;
  transition: stroke-dasharray 1s ease;
}

.score-inner {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.score-value {
  font-size: 36px;
  font-weight: 700;
}

.score-unit {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-secondary);
}

.score-level {
  font-size: 18px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 20px;
}

.score-level.天生一对 {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(99, 102, 241, 0.2));
  color: var(--accent-pink);
}

.score-level.非常合拍 {
  background: rgba(99, 102, 241, 0.2);
  color: var(--accent-primary);
}

.score-level.比较合拍 {
  background: rgba(249, 115, 22, 0.2);
  color: var(--accent-orange);
}

.score-level.需要努力,
.score-level.挑战重重 {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.detail-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.element-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.element-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px 20px;
  background: var(--bg-secondary);
  border-radius: 10px;
  flex: 1;
}

.element-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.element-value {
  font-size: 14px;
  font-weight: 500;
}

.element-arrow {
  font-size: 20px;
  color: var(--text-secondary);
}

.element-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.aspects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.aspect-card {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aspect-icon {
  font-size: 32px;
}

.aspect-title {
  font-size: 15px;
  font-weight: 600;
}

.aspect-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.strengths-challenges {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.sc-card {
  padding: 25px;
}

.sc-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.sc-title.positive {
  color: #10b981;
}

.sc-title.negative {
  color: #f59e0b;
}

.sc-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sc-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 8px;
}

.sc-item.positive {
  background: rgba(16, 185, 129, 0.1);
}

.sc-item.negative {
  background: rgba(245, 158, 11, 0.1);
}

.sc-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
}

.sc-item.positive .sc-icon {
  background: #10b981;
  color: white;
}

.sc-item.negative .sc-icon {
  background: #f59e0b;
  color: white;
}

.sc-text {
  font-size: 13px;
}

.result-actions {
  display: flex;
  gap: 15px;
  padding: 20px;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 20px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.action-icon {
  font-size: 18px;
}

@media (max-width: 768px) {
  .compatibility {
    padding: 15px 0;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .selection-section {
    padding: 20px;
  }
  
  .selection-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .vs-divider {
    padding-top: 0;
    justify-content: center;
  }
  
  .constellation-selector {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .result-constellations {
    gap: 15px;
  }
  
  .result-symbol {
    font-size: 36px;
    width: 64px;
    height: 64px;
  }
  
  .aspects-grid {
    grid-template-columns: 1fr;
  }
  
  .strengths-challenges {
    grid-template-columns: 1fr;
  }
  
  .result-actions {
    flex-direction: column;
  }
}
</style>
