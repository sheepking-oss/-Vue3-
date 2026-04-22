<template>
  <div class="home">
    <div class="container">
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="gradient-text">探索你的星空之旅</span>
          </h1>
          <p class="hero-subtitle">查看今日运势，了解性格特点，发现星座配对</p>
        </div>
      </section>
      
      <section class="constellations-section">
        <div class="section-header">
          <h2 class="section-title">选择你的星座</h2>
          <p class="section-desc">点击星座卡片查看详细运势</p>
        </div>
        
        <div class="constellations-grid">
          <div 
            v-for="c in constellations" 
            :key="c.id"
            class="constellation-card card"
            @click="goToDetail(c.id)"
          >
            <div class="card-header">
              <span class="card-symbol">{{ c.symbol }}</span>
              <button 
                class="favorite-btn"
                @click.stop="toggleFavorite(c.id)"
                :class="{ favorited: appStore.isFavorite(c.id) }"
              >
                {{ appStore.isFavorite(c.id) ? '❤️' : '🤍' }}
              </button>
            </div>
            <div class="card-body">
              <h3 class="card-name">{{ c.name }}</h3>
              <p class="card-date">{{ c.date }}</p>
              <div class="card-info">
                <span class="card-element">{{ c.element }}象星座</span>
                <span class="card-emoji">{{ c.emoji }}</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="card-ruler">守护星：{{ c.ruler }}</span>
            </div>
          </div>
        </div>
      </section>
      
      <section class="quick-actions">
        <div class="section-header">
          <h2 class="section-title">快速功能</h2>
        </div>
        
        <div class="actions-grid">
          <router-link to="/compatibility" class="action-card card">
            <div class="action-icon">💕</div>
            <h3 class="action-title">星座配对</h3>
            <p class="action-desc">测试你和TA的默契程度</p>
          </router-link>
          
          <router-link to="/lucky" class="action-card card">
            <div class="action-icon">🍀</div>
            <h3 class="action-title">幸运指标</h3>
            <p class="action-desc">查看今日幸运数字和颜色</p>
          </router-link>
          
          <router-link to="/favorites" class="action-card card">
            <div class="action-icon">⭐</div>
            <h3 class="action-title">我的收藏</h3>
            <p class="action-desc">查看收藏的星座运势</p>
          </router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { constellations } from '@/data/constellations'
import { useAppStore } from '@/stores'
import { useToastStore } from '@/stores'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const toastStore = useToastStore()
const router = useRouter()

function goToDetail(id) {
  const constellation = constellations.find(c => c.id === id)
  appStore.setCurrentConstellation(constellation)
  router.push(`/constellation/${id}`)
}

function toggleFavorite(id) {
  const constellation = constellations.find(c => c.id === id)
  const wasFavorited = appStore.isFavorite(id)
  appStore.toggleFavorite(id)
  
  if (wasFavorited) {
    toastStore.warning(`已取消收藏 ${constellation.name}`)
  } else {
    toastStore.success(`已收藏 ${constellation.name}`)
  }
}
</script>

<style scoped>
.home {
  padding: 20px 0;
}

.hero-section {
  text-align: center;
  padding: 40px 0;
  margin-bottom: 40px;
}

.hero-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
}

.section-header {
  text-align: center;
  margin-bottom: 30px;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.constellations-section {
  margin-bottom: 50px;
}

.constellations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.constellation-card {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.card-symbol {
  font-size: 36px;
}

.favorite-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--bg-secondary);
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.favorited {
  background: rgba(236, 72, 153, 0.2);
}

.card-body {
  margin-bottom: 15px;
}

.card-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-date {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 10px;
}

.card-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-element {
  font-size: 13px;
  color: var(--accent-primary);
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
}

.card-emoji {
  font-size: 20px;
}

.card-footer {
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.card-ruler {
  font-size: 12px;
  color: var(--text-secondary);
}

.quick-actions {
  margin-bottom: 30px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
  text-decoration: none;
  color: var(--text-primary);
}

.action-card * {
  color: var(--text-primary);
}

.action-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.action-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.action-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .home {
    padding: 15px 0;
  }
  
  .hero-section {
    padding: 30px 0;
    margin-bottom: 30px;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-subtitle {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .constellations-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
