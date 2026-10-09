<template>
  <main class="home-layout">
    <header class="home-header">
      <div class="home-brand"><span>JM</span> Electron</div>
      <div class="user-actions">
        <el-tag type="info" effect="plain">
          <el-icon><UserFilled /></el-icon>{{ authStore.displayName }}
        </el-tag>
        <el-button text @click="openSettings">设置</el-button>
        <el-button text @click="openProject">帮助</el-button>
        <el-button text @click="logout">退出</el-button>
      </div>
    </header>
    <section class="search-hero">
      <p class="eyebrow">HOME</p>
      <h1>你好，{{ authStore.displayName }}</h1>
      <p>输入本子 ID，使用本机 jmcomic 创建下载任务。</p>
      <el-input
        v-model="albumId"
        class="search-input"
        size="large"
        placeholder="输入数字本子 ID"
        @keyup.enter="downloadAlbum"
      >
        <template #prefix
          ><el-icon><Search /></el-icon>
        </template>
        <template #append>
          <el-button :icon="Search" :loading="isDownloading" @click="downloadAlbum">下载</el-button>
        </template>
      </el-input>
      <el-alert
        v-if="downloadOutput"
        class="download-result"
        :title="downloadOutput"
        :type="downloadSucceeded ? 'success' : 'error'"
        :closable="false"
        show-icon
      />
      <el-button class="open-directory-button" text type="primary" @click="openDownloadDirectory">
        打开下载目录
      </el-button>
    </section>
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
const albumId = ref('')
const isDownloading = ref(false)
const downloadOutput = ref('')
const downloadSucceeded = ref(false)

const downloadAlbum = async (): Promise<void> => {
  const id = albumId.value.trim()
  if (!/^\d+$/.test(id)) {
    ElMessage.warning('请输入仅包含数字的本子 ID')
    return
  }
  isDownloading.value = true
  downloadOutput.value = ''
  try {
    if (!window.jmcomicApi) {
      throw new Error('下载功能尚未加载。请完全退出并重新启动应用后重试。')
    }
    const result = await window.jmcomicApi.downloadJmcomicAlbum(id)
    downloadSucceeded.value = result.success
    downloadOutput.value = result.output
    if (result.success) ElMessage.success('下载任务已完成')
  } catch (error) {
    downloadSucceeded.value = false
    downloadOutput.value = error instanceof Error ? error.message : '下载任务启动失败。'
  } finally {
    isDownloading.value = false
  }
}

const openDownloadDirectory = async (): Promise<void> => {
  try {
    if (!window.jmcomicApi) {
      throw new Error('下载功能尚未加载。请完全退出并重新启动应用后重试。')
    }
    const error = await window.jmcomicApi.openDownloadDirectory()
    if (error) throw new Error(error)
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '无法打开下载目录。')
  }
}

const openSettings = async (): Promise<void> => {
  await router.push({ name: 'settings' })
}

const openProject = async (): Promise<void> => {
  await window.settingsApi.openProject()
}

const logout = async (): Promise<void> => {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<style scoped>
.download-result {
  margin-top: 20px;
  text-align: left;
  white-space: pre-wrap;
}

.open-directory-button {
  margin-top: 12px;
}
</style>
