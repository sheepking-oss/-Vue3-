<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-info">
        <p class="footer-text">✨ 星座运势 - 探索你的星空之旅</p>
        <p class="footer-copyright">© 2024 Horoscope App. All rights reserved.</p>
      </div>
      
      <div class="footer-links">
        <a href="#" class="footer-link" @click.prevent="share">
          <span class="footer-icon">📤</span>
          <span>分享</span>
        </a>
        <a href="#" class="footer-link" @click.prevent="toggleTheme">
          <span class="footer-icon">{{ appStore.isDark ? '☀️' : '🌙' }}</span>
          <span>主题</span>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useAppStore } from '@/stores'
import { useToastStore } from '@/stores'

const appStore = useAppStore()
const toastStore = useToastStore()

function toggleTheme() {
  appStore.toggleTheme()
}

function share() {
  if (navigator.share) {
    navigator.share({
      title: '星座运势',
      text: '探索你的星空之旅，查看今日运势',
      url: window.location.href
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toastStore.success('链接已复制到剪贴板')
    }).catch(() => {
      toastStore.info(window.location.href)
    })
  }
}
</script>

<style scoped>
.footer {
  margin-top: auto;
  background: var(--bg-card);
  border-top: 1px solid var(--border-color);
  padding: 20px 0;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.footer-text {
  color: var(--text-primary);
  font-size: 14px;
}

.footer-copyright {
  color: var(--text-secondary);
  font-size: 12px;
}

.footer-links {
  display: flex;
  gap: 20px;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: color 0.3s ease;
  cursor: pointer;
}

.footer-link:hover {
  color: var(--accent-primary);
}

.footer-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
  
  .footer-links {
    gap: 15px;
  }
}
</style>
