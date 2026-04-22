import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const theme = ref(localStorage.getItem('theme') || 'dark')
  const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))
  const currentConstellation = ref(null)
  const cachedPages = ref(new Set())

  const isDark = computed(() => theme.value === 'dark')

  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', theme.value)
    applyTheme()
  }

  function applyTheme() {
    if (theme.value === 'dark') {
      document.documentElement.removeAttribute('data-theme')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }

  function addFavorite(constellationId) {
    if (!favorites.value.includes(constellationId)) {
      favorites.value.push(constellationId)
      saveFavorites()
    }
  }

  function removeFavorite(constellationId) {
    const index = favorites.value.indexOf(constellationId)
    if (index > -1) {
      favorites.value.splice(index, 1)
      saveFavorites()
    }
  }

  function toggleFavorite(constellationId) {
    if (isFavorite(constellationId)) {
      removeFavorite(constellationId)
    } else {
      addFavorite(constellationId)
    }
  }

  function isFavorite(constellationId) {
    return favorites.value.includes(constellationId)
  }

  function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites.value))
  }

  function setCurrentConstellation(constellation) {
    currentConstellation.value = constellation
  }

  function addCachedPage(pageName) {
    cachedPages.value.add(pageName)
  }

  function isPageCached(pageName) {
    return cachedPages.value.has(pageName)
  }

  function clearCache() {
    cachedPages.value.clear()
  }

  return {
    theme,
    favorites,
    currentConstellation,
    cachedPages,
    isDark,
    toggleTheme,
    applyTheme,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    setCurrentConstellation,
    addCachedPage,
    isPageCached,
    clearCache
  }
})

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])
  let nextId = 1

  function showToast(message, type = 'info', duration = 3000) {
    const id = nextId++
    toasts.value.push({ id, message, type })
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  function removeToast(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(message) {
    showToast(message, 'success')
  }

  function error(message) {
    showToast(message, 'error')
  }

  function warning(message) {
    showToast(message, 'warning')
  }

  function info(message) {
    showToast(message, 'info')
  }

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
})
