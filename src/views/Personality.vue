<template>
  <div class="personality" v-if="constellation">
    <div class="container">
      <div class="back-btn" @click="$router.back()">
        <span class="back-icon">←</span>
        <span>返回</span>
      </div>
      
      <div class="personality-header card">
        <div class="header-content">
          <div class="constellation-symbol">{{ constellation.symbol }}</div>
          <div class="constellation-info">
            <h1 class="constellation-name">{{ constellation.name }}性格分析</h1>
            <p class="constellation-date">{{ constellation.date }}</p>
            <div class="constellation-stats">
              <span class="stat-item">
                <span class="stat-label">元素：</span>
                <span class="stat-value">{{ constellation.element }}象星座</span>
              </span>
              <span class="stat-item">
                <span class="stat-label">特质：</span>
                <span class="stat-value">{{ constellation.quality }}</span>
              </span>
              <span class="stat-item">
                <span class="stat-label">守护星：</span>
                <span class="stat-value">{{ constellation.ruler }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="strengths-weaknesses">
        <div class="section-card card">
          <h3 class="section-title positive">✨ 优点</h3>
          <div class="trait-list">
            <div v-for="(trait, index) in personality.strengths" :key="index" class="trait-item positive">
              <span class="trait-icon">✓</span>
              <span class="trait-text">{{ trait }}</span>
            </div>
          </div>
        </div>
        
        <div class="section-card card">
          <h3 class="section-title negative">⚠️ 缺点</h3>
          <div class="trait-list">
            <div v-for="(trait, index) in personality.weaknesses" :key="index" class="trait-item negative">
              <span class="trait-icon">!</span>
              <span class="trait-text">{{ trait }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="summary-section card">
        <h3 class="section-title">📖 性格概要</h3>
        <p class="summary-text">{{ personality.summary }}</p>
      </div>
      
      <div class="lifestyle-section">
        <div class="lifestyle-card card">
          <div class="card-icon">💼</div>
          <h3 class="card-title">事业发展</h3>
          <p class="card-text">{{ personality.career }}</p>
          <div class="career-tags">
            <span v-for="tag in getCareerTags(constellation.element)" :key="tag" class="career-tag">{{ tag }}</span>
          </div>
        </div>
        
        <div class="lifestyle-card card">
          <div class="card-icon">💕</div>
          <h3 class="card-title">爱情观</h3>
          <p class="card-text">{{ personality.love }}</p>
          <div class="love-traits">
            <div class="love-trait">
              <span class="trait-label">最配星座：</span>
              <span class="trait-value">{{ getBestMatch(constellation.id) }}</span>
            </div>
            <div class="love-trait">
              <span class="trait-label">恋爱风格：</span>
              <span class="trait-value">{{ getLoveStyle(constellation.element) }}</span>
            </div>
          </div>
        </div>
        
        <div class="lifestyle-card card">
          <div class="card-icon">💰</div>
          <h3 class="card-title">理财观念</h3>
          <p class="card-text">{{ personality.finance }}</p>
          <div class="finance-info">
            <div class="finance-item">
              <span class="finance-label">投资风格：</span>
              <span class="finance-value">{{ getFinanceStyle(constellation.element) }}</span>
            </div>
            <div class="finance-item">
              <span class="finance-label">幸运数字：</span>
              <span class="finance-value">{{ constellation.luckyNumber.join(', ') }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="lucky-section card">
        <h3 class="section-title">🍀 幸运元素</h3>
        <div class="lucky-grid">
          <div class="lucky-item">
            <span class="lucky-icon">🎨</span>
            <span class="lucky-label">幸运颜色</span>
            <div class="lucky-colors">
              <span v-for="color in constellation.luckyColor" :key="color" class="color-tag">{{ color }}</span>
            </div>
          </div>
          <div class="lucky-item">
            <span class="lucky-icon">🔢</span>
            <span class="lucky-label">幸运数字</span>
            <div class="lucky-numbers">
              <span v-for="num in constellation.luckyNumber" :key="num" class="number-tag">{{ num }}</span>
            </div>
          </div>
          <div class="lucky-item">
            <span class="lucky-icon">💎</span>
            <span class="lucky-label">幸运宝石</span>
            <span class="lucky-value">{{ constellation.luckyStone }}</span>
          </div>
          <div class="lucky-item">
            <span class="lucky-icon">🧭</span>
            <span class="lucky-label">幸运方位</span>
            <span class="lucky-value">{{ constellation.luckyDirection }}</span>
          </div>
        </div>
      </div>
      
      <div class="related-section">
        <h3 class="related-title">相关服务</h3>
        <div class="related-grid">
          <router-link :to="`/constellation/${constellation.id}`" class="related-card card">
            <span class="related-icon">📅</span>
            <span class="related-text">查看今日运势</span>
          </router-link>
          <router-link to="/compatibility" class="related-card card">
            <span class="related-icon">💕</span>
            <span class="related-text">测试星座配对</span>
          </router-link>
          <router-link :to="`/poster/${constellation.id}`" class="related-card card">
            <span class="related-icon">🖼️</span>
            <span class="related-text">生成运势海报</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { constellations, personalityData } from '@/data/constellations'

const route = useRoute()

const constellation = ref(null)
const personality = ref(null)

function getCareerTags(element) {
  const tags = {
    '火': ['销售', '管理', '创业', '体育'],
    '土': ['金融', '房地产', '艺术', '餐饮'],
    '风': ['媒体', '教育', '公关', '写作'],
    '水': ['医疗', '教育', '社工', '艺术']
  }
  return tags[element] || []
}

function getBestMatch(id) {
  const matches = {
    1: '狮子座、射手座',
    2: '处女座、摩羯座',
    3: '天秤座、水瓶座',
    4: '天蝎座、双鱼座',
    5: '白羊座、射手座',
    6: '金牛座、摩羯座',
    7: '双子座、水瓶座',
    8: '巨蟹座、双鱼座',
    9: '白羊座、狮子座',
    10: '金牛座、处女座',
    11: '双子座、天秤座',
    12: '巨蟹座、天蝎座'
  }
  return matches[id] || '查看配对详情'
}

function getLoveStyle(element) {
  const styles = {
    '火': '热情直接，追求浪漫刺激',
    '土': '稳重务实，追求长久稳定',
    '风': '有趣多变，追求精神共鸣',
    '水': '温柔敏感，追求深度连接'
  }
  return styles[element] || ''
}

function getFinanceStyle(element) {
  const styles = {
    '火': '激进大胆，追求高回报',
    '土': '稳健保守，注重安全性',
    '风': '灵活多变，喜欢新鲜事物',
    '水': '感性冲动，需要理性规划'
  }
  return styles[element] || ''
}

onMounted(() => {
  const id = parseInt(route.params.id)
  constellation.value = constellations.find(c => c.id === id)
  personality.value = personalityData[id]
})
</script>

<style scoped>
.personality {
  padding: 20px 0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: var(--accent-primary);
  color: white;
}

.personality-header {
  margin-bottom: 30px;
}

.header-content {
  display: flex;
  gap: 30px;
  align-items: center;
}

.constellation-symbol {
  font-size: 64px;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-1);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.constellation-name {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.constellation-date {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.constellation-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  color: var(--accent-primary);
  font-weight: 500;
}

.strengths-weaknesses {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.section-card {
  padding: 25px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.section-title.positive {
  color: #10b981;
}

.section-title.negative {
  color: #f59e0b;
}

.trait-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.trait-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
}

.trait-item.positive {
  background: rgba(16, 185, 129, 0.1);
}

.trait-item.negative {
  background: rgba(245, 158, 11, 0.1);
}

.trait-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
}

.trait-item.positive .trait-icon {
  background: #10b981;
  color: white;
}

.trait-item.negative .trait-icon {
  background: #f59e0b;
  color: white;
}

.trait-text {
  font-size: 14px;
}

.summary-section {
  margin-bottom: 30px;
}

.summary-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.lifestyle-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.lifestyle-card {
  padding: 25px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.card-icon {
  font-size: 36px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.card-text {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.career-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 5px;
}

.career-tag {
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  border-radius: 20px;
  font-size: 12px;
}

.love-traits,
.finance-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
}

.love-trait,
.finance-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.trait-label,
.finance-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.trait-value,
.finance-value {
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-primary);
}

.lucky-section {
  margin-bottom: 30px;
}

.lucky-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.lucky-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.lucky-icon {
  font-size: 32px;
}

.lucky-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.lucky-value {
  font-size: 14px;
  font-weight: 500;
}

.lucky-colors,
.lucky-numbers {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.color-tag,
.number-tag {
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.related-section {
  margin-bottom: 20px;
}

.related-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.related-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 25px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.related-card * {
  color: var(--text-primary);
}

.related-card:hover {
  background: var(--accent-primary);
  color: white;
  transform: translateY(-3px);
}

.related-icon {
  font-size: 32px;
}

.related-text {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .personality {
    padding: 15px 0;
  }
  
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .constellation-stats {
    justify-content: center;
  }
  
  .strengths-weaknesses {
    grid-template-columns: 1fr;
  }
  
  .lifestyle-section {
    grid-template-columns: 1fr;
  }
  
  .lucky-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
