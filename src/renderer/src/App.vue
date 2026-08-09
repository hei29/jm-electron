<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Search, UserFilled } from '@element-plus/icons-vue'

type AuthMode = 'login' | 'register'

const authMode = ref<AuthMode>('login')
const isAuthenticated = ref(false)
const displayName = ref('')
const searchQuery = ref('')
const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '', confirmPassword: '' })

const isRegister = computed(() => authMode.value === 'register')
const formTitle = computed(() => (isRegister.value ? '创建新账号' : '欢迎回来'))
const submitLabel = computed(() => (isRegister.value ? '注册并进入主页' : '登录'))

const rules: FormRules<typeof form> = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 24, message: '用户名长度为 3 到 24 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少需要 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    {
      validator: (_rule, value, callback) => {
        if (!value) callback(new Error('请再次输入密码'))
        else if (value !== form.password) callback(new Error('两次输入的密码不一致'))
        else callback()
      },
      trigger: 'blur'
    }
  ]
}

function switchMode(mode: string | number): void {
  authMode.value = mode === 'register' ? 'register' : 'login'
  form.confirmPassword = ''
  formRef.value?.clearValidate()
}

async function submitAuth(): Promise<void> {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  displayName.value = form.username
  isAuthenticated.value = true
  ElMessage.success(isRegister.value ? '注册成功，欢迎使用！' : '登录成功，欢迎回来！')
}

function enterAsGuest(): void {
  displayName.value = '游客'
  isAuthenticated.value = true
  ElMessage.success('已以游客身份进入主页')
}

function runSearch(): void {
  const query = searchQuery.value.trim()
  if (!query) {
    ElMessage.warning('请输入搜索内容')
    return
  }
  ElMessage.success(`已提交搜索：${query}`)
}

function logout(): void {
  isAuthenticated.value = false
  displayName.value = ''
  searchQuery.value = ''
  form.password = ''
  form.confirmPassword = ''
}
</script>

<template>
  <main class="app-shell">
    <section v-if="!isAuthenticated" class="auth-layout">
      <div class="brand-panel">
        <div class="brand-mark">JM</div>
        <p class="eyebrow">JM ELECTRON</p>
        <h1>轻松开始你的桌面工作流</h1>
        <p class="brand-copy">登录后继续使用，或以游客身份快速体验应用。</p>
      </div>

      <el-card class="auth-card" shadow="never">
        <el-tabs :model-value="authMode" stretch @tab-change="switchMode">
          <el-tab-pane label="登录" name="login" />
          <el-tab-pane label="注册" name="register" />
        </el-tabs>

        <div class="auth-heading">
          <h2>{{ formTitle }}</h2>
          <p>{{ isRegister ? '填写信息，创建你的账号。' : '请输入账号信息以继续。' }}</p>
        </div>

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top" @submit.prevent="submitAuth">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" size="large" autocomplete="username" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="至少 6 个字符" size="large" show-password autocomplete="current-password" />
          </el-form-item>
          <el-form-item v-if="isRegister" label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码" size="large" show-password autocomplete="new-password" />
          </el-form-item>
          <el-button class="submit-button" type="primary" size="large" native-type="submit">
            {{ submitLabel }}
          </el-button>
        </el-form>

        <el-divider>或</el-divider>
        <el-button class="guest-button" size="large" @click="enterAsGuest">以游客身份进入</el-button>
      </el-card>
    </section>

    <section v-else class="home-layout">
      <header class="home-header">
        <div class="home-brand"><span>JM</span> Electron</div>
        <div class="user-actions">
          <el-tag type="info" effect="plain"><el-icon><UserFilled /></el-icon>{{ displayName }}</el-tag>
          <el-button text @click="logout">退出</el-button>
        </div>
      </header>

      <div class="search-hero">
        <p class="eyebrow">HOME</p>
        <h1>你好，{{ displayName }}</h1>
        <p>从搜索开始，探索你需要的内容。</p>
        <el-input v-model="searchQuery" class="search-input" size="large" placeholder="输入关键词开始搜索" @keyup.enter="runSearch">
          <template #prefix><el-icon><Search /></el-icon></template>
          <template #append><el-button :icon="Search" @click="runSearch">搜索</el-button></template>
        </el-input>
      </div>
    </section>
  </main>
</template>
