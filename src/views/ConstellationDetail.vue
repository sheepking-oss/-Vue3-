<template>
  <div class="constellation-detail" v-if="constellation">
    <div class="container">
      <div class="back-btn" @click="$router.back()">
        <span class="back-icon">←</span>
        <span>返回</span>
      </div>
      
      <div class="detail-header">
        <div class="header-left">
          <div class="constellation-symbol">{{ constellation.symbol }}</div>
          <div class="constellation-info">
            <h1 class="constellation-name">{{ constellation.name }}</h1>
            <p class="constellation-date">{{ constellation.date }}</p>
            <div class="constellation-tags">
              <span class="tag element-tag">{{ constellation.element }}象星座</span>
              <span class="tag quality-tag">{{ constellation.quality }}</span>
            </div>
          </div>
        </div>
        
        <div class="header-right">
          <button 
            class="action-btn"
            @click="toggleFavorite"
            :class="{ favorited: isFavorited }"
          >
            <span class="action-icon">{{ isFavorited ? '❤️' : '🤍' }}</span>
            <span>{{ isFavorited ? '已收藏' : '收藏' }}</span>
          </button>
          <button class="action-btn" @click="goToPoster">
            <span class="action-icon">🖼️</span>
            <span>生成海报</span>
          </button>
          <button class="action-btn" @click="share">
            <span class="action-icon">📤</span>
            <span>分享</span>
          </button>
        </div>
      </div>
      
      <div class="tab-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          class="tab-btn"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <div class="tab-content">
        <div v-if="activeTab === 'daily'" class="fortune-section">
          <div class="scores-grid">
            <div v-for="(score, key) in dailyFortune.scores" :key="key" class="score-card card">
              <div class="score-header">
                <span class="score-label">{{ getScoreLabel(key) }}</span>
                <span class="score-value">{{ score }}%</span>
              </div>
              <div class="score-bar">
                <div class="score-fill" :style="{ width: score + '%', background: getScoreColor(score) }"></div>
              </div>
            </div>
          </div>
          
          <div class="fortune-details">
            <div v-for="(text, key) in dailyFortune.texts" :key="key" class="detail-card card">
              <h3 class="detail-title">{{ getDetailTitle(key) }}</h3>
              <p class="detail-text">{{ text }}</p>
            </div>
          </div>
        </div>
        
        <div v-if="activeTab === 'weekly'" class="fortune-section">
          <div class="week-header">
            <h3>本周运势</h3>
            <p class="week-range">{{ weeklyFortune.weekStart }} - {{ weeklyFortune.weekEnd }}</p>
          </div>
          
          <div class="week-chart card">
            <div class="chart-header">
              <span class="chart-legend-item">
                <span class="legend-dot" style="background: var(--accent-pink)"></span>
                <span>综合</span>
              </span>
              <span class="chart-legend-item">
                <span class="legend-dot" style="background: var(--accent-primary)"></span>
                <span>爱情</span>
              </span>
              <span class="chart-legend-item">
                <span class="legend-dot" style="background: var(--accent-orange)"></span>
                <span>事业</span>
              </span>
              <span class="chart-legend-item">
                <span class="legend-dot" style="background: #10b981"></span>
                <span>财运</span>
              </span>
            </div>
            
            <div class="chart-container">
              <div v-for="(day, index) in weeklyFortune.dailyData" :key="index" class="chart-day">
                <div class="chart-bars">
                  <div class="bar overall" :style="{ height: day.overall + '%' }" :title="'综合: ' + day.overall + '%'"></div>
                  <div class="bar love" :style="{ height: day.love + '%' }" :title="'爱情: ' + day.love + '%'"></div>
                  <div class="bar career" :style="{ height: day.career + '%' }" :title="'事业: ' + day.career + '%'"></div>
                  <div class="bar wealth" :style="{ height: day.wealth + '%' }" :title="'财运: ' + day.wealth + '%'"></div>
                </div>
                <div class="chart-label">{{ day.day }}</div>
              </div>
            </div>
          </div>
          
          <div class="week-summary card">
            <h3 class="summary-title">本周总结</h3>
            <p class="summary-text">{{ weeklyFortune.summary }}</p>
          </div>
        </div>
        
        <div v-if="activeTab === 'monthly'" class="fortune-section">
          <div class="month-header">
            <h3>{{ monthlyFortune.year }}年 {{ monthlyFortune.month }}运势</h3>
          </div>
          
          <div class="month-overview card">
            <div class="overview-scores">
              <div class="overview-score">
                <span class="overview-label">综合运势</span>
                <span class="overview-value">{{ monthlyFortune.overall }}%</span>
              </div>
              <div class="overview-score">
                <span class="overview-label">爱情运势</span>
                <span class="overview-value">{{ monthlyFortune.love }}%</span>
              </div>
              <div class="overview-score">
                <span class="overview-label">事业运势</span>
                <span class="overview-value">{{ monthlyFortune.career }}%</span>
              </div>
              <div class="overview-score">
                <span class="overview-label">财富运势</span>
                <span class="overview-value">{{ monthlyFortune.wealth }}%</span>
              </div>
            </div>
          </div>
          
          <div class="month-phases">
            <h3 class="phases-title">本月运势阶段</h3>
            <div class="phases-grid">
              <div v-for="phase in monthlyFortune.phases" :key="phase.period" class="phase-card card">
                <div class="phase-header">
                  <span class="phase-period">{{ phase.period }}</span>
                  <span class="phase-theme">{{ phase.theme }}</span>
                </div>
                <p class="phase-description">{{ phase.description }}</p>
                <div class="phase-scores">
                  <div class="phase-score-item">
                    <span class="phase-score-label">综合</span>
                    <span class="phase-score-value">{{ phase.overall }}%</span>
                  </div>
                  <div class="phase-score-item">
                    <span class="phase-score-label">爱情</span>
                    <span class="phase-score-value">{{ phase.love }}%</span>
                  </div>
                  <div class="phase-score-item">
                    <span class="phase-score-label">事业</span>
                    <span class="phase-score-value">{{ phase.career }}%</span>
                  </div>
                  <div class="phase-score-item">
                    <span class="phase-score-label">财运</span>
                    <span class="phase-score-value">{{ phase.wealth }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="key-events card">
            <h3 class="events-title">本月重要节点</h3>
            <div class="events-list">
              <div v-for="event in monthlyFortune.keyEvents" :key="event.date" class="event-item">
                <span class="event-date">{{ event.date }}</span>
                <span class="event-text">{{ event.event }}</span>
              </div>
            </div>
          </div>
          
          <div class="month-summary card">
            <h3 class="summary-title">本月总结</h3>
            <p class="summary-text">{{ monthlyFortune.summary }}</p>
          </div>
        </div>
      </div>
      
      <div class="quick-links card">
        <h3 class="links-title">更多服务</h3>
        <div class="links-grid">
          <router-link :to="`/personality/${constellation.id}`" class="link-item">
            <span class="link-icon">📊</span>
            <span class="link-text">性格分析</span>
          </router-link>
          <router-link to="/compatibility" class="link-item">
            <span class="link-icon">💕</span>
            <span class="link-text">星座配对</span>
          </router-link>
          <router-link :to="`/poster/${constellation.id}`" class="link-item">
            <span class="link-icon">🖼️</span>
            <span class="link-text">生成海报</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { constellations, getDailyFortune, getWeeklyFortune, getMonthlyFortune } from '@/data/constellations'
import { useAppStore } from '@/stores'
import { useToastStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const toastStore = useToastStore()

const constellation = ref(null)
const activeTab = ref('daily')
const dailyFortune = ref(null)
const weeklyFortune = ref(null)
const monthlyFortune = ref(null)

const tabs = [
  { label: '今日运势', value: 'daily' },
  { label: '本周运势', value: 'weekly' },
  { label: '本月运势', value: 'monthly' }
]

const isFavorited = computed(() => {
  return constellation.value ? appStore.isFavorite(constellation.value.id) : false
})

function getScoreLabel(key) {
  const labels = {
    overall: '综合运势',
    love: '爱情运势',
    career: '事业运势',
    wealth: '财富运势',
    health: '健康运势'
  }
  return labels[key] || key
}

function getDetailTitle(key) {
  const titles = {
    love: '💖 爱情运势',
    career: '💼 事业运势',
    wealth: '💰 财富运势',
    health: '🏃 健康运势',
    lucky: '🍀 今日幸运'
  }
  return titles[key] || key
}

function getScoreColor(score) {
  if (score >= 80) return 'var(--gradient-1)'
  if (score >= 60) return 'var(--accent-orange)'
  return '#f59e0b'
}

function toggleFavorite() {
  if (!constellation.value) return
  
  const wasFavorited = isFavorited.value
  appStore.toggleFavorite(constellation.value.id)
  
  if (wasFavorited) {
    toastStore.warning(`已取消收藏 ${constellation.value.name}`)
  } else {
    toastStore.success(`已收藏 ${constellation.value.name}`)
  }
}

function goToPoster() {
  router.push(`/poster/${constellation.value.id}`)
}

function share() {
  const shareData = {
    title: `${constellation.value.name}今日运势`,
    text: `查看${constellation.value.name}今日运势，综合指数${dailyFortune.value.scores.overall}%`,
    url: window.location.href
  }
  
  if (navigator.share) {
    navigator.share(shareData).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toastStore.success('链接已复制到剪贴板')
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
    weeklyFortune.value = getWeeklyFortune(id)
    monthlyFortune.value = getMonthlyFortune(id)
    appStore.setCurrentConstellation(constellation.value)
  }
})
</script>

<style scoped>
.constellation-detail {
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

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  padding: 24px;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border-color);
}

