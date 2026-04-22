import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '@/stores'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { keepAlive: true, title: '首页' }
  },
  {
    path: '/constellation/:id',
    name: 'ConstellationDetail',
    component: () => import('@/views/ConstellationDetail.vue'),
    meta: { title: '星座详情' }
  },
  {
    path: '/personality/:id',
    name: 'Personality',
    component: () => import('@/views/Personality.vue'),
    meta: { title: '性格分析' }
  },
  {
    path: '/compatibility',
    name: 'Compatibility',
    component: () => import('@/views/Compatibility.vue'),
    meta: { keepAlive: true, title: '星座配对' }
  },
  {
    path: '/lucky',
    name: 'Lucky',
    component: () => import('@/views/Lucky.vue'),
    meta: { keepAlive: true, title: '幸运指标' }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('@/views/Favorites.vue'),
    meta: { title: '我的收藏' }
  },
  {
    path: '/poster/:id',
    name: 'Poster',
    component: () => import('@/views/Poster.vue'),
    meta: { title: '生成海报' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 星座运势` : '星座运势'
  
  const appStore = useAppStore()
  if (to.meta.keepAlive) {
    appStore.addCachedPage(to.name)
  }
  
  next()
})

export default router
