<template>
  <div class="lucky">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title gradient-text">🍀 幸运指标</h1>
        <p class="page-desc">选择你的星座，查看今日幸运元素</p>
      </div>
      
      <div class="constellation-select card">
        <label class="select-label">选择你的星座</label>
        <div class="constellation-grid">
          <div 
            v-for="c in constellations" 
            :key="c.id"
            class="constellation-item"
            :class="{ selected: selectedId === c.id }"
            @click="selectConstellation(c.id)"
          >
            <span class="item-symbol">{{ c.symbol }}</span>
            <span class="item-name">{{ c.name }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="constellation" class="lucky-info">
        <div class="constellation-card card">
          <div class="constellation-header">
            <div class="header-left">
              <span class="constellation-symbol">{{ constellation.symbol }}</span>
              <div class="constellation-info">
                <h2 class="constellation-name">{{ constellation.name }}</h2>
                <p class="constellation-date">{{ constellation.date }}</p>
              </div>
            </div>
            <div class="header-right">
              <span class="element-tag">{{ constellation.element }}象星座</span>
            </div>
          </div>
        </div>
        
        <div class="lucky-grid">
          <div class="lucky-card card">
            <div class="card-header">
              <span class="card-icon">🔢</span>
              <h3 class="card-title">幸运数字</h3>
            </div>
            <div class="numbers-display">
              <div 
                v-for="num in constellation.luckyNumber" 
                :key="num" 
                class="number-item"
                :style="{ background: getNumberGradient(num) }"
              >
                {{ num }}
              </div>
            </div>
            <p class="card-tip">今天遇到这些数字时，可能会有好运哦！</p>
          </div>
          
          <div class="lucky-card card">
            <div class="card-header">
              <span class="card-icon">🎨</span>
              <h3 class="card-title">幸运颜色</h3>
            </div>
            <div class="colors-display">
              <div 
                v-for="(color, index) in constellation.luckyColor" 
                :key="color" 
                class="color-item"
              >
                <div class="color-swatch" :style="{ background: getColorValue(color) }"></div>
                <span class="color-name">{{ color }}</span>
              </div>
            </div>
            <p class="card-tip">今天穿着这些颜色的衣服，可能会提升你的运势！</p>
          </div>
          
          <div class="lucky-card card">
            <div class="card-header">
              <span class="card-icon">💎</span>
              <h3 class="card-title">幸运宝石</h3>
            </div>
            <div class="gem-display">
              <div class="gem-icon">{{ getGemEmoji(constellation.luckyStone) }}</div>
              <span class="gem-name">{{ constellation.luckyStone }}</span>
            </div>
            <p class="card-tip">佩戴{{ constellation.luckyStone }}饰品，可以增加你的好运气场！</p>
          </div>
          
          <div class="lucky-card card">
            <div class="card-header">
              <span class="card-icon">🧭</span>
              <h3 class="card-title">幸运方位</h3>
            </div>
            <div class="direction-display">
              <div class="compass">
                <div class="compass-needle" :style="{ transform: getDirectionRotation(constellation.luckyDirection) }">
                  <span class="needle-tip">▲</span>
                </div>
                <div class="compass-center">●</div>
              </div>
              <span class="direction-name">{{ constellation.luckyDirection }}</span>
            </div>
            <p class="card-tip">今天面向{{ constellation.luckyDirection }}行事，可能会更加顺利！</p>
          </div>
        </div>
        
        <div class="daily-lucky card">
          <h3 class="section-title">📅 今日额外幸运提示</h3>
          <div class="daily-tips">
            <div class="tip-item">
              <span class="tip-icon">⏰</span>
              <div class="tip-content">
                <span class="tip-label">吉时</span>
                <span class="tip-value">{{ getLuckyTime(constellation.id) }}</span>
              </div>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🍽️</span>
              <div class="tip-content">
                <span class="tip-label">幸运食物</span>
                <span class="tip-value">{{ getLuckyFood(constellation.element) }}</span>
              </div>
            </div>
            <div class="tip-item">
              <span class="tip-icon">🎯</span>
              <div class="tip-content">
                <span class="tip-label">适宜活动</span>
                <span class="tip-value">{{ getLuckyActivity(constellation.quality) }}</span>
              </div>
            </div>
            <div class="tip-item">
              <span class="tip-icon">💬</span>
              <div class="tip-content">
                <span class="tip-label">贵人星座</span>
                <span class="tip-value">{{ getLuckyPartner(constellation.id) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="lucky-quote card">
          <div class="quote-icon">💫</div>
          <p class="quote-text">{{ getLuckyQuote(constellation.element) }}</p>
          <p class="quote-author">— 今日运势箴言</p>
        </div>
      </div>
      
      <div v-else class="placeholder card">
        <div class="placeholder-icon">🔮</div>
        <h3 class="placeholder-title">选择星座查看幸运指标</h3>
        <p class="placeholder-desc">从上方选择你的星座，我们将为您展示今日的幸运元素</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { constellations } from '@/data/constellations'

const selectedId = ref(null)

const constellation = computed(() => {
  return constellations.find(c => c.id === selectedId.value)
})

function selectConstellation(id) {
  selectedId.value = id
}

function getNumberGradient(num) {
  const gradients = [
    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
    'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)'
  ]
  return gradients[num % gradients.length]
}

function getColorValue(color) {
  const colorMap = {
    '红色': '#ef4444',
    '橙色': '#f97316',
    '黄色': '#eab308',
    '绿色': '#22c55e',
    '蓝色': '#3b82f6',
    '紫色': '#8b5cf6',
    '粉色': '#ec4899',
    '白色': '#ffffff',
    '银色': '#c0c0c0',
    '金色': '#fbbf24',
    '灰色': '#6b7280',
    '米色': '#f5f5dc',
    '黑色': '#1f2937',
    '咖啡色': '#795548',
    '古铜色': '#b87333',
    '海蓝色': '#006994',
    '深红色': '#8b0000'
  }
  return colorMap[color] || '#6366f1'
}

function getGemEmoji(stone) {
  const gemMap = {
    '红宝石': '💎',
    '翡翠': '💚',
    '玛瑙': '🔴',
    '珍珠': '⚪',
    '琥珀': '🟡',
    '蓝宝石': '🔵',
    '钻石': '💎',
    '黑水晶': '🖤',
    '绿松石': '🟢',
    '黑玉': '⬛',
    '紫水晶': '💜',
    '血石': '❤️'
  }
  return gemMap[stone] || '💎'
}

function getDirectionRotation(direction) {
  const directionMap = {
    '东方': 'rotate(-90deg)',
    '西方': 'rotate(90deg)',
    '北方': 'rotate(0deg)',
    '南方': 'rotate(180deg)',
    '东南方': 'rotate(-135deg)',
    '西北方': 'rotate(45deg)',
    '东北方': 'rotate(-45deg)',
    '西南方': 'rotate(135deg)'
  }
  return directionMap[direction] || 'rotate(0deg)'
}

function getLuckyTime(id) {
  const times = [
    '06:00 - 08:00, 18:00 - 20:00',
    '09:00 - 11:00, 14:00 - 16:00',
    '07:00 - 09:00, 15:00 - 17:00',
    '08:00 - 10:00, 16:00 - 18:00',
    '05:00 - 07:00, 11:00 - 13:00',
    '10:00 - 12:00, 17:00 - 19:00',
    '06:00 - 08:00, 19:00 - 21:00',
    '09:00 - 11:00, 20:00 - 22:00',
    '07:00 - 09:00, 13:00 - 15:00',
    '08:00 - 10:00, 14:00 - 16:00',
    '06:00 - 08:00, 17:00 - 19:00',
    '09:00 - 11:00, 16:00 - 18:00'
  ]
  return times[(id - 1) % times.length]
}

function getLuckyFood(element) {
  const foods = {
    '火': '辛辣食物、烧烤、坚果',
    '土': '根茎类蔬菜、面包、甜品',
    '风': '绿叶蔬菜、水果、海鲜',
    '水': '鱼类、海鲜、汤类、多汁水果'
  }
  return foods[element] || '新鲜蔬果'
}

function getLuckyActivity(quality) {
  const activities = {
    '开创': '开始新项目、主动出击、领导决策',
    '固定': '稳固现有项目、深耕细作、坚持到底',
    '变动': '灵活应变、学习新知识、社交活动'
  }
  return activities[quality] || '保持积极心态'
}

function getLuckyPartner(id) {
  const partners = {
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
  return partners[id] || '寻找同频的伙伴'
}

function getLuckyQuote(element) {
  const quotes = {
    '火': '热情如火，勇往直前，今日是你展现自我的最佳时机！',
    '土': '脚踏实地，稳扎稳打，今日的付出终将结出硕果。',
    '风': '思维敏捷，灵活应变，今日适合交流与学习。',
    '水': '倾听内心，相信直觉，今日你的第六感特别敏锐。'
  }
  return quotes[element] || '保持积极心态，好运自然来！'
}
</script>

<style scoped>
.lucky {
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

.constellation-select {
  margin-bottom: 30px;
  padding: 25px;
}

.select-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.constellation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
}

.constellation-item {
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

.constellation-item:hover {
  border-color: var(--accent-primary);
  transform: translateY(-3px);
}

.constellation-item.selected {
  background: rgba(99, 102, 241, 0.2);
  border-color: var(--accent-primary);
  box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
}

.item-symbol {
  font-size: 32px;
}

.item-name {
  font-size: 13px;
  font-weight: 500;
}

.placeholder {
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

.lucky-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.constellation-card {
  padding: 25px;
}

.constellation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  gap: 20px;
  align-items: center;
}

.constellation-symbol {
  font-size: 48px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--gradient-1);
  border-radius: 50%;
  animation: float 3s ease-in-out infinite;
}

.constellation-name {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.constellation-date {
  font-size: 14px;
  color: var(--text-secondary);
}

.element-tag {
  padding: 8px 16px;
  background: rgba(99, 102, 241, 0.2);
  color: var(--accent-primary);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}

.lucky-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.lucky-card {
  padding: 25px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.card-icon {
  font-size: 28px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
}

.numbers-display {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 15px;
}

.number-item {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 20px;
  font-weight: 700;
  color: white;
  box-shadow: 0 5px 20px rgba(99, 102, 241, 0.4);
  animation: pulse 2s ease-in-out infinite;
}

.colors-display {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 15px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 3px solid var(--bg-secondary);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.color-name {
  font-size: 12px;
  font-weight: 500;
}

.gem-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.gem-icon {
  font-size: 48px;
  animation: pulse 2s ease-in-out infinite;
}

.gem-name {
  font-size: 14px;
  font-weight: 600;
}

.direction-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.compass {
  position: relative;
  width: 80px;
  height: 80px;
  border: 3px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.compass-needle {
  position: absolute;
  width: 2px;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.5s ease;
}

.needle-tip {
  font-size: 16px;
  color: var(--accent-pink);
  margin-bottom: 20px;
}

.compass-center {
  font-size: 12px;
  color: var(--accent-primary);
}

.direction-name {
  font-size: 14px;
  font-weight: 600;
}

.card-tip {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}

.daily-lucky {
  padding: 25px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.daily-tips {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: var(--bg-secondary);
  border-radius: 12px;
}

.tip-icon {
  font-size: 24px;
}

.tip-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.tip-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.tip-value {
  font-size: 13px;
  font-weight: 500;
}

.lucky-quote {
  padding: 30px;
  text-align: center;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
}

.quote-icon {
  font-size: 36px;
  margin-bottom: 15px;
}

.quote-text {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.8;
  margin-bottom: 10px;
}

.quote-author {
  font-size: 12px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .lucky {
    padding: 15px 0;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .constellation-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .constellation-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .header-left {
    flex-direction: column;
    text-align: center;
  }
  
  .lucky-grid {
    grid-template-columns: 1fr;
  }
  
  .daily-tips {
    grid-template-columns: 1fr;
  }
}
</style>