.header-left {
  display: flex;
  gap: 20px;
  align-items: center;
}

.constellation-symbol {
  font-size: 64px;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-1);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.constellation-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.constellation-name {
  font-size: 32px;
  font-weight: 700;
}

.constellation-date {
  font-size: 16px;
  color: var(--text-secondary);
}

.constellation-tags {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

.tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
}

.element-tag {
  background: rgba(99, 102, 241, 0.2);
  color: var(--accent-primary);
}

.quality-tag {
  background: rgba(236, 72, 153, 0.2);
  color: var(--accent-pink);
}

.header-right {
  display: flex;
  gap: 10px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.action-btn:hover {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: white;
}

.action-btn.favorited {
  background: rgba(236, 72, 153, 0.2);
  border-color: var(--accent-pink);
}

.action-icon {
  font-size: 24px;
}

.tab-nav {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  overflow-x: auto;
  padding-bottom: 10px;
}

.tab-btn {
  padding: 12px 24px;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: var(--accent-primary);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--gradient-1);
  border-color: transparent;
  color: white;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.score-card {
  padding: 20px;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.score-value {
  font-size: 18px;
  font-weight: 600;
}

.score-bar {
  height: 8px;
  background: var(--bg-secondary);
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.fortune-details {
  display: grid;
  gap: 15px;
}

.detail-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
}

.detail-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.week-header,
.month-header {
  margin-bottom: 20px;
}

.week-header h3,
.month-header h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
}

.week-range {
  font-size: 14px;
  color: var(--text-secondary);
}

.chart-header {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.chart-container {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  height: 200px;
}

.chart-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.chart-bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  width: 100%;
}

.bar {
  flex: 1;
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  min-height: 5px;
}

.bar.overall {
  background: var(--accent-pink);
}

.bar.love {
  background: var(--accent-primary);
}

.bar.career {
  background: var(--accent-orange);
}

.bar.wealth {
  background: #10b981;
}

.chart-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.week-summary,
.month-summary,
.key-events {
  margin-top: 20px;
}

.summary-title,
.events-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.summary-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.8;
}

