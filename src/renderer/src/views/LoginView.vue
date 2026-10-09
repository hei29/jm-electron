<template>
  <main class="auth-layout">
    <section class="brand-panel">
      <div class="brand-mark">JM</div>
      <p class="eyebrow">JM ELECTRON</p>
      <h1>轻松开始你的桌面工作流</h1>
      <p class="brand-copy">登录后继续使用，或以游客身份快速体验应用。</p>
    </section>
    <el-card class="auth-card" shadow="never">
      <div class="auth-heading">
        <h2>欢迎回来</h2>
        <p>请输入账号信息以继续。</p>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent="submit"
      >
        <el-form-item label="用户名" prop="username"
          ><el-input
            v-model="form.username"
            placeholder="请输入用户名"
            size="large"
            autocomplete="username"
        /></el-form-item>
        <el-form-item label="密码" prop="password"
          ><el-input
            v-model="form.password"
            type="password"
            placeholder="至少 6 个字符"
            size="large"
            show-password
            autocomplete="current-password"
        /></el-form-item>
        <el-button class="submit-button" type="primary" size="large" native-type="submit"
          >登录</el-button
        >
      </el-form>
      <el-divider>或</el-divider
      ><el-button class="guest-button" size="large" @click="enterAsGuest">以游客身份进入</el-button>
      <p class="auth-switch">还没有账号？<router-link to="/register">立即注册</router-link></p>
    </el-card>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const form = reactive({ username: '', password: '' })
const rules: FormRules<typeof form> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少需要 6 个字符', trigger: 'blur' }
  ]
}
const submit = async (): Promise<void> => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  authStore.login(form.username)
  ElMessage.success('登录成功，欢迎回来！')
  await router.push({ name: 'home' })
}
const enterAsGuest = async (): Promise<void> => {
  authStore.enterAsGuest()
  ElMessage.success('已以游客身份进入主页')
  await router.push({ name: 'home' })
}
</script>
