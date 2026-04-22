<template>
  <div class="favorites">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title gradient-text">⭐ 我的收藏</h1>
        <p class="page-desc">已收藏 {{ appStore.favorites.length }} 个星座</p>
      </div>
      
      <div v-if="favoritesList.length > 0" class="favorites-content">
        <div class="favorites-grid">
          <div 
            v-for="c in favoritesList" 
            :key="c.id"
            class="favorite-card card"
            @click="goToDetail(c.id)"
          >
            <div class="card-header">
              <span class="card-symbol">{{ c.symbol }}</span>
              <button 
                class="remove-btn"
                @click.stop="removeFavorite(c)"
                title="取消收藏"
              >
                ×
              </button>
            </div>
            <div class="card-body">
              <h3 class="card-name">{{ c.name }}</h3>
              <p class="card-date">{{ c.date }}</p>
              <div class="card-tags">
                <span class="tag">{{ c.element }}象</span>
                <span class="tag">{{ c.quality }}</span>
              </div>
            </div>
            <div class="card-actions">
              <router-link :to="`/constellation/${c.id}`" class="action-link" @click.stop>
                <span class="link-icon">📅</span>
                <span>今日运势</span>
              </router-link>
              <router-link :to="`/personality/${c.id}`" class="action-link" @click.stop>
                <span class="link-icon">📊</span>
                <span>性格分析</span>
              </router-link>
              <router-link :to="`/poster/${c.id}`" class="action-link" @click.stop>
                <span class="link-icon">🖼️</span>
                <span>生成海报</span>
              </router-link>
            </div>
          </div>
        </div>
        
        <div v-if="appStore.favorites.length > 1" class="compare-section card">
          <h3 class="section-title">💕 配对比较</h3>
          <p class="section-desc">选择两个收藏的星座进行配对分析</p>
          
          <div class="compare-select">
            <div class="select-group">
              <label class="select-label">选择第一个星座</label>
              <select v-model="compare1" class="select-input">
                <option value="">请选择</option>
                <option v-for="c in favoritesList" :key="c.id" :value="c.id">
                  {{ c.symbol }} {{ c.name }}
                </option>
              </select>
            </div>
            
            <div class="vs-text">VS</div>
            
            <div class="select-group">
              <label class="select-label">选择第二个星座</label>
              <select v-model="compare2" class="select-input">
                <option value="">请选择</option>
                <option v-for="c in favoritesList" :key="c.id" :value="c.id">
                  {{ c.symbol }} {{ c.name }}
                </option>
              </select>
            </div>
          </div>
          
          <button 
            class="compare-btn btn btn-primary"
            :disabled="!canCompare"
            @click="goToCompare"
          >
            <span class="btn-icon">✨</span>
            <span>查看配对结果</span>
          </button>
        </div>
        
        <div class="actions-bar card">
          <button class="clear-btn" @click="clearAll" v-if="appStore.favorites.length > 0">
            <span class="btn-icon">🗑️</span>
            <span>清空所有收藏</span>
          </button>
        </div>
      </div>
      
      <div v-else class="empty-state card">
        <div class="empty-icon">💫</div>
        <h3 class="empty-title">还没有收藏任何星座</h3>
        <p class="empty-desc">去首页选择你感兴趣的星座，点击心形按钮收藏起来吧！</p>
        <router-link to="/" class="go-home-btn btn btn-primary">
          <span class="btn-icon">🏠</span>
          <span>前往首页</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { constellations } from '@/data/constellations'
import { useAppStore } from '@/stores'
import { useToastStore } from '@/stores'

const router = useRouter()
const appStore = useAppStore()
const toastStore = useToastStore()

const compare1 = ref('')
const compare2 = ref('')

const favoritesList = computed(() => {
  return constellations.filter(c => appStore.isFavorite(c.id))
})

const canCompare = computed(() => {
  return compare1.value && compare2.value && compare1.value !== compare2.value
})

function goToDetail(id) {
  router.push(`/constellation/${id}`)
}

function removeFavorite(constellation) {
  appStore.removeFavorite(constellation.id)
  toastStore.warning(`已取消收藏 ${constellation.name}`)
}

function goToCompare() {
  router.push({
    path: '/compatibility',
    query: {
      c1: compare1.value,
      c2: compare2.value
    }
  })
}

function clearAll() {
  if (confirm('确定要清空所有收藏吗？')) {
    const count = appStore.favorites.length
    appStore.favorites.length = 0
    appStore.saveFavorites()
    toastStore.warning(`已清空 ${count} 个收藏`)
  }
}
</script>

<style scoped>
.favorites {
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

.favorites-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.favorite-card {
  position: relative;
  overflow: hidden;
  cursor: pointer;
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

.remove-btn {
  width: 28px;
  height: 28px;
  border: none;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.card-body {
  margin-bottom: 15px;
}

.card-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-date {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 10px;
}

.card-tags {
  display: flex;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-primary);
  border-radius: 20px;
  font-size: 12px;
}

.card-actions {
  display: flex;
  gap: 10px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.action-link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px;
  background: var(--bg-secondary);
  border-radius: 8px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.action-link * {
  color: var(--text-primary);
}

.action-link:hover {
  background: var(--accent-primary);
  color: white;
}

.link-icon {
  font-size: 16px;
}

.action-link span:last-child {
  font-size: 11px;
}

.compare-section {
  padding: 25px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.section-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.compare-select {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: end;
  margin-bottom: 20px;
}

.select-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.select-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
}

.select-input {
  padding: 12px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-primary);
  cursor: pointer;
}

.select-input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.vs-text {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent-primary);
  text-align: center;
}

.compare-btn {
  width: 100%;
  padding: 14px;
  font-size: 15px;
}

.compare-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions-bar {
  padding: 20px;
  display: flex;
  justify-content: center;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #ef4444;
  color: #ef4444;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #ef4444;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 30px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.empty-desc {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 30px;
}

.go-home-btn {
  padding: 12px 28px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .favorites {
    padding: 15px 0;
  }
  
  .page-title {
    font-size: 26px;
  }
  
  .favorites-grid {
    grid-template-columns: 1fr;
  }
  
  .compare-select {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .vs-text {
    text-align: center;
  }
}
</style>
