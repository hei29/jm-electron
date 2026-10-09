<template>
  <main class="settings-layout">
    <header class="settings-header">
      <div class="settings-brand"><span>JM</span> Electron</div>
      <el-button text @click="backHome">返回主页</el-button>
    </header>

    <section class="settings-card">
      <h1>设置</h1>

      <el-form label-position="top">
        <el-form-item label="文件下载地址">
          <el-input v-model="downloadDirectory" size="large" placeholder="请输入或选择下载目录" />
        </el-form-item>
        <div class="directory-actions">
          <el-button @click="chooseDirectory">选择目录</el-button>
          <el-button type="primary" :loading="isSaving" @click="saveDirectory">保存设置</el-button>
        </div>
      </el-form>

      <el-divider />

      <div class="help-block">
        <div>
          <h2>帮助</h2>
          <p>查看项目源码、反馈问题或获取最新说明。</p>
        </div>
        <el-button @click="openProject">打开 Git 项目页面</el-button>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const downloadDirectory = ref('')
const isSaving = ref(false)

const loadSettings = async (): Promise<void> => {
  const settings = await window.settingsApi.getSettings()
  downloadDirectory.value = settings.downloadDirectory
}

const chooseDirectory = async (): Promise<void> => {
  const path = await window.settingsApi.chooseDownloadDirectory()
  if (path) {
    downloadDirectory.value = path
    ElMessage.success('已选择下载目录')
  }
}

const saveDirectory = async (): Promise<void> => {
  if (!downloadDirectory.value.trim()) {
    ElMessage.warning('下载目录不能为空')
    return
  }
  isSaving.value = true
  try {
    const settings = await window.settingsApi.setDownloadDirectory(downloadDirectory.value)
    downloadDirectory.value = settings.downloadDirectory
    ElMessage.success('设置已保存')
  } finally {
    isSaving.value = false
  }
}

const openProject = async (): Promise<void> => {
  await window.settingsApi.openProject()
}

const backHome = async (): Promise<void> => {
  await router.push({ name: 'home' })
}

onMounted(loadSettings)
</script>

<style scoped>
.settings-layout {
  min-height: 100vh;
  background: #f8fafc;
}

.settings-header {
  display: flex;
  height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 0 52px;
  border-bottom: 1px solid #e2e8f0;
  background: #fff;
}

.settings-brand {
  color: #0f172a;
  font-size: 18px;
  font-weight: 750;
}

.settings-brand span {
  display: inline-grid;
  width: 30px;
  height: 30px;
  place-items: center;
  margin-right: 8px;
  border-radius: 9px;
  color: #fff;
  background: #2563eb;
  font-size: 12px;
}

.settings-card {
  width: min(680px, calc(100% - 64px));
  margin: 48px auto 0;
  padding: 32px;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  background: #fff;
}

.settings-card h1 {
  margin: 0 0 28px;
  color: #0f172a;
  font-size: 28px;
}

.settings-card h2 {
  margin: 0 0 6px;
  color: #1e293b;
  font-size: 20px;
}

.settings-card p {
  margin: 0;
  color: #64748b;
}

.directory-actions {
  display: flex;
  gap: 12px;
}

.help-block {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
