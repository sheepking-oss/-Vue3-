<template>
  <header class="header">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <span class="logo-icon">✨</span>
        <span class="logo-text gradient-text">星座运势</span>
      </router-link>
      
      <nav class="nav-menu" v-if="!isMobile">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
      
      <div class="header-actions">
        <button class="theme-toggle" @click="toggleTheme" :title="appStore.isDark ? '切换到浅色模式' : '切换到深色模式'">
          <span class="theme-icon">{{ appStore.isDark ? '🌙' : '☀️' }}</span>
        </button>
        
        <router-link to="/favorites" class="favorites-btn" title="我的收藏">
          <span class="favorites-icon">❤️</span>
          <span class="favorites-count" v-if="appStore.favorites.length > 0">{{ appStore.favorites.length }}</span>
        </router-link>
        
        <button class="mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobile">
          <span class="menu-icon">{{ mobileMenuOpen ? '✕' : '☰' }}</span>
        </button>
      </div>
    </div>
    
    <div class="mobile-nav" v-if="isMobile && mobileMenuOpen">
      <nav class="mobile-nav-menu">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path" 
          class="mobile-nav-item"
          :class="{ active: isActive(item.path) }"
          @click="mobileMenuOpen = false"
        >
          <span class="mobile-nav-icon">{{ item.icon }}</span>
          <span class="mobile-nav-label">{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'

const appStore = useAppStore()
const route = useRoute()
const router = useRouter()

const isMobile = ref(false)
const mobileMenuOpen = ref(false)

const navItems = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/compatibility', label: '星座配对', icon: '💕' },
  { path: '/lucky', label: '幸运指标', icon: '🍀' }
]

function isActive(path) {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

function toggleTheme() {
  appStore.toggleTheme()
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(20px);
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-icon {
  font-size: 28px;
  animation: float 3s ease-in-out infinite;
}

.logo-text {
  font-size: 22px;
  font-weight: 700;
}

.nav-menu {
  display: flex;
  gap: 5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--gradient-1);
  color: white;
}

.nav-icon {
  font-size: 18px;
}

.nav-label {
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.theme-toggle,
.favorites-btn,
.mobile-menu-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  background: var(--bg-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
}

.theme-toggle:hover,
.favorites-btn:hover,
.mobile-menu-btn:hover {
  background: var(--accent-primary);
  transform: scale(1.05);
}

.theme-icon,
.favorites-icon,
.menu-icon {
  font-size: 20px;
}

.favorites-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--accent-pink);
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mobile-nav {
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: 10px;
}

.mobile-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-radius: 12px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.3s ease;
}

.mobile-nav-item:hover {
  background: var(--bg-secondary);
}

.mobile-nav-item.active {
  background: var(--gradient-1);
  color: white;
}

.mobile-nav-icon {
  font-size: 22px;
}

.mobile-nav-label {
  font-size: 16px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 15px;
  }
  
  .logo-text {
    font-size: 18px;
  }
  
  .logo-icon {
    font-size: 24px;
  }
}
</style>