.month-overview {
  margin-bottom: 20px;
}

.overview-scores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.overview-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.overview-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.overview-value {
  font-size: 28px;
  font-weight: 700;
  background: var(--gradient-1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.month-phases {
  margin-bottom: 20px;
}

.phases-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
}

.phases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.phase-period {
  font-size: 16px;
  font-weight: 600;
}

.phase-theme {
  font-size: 12px;
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.phase-description {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 15px;
}

.phase-scores {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.phase-score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.phase-score-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.phase-score-value {
  font-size: 14px;
  font-weight: 600;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.event-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 10px;
}

.event-date {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-primary);
  min-width: 60px;
}

.event-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.quick-links {
  margin-top: 30px;
}

.links-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.link-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.link-item:hover {
  background: var(--accent-primary);
  color: white;
  transform: translateY(-3px);
}

.link-icon {
  font-size: 28px;
}

.link-text {
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .constellation-detail {
    padding: 15px 0;
  }
  
  .detail-header {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .header-right {
    width: 100%;
    justify-content: center;
  }
  
  .action-btn {
    flex: 1;
    flex-direction: row;
    min-width: auto;
  }
  
  .constellation-name {
    font-size: 26px;
  }
  
  .scores-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .chart-container {
    gap: 5px;
  }
  
  .chart-bars {
    gap: 2px;
  }
  
  .overview-scores {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
