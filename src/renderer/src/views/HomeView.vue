<template>
  <main class="home-layout">
    <header class="home-header"><div class="home-brand"><span>JM</span> Electron</div><div class="user-actions"><el-tag type="info" effect="plain"><el-icon><UserFilled /></el-icon>{{ authStore.displayName }}</el-tag><el-button text @click="logout">退出</el-button></div></header>
    <section class="search-hero"><p class="eyebrow">HOME</p><h1>你好，{{ authStore.displayName }}</h1><p>从搜索开始，探索你需要的内容。</p><el-input v-model="searchQuery" class="search-input" size="large" placeholder="输入关键词开始搜索" @keyup.enter="runSearch"><template #prefix><el-icon><Search /></el-icon></template><template #append><el-button :icon="Search" @click="runSearch">搜索</el-button></template></el-input></section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Search, UserFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const searchQuery = ref('')
const runSearch = (): void => {
  const query = searchQuery.value.trim()
  if (!query) { ElMessage.warning('请输入搜索内容'); return }
  ElMessage.success(`已提交搜索：${query}`)
}
const logout = async (): Promise<void> => {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>
