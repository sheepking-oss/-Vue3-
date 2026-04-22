<template>
  <div class="app">
    <div class="stars-bg" v-if="appStore.isDark">
      <span v-for="i in 50" :key="i" class="star" :style="getStarStyle(i)"></span>
    </div>
    
    <Header />
    
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in">
          <keep-alive :include="cachedPageNames">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </main>
    
    <Footer />
    
    <ToastContainer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAppStore } from '@/stores'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import ToastContainer from '@/components/ToastContainer.vue'

const appStore = useAppStore()
const route = useRoute()

const transitionName = ref('fade')

const cachedPageNames = computed(() => {
  return Array.from(appStore.cachedPages)
})

watch(
  () => route.path,
  (to, from) => {
    const toDepth = to.split('/').filter(c => c).length
    const fromDepth = from.split('/').filter(c => c).length
    transitionName.value = toDepth > fromDepth ? 'fade' : 'slide-up'
  }
)

function getStarStyle(index) {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    opacity: Math.random() * 0.5 + 0.3
  }
}

onMounted(() => {
  appStore.applyTheme()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-content {
  flex: 1;
  padding-bottom: 80px;
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 100px;
  }
}
</style>
